-- Migration 044: Fix Infinite Recursion in Game RLS Policies
-- Purpose: Remove circular dependencies between game_sessions and game_players policies

-- ============================================================================
-- GAME SESSIONS POLICIES
-- ============================================================================

-- Drop all existing game_sessions SELECT policies (they have circular dependencies)
DROP POLICY IF EXISTS "Completed game sessions viewable by all authenticated" ON game_sessions;
DROP POLICY IF EXISTS "game_sessions_host_select" ON game_sessions;
DROP POLICY IF EXISTS "game_sessions_player_select" ON game_sessions;
DROP POLICY IF EXISTS "game_sessions_public_view" ON game_sessions;
DROP POLICY IF EXISTS "game_sessions_select" ON game_sessions;

-- Create clean, non-recursive SELECT policies for game_sessions
CREATE POLICY game_sessions_select_host
  ON game_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = host_id);

CREATE POLICY game_sessions_select_public
  ON game_sessions
  FOR SELECT
  TO authenticated
  USING (is_public = true AND status IN ('waiting', 'in_progress'));

CREATE POLICY game_sessions_select_completed
  ON game_sessions
  FOR SELECT
  TO authenticated
  USING (status = 'completed');

COMMENT ON POLICY game_sessions_select_host ON game_sessions IS
'Allows hosts to view their own game sessions';

COMMENT ON POLICY game_sessions_select_public ON game_sessions IS
'Allows any authenticated user to view public games that are joinable';

COMMENT ON POLICY game_sessions_select_completed ON game_sessions IS
'Allows any authenticated user to view completed games';

-- Keep existing UPDATE and INSERT policies (they don't cause recursion)
-- game_sessions_host_update - already exists
-- game_sessions_teacher_insert - already exists
-- Users can create appropriate game sessions - already exists

-- ============================================================================
-- GAME PLAYERS POLICIES
-- ============================================================================

-- Drop existing game_players SELECT policies (they have circular dependencies)
DROP POLICY IF EXISTS "Game players viewable during games" ON game_players;
DROP POLICY IF EXISTS "game_players_host_select" ON game_players;
DROP POLICY IF EXISTS "game_players_participant_select" ON game_players;

-- Create clean, non-recursive SELECT policies for game_players
CREATE POLICY game_players_select_self
  ON game_players
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY game_players_select_as_host
  ON game_players
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM game_sessions
      WHERE game_sessions.id = game_players.game_session_id
        AND game_sessions.host_id = auth.uid()
    )
  );

CREATE POLICY game_players_select_public_games
  ON game_players
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM game_sessions
      WHERE game_sessions.id = game_players.game_session_id
        AND game_sessions.is_public = true
        AND game_sessions.status IN ('waiting', 'in_progress')
    )
  );

COMMENT ON POLICY game_players_select_self ON game_players IS
'Allows users to view their own player records';

COMMENT ON POLICY game_players_select_as_host ON game_players IS
'Allows game hosts to view all players in their games';

COMMENT ON POLICY game_players_select_public_games ON game_players IS
'Allows viewing players in public, active games';

-- Keep existing UPDATE and INSERT policies
-- Players can update own connection status - already exists
-- game_players_self_insert - already exists
-- game_players_self_update - already exists
