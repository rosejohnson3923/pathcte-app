-- Validation script for tournament migrations
-- Run this in Supabase SQL Editor to verify all objects were created

-- ============================================================================
-- CHECK 1: Tables and Columns
-- ============================================================================

SELECT 'Tournaments table exists' AS check_name,
       CASE WHEN EXISTS (
           SELECT 1 FROM information_schema.tables
           WHERE table_schema = 'public' AND table_name = 'tournaments'
       ) THEN '✓ PASS' ELSE '✗ FAIL' END AS status;

SELECT 'game_sessions.tournament_id column exists' AS check_name,
       CASE WHEN EXISTS (
           SELECT 1 FROM information_schema.columns
           WHERE table_schema = 'public'
           AND table_name = 'game_sessions'
           AND column_name = 'tournament_id'
       ) THEN '✓ PASS' ELSE '✗ FAIL' END AS status;

SELECT 'game_sessions.classroom_name column exists' AS check_name,
       CASE WHEN EXISTS (
           SELECT 1 FROM information_schema.columns
           WHERE table_schema = 'public'
           AND table_name = 'game_sessions'
           AND column_name = 'classroom_name'
       ) THEN '✓ PASS' ELSE '✗ FAIL' END AS status;

-- ============================================================================
-- CHECK 2: Indexes
-- ============================================================================

SELECT 'Tournament indexes' AS check_name,
       COUNT(*) || '/4 created' AS status
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename = 'tournaments'
AND indexname IN (
    'idx_tournaments_coordinator',
    'idx_tournaments_code',
    'idx_tournaments_status',
    'idx_tournaments_question_set'
);

SELECT 'Game session tournament indexes' AS check_name,
       COUNT(*) || '/2 created' AS status
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename = 'game_sessions'
AND indexname IN (
    'idx_game_sessions_tournament_classroom',
    'idx_game_sessions_tournament_id'
);

-- ============================================================================
-- CHECK 3: Functions
-- ============================================================================

SELECT 'Tournament functions' AS check_name,
       COUNT(*) || '/6 created' AS status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN (
    'generate_tournament_code',
    'create_tournament',
    'join_tournament_as_classroom',
    'start_tournament',
    'get_tournament_leaderboard',
    'get_tournament_classroom_rankings'
);

-- ============================================================================
-- CHECK 4: Views
-- ============================================================================

SELECT 'tournament_players_aggregate view exists' AS check_name,
       CASE WHEN EXISTS (
           SELECT 1 FROM information_schema.views
           WHERE table_schema = 'public'
           AND table_name = 'tournament_players_aggregate'
       ) THEN '✓ PASS' ELSE '✗ FAIL' END AS status;

-- ============================================================================
-- CHECK 5: RLS Policies
-- ============================================================================

SELECT 'Tournament RLS policies' AS check_name,
       COUNT(*) || '/3 created' AS status
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'tournaments'
AND policyname IN (
    'tournaments_coordinator_all',
    'tournaments_teachers_insert',
    'tournaments_participants_select'
);

SELECT 'Game session tournament policy updated' AS check_name,
       CASE WHEN EXISTS (
           SELECT 1 FROM pg_policies
           WHERE schemaname = 'public'
           AND tablename = 'game_sessions'
           AND policyname = 'game_sessions_select'
       ) THEN '✓ PASS' ELSE '✗ FAIL' END AS status;

-- ============================================================================
-- CHECK 6: Constraints
-- ============================================================================

SELECT 'Tournament constraints' AS check_name,
       COUNT(*) || '/1 created' AS status
FROM information_schema.table_constraints
WHERE table_schema = 'public'
AND table_name = 'game_sessions'
AND constraint_name = 'game_sessions_tournament_classroom_name_check';

-- ============================================================================
-- CHECK 7: Triggers
-- ============================================================================

SELECT 'tournaments_updated_at trigger exists' AS check_name,
       CASE WHEN EXISTS (
           SELECT 1 FROM information_schema.triggers
           WHERE trigger_schema = 'public'
           AND event_object_table = 'tournaments'
           AND trigger_name = 'tournaments_updated_at'
       ) THEN '✓ PASS' ELSE '✗ FAIL' END AS status;

-- ============================================================================
-- SUMMARY
-- ============================================================================

SELECT '=== VALIDATION SUMMARY ===' AS summary;

SELECT
    'Tables' AS category,
    COUNT(*) AS total_created
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'tournaments'

UNION ALL

SELECT
    'Columns (game_sessions)',
    COUNT(*)
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'game_sessions'
AND column_name IN ('tournament_id', 'classroom_name')

UNION ALL

SELECT
    'Indexes',
    COUNT(*)
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname LIKE '%tournament%'

UNION ALL

SELECT
    'Functions',
    COUNT(*)
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN (
    'generate_tournament_code',
    'create_tournament',
    'join_tournament_as_classroom',
    'start_tournament',
    'get_tournament_leaderboard',
    'get_tournament_classroom_rankings'
)

UNION ALL

SELECT
    'Views',
    COUNT(*)
FROM information_schema.views
WHERE table_schema = 'public'
AND table_name = 'tournament_players_aggregate'

UNION ALL

SELECT
    'RLS Policies',
    COUNT(*)
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'tournaments'

UNION ALL

SELECT
    'Triggers',
    COUNT(*)
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND event_object_table = 'tournaments';
