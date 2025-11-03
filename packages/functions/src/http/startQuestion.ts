/**
 * HTTP Trigger: Start Question
 * POST /api/game/startQuestion
 *
 * Starts a specific question in the game
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import * as df from 'durable-functions';

export interface StartQuestionRequest {
  sessionId: string;
  questionIndex: number;
}

export async function startQuestion(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const body: StartQuestionRequest = (await request.json()) as any;

    context.log(`[startQuestion] Session ${body.sessionId}, Q${body.questionIndex + 1}`);

    if (!body.sessionId || body.questionIndex === undefined) {
      return {
        status: 400,
        jsonBody: {
          success: false,
          error: 'Missing sessionId or questionIndex',
        },
      };
    }

    const client = df.getClient(context);

    // Start orchestrator to start question and broadcast
    const instanceId = await client.startNew('startQuestionOrchestrator', {
      input: {
        sessionId: body.sessionId,
        questionIndex: body.questionIndex,
      },
    });

    // Wait for completion (10 seconds = 10000ms)
    const result = await client.waitForCompletionOrCreateCheckStatusResponse(
      request,
      instanceId,
      { timeoutInMilliseconds: 10000 }
    );

    context.log(`[startQuestion] Result:`, result);

    return result;
  } catch (error: any) {
    context.error('[startQuestion] Error:', error);

    return {
      status: 500,
      jsonBody: {
        success: false,
        error: error.message || 'Internal server error',
      },
    };
  }
}

app.http('startQuestion', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'game/startQuestion',
  extraInputs: [df.input.durableClient()],
  handler: startQuestion,
});
