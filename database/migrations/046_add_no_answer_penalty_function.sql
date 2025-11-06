-- ============================================
-- DATABASE FUNCTION: Apply No Answer Penalty
-- ============================================
-- Applies -10 point penalty to players who didn't answer
-- a question in Lightning! Path mode
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
  v_is_lightning_mode BOOLEAN;
  v_penalty INTEGER := -10;
  v_player RECORD;
BEGIN
  -- Get game session details to check game mode
  SELECT * INTO v_game_session
  FROM game_sessions
  WHERE id = p_game_session_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Game session not found';
  END IF;

  -- Only apply penalty for Lightning! Path mode
  v_is_lightning_mode := (v_game_session.game_mode = 'speed_run');

  IF NOT v_is_lightning_mode THEN
    -- Not Lightning! Path mode, return empty result
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION apply_no_answer_penalty TO authenticated;

-- Add comment
COMMENT ON FUNCTION apply_no_answer_penalty IS
'Applies -10 point penalty to all players who did not submit an answer before timeout in Lightning! Path mode. Called when advancing to the next question in auto mode.';
