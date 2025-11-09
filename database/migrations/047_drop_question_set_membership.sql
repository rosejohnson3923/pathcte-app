-- Migration: Drop question_set_membership table
-- Reason: Redundant - questions already have question_set_id foreign key
-- This table provided no value since we use 1:1 relationship, not many-to-many

DROP TABLE IF EXISTS question_set_membership CASCADE;

-- Note: questions table retains question_set_id foreign key
-- All queries use: SELECT * FROM questions WHERE question_set_id = ?
