-- ============================================
-- Fix Admin RLS Infinite Recursion
-- ============================================
-- Removes the problematic RLS policies that cause
-- infinite recursion when checking admin status
-- ============================================

-- Drop the policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

-- Instead of recursive policies, admins should use the service role
-- or we can add a simpler policy that doesn't cause recursion

-- For now, we'll rely on existing policies:
-- - Users can view their own profile
-- - Teachers can view their students
-- - Service role for admin operations

-- Add a comment explaining admin access
COMMENT ON TABLE public.profiles IS
'User profiles. Admin users should use service role key for system-wide access to avoid RLS recursion.';
