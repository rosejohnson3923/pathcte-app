-- Migration: Create database functions
-- Description: Utility functions for game logic and data management

-- ============================================================================
-- FUNCTION: Generate Game Code
-- ============================================================================
CREATE OR REPLACE FUNCTION generate_game_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_game_code() IS 'Generate a random 6-character game code';

-- ============================================================================
-- FUNCTION: Award Pathkey to User
-- ============================================================================
CREATE OR REPLACE FUNCTION award_pathkey(
  p_user_id UUID,
  p_pathkey_id UUID
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.user_pathkeys (user_id, pathkey_id, quantity)
  VALUES (p_user_id, p_pathkey_id, 1)
  ON CONFLICT (user_id, pathkey_id)
  DO UPDATE SET
    quantity = public.user_pathkeys.quantity + 1,
    acquired_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION award_pathkey(UUID, UUID) IS 'Award a pathkey to a user, incrementing quantity if already owned';

-- ============================================================================
-- FUNCTION: Award Tokens to User
-- ============================================================================
CREATE OR REPLACE FUNCTION award_tokens(
  p_user_id UUID,
  p_amount INTEGER
)
RETURNS void AS $$
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Token amount must be positive';
  END IF;

  UPDATE public.profiles
  SET
    tokens = tokens + p_amount,
    updated_at = NOW()
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found: %', p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION award_tokens(UUID, INTEGER) IS 'Award tokens to a user';

-- ============================================================================
-- FUNCTION: Spend Tokens
-- ============================================================================
CREATE OR REPLACE FUNCTION spend_tokens(
  p_user_id UUID,
  p_amount INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  current_tokens INTEGER;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Token amount must be positive';
  END IF;

  -- Get current token balance with row lock
  SELECT tokens INTO current_tokens
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found: %', p_user_id;
  END IF;

  -- Check if user has enough tokens
  IF current_tokens < p_amount THEN
    RETURN FALSE;
  END IF;

  -- Deduct tokens
  UPDATE public.profiles
  SET
    tokens = tokens - p_amount,
    updated_at = NOW()
  WHERE id = p_user_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION spend_tokens(UUID, INTEGER) IS 'Spend tokens from user balance, returns false if insufficient';

-- ============================================================================
-- FUNCTION: Calculate Player Placement
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_player_placement(
  p_game_session_id UUID
)
RETURNS void AS $$
BEGIN
  WITH ranked_players AS (
    SELECT
      id,
      ROW_NUMBER() OVER (
        ORDER BY score DESC, correct_answers DESC, joined_at ASC
      ) as rank
    FROM public.game_players
    WHERE game_session_id = p_game_session_id
  )
  UPDATE public.game_players gp
  SET placement = rp.rank
  FROM ranked_players rp
  WHERE gp.id = rp.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION calculate_player_placement(UUID) IS 'Calculate and update player placements for a game session';

-- ============================================================================
-- FUNCTION: Update Question Set Stats
-- ============================================================================
CREATE OR REPLACE FUNCTION update_question_set_stats(
  p_question_set_id UUID,
  p_score DECIMAL
)
RETURNS void AS $$
DECLARE
  current_times_played INTEGER;
  current_avg DECIMAL;
  new_avg DECIMAL;
BEGIN
  SELECT times_played, average_score
  INTO current_times_played, current_avg
  FROM public.question_sets
  WHERE id = p_question_set_id;

  -- Calculate new average
  IF current_times_played = 0 OR current_avg IS NULL THEN
    new_avg := p_score;
  ELSE
    new_avg := ((current_avg * current_times_played) + p_score) / (current_times_played + 1);
  END IF;

  UPDATE public.question_sets
  SET
    times_played = times_played + 1,
    average_score = new_avg,
    updated_at = NOW()
  WHERE id = p_question_set_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION update_question_set_stats(UUID, DECIMAL) IS 'Update question set statistics after a game';

-- ============================================================================
-- FUNCTION: Check Purchase Limit
-- ============================================================================
CREATE OR REPLACE FUNCTION check_purchase_limit(
  p_user_id UUID,
  p_market_item_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  item_limit INTEGER;
  purchase_count INTEGER;
BEGIN
  -- Get purchase limit for item
  SELECT purchase_limit INTO item_limit
  FROM public.market_items
  WHERE id = p_market_item_id;

  -- NULL means unlimited
  IF item_limit IS NULL THEN
    RETURN TRUE;
  END IF;

  -- Count existing purchases
  SELECT COUNT(*) INTO purchase_count
  FROM public.user_purchases
  WHERE user_id = p_user_id AND market_item_id = p_market_item_id;

  RETURN purchase_count < item_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION check_purchase_limit(UUID, UUID) IS 'Check if user can purchase item based on purchase limit';
