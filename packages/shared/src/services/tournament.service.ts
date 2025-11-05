/**
 * Tournament Service
 * ==================
 * Multi-classroom tournament management and operations
 */

import { supabase } from '../config/supabase';
import type {
  Tournament,
  TournamentStatus,
  TournamentStartMode,
  ProgressionMode,
  GameSession,
  TournamentLeaderboardEntry,
  ClassroomRanking,
} from '../types/database.types';

// Azure Functions URL for coordinator operations
// Uses service role to bypass RLS for tournament coordinators
const AZURE_FUNCTIONS_URL =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_AZURE_FUNCTIONS_URL || 'http://localhost:7071'
    : 'http://localhost:7071';

export interface TournamentCoordinatorData {
  tournament: Tournament;
  classrooms: GameSession[];
  tournamentLeaderboard: TournamentLeaderboardEntry[];
  classroomRankings: ClassroomRanking[];
}

export interface CreateTournamentParams {
  coordinatorId: string;
  title: string;
  description?: string;
  questionSetId: string;
  startMode?: TournamentStartMode;
  progressionMode?: ProgressionMode;
  allowLateJoin?: boolean;
  maxClassrooms?: number;
  maxPlayersPerClassroom?: number;
  schoolName?: string;
  gradelevels?: number[];
  settings?: Record<string, any>;
}

export interface JoinTournamentParams {
  tournamentCode: string;
  hostId: string;
  classroomName: string;
}

/**
 * Tournament Service
 * Handles all tournament operations including creation, joining, and leaderboards
 */
export const tournamentService = {
  /**
   * Create a new tournament
   */
  async createTournament(params: CreateTournamentParams): Promise<Tournament> {
    console.log('[createTournament] Starting tournament creation with params:', params);

    const rpcParams = {
      p_coordinator_id: params.coordinatorId,
      p_title: params.title,
      p_description: params.description || null,
      p_question_set_id: params.questionSetId,
      p_start_mode: params.startMode || 'independent',
      p_progression_mode: params.progressionMode || 'manual',
      p_allow_late_join: params.allowLateJoin ?? false,
      p_max_classrooms: params.maxClassrooms || 20,
      p_max_players_per_classroom: params.maxPlayersPerClassroom || 60,
      p_school_name: params.schoolName || null,
      p_settings: params.settings || {},
    };

    console.log('[createTournament] Calling RPC with params:', rpcParams);

    const { data, error } = await supabase.rpc('create_tournament', rpcParams as any);

    console.log('[createTournament] RPC response - data:', data, 'error:', error);

    if (error) {
      console.error('[createTournament] Error creating tournament:', error);
      console.error('[createTournament] Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw new Error(`Failed to create tournament: ${error.message}`);
    }

    if (!data) {
      console.error('[createTournament] No data returned from create_tournament RPC');
      throw new Error('Failed to create tournament: No data returned');
    }

    console.log('[createTournament] Tournament created successfully:', data);
    return data as Tournament;
  },

  /**
   * Get tournament by code
   */
  async getTournamentByCode(tournamentCode: string): Promise<Tournament | null> {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('tournament_code', tournamentCode.toUpperCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      console.error('Error fetching tournament:', error);
      throw new Error(`Failed to fetch tournament: ${error.message}`);
    }

    return data as Tournament;
  },

  /**
   * Get tournament by ID
   */
  async getTournamentById(tournamentId: string): Promise<Tournament | null> {
    const { data, error} = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', tournamentId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching tournament:', error);
      throw new Error(`Failed to fetch tournament: ${error.message}`);
    }

    return data as Tournament;
  },

  /**
   * Join a tournament as a classroom
   * Creates a game session for the classroom within the tournament
   */
  async joinTournamentAsClassroom(params: JoinTournamentParams): Promise<GameSession> {
    const { data, error } = await supabase.rpc('join_tournament_as_classroom', {
      p_tournament_code: params.tournamentCode.toUpperCase(),
      p_host_id: params.hostId,
      p_classroom_name: params.classroomName,
    } as any);

    if (error) {
      console.error('Error joining tournament:', error);
      throw new Error(`Failed to join tournament: ${error.message}`);
    }

    return data as GameSession;
  },

  /**
   * Start tournament (for coordinated mode)
   * Starts all classroom game sessions simultaneously
   */
  async startTournament(tournamentId: string, coordinatorId: string): Promise<Tournament> {
    const { data, error } = await supabase.rpc('start_tournament', {
      p_tournament_id: tournamentId,
      p_coordinator_id: coordinatorId,
    } as any);

    if (error) {
      console.error('Error starting tournament:', error);
      throw new Error(`Failed to start tournament: ${error.message}`);
    }

    return data as Tournament;
  },

  /**
   * Get tournament-wide player leaderboard
   */
  async getTournamentLeaderboard(
    tournamentId: string,
    limit: number = 100
  ): Promise<TournamentLeaderboardEntry[]> {
    const { data, error } = await supabase.rpc('get_tournament_leaderboard', {
      p_tournament_id: tournamentId,
      p_limit: limit,
    } as any);

    if (error) {
      console.error('Error fetching tournament leaderboard:', error);
      throw new Error(`Failed to fetch leaderboard: ${error.message}`);
    }

    return (data || []) as TournamentLeaderboardEntry[];
  },

  /**
   * Get classroom rankings within tournament
   */
  async getClassroomRankings(tournamentId: string): Promise<ClassroomRanking[]> {
    const { data, error } = await supabase.rpc('get_tournament_classroom_rankings', {
      p_tournament_id: tournamentId,
    } as any);

    if (error) {
      console.error('Error fetching classroom rankings:', error);
      throw new Error(`Failed to fetch classroom rankings: ${error.message}`);
    }

    return (data || []) as ClassroomRanking[];
  },

  /**
   * Get all classrooms (game sessions) in a tournament
   */
  async getTournamentClassrooms(tournamentId: string): Promise<GameSession[]> {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('tournament_id', tournamentId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching tournament classrooms:', error);
      throw new Error(`Failed to fetch classrooms: ${error.message}`);
    }

    return (data || []) as GameSession[];
  },

  /**
   * Get tournament coordinator data via Azure Functions
   * Uses service role to bypass RLS and fetch all tournament data
   * This is the primary method for tournament coordinators to view their tournaments
   */
  async getTournamentCoordinatorData(tournamentId: string): Promise<TournamentCoordinatorData> {
    try {
      // Get current session to extract JWT
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Not authenticated');
      }

      const url = `${AZURE_FUNCTIONS_URL}/api/tournament/${tournamentId}/coordinator`;
      console.log('[getTournamentCoordinatorData] Fetching from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      console.log('[getTournamentCoordinatorData] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[getTournamentCoordinatorData] Error response:', errorText);

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }

        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch tournament data');
      }

      return {
        tournament: result.tournament,
        classrooms: result.classrooms || [],
        tournamentLeaderboard: result.tournamentLeaderboard || [],
        classroomRankings: result.classroomRankings || [],
      };
    } catch (error: any) {
      console.error('[getTournamentCoordinatorData] Error:', error);
      throw error;
    }
  },

  /**
   * Update tournament status
   */
  async updateTournamentStatus(
    tournamentId: string,
    status: TournamentStatus
  ): Promise<Tournament> {
    const { data, error } = (await (supabase
      .from('tournaments') as any)
      .update({ status })
      .eq('id', tournamentId)
      .select()
      .single()) as { data: Tournament | null; error: any };

    if (error) {
      console.error('Error updating tournament status:', error);
      throw new Error(`Failed to update tournament: ${error.message}`);
    }

    return data as Tournament;
  },

  /**
   * Subscribe to tournament changes (realtime)
   */
  subscribeTournament(tournamentId: string, callback: (tournament: Tournament) => void) {
    const channel = supabase
      .channel(`tournament:${tournamentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tournaments',
          filter: `id=eq.${tournamentId}`,
        },
        (payload) => {
          callback(payload.new as Tournament);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Subscribe to tournament classrooms changes (realtime)
   */
  subscribeTournamentClassrooms(
    tournamentId: string,
    callback: (classrooms: GameSession[]) => void
  ) {
    const channel = supabase
      .channel(`tournament-classrooms:${tournamentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_sessions',
          filter: `tournament_id=eq.${tournamentId}`,
        },
        async () => {
          // Refetch all classrooms on any change
          const classrooms = await this.getTournamentClassrooms(tournamentId);
          callback(classrooms);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Subscribe to tournament leaderboard changes (realtime)
   */
  subscribeTournamentLeaderboard(
    tournamentId: string,
    callback: (leaderboard: TournamentLeaderboardEntry[]) => void
  ) {
    // Listen to game_players table changes for this tournament's game sessions
    const channel = supabase
      .channel(`tournament-leaderboard:${tournamentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_players',
        },
        async (payload) => {
          // Check if this player belongs to a session in this tournament
          if (payload.new) {
            const { data: session } = await supabase
              .from('game_sessions')
              .select('tournament_id')
              .eq('id', (payload.new as any).game_session_id)
              .single();

            if ((session as any)?.tournament_id === tournamentId) {
              // Refetch leaderboard
              const leaderboard = await this.getTournamentLeaderboard(tournamentId);
              callback(leaderboard);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Get tournaments where user is coordinator or participant
   */
  async getUserTournaments(userId: string): Promise<Tournament[]> {
    // Get tournaments where user is coordinator
    const { data: coordinatorTournaments, error: coordError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('coordinator_id', userId)
      .order('created_at', { ascending: false });

    if (coordError) {
      console.error('[getUserTournaments] Error fetching coordinator tournaments:', coordError);
      throw new Error(`Failed to fetch coordinator tournaments: ${coordError.message}`);
    }

    // Get tournaments where user is a participant (has a game session in the tournament)
    // Use an inner join to ensure we only get tournaments that actually exist
    const { data: participantTournaments, error: partError } = await supabase
      .from('game_sessions')
      .select('tournaments(*)')
      .eq('host_id', userId)
      .not('tournament_id', 'is', null);

    if (partError) {
      console.error('[getUserTournaments] Error fetching participant tournaments:', partError);
      throw new Error(`Failed to fetch participant tournaments: ${partError.message}`);
    }

    // Extract tournaments from the join result and filter out nulls (orphaned references)
    const participantTournamentsList = (participantTournaments || [])
      .map((session: any) => session.tournaments)
      .filter((tournament: Tournament | null) => tournament !== null) as Tournament[];

    // Combine and deduplicate (in case user is both coordinator and participant)
    const allTournaments = [...(coordinatorTournaments || []), ...participantTournamentsList];
    const uniqueTournaments = Array.from(
      new Map(allTournaments.map((t: Tournament) => [t.id, t])).values()
    );

    return uniqueTournaments.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },
};
