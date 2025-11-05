-- ============================================================================
-- Quick Clear All Tournaments
-- ============================================================================
-- Simple script to immediately delete all tournament data
-- Uses CASCADE deletion for automatic cleanup
-- ============================================================================

-- Delete all tournaments (cascades to game_sessions and game_players)
DELETE FROM tournaments;

-- Verify deletion
SELECT 'Tournaments remaining:' as check_type, COUNT(*) as count FROM tournaments
UNION ALL
SELECT 'Tournament game sessions remaining:', COUNT(*) FROM game_sessions WHERE tournament_id IS NOT NULL
UNION ALL
SELECT 'Tournament game players remaining:', COUNT(*)
FROM game_players gp
WHERE EXISTS (
    SELECT 1 FROM game_sessions gs
    WHERE gs.id = gp.game_session_id AND gs.tournament_id IS NOT NULL
);
