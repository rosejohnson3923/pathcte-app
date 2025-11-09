-- Migration 041: Simplify RLS - Move Coordinator Logic to Azure
-- ================================================================
-- Strategy: Keep RLS simple for participants only
-- Tournament coordinator operations will use Azure Functions with service role

-- Step 1: Drop all existing policies and security definer functions
DROP POLICY IF EXISTS "Game sessions viewable by host" ON public.game_sessions;
DROP POLICY IF EXISTS "Game sessions viewable by players" ON public.game_sessions;
DROP POLICY IF EXISTS "Game sessions viewable by tournament coordinator" ON public.game_sessions;
DROP POLICY IF EXISTS "Teachers can create game sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "Hosts can update own sessions" ON public.game_sessions;

DROP POLICY IF EXISTS "Game players viewable by session participants" ON public.game_players;
DROP POLICY IF EXISTS "Users can insert self as player" ON public.game_players;
DROP POLICY IF EXISTS "Players can update own record" ON public.game_players;

DROP POLICY IF EXISTS tournaments_coordinator_all ON public.tournaments;
DROP POLICY IF EXISTS tournaments_teachers_insert ON public.tournaments;
DROP POLICY IF EXISTS tournaments_participants_select ON public.tournaments;

-- Drop security definer functions (no longer needed)
DROP FUNCTION IF EXISTS public.user_can_view_game_session(UUID);
DROP FUNCTION IF EXISTS public.user_is_player_in_session(UUID);
DROP FUNCTION IF EXISTS public.user_is_tournament_coordinator(UUID);
DROP FUNCTION IF EXISTS public.user_participates_in_tournament(UUID);

-- Step 2: Create simple, non-recursive RLS policies

-- === GAME_SESSIONS POLICIES ===
-- Hosts can view their own sessions
CREATE POLICY "game_sessions_host_select"
  ON public.game_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = host_id);

-- Players can view sessions they're participating in (simple EXISTS check)
CREATE POLICY "game_sessions_player_select"
  ON public.game_sessions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.game_players
      WHERE game_session_id = game_sessions.id
      AND user_id = auth.uid()
    )
  );

-- Teachers can create sessions
CREATE POLICY "game_sessions_teacher_insert"
  ON public.game_sessions FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = host_id AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'teacher')
  );

-- Hosts can update their own sessions
CREATE POLICY "game_sessions_host_update"
  ON public.game_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_id);

-- === GAME_PLAYERS POLICIES ===
-- Users can view players in sessions they host
CREATE POLICY "game_players_host_select"
  ON public.game_players FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.game_sessions
      WHERE id = game_session_id
      AND host_id = auth.uid()
    )
  );

-- Users can view players in sessions they're in (including themselves)
CREATE POLICY "game_players_participant_select"
  ON public.game_players FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert themselves as players
CREATE POLICY "game_players_self_insert"
  ON public.game_players FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can update their own player records
CREATE POLICY "game_players_self_update"
  ON public.game_players FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- === TOURNAMENTS POLICIES ===
-- Coordinators can view/update their tournaments
CREATE POLICY "tournaments_coordinator_all"
  ON public.tournaments FOR ALL
  TO authenticated
  USING (auth.uid() = coordinator_id);

-- Teachers can create tournaments
CREATE POLICY "tournaments_teacher_insert"
  ON public.tournaments FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = coordinator_id AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'teacher')
  );

-- Note: Tournament participants will view tournament data via Azure Functions
-- which use service role (bypasses RLS entirely)

-- Add comments
COMMENT ON POLICY "game_sessions_host_select" ON public.game_sessions
  IS 'Hosts can view their own sessions';
COMMENT ON POLICY "game_sessions_player_select" ON public.game_sessions
  IS 'Players can view sessions they participate in';
COMMENT ON POLICY "game_players_host_select" ON public.game_players
  IS 'Hosts can view players in their sessions';
COMMENT ON POLICY "game_players_participant_select" ON public.game_players
  IS 'Players can view themselves in any session';
COMMENT ON POLICY "tournaments_coordinator_all" ON public.tournaments
  IS 'Coordinators have full access to their tournaments';
