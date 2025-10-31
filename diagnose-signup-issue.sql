-- Diagnostic queries for signup issue
-- Run these in your Supabase SQL Editor

-- 1. Check if the trigger exists
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 2. Check if the function exists
SELECT
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_name = 'create_profile_for_new_user';

-- 3. Check profiles table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 4. Check RLS policies on profiles table
SELECT
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- 5. Test if we can manually create a profile
-- (This will show you the actual error)
-- Replace the UUID with a test value
DO $$
DECLARE
  test_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO public.profiles (id, email, user_type, display_name)
  VALUES (
    test_id,
    'test@example.com',
    'parent',
    'Test User'
  );

  RAISE NOTICE 'Profile insert successful!';

  -- Clean up
  DELETE FROM public.profiles WHERE id = test_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Profile insert failed: %', SQLERRM;
END $$;
