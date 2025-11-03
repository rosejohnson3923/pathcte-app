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

    // Start orchestrator to advance question and broadcast (fire-and-forget)
    const instanceId = await client.startNew('advanceQuestionOrchestrator', {
      input: {
        sessionId: body.sessionId,
      },
    });

    context.log(`[advanceQuestion] Orchestrator started: ${instanceId}`);

    // Return immediately - orchestration runs in background
    // Clients will be notified via Supabase Realtime when database updates
    return {
      status: 202,
      jsonBody: {
        success: true,
        message: 'Question advance in progress',
        instanceId,
      },
    };
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
