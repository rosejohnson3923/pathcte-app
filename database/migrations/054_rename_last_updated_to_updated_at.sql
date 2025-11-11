-- Migration: Rename last_updated to updated_at in student_business_driver_progress
-- Description: Fix column naming inconsistency to match database pattern
--
-- Issue: student_business_driver_progress uses 'last_updated' but the trigger
--        function expects 'updated_at' causing error: record "new" has no field "updated_at"
--
-- Solution: Rename column to match the standard pattern used across all other tables

BEGIN;

-- Rename the column
ALTER TABLE student_business_driver_progress
  RENAME COLUMN last_updated TO updated_at;

-- Update the comment to reflect the change
COMMENT ON COLUMN student_business_driver_progress.updated_at IS
  'Timestamp of last update to this record (auto-updated by trigger)';

COMMIT;
