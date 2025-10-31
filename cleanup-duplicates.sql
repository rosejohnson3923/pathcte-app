-- Cleanup Duplicate Question Sets
-- This will help identify and remove duplicate imports

-- ============================================
-- STEP 1: Identify duplicate question sets by title
-- ============================================
SELECT
  title,
  COUNT(*) as duplicate_count,
  array_agg(id ORDER BY created_at DESC) as set_ids,
  array_agg(created_at ORDER BY created_at DESC) as created_dates
FROM question_sets
WHERE creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28'
GROUP BY title
HAVING COUNT(*) > 1
ORDER BY title;

-- ============================================
-- STEP 2: Show ALL question sets ordered by creation time
-- ============================================
SELECT
  created_at,
  title,
  grade_level,
  total_questions,
  id
FROM question_sets
WHERE creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28'
ORDER BY created_at, title;

-- ============================================
-- STEP 3: (OPTIONAL) Delete OLDER duplicates, keep newest
-- ============================================
-- UNCOMMENT TO RUN - This will delete older duplicate sets and their questions

-- WITH duplicates AS (
--   SELECT
--     title,
--     array_agg(id ORDER BY created_at DESC) as set_ids
--   FROM question_sets
--   WHERE creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28'
--   GROUP BY title
--   HAVING COUNT(*) > 1
-- ),
-- sets_to_delete AS (
--   SELECT unnest(set_ids[2:]) as id
--   FROM duplicates
-- )
-- DELETE FROM questions
-- WHERE question_set_id IN (SELECT id FROM sets_to_delete);

-- DELETE FROM question_sets
-- WHERE id IN (
--   WITH duplicates AS (
--     SELECT
--       title,
--       array_agg(id ORDER BY created_at DESC) as set_ids
--     FROM question_sets
--     WHERE creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28'
--     GROUP BY title
--     HAVING COUNT(*) > 1
--   )
--   SELECT unnest(set_ids[2:]) FROM duplicates
-- );

-- ============================================
-- STEP 4: (OPTIONAL) Delete ALL and start fresh
-- ============================================
-- UNCOMMENT TO RUN - This will delete ALL question sets for this teacher

-- BEGIN;
--
-- -- Delete all questions first (due to foreign key)
-- DELETE FROM questions
-- WHERE question_set_id IN (
--   SELECT id FROM question_sets
--   WHERE creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28'
-- );
--
-- -- Delete all question sets
-- DELETE FROM question_sets
-- WHERE creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28';
--
-- COMMIT;
--
-- -- After running this, you can re-run pathcte-questions-runnable.sql

-- ============================================
-- STEP 5: Verify cleanup (run after cleanup)
-- ============================================
SELECT
  'Question Sets Remaining' as metric,
  COUNT(*)::text as count
FROM question_sets
WHERE creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28'

UNION ALL

SELECT
  'Questions Remaining',
  COUNT(*)::text
FROM questions q
JOIN question_sets qs ON q.question_set_id = qs.id
WHERE qs.creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28';
