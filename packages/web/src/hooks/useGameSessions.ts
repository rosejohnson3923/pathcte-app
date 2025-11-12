/**
 * useGameSessions Hook
 * =====================
 * Game session data management
 */

import { useFetchMany } from './useSupabase';
import { useAuth } from './useAuth';
import type { GameSession, GamePlayer } from '@pathcte/shared';

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
      order: { column: 'joined_at', ascending: false },
      limit: limit || 10
    } : undefined,
    {
      enabled: !!user,
    }
  );
};

/**
 * Count total games played by user
 * Counts unique game sessions, not total player records
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

  // Count unique game sessions (not total records)
  // A user may have multiple records in the same game session if data is duplicated,
  // but we only want to count each game once
  if (!gamePlayers) return 0;

  const uniqueSessionIds = new Set(gamePlayers.map(p => p.game_session_id));
  return uniqueSessionIds.size;
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

/**
 * Fetch active standalone games hosted by the current user
 * (games with status='waiting' or 'in_progress' and NOT part of a tournament)
 */
export const useActiveHostedGames = () => {
  const { user } = useAuth();

  const query = useFetchMany<GameSession>(
    'game_sessions',
    user ? {
      filters: {
        host_id: user.id,
      },
      order: { column: 'created_at', ascending: false },
    } : undefined,
    {
      enabled: !!user,
    }
  );

  // Filter to only active standalone games (not tournament games)
  const activeGames = query.data?.filter(
    (game) =>
      (game.status === 'waiting' || game.status === 'in_progress') &&
      game.tournament_id === null
  ) || [];

  return {
    ...query,
    data: activeGames,
  };
};

/**
 * Fetch active tournament games hosted by the current user
 * (games that are part of a tournament)
 */
export const useActiveTournamentGames = () => {
  const { user } = useAuth();

  const query = useFetchMany<GameSession>(
    'game_sessions',
    user ? {
      filters: {
        host_id: user.id,
      },
      order: { column: 'created_at', ascending: false },
    } : undefined,
    {
      enabled: !!user,
    }
  );

  // Filter to only tournament games
  const tournamentGames = query.data?.filter(
    (game) =>
      (game.status === 'waiting' || game.status === 'in_progress') &&
      game.tournament_id !== null
  ) || [];

  return {
    ...query,
    data: tournamentGames,
  };
};

/**
 * Fetch active games joined by the current user
 * (games where user is a player and status='waiting' or 'in_progress')
 */
export const useActiveJoinedGames = () => {
  const { user } = useAuth();

  // Get game_players records for this user
  const playersQuery = useFetchMany<GamePlayer>(
    'game_players',
    user ? {
      filters: {
        user_id: user.id,
      },
      order: { column: 'joined_at', ascending: false },
    } : undefined,
    {
      enabled: !!user,
    }
  );

  // Get session IDs from player records
  const sessionIds = playersQuery.data?.map((p) => p.game_session_id) || [];

  // Fetch those game sessions
  const sessionsQuery = useFetchMany<GameSession>(
    'game_sessions',
    sessionIds.length > 0 ? {} : undefined,
    {
      enabled: sessionIds.length > 0,
    }
  );

  // Filter to only active games that match the player's sessions
  const activeGames = sessionsQuery.data?.filter(
    (game) =>
      sessionIds.includes(game.id) &&
      (game.status === 'waiting' || game.status === 'in_progress')
  ) || [];

  return {
    ...sessionsQuery,
    isLoading: playersQuery.isLoading || sessionsQuery.isLoading,
    data: activeGames,
  };
};
