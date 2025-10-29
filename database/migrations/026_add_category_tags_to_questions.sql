-- ============================================
-- Add category and tags to questions table
-- ============================================
-- Allows filtering questions by workplace skill category
-- and sub-topics for focused lesson plans
-- ============================================

-- Add category column
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS category TEXT;

-- Add tags array column
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Add CHECK constraint for valid categories
ALTER TABLE public.questions
ADD CONSTRAINT questions_category_check
CHECK (category IN (
  'time_management',
  'client_interaction',
  'problem_solving',
  'ethics',
  'teamwork',
  'safety',
  'career_entry'
));

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS idx_questions_category ON public.questions(category);

-- Create GIN index for tags array searching
CREATE INDEX IF NOT EXISTS idx_questions_tags ON public.questions USING GIN(tags);

-- Add comments
COMMENT ON COLUMN public.questions.category IS 'Workplace skill category: time_management, client_interaction, problem_solving, ethics, teamwork, safety, career_entry';
COMMENT ON COLUMN public.questions.tags IS 'Array of sub-topic tags like ["copyright", "networking", "leadership"] for granular filtering';
