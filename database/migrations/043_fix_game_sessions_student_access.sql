-- Migration 043: Fix Game Sessions Student Access
-- Purpose: Allow students to view public games to join them

-- Drop potentially problematic policies
DROP POLICY IF EXISTS "Game sessions viewable by host and active players" ON game_sessions;

-- Create a cleaner policy for public game viewing
CREATE POLICY game_sessions_public_view
  ON game_sessions
  FOR SELECT
  TO authenticated
  USING (
    -- Allow viewing if game is public and joinable
    (is_public = true AND status IN ('waiting', 'in_progress'))
  );

COMMENT ON POLICY game_sessions_public_view ON game_sessions IS
'Allows any authenticated user to view public games that are waiting or in progress, so they can join';
