-- Migration 039: Fix Bidirectional RLS Recursion
-- ================================================
-- This migration creates security definer functions for BOTH directions
-- to completely eliminate the circular RLS dependency between game_sessions
-- and game_players.

-- Function 1: Check if user can view a game session (already exists from 037/038)
-- This bypasses RLS when checking game_sessions and game_players
CREATE OR REPLACE FUNCTION public.user_can_view_game_session(session_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  -- Check if user is the host OR a player in the session
  -- SECURITY DEFINER means this bypasses RLS
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

-- Function 2: Check if user is a player in a session
-- This also bypasses RLS to prevent recursion
CREATE OR REPLACE FUNCTION public.user_is_player_in_session(session_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  -- SECURITY DEFINER means this bypasses RLS on game_players
  RETURN EXISTS (
    SELECT 1 FROM public.game_players
    WHERE game_session_id = session_id
    AND user_id = auth.uid()
  );
END;
$$;

-- Drop existing policies to ensure clean slate
DROP POLICY IF EXISTS "Game sessions viewable by host" ON public.game_sessions;
DROP POLICY IF EXISTS "Game sessions viewable by players" ON public.game_sessions;
DROP POLICY IF EXISTS "Teachers can create game sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "Hosts can update own sessions" ON public.game_sessions;

DROP POLICY IF EXISTS "Game players viewable by session participants" ON public.game_players;
DROP POLICY IF EXISTS "Users can insert self as player" ON public.game_players;
DROP POLICY IF EXISTS "Players can update own record" ON public.game_players;

-- Recreate game_sessions policies using security definer function
-- This prevents direct queries to game_players table
CREATE POLICY "Game sessions viewable by host"
  ON public.game_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = host_id);

CREATE POLICY "Game sessions viewable by players"
  ON public.game_sessions FOR SELECT
  TO authenticated
  USING (public.user_is_player_in_session(id));
  -- ^ Uses security definer function instead of direct game_players query

CREATE POLICY "Teachers can create game sessions"
  ON public.game_sessions FOR INSERT
  WITH CHECK (
    auth.uid() = host_id AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'teacher')
  );

CREATE POLICY "Hosts can update own sessions"
  ON public.game_sessions FOR UPDATE
  USING (auth.uid() = host_id);

-- Recreate game_players policies using security definer function
CREATE POLICY "Game players viewable by session participants"
  ON public.game_players FOR SELECT
  TO authenticated
  USING (public.user_can_view_game_session(game_session_id));
  -- ^ Uses security definer function instead of direct game_sessions query

CREATE POLICY "Users can insert self as player"
  ON public.game_players FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Players can update own record"
  ON public.game_players FOR UPDATE
  USING (auth.uid() = user_id);

-- Add comments
COMMENT ON FUNCTION public.user_can_view_game_session IS 'Security definer function to check game session access without RLS recursion';
COMMENT ON FUNCTION public.user_is_player_in_session IS 'Security definer function to check if user is a player in a session without RLS recursion';
COMMENT ON POLICY "Game sessions viewable by host" ON public.game_sessions IS 'Hosts can view their own game sessions';
COMMENT ON POLICY "Game sessions viewable by players" ON public.game_sessions IS 'Players can view game sessions they are in - uses security definer function';
COMMENT ON POLICY "Game players viewable by session participants" ON public.game_players IS 'Uses security definer function to avoid RLS recursion';
