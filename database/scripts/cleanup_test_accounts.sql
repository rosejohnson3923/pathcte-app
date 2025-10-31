-- Cleanup Script: Delete all game data for test accounts
-- Accounts: teacher@esposure.gg and student@esposure.gg
-- This allows for fresh testing

DO $$
DECLARE
  teacher_id UUID;
  student_id UUID;
BEGIN
  -- Get user IDs
  SELECT id INTO teacher_id FROM auth.users WHERE email = 'teacher@esposure.gg';
  SELECT id INTO student_id FROM auth.users WHERE email = 'student@esposure.gg';

  IF teacher_id IS NULL OR student_id IS NULL THEN
    RAISE NOTICE 'Warning: Could not find one or both test accounts';
    RAISE NOTICE 'Teacher ID: %', teacher_id;
    RAISE NOTICE 'Student ID: %', student_id;
    RETURN;
  END IF;

  RAISE NOTICE 'Found test accounts:';
  RAISE NOTICE 'Teacher ID: %', teacher_id;
  RAISE NOTICE 'Student ID: %', student_id;

  -- 1. Delete game answers for these users
  RAISE NOTICE 'Deleting game answers...';
  DELETE FROM public.game_answers
  WHERE player_id IN (
    SELECT id FROM public.game_players
    WHERE user_id IN (teacher_id, student_id)
  );

  -- 2. Delete game players for these users
  RAISE NOTICE 'Deleting game players...';
  DELETE FROM public.game_players
  WHERE user_id IN (teacher_id, student_id);

  -- 3. Delete game sessions hosted by these users
  -- Note: CASCADE will handle related records
  RAISE NOTICE 'Deleting game sessions...';
  DELETE FROM public.game_sessions
  WHERE host_id IN (teacher_id, student_id);

  -- 4. Optional: Reset user pathkeys (if you want completely fresh)
  RAISE NOTICE 'Clearing user pathkeys...';
  DELETE FROM public.user_pathkeys
  WHERE user_id IN (teacher_id, student_id);

  RAISE NOTICE 'Cleanup complete! Test accounts are ready for fresh games.';
END $$;
