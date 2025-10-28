/**
 * usePathkeys Hook
 * =================
 * Pathkey collection management
 */

import { useFetchMany, useInsertOne, useUpdateOne } from './useSupabase';
import { useAuth } from './useAuth';
import type { Pathkey, UserPathkey } from '@pathket/shared';

/**
 * Fetch all pathkeys (catalog)
 */
export const usePathkeys = () => {
  return useFetchMany<Pathkey>('pathkeys', { is_active: true });
};

/**
 * Fetch user's pathkey collection
 */
export const useUserPathkeys = () => {
  const { user } = useAuth();

  return useFetchMany<UserPathkey>('user_pathkeys', user ? { user_id: user.id } : undefined, {
    enabled: !!user,
  });
};

/**
 * Fetch a specific pathkey by ID
 */
export const usePathkey = (pathkeyId: string | undefined) => {
  const query = useFetchMany<Pathkey>('pathkeys', pathkeyId ? { id: pathkeyId } : undefined, {
    enabled: !!pathkeyId,
  });

  return {
    ...query,
    data: query.data?.[0],
  };
};

/**
 * Add pathkey to user's collection
 */
export const useAddPathkey = () => {
  return useInsertOne<UserPathkey>('user_pathkeys');
};

/**
 * Toggle pathkey favorite status
 */
export const useToggleFavorite = () => {
  return useUpdateOne<UserPathkey>('user_pathkeys');
};

/**
 * Get pathkeys by rarity
 */
export const usePathkeysByRarity = (rarity: string) => {
  return useFetchMany<Pathkey>('pathkeys', { rarity, is_active: true });
};

/**
 * Get pathkeys by type
 */
export const usePathkeysByType = (keyType: string) => {
  return useFetchMany<Pathkey>('pathkeys', { key_type: keyType, is_active: true });
};
