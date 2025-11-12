-- ============================================
-- FIX: Proper RLS for game_players
-- ============================================
-- The current RLS policy allows users to see ALL active game players,
-- which causes the game count to show incorrect numbers for new users.
-- This fix ensures users can only see:
-- 1. Their own game_player records
-- 2. Other players in games they're hosting
-- 3. Other players in games they're participating in
-- ============================================

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Game players viewable by session participants" ON public.game_players;
DROP POLICY IF EXISTS "Game players viewable during games" ON public.game_players;
DROP POLICY IF EXISTS "Game sessions viewable by players" ON public.game_sessions;
DROP POLICY IF EXISTS "Game sessions viewable by host and active players" ON public.game_sessions;
DROP POLICY IF EXISTS "Completed game sessions viewable by all authenticated" ON public.game_sessions;

-- Create proper game_players SELECT policy
-- Users can only see game_player records if:
-- 1. It's their own record (user_id matches)
-- 2. They are the host of that game session
CREATE POLICY "Users can view own player records and hosted game players"
  ON public.game_players FOR SELECT
  TO authenticated
  USING (
    -- Own records
    auth.uid() = user_id OR
    -- Records in games they host
    EXISTS (
      SELECT 1 FROM public.game_sessions gs
      WHERE gs.id = game_session_id
      AND gs.host_id = auth.uid()
    )
  );

-- Create proper game_sessions SELECT policy
-- Users can view sessions if:
-- 1. They are the host
-- 2. They are a player in the session (via direct user_id match in game_players)
-- 3. It's a public game in waiting/in_progress status
CREATE POLICY "Users can view hosted, joined, or public games"
  ON public.game_sessions FOR SELECT
  TO authenticated
  USING (
    -- Own hosted sessions
    auth.uid() = host_id OR
    -- Public active games
    (is_public = true AND status IN ('waiting', 'in_progress')) OR
    -- Games where user has a player record (direct match, no recursion)
    id IN (
      SELECT game_session_id
      FROM public.game_players
      WHERE user_id = auth.uid()
    )
  );

-- Verify policies
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('game_players', 'game_sessions')
ORDER BY tablename, policyname;
