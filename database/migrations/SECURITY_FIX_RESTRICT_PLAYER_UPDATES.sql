-- ============================================
-- SECURITY FIX: RESTRICT PLAYER UPDATE PERMISSIONS
-- ============================================
-- Prevents players from modifying their own scores, tokens, or placement
-- Only allows updating connection status (is_connected, left_at)
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop existing overly-permissive update policies
DROP POLICY IF EXISTS "Players can update own record" ON public.game_players;
DROP POLICY IF EXISTS "Users can update self as player" ON public.game_players;

-- APPROACH: Use a database trigger to enforce field-level restrictions
-- This is more reliable than RLS WITH CHECK clause

-- First, create a function to validate updates
CREATE OR REPLACE FUNCTION validate_game_player_update()
RETURNS TRIGGER AS $$
BEGIN
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

-- Create trigger that fires BEFORE update for authenticated users
CREATE TRIGGER enforce_game_player_update_restrictions
  BEFORE UPDATE ON public.game_players
  FOR EACH ROW
  WHEN (auth.uid() = OLD.user_id)  -- Only for player's own record
  EXECUTE FUNCTION validate_game_player_update();

-- Still need RLS policy to allow updates (trigger will enforce restrictions)
CREATE POLICY "Players can update own connection status"
  ON public.game_players FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add comment
COMMENT ON FUNCTION validate_game_player_update()
IS 'Security: Enforces that players can only update is_connected and left_at. All game stats are server-controlled.';

-- Verify trigger was created
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'game_players'
AND trigger_name = 'enforce_game_player_update_restrictions';

-- Verify policy was created
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'game_players'
AND cmd = 'UPDATE'
ORDER BY policyname;
