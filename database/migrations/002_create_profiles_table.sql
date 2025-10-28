-- Migration: Create profiles table
-- Description: User profiles extending Supabase auth.users

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('student', 'teacher', 'parent')),
  username TEXT UNIQUE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  tokens INTEGER DEFAULT 0 CHECK (tokens >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Student specific
  grade_level INTEGER CHECK (grade_level BETWEEN 1 AND 12),
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,

  -- Teacher specific
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'plus', 'flex')),
  subscription_expires_at TIMESTAMPTZ,

  -- Settings
  settings JSONB DEFAULT '{}'::jsonb,

  -- Username validation
  CONSTRAINT valid_username CHECK (username ~* '^[a-zA-Z0-9_-]{3,20}$')
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON public.profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON public.profiles(subscription_tier);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Comments
COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth';
COMMENT ON COLUMN public.profiles.user_type IS 'User role: student, teacher, or parent';
COMMENT ON COLUMN public.profiles.tokens IS 'Virtual currency for in-app purchases';
COMMENT ON COLUMN public.profiles.subscription_tier IS 'Teacher subscription level';
