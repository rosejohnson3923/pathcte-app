/**
 * Activity: Apply No Answer Penalty
 * Applies penalty to players who didn't answer before timeout
 */

import { InvocationContext } from '@azure/functions';
import * as df from 'durable-functions';
import { supabase } from './supabaseClient';

export interface ApplyNoAnswerPenaltyParams {
  sessionId: string;
  questionId: string;
}

export async function applyNoAnswerPenalty(
  params: ApplyNoAnswerPenaltyParams,
  context: InvocationContext
): Promise<void> {
  context.log(`[applyNoAnswerPenalty] Session ${params.sessionId}, Q ${params.questionId}`);

  try {
    // Call the database function
    const { data, error } = await supabase.rpc('apply_no_answer_penalty', {
      p_game_session_id: params.sessionId,
      p_question_id: params.questionId,
    });

    if (error) {
      context.error('Error applying no-answer penalty:', error);
      throw error;
    }

    const penaltyCount = Array.isArray(data) ? data.length : 0;
    context.log(`[applyNoAnswerPenalty] Applied penalty to ${penaltyCount} player(s)`);
  } catch (error) {
    context.error('[applyNoAnswerPenalty] Error:', error);
    throw error;
  }
}

df.app.activity('applyNoAnswerPenalty', {
  handler: applyNoAnswerPenalty,
});
