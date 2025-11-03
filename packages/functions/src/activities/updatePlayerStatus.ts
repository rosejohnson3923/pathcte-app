/**
 * Activity: Update Player Status
 * Updates player connection status (active/disconnected)
 */

import { InvocationContext } from '@azure/functions';
import * as df from 'durable-functions';
import { supabase } from './supabaseClient';

export interface UpdatePlayerStatusParams {
  playerId: string;
  status: 'active' | 'disconnected';
  lastSeenAt: string; // ISO timestamp
}

export async function updatePlayerStatus(
  params: UpdatePlayerStatusParams,
  context: InvocationContext
): Promise<void> {
  context.log(`[updatePlayerStatus] Player ${params.playerId}: ${params.status}`);

  try {
    // Note: The database trigger will automatically sync is_connected based on connection_status
    const { error } = await supabase
      .from('game_players')
      .update({
        connection_status: params.status,
        last_seen_at: params.lastSeenAt,
      })
      .eq('id', params.playerId);

    if (error) {
      context.error('Error updating player status:', error);
      throw error;
    }

    context.log(`[updatePlayerStatus] Status updated successfully`);
  } catch (error) {
    context.error('[updatePlayerStatus] Error:', error);
    throw error;
  }
}

df.app.activity('updatePlayerStatus', {
  handler: updatePlayerStatus,
});
