/**
 * Supabase Service
 * =================
 * Helper functions for common Supabase operations
 * Platform-agnostic: Works in web and mobile
 */

import { supabase } from '../config/supabase';
import type { Database } from '../types/database.types';
import type { PostgrestError, RealtimeChannel } from '@supabase/supabase-js';

// Type helpers
type Tables = Database['public']['Tables'];
type TableName = keyof Tables;
type Row<T extends TableName> = Tables[T]['Row'];
type Insert<T extends TableName> = Tables[T]['Insert'];
type Update<T extends TableName> = Tables[T]['Update'];

export interface QueryResult<T> {
  data: T | null;
  error: PostgrestError | null;
  count?: number | null;
}

export interface QueryListResult<T> {
  data: T[] | null;
  error: PostgrestError | null;
  count?: number | null;
}

class SupabaseService {
  /**
   * Fetch a single row by ID
   */
  async fetchOne<T extends TableName>(
    table: T,
    id: string,
    select = '*'
  ): Promise<QueryResult<Row<T>>> {
    try {
      const { data, error } = await supabase
        .from(table as any)
        .select(select)
        .eq('id', id)
        .single();

      return { data: data as Row<T> | null, error };
    } catch (error) {
      console.error(`Error fetching ${table}:`, error);
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          details: '',
          hint: '',
          code: '500',
          name: 'QueryError',
        },
      };
    }
  }

  /**
   * Fetch multiple rows with optional filters
   */
  async fetchMany<T extends TableName>(
    table: T,
    options: {
      select?: string;
      filters?: Record<string, any>;
      order?: { column: string; ascending?: boolean };
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<QueryListResult<Row<T>>> {
    try {
      const { select = '*', filters = {}, order, limit, offset } = options;

      let query = supabase.from(table as any).select(select, { count: 'exact' });

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key as any, value);
      });

      // Apply ordering
      if (order) {
        query = query.order(order.column, { ascending: order.ascending ?? true });
      }

      // Apply pagination
      if (limit) {
        query = query.limit(limit);
      }
      if (offset) {
        query = query.range(offset, offset + (limit || 10) - 1);
      }

      const { data, error, count } = await query;

      return { data: data as Row<T>[] | null, error, count };
    } catch (error) {
      console.error(`Error fetching ${table}:`, error);
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          details: '',
          hint: '',
          code: '500',
          name: 'QueryError',
        },
        count: null,
      };
    }
  }

  /**
   * Insert a single row
   */
  async insertOne<T extends TableName>(
    table: T,
    data: Insert<T>
  ): Promise<QueryResult<Row<T>>> {
    try {
      const { data: inserted, error } = await supabase
        .from(table as any)
        .insert(data as any)
        .select()
        .single();

      return { data: inserted as Row<T> | null, error };
    } catch (error) {
      console.error(`Error inserting ${table}:`, error);
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          details: '',
          hint: '',
          code: '500',
          name: 'QueryError',
        },
      };
    }
  }

  /**
   * Insert multiple rows
   */
  async insertMany<T extends TableName>(
    table: T,
    data: Insert<T>[]
  ): Promise<QueryListResult<Row<T>>> {
    try {
      const { data: inserted, error } = await supabase
        .from(table as any)
        .insert(data as any)
        .select();

      return { data: inserted as Row<T>[] | null, error };
    } catch (error) {
      console.error(`Error inserting ${table}:`, error);
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          details: '',
          hint: '',
          code: '500',
          name: 'QueryError',
        },
      };
    }
  }

  /**
   * Update a row by ID
   */
  async updateOne<T extends TableName>(
    table: T,
    id: string,
    updates: Update<T>
  ): Promise<QueryResult<Row<T>>> {
    try {
      const { data, error} = await supabase
        .from(table)
        // @ts-expect-error - Complex generic type issue with Supabase update
        .update(updates)
        // @ts-expect-error
        .eq('id', id)
        .select()
        .single();

      return { data: data as Row<T> | null, error };
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          details: '',
          hint: '',
          code: '500',
          name: 'QueryError',
        },
      };
    }
  }

  /**
   * Update multiple rows with filters
   */
  async updateMany<T extends TableName>(
    table: T,
    filters: Record<string, any>,
    updates: Update<T>
  ): Promise<QueryListResult<Row<T>>> {
    try {
      // @ts-ignore - Complex generic type issue with Supabase update
      let query = supabase.from(table).update(updates);

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key as any, value);
      });

      const { data, error } = await query.select();

      return { data: data as Row<T>[] | null, error };
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          details: '',
          hint: '',
          code: '500',
          name: 'QueryError',
        },
      };
    }
  }

  /**
   * Delete a row by ID
   */
  async deleteOne<T extends TableName>(table: T, id: string): Promise<{ error: PostgrestError | null }> {
    try {
      const { error } = await supabase.from(table as any).delete().eq('id', id);

      return { error };
    } catch (error) {
      console.error(`Error deleting ${table}:`, error);
      return {
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          details: '',
          hint: '',
          code: '500',
          name: 'QueryError',
        },
      };
    }
  }

  /**
   * Delete multiple rows with filters
   */
  async deleteMany<T extends TableName>(
    table: T,
    filters: Record<string, any>
  ): Promise<{ error: PostgrestError | null }> {
    try {
      let query = supabase.from(table as any).delete();

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key as any, value);
      });

      const { error } = await query;

      return { error };
    } catch (error) {
      console.error(`Error deleting ${table}:`, error);
      return {
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          details: '',
          hint: '',
          code: '500',
          name: 'QueryError',
        },
      };
    }
  }

  /**
   * Execute a custom RPC function
   */
  async rpc<T = any>(
    functionName: string,
    params?: Record<string, any>
  ): Promise<{ data: T | null; error: PostgrestError | null }> {
    try {
      const { data, error } = await supabase.rpc(functionName as any, params as any);

      return { data: data as T | null, error };
    } catch (error) {
      console.error(`Error calling RPC ${functionName}:`, error);
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          details: '',
          hint: '',
          code: '500',
          name: 'QueryError',
        },
      };
    }
  }

  /**
   * Subscribe to realtime changes on a table
   */
  subscribeToTable<T extends TableName>(
    table: T,
    callback: (payload: any) => void,
    filter?: string
  ): RealtimeChannel {
    let channel = supabase.channel(`${table}_changes`).on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
        filter: filter,
      },
      callback
    );

    channel.subscribe();

    return channel;
  }

  /**
   * Unsubscribe from a realtime channel
   */
  unsubscribe(channel: RealtimeChannel): void {
    supabase.removeChannel(channel);
  }

  /**
   * Count rows in a table with optional filters
   */
  async count<T extends TableName>(
    table: T,
    filters?: Record<string, any>
  ): Promise<{ count: number; error: PostgrestError | null }> {
    try {
      let query = supabase.from(table as any).select('*', { count: 'exact', head: true });

      // Apply filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key as any, value);
        });
      }

      const { count, error } = await query;

      return { count: count || 0, error };
    } catch (error) {
      console.error(`Error counting ${table}:`, error);
      return {
        count: 0,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          details: '',
          hint: '',
          code: '500',
          name: 'QueryError',
        },
      };
    }
  }

  /**
   * Search with full-text search
   */
  async search<T extends TableName>(
    table: T,
    column: string,
    query: string,
    options: {
      select?: string;
      limit?: number;
    } = {}
  ): Promise<QueryListResult<Row<T>>> {
    try {
      const { select = '*', limit = 50 } = options;

      const { data, error } = await supabase
        .from(table as any)
        .select(select)
        .textSearch(column as any, query)
        .limit(limit);

      return { data: data as Row<T>[] | null, error };
    } catch (error) {
      console.error(`Error searching ${table}:`, error);
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          details: '',
          hint: '',
          code: '500',
          name: 'QueryError',
        },
      };
    }
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService();

// Export class for testing
export { SupabaseService };
