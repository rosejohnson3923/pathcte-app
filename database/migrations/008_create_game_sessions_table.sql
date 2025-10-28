-- Migration: Create game_sessions table
-- Description: Game sessions hosted by teachers

CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_code TEXT UNIQUE NOT NULL,

  host_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_set_id UUID NOT NULL REFERENCES public.question_sets(id) ON DELETE RESTRICT,

  game_mode TEXT NOT NULL,

  -- Status
  status TEXT NOT NULL CHECK (status IN ('waiting', 'in_progress', 'completed', 'cancelled')),

  -- Settings
  settings JSONB DEFAULT '{}'::jsonb, -- Game-specific settings
  max_players INTEGER DEFAULT 60 CHECK (max_players > 0 AND max_players <= 1000),

  -- Timing
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,

  -- Results
  total_players INTEGER DEFAULT 0 CHECK (total_players >= 0),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure timing logic
  CONSTRAINT valid_timing CHECK (
    (started_at IS NULL AND ended_at IS NULL) OR
    (started_at IS NOT NULL AND ended_at IS NULL) OR
    (started_at IS NOT NULL AND ended_at IS NOT NULL AND ended_at > started_at)
  )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_game_sessions_game_code ON public.game_sessions(game_code);
CREATE INDEX IF NOT EXISTS idx_game_sessions_host_id ON public.game_sessions(host_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_question_set_id ON public.game_sessions(question_set_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_status ON public.game_sessions(status);
CREATE INDEX IF NOT EXISTS idx_game_sessions_started_at ON public.game_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_sessions_game_mode ON public.game_sessions(game_mode);

-- Enable Row Level Security
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Note: Player access policy will be added in migration 009 after game_players table exists
CREATE POLICY "Game sessions viewable by host"
  ON public.game_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = host_id);

CREATE POLICY "Teachers can create game sessions"
  ON public.game_sessions FOR INSERT
  WITH CHECK (
    auth.uid() = host_id AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'teacher')
  );

CREATE POLICY "Hosts can update own sessions"
  ON public.game_sessions FOR UPDATE
  USING (auth.uid() = host_id);

-- Comments
COMMENT ON TABLE public.game_sessions IS 'Game sessions hosted by teachers';
COMMENT ON COLUMN public.game_sessions.game_code IS 'Unique 6-character code for joining game';
COMMENT ON COLUMN public.game_sessions.game_mode IS 'Type of game being played';
COMMENT ON COLUMN public.game_sessions.settings IS 'JSON settings specific to game mode';
