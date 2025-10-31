-- ============================================
-- VERIFICATION QUERIES FOR SECURITY FIXES
-- ============================================
-- Run these in Supabase SQL Editor to verify fixes are active
-- ============================================

-- 1. Verify trigger was created
SELECT trigger_name, event_manipulation, event_object_table, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'game_players'
AND trigger_name = 'enforce_game_player_update_restrictions';
-- Expected: 1 row showing BEFORE UPDATE trigger

-- 2. Verify RLS policy is active
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'game_players'
AND cmd = 'UPDATE'
ORDER BY policyname;
-- Expected: "Players can update own connection status" policy

-- 3. Test connection status update (should SUCCEED)
-- Replace 'your-player-id' with an actual player ID from your account
UPDATE game_players
SET is_connected = false, left_at = NOW()
WHERE id = 'your-player-id'
AND user_id = auth.uid();
-- Expected: UPDATE 1 (success)

-- 4. Test score modification (should FAIL)
-- This should raise an exception
UPDATE game_players
SET score = 999999
WHERE id = 'your-player-id'
AND user_id = auth.uid();
-- Expected: ERROR: Cannot modify score - use game service functions

-- 5. Test tokens modification (should FAIL)
UPDATE game_players
SET tokens_earned = 999999
WHERE id = 'your-player-id'
AND user_id = auth.uid();
-- Expected: ERROR: Cannot modify tokens_earned - use game service functions

-- 6. Verify game_answers has no duplicates
-- Check if any player has submitted multiple answers to same question
SELECT player_id, question_id, COUNT(*) as answer_count
FROM game_answers
GROUP BY player_id, question_id
HAVING COUNT(*) > 1;
-- Expected: 0 rows (no duplicates after our fix)

-- 7. Check that questions don't expose answer keys
-- This query shows what's in the database
-- The application code sanitizes this before sending to client
SELECT id, question_text,
       jsonb_array_length(options) as option_count,
       options::text LIKE '%is_correct%' as has_correct_flag
FROM questions
LIMIT 5;
-- Expected: has_correct_flag = true (database has it, but app removes it)

-- ============================================
-- SECURITY TESTING CHECKLIST
-- ============================================

-- ✅ Trigger exists and is active
-- ✅ RLS policy allows connection updates only
-- ✅ Score modifications are blocked
-- ✅ Token modifications are blocked
-- ✅ No duplicate answers exist
-- ✅ Questions in DB have answer keys (normal)
--    → Application removes them before sending to client
