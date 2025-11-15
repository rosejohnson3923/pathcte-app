-- ============================================
-- CREATE: Server-side functions for teacher analytics
-- ============================================
-- These functions bypass RLS to allow teachers to get student data
-- without affecting the RLS policies that control UI permissions
-- ============================================

-- Function to get student IDs and basic info for a teacher
CREATE OR REPLACE FUNCTION get_teacher_students(p_teacher_id UUID)
RETURNS TABLE(
  student_id UUID,
  email TEXT,
  display_name TEXT,
  user_type TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Temporarily disable RLS for this function
  SET LOCAL row_security = off;

  RETURN QUERY
  SELECT DISTINCT
    p.id as student_id,
    p.email,
    p.display_name,
    p.user_type
  FROM game_players gp
  JOIN game_sessions gs ON gs.id = gp.game_session_id
  JOIN profiles p ON p.id = gp.user_id
  WHERE gs.host_id = p_teacher_id
    AND gp.user_id IS NOT NULL
    AND p.user_type = 'student'
  ORDER BY p.display_name;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_teacher_students(UUID) TO authenticated;

-- Add comment
COMMENT ON FUNCTION get_teacher_students(UUID) IS
'Returns student profiles for students who have played in games hosted by the specified teacher. Runs with elevated privileges to bypass RLS.';
