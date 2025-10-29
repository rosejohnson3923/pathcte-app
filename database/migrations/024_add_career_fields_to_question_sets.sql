-- Migration: Add career-specific fields to question sets
-- Description: Links question sets to specific careers and categorizes set types

-- Add career_id field to link Explore Careers sets to specific careers
ALTER TABLE public.question_sets
ADD COLUMN IF NOT EXISTS career_id UUID REFERENCES public.careers(id) ON DELETE SET NULL;

-- Add question_set_type to distinguish Career Quest vs Explore Careers
ALTER TABLE public.question_sets
ADD COLUMN IF NOT EXISTS question_set_type TEXT CHECK (question_set_type IN ('career_quest', 'explore_careers', 'general'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_question_sets_career_id ON public.question_sets(career_id);
CREATE INDEX IF NOT EXISTS idx_question_sets_type ON public.question_sets(question_set_type);

-- Add comments
COMMENT ON COLUMN public.question_sets.career_id IS 'Links to specific career for Explore Careers sets (null for Career Quest sector-based sets)';
COMMENT ON COLUMN public.question_sets.question_set_type IS 'Type of question set: career_quest (multiplayer sector-based), explore_careers (solo career-specific), or general';

-- Update existing question sets to have a type
-- Mark current broad sets as 'career_quest' type
UPDATE public.question_sets
SET question_set_type = 'career_quest'
WHERE question_set_type IS NULL;
