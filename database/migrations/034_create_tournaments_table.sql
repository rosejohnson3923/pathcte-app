-- Migration 034: Create tournaments table for multi-classroom tournament mode
-- This allows a tournament coordinator to host school-wide competitions
-- with multiple classrooms participating simultaneously

CREATE TABLE IF NOT EXISTS tournaments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Unique 6-character tournament code (like game_code)
    tournament_code TEXT NOT NULL UNIQUE,

    -- Tournament coordinator (usually a teacher or admin)
    coordinator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    -- Tournament details
    title TEXT NOT NULL,
    description TEXT,
    question_set_id UUID NOT NULL REFERENCES question_sets(id),

    -- Tournament status
    status TEXT NOT NULL DEFAULT 'setup'
        CHECK (status IN ('setup', 'waiting', 'in_progress', 'completed', 'cancelled')),

    -- Limits
    max_classrooms INTEGER DEFAULT 20 CHECK (max_classrooms > 0 AND max_classrooms <= 100),
    max_players_per_classroom INTEGER DEFAULT 60 CHECK (max_players_per_classroom > 0),

    -- Tournament control settings
    start_mode TEXT NOT NULL DEFAULT 'independent'
        CHECK (start_mode IN ('independent', 'coordinated')),
    -- independent: Each classroom starts their own game
    -- coordinated: Tournament host starts all classrooms simultaneously

    progression_mode TEXT NOT NULL DEFAULT 'manual'
        CHECK (progression_mode IN ('auto', 'manual')),
    -- Applies to all classrooms if start_mode is 'coordinated'

    allow_late_join BOOLEAN DEFAULT false,
    -- Cascades to all participating classrooms

    -- Additional settings (shared across all classrooms)
    settings JSONB DEFAULT '{}'::jsonb,

    -- Timing
    scheduled_start_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,

    -- Optional metadata
    school_name TEXT,
    grade_levels INTEGER[],
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tournaments_coordinator ON tournaments(coordinator_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_code ON tournaments(tournament_code);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_question_set ON tournaments(question_set_id);

-- Function to generate unique tournament codes
CREATE OR REPLACE FUNCTION generate_tournament_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Excludes similar-looking characters
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_tournaments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tournaments_updated_at ON tournaments;
CREATE TRIGGER tournaments_updated_at
    BEFORE UPDATE ON tournaments
    FOR EACH ROW
    EXECUTE FUNCTION update_tournaments_updated_at();

-- RLS Policies
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

-- Coordinator can do everything with their tournaments
DROP POLICY IF EXISTS tournaments_coordinator_all ON tournaments;
CREATE POLICY tournaments_coordinator_all
    ON tournaments
    FOR ALL
    USING (coordinator_id = auth.uid())
    WITH CHECK (coordinator_id = auth.uid());

-- Teachers can create tournaments
DROP POLICY IF EXISTS tournaments_teachers_insert ON tournaments;
CREATE POLICY tournaments_teachers_insert
    ON tournaments
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND user_type = 'teacher'
        )
    );

-- Note: tournaments_participants_select policy created in migration 035
-- after tournament_id column is added to game_sessions

COMMENT ON TABLE tournaments IS 'Tournament mode: Multi-classroom competition system';
COMMENT ON COLUMN tournaments.start_mode IS 'independent: Each room starts own game | coordinated: Host starts all rooms';
COMMENT ON COLUMN tournaments.progression_mode IS 'auto: Timer-based advancement | manual: Host clicks next (applies to coordinated start)';
COMMENT ON COLUMN tournaments.allow_late_join IS 'If false, late joining disabled for all participating classrooms';
