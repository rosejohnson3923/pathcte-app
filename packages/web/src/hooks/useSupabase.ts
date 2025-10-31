/**
 * useSupabase Hook
 * =================
 * React Query wrapper for Supabase operations
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { supabaseService } from '@pathcte/shared';
import type { Database } from '@pathcte/shared';

type TableName = keyof Database['public']['Tables'];

/**
 * Fetch a single record by ID
 */
export const useFetchOne = <T extends Record<string, any> = any>(
  table: TableName,
  id: string | undefined,
  options?: Omit<UseQueryOptions<T | null, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<T | null, Error>({
    queryKey: [table, id],
    queryFn: async () => {
      if (!id) return null;
      const result = await supabaseService.fetchOne<any>(table, id);
      if (result.error) throw result.error;
      return result.data as T | null;
    },
    enabled: !!id,
    ...options,
  });
};

/**
 * Fetch multiple records with optional filters
 */
export const useFetchMany = <T extends Record<string, any> = any>(
  table: TableName,
  filters?: Record<string, any>,
  options?: Omit<UseQueryOptions<T[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<T[], Error>({
    queryKey: [table, 'list', filters],
    queryFn: async () => {
      const result = await supabaseService.fetchMany<any>(table, filters);
      if (result.error) throw result.error;
      return (result.data || []) as T[];
    },
    ...options,
  });
};

/**
 * Insert a single record
 */
export const useInsertOne = <T extends Record<string, any> = any>(
  table: TableName,
  options?: UseMutationOptions<T, Error, Partial<T>>
) => {
  const queryClient = useQueryClient();

  return useMutation<T, Error, Partial<T>>({
    mutationFn: async (data) => {
      const result = await supabaseService.insertOne<any>(table, data);
      if (result.error) throw result.error;
      if (!result.data) throw new Error('Insert failed');
      return result.data as T;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] });
    },
    ...options,
  });
};

/**
 * Update a single record
 */
export const useUpdateOne = <T extends Record<string, any> = any>(
  table: TableName,
  options?: UseMutationOptions<T, Error, { id: string; updates: Partial<T> }>
) => {
  const queryClient = useQueryClient();

  return useMutation<T, Error, { id: string; updates: Partial<T> }>({
    mutationFn: async ({ id, updates }) => {
      const result = await supabaseService.updateOne<any>(table, id, updates);
      if (result.error) throw result.error;
      if (!result.data) throw new Error('Update failed');
      return result.data as T;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [table] });
      queryClient.invalidateQueries({ queryKey: [table, id] });
    },
    ...options,
  });
};

/**
 * Delete a single record
 */
export const useDeleteOne = (
  table: TableName,
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const result = await supabaseService.deleteOne(table, id);
      if (result.error) throw result.error;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [table] });
      queryClient.invalidateQueries({ queryKey: [table, id] });
    },
    ...options,
  });
};

/**
 * Count records with optional filters
 */
export const useCount = (
  table: TableName,
  filters?: Record<string, any>,
  options?: Omit<UseQueryOptions<number, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<number, Error>({
    queryKey: [table, 'count', filters],
    queryFn: async () => {
      const result = await supabaseService.count(table, filters);
      if (result.error) throw result.error;
      return result.count || 0;
    },
    ...options,
  });
};

/**
 * Call an RPC function
 */
export const useRPC = <T = any>(
  functionName: string,
  params?: Record<string, any>,
  options?: Omit<UseQueryOptions<T | null, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<T | null, Error>({
    queryKey: ['rpc', functionName, params],
    queryFn: async () => {
      const result = await supabaseService.rpc<T>(functionName, params);
      if (result.error) throw result.error;
      return result.data || null;
    },
    ...options,
  });
};
