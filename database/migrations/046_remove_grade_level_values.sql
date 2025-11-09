-- Migration: Remove grade level values from all question sets
-- All questions are now suitable for grades 6-12 (no filtering needed)

UPDATE question_sets
SET grade_level = ARRAY[]::integer[]
WHERE grade_level IS NOT NULL OR grade_level != ARRAY[]::integer[];

-- Verify the update
SELECT
  COUNT(*) as total_sets,
  COUNT(CASE WHEN grade_level = ARRAY[]::integer[] THEN 1 END) as empty_arrays
FROM question_sets;
