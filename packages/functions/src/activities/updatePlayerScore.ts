/**
 * Activity: Update Player Score
 * Updates player's current score in database
 */

import { InvocationContext } from '@azure/functions';
import * as df from 'durable-functions';
import { supabase } from './supabaseClient';

export interface UpdatePlayerScoreParams {
  playerId: string;
  score: number;
  correctAnswers: number;
  totalAnswers: number;
}

export async function updatePlayerScore(
  params: UpdatePlayerScoreParams,
  context: InvocationContext
): Promise<void> {
  context.log(`[updatePlayerScore] Player ${params.playerId}: ${params.score} pts`);

  try {
    const { error } = await supabase
      .from('game_players')
      .update({
        score: params.score,
        correct_answers: params.correctAnswers,
        total_answers: params.totalAnswers,
      })
      .eq('id', params.playerId);

    if (error) {
      context.error('Error updating player score:', error);
      throw error;
    }

    // Broadcast score update
    const channel = supabase.channel(`player:${params.playerId}`);

    await channel.send({
      type: 'broadcast',
      event: 'score_updated',
      payload: {
        score: params.score,
        correctAnswers: params.correctAnswers,
        totalAnswers: params.totalAnswers,
      },
    });

    context.log(`[updatePlayerScore] Score updated successfully`);
  } catch (error) {
    context.error('[updatePlayerScore] Error:', error);
    throw error;
  }
}

df.app.activity('updatePlayerScore', {
  handler: updatePlayerScore,
});
