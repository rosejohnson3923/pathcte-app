-- ============================================
-- CREATE: Server-side function to check if email exists
-- ============================================
-- This function bypasses RLS to allow checking for duplicate emails
-- during signup without revealing user information
-- ============================================

CREATE OR REPLACE FUNCTION check_email_exists(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Temporarily disable RLS for this function
  SET LOCAL row_security = off;

  -- Return true if email exists, false otherwise
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE LOWER(email) = LOWER(p_email)
  );
END;
$$;

-- Grant execute permission to all users (including anonymous)
GRANT EXECUTE ON FUNCTION check_email_exists(TEXT) TO anon, authenticated;

-- Add comment
COMMENT ON FUNCTION check_email_exists(TEXT) IS
'Checks if an email already exists in the profiles table. Runs with elevated privileges to bypass RLS for signup validation.';
