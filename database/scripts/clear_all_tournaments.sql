-- ============================================================================
-- Clear All Tournaments Script
-- ============================================================================
-- This script removes all tournament data from the database
-- WARNING: This is a destructive operation and cannot be undone!
-- ============================================================================

-- Step 1: Check what will be deleted (INFORMATIONAL - RUN THIS FIRST)
-- ============================================================================

-- Count tournaments
SELECT 'Tournaments to delete:' as info, COUNT(*) as count FROM tournaments;

-- Count tournament game sessions
SELECT 'Tournament game sessions to delete:' as info, COUNT(*) as count
FROM game_sessions
WHERE tournament_id IS NOT NULL;

-- Count players in tournament games
SELECT 'Players in tournament games to delete:' as info, COUNT(*) as count
FROM game_players gp
WHERE EXISTS (
    SELECT 1 FROM game_sessions gs
    WHERE gs.id = gp.game_session_id
    AND gs.tournament_id IS NOT NULL
);

-- View tournament details before deletion
SELECT
    id,
    title,
    tournament_code,
    coordinator_id,
    status,
    created_at
FROM tournaments
ORDER BY created_at DESC;


-- Step 2: DELETE ALL TOURNAMENTS (OPTION 1 - CASCADE DELETE)
-- ============================================================================
-- This leverages the ON DELETE CASCADE foreign key constraint
-- Deleting tournaments will automatically delete:
-- - All game_sessions with tournament_id
-- - All game_players in those sessions (via game_sessions CASCADE)
-- ============================================================================

-- Uncomment the following line to execute the deletion:
-- DELETE FROM tournaments;


-- Step 3: DELETE ALL TOURNAMENTS (OPTION 2 - EXPLICIT DELETE WITH TRANSACTION)
-- ============================================================================
-- This version explicitly deletes in the correct order within a transaction
-- More verbose but shows exactly what's being deleted
-- ============================================================================

BEGIN;

-- Delete players in tournament game sessions
DELETE FROM game_players
WHERE game_session_id IN (
    SELECT id FROM game_sessions WHERE tournament_id IS NOT NULL
);

-- Delete tournament game sessions
DELETE FROM game_sessions
WHERE tournament_id IS NOT NULL;

-- Delete tournaments
DELETE FROM tournaments;

-- Review the changes before committing
-- If everything looks correct, run: COMMIT;
-- If you want to cancel, run: ROLLBACK;

-- Uncomment ONE of the following:
-- COMMIT;    -- Permanently apply the changes
-- ROLLBACK;  -- Cancel the changes


-- Step 4: Verification (run after deletion)
-- ============================================================================

-- Verify all tournaments are deleted
SELECT 'Tournaments remaining:' as info, COUNT(*) as count FROM tournaments;

-- Verify all tournament game sessions are deleted
SELECT 'Tournament game sessions remaining:' as info, COUNT(*) as count
FROM game_sessions
WHERE tournament_id IS NOT NULL;

-- Verify all tournament game players are deleted
SELECT 'Players in tournament games remaining:' as info, COUNT(*) as count
FROM game_players gp
WHERE EXISTS (
    SELECT 1 FROM game_sessions gs
    WHERE gs.id = gp.game_session_id
    AND gs.tournament_id IS NOT NULL
);
