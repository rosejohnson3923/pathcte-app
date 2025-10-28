/**
 * useTokens Hook
 * ===============
 * Token economy operations
 */

import { useAuth } from './useAuth';
import { useRPC } from './useSupabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Get current token balance
 */
export const useTokenBalance = () => {
  const { profile } = useAuth();
  return profile?.tokens || 0;
};

/**
 * Award tokens to user
 */
export const useAwardTokens = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: number) => {
      if (!user) throw new Error('User not authenticated');
      return await useRPC('award_tokens', { p_user_id: user.id, p_amount: amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
};

/**
 * Spend tokens
 */
export const useSpendTokens = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: number) => {
      if (!user) throw new Error('User not authenticated');

      const result = await useRPC<boolean>('spend_tokens', {
        p_user_id: user.id,
        p_amount: amount
      });

      if (!result) {
        throw new Error('Insufficient tokens');
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
};

/**
 * Check if user can afford a purchase
 */
export const useCanAfford = (cost: number) => {
  const balance = useTokenBalance();
  return balance >= cost;
};
