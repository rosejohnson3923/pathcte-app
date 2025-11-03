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
    const { data, error } = await supabase.rpc('create_tournament', {
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
    });

    if (error) {
      console.error('Error creating tournament:', error);
      throw new Error(`Failed to create tournament: ${error.message}`);
    }

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
    });

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
    });

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
    });

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
    });

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
   * Update tournament status
   */
  async updateTournamentStatus(
    tournamentId: string,
    status: TournamentStatus
  ): Promise<Tournament> {
    const { data, error } = await supabase
      .from('tournaments')
      .update({ status })
      .eq('id', tournamentId)
      .select()
      .single();

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

            if (session?.tournament_id === tournamentId) {
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
};
