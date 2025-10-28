/**
 * useGameSessions Hook
 * =====================
 * Game session data management
 */

import { useFetchMany } from './useSupabase';
import { useAuth } from './useAuth';
import type { GameSession, GamePlayer } from '@pathket/shared';

/**
 * Fetch user's game history
 */
export const useUserGameSessions = (limit?: number) => {
  const { user } = useAuth();

  return useFetchMany<GameSession & { game_players: GamePlayer[] }>(
    'game_sessions',
    user ? {
      // This will be filtered by RLS policies to only show games the user participated in
      order: { column: 'created_at', ascending: false },
      limit: limit || 10
    } : undefined,
    {
      enabled: !!user,
    }
  );
};

/**
 * Fetch user's game player records
 */
export const useUserGamePlayers = (limit?: number) => {
  const { user } = useAuth();

  return useFetchMany<GamePlayer>(
    'game_players',
    user ? {
      user_id: user.id,
      order: { column: 'created_at', ascending: false },
      limit: limit || 10
    } : undefined,
    {
      enabled: !!user,
    }
  );
};

/**
 * Count total games played by user
 */
export const useGameCount = () => {
  const { user } = useAuth();

  const { data: gamePlayers } = useFetchMany<GamePlayer>(
    'game_players',
    user ? { user_id: user.id } : undefined,
    {
      enabled: !!user,
    }
  );

  return gamePlayers?.length || 0;
};

/**
 * Fetch a specific game session by ID
 */
export const useGameSession = (sessionId: string | undefined) => {
  const query = useFetchMany<GameSession>(
    'game_sessions',
    sessionId ? { id: sessionId } : undefined,
    {
      enabled: !!sessionId,
    }
  );

  return {
    ...query,
    data: query.data?.[0],
  };
};
