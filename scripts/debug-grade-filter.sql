-- Debug SQL: Check Question Sets and Grade Level Filtering Issue
-- Run these queries in Supabase SQL Editor to diagnose the problem

-- Query 1: List all question sets with their grade levels and question counts
SELECT
  id,
  title,
  subject,
  grade_level,
  total_questions,
  is_public,
  created_at
FROM question_sets
ORDER BY subject, title;

-- Query 2: Count actual questions for each question set
SELECT
  qs.id,
  qs.title,
  qs.grade_level,
  qs.total_questions as stored_count,
  COUNT(q.id) as actual_count,
  (qs.total_questions - COUNT(q.id)) as difference
FROM question_sets qs
LEFT JOIN questions q ON q.question_set_id = qs.id
GROUP BY qs.id, qs.title, qs.grade_level, qs.total_questions
ORDER BY qs.subject, qs.title;

-- Query 3: Check for duplicate question sets (same title, different grade levels)
SELECT
  title,
  COUNT(*) as set_count,
  json_agg(json_build_object(
    'id', id,
    'grade_level', grade_level,
    'total_questions', total_questions
  )) as sets
FROM question_sets
GROUP BY title
HAVING COUNT(*) > 1
ORDER BY title;

-- Query 4: Check Healthcare specifically
SELECT
  qs.id,
  qs.title,
  qs.grade_level,
  qs.total_questions as stored_count,
  COUNT(q.id) as actual_count
FROM question_sets qs
LEFT JOIN questions q ON q.question_set_id = qs.id
WHERE qs.title ILIKE '%healthcare%'
GROUP BY qs.id, qs.title, qs.grade_level, qs.total_questions
ORDER BY qs.grade_level;

-- Query 5: Check which question sets would show for grade 6 filter
SELECT
  id,
  title,
  subject,
  grade_level,
  total_questions,
  CASE
    WHEN grade_level IS NULL OR grade_level = '{}' THEN true
    WHEN 6 = ANY(grade_level) THEN true
    ELSE false
  END as shows_for_grade_6
FROM question_sets
WHERE CASE
  WHEN grade_level IS NULL OR grade_level = '{}' THEN true
  WHEN 6 = ANY(grade_level) THEN true
  ELSE false
END
ORDER BY subject, title;
