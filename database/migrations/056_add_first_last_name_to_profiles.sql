-- Migration: Add first_name and last_name to profiles table
-- Description: Add first_name and last_name columns, extract from existing display_name, and update trigger

-- ============================================================================
-- Step 1: Add first_name and last_name columns
-- ============================================================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT;

-- ============================================================================
-- Step 2: Populate first_name and last_name from existing display_name
-- ============================================================================
-- Split display_name into first_name and last_name
-- For names like "John Doe", first_name = "John", last_name = "Doe"
-- For single names like "student1", first_name = "student1", last_name = NULL
UPDATE public.profiles
SET
  first_name = CASE
    WHEN display_name IS NOT NULL AND display_name != '' THEN
      CASE
        WHEN position(' ' in display_name) > 0 THEN
          split_part(display_name, ' ', 1)
        ELSE
          display_name
      END
    ELSE
      split_part(email, '@', 1)
  END,
  last_name = CASE
    WHEN display_name IS NOT NULL AND display_name != '' AND position(' ' in display_name) > 0 THEN
      substring(display_name from position(' ' in display_name) + 1)
    ELSE
      NULL
  END
WHERE first_name IS NULL;

-- ============================================================================
-- Step 3: Update the profile creation trigger to populate first_name and last_name
-- ============================================================================
CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER AS $$
DECLARE
  full_name_value TEXT;
  first_name_value TEXT;
  last_name_value TEXT;
BEGIN
  -- Get full_name from metadata, fallback to email username
  full_name_value := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));

  -- Split full_name into first and last
  IF position(' ' in full_name_value) > 0 THEN
    first_name_value := split_part(full_name_value, ' ', 1);
    last_name_value := substring(full_name_value from position(' ' in full_name_value) + 1);
  ELSE
    first_name_value := full_name_value;
    last_name_value := NULL;
  END IF;

  INSERT INTO public.profiles (id, email, user_type, display_name, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    full_name_value,
    first_name_value,
    last_name_value
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION create_profile_for_new_user() IS 'Automatically create profile with first_name and last_name when user signs up';

-- ============================================================================
-- Step 4: Add indexes for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_first_name ON public.profiles(first_name);
CREATE INDEX IF NOT EXISTS idx_profiles_last_name ON public.profiles(last_name);

-- ============================================================================
-- Step 5: Add comments
-- ============================================================================
COMMENT ON COLUMN public.profiles.first_name IS 'User first name extracted from full name during signup';
COMMENT ON COLUMN public.profiles.last_name IS 'User last name extracted from full name during signup';
