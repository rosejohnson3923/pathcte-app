-- Migration: Create careers table
-- Description: Career information database from O*NET and other sources

CREATE TABLE IF NOT EXISTS public.careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  onet_code TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT,

  -- Classification
  industry TEXT NOT NULL,
  sector TEXT NOT NULL,
  career_cluster TEXT,

  -- Requirements
  education_level TEXT[],
  certifications TEXT[],
  skills JSONB DEFAULT '[]'::jsonb,

  -- Compensation
  salary_min INTEGER,
  salary_max INTEGER,
  salary_median INTEGER,
  salary_currency TEXT DEFAULT 'USD',

  -- Job Market
  growth_rate DECIMAL,
  job_outlook TEXT,
  employment_2023 INTEGER,
  employment_2033_projected INTEGER,

  -- Content
  day_in_life_text TEXT,
  video_url TEXT,
  tasks TEXT[],
  work_environment TEXT,

  -- Related
  related_careers UUID[],

  -- Metadata
  content_last_updated DATE,
  is_verified BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_careers_onet_code ON public.careers(onet_code);
CREATE INDEX IF NOT EXISTS idx_careers_industry ON public.careers(industry);
CREATE INDEX IF NOT EXISTS idx_careers_sector ON public.careers(sector);
CREATE INDEX IF NOT EXISTS idx_careers_title ON public.careers(title);
CREATE INDEX IF NOT EXISTS idx_careers_title_search ON public.careers USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_careers_is_verified ON public.careers(is_verified);

-- Enable Row Level Security
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Careers viewable by all authenticated users"
  ON public.careers FOR SELECT
  TO authenticated
  USING (true);

-- Comments
COMMENT ON TABLE public.careers IS 'Career information from O*NET and other sources';
COMMENT ON COLUMN public.careers.onet_code IS 'O*NET Standard Occupational Classification code';
COMMENT ON COLUMN public.careers.salary_median IS 'Median annual salary in USD';
COMMENT ON COLUMN public.careers.growth_rate IS 'Projected job growth rate percentage';
