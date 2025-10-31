-- ============================================
-- Update explore_careers to career_quest type
-- ============================================
-- Consolidates question set types - all career/industry
-- question sets now use career_quest type
-- career_id determines if career-specific or industry-wide
-- ============================================

-- Update existing explore_careers question sets to career_quest
UPDATE public.question_sets
SET question_set_type = 'career_quest'
WHERE question_set_type = 'explore_careers';

-- Add comment documenting the change
COMMENT ON COLUMN public.question_sets.question_set_type IS 'Type of question set: career_quest (for careers and industries - use career_id to differentiate), or general. Legacy explore_careers type has been migrated to career_quest.';
