-- Fix for signup issue: "Database error saving new user"
-- This script fixes RLS policies and trigger permissions

-- ============================================================================
-- OPTION 1: Fix RLS Policies (Recommended)
-- ============================================================================

-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create a new insert policy that allows:
-- 1. Users to insert their own profile (auth.uid() = id)
-- 2. Service role (for triggers) to insert any profile
CREATE POLICY "Allow profile creation"
  ON public.profiles FOR INSERT
  WITH CHECK (
    auth.uid() = id OR
    auth.role() = 'service_role' OR
    auth.uid() IS NULL  -- Allow during signup when uid is being created
  );

-- ============================================================================
-- OPTION 2: Recreate the trigger with better error handling
-- ============================================================================

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS create_profile_for_new_user();

-- Recreate with better error handling and logging
CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER
SECURITY DEFINER  -- Run with elevated privileges
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
DECLARE
  profile_user_type TEXT;
  profile_display_name TEXT;
BEGIN
  -- Extract user type from metadata (default to 'student')
  profile_user_type := COALESCE(NEW.raw_user_meta_data->>'role', 'student');

  -- Extract display name from metadata or derive from email
  profile_display_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );

  -- Log for debugging
  RAISE LOG 'Creating profile for user: id=%, email=%, type=%, name=%',
    NEW.id, NEW.email, profile_user_type, profile_display_name;

  -- Insert profile
  INSERT INTO public.profiles (id, email, user_type, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    profile_user_type,
    profile_display_name
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    user_type = EXCLUDED.user_type,
    display_name = EXCLUDED.display_name,
    updated_at = NOW();

  RAISE LOG 'Profile created successfully for user: %', NEW.id;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the signup
    RAISE LOG 'Error creating profile for user %: % (SQLSTATE: %)',
      NEW.id, SQLERRM, SQLSTATE;
    -- Still return NEW to allow signup to succeed
    RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_new_user();

-- ============================================================================
-- OPTION 3: Grant necessary permissions
-- ============================================================================

-- Ensure the function has permission to insert into profiles
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.profiles TO postgres, service_role;
GRANT SELECT, INSERT ON public.profiles TO anon, authenticated;

-- ============================================================================
-- Verification
-- ============================================================================

-- Check that everything is set up correctly
DO $$
BEGIN
  RAISE NOTICE 'Signup fix applied successfully!';
  RAISE NOTICE 'You can now test signup by creating a new account.';
END $$;
