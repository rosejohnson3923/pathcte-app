-- Migration: Add Question Pools Architecture
-- Description: Add question_set_membership table and career_cluster field
-- This allows flexible question pools while preserving existing 780 questions

BEGIN;

-- Step 1: Add career_cluster field to question_sets
ALTER TABLE question_sets ADD COLUMN IF NOT EXISTS career_cluster TEXT;

-- Step 2: Populate career_cluster from careers table
UPDATE question_sets qs
SET career_cluster = c.career_cluster
FROM careers c
WHERE qs.career_id = c.id
  AND qs.career_cluster IS NULL;

-- Step 3: Create question_set_membership join table
CREATE TABLE IF NOT EXISTS question_set_membership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_set_id UUID NOT NULL REFERENCES question_sets(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Ensure no duplicate questions in same set
  UNIQUE(question_set_id, question_id),

  -- Ensure no duplicate order within same set
  UNIQUE(question_set_id, order_index)
);

-- Step 4: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_question_set_membership_set_id
  ON question_set_membership(question_set_id);

CREATE INDEX IF NOT EXISTS idx_question_set_membership_question_id
  ON question_set_membership(question_id);

-- Step 5: Migrate existing question relationships
INSERT INTO question_set_membership (question_set_id, question_id, order_index)
SELECT question_set_id, id, order_index
FROM questions
WHERE question_set_id IS NOT NULL
ON CONFLICT (question_set_id, question_id) DO NOTHING;

-- Step 6: Create trigger to auto-sync career_cluster
CREATE OR REPLACE FUNCTION sync_career_cluster() RETURNS TRIGGER AS $$
BEGIN
  UPDATE question_sets
  SET career_cluster = NEW.career_cluster
  WHERE career_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_career_cluster ON careers;

CREATE TRIGGER update_career_cluster
  AFTER UPDATE OF career_cluster ON careers
  FOR EACH ROW
  EXECUTE FUNCTION sync_career_cluster();

-- Step 7: Add comment for documentation
COMMENT ON TABLE question_set_membership IS
  'Many-to-many relationship between question sets and questions. Allows questions to be reused across multiple sets.';

COMMENT ON COLUMN question_sets.career_cluster IS
  'CTE Career Cluster (e.g., "Arts, Audio/Video Technology & Communications"). Auto-synced from careers table via trigger.';

COMMIT;
