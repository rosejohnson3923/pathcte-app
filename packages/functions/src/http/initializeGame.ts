/**
 * HTTP Trigger: Initialize Game
 * POST /api/game/initialize
 *
 * Initializes Host Entity and Player Entities for a new game
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import * as df from 'durable-functions';
import type { Question } from '../entities/HostEntity';

export interface Player {
  id: string;
  userId: string | null;
  displayName: string;
}

export interface InitializeGameRequest {
  sessionId: string;
  questionSetId: string;
  questions: Question[];
  progressionControl: 'manual' | 'auto';
  allowLateJoin: boolean;
  players: Player[];
}

export async function initializeGame(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const body: InitializeGameRequest = (await request.json()) as any;

    context.log(`[initializeGame] Session ${body.sessionId} with ${body.players.length} players`);

    if (
      !body.sessionId ||
      !body.questionSetId ||
      !body.questions ||
      body.questions.length === 0 ||
      !body.players ||
      body.players.length === 0
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

    // Start orchestrator to initialize entities (fire-and-forget)
    const instanceId = await client.startNew('initializeGameOrchestrator', {
      input: body,
    });

    context.log(`[initializeGame] Orchestrator started: ${instanceId}`);

    // Return immediately - orchestration runs in background
    // Clients will be notified via Supabase Realtime when database updates
    return {
      status: 202,
      jsonBody: {
        success: true,
        message: 'Game initialization in progress',
        sessionId: body.sessionId,
        instanceId,
      },
    };
  } catch (error: any) {
    context.error('[initializeGame] Error:', error);

    return {
      status: 500,
      jsonBody: {
        success: false,
        error: error.message || 'Internal server error',
      },
    };
  }
}

app.http('initializeGame', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'game/initialize',
  extraInputs: [df.input.durableClient()],
  handler: initializeGame,
});
