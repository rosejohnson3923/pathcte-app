-- Migration: Add Pathkey Image Tracking to Careers Table
-- Description: Add columns to track which pathkey images are available for each career
--
-- Images are stored in Azure Blob Storage container: pathctestore
-- Three image types per career:
--   1. Career image (unlocked via Section 1)
--   2. Lock image (unlocked via Section 2)
--   3. Key image (unlocked via Section 3)
--
-- Reference: docs/PATHKEY_IMPLEMENTATION_NOTES.md

BEGIN;

-- Add image path columns to careers table
ALTER TABLE careers
ADD COLUMN IF NOT EXISTS pathkey_career_image TEXT,
ADD COLUMN IF NOT EXISTS pathkey_lock_image TEXT,
ADD COLUMN IF NOT EXISTS pathkey_key_image TEXT,
ADD COLUMN IF NOT EXISTS pathkey_images_complete BOOLEAN DEFAULT false;

-- Add comments to document the fields
COMMENT ON COLUMN careers.pathkey_career_image IS 'Filename of career image in Azure Blob Storage (pathctestore container)';
COMMENT ON COLUMN careers.pathkey_lock_image IS 'Filename of lock image in Azure Blob Storage (pathctestore container)';
COMMENT ON COLUMN careers.pathkey_key_image IS 'Filename of key image in Azure Blob Storage (pathctestore container)';
COMMENT ON COLUMN careers.pathkey_images_complete IS 'True when all three pathkey images are available for this career';

-- ============================================================================
-- Populate PR Specialist (Test Career)
-- ============================================================================
-- PR Specialist has complete image set for testing

UPDATE careers
SET
  pathkey_career_image = 'pr-specialist.png',
  pathkey_lock_image = 'Lock_gold_1.png',
  pathkey_key_image = 'Comm_key.png',
  pathkey_images_complete = true
WHERE title = 'Public Relations Specialist';

-- ============================================================================
-- Verification
-- ============================================================================

DO $$
DECLARE
  pr_specialist_count INTEGER;
  complete_image_sets INTEGER;
BEGIN
  -- Check if PR Specialist was updated
  SELECT COUNT(*) INTO pr_specialist_count
  FROM careers
  WHERE title = 'Public Relations Specialist'
    AND pathkey_images_complete = true;

  -- Count careers with complete image sets
  SELECT COUNT(*) INTO complete_image_sets
  FROM careers
  WHERE pathkey_images_complete = true;

  RAISE NOTICE '✅ Pathkey image columns added to careers table!';
  RAISE NOTICE '';

  IF pr_specialist_count = 1 THEN
    RAISE NOTICE '✅ PR Specialist configured as test career:';
    RAISE NOTICE '   - Career image: pr-specialist.png';
    RAISE NOTICE '   - Lock image: Lock_gold_1.png';
    RAISE NOTICE '   - Key image: Comm_key.png';
  ELSE
    RAISE NOTICE '⚠️  PR Specialist not found or not configured';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE 'Careers with complete image sets: %', complete_image_sets;
  RAISE NOTICE '';
  RAISE NOTICE '💡 Images stored in Azure Blob Storage container: pathctestore';
  RAISE NOTICE '';
END $$;

COMMIT;
