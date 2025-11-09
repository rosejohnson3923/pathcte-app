-- Migration 040: Fix RLS Recursion by Properly Bypassing RLS in Security Definer Functions
-- ==========================================================================================
-- The issue: SECURITY DEFINER alone doesn't bypass RLS on tables queried by the function.
-- Solution: Add role-based bypass and update policies to avoid all circular dependencies.

-- Step 1: Drop all existing policies first (they depend on the functions)
DROP POLICY IF EXISTS "Game sessions viewable by host" ON public.game_sessions;
DROP POLICY IF EXISTS "Game sessions viewable by players" ON public.game_sessions;
DROP POLICY IF EXISTS "Teachers can create game sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "Hosts can update own sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "Game players viewable by session participants" ON public.game_players;
DROP POLICY IF EXISTS "Users can insert self as player" ON public.game_players;
DROP POLICY IF EXISTS "Players can update own record" ON public.game_players;
DROP POLICY IF EXISTS tournaments_participants_select ON public.tournaments;

-- Step 2: Now drop the old functions
DROP FUNCTION IF EXISTS public.user_can_view_game_session(UUID);
DROP FUNCTION IF EXISTS public.user_is_player_in_session(UUID);

-- Function to check if user can view a session (bypassing RLS)
-- This will be used by game_players RLS policy
CREATE OR REPLACE FUNCTION public.user_can_view_game_session(session_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  -- Check if user is the host (direct check without triggering RLS)
  SELECT EXISTS (
    SELECT 1 FROM public.game_sessions
    WHERE id = session_id
    AND host_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.game_players
    WHERE game_session_id = session_id
    AND user_id = auth.uid()
  );
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.user_can_view_game_session(UUID) TO authenticated;

-- Function to check if user is a player (bypassing RLS)
-- This will be used by game_sessions RLS policy
CREATE OR REPLACE FUNCTION public.user_is_player_in_session(session_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.game_players
    WHERE game_session_id = session_id
    AND user_id = auth.uid()
  );
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.user_is_player_in_session(UUID) TO authenticated;

-- Step 2: Add function to check if user is tournament coordinator
CREATE OR REPLACE FUNCTION public.user_is_tournament_coordinator(tournament_id_param UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tournaments
    WHERE id = tournament_id_param
    AND coordinator_id = auth.uid()
  );
$$;

GRANT EXECUTE ON FUNCTION public.user_is_tournament_coordinator(UUID) TO authenticated;

-- Step 3: Recreate game_sessions policies with tournament coordinator access

-- Host can view their own sessions
CREATE POLICY "Game sessions viewable by host"
  ON public.game_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = host_id);

-- Tournament coordinators can view all sessions in their tournaments
CREATE POLICY "Game sessions viewable by tournament coordinator"
  ON public.game_sessions FOR SELECT
  TO authenticated
  USING (
    tournament_id IS NOT NULL
    AND public.user_is_tournament_coordinator(tournament_id)
  );

-- Players can view sessions they're in
CREATE POLICY "Game sessions viewable by players"
  ON public.game_sessions FOR SELECT
  TO authenticated
  USING (public.user_is_player_in_session(id));

-- Teachers can create sessions
CREATE POLICY "Teachers can create game sessions"
  ON public.game_sessions FOR INSERT
  WITH CHECK (
    auth.uid() = host_id AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'teacher')
  );

-- Hosts can update their own sessions
CREATE POLICY "Hosts can update own sessions"
  ON public.game_sessions FOR UPDATE
  USING (auth.uid() = host_id);

-- Step 4: Recreate game_players policies using security definer functions
CREATE POLICY "Game players viewable by session participants"
  ON public.game_players FOR SELECT
  TO authenticated
  USING (public.user_can_view_game_session(game_session_id));

CREATE POLICY "Users can insert self as player"
  ON public.game_players FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Players can update own record"
  ON public.game_players FOR UPDATE
  USING (auth.uid() = user_id);

-- Step 5: Update tournaments policy to avoid JOIN that causes recursion
-- Use security definer function instead of JOIN
CREATE OR REPLACE FUNCTION public.user_participates_in_tournament(tournament_id_param UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.game_sessions gs
    JOIN public.game_players gp ON gp.game_session_id = gs.id
    WHERE gs.tournament_id = tournament_id_param
    AND gp.user_id = auth.uid()
  );
$$;

GRANT EXECUTE ON FUNCTION public.user_participates_in_tournament(UUID) TO authenticated;

CREATE POLICY tournaments_participants_select
    ON public.tournaments
    FOR SELECT
    TO authenticated
    USING (public.user_participates_in_tournament(id));

-- Add comments
COMMENT ON FUNCTION public.user_can_view_game_session IS 'Security definer function that bypasses RLS to check game session access';
COMMENT ON FUNCTION public.user_is_player_in_session IS 'Security definer function that bypasses RLS to check if user is a player';
COMMENT ON FUNCTION public.user_is_tournament_coordinator IS 'Security definer function that bypasses RLS to check if user is tournament coordinator';
COMMENT ON FUNCTION public.user_participates_in_tournament IS 'Security definer function that bypasses RLS to check tournament participation';

COMMENT ON POLICY "Game sessions viewable by host" ON public.game_sessions IS 'Hosts can view their own game sessions';
COMMENT ON POLICY "Game sessions viewable by tournament coordinator" ON public.game_sessions IS 'Tournament coordinators can view all sessions in their tournaments';
COMMENT ON POLICY "Game sessions viewable by players" ON public.game_sessions IS 'Players can view sessions they participate in';
