-- Migration: Create question_sets table
-- Description: Collections of questions created by teachers

CREATE TABLE IF NOT EXISTS public.question_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,

  -- Classification
  subject TEXT NOT NULL,
  grade_level INTEGER[],
  career_sector TEXT,
  tags TEXT[],

  -- Status
  is_public BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,

  -- Stats
  times_played INTEGER DEFAULT 0 CHECK (times_played >= 0),
  average_score DECIMAL CHECK (average_score >= 0 AND average_score <= 100),
  total_questions INTEGER DEFAULT 0 CHECK (total_questions >= 0),

  -- Metadata
  thumbnail_url TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard', 'mixed')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_question_sets_creator_id ON public.question_sets(creator_id);
CREATE INDEX IF NOT EXISTS idx_question_sets_subject ON public.question_sets(subject);
CREATE INDEX IF NOT EXISTS idx_question_sets_is_public ON public.question_sets(is_public);
CREATE INDEX IF NOT EXISTS idx_question_sets_is_verified ON public.question_sets(is_verified);
CREATE INDEX IF NOT EXISTS idx_question_sets_title_search ON public.question_sets USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_question_sets_tags ON public.question_sets USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_question_sets_times_played ON public.question_sets(times_played DESC);

-- Enable Row Level Security
ALTER TABLE public.question_sets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public sets viewable by all authenticated users"
  ON public.question_sets FOR SELECT
  TO authenticated
  USING (is_public = true OR auth.uid() = creator_id);

CREATE POLICY "Teachers can create sets"
  ON public.question_sets FOR INSERT
  WITH CHECK (
    auth.uid() = creator_id AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'teacher')
  );

CREATE POLICY "Creators can update own sets"
  ON public.question_sets FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete own sets"
  ON public.question_sets FOR DELETE
  USING (auth.uid() = creator_id);

-- Comments
COMMENT ON TABLE public.question_sets IS 'Collections of questions for games';
COMMENT ON COLUMN public.question_sets.is_public IS 'Whether set is visible to all users';
COMMENT ON COLUMN public.question_sets.is_verified IS 'Whether set has been verified by admin';
COMMENT ON COLUMN public.question_sets.times_played IS 'Number of times this set has been used in games';
