/**
 * Game Service
 * =============
 * Core game session management and operations
 */

import { supabase } from '../config/supabase';
import type {
  GameSession,
  GamePlayer,
  GameAnswer,
  GameMode,
  GameStatus,
  Question
} from '../types/database.types';

export interface CreateGameParams {
  hostId: string;
  questionSetId: string;
  gameMode: GameMode;
  maxPlayers?: number;
  isPublic?: boolean;
  allowLateJoin?: boolean;
}

export interface JoinGameParams {
  gameCode: string;
  displayName: string;
  userId?: string;
}

export interface SubmitAnswerParams {
  playerId: string;
  sessionId: string;
  questionId: string;
  selectedOptionIndex: number;
  timeTakenMs: number;
}

/**
 * Game Service
 * Handles all game session operations
 */
export const gameService = {
  /**
   * Create a new game session
   */
  async createGame(params: CreateGameParams) {
    try {
      // Generate unique 6-character game code
      const gameCode = await this.generateGameCode();

      const { data: session, error } = (await supabase
        .from('game_sessions')
        .insert({
          game_code: gameCode,
          host_id: params.hostId,
          question_set_id: params.questionSetId,
          game_mode: params.gameMode,
          status: 'waiting' as GameStatus,
          max_players: params.maxPlayers || 50,
          is_public: params.isPublic ?? true,
          allow_late_join: params.allowLateJoin ?? false,
          metadata: {},
        } as any)
        .select()
        .single()) as { data: GameSession | null; error: any };

      if (error) throw error;

      return { session, error: null };
    } catch (error) {
      console.error('Error creating game:', error);
      return { session: null, error };
    }
  },

  /**
   * Generate a unique 6-character game code
   */
  async generateGameCode(): Promise<string> {
    const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed I, O for clarity
    let code = '';
    let isUnique = false;

    while (!isUnique) {
      code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      // Check if code already exists
      const { data } = await supabase
        .from('game_sessions')
        .select('id')
        .eq('game_code', code)
        .eq('status', 'waiting')
        .single();

      if (!data) {
        isUnique = true;
      }
    }

    return code;
  },

  /**
   * Get game session by code
   */
  async getGameByCode(gameCode: string) {
    try {
      const { data: session, error } = (await supabase
        .from('game_sessions')
        .select(`
          *,
          question_sets (
            id,
            title,
            total_questions
          )
        `)
        .eq('game_code', gameCode.toUpperCase())
        .single()) as { data: GameSession | null; error: any };

      if (error) throw error;

      return { session, error: null };
    } catch (error) {
      console.error('Error fetching game:', error);
      return { session: null, error };
    }
  },

  /**
   * Get game session by ID
   */
  async getGameById(sessionId: string) {
    try {
      const { data: session, error } = (await supabase
        .from('game_sessions')
        .select(`
          *,
          question_sets (
            id,
            title,
            total_questions
          )
        `)
        .eq('id', sessionId)
        .single()) as { data: GameSession | null; error: any };

      if (error) throw error;

      return { session, error: null };
    } catch (error) {
      console.error('Error fetching game by id:', error);
      return { session: null, error };
    }
  },

  /**
   * Join a game session
   */
  async joinGame(params: JoinGameParams) {
    try {
      // First, get the game session
      const { session: gameSession, error: sessionError } = await this.getGameByCode(params.gameCode);

      if (sessionError || !gameSession) {
        throw new Error('Game not found');
      }

      // Check if game is joinable
      if (gameSession.status !== 'waiting') {
        throw new Error('Game has already started');
      }

      // Check player count
      const { count } = await supabase
        .from('game_players')
        .select('*', { count: 'exact', head: true })
        .eq('game_session_id', gameSession.id);

      if (count && count >= gameSession.max_players) {
        throw new Error('Game is full');
      }

      // Create player entry
      const { data: player, error: playerError } = (await supabase
        .from('game_players')
        .insert({
          game_session_id: gameSession.id,
          user_id: params.userId || null,
          display_name: params.displayName,
          score: 0,
          correct_answers: 0,
          total_answers: 0,
          is_connected: true,
          tokens_earned: 0,
          pathkeys_earned: null,
        } as any)
        .select()
        .single()) as { data: GamePlayer | null; error: any };

      if (playerError) throw playerError;

      return { player, session: gameSession, error: null };
    } catch (error) {
      console.error('Error joining game:', error);
      return { player: null, session: null, error };
    }
  },

  /**
   * Get all players in a game session
   */
  async getGamePlayers(sessionId: string) {
    try {
      const { data: players, error } = (await supabase
        .from('game_players')
        .select('*')
        .eq('game_session_id', sessionId)
        .order('joined_at', { ascending: true })) as { data: GamePlayer[] | null; error: any };

      if (error) throw error;

      return { players, error: null };
    } catch (error) {
      console.error('Error fetching players:', error);
      return { players: null, error };
    }
  },

  /**
   * Start a game session
   */
  async startGame(sessionId: string) {
    try {
      const { data: session, error } = (await (supabase
        .from('game_sessions') as any)
        .update({
          status: 'in_progress' as GameStatus,
          started_at: new Date().toISOString(),
        })
        .eq('id', sessionId)
        .select()
        .single()) as { data: GameSession | null; error: any };

      if (error) throw error;

      return { session, error: null };
    } catch (error) {
      console.error('Error starting game:', error);
      return { session: null, error };
    }
  },

  /**
   * End a game session
   */
  async endGame(sessionId: string) {
    try {
      // Calculate final placements
      await this.calculatePlacements(sessionId);

      // Award tokens and pathkeys
      await this.awardRewards(sessionId);

      // Update session status
      const { data: session, error } = (await (supabase
        .from('game_sessions') as any)
        .update({
          status: 'completed' as GameStatus,
          completed_at: new Date().toISOString(),
        })
        .eq('id', sessionId)
        .select()
        .single()) as { data: GameSession | null; error: any };

      if (error) throw error;

      return { session, error: null };
    } catch (error) {
      console.error('Error ending game:', error);
      return { session: null, error };
    }
  },

  /**
   * Calculate player placements based on score
   */
  async calculatePlacements(sessionId: string) {
    try {
      // Get all players ordered by score
      const { data: players, error } = (await supabase
        .from('game_players')
        .select('*')
        .eq('game_session_id', sessionId)
        .order('score', { ascending: false })
        .order('correct_answers', { ascending: false })
        .order('joined_at', { ascending: true })) as { data: GamePlayer[] | null; error: any };

      if (error) throw error;
      if (!players) return { success: false, error: 'No players found' };

      // Update placements
      const updates = players.map((player, index) => ({
        id: player.id,
        placement: index + 1,
      }));

      for (const update of updates) {
        await (supabase
          .from('game_players') as any)
          .update({ placement: update.placement })
          .eq('id', update.id);
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Error calculating placements:', error);
      return { success: false, error };
    }
  },

  /**
   * Award tokens and pathkeys to players
   */
  async awardRewards(sessionId: string) {
    try {
      // Get all players
      const { data: players, error } = (await supabase
        .from('game_players')
        .select('*')
        .eq('game_session_id', sessionId)) as { data: GamePlayer[] | null; error: any };

      if (error) throw error;
      if (!players) return { success: false, error: 'No players found' };

      // Award tokens based on score and placement
      for (const player of players) {
        // Calculate tokens: base (10) + score/10 + placement bonus
        let tokensEarned = 10; // Base tokens for participation
        tokensEarned += Math.floor(player.score / 10); // 1 token per 10 points

        // Placement bonus
        if (player.placement === 1) tokensEarned += 50;
        else if (player.placement === 2) tokensEarned += 30;
        else if (player.placement === 3) tokensEarned += 20;

        // Update player's token earnings
        await (supabase
          .from('game_players') as any)
          .update({ tokens_earned: tokensEarned })
          .eq('id', player.id);

        // If user is registered, award tokens to their profile
        if (player.user_id) {
          await (supabase.rpc as any)('award_tokens', {
            p_user_id: player.user_id,
            p_amount: tokensEarned,
          });
        }

        // Award pathkeys for top 3 finishers (if registered)
        if (player.user_id && player.placement && player.placement <= 3) {
          // Get a random pathkey to award (simplified - could be based on career/topic)
          const { data: pathkeys } = (await supabase
            .from('pathkeys')
            .select('id')
            .eq('is_active', true)
            .limit(1)) as { data: { id: string }[] | null; error: any };

          if (pathkeys && pathkeys.length > 0) {
            const pathkeyId = pathkeys[0].id;

            await (supabase.rpc as any)('award_pathkey', {
              p_user_id: player.user_id,
              p_pathkey_id: pathkeyId,
            });

            // Update player's pathkeys_earned
            await (supabase
              .from('game_players') as any)
              .update({ pathkeys_earned: [pathkeyId] })
              .eq('id', player.id);
          }
        }
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Error awarding rewards:', error);
      return { success: false, error };
    }
  },

  /**
   * Submit an answer to a question
   */
  async submitAnswer(params: SubmitAnswerParams) {
    try {
      // Get the question to check if answer is correct
      const { data: question, error: questionError } = (await supabase
        .from('questions')
        .select('*')
        .eq('id', params.questionId)
        .single()) as { data: Question | null; error: any };

      if (questionError || !question) throw questionError || new Error('Question not found');

      const isCorrect = question.options[params.selectedOptionIndex]?.is_correct || false;

      // Calculate points (base points from question, bonus for speed)
      let pointsAwarded = 0;
      if (isCorrect) {
        pointsAwarded = question.points;

        // Speed bonus: up to 50% more points for fast answers
        const timeLimit = question.time_limit_seconds * 1000; // Convert to ms
        const timeRemaining = Math.max(0, timeLimit - params.timeTakenMs);
        const speedBonus = Math.floor((timeRemaining / timeLimit) * (question.points * 0.5));
        pointsAwarded += speedBonus;
      }

      // Record the answer
      const { data: answer, error: answerError } = (await supabase
        .from('game_answers')
        .insert({
          session_id: params.sessionId,
          player_id: params.playerId,
          question_id: params.questionId,
          selected_option_index: params.selectedOptionIndex,
          is_correct: isCorrect,
          time_taken_ms: params.timeTakenMs,
          points_awarded: pointsAwarded,
        } as any)
        .select()
        .single()) as { data: GameAnswer | null; error: any };

      if (answerError) throw answerError;

      // Update player's score
      const { data: player, error: playerError } = (await supabase
        .from('game_players')
        .select('score, correct_answers, total_answers')
        .eq('id', params.playerId)
        .single()) as { data: { score: number; correct_answers: number; total_answers: number } | null; error: any };

      if (playerError || !player) throw playerError || new Error('Player not found');

      await (supabase
        .from('game_players') as any)
        .update({
          score: player.score + pointsAwarded,
          correct_answers: isCorrect ? player.correct_answers + 1 : player.correct_answers,
          total_answers: player.total_answers + 1,
        })
        .eq('id', params.playerId);

      return { answer, isCorrect, pointsAwarded, error: null };
    } catch (error) {
      console.error('Error submitting answer:', error);
      return { answer: null, isCorrect: false, pointsAwarded: 0, error };
    }
  },

  /**
   * Update player connection status
   */
  async updatePlayerConnection(playerId: string, isConnected: boolean) {
    try {
      const { error } = await (supabase
        .from('game_players') as any)
        .update({
          is_connected: isConnected,
          left_at: isConnected ? null : new Date().toISOString(),
        })
        .eq('id', playerId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error updating player connection:', error);
      return { success: false, error };
    }
  },

  /**
   * Get questions for a game session
   */
  async getGameQuestions(questionSetId: string) {
    try {
      const { data: questions, error } = (await supabase
        .from('questions')
        .select('*')
        .eq('question_set_id', questionSetId)
        .order('order_index', { ascending: true })) as { data: Question[] | null; error: any };

      if (error) throw error;

      return { questions, error: null };
    } catch (error) {
      console.error('Error fetching questions:', error);
      return { questions: null, error };
    }
  },

  /**
   * Check if player has already answered a question
   */
  async hasPlayerAnswered(playerId: string, questionId: string) {
    try {
      const { data, error } = await supabase
        .from('game_answers')
        .select('id')
        .eq('player_id', playerId)
        .eq('question_id', questionId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      return { hasAnswered: !!data, error: null };
    } catch (error) {
      console.error('Error checking if player answered:', error);
      return { hasAnswered: false, error };
    }
  },
};
