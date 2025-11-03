/**
 * HTTP Trigger: Submit Answer
 * POST /api/game/submitAnswer
 *
 * Handles player answer submission
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import * as df from 'durable-functions';

export interface SubmitAnswerRequest {
  playerId: string;
  sessionId: string;
  questionIndex: number;
  questionId: string;
  selectedOptionIndex: number;
  submittedAt: string; // ISO timestamp
  question: {
    options: Array<{ is_correct: boolean }>;
    points: number;
    time_limit_seconds: number;
  };
}

export async function submitAnswer(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const body: SubmitAnswerRequest = (await request.json()) as any;

    context.log(`[submitAnswer] Player ${body.playerId}, Q${body.questionIndex + 1}`);

    // Validate required fields
    if (
      !body.playerId ||
      !body.sessionId ||
      body.questionIndex === undefined ||
      !body.questionId ||
      body.selectedOptionIndex === undefined ||
      !body.question
    ) {
      return {
        status: 400,
        jsonBody: {
          success: false,
          error: 'Missing required fields',
        },
      };
    }

    const client = df.getClient(context);

    // Start orchestrator to handle answer submission
    // This will validate with Host Entity and update Player Entity
    const instanceId = await client.startNew('submitAnswerOrchestrator', {
      input: {
        playerId: body.playerId,
        sessionId: body.sessionId,
        questionIndex: body.questionIndex,
        questionId: body.questionId,
        selectedOptionIndex: body.selectedOptionIndex,
        submittedAt: body.submittedAt || new Date().toISOString(),
        question: body.question,
      },
    });

    // Wait for completion (10 seconds = 10000ms)
    const result = await client.waitForCompletionOrCreateCheckStatusResponse(
      request,
      instanceId,
      { timeoutInMilliseconds: 10000 }
    );

    context.log(`[submitAnswer] Result:`, result);

    return result;
  } catch (error: any) {
    context.error('[submitAnswer] Error:', error);

    return {
      status: 500,
      jsonBody: {
        success: false,
        error: error.message || 'Internal server error',
      },
    };
  }
}

app.http('submitAnswer', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'game/submitAnswer',
  extraInputs: [df.input.durableClient()],
  handler: submitAnswer,
});
