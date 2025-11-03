-- ============================================================================
-- Schema Inspection Query for Durable Functions
-- Run this in Supabase SQL Editor to get exact schema details
-- ============================================================================

-- 1. Check which tables/views exist
SELECT
  table_schema,
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('game_sessions', 'game_players', 'game_answers', 'player_answers')
ORDER BY table_name;

-- 2. Get all columns for game_sessions
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'game_sessions'
ORDER BY ordinal_position;

-- 3. Get all columns for game_players
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'game_players'
ORDER BY ordinal_position;

-- 4. Get all columns for game_answers (if exists)
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'game_answers'
ORDER BY ordinal_position;

-- 5. Get all columns for player_answers (if exists as table or view)
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'player_answers'
ORDER BY ordinal_position;

-- 6. Check for specific columns we need in game_sessions
SELECT
  column_name,
  EXISTS (SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = 'game_sessions'
          AND column_name = 'current_question_index') as has_current_question_index,
  EXISTS (SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = 'game_sessions'
          AND column_name = 'current_question_started_at') as has_current_question_started_at,
  EXISTS (SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = 'game_sessions'
          AND column_name = 'current_question_time_limit') as has_current_question_time_limit
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'game_sessions'
LIMIT 1;

-- 7. Check for specific columns we need in game_players
SELECT
  column_name,
  EXISTS (SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = 'game_players'
          AND column_name = 'connection_status') as has_connection_status,
  EXISTS (SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = 'game_players'
          AND column_name = 'last_seen_at') as has_last_seen_at,
  EXISTS (SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = 'game_players'
          AND column_name = 'is_connected') as has_is_connected
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'game_players'
LIMIT 1;
