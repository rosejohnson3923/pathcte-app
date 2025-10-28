-- Validation Queries for Pathket Question Import
-- Run these queries in Supabase SQL Editor to verify the import

-- ============================================
-- 1. Count question sets by grade level
-- ============================================
SELECT
  CASE
    WHEN 6 = ANY(grade_level) THEN 'Middle School (6-8)'
    WHEN 9 = ANY(grade_level) THEN 'High School (9-12)'
    ELSE 'Other'
  END as grade_range,
  COUNT(*) as set_count,
  SUM(total_questions) as total_questions
FROM question_sets
WHERE creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28'
GROUP BY grade_range
ORDER BY grade_range;

-- ============================================
-- 2. Count questions by difficulty level
-- ============================================
SELECT
  difficulty,
  COUNT(*) as question_count
FROM questions q
JOIN question_sets qs ON q.question_set_id = qs.id
WHERE qs.creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28'
GROUP BY difficulty
ORDER BY
  CASE difficulty
    WHEN 'easy' THEN 1
    WHEN 'medium' THEN 2
    WHEN 'hard' THEN 3
  END;

-- ============================================
-- 3. Count questions by career sector
-- ============================================
SELECT
  career_sector,
  COUNT(DISTINCT qs.id) as question_sets,
  SUM(qs.total_questions) as questions
FROM question_sets qs
WHERE creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28'
GROUP BY career_sector
ORDER BY questions DESC;

-- ============================================
-- 4. Verify all question sets have correct question counts
-- ============================================
SELECT
  qs.title,
  qs.total_questions as expected_count,
  COUNT(q.id) as actual_count,
  CASE
    WHEN qs.total_questions = COUNT(q.id) THEN '✓ Match'
    ELSE '✗ Mismatch'
  END as status
FROM question_sets qs
LEFT JOIN questions q ON qs.id = q.question_set_id
WHERE qs.creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28'
GROUP BY qs.id, qs.title, qs.total_questions
ORDER BY qs.title;

-- ============================================
-- 5. Check for orphaned questions
-- ============================================
SELECT
  COUNT(*) as orphaned_questions
FROM questions q
WHERE NOT EXISTS (
  SELECT 1 FROM question_sets qs WHERE qs.id = q.question_set_id
);

-- ============================================
-- 6. Sample questions from each grade range
-- ============================================
-- Middle School Sample
SELECT
  qs.title as question_set,
  q.question_text,
  q.difficulty
FROM questions q
JOIN question_sets qs ON q.question_set_id = qs.id
WHERE qs.creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28'
  AND 6 = ANY(qs.grade_level)
ORDER BY RANDOM()
LIMIT 3;

-- High School Sample
SELECT
  qs.title as question_set,
  q.question_text,
  q.difficulty
FROM questions q
JOIN question_sets qs ON q.question_set_id = qs.id
WHERE qs.creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28'
  AND 9 = ANY(qs.grade_level)
ORDER BY RANDOM()
LIMIT 3;

-- ============================================
-- 7. Verify all questions have 4 options
-- ============================================
SELECT
  qs.title as question_set,
  q.question_text,
  jsonb_array_length(q.options) as option_count
FROM questions q
JOIN question_sets qs ON q.question_set_id = qs.id
WHERE qs.creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28'
  AND jsonb_array_length(q.options) != 4
LIMIT 10;

-- If this returns 0 rows, all questions have exactly 4 options ✓

-- ============================================
-- 8. Verify each question has exactly ONE correct answer
-- ============================================
WITH correct_counts AS (
  SELECT
    qs.title as question_set,
    q.question_text,
    q.id as question_id,
    (
      SELECT COUNT(*)
      FROM jsonb_array_elements(q.options) AS opt
      WHERE (opt->>'is_correct')::boolean = true
    ) as correct_answer_count
  FROM questions q
  JOIN question_sets qs ON q.question_set_id = qs.id
  WHERE qs.creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28'
)
SELECT
  question_set,
  question_text,
  correct_answer_count
FROM correct_counts
WHERE correct_answer_count != 1
LIMIT 10;

-- If this returns 0 rows, all questions have exactly 1 correct answer ✓

-- ============================================
-- 9. Overall Summary
-- ============================================
SELECT
  'Question Sets' as metric,
  COUNT(DISTINCT qs.id)::text as value
FROM question_sets qs
WHERE qs.creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28'

UNION ALL

SELECT
  'Total Questions',
  COUNT(q.id)::text
FROM questions q
JOIN question_sets qs ON q.question_set_id = qs.id
WHERE qs.creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28'

UNION ALL

SELECT
  'Average Questions per Set',
  ROUND(AVG(total_questions), 1)::text
FROM question_sets
WHERE creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28'

UNION ALL

SELECT
  'Career Sectors Covered',
  COUNT(DISTINCT career_sector)::text
FROM question_sets
WHERE creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28';

-- ============================================
-- 10. List all question sets with details
-- ============================================
SELECT
  qs.title,
  qs.subject,
  qs.career_sector,
  qs.grade_level,
  qs.difficulty_level,
  qs.total_questions,
  qs.tags,
  qs.is_public,
  qs.is_verified,
  qs.created_at
FROM question_sets qs
WHERE qs.creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28'
ORDER BY
  CASE WHEN 6 = ANY(grade_level) THEN 1 ELSE 2 END,
  qs.title;
