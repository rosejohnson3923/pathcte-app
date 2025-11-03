/**
 * Activity: Record Answer
 * Saves player answer to database
 */

import { InvocationContext } from '@azure/functions';
import * as df from 'durable-functions';
import { supabase } from './supabaseClient';

export interface RecordAnswerParams {
  playerId: string;
  sessionId: string;
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  timeElapsed: number;
  pointsEarned: number;
}

export async function recordAnswer(
  params: RecordAnswerParams,
  context: InvocationContext
): Promise<void> {
  context.log(`[recordAnswer] Player ${params.playerId}, Q ${params.questionId}`);

  try {
    const { error } = await supabase.from('game_answers').insert({
      player_id: params.playerId,
      game_session_id: params.sessionId,
      question_id: params.questionId,
      selected_option_index: params.selectedOptionIndex,
      is_correct: params.isCorrect,
      time_taken_ms: Math.round(params.timeElapsed * 1000), // Convert seconds to milliseconds
      points_earned: params.pointsEarned,
      answered_at: new Date().toISOString(),
    });

    if (error) {
      context.error('Error recording answer:', error);
      throw error;
    }

    context.log(`[recordAnswer] Answer recorded successfully`);
  } catch (error) {
    context.error('[recordAnswer] Error:', error);
    throw error;
  }
}

df.app.activity('recordAnswer', {
  handler: recordAnswer,
});
