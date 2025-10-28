-- Migration: Create questions table
-- Description: Individual questions belonging to question sets

CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_set_id UUID NOT NULL REFERENCES public.question_sets(id) ON DELETE CASCADE,

  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false')),

  -- Options (Array of {text: string, is_correct: boolean})
  options JSONB NOT NULL,

  -- Settings
  time_limit_seconds INTEGER DEFAULT 30 CHECK (time_limit_seconds > 0),
  points INTEGER DEFAULT 10 CHECK (points > 0),

  -- Media
  image_url TEXT,

  -- Metadata
  order_index INTEGER NOT NULL CHECK (order_index >= 0),
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Basic validation: ensure at least 2 options
  CONSTRAINT valid_options_count CHECK (jsonb_array_length(options) >= 2)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_questions_question_set_id ON public.questions(question_set_id);
CREATE INDEX IF NOT EXISTS idx_questions_order_index ON public.questions(question_set_id, order_index);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_question_type ON public.questions(question_type);

-- Enable Row Level Security
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Questions viewable with question set"
  ON public.questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.question_sets qs
      WHERE qs.id = question_set_id
      AND (qs.is_public = true OR qs.creator_id = auth.uid())
    )
  );

CREATE POLICY "Set creators can manage questions"
  ON public.questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.question_sets qs
      WHERE qs.id = question_set_id AND qs.creator_id = auth.uid()
    )
  );

-- Comments
COMMENT ON TABLE public.questions IS 'Individual questions in question sets';
COMMENT ON COLUMN public.questions.options IS 'JSON array of answer options with is_correct flag';
COMMENT ON COLUMN public.questions.order_index IS 'Display order within the question set';
COMMENT ON COLUMN public.questions.time_limit_seconds IS 'Time allowed to answer in seconds';
