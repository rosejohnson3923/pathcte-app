-- Migration: Allow students to create solo/career_quest games
-- Description: Update RLS policy to allow students to create career quest games

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Teachers can create game sessions" ON public.game_sessions;

-- Create new policy that allows:
-- 1. Teachers to create any game
-- 2. Students to create solo/career_quest games only
CREATE POLICY "Users can create appropriate game sessions"
  ON public.game_sessions FOR INSERT
  WITH CHECK (
    auth.uid() = host_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND (
        -- Teachers can create any game
        user_type = 'teacher'
        OR
        -- Students can only create solo games (career_quest, practice)
        (user_type = 'student' AND game_mode IN ('career_quest', 'solo', 'practice'))
      )
    )
  );

-- Comment
COMMENT ON POLICY "Users can create appropriate game sessions" ON public.game_sessions
IS 'Teachers can create any game; Students can create solo/career_quest games only';
