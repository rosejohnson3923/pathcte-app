-- ============================================
-- Fix Infinite Recursion in game_sessions INSERT Policy
-- ============================================
-- Issue: The INSERT policy references game_sessions.game_mode
-- which causes infinite recursion when combined with the SELECT
-- policy that references game_players (added in migration 051)
--
-- Solution: Update INSERT policy to use unqualified column reference
-- which automatically uses the values from the row being inserted,
-- avoiding the need to SELECT from game_sessions
-- ============================================

-- Create helper function to get user type without triggering RLS
-- This function runs with SECURITY DEFINER to bypass RLS on profiles table
CREATE OR REPLACE FUNCTION public.get_user_type(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN (SELECT user_type FROM public.profiles WHERE id = user_id);
END;
$$;

-- Drop ALL INSERT policies on game_sessions to ensure clean slate
DROP POLICY IF EXISTS "Users can create appropriate game sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "game_sessions_teacher_insert" ON public.game_sessions;

-- Recreate the single unified INSERT policy using the helper function
-- Teachers can create any game type
-- Students can only create career_quest, solo, and practice modes
CREATE POLICY "Users can create appropriate game sessions"
ON public.game_sessions
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = host_id
  AND (
    -- Teacher check (can create any mode)
    get_user_type(auth.uid()) = 'teacher'
    OR
    -- Student check (restricted modes only)
    (
      get_user_type(auth.uid()) = 'student'
      AND game_mode IN ('career_quest', 'solo', 'practice')
    )
  )
);

-- Verify the policy was created correctly
SELECT
  policyname,
  cmd,
  CASE
    WHEN with_check LIKE '%game_sessions.game_mode%' THEN 'ERROR: Still has table prefix!'
    WHEN with_check LIKE '%game_mode%' THEN 'OK: No table prefix'
    ELSE 'Unknown'
  END as status
FROM pg_policies
WHERE tablename = 'game_sessions' AND cmd = 'INSERT';
