-- ============================================
-- Fix Circular Dependency Between game_sessions and game_players RLS
-- ============================================
-- Issue: game_sessions SELECT policy references game_players,
-- and game_players SELECT policies reference game_sessions,
-- creating infinite recursion during INSERT operations
--
-- Solution: Simplify the cross-table references to avoid the cycle
-- ============================================

-- Create helper function to check if user is a player WITHOUT triggering RLS recursion
-- This function runs with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION public.is_user_in_game(game_id UUID, user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.game_players
    WHERE game_session_id = game_id AND game_players.user_id = is_user_in_game.user_id
  );
END;
$$;

-- Drop the circular game_sessions SELECT policy
DROP POLICY IF EXISTS "Users can view hosted, joined, or public games" ON public.game_sessions;

-- Recreate game_sessions SELECT policy using the helper function to avoid recursion
-- Users can view sessions if:
-- 1. They are the host
-- 2. It's a public game in waiting/in_progress status
-- 3. They are a player in the game (checked via helper function)
-- 4. The game is completed (for viewing results)
CREATE POLICY "Users can view hosted, joined, or public games"
ON public.game_sessions
FOR SELECT
TO authenticated
USING (
  -- Own hosted sessions
  auth.uid() = host_id
  OR
  -- Public active games
  (is_public = true AND status IN ('waiting', 'in_progress'))
  OR
  -- Games where user is a player (uses function to avoid recursion)
  is_user_in_game(id, auth.uid())
  OR
  -- Completed games (for viewing results)
  status = 'completed'
);

-- Drop duplicate/overlapping SELECT policies on game_sessions
DROP POLICY IF EXISTS "game_sessions_select_completed" ON public.game_sessions;
DROP POLICY IF EXISTS "game_sessions_select_host" ON public.game_sessions;
DROP POLICY IF EXISTS "game_sessions_select_public" ON public.game_sessions;

-- Keep game_players policies as they are (they're fine for viewing player records)
-- The key is that game_sessions no longer queries game_players in its SELECT policy

-- Verify no circular references remain
SELECT
  'game_sessions' as table_name,
  policyname,
  cmd,
  CASE
    WHEN (qual LIKE '%game_players%' OR with_check LIKE '%game_players%') THEN '⚠️ References game_players'
    ELSE '✓ OK'
  END as check_result
FROM pg_policies
WHERE tablename = 'game_sessions'
UNION ALL
SELECT
  'game_players' as table_name,
  policyname,
  cmd,
  CASE
    WHEN (qual LIKE '%game_sessions%' OR with_check LIKE '%game_sessions%') THEN 'ℹ️ References game_sessions (OK for game_players)'
    ELSE '✓ OK'
  END as check_result
FROM pg_policies
WHERE tablename = 'game_players'
ORDER BY table_name, cmd, policyname;
