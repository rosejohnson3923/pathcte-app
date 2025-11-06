-- ============================================
-- ADD TIME MULTIPLIER TO GAME MODE CONFIG
-- ============================================
-- Adds configurable time multiplier per game mode
-- Multiplier is applied to question time limits:
--   1.0 = normal time (100%)
--   0.5 = half time (50% - faster gameplay)
--   2.0 = double time (200% - slower gameplay)
-- ============================================

-- Add time_multiplier column to game_mode_scoring
ALTER TABLE game_mode_scoring
ADD COLUMN IF NOT EXISTS time_multiplier NUMERIC(3,2) NOT NULL DEFAULT 1.0;

-- Set Lightning! Path (speed_run) to half time for faster gameplay
UPDATE game_mode_scoring
SET time_multiplier = 0.5
WHERE game_mode = 'speed_run';

-- Keep all other modes at normal time (1.0 is already default)

-- Add comment
COMMENT ON COLUMN game_mode_scoring.time_multiplier IS
'Time multiplier applied to question time limits. 1.0 = normal, 0.5 = half time, 2.0 = double time.';

-- Update table comment
COMMENT ON TABLE game_mode_scoring IS
'Configurable scoring values and time multipliers per game mode. Set penalties to 0 to disable them. Time multiplier affects question time limits (0.5 = half time, 1.0 = normal, 2.0 = double).';
