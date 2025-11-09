-- ============================================
-- Add Admin User Type
-- ============================================
-- Extends the profiles table to support 'admin' user type
-- for system administrators like sysadmin@esposure.gg
-- ============================================

-- First, show what user_type values currently exist
DO $$
DECLARE
  type_record RECORD;
BEGIN
  RAISE NOTICE 'Current user_type distribution:';
  FOR type_record IN
    SELECT user_type, COUNT(*) as count
    FROM profiles
    GROUP BY user_type
    ORDER BY count DESC
  LOOP
    RAISE NOTICE '  % : % users', type_record.user_type, type_record.count;
  END LOOP;
END $$;

-- Drop the existing CHECK constraint
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_user_type_check;

-- Convert legacy 'system' user_type to 'admin'
-- This handles users created before the 'admin' role was standardized
DO $$
DECLARE
  system_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO system_count
  FROM profiles
  WHERE user_type = 'system';

  IF system_count > 0 THEN
    UPDATE profiles
    SET user_type = 'admin'
    WHERE user_type = 'system';

    RAISE NOTICE 'Converted % ''system'' users to ''admin''', system_count;
  END IF;
END $$;

-- Show any rows that would still fail the new constraint
DO $$
DECLARE
  invalid_record RECORD;
  invalid_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO invalid_count
  FROM profiles
  WHERE user_type NOT IN ('student', 'teacher', 'parent', 'admin');

  IF invalid_count > 0 THEN
    RAISE NOTICE 'Found % profiles with invalid user_type values:', invalid_count;
    FOR invalid_record IN
      SELECT id, email, user_type
      FROM profiles
      WHERE user_type NOT IN ('student', 'teacher', 'parent', 'admin')
    LOOP
      RAISE NOTICE '  User: % (%), user_type: %',
        invalid_record.email,
        invalid_record.id,
        invalid_record.user_type;
    END LOOP;
    RAISE EXCEPTION 'Cannot proceed - fix invalid user_type values first';
  ELSE
    RAISE NOTICE 'All user_type values are valid - ready to add constraint';
  END IF;
END $$;

-- Add new CHECK constraint with 'admin' included
-- Use NOT VALID to skip validating existing rows, then validate separately
ALTER TABLE profiles
ADD CONSTRAINT profiles_user_type_check
CHECK (user_type IN ('student', 'teacher', 'parent', 'admin'))
NOT VALID;

-- Now validate the constraint (should succeed since we checked above)
ALTER TABLE profiles
VALIDATE CONSTRAINT profiles_user_type_check;

-- Update comment to reflect new role
COMMENT ON COLUMN profiles.user_type IS 'User role: student, teacher, parent, or admin';

-- Add RLS policy for admins to view all profiles (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles'
    AND policyname = 'Admins can view all profiles'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can view all profiles"
      ON public.profiles FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND user_type = ''admin''
        )
      )';
    RAISE NOTICE 'Created policy: Admins can view all profiles';
  ELSE
    RAISE NOTICE 'Policy already exists: Admins can view all profiles';
  END IF;
END $$;

-- Add RLS policy for admins to update any profile (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles'
    AND policyname = 'Admins can update any profile'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can update any profile"
      ON public.profiles FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND user_type = ''admin''
        )
      )';
    RAISE NOTICE 'Created policy: Admins can update any profile';
  ELSE
    RAISE NOTICE 'Policy already exists: Admins can update any profile';
  END IF;
END $$;

-- Update existing sysadmin@esposure.gg user to admin role
-- (if the user exists and isn't already admin)
DO $$
DECLARE
  user_found BOOLEAN;
  current_type TEXT;
BEGIN
  SELECT TRUE, user_type INTO user_found, current_type
  FROM public.profiles
  WHERE email = 'sysadmin@esposure.gg';

  IF user_found THEN
    IF current_type = 'admin' THEN
      RAISE NOTICE 'sysadmin@esposure.gg already has admin role';
    ELSE
      UPDATE public.profiles
      SET user_type = 'admin'
      WHERE email = 'sysadmin@esposure.gg';
      RAISE NOTICE 'Updated sysadmin@esposure.gg from % to admin role', current_type;
    END IF;
  ELSE
    RAISE NOTICE 'sysadmin@esposure.gg not found - will need to be created manually';
  END IF;
END $$;
