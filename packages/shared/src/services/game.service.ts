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
  SessionType,
  Question
} from '../types/database.types';

// Development/Testing Configuration
// Set to true to enable pathkey awards for any number of players (useful for testing)
// Set to false for production (requires 3+ players for competitive gameplay)
const ALLOW_SINGLE_PLAYER_PATHKEY_AWARDS = process.env.NODE_ENV !== 'production';

export interface CreateGameParams {
  hostId: string;
  questionSetId: string;
  gameMode: GameMode;
  sessionType?: SessionType;
  maxPlayers?: number;
  isPublic?: boolean;
  allowLateJoin?: boolean;
  settings?: {
    progressionControl?: 'auto' | 'manual';
    [key: string]: any;
  };
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
          session_type: params.sessionType || 'multiplayer',
          status: 'waiting' as GameStatus,
          max_players: params.maxPlayers || 50,
          is_public: params.isPublic ?? true,
          allow_late_join: params.allowLateJoin ?? false,
          settings: params.settings || {},
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

      // Check if player already joined this game
      if (params.userId) {
        const { data: existingPlayer } = (await supabase
          .from('game_players')
          .select('*')
          .eq('game_session_id', gameSession.id)
          .eq('user_id', params.userId)
          .maybeSingle()) as { data: GamePlayer | null; error: any };

        if (existingPlayer) {
          // Player already joined - update connection status and return existing player
          const { data: updatedPlayer } = (await (supabase
            .from('game_players') as any)
            .update({ is_connected: true })
            .eq('id', existingPlayer.id)
            .select()
            .single()) as { data: GamePlayer | null; error: any };

          return { player: updatedPlayer || existingPlayer, session: gameSession, error: null };
        }
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
      console.log('Step 1: Calculating placements...');
      const placementsResult = await this.calculatePlacements(sessionId);
      if (!placementsResult.success) {
        console.error('Failed to calculate placements:', placementsResult.error);
        throw placementsResult.error || new Error('Failed to calculate placements');
      }
      console.log('Placements calculated successfully');

      console.log('Step 2: Awarding rewards...');
      const rewardsResult = await this.awardRewards(sessionId);
      if (!rewardsResult.success) {
        console.error('Failed to award rewards:', rewardsResult.error);
        throw rewardsResult.error || new Error('Failed to award rewards');
      }
      console.log('Rewards awarded successfully');

      console.log('Step 3: Updating session status...');
      // Update session status
      const { data: session, error } = (await (supabase
        .from('game_sessions') as any)
        .update({
          status: 'completed' as GameStatus,
          ended_at: new Date().toISOString(),
        })
        .eq('id', sessionId)
        .select()
        .single()) as { data: GameSession | null; error: any };

      if (error) {
        console.error('Failed to update session status:', error);
        throw error;
      }
      console.log('Session status updated successfully');

      return { session, error: null };
    } catch (error) {
      console.error('Error ending game:', error);
      return { session: null, error };
    }
  },

  /**
   * Calculate player placements based on score
   * SECURITY: Uses database function with SECURITY DEFINER to prevent placement manipulation
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

      // Update placements using secure function
      for (let i = 0; i < players.length; i++) {
        const { error: updateError } = await supabase.rpc('update_player_placement', {
          p_player_id: players[i].id,
          p_placement: i + 1,
        } as any);

        if (updateError) {
          console.error(`Error updating placement for player ${players[i].id}:`, updateError);
          throw updateError;
        }
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Error calculating placements:', error);
      return { success: false, error };
    }
  },

  /**
   * Award tokens and pathkeys to players
   * SECURITY: Uses database function with SECURITY DEFINER to prevent reward manipulation
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

      const totalPlayers = players.length;

      // Award tokens based on score and placement
      for (const player of players) {
        console.log(`Processing player: ${player.display_name}, user_id: ${player.user_id}, placement: ${player.placement}`);

        // Calculate tokens: base (10) + score/10 + placement bonus
        let tokensEarned = 10; // Base tokens for participation
        tokensEarned += Math.floor(player.score / 10); // 1 token per 10 points

        // Placement bonus
        if (player.placement === 1) tokensEarned += 50;
        else if (player.placement === 2) tokensEarned += 30;
        else if (player.placement === 3) tokensEarned += 20;

        let pathkeysEarned: string[] | null = null;

        // Award pathkeys for top 3 finishers
        // In production: Requires 3+ players for meaningful competition
        // In development: Allows testing with any number of players
        const minimumPlayers = ALLOW_SINGLE_PLAYER_PATHKEY_AWARDS ? 1 : 3;
        if (player.user_id && player.placement && player.placement <= 3 && totalPlayers >= minimumPlayers) {
          console.log(`Player ${player.display_name} (user_id: ${player.user_id}) finished in place ${player.placement}, awarding pathkey...`);

          // Get a random pathkey to award (simplified - could be based on career/topic)
          const { data: pathkeys, error: pathkeyError } = (await supabase
            .from('pathkeys')
            .select('id')
            .eq('is_active', true)
            .limit(1)) as { data: { id: string }[] | null; error: any };

          if (pathkeyError) {
            console.error('Error fetching pathkey:', pathkeyError);
          }

          if (pathkeys && pathkeys.length > 0) {
            const pathkeyId = pathkeys[0].id;
            console.log(`Awarding pathkey ${pathkeyId} to user ${player.user_id}`);

            const { data: success, error: awardError } = await (supabase.rpc as any)('award_pathkey', {
              p_user_id: player.user_id,
              p_pathkey_id: pathkeyId,
            });

            if (awardError) {
              console.error('Error awarding pathkey:', awardError);
            } else if (success) {
              console.log('Pathkey awarded successfully to user_pathkeys table');
              pathkeysEarned = [pathkeyId];
            } else {
              console.error('Pathkey award returned false - operation failed silently');
            }
          } else {
            console.warn('No pathkeys available to award');
          }
        } else {
          console.log(`Skipping pathkey award for ${player.display_name}: user_id=${player.user_id}, placement=${player.placement}, totalPlayers=${totalPlayers}, minimumRequired=${minimumPlayers}`);
        }

        // Update player's rewards using secure function
        console.log(`Calling award_player_rewards for player ${player.id} with:`, {
          tokens: tokensEarned,
          pathkeys: pathkeysEarned,
        });

        const { error: rewardError } = await supabase.rpc('award_player_rewards', {
          p_player_id: player.id,
          p_tokens_earned: tokensEarned,
          p_pathkeys_earned: pathkeysEarned,
        } as any);

        if (rewardError) {
          console.error(`Error awarding rewards to player ${player.id}:`, rewardError);
          throw rewardError;
        }

        // Verify the update by reading back the player
        const { data: verifyPlayer, error: verifyError } = await supabase
          .from('game_players')
          .select('pathkeys_earned, tokens_earned')
          .eq('id', player.id)
          .single();

        if (!verifyError && verifyPlayer) {
          console.log(`Verified player ${player.id} rewards:`, verifyPlayer);
        } else {
          console.error(`Failed to verify player ${player.id} rewards:`, verifyError);
        }

        // If user is registered, award tokens to their profile
        if (player.user_id) {
          await (supabase.rpc as any)('award_tokens', {
            p_user_id: player.user_id,
            p_amount: tokensEarned,
          });
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
   * SECURITY: Uses database function with SECURITY DEFINER to prevent score manipulation
   */
  async submitAnswer(params: SubmitAnswerParams) {
    try {
      console.log('[submitAnswer] Submitting with params:', {
        playerId: params.playerId,
        sessionId: params.sessionId,
        questionId: params.questionId,
        selectedOptionIndex: params.selectedOptionIndex,
        timeTakenMs: params.timeTakenMs,
      });

      // Call secure database function
      // This function validates timing, prevents duplicates, and updates scores
      // It runs with SECURITY DEFINER, bypassing RLS while maintaining security
      const { data, error } = await supabase.rpc('submit_answer_securely', {
        p_player_id: params.playerId,
        p_game_session_id: params.sessionId,
        p_question_id: params.questionId,
        p_selected_option_index: params.selectedOptionIndex,
        p_time_taken_ms: params.timeTakenMs,
      } as any);

      if (error) throw error;

      const result = (data as any)?.[0];
      if (!result) throw new Error('No result returned from answer submission');

      return {
        answer: { id: result.answer_id } as GameAnswer,
        isCorrect: result.is_correct,
        pointsAwarded: result.points_earned,
        error: null,
      };
    } catch (error: any) {
      console.error('[submitAnswer] Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        fullError: error,
      });
      return { answer: null, isCorrect: false, pointsAwarded: 0, error };
    }
  },

  /**
   * Get existing answer for a player and question (for duplicate detection)
   */
  async getExistingAnswer(playerId: string, questionId: string) {
    try {
      const { data, error } = await supabase
        .from('game_answers')
        .select('selected_option_index, is_correct, points_earned')
        .eq('player_id', playerId)
        .eq('question_id', questionId)
        .single();

      if (error) throw error;

      return {
        answer: data,
        error: null,
      };
    } catch (error) {
      console.error('Error fetching existing answer:', error);
      return { answer: null, error };
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
   * SECURITY: Answer keys (is_correct) are removed from client response
   */
  async getGameQuestions(questionSetId: string, includeAnswers: boolean = false, businessDriver?: string) {
    try {
      let query = supabase
        .from('questions')
        .select('*')
        .eq('question_set_id', questionSetId);

      // Filter by business_driver if specified (not 'all')
      if (businessDriver && businessDriver !== 'all') {
        query = query.eq('business_driver', businessDriver);
      }

      const { data: questions, error } = (await query
        .order('order_index', { ascending: true })) as { data: Question[] | null; error: any };

      if (error) throw error;

      // SECURITY FIX: Remove is_correct flag from options before sending to client
      // This prevents students from viewing answer keys in browser DevTools
      // Exception: Hosts/teachers need to see correct answers, so they pass includeAnswers=true
      const sanitizedQuestions = questions?.map(q => ({
        ...q,
        options: q.options.map(opt =>
          includeAnswers
            ? opt  // Host: return full option with is_correct
            : { text: opt.text }  // Student: only return text
        )
      }));

      return { questions: sanitizedQuestions, error: null };
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

  /**
   * Start a Career Quest (solo practice game for a specific career)
   */
  async startCareerQuest(params: {
    userId: string;
    careerId: string;
    careerTitle: string;
    careerSector: string;
  }) {
    try {
      // PRIORITY 1: Find career-specific career quest question set
      const { data: careerSet, error: careerSetError } = await supabase
        .from('question_sets')
        .select('id, title, total_questions')
        .eq('is_public', true)
        .eq('career_id', params.careerId)
        .eq('question_set_type', 'career_quest')
        .limit(1)
        .single();

      const careerSetData = careerSet as any;

      let questionSetId: string;

      if (careerSetData && !careerSetError) {
        // Found career-specific career quest question set
        questionSetId = careerSetData.id;
      } else {
        // PRIORITY 2: Fall back to sector-based Career Quest question set
        const { data: sectorSets, error: sectorError } = await supabase
          .from('question_sets')
          .select('id, title, total_questions')
          .eq('is_public', true)
          .eq('career_sector', params.careerSector)
          .limit(1);

        const sectorSetsData = sectorSets as any[];

        if (sectorSetsData && sectorSetsData.length > 0 && !sectorError) {
          questionSetId = sectorSetsData[0].id;
        } else {
          // PRIORITY 3: Fall back to any public question set
          const { data: anySet, error: anySetError } = await supabase
            .from('question_sets')
            .select('id')
            .eq('is_public', true)
            .limit(1)
            .single();

          const anySetData = anySet as any;

          if (anySetError || !anySetData) {
            throw new Error('No question sets available. Please contact your teacher to create some.');
          }

          questionSetId = anySetData.id;
        }
      }

      // Create a career quest game session
      const { session, error: sessionError } = await this.createGame({
        hostId: params.userId,
        questionSetId,
        gameMode: 'career_quest' as any,
        sessionType: 'solo', // Solo student practice
        maxPlayers: 1,
        isPublic: false,
        allowLateJoin: false,
        settings: {
          progressionControl: 'auto', // Solo games always auto-advance
        },
      } as any);

      if (sessionError || !session) {
        throw sessionError || new Error('Failed to create career quest');
      }

      // Auto-join as the only player
      const { player, error: joinError } = await this.joinGame({
        gameCode: session.game_code,
        displayName: 'Explorer',
        userId: params.userId,
      });

      if (joinError || !player) {
        throw joinError || new Error('Failed to join career quest');
      }

      // Auto-start the game immediately
      const { session: startedSession, error: startError } = await this.startGame(session.id);

      if (startError || !startedSession) {
        throw startError || new Error('Failed to start career quest');
      }

      return {
        session: startedSession,
        player,
        error: null,
      };
    } catch (error) {
      console.error('Error starting career quest:', error);
      return { session: null, player: null, error };
    }
  },
};
