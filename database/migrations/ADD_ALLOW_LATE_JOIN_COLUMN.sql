-- ============================================
-- ADD MISSING COLUMNS TO GAME_SESSIONS
-- ============================================
-- Adds missing columns referenced in application code
-- Run this in Supabase SQL Editor
-- ============================================

-- Add the allow_late_join column
ALTER TABLE public.game_sessions
ADD COLUMN IF NOT EXISTS allow_late_join BOOLEAN NOT NULL DEFAULT false;

-- Add the is_public column
ALTER TABLE public.game_sessions
ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT true;

-- Add the metadata column
ALTER TABLE public.game_sessions
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_game_sessions_allow_late_join
ON public.game_sessions(allow_late_join);

CREATE INDEX IF NOT EXISTS idx_game_sessions_is_public
ON public.game_sessions(is_public);

-- Add comments
COMMENT ON COLUMN public.game_sessions.allow_late_join
IS 'Whether players can join after the game has started';

COMMENT ON COLUMN public.game_sessions.is_public
IS 'Whether the game appears in public game listings';

COMMENT ON COLUMN public.game_sessions.metadata
IS 'Additional metadata for the game session';

-- Verify all columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'game_sessions'
  AND column_name IN ('allow_late_join', 'is_public', 'metadata')
ORDER BY column_name;
