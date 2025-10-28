-- Migration: Create game_players table
-- Description: Players participating in game sessions

CREATE TABLE IF NOT EXISTS public.game_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  display_name TEXT NOT NULL,

  -- Score tracking
  score INTEGER DEFAULT 0 CHECK (score >= 0),
  correct_answers INTEGER DEFAULT 0 CHECK (correct_answers >= 0),
  total_answers INTEGER DEFAULT 0 CHECK (total_answers >= 0),

  -- Status
  is_connected BOOLEAN DEFAULT true,
  placement INTEGER CHECK (placement > 0),

  -- Rewards
  tokens_earned INTEGER DEFAULT 0 CHECK (tokens_earned >= 0),
  pathkeys_earned UUID[],

  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,

  UNIQUE(game_session_id, user_id),
  UNIQUE(game_session_id, display_name),

  -- Ensure answer counts are valid
  CONSTRAINT valid_answer_counts CHECK (correct_answers <= total_answers),

  -- Ensure timing logic
  CONSTRAINT valid_player_timing CHECK (
    left_at IS NULL OR left_at > joined_at
  )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_game_players_game_session_id ON public.game_players(game_session_id);
CREATE INDEX IF NOT EXISTS idx_game_players_user_id ON public.game_players(user_id);
CREATE INDEX IF NOT EXISTS idx_game_players_score ON public.game_players(game_session_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_game_players_placement ON public.game_players(game_session_id, placement);
CREATE INDEX IF NOT EXISTS idx_game_players_is_connected ON public.game_players(game_session_id, is_connected);

-- Enable Row Level Security
ALTER TABLE public.game_players ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Game players viewable by session participants"
  ON public.game_players FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.game_sessions gs
      WHERE gs.id = game_session_id
      AND (
        gs.host_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.game_players WHERE game_session_id = gs.id AND user_id = auth.uid())
      )
    )
  );

CREATE POLICY "Users can insert self as player"
  ON public.game_players FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Players can update own record"
  ON public.game_players FOR UPDATE
  USING (auth.uid() = user_id);

-- Comments
COMMENT ON TABLE public.game_players IS 'Players participating in game sessions';
COMMENT ON COLUMN public.game_players.user_id IS 'NULL for guest players';
COMMENT ON COLUMN public.game_players.display_name IS 'Name shown in game (unique per session)';
COMMENT ON COLUMN public.game_players.placement IS 'Final ranking in game (1st, 2nd, 3rd, etc)';
COMMENT ON COLUMN public.game_players.pathkeys_earned IS 'Array of pathkey IDs earned in this game';

-- ============================================================================
-- Add player access policy to game_sessions (deferred from migration 008)
-- ============================================================================
CREATE POLICY "Game sessions viewable by players"
  ON public.game_sessions FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.game_players WHERE game_session_id = id AND user_id = auth.uid())
  );
