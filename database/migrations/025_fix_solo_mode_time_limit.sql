-- ============================================
-- FIX: Allow flexible timing in solo mode
-- ============================================
-- Solo mode is for practice, so students should be able to
-- submit answers even if they take longer than the time limit
-- Multiplayer mode keeps strict timing to prevent cheating
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
  v_session RECORD;
  v_is_correct BOOLEAN;
  v_points_earned INTEGER := 0;
  v_time_limit_ms INTEGER;
  v_speed_bonus INTEGER := 0;
  v_answer_id UUID;
BEGIN
  -- Verify player exists and belongs to this game
  SELECT * INTO v_player
  FROM game_players
  WHERE id = p_player_id AND game_session_id = p_game_session_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Player not found in this game session';
  END IF;

  -- Get game session details (to check if solo or multiplayer)
  SELECT * INTO v_session
  FROM game_sessions
  WHERE id = p_game_session_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Game session not found';
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

  -- Minimum time check (prevent instant submissions)
  IF p_time_taken_ms < 100 THEN
    RAISE EXCEPTION 'Invalid timing: answer too fast (minimum 100ms)';
  END IF;

  -- Maximum time check
  -- Solo mode: Allow unlimited time (students control their own pace)
  -- Multiplayer mode: Strict 5-second grace period
  IF v_session.session_type = 'multiplayer' AND p_time_taken_ms > v_time_limit_ms + 5000 THEN
    RAISE EXCEPTION 'Invalid timing: answer too slow';
  END IF;

  -- Check if answer is correct
  v_is_correct := (v_question.options->p_selected_option_index->>'is_correct')::BOOLEAN;

  -- Calculate points
  IF v_is_correct THEN
    v_points_earned := v_question.points;

    -- Speed bonus (capped at 50% of base points)
    -- Only apply speed bonus if answered within time limit
    IF p_time_taken_ms <= v_time_limit_ms THEN
      DECLARE
        v_time_remaining INTEGER;
        v_speed_bonus_percent NUMERIC;
      BEGIN
        v_time_remaining := GREATEST(0, v_time_limit_ms - p_time_taken_ms);
        v_speed_bonus_percent := LEAST(0.5, v_time_remaining::NUMERIC / v_time_limit_ms);
        v_speed_bonus := FLOOR(v_speed_bonus_percent * v_question.points * 0.5);
        v_points_earned := v_points_earned + v_speed_bonus;
      END;
    END IF;
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

  -- Update player score (bypasses RLS trigger because SECURITY DEFINER)
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
'Securely submit an answer and update player score. Solo mode allows flexible timing for practice. Multiplayer mode enforces strict time limits.';
