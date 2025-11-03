-- Migration: Add Durable Functions Fields
-- Description: Add timer tracking and connection status fields for Azure Durable Functions
-- Impact: ZERO - Only adds new fields, existing code unaffected

-- ============================================================================
-- Update game_sessions table
-- Add timer tracking fields for Host Entity
-- ============================================================================

ALTER TABLE public.game_sessions
ADD COLUMN IF NOT EXISTS current_question_started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS current_question_time_limit INTEGER DEFAULT 0;

-- Add index for current question queries
CREATE INDEX IF NOT EXISTS idx_game_sessions_current_question_timer
  ON public.game_sessions(id, current_question_started_at)
  WHERE current_question_started_at IS NOT NULL;

COMMENT ON COLUMN public.game_sessions.current_question_started_at IS 'When current question timer started (Host Entity)';
COMMENT ON COLUMN public.game_sessions.current_question_time_limit IS 'Time limit in seconds for current question (Host Entity)';

-- ============================================================================
-- Update game_players table
-- Add connection tracking fields for Player Entity
-- ============================================================================

ALTER TABLE public.game_players
ADD COLUMN IF NOT EXISTS connection_status TEXT DEFAULT 'active' CHECK (connection_status IN ('active', 'disconnected')),
ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ DEFAULT NOW();

-- Add index for connection status queries
CREATE INDEX IF NOT EXISTS idx_game_players_connection_tracking
  ON public.game_players(game_session_id, connection_status, last_seen_at DESC);

COMMENT ON COLUMN public.game_players.connection_status IS 'Real-time connection status tracked by Player Entity';
COMMENT ON COLUMN public.game_players.last_seen_at IS 'Last activity timestamp from Player Entity';

-- ============================================================================
-- Create trigger to keep is_connected in sync with connection_status
-- This maintains backward compatibility with existing code
-- ============================================================================

CREATE OR REPLACE FUNCTION sync_connection_status()
RETURNS TRIGGER AS $$
BEGIN
  -- When connection_status changes, update is_connected
  IF NEW.connection_status = 'active' THEN
    NEW.is_connected := true;
  ELSIF NEW.connection_status = 'disconnected' THEN
    NEW.is_connected := false;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_connection_status_trigger
  BEFORE INSERT OR UPDATE OF connection_status
  ON public.game_players
  FOR EACH ROW
  EXECUTE FUNCTION sync_connection_status();

COMMENT ON FUNCTION sync_connection_status() IS 'Keeps is_connected boolean in sync with connection_status text field for backward compatibility';
