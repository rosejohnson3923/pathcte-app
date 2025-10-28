-- Migration: Create pathkeys table
-- Description: Collectible digital pathkeys representing careers, skills, and milestones

CREATE TABLE IF NOT EXISTS public.pathkeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  key_type TEXT NOT NULL CHECK (key_type IN ('career', 'skill', 'industry', 'milestone', 'mystery')),

  -- Career specific (if key_type = 'career')
  career_id UUID REFERENCES public.careers(id) ON DELETE SET NULL,

  -- Visual
  image_url TEXT NOT NULL,
  image_url_animated TEXT,
  color_primary TEXT,
  color_secondary TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  release_date DATE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_pathkeys_rarity ON public.pathkeys(rarity);
CREATE INDEX IF NOT EXISTS idx_pathkeys_key_type ON public.pathkeys(key_type);
CREATE INDEX IF NOT EXISTS idx_pathkeys_career_id ON public.pathkeys(career_id);
CREATE INDEX IF NOT EXISTS idx_pathkeys_key_code ON public.pathkeys(key_code);
CREATE INDEX IF NOT EXISTS idx_pathkeys_is_active ON public.pathkeys(is_active);
CREATE INDEX IF NOT EXISTS idx_pathkeys_name_search ON public.pathkeys USING gin(to_tsvector('english', name));

-- Enable Row Level Security
ALTER TABLE public.pathkeys ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Pathkeys viewable by all authenticated users"
  ON public.pathkeys FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Comments
COMMENT ON TABLE public.pathkeys IS 'Collectible digital pathkeys';
COMMENT ON COLUMN public.pathkeys.key_code IS 'Unique identifier code for pathkey';
COMMENT ON COLUMN public.pathkeys.rarity IS 'Rarity tier: common, uncommon, rare, epic, legendary';
COMMENT ON COLUMN public.pathkeys.key_type IS 'Type: career, skill, industry, milestone, mystery';
