-- Migration: Populate Missing Career Clusters for Older Question Sets
-- Description: Map the 10 older sector-based question sets to official CTE Career Clusters
-- Issue: 10 question sets with career_id = NULL have NULL career_cluster

BEGIN;

-- Update each question set with the appropriate CTE Career Cluster
-- Based on title matching and career_sector alignment

UPDATE question_sets
SET career_cluster = 'Health Science'
WHERE title = 'Healthcare Careers Fundamentals'
  AND career_cluster IS NULL;

UPDATE question_sets
SET career_cluster = 'Information Technology'
WHERE title = 'Technology & Engineering Basics'
  AND career_cluster IS NULL;

UPDATE question_sets
SET career_cluster = 'Business Management & Administration'
WHERE title = 'Business & Finance Careers'
  AND career_cluster IS NULL;

UPDATE question_sets
SET career_cluster = 'Arts, Audio/Video Technology & Communications'
WHERE title = 'Arts & Entertainment Careers'
  AND career_cluster IS NULL;

UPDATE question_sets
SET career_cluster = 'Science, Technology, Engineering & Mathematics'
WHERE title = 'Science & Research Careers'
  AND career_cluster IS NULL;

UPDATE question_sets
SET career_cluster = 'Education & Training'
WHERE title = 'Education & Teaching Careers'
  AND career_cluster IS NULL;

UPDATE question_sets
SET career_cluster = 'Law, Public Safety, Corrections & Security'
WHERE title = 'Public Service & Law Careers'
  AND career_cluster IS NULL;

UPDATE question_sets
SET career_cluster = 'Agriculture, Food & Natural Resources'
WHERE title = 'Agriculture & Environmental Careers'
  AND career_cluster IS NULL;

UPDATE question_sets
SET career_cluster = 'Architecture & Construction'
WHERE title = 'Construction & Skilled Trades Careers'
  AND career_cluster IS NULL;

UPDATE question_sets
SET career_cluster = 'Hospitality & Tourism'
WHERE title = 'Hospitality & Service Industry Careers'
  AND career_cluster IS NULL;

-- Verification: Show which records were updated
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO updated_count
  FROM question_sets
  WHERE career_id IS NULL
    AND career_cluster IS NOT NULL
    AND title IN (
      'Healthcare Careers Fundamentals',
      'Technology & Engineering Basics',
      'Business & Finance Careers',
      'Arts & Entertainment Careers',
      'Science & Research Careers',
      'Education & Teaching Careers',
      'Public Service & Law Careers',
      'Agriculture & Environmental Careers',
      'Construction & Skilled Trades Careers',
      'Hospitality & Service Industry Careers'
    );

  RAISE NOTICE 'Updated % question sets with career_cluster values', updated_count;
END $$;

COMMIT;
