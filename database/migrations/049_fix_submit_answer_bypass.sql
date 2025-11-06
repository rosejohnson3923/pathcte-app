-- ============================================
-- HOTFIX: Restore bypass flag in submit_answer_securely
-- ============================================
-- Migration 047 accidentally removed the bypass flag that allows
-- the function to update player scores. This restores it.
-- ============================================

CREATE OR REPLACE FUNCTION submit_answer_securely(
  p_player_id UUID,
  p_game_session_id UUID,
  p_question_id UUID,
  p_selected_option_index INTEGER,
  p_time_taken_ms INTEGER
) RETURNS TABLE (
  answer_id UUID,
  is_correct BOOLEAN,
  points_earned INTEGER
) AS $$
DECLARE
  v_question RECORD;
  v_player RECORD;
  v_game_session RECORD;
  v_scoring RECORD;
  v_is_correct BOOLEAN;
  v_points_earned INTEGER := 0;
  v_time_limit_ms INTEGER;
  v_speed_bonus INTEGER := 0;
  v_answer_id UUID;
BEGIN
  -- CRITICAL: Set bypass flag so trigger allows score updates
  PERFORM set_config('app.bypass_player_validation', 'true', true);

  -- Verify player exists and belongs to this game
  SELECT * INTO v_player
  FROM game_players
  WHERE id = p_player_id AND game_session_id = p_game_session_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Player not found in this game session';
  END IF;

  -- Get game session details
  SELECT * INTO v_game_session
  FROM game_sessions
  WHERE id = p_game_session_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Game session not found';
  END IF;

  -- Get scoring configuration for this game mode
  SELECT * INTO v_scoring
  FROM game_mode_scoring
  WHERE game_mode = v_game_session.game_mode;

  -- Use default values if no config found
  IF NOT FOUND THEN
    v_scoring.correct_points := 25;
    v_scoring.incorrect_penalty := -10;
  END IF;

  -- Check for duplicate answer
  IF EXISTS (
    SELECT 1 FROM game_answers
    WHERE player_id = p_player_id AND question_id = p_question_id
  ) THEN
    RAISE EXCEPTION 'Answer already submitted for this question';
  END IF;

  -- Get question details
  SELECT * INTO v_question
  FROM questions
  WHERE id = p_question_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Question not found';
  END IF;

  -- Validate timing
  v_time_limit_ms := v_question.time_limit_seconds * 1000;

  IF p_time_taken_ms < 100 THEN
    RAISE EXCEPTION 'Invalid timing: answer too fast (minimum 100ms)';
  END IF;

  IF p_time_taken_ms > v_time_limit_ms + 5000 THEN
    RAISE EXCEPTION 'Invalid timing: answer too slow';
  END IF;

  -- Check if answer is correct
  v_is_correct := (v_question.options->p_selected_option_index->>'is_correct')::BOOLEAN;

  -- Calculate points using configured values
  IF v_is_correct THEN
    v_points_earned := v_scoring.correct_points;

    -- Speed bonus (up to 50% of base points)
    DECLARE
      v_time_remaining INTEGER;
      v_speed_bonus_percent NUMERIC;
    BEGIN
      v_time_remaining := GREATEST(0, v_time_limit_ms - p_time_taken_ms);
      v_speed_bonus_percent := LEAST(0.5, v_time_remaining::NUMERIC / v_time_limit_ms);
      v_speed_bonus := FLOOR(v_speed_bonus_percent * v_scoring.correct_points * 0.5);
      v_points_earned := v_points_earned + v_speed_bonus;
    END;
  ELSE
    -- Apply incorrect answer penalty (0 disables penalty)
    v_points_earned := v_scoring.incorrect_penalty;
  END IF;

  -- Insert answer record
  INSERT INTO game_answers (
    game_session_id,
    player_id,
    question_id,
    selected_option_index,
    is_correct,
    time_taken_ms,
    points_earned
  ) VALUES (
    p_game_session_id,
    p_player_id,
    p_question_id,
    p_selected_option_index,
    v_is_correct,
    p_time_taken_ms,
    v_points_earned
  ) RETURNING id INTO v_answer_id;

  -- Update player score (bypasses RLS trigger because bypass flag is set)
  UPDATE game_players
  SET
    score = score + v_points_earned,
    correct_answers = correct_answers + (CASE WHEN v_is_correct THEN 1 ELSE 0 END),
    total_answers = total_answers + 1
  WHERE id = p_player_id;

  -- Return result
  RETURN QUERY SELECT v_answer_id, v_is_correct, v_points_earned;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION submit_answer_securely TO authenticated;

-- Add comment
COMMENT ON FUNCTION submit_answer_securely IS
'Securely submit an answer and update player score. Uses configurable scoring from game_mode_scoring table. Runs with elevated privileges and bypasses player validation trigger.';

-- ============================================
-- ALSO FIX: apply_no_answer_penalty
-- ============================================
-- This function also updates scores and needs the bypass flag
-- ============================================

CREATE OR REPLACE FUNCTION apply_no_answer_penalty(
  p_game_session_id UUID,
  p_question_id UUID
) RETURNS TABLE (
  player_id UUID,
  penalty_applied INTEGER
) AS $$
DECLARE
  v_game_session RECORD;
  v_scoring RECORD;
  v_penalty INTEGER;
  v_player RECORD;
BEGIN
  -- CRITICAL: Set bypass flag so trigger allows score updates
  PERFORM set_config('app.bypass_player_validation', 'true', true);

  -- Get game session details
  SELECT * INTO v_game_session
  FROM game_sessions
  WHERE id = p_game_session_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Game session not found';
  END IF;

  -- Get scoring configuration for this game mode
  SELECT * INTO v_scoring
  FROM game_mode_scoring
  WHERE game_mode = v_game_session.game_mode;

  -- Use default penalty if no config found
  IF NOT FOUND THEN
    v_penalty := -10;
  ELSE
    v_penalty := v_scoring.no_answer_penalty;
  END IF;

  -- If penalty is 0, skip applying penalties (disabled)
  IF v_penalty = 0 THEN
    RETURN;
  END IF;

  -- Find all players who haven't answered this question
  FOR v_player IN
    SELECT gp.id, gp.score
    FROM game_players gp
    WHERE gp.game_session_id = p_game_session_id
      AND gp.is_connected = true
      AND NOT EXISTS (
        SELECT 1
        FROM game_answers ga
        WHERE ga.player_id = gp.id
          AND ga.question_id = p_question_id
      )
  LOOP
    -- Apply penalty to each player
    UPDATE game_players
    SET
      score = score + v_penalty,
      total_answers = total_answers + 1
    WHERE id = v_player.id;

    -- Insert a record in game_answers to mark the question as "answered" (with no answer)
    INSERT INTO game_answers (
      game_session_id,
      player_id,
      question_id,
      selected_option_index,
      is_correct,
      time_taken_ms,
      points_earned
    ) VALUES (
      p_game_session_id,
      v_player.id,
      p_question_id,
      NULL, -- No answer selected
      false,
      0, -- No time taken (timed out)
      v_penalty
    );

    -- Return the result
    RETURN QUERY SELECT v_player.id, v_penalty;
  END LOOP;

  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION apply_no_answer_penalty TO authenticated;

COMMENT ON FUNCTION apply_no_answer_penalty IS
'Applies configurable penalty to all players who did not submit an answer before timeout. Works for all game modes. Set penalty to 0 in game_mode_scoring to disable. Called when advancing to the next question in auto mode.';
