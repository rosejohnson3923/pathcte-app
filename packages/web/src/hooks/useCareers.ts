/**
 * useCareers Hook
 * ================
 * Career exploration and discovery
 */

import { useFetchMany } from './useSupabase';
import type { Career } from '@pathcte/shared';

/**
 * Fetch all careers
 */
export const useCareers = () => {
  return useFetchMany<Career>('careers', { is_verified: true });
};

/**
 * Fetch a specific career by ID
 */
export const useCareer = (careerId: string | undefined) => {
  const query = useFetchMany<Career>('careers', careerId ? { id: careerId } : undefined, {
    enabled: !!careerId,
  });

  return {
    ...query,
    data: query.data?.[0],
  };
};

/**
 * Fetch careers by industry
 */
export const useCareersByIndustry = (industry: string) => {
  return useFetchMany<Career>('careers', { industry, is_verified: true });
};

/**
 * Fetch careers by sector
 */
export const useCareersBySector = (sector: string) => {
  return useFetchMany<Career>('careers', { sector, is_verified: true });
};

/**
 * Fetch careers by cluster
 */
export const useCareersByCluster = (cluster: string) => {
  return useFetchMany<Career>('careers', { career_cluster: cluster, is_verified: true });
};
