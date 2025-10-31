-- ============================================
-- FIX INFINITE RECURSION IN GAME_PLAYERS RLS
-- ============================================
-- Fixes circular reference between game_players and game_sessions policies
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop the problematic policies
DROP POLICY IF EXISTS "Game players viewable by session participants" ON public.game_players;
DROP POLICY IF EXISTS "Game sessions viewable by players" ON public.game_sessions;

-- Recreate game_players SELECT policy WITHOUT recursion
-- Allow viewing if you're either:
-- 1. The player (your user_id matches)
-- 2. The host of the game session
-- 3. Any authenticated user (game data is public during active games)
CREATE POLICY "Game players viewable during games"
  ON public.game_players FOR SELECT
  TO authenticated
  USING (
    -- Players can see their own record
    auth.uid() = user_id OR
    -- Hosts can see all players in their sessions
    EXISTS (
      SELECT 1 FROM public.game_sessions gs
      WHERE gs.id = game_session_id
      AND gs.host_id = auth.uid()
    ) OR
    -- All authenticated users can see active game players (for leaderboard, etc.)
    EXISTS (
      SELECT 1 FROM public.game_sessions gs
      WHERE gs.id = game_session_id
      AND gs.status IN ('waiting', 'in_progress')
    )
  );

-- Recreate game_sessions SELECT policy WITHOUT recursion
-- Allow viewing if you're either:
-- 1. The host
-- 2. In an active/public game (no need to check game_players table)
CREATE POLICY "Game sessions viewable by host and active players"
  ON public.game_sessions FOR SELECT
  TO authenticated
  USING (
    -- Hosts can see their own sessions
    auth.uid() = host_id OR
    -- Public active games are viewable by all
    (is_public = true AND status IN ('waiting', 'in_progress'))
  );

-- Add a simpler policy for completed games that authenticated users can view
CREATE POLICY "Completed game sessions viewable by all authenticated"
  ON public.game_sessions FOR SELECT
  TO authenticated
  USING (
    status = 'completed'
  );

-- Verify policies were created
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('game_players', 'game_sessions')
ORDER BY tablename, policyname;
