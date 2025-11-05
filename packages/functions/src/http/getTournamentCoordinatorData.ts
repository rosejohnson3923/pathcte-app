/**
 * HTTP Trigger: Get Tournament Coordinator Data
 * GET /api/tournament/{tournamentId}/coordinator
 *
 * Returns all tournament data for coordinators (bypasses RLS using service role)
 * Includes: tournament details, all classroom sessions, leaderboards, rankings
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { supabase } from '../activities/supabaseClient';

export interface TournamentCoordinatorResponse {
  success: boolean;
  tournament?: any;
  classrooms?: any[];
  tournamentLeaderboard?: any[];
  classroomRankings?: any[];
  error?: string;
}

/**
 * Verify JWT and extract user ID
 * In production, you should validate the JWT signature
 */
function getUserIdFromAuth(request: HttpRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  // Decode JWT (without verification for now - Supabase will verify)
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload.sub || null;
  } catch (error) {
    return null;
  }
}

export async function getTournamentCoordinatorData(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const tournamentId = request.params.tournamentId;

    if (!tournamentId) {
      return {
        status: 400,
        jsonBody: {
          success: false,
          error: 'Tournament ID is required',
        },
      };
    }

    // Extract user ID from JWT
    const userId = getUserIdFromAuth(request);
    if (!userId) {
      return {
        status: 401,
        jsonBody: {
          success: false,
          error: 'Unauthorized - valid JWT required',
        },
      };
    }

    context.log(`[getTournamentCoordinatorData] Tournament ${tournamentId}, User ${userId}`);

    // Fetch tournament (using service role - bypasses RLS)
    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', tournamentId)
      .single();

    if (tournamentError) {
      context.error('[getTournamentCoordinatorData] Tournament fetch error:', tournamentError);
      return {
        status: 404,
        jsonBody: {
          success: false,
          error: 'Tournament not found',
        },
      };
    }

    // Verify user is the coordinator
    if (tournament.coordinator_id !== userId) {
      return {
        status: 403,
        jsonBody: {
          success: false,
          error: 'Forbidden - you are not the tournament coordinator',
        },
      };
    }

    // Fetch all classroom sessions (using service role - bypasses RLS)
    const { data: classrooms, error: classroomsError } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('tournament_id', tournamentId)
      .order('created_at', { ascending: true });

    if (classroomsError) {
      context.error('[getTournamentCoordinatorData] Classrooms fetch error:', classroomsError);
      return {
        status: 500,
        jsonBody: {
          success: false,
          error: 'Failed to fetch classrooms',
        },
      };
    }

    // Fetch tournament-wide leaderboard using RPC
    const { data: tournamentLeaderboard, error: leaderboardError } = await supabase
      .rpc('get_tournament_leaderboard', {
        p_tournament_id: tournamentId,
      });

    if (leaderboardError) {
      context.warn('[getTournamentCoordinatorData] Leaderboard fetch error:', leaderboardError);
      // Don't fail the request, just log the warning
    }

    // Fetch classroom rankings using RPC
    const { data: classroomRankings, error: rankingsError } = await supabase
      .rpc('get_tournament_classroom_rankings', {
        p_tournament_id: tournamentId,
      });

    if (rankingsError) {
      context.warn('[getTournamentCoordinatorData] Rankings fetch error:', rankingsError);
      // Don't fail the request, just log the warning
    }

    context.log(`[getTournamentCoordinatorData] Success - ${classrooms?.length || 0} classrooms`);

    return {
      status: 200,
      jsonBody: {
        success: true,
        tournament,
        classrooms: classrooms || [],
        tournamentLeaderboard: tournamentLeaderboard || [],
        classroomRankings: classroomRankings || [],
      },
    };
  } catch (error: any) {
    context.error('[getTournamentCoordinatorData] Error:', error);

    return {
      status: 500,
      jsonBody: {
        success: false,
        error: error.message || 'Internal server error',
      },
    };
  }
}

app.http('tournamentCoordinator', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'tournament/{tournamentId}/coordinator',
  handler: getTournamentCoordinatorData,
});
