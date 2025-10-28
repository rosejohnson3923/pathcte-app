-- Investigate the import discrepancies

-- 1. Show all question sets with their grade levels
SELECT
  id,
  title,
  grade_level,
  total_questions,
  CASE
    WHEN 6 = ANY(grade_level) THEN 'Middle School (6-8)'
    WHEN 9 = ANY(grade_level) THEN 'High School (9-12)'
    ELSE 'Other'
  END as grade_range
FROM question_sets
WHERE creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28'
ORDER BY created_at;

-- 2. Show the "Other" question sets specifically
SELECT
  title,
  grade_level,
  total_questions,
  subject,
  career_sector
FROM question_sets
WHERE creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28'
  AND NOT (6 = ANY(grade_level))
  AND NOT (9 = ANY(grade_level))
ORDER BY title;

-- 3. Count actual questions per set
SELECT
  qs.title,
  qs.grade_level,
  qs.total_questions as expected,
  COUNT(q.id) as actual,
  qs.total_questions - COUNT(q.id) as difference
FROM question_sets qs
LEFT JOIN questions q ON qs.id = q.question_set_id
WHERE qs.creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28'
GROUP BY qs.id, qs.title, qs.grade_level, qs.total_questions
ORDER BY difference DESC;

-- 4. Total count
SELECT
  COUNT(DISTINCT qs.id) as total_sets,
  COUNT(q.id) as total_questions
FROM question_sets qs
LEFT JOIN questions q ON qs.id = q.question_set_id
WHERE qs.creator_id = '0ae5001d-41f0-4969-86a9-96d8dc478a28';
