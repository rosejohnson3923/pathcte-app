-- Migration: Rollback Career Cluster Changes (Migrations 048 & 049)
-- Description: Restore NULL career_cluster for Industry overview sets to fix filter logic
--
-- Filter Logic (useQuestionSets.ts):
--   Industry: career_id IS NULL AND career_cluster IS NULL
--   Career:   career_id IS NOT NULL
--   Cluster:  career_cluster IS NOT NULL
--
-- Issue: Migrations 048 & 049 populated career_cluster for ALL sets,
--        breaking the Industry filter (now returns 0 results)
--
-- Solution: Set career_cluster back to NULL for industry overview sets

BEGIN;

-- Step 1: Drop the triggers created by migration 048
DROP TRIGGER IF EXISTS sync_career_cluster_on_question_set ON question_sets;
DROP FUNCTION IF EXISTS sync_question_set_career_cluster();

-- Step 2: Restore NULL career_cluster for the 10 older industry overview sets
-- These should appear in "Industry" filter (career_id = NULL AND career_cluster = NULL)

UPDATE question_sets
SET career_cluster = NULL
WHERE title = 'Healthcare Careers Fundamentals'
  AND career_id IS NULL;

UPDATE question_sets
SET career_cluster = NULL
WHERE title = 'Technology & Engineering Basics'
  AND career_id IS NULL;

UPDATE question_sets
SET career_cluster = NULL
WHERE title = 'Business & Finance Careers'
  AND career_id IS NULL;

UPDATE question_sets
SET career_cluster = NULL
WHERE title = 'Arts & Entertainment Careers'
  AND career_id IS NULL;

UPDATE question_sets
SET career_cluster = NULL
WHERE title = 'Science & Research Careers'
  AND career_id IS NULL;

UPDATE question_sets
SET career_cluster = NULL
WHERE title = 'Education & Teaching Careers'
  AND career_id IS NULL;

UPDATE question_sets
SET career_cluster = NULL
WHERE title = 'Public Service & Law Careers'
  AND career_id IS NULL;

UPDATE question_sets
SET career_cluster = NULL
WHERE title = 'Agriculture & Environmental Careers'
  AND career_id IS NULL;

UPDATE question_sets
SET career_cluster = NULL
WHERE title = 'Construction & Skilled Trades Careers'
  AND career_id IS NULL;

UPDATE question_sets
SET career_cluster = NULL
WHERE title = 'Hospitality & Service Industry Careers'
  AND career_id IS NULL;

-- Step 3: Restore NULL career_cluster for career-specific sets (career_id != NULL)
-- These should appear ONLY in "Career" filter, NOT in "Cluster"
-- The career_cluster field should only be used for cluster-based question sets

UPDATE question_sets
SET career_cluster = NULL
WHERE career_id IS NOT NULL;

-- Step 4: Verification
DO $$
DECLARE
  industry_count INTEGER;
  career_count INTEGER;
  cluster_count INTEGER;
BEGIN
  -- Count sets by filter criteria
  SELECT COUNT(*) INTO industry_count
  FROM question_sets
  WHERE career_id IS NULL AND career_cluster IS NULL;

  SELECT COUNT(*) INTO career_count
  FROM question_sets
  WHERE career_id IS NOT NULL;

  SELECT COUNT(*) INTO cluster_count
  FROM question_sets
  WHERE career_cluster IS NOT NULL;

  RAISE NOTICE 'After Rollback:';
  RAISE NOTICE '  Industry (career_id=NULL, career_cluster=NULL): % sets', industry_count;
  RAISE NOTICE '  Career (career_id!=NULL): % sets', career_count;
  RAISE NOTICE '  Cluster (career_cluster!=NULL): % sets', cluster_count;
END $$;

-- Step 5: Note about trigger from migration 045
-- The update_career_cluster trigger from migration 045 remains active
-- It syncs career_cluster changes FROM careers table TO question_sets
-- This is fine for cluster-based sets, but won't affect career or industry sets

COMMIT;
