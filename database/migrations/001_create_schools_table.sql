-- Migration: Create schools table
-- Description: Core table for school organizations

CREATE TABLE IF NOT EXISTS public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  district TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'US',
  license_type TEXT CHECK (license_type IN ('free', 'school', 'district')),
  max_students INTEGER,
  max_teachers INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_schools_name ON public.schools(name);
CREATE INDEX IF NOT EXISTS idx_schools_country ON public.schools(country);
CREATE INDEX IF NOT EXISTS idx_schools_state ON public.schools(state);

-- Comments
COMMENT ON TABLE public.schools IS 'School organizations that use Pathket';
COMMENT ON COLUMN public.schools.license_type IS 'Type of license: free, school, district';
COMMENT ON COLUMN public.schools.max_students IS 'Maximum number of students allowed';
COMMENT ON COLUMN public.schools.max_teachers IS 'Maximum number of teachers allowed';
