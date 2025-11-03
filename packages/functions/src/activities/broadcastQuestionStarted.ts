/**
 * Activity: Broadcast Question Started
 * Broadcasts to Supabase Realtime when a new question starts
 */

import { InvocationContext } from '@azure/functions';
import * as df from 'durable-functions';
import { supabase } from './supabaseClient';

export interface QuestionStartedPayload {
  sessionId: string;
  questionIndex: number;
  question: any;
  startedAt: string; // ISO timestamp
  timeLimit: number;
}

export async function broadcastQuestionStarted(
  payload: QuestionStartedPayload,
  context: InvocationContext
): Promise<void> {
  context.log(`[broadcastQuestionStarted] Session ${payload.sessionId}, Q${payload.questionIndex + 1}`);

  try {
    // Update game session with current question info
    // This triggers postgres_changes events that all subscribed clients receive
    const { error: updateError } = await supabase
      .from('game_sessions')
      .update({
        current_question_index: payload.questionIndex,
        current_question_started_at: payload.startedAt,
        current_question_time_limit: payload.timeLimit,
      })
      .eq('id', payload.sessionId);

    if (updateError) {
      context.error('[broadcastQuestionStarted] Error updating game session:', updateError);
      throw updateError;
    }

    context.log(`[broadcastQuestionStarted] Database updated successfully - postgres_changes will notify all clients`);

    // NOTE: Server-side broadcast doesn't work with Supabase because the server
    // isn't subscribed to the channel. Clients receive updates via postgres_changes instead.
  } catch (error) {
    context.error('[broadcastQuestionStarted] Error:', error);
    throw error;
  }
}

df.app.activity('broadcastQuestionStarted', {
  handler: broadcastQuestionStarted,
});
