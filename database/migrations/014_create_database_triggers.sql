-- Migration: Create database triggers
-- Description: Automated triggers for data consistency and auditing

-- ============================================================================
-- TRIGGER FUNCTION: Update Updated_At Timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at() IS 'Automatically update updated_at timestamp';

-- Apply to all tables with updated_at column
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_careers_updated_at
  BEFORE UPDATE ON public.careers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_pathkeys_updated_at
  BEFORE UPDATE ON public.pathkeys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_question_sets_updated_at
  BEFORE UPDATE ON public.question_sets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_game_sessions_updated_at
  BEFORE UPDATE ON public.game_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_market_items_updated_at
  BEFORE UPDATE ON public.market_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- TRIGGER FUNCTION: Validate Question Options
-- ============================================================================
CREATE OR REPLACE FUNCTION validate_question_options()
RETURNS TRIGGER AS $$
DECLARE
  has_correct_answer BOOLEAN;
BEGIN
  -- Check if at least one option is marked as correct
  SELECT EXISTS (
    SELECT 1 FROM jsonb_array_elements(NEW.options) opt
    WHERE (opt->>'is_correct')::boolean = true
  ) INTO has_correct_answer;

  IF NOT has_correct_answer THEN
    RAISE EXCEPTION 'Question must have at least one correct answer';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION validate_question_options() IS 'Ensure questions have at least one correct answer';

CREATE TRIGGER validate_question_options_on_insert
  BEFORE INSERT ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION validate_question_options();

CREATE TRIGGER validate_question_options_on_update
  BEFORE UPDATE ON public.questions
  FOR EACH ROW
  WHEN (OLD.options IS DISTINCT FROM NEW.options)
  EXECUTE FUNCTION validate_question_options();

-- ============================================================================
-- TRIGGER FUNCTION: Update Question Set Count
-- ============================================================================
CREATE OR REPLACE FUNCTION update_question_set_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.question_sets
    SET
      total_questions = total_questions + 1,
      updated_at = NOW()
    WHERE id = NEW.question_set_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.question_sets
    SET
      total_questions = GREATEST(total_questions - 1, 0),
      updated_at = NOW()
    WHERE id = OLD.question_set_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_question_set_count() IS 'Maintain accurate question count in question sets';

CREATE TRIGGER update_question_count_on_insert
  AFTER INSERT ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION update_question_set_count();

CREATE TRIGGER update_question_count_on_delete
  AFTER DELETE ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION update_question_set_count();

-- ============================================================================
-- TRIGGER FUNCTION: Update Game Session Player Count
-- ============================================================================
CREATE OR REPLACE FUNCTION update_game_session_player_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.game_sessions
    SET
      total_players = total_players + 1,
      updated_at = NOW()
    WHERE id = NEW.game_session_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.game_sessions
    SET
      total_players = GREATEST(total_players - 1, 0),
      updated_at = NOW()
    WHERE id = OLD.game_session_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_game_session_player_count() IS 'Maintain accurate player count in game sessions';

CREATE TRIGGER update_player_count_on_insert
  AFTER INSERT ON public.game_players
  FOR EACH ROW
  EXECUTE FUNCTION update_game_session_player_count();

CREATE TRIGGER update_player_count_on_delete
  AFTER DELETE ON public.game_players
  FOR EACH ROW
  EXECUTE FUNCTION update_game_session_player_count();

-- ============================================================================
-- TRIGGER FUNCTION: Create Profile on User Signup
-- ============================================================================
CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, user_type, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION create_profile_for_new_user() IS 'Automatically create profile when user signs up';

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_new_user();

-- ============================================================================
-- TRIGGER FUNCTION: Validate Game Session Status Transitions
-- ============================================================================
CREATE OR REPLACE FUNCTION validate_game_session_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure valid status transitions
  IF OLD.status = 'completed' AND NEW.status != 'completed' THEN
    RAISE EXCEPTION 'Cannot change status of completed game session';
  END IF;

  IF OLD.status = 'cancelled' AND NEW.status != 'cancelled' THEN
    RAISE EXCEPTION 'Cannot change status of cancelled game session';
  END IF;

  -- Set timestamps based on status
  IF NEW.status = 'in_progress' AND OLD.status = 'waiting' THEN
    NEW.started_at = NOW();
  END IF;

  IF NEW.status IN ('completed', 'cancelled') AND OLD.status = 'in_progress' THEN
    NEW.ended_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION validate_game_session_status() IS 'Validate game session status transitions and set timestamps';

CREATE TRIGGER validate_game_status_on_update
  BEFORE UPDATE ON public.game_sessions
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION validate_game_session_status();

-- ============================================================================
-- TRIGGER FUNCTION: Award Pathkeys After Game
-- ============================================================================
CREATE OR REPLACE FUNCTION award_game_rewards()
RETURNS TRIGGER AS $$
DECLARE
  pathkey_id UUID;
BEGIN
  -- Only process when game is marked as completed
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Award tokens to all players
    UPDATE public.profiles p
    SET tokens = tokens + gp.tokens_earned
    FROM public.game_players gp
    WHERE gp.game_session_id = NEW.id
      AND gp.user_id = p.id
      AND gp.tokens_earned > 0;

    -- Award pathkeys to players
    FOR pathkey_id IN
      SELECT DISTINCT unnest(pathkeys_earned)
      FROM public.game_players
      WHERE game_session_id = NEW.id
        AND user_id IS NOT NULL
    LOOP
      -- Award to each player who earned it
      PERFORM award_pathkey(gp.user_id, pathkey_id)
      FROM public.game_players gp
      WHERE gp.game_session_id = NEW.id
        AND gp.user_id IS NOT NULL
        AND pathkey_id = ANY(gp.pathkeys_earned);
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION award_game_rewards() IS 'Award tokens and pathkeys when game completes';

CREATE TRIGGER award_rewards_on_game_complete
  AFTER UPDATE ON public.game_sessions
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
  EXECUTE FUNCTION award_game_rewards();
