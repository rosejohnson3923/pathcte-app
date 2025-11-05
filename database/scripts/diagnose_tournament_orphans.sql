-- ============================================================================
-- Diagnose Tournament Orphan Records
-- ============================================================================
-- Check for orphaned game_sessions that reference deleted tournaments
-- ============================================================================

-- Check for game_sessions with tournament_id that don't have matching tournaments
SELECT
    'Orphaned game sessions (tournament deleted but session remains):' as issue,
    COUNT(*) as count
FROM game_sessions gs
WHERE gs.tournament_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM tournaments t WHERE t.id = gs.tournament_id
);

-- List the orphaned game sessions
SELECT
    gs.id as game_session_id,
    gs.game_code,
    gs.tournament_id as deleted_tournament_id,
    gs.classroom_name,
    gs.host_id,
    gs.created_at
FROM game_sessions gs
WHERE gs.tournament_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM tournaments t WHERE t.id = gs.tournament_id
)
ORDER BY gs.created_at DESC;

-- Check tournaments for a specific user
SELECT
    t.id,
    t.title,
    t.tournament_code,
    t.coordinator_id,
    t.status,
    t.created_at,
    (SELECT COUNT(*) FROM game_sessions WHERE tournament_id = t.id) as session_count
FROM tournaments t
WHERE t.coordinator_id = (SELECT id FROM profiles WHERE email = 'teacher@esposure.gg')
ORDER BY t.created_at DESC;

-- Clean up orphaned game_sessions (UNCOMMENT TO EXECUTE)
-- UPDATE game_sessions
-- SET tournament_id = NULL, classroom_name = NULL
-- WHERE tournament_id IS NOT NULL
-- AND NOT EXISTS (
--     SELECT 1 FROM tournaments t WHERE t.id = tournament_id
-- );

-- OR delete them entirely (UNCOMMENT TO EXECUTE)
-- DELETE FROM game_sessions
-- WHERE tournament_id IS NOT NULL
-- AND NOT EXISTS (
--     SELECT 1 FROM tournaments t WHERE t.id = tournament_id
-- );
