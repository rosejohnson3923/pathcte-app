-- Migration 037: Fix circular RLS recursion between game_sessions and game_players
-- ===============================================================================
-- Problem: game_players RLS policy queries game_sessions, and game_sessions RLS
-- policy queries game_players, creating infinite recursion when both tables are
-- accessed in the same query (e.g., tournament coordinator viewing classrooms).
--
-- Solution: Rewrite the game_players policy to check permissions directly without
-- going through game_sessions RLS by using a security definer function.

-- Drop the existing policy that causes recursion
DROP POLICY IF EXISTS "Game players viewable by session participants" ON public.game_players;

-- Create a security definer function to check game session access without triggering RLS
CREATE OR REPLACE FUNCTION public.user_can_view_game_session(session_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  -- Check if user is the host OR a player in the session
  RETURN EXISTS (
    SELECT 1 FROM public.game_sessions
    WHERE id = session_id
    AND host_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.game_players
    WHERE game_session_id = session_id
    AND user_id = auth.uid()
  );
END;
$$;

-- Create new policy using the security definer function
-- This avoids RLS recursion because the function bypasses RLS
CREATE POLICY "Game players viewable by session participants"
  ON public.game_players FOR SELECT
  TO authenticated
  USING (public.user_can_view_game_session(game_session_id));

-- Add comment
COMMENT ON FUNCTION public.user_can_view_game_session IS 'Security definer function to check game session access without RLS recursion';
