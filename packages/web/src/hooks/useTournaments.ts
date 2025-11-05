/**
 * useTournaments Hook
 * ====================
 * Tournament data management
 */

import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { tournamentService } from '@pathcte/shared';

/**
 * Fetch tournaments where user is coordinator or participant
 */
export const useUserTournaments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tournaments', 'user', user?.id],
    queryFn: () => tournamentService.getUserTournaments(user!.id),
    enabled: !!user,
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Fetch active tournaments (excludes only cancelled)
 * Includes: setup, waiting, in_progress, completed
 */
export const useActiveUserTournaments = () => {
  const { data, ...rest } = useUserTournaments();

  const activeTournaments = data?.filter(
    (tournament) => tournament.status !== 'cancelled'
  ) || [];

  return {
    ...rest,
    data: activeTournaments,
  };
};
