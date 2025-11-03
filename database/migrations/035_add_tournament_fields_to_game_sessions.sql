-- Migration 035: Add tournament fields to game_sessions
-- Allows game sessions to be part of a tournament
-- Each game session represents one classroom in the tournament

-- Add tournament_id foreign key
ALTER TABLE game_sessions
ADD COLUMN IF NOT EXISTS tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE;

-- Add classroom_name for tournament identification
ALTER TABLE game_sessions
ADD COLUMN IF NOT EXISTS classroom_name TEXT;

-- Add constraint: classroom_name required if tournament_id is set
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'game_sessions_tournament_classroom_name_check'
    ) THEN
        ALTER TABLE game_sessions
        ADD CONSTRAINT game_sessions_tournament_classroom_name_check
            CHECK (
                (tournament_id IS NULL)
                OR (tournament_id IS NOT NULL AND classroom_name IS NOT NULL AND classroom_name <> '')
            );
    END IF;
END $$;

-- Add unique constraint: one classroom name per tournament
CREATE UNIQUE INDEX IF NOT EXISTS idx_game_sessions_tournament_classroom
    ON game_sessions(tournament_id, classroom_name)
    WHERE tournament_id IS NOT NULL;

-- Index for finding all classrooms in a tournament
CREATE INDEX IF NOT EXISTS idx_game_sessions_tournament_id
    ON game_sessions(tournament_id)
    WHERE tournament_id IS NOT NULL;

-- Update RLS policies to handle tournament context
-- Allow users to see game sessions if they're in the tournament
DROP POLICY IF EXISTS game_sessions_select ON game_sessions;
CREATE POLICY game_sessions_select
    ON game_sessions
    FOR SELECT
    USING (
        -- Original conditions
        host_id = auth.uid()
        OR id IN (
            SELECT game_session_id
            FROM game_players
            WHERE user_id = auth.uid()
        )
        -- New: Can see if part of same tournament
        OR tournament_id IN (
            SELECT DISTINCT gs.tournament_id
            FROM game_sessions gs
            JOIN game_players gp ON gp.game_session_id = gs.id
            WHERE gp.user_id = auth.uid()
            AND gs.tournament_id IS NOT NULL
        )
    );

COMMENT ON COLUMN game_sessions.tournament_id IS 'If set, this game session is part of a tournament';
COMMENT ON COLUMN game_sessions.classroom_name IS 'Display name for this classroom within the tournament (e.g., "Mr. Smith''s Math Class")';

-- Add tournaments policy for participants (now that tournament_id column exists)
-- Authenticated users can view tournaments they're participating in
DROP POLICY IF EXISTS tournaments_participants_select ON tournaments;
CREATE POLICY tournaments_participants_select
    ON tournaments
    FOR SELECT
    USING (
        id IN (
            SELECT DISTINCT gs.tournament_id
            FROM game_sessions gs
            JOIN game_players gp ON gp.game_session_id = gs.id
            WHERE gp.user_id = auth.uid()
            AND gs.tournament_id IS NOT NULL
        )
    );
