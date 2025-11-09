-- Migration 038: Verify and Complete RLS Fix
-- ============================================
-- This migration ensures both directions of the RLS circular dependency are fixed

-- First, verify the security definer function exists
-- If migration 037 was applied correctly, this function should exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc
        WHERE proname = 'user_can_view_game_session'
    ) THEN
        RAISE NOTICE 'Creating user_can_view_game_session function (migration 037 may not have been applied)';

        CREATE OR REPLACE FUNCTION public.user_can_view_game_session(session_id UUID)
        RETURNS BOOLEAN
        LANGUAGE plpgsql
        SECURITY DEFINER
        STABLE
        AS $func$
        BEGIN
          RETURN EXISTS (
            SELECT 1 FROM public.game_sessions
            WHERE id = session_id AND host_id = auth.uid()
          ) OR EXISTS (
            SELECT 1 FROM public.game_players
            WHERE game_session_id = session_id AND user_id = auth.uid()
          );
        END;
        $func$;

        COMMENT ON FUNCTION public.user_can_view_game_session IS 'Security definer function to check game session access without RLS recursion';
    ELSE
        RAISE NOTICE 'user_can_view_game_session function already exists';
    END IF;
END $$;

-- Drop ALL existing policies on game_sessions that might cause recursion
DROP POLICY IF EXISTS "Game sessions viewable by host" ON public.game_sessions;
DROP POLICY IF EXISTS "Game sessions viewable by players" ON public.game_sessions;
DROP POLICY IF EXISTS "Teachers can create game sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "Hosts can update own sessions" ON public.game_sessions;

-- Drop ALL existing policies on game_players that might cause recursion
DROP POLICY IF EXISTS "Game players viewable by session participants" ON public.game_players;
DROP POLICY IF EXISTS "Users can insert self as player" ON public.game_players;
DROP POLICY IF EXISTS "Players can update own record" ON public.game_players;

-- Recreate game_sessions policies WITHOUT recursion
CREATE POLICY "Game sessions viewable by host"
  ON public.game_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = host_id);

CREATE POLICY "Game sessions viewable by players"
  ON public.game_sessions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.game_players
      WHERE game_session_id = id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can create game sessions"
  ON public.game_sessions FOR INSERT
  WITH CHECK (
    auth.uid() = host_id AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'teacher')
  );

CREATE POLICY "Hosts can update own sessions"
  ON public.game_sessions FOR UPDATE
  USING (auth.uid() = host_id);

-- Recreate game_players policies using security definer function
CREATE POLICY "Game players viewable by session participants"
  ON public.game_players FOR SELECT
  TO authenticated
  USING (public.user_can_view_game_session(game_session_id));

CREATE POLICY "Users can insert self as player"
  ON public.game_players FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Players can update own record"
  ON public.game_players FOR UPDATE
  USING (auth.uid() = user_id);

-- Add comments
COMMENT ON POLICY "Game sessions viewable by host" ON public.game_sessions IS 'Hosts can view their own game sessions';
COMMENT ON POLICY "Game sessions viewable by players" ON public.game_sessions IS 'Players can view game sessions they are participating in';
COMMENT ON POLICY "Game players viewable by session participants" ON public.game_players IS 'Uses security definer function to avoid RLS recursion';
