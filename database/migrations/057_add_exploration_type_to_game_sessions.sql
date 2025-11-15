-- ============================================
-- ADD: exploration_type column to game_sessions
-- ============================================
-- This column is used to determine which type of pathkey
-- section should be awarded when the game ends.
-- Values: 'career', 'industry', 'cluster'
-- ============================================

-- Add exploration_type column
ALTER TABLE public.game_sessions
ADD COLUMN IF NOT EXISTS exploration_type TEXT
CHECK (exploration_type IN ('career', 'industry', 'cluster'));

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_game_sessions_exploration_type
ON public.game_sessions(exploration_type);

-- Update existing career_quest games to have exploration_type='career'
UPDATE public.game_sessions
SET exploration_type = 'career'
WHERE game_mode = 'career_quest'
  AND exploration_type IS NULL;

-- Add comment
COMMENT ON COLUMN public.game_sessions.exploration_type IS
'Type of exploration for pathkey awards: career (Section 1), industry (Section 2), cluster (also Section 2)';
