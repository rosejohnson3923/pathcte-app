-- Migration 023: Add current_question_index to game_sessions
-- Purpose: Persist the current question index so it survives page refreshes/navigation

ALTER TABLE game_sessions
ADD COLUMN current_question_index INTEGER NOT NULL DEFAULT 0;

-- Add index for faster queries
CREATE INDEX idx_game_sessions_current_question ON game_sessions(current_question_index);

-- Add helpful comment
COMMENT ON COLUMN game_sessions.current_question_index IS 'Current question index (0-based) for in-progress games. Updated by host when advancing questions.';
