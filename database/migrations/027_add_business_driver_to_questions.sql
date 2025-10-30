-- ============================================
-- Add business_driver to questions table
-- ============================================
-- Based on the 6 P's of Business & Career Success
-- Enables filtering questions by business driver
-- ============================================

-- Add business_driver column
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS business_driver TEXT;

-- Add CHECK constraint for valid business drivers (6 P's)
ALTER TABLE public.questions
ADD CONSTRAINT questions_business_driver_check
CHECK (business_driver IN (
  'people',
  'product',
  'pricing',
  'process',
  'proceeds',
  'profits'
));

-- Create index for business_driver filtering
CREATE INDEX IF NOT EXISTS idx_questions_business_driver ON public.questions(business_driver);

-- Add comment
COMMENT ON COLUMN public.questions.business_driver IS 'Business driver based on 6 P''s of Business & Career Success: people, product, pricing, process, proceeds, profits';
