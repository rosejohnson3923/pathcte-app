-- ============================================
-- FIX: Allow submit_answer_securely to bypass score validation trigger
-- ============================================
-- The SECURITY DEFINER function needs to update scores, but the trigger
-- blocks it because auth.uid() still matches the player's user_id.
-- Solution: Use a session variable to indicate when we're in the secure function.
-- ============================================

-- Update the validation trigger to check for the bypass flag
CREATE OR REPLACE FUNCTION validate_game_player_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if we're being called from a secure game service function
  -- These functions set a session variable to bypass the validation
  IF current_setting('app.bypass_player_validation', true) = 'true' THEN
    RETURN NEW;
  END IF;

  -- Only allow updating is_connected and left_at
  -- All other fields must remain unchanged

  IF OLD.game_session_id IS DISTINCT FROM NEW.game_session_id THEN
    RAISE EXCEPTION 'Cannot modify game_session_id';
  END IF;

  IF OLD.user_id IS DISTINCT FROM NEW.user_id THEN
    RAISE EXCEPTION 'Cannot modify user_id';
  END IF;

  IF OLD.display_name IS DISTINCT FROM NEW.display_name THEN
    RAISE EXCEPTION 'Cannot modify display_name';
  END IF;

  IF OLD.score IS DISTINCT FROM NEW.score THEN
    RAISE EXCEPTION 'Cannot modify score - use game service functions';
  END IF;

  IF OLD.correct_answers IS DISTINCT FROM NEW.correct_answers THEN
    RAISE EXCEPTION 'Cannot modify correct_answers - use game service functions';
  END IF;

  IF OLD.total_answers IS DISTINCT FROM NEW.total_answers THEN
    RAISE EXCEPTION 'Cannot modify total_answers - use game service functions';
  END IF;

  IF OLD.placement IS DISTINCT FROM NEW.placement THEN
    RAISE EXCEPTION 'Cannot modify placement - use game service functions';
  END IF;

  IF OLD.tokens_earned IS DISTINCT FROM NEW.tokens_earned THEN
    RAISE EXCEPTION 'Cannot modify tokens_earned - use game service functions';
  END IF;

  IF OLD.pathkeys_earned IS DISTINCT FROM NEW.pathkeys_earned THEN
    RAISE EXCEPTION 'Cannot modify pathkeys_earned - use game service functions';
  END IF;

  IF OLD.joined_at IS DISTINCT FROM NEW.joined_at THEN
    RAISE EXCEPTION 'Cannot modify joined_at';
  END IF;

  -- is_connected and left_at are allowed to change
  -- These are the only fields players should update

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update submit_answer_securely to set the bypass flag
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
  v_is_correct BOOLEAN;
  v_points_earned INTEGER := 0;
  v_time_limit_ms INTEGER;
  v_speed_bonus INTEGER := 0;
  v_answer_id UUID;
BEGIN
  -- Set bypass flag so trigger allows score updates
  PERFORM set_config('app.bypass_player_validation', 'true', true);

  -- Verify player exists and belongs to this game
  SELECT * INTO v_player
  FROM game_players
  WHERE id = p_player_id AND game_session_id = p_game_session_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Player not found in this game session';
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

  -- Calculate points
  IF v_is_correct THEN
    v_points_earned := v_question.points;

    -- Speed bonus (capped at 50% of base points)
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

  -- Update player score (trigger will allow because bypass flag is set)
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

-- Add comments
COMMENT ON FUNCTION validate_game_player_update() IS
'Security: Enforces that players can only update is_connected and left_at. Allows bypass for secure game service functions.';

COMMENT ON FUNCTION submit_answer_securely IS
'Securely submit an answer and update player score. Runs with elevated privileges and bypasses player validation trigger.';
