-- ============================================================================
-- Delete All Tournaments - Clean Slate for Testing
-- ============================================================================
-- This will delete all tournaments and cascade to game_sessions
-- ============================================================================

-- First, see what will be deleted
SELECT 'Tournaments to delete:' as info, COUNT(*) as count FROM tournaments;
SELECT 'Game sessions to delete:' as info, COUNT(*) as count FROM game_sessions WHERE tournament_id IS NOT NULL;

-- Delete all tournaments (cascades to game_sessions and game_players)
DELETE FROM tournaments;

-- Verify everything is gone
SELECT 'Tournaments remaining:' as info, COUNT(*) as count FROM tournaments;
SELECT 'Tournament game sessions remaining:' as info, COUNT(*) as count FROM game_sessions WHERE tournament_id IS NOT NULL;
