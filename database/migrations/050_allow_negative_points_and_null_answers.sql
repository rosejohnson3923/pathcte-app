-- ============================================
-- CRITICAL FIX: Allow negative points and NULL answers
-- ============================================
-- The game_answers table has two constraints that break the penalty system:
-- 1. CHECK (points_earned >= 0) - prevents penalties (-10 points)
-- 2. selected_option_index NOT NULL - prevents no-answer records
-- ============================================

-- Drop the old constraint on points_earned
ALTER TABLE game_answers
DROP CONSTRAINT IF EXISTS game_answers_points_earned_check;

-- Recreate without the >= 0 restriction
-- Allow any integer value (positive or negative)
ALTER TABLE game_answers
ADD CONSTRAINT game_answers_points_earned_check
CHECK (points_earned >= -1000 AND points_earned <= 1000);

-- Allow NULL for selected_option_index (for no-answer penalties)
ALTER TABLE game_answers
ALTER COLUMN selected_option_index DROP NOT NULL;

-- Update the check constraint to allow NULL
ALTER TABLE game_answers
DROP CONSTRAINT IF EXISTS game_answers_selected_option_index_check;

ALTER TABLE game_answers
ADD CONSTRAINT game_answers_selected_option_index_check
CHECK (selected_option_index IS NULL OR (selected_option_index >= 0 AND selected_option_index < 10));

-- Update comment to reflect changes
COMMENT ON COLUMN game_answers.points_earned IS 'Points awarded for this answer (can be negative for penalties). Range: -1000 to 1000';
COMMENT ON COLUMN game_answers.selected_option_index IS 'Zero-based index of selected option (NULL if no answer submitted before timeout)';
