/**
 * HTTP Trigger: Get Timer State
 * GET /api/game/timerState/{sessionId}
 *
 * Gets current timer state for synchronization (late joins, reconnects)
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import * as df from 'durable-functions';

export async function getTimerState(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const sessionId = request.params.sessionId;

    context.log(`[getTimerState] Session ${sessionId}`);

    if (!sessionId) {
      return {
        status: 400,
        jsonBody: {
          success: false,
          error: 'Missing sessionId',
        },
      };
    }

    const client = df.getClient(context);

    // Start orchestrator to call entity
    const instanceId = await client.startNew('callHostEntity', {
      input: {
        sessionId,
        operation: 'getTimerState',
      },
    });

    // Wait for completion (10 seconds = 10000ms)
    const result = await client.waitForCompletionOrCreateCheckStatusResponse(
      request,
      instanceId,
      { timeoutInMilliseconds: 10000 }
    );

    context.log(`[getTimerState] Result:`, result);

    return result;
  } catch (error: any) {
    context.error('[getTimerState] Error:', error);

    return {
      status: 500,
      jsonBody: {
        success: false,
        error: error.message || 'Internal server error',
        timerState: null,
      },
    };
  }
}

app.http('getTimerState', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'game/timerState/{sessionId}',
  extraInputs: [df.input.durableClient()],
  handler: getTimerState,
});
