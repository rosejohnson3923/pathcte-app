-- Master Seed Script
-- Description: Run all seed scripts in order
-- Usage: Execute this file to seed the entire database with test data

-- IMPORTANT: Before running this script, ensure you have:
-- 1. A teacher profile created (user_type = 'teacher')
-- 2. Updated the teacher UUID in 003_seed_question_sets.sql if needed

\echo '==================================='
\echo 'Starting Database Seeding Process'
\echo '==================================='

\echo ''
\echo '[1/3] Seeding Careers...'
\i 001_seed_careers.sql

\echo ''
\echo '[2/3] Seeding Pathkeys...'
\i 002_seed_pathkeys.sql

\echo ''
\echo '[3/3] Seeding Question Sets and Questions...'
\i 003_seed_question_sets.sql

\echo ''
\echo '==================================='
\echo 'Database Seeding Complete!'
\echo '==================================='

\echo ''
\echo 'Summary:'
SELECT
  'Careers' as table_name,
  COUNT(*) as records
FROM public.careers
WHERE is_verified = true
UNION ALL
SELECT
  'Pathkeys' as table_name,
  COUNT(*) as records
FROM public.pathkeys
WHERE is_active = true
UNION ALL
SELECT
  'Question Sets' as table_name,
  COUNT(*) as records
FROM public.question_sets
WHERE is_public = true AND is_verified = true
UNION ALL
SELECT
  'Questions' as table_name,
  COUNT(*) as records
FROM public.questions
WHERE question_set_id IN (
  SELECT id FROM public.question_sets WHERE is_public = true
);

\echo ''
\echo 'You can now test the game system!'
\echo 'Try creating a game with one of the question sets.'
