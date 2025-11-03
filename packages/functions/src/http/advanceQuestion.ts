/**
 * HTTP Trigger: Advance Question
 * POST /api/game/advanceQuestion
 *
 * Advances to the next question (manual progression mode)
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import * as df from 'durable-functions';

export interface AdvanceQuestionRequest {
  sessionId: string;
}

export async function advanceQuestion(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const body: AdvanceQuestionRequest = (await request.json()) as any;

    context.log(`[advanceQuestion] Session ${body.sessionId}`);

    if (!body.sessionId) {
      return {
        status: 400,
        jsonBody: {
          success: false,
          error: 'Missing sessionId',
        },
      };
    }

    const client = df.getClient(context);

    // Start orchestrator to advance question and broadcast
    const instanceId = await client.startNew('advanceQuestionOrchestrator', {
      input: {
        sessionId: body.sessionId,
      },
    });

    // Wait for completion (10 seconds = 10000ms)
    const result = await client.waitForCompletionOrCreateCheckStatusResponse(
      request,
      instanceId,
      { timeoutInMilliseconds: 10000 }
    );

    context.log(`[advanceQuestion] Result:`, result);

    return result;
  } catch (error: any) {
    context.error('[advanceQuestion] Error:', error);

    return {
      status: 500,
      jsonBody: {
        success: false,
        error: error.message || 'Internal server error',
      },
    };
  }
}

app.http('advanceQuestion', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'game/advanceQuestion',
  extraInputs: [df.input.durableClient()],
  handler: advanceQuestion,
});
