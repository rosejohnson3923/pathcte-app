-- Migration: Create user_pathkeys table
-- Description: Junction table tracking user pathkey ownership

CREATE TABLE IF NOT EXISTS public.user_pathkeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pathkey_id UUID NOT NULL REFERENCES public.pathkeys(id) ON DELETE CASCADE,
  acquired_at TIMESTAMPTZ DEFAULT NOW(),
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  is_favorite BOOLEAN DEFAULT false,

  UNIQUE(user_id, pathkey_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_pathkeys_user_id ON public.user_pathkeys(user_id);
CREATE INDEX IF NOT EXISTS idx_user_pathkeys_pathkey_id ON public.user_pathkeys(pathkey_id);
CREATE INDEX IF NOT EXISTS idx_user_pathkeys_acquired_at ON public.user_pathkeys(user_id, acquired_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_pathkeys_is_favorite ON public.user_pathkeys(user_id, is_favorite) WHERE is_favorite = true;

-- Enable Row Level Security
ALTER TABLE public.user_pathkeys ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own pathkeys"
  ON public.user_pathkeys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pathkeys"
  ON public.user_pathkeys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pathkeys"
  ON public.user_pathkeys FOR UPDATE
  USING (auth.uid() = user_id);

-- Comments
COMMENT ON TABLE public.user_pathkeys IS 'User pathkey collection and ownership';
COMMENT ON COLUMN public.user_pathkeys.quantity IS 'Number of this pathkey owned (for duplicates)';
COMMENT ON COLUMN public.user_pathkeys.is_favorite IS 'Whether user has favorited this pathkey';
