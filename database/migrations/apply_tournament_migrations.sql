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


-- ============================================================================
-- Migration 035: Add tournament fields to game_sessions
-- ============================================================================

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


-- ============================================================================
-- Migration 036: Create tournament functions
-- ============================================================================

-- Migration 036: Create tournament functions and views
-- Functions for tournament management and aggregate leaderboards

-- ============================================================================
-- VIEW: Tournament Players Aggregate
-- ============================================================================
-- Aggregates player scores across all classrooms in a tournament
CREATE OR REPLACE VIEW tournament_players_aggregate AS
SELECT
    gs.tournament_id,
    gp.user_id,
    gp.display_name,
    gs.classroom_name,
    gs.id as game_session_id,
    gp.id as player_id,
    -- Aggregate scores (in tournament, each player is in one classroom)
    gp.score as total_score,
    gp.correct_answers as total_correct,
    gp.total_answers as total_answers,
    gp.tokens_earned,
    gp.pathkeys_earned,
    gp.placement as classroom_placement,
    gp.joined_at,
    gp.is_connected
FROM game_players gp
JOIN game_sessions gs ON gp.game_session_id = gs.id
WHERE gs.tournament_id IS NOT NULL;

COMMENT ON VIEW tournament_players_aggregate IS 'Aggregated player data for tournament leaderboards';

-- ============================================================================
-- FUNCTION: Create Tournament
-- ============================================================================
CREATE OR REPLACE FUNCTION create_tournament(
    p_coordinator_id UUID,
    p_title TEXT,
    p_description TEXT,
    p_question_set_id UUID,
    p_start_mode TEXT DEFAULT 'independent',
    p_progression_mode TEXT DEFAULT 'manual',
    p_allow_late_join BOOLEAN DEFAULT false,
    p_max_classrooms INTEGER DEFAULT 20,
    p_max_players_per_classroom INTEGER DEFAULT 60,
    p_school_name TEXT DEFAULT NULL,
    p_settings JSONB DEFAULT '{}'
)
RETURNS tournaments
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_tournament_code TEXT;
    v_tournament tournaments;
    v_attempts INTEGER := 0;
BEGIN
    -- Verify coordinator is a teacher
    IF NOT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = p_coordinator_id
        AND user_type = 'teacher'
    ) THEN
        RAISE EXCEPTION 'Only teachers can create tournaments';
    END IF;

    -- Verify question set exists
    IF NOT EXISTS (SELECT 1 FROM question_sets WHERE id = p_question_set_id) THEN
        RAISE EXCEPTION 'Question set does not exist';
    END IF;

    -- Generate unique tournament code
    LOOP
        v_tournament_code := generate_tournament_code();
        v_attempts := v_attempts + 1;

        BEGIN
            INSERT INTO tournaments (
                tournament_code,
                coordinator_id,
                title,
                description,
                question_set_id,
                status,
                start_mode,
                progression_mode,
                allow_late_join,
                max_classrooms,
                max_players_per_classroom,
                school_name,
                settings
            ) VALUES (
                v_tournament_code,
                p_coordinator_id,
                p_title,
                p_description,
                p_question_set_id,
                'setup',
                p_start_mode,
                p_progression_mode,
                p_allow_late_join,
                p_max_classrooms,
                p_max_players_per_classroom,
                p_school_name,
                p_settings
            )
            RETURNING * INTO v_tournament;

            EXIT; -- Success, exit loop
        EXCEPTION WHEN unique_violation THEN
            IF v_attempts >= 10 THEN
                RAISE EXCEPTION 'Failed to generate unique tournament code after 10 attempts';
            END IF;
            -- Try again with new code
        END;
    END LOOP;

    RETURN v_tournament;
END;
$$;

-- ============================================================================
-- FUNCTION: Join Tournament as Classroom
-- ============================================================================
CREATE OR REPLACE FUNCTION join_tournament_as_classroom(
    p_tournament_code TEXT,
    p_host_id UUID,
    p_classroom_name TEXT
)
RETURNS game_sessions
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_tournament tournaments;
    v_game_session game_sessions;
    v_game_code TEXT;
    v_classroom_count INTEGER;
    v_attempts INTEGER := 0;
BEGIN
    -- Verify host is a teacher
    IF NOT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = p_host_id
        AND user_type = 'teacher'
    ) THEN
        RAISE EXCEPTION 'Only teachers can join tournaments as classroom hosts';
    END IF;

    -- Get tournament
    SELECT * INTO v_tournament
    FROM tournaments
    WHERE tournament_code = UPPER(p_tournament_code);

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Tournament not found';
    END IF;

    -- Check tournament status
    IF v_tournament.status NOT IN ('setup', 'waiting') THEN
        RAISE EXCEPTION 'Tournament has already started or ended';
    END IF;

    -- Check classroom limit
    SELECT COUNT(*) INTO v_classroom_count
    FROM game_sessions
    WHERE tournament_id = v_tournament.id;

    IF v_classroom_count >= v_tournament.max_classrooms THEN
        RAISE EXCEPTION 'Tournament is full (max % classrooms)', v_tournament.max_classrooms;
    END IF;

    -- Check for duplicate classroom name
    IF EXISTS (
        SELECT 1 FROM game_sessions
        WHERE tournament_id = v_tournament.id
        AND classroom_name = p_classroom_name
    ) THEN
        RAISE EXCEPTION 'Classroom name already taken in this tournament';
    END IF;

    -- Generate unique game code for this classroom
    LOOP
        v_game_code := (
            SELECT string_agg(
                substr('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', (random() * 32 + 1)::integer, 1),
                ''
            )
            FROM generate_series(1, 6)
        );
        v_attempts := v_attempts + 1;

        BEGIN
            -- Create game session for this classroom
            INSERT INTO game_sessions (
                game_code,
                host_id,
                question_set_id,
                tournament_id,
                classroom_name,
                game_mode,
                session_type,
                status,
                max_players,
                allow_late_join,
                settings
            ) VALUES (
                v_game_code,
                p_host_id,
                v_tournament.question_set_id,
                v_tournament.id,
                p_classroom_name,
                'tournament',  -- New game mode
                'multiplayer',
                'waiting',  -- Start in waiting status
                v_tournament.max_players_per_classroom,
                v_tournament.allow_late_join,
                v_tournament.settings
            )
            RETURNING * INTO v_game_session;

            EXIT; -- Success
        EXCEPTION WHEN unique_violation THEN
            IF v_attempts >= 10 THEN
                RAISE EXCEPTION 'Failed to generate unique game code after 10 attempts';
            END IF;
        END;
    END LOOP;

    -- Update tournament status to 'waiting' if still in 'setup'
    IF v_tournament.status = 'setup' THEN
        UPDATE tournaments
        SET status = 'waiting'
        WHERE id = v_tournament.id;
    END IF;

    RETURN v_game_session;
END;
$$;

-- ============================================================================
-- FUNCTION: Start Tournament (Coordinated Mode)
-- ============================================================================
CREATE OR REPLACE FUNCTION start_tournament(
    p_tournament_id UUID,
    p_coordinator_id UUID
)
RETURNS tournaments
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_tournament tournaments;
    v_classroom_count INTEGER;
BEGIN
    -- Get and lock tournament
    SELECT * INTO v_tournament
    FROM tournaments
    WHERE id = p_tournament_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Tournament not found';
    END IF;

    -- Verify coordinator
    IF v_tournament.coordinator_id != p_coordinator_id THEN
        RAISE EXCEPTION 'Only the tournament coordinator can start the tournament';
    END IF;

    -- Check status
    IF v_tournament.status != 'waiting' THEN
        RAISE EXCEPTION 'Tournament must be in waiting status to start';
    END IF;

    -- Check if there are classrooms
    SELECT COUNT(*) INTO v_classroom_count
    FROM game_sessions
    WHERE tournament_id = p_tournament_id;

    IF v_classroom_count = 0 THEN
        RAISE EXCEPTION 'Cannot start tournament with no classrooms';
    END IF;

    -- Only start all classrooms if start_mode is 'coordinated'
    IF v_tournament.start_mode = 'coordinated' THEN
        -- Start all classroom game sessions simultaneously
        UPDATE game_sessions
        SET
            status = 'in_progress',
            started_at = NOW()
        WHERE tournament_id = p_tournament_id
        AND status = 'waiting';
    END IF;

    -- Update tournament status
    UPDATE tournaments
    SET
        status = 'in_progress',
        started_at = NOW()
    WHERE id = p_tournament_id
    RETURNING * INTO v_tournament;

    RETURN v_tournament;
END;
$$;

-- ============================================================================
-- FUNCTION: Get Tournament Leaderboard
-- ============================================================================
CREATE OR REPLACE FUNCTION get_tournament_leaderboard(
    p_tournament_id UUID,
    p_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
    user_id UUID,
    display_name TEXT,
    classroom_name TEXT,
    game_session_id UUID,
    player_id UUID,
    total_score INTEGER,
    total_correct INTEGER,
    total_answers INTEGER,
    joined_at TIMESTAMPTZ,
    is_connected BOOLEAN,
    rank BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT
        tpa.user_id,
        tpa.display_name,
        tpa.classroom_name,
        tpa.game_session_id,
        tpa.player_id,
        tpa.total_score,
        tpa.total_correct,
        tpa.total_answers,
        tpa.joined_at,
        tpa.is_connected,
        RANK() OVER (
            ORDER BY tpa.total_score DESC, tpa.total_correct DESC, tpa.joined_at ASC
        ) as rank
    FROM tournament_players_aggregate tpa
    WHERE tpa.tournament_id = p_tournament_id
    ORDER BY rank
    LIMIT p_limit;
$$;

-- ============================================================================
-- FUNCTION: Get Classroom Rankings (for tournament view)
-- ============================================================================
CREATE OR REPLACE FUNCTION get_tournament_classroom_rankings(
    p_tournament_id UUID
)
RETURNS TABLE (
    classroom_name TEXT,
    game_session_id UUID,
    player_count BIGINT,
    total_score BIGINT,
    avg_score NUMERIC,
    rank BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT
        gs.classroom_name,
        gs.id as game_session_id,
        COUNT(gp.id) as player_count,
        COALESCE(SUM(gp.score), 0) as total_score,
        COALESCE(AVG(gp.score), 0) as avg_score,
        RANK() OVER (ORDER BY COALESCE(SUM(gp.score), 0) DESC) as rank
    FROM game_sessions gs
    LEFT JOIN game_players gp ON gp.game_session_id = gs.id
    WHERE gs.tournament_id = p_tournament_id
    GROUP BY gs.id, gs.classroom_name
    ORDER BY rank;
$$;

COMMENT ON FUNCTION create_tournament IS 'Creates a new tournament with unique code';
COMMENT ON FUNCTION join_tournament_as_classroom IS 'Creates a classroom game session within a tournament';
COMMENT ON FUNCTION start_tournament IS 'Starts tournament (starts all classrooms if coordinated mode)';
COMMENT ON FUNCTION get_tournament_leaderboard IS 'Returns tournament-wide player rankings';
COMMENT ON FUNCTION get_tournament_classroom_rankings IS 'Returns classroom team rankings by total score';
