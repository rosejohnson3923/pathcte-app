-- Check RLS status and policies for game_sessions
SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('game_sessions', 'game_players');

-- Check RLS policies for game_sessions
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('game_sessions', 'game_players')
ORDER BY tablename, policyname;
