-- Fix Question Set Counts
-- This script recalculates the total_questions field based on actual question counts

-- Show current mismatches (for verification)
SELECT
  qs.id,
  qs.title,
  qs.total_questions as stored_count,
  COUNT(q.id) as actual_count,
  (qs.total_questions - COUNT(q.id)) as difference
FROM question_sets qs
LEFT JOIN questions q ON q.question_set_id = qs.id
GROUP BY qs.id, qs.title, qs.total_questions
HAVING qs.total_questions != COUNT(q.id)
ORDER BY qs.title;

-- Update all question set counts to match actual counts
UPDATE question_sets qs
SET
  total_questions = (
    SELECT COUNT(*)
    FROM questions q
    WHERE q.question_set_id = qs.id
  ),
  updated_at = NOW();

-- Verify the fix - should return no rows if successful
SELECT
  qs.id,
  qs.title,
  qs.total_questions as stored_count,
  COUNT(q.id) as actual_count,
  (qs.total_questions - COUNT(q.id)) as difference
FROM question_sets qs
LEFT JOIN questions q ON q.question_set_id = qs.id
GROUP BY qs.id, qs.title, qs.total_questions
HAVING qs.total_questions != COUNT(q.id)
ORDER BY qs.title;

-- Show final counts for all question sets
SELECT
  id,
  title,
  grade_level,
  total_questions,
  subject
FROM question_sets
ORDER BY subject, title;
