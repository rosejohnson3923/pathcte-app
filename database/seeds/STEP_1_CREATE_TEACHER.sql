-- ============================================
-- STEP 1: CREATE TEST TEACHER ACCOUNT
-- ============================================
-- Run this FIRST, then run STEP_2_SEED_ALL.sql
-- ============================================

-- Create test teacher in auth.users
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Insert into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'teacher@test.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
    '',
    '',
    '',
    ''
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO new_user_id;

  -- If user already existed, get their ID
  IF new_user_id IS NULL THEN
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'teacher@test.com';
    RAISE NOTICE 'Teacher user already exists with ID: %', new_user_id;
  ELSE
    RAISE NOTICE 'Created new teacher user with ID: %', new_user_id;
  END IF;

  -- Create or update profile
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    user_type,
    school_id,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    'teacher@test.com',
    'Test Teacher',
    'teacher',
    NULL,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    user_type = 'teacher',
    full_name = 'Test Teacher',
    updated_at = NOW();

  RAISE NOTICE '✅ Teacher account ready!';
  RAISE NOTICE 'Email: teacher@test.com';
  RAISE NOTICE 'Password: password123';
  RAISE NOTICE '';
  RAISE NOTICE 'Now run STEP_2_SEED_ALL.sql to populate the database!';
END $$;

-- Verify teacher was created
SELECT
  id,
  email,
  full_name,
  user_type,
  created_at
FROM public.profiles
WHERE email = 'teacher@test.com';
