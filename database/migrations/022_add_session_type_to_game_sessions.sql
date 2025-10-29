-- Migration 022: Add session_type to game_sessions
-- Purpose: Distinguish between solo student practice and teacher-hosted multiplayer games
-- Following Blooket model: teachers host multiplayer, students play solo

-- Add session_type column with enum type (create type only if it doesn't exist)
DO $$ BEGIN
  CREATE TYPE session_type AS ENUM ('solo', 'multiplayer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add column only if it doesn't exist
DO $$ BEGIN
  ALTER TABLE game_sessions
  ADD COLUMN session_type session_type NOT NULL DEFAULT 'multiplayer';
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

-- Update existing games:
-- Games with max_players = 1 are likely solo games
UPDATE game_sessions
SET session_type = 'solo'
WHERE max_players = 1;

-- Add index for faster queries filtering by session type (drop if exists first)
DROP INDEX IF EXISTS idx_game_sessions_session_type;
CREATE INDEX idx_game_sessions_session_type ON game_sessions(session_type);

-- Add helpful comment
COMMENT ON COLUMN game_sessions.session_type IS 'Solo = student self-paced practice (shows Next Question button). Multiplayer = teacher-hosted game (teacher controls progression).';
