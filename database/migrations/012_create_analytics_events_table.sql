-- Migration: Create analytics_events table
-- Description: Track user actions and events for analytics

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,

  properties JSONB DEFAULT '{}'::jsonb,

  session_id TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON public.analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_created_at ON public.analytics_events(user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own analytics"
  ON public.analytics_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics"
  ON public.analytics_events FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Comments
COMMENT ON TABLE public.analytics_events IS 'User action and event tracking for analytics';
COMMENT ON COLUMN public.analytics_events.user_id IS 'NULL for anonymous events';
COMMENT ON COLUMN public.analytics_events.event_type IS 'Category of event (e.g., game, navigation, purchase)';
COMMENT ON COLUMN public.analytics_events.event_name IS 'Specific event name (e.g., game_started, pathkey_collected)';
COMMENT ON COLUMN public.analytics_events.properties IS 'JSON object with event-specific data';
COMMENT ON COLUMN public.analytics_events.session_id IS 'Browser/app session identifier';
