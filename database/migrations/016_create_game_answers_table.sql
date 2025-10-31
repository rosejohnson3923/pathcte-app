-- Migration: Create game_answers table
-- Description: Track player answers during game sessions

CREATE TABLE IF NOT EXISTS public.game_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- References
  player_id UUID NOT NULL REFERENCES public.game_players(id) ON DELETE CASCADE,
  game_session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,

  -- Answer data
  selected_option_index INTEGER NOT NULL CHECK (selected_option_index >= 0 AND selected_option_index < 10),
  is_correct BOOLEAN NOT NULL,

  -- Timing
  time_taken_ms INTEGER NOT NULL CHECK (time_taken_ms >= 0),
  answered_at TIMESTAMPTZ DEFAULT NOW(),

  -- Score earned for this answer (snapshot at time of answer)
  points_earned INTEGER NOT NULL DEFAULT 0 CHECK (points_earned >= 0),

  -- Prevent duplicate answers
  UNIQUE(player_id, question_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_game_answers_player_id ON public.game_answers(player_id);
CREATE INDEX IF NOT EXISTS idx_game_answers_game_session_id ON public.game_answers(game_session_id);
CREATE INDEX IF NOT EXISTS idx_game_answers_question_id ON public.game_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_game_answers_answered_at ON public.game_answers(answered_at);
CREATE INDEX IF NOT EXISTS idx_game_answers_is_correct ON public.game_answers(player_id, is_correct);

-- Enable Row Level Security
ALTER TABLE public.game_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Players can view their own answers
CREATE POLICY "Players can view own answers"
  ON public.game_answers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.game_players
      WHERE id = player_id AND user_id = auth.uid()
    )
  );

-- Hosts can view all answers in their games
CREATE POLICY "Hosts can view all answers in their games"
  ON public.game_answers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.game_sessions
      WHERE id = game_session_id AND host_id = auth.uid()
    )
  );

-- Players can insert their own answers (server validates via trigger)
CREATE POLICY "Players can insert own answers"
  ON public.game_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.game_players
      WHERE id = player_id AND user_id = auth.uid()
    )
  );

-- Answers are immutable after creation (no updates or deletes)
-- This ensures answer integrity

-- Comments
COMMENT ON TABLE public.game_answers IS 'Player answers submitted during game sessions';
COMMENT ON COLUMN public.game_answers.selected_option_index IS 'Zero-based index of selected option';
COMMENT ON COLUMN public.game_answers.time_taken_ms IS 'Milliseconds taken to answer (server-validated)';
COMMENT ON COLUMN public.game_answers.points_earned IS 'Points awarded for this answer (snapshot)';
