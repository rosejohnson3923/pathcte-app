/**
 * useCareerPathkeys Hook
 * ======================
 * Fetches career pathkey progress for the current user
 */

import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { pathkeyService } from '@pathcte/shared';

/**
 * Fetch all career pathkey progress for current user
 */
export const useCareerPathkeys = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['career-pathkeys', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }

      const result = await pathkeyService.getAllCareerPathkeyProgress(user.id);

      if (result.error) {
        throw new Error('Failed to fetch career pathkeys');
      }

      return result.pathkeys || [];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnMount: 'always', // Always refetch to show new progress
  });
};
