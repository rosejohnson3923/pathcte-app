/**
 * Activity: Broadcast Game Ended
 * Notifies all clients that the game has ended
 */

import { InvocationContext } from '@azure/functions';
import * as df from 'durable-functions';
import { supabase } from './supabaseClient';

export interface GameEndedPayload {
  sessionId: string;
}

export async function broadcastGameEnded(
  payload: GameEndedPayload,
  context: InvocationContext
): Promise<void> {
  context.log(`[broadcastGameEnded] Session ${payload.sessionId}`);

  try {
    // Update game session status to completed
    const { error: updateError } = await supabase
      .from('game_sessions')
      .update({
        status: 'completed',
        ended_at: new Date().toISOString(),
      })
      .eq('id', payload.sessionId);

    if (updateError) {
      context.error('Error updating game session:', updateError);
    }

    // Broadcast to realtime channel
    const channel = supabase.channel(`game:${payload.sessionId}`);

    await channel.send({
      type: 'broadcast',
      event: 'game_ended',
      payload: {
        sessionId: payload.sessionId,
        endedAt: new Date().toISOString(),
      },
    });

    context.log(`[broadcastGameEnded] Broadcast sent successfully`);
  } catch (error) {
    context.error('[broadcastGameEnded] Error:', error);
    throw error;
  }
}

df.app.activity('broadcastGameEnded', {
  handler: broadcastGameEnded,
});
