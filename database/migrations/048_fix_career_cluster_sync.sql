-- Migration: Fix career_cluster sync on question_sets
-- Description: Add trigger to auto-populate career_cluster when question_sets are inserted/updated
-- Issue: Migration 045 only synced career_cluster when careers table updates,
--        not when question_sets are inserted or their career_id changes

BEGIN;

-- Step 1: Update existing question_sets that have career_id but NULL career_cluster
UPDATE question_sets qs
SET career_cluster = c.career_cluster
FROM careers c
WHERE qs.career_id = c.id
  AND qs.career_cluster IS NULL
  AND c.career_cluster IS NOT NULL;

-- Step 2: Create function to auto-populate career_cluster from careers table
CREATE OR REPLACE FUNCTION sync_question_set_career_cluster() RETURNS TRIGGER AS $$
BEGIN
  -- If career_id is set, populate career_cluster from careers table
  IF NEW.career_id IS NOT NULL THEN
    SELECT career_cluster INTO NEW.career_cluster
    FROM careers
    WHERE id = NEW.career_id;
  ELSE
    -- If career_id is cleared, clear career_cluster too
    NEW.career_cluster := NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Create trigger on question_sets to sync on INSERT/UPDATE
DROP TRIGGER IF EXISTS sync_career_cluster_on_question_set ON question_sets;

CREATE TRIGGER sync_career_cluster_on_question_set
  BEFORE INSERT OR UPDATE OF career_id ON question_sets
  FOR EACH ROW
  EXECUTE FUNCTION sync_question_set_career_cluster();

-- Step 4: Add helpful comments
COMMENT ON FUNCTION sync_question_set_career_cluster() IS
  'Auto-populates career_cluster in question_sets from careers table when career_id is set or changed';

COMMENT ON TRIGGER sync_career_cluster_on_question_set ON question_sets IS
  'Ensures career_cluster stays in sync with careers table whenever career_id changes';

COMMIT;
