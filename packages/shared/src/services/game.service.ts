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
import { pathkeyService } from './pathkey.service';

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
 * Helper function to shuffle an array
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Game Service
 * Handles all game session operations
 */
export const gameService = {
  /**
   * Select questions with variety (avoids recently used questions)
   *
   * @param hostId - Teacher ID (or student ID for solo games)
   * @param questionSetId - The question set to select from
   * @param count - Number of questions to select (max 30)
   * @returns Array of selected question IDs
   */
  async selectQuestionsWithVariety(
    hostId: string,
    questionSetId: string,
    count: number
  ): Promise<string[]> {
    try {
      // Get recently used questions from last 3 games
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: recentGames } = await supabase
        .from('game_sessions')
        .select('metadata')
        .eq('host_id', hostId)
        .eq('question_set_id', questionSetId)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(3);

      // Extract used question IDs from metadata
      const usedQuestionIds = new Set<string>();
      (recentGames || []).forEach((game: any) => {
        const selectedIds = game.metadata?.selected_question_ids || [];
        selectedIds.forEach((id: string) => usedQuestionIds.add(id));
      });

      // Get all questions from the set
      const { data: allQuestions, error: questionsError } = await supabase
        .from('questions')
        .select('id')
        .eq('question_set_id', questionSetId);

      if (questionsError || !allQuestions) {
        throw new Error('Failed to fetch questions from question set');
      }

      // Type assertion for Supabase query result
      const questions = allQuestions as Array<{ id: string }>;

      // Separate into available (not recently used) and used
      const availableQuestions = questions.filter(q => !usedQuestionIds.has(q.id));
      const usedQuestions = questions.filter(q => usedQuestionIds.has(q.id));

      let selectedQuestionIds: string[] = [];

      if (availableQuestions.length >= count) {
        // Enough unseen questions - randomly select from them
        selectedQuestionIds = shuffleArray(availableQuestions)
          .slice(0, count)
          .map(q => q.id);
      } else {
        // Not enough unseen - use all available + fill from used (randomized)
        selectedQuestionIds = [
          ...availableQuestions.map(q => q.id),
          ...shuffleArray(usedQuestions)
            .slice(0, count - availableQuestions.length)
            .map(q => q.id),
        ];
      }

      console.log(`[GameService] Selected ${selectedQuestionIds.length} questions for variety:`, {
        totalAvailable: questions.length,
        recentlyUsed: usedQuestionIds.size,
        freshQuestions: availableQuestions.length,
        selectedCount: selectedQuestionIds.length,
      });

      return selectedQuestionIds;
    } catch (error) {
      console.error('[GameService] Error selecting questions with variety:', error);
      // Fallback to simple random selection if variety logic fails
      const { data: allQuestions } = await supabase
        .from('questions')
        .select('id')
        .eq('question_set_id', questionSetId);

      if (!allQuestions || allQuestions.length === 0) {
        throw new Error('No questions available in question set');
      }

      const questions = allQuestions as Array<{ id: string }>;

      return shuffleArray(questions)
        .slice(0, Math.min(count, questions.length))
        .map(q => q.id);
    }
  },

  /**
   * Create a new game session
   */
  async createGame(params: CreateGameParams) {
    try {
      // Generate unique 6-character game code
      const gameCode = await this.generateGameCode();

      // If questionCount is specified, select questions with variety
      let selectedQuestionIds: string[] | undefined;
      if (params.settings?.questionCount) {
        // Use the new variety-aware selection
        selectedQuestionIds = await this.selectQuestionsWithVariety(
          params.hostId,
          params.questionSetId,
          params.settings.questionCount
        );
      }

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
          metadata: selectedQuestionIds ? { selected_question_ids: selectedQuestionIds } : {},
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

      console.log('Step 2.5: Processing pathkey awards...');
      const pathkeyResult = await pathkeyService.processGameEndPathkeys(sessionId);
      if (!pathkeyResult.success) {
        console.error('Warning: Failed to process pathkey awards:', pathkeyResult.error);
        // Don't throw - pathkey awards are non-critical, game should still end
      } else {
        console.log('Pathkey awards processed successfully');
      }

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

      // Process business driver tracking (Section 3 of pathkey system)
      // Only for career-specific questions with business_driver populated
      try {
        const { data: questionData } = await supabase
          .from('questions')
          .select(`
            business_driver,
            question_set_id,
            question_sets!inner (
              career_id
            )
          `)
          .eq('id', params.questionId)
          .single();

        const question = questionData as any;

        // Check if this is a career question with business driver
        if (question?.business_driver && question?.question_sets?.career_id) {
          const { data: player } = await supabase
            .from('game_players')
            .select('user_id')
            .eq('id', params.playerId)
            .single();

          const playerData = player as any;
          if (playerData?.user_id) {
            // Track business driver progress asynchronously (don't block answer submission)
            pathkeyService.processBusinessDriverProgress(
              playerData.user_id,
              question.question_sets.career_id,
              question.business_driver,
              result.is_correct
            ).catch(error => {
              console.error('Error processing business driver progress:', error);
              // Non-critical, continue
            });
          }
        }
      } catch (error) {
        console.error('Error checking business driver:', error);
        // Non-critical, continue with answer submission
      }

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
   * Get all answers for a player with question details (for post-game review)
   * Returns ALL questions from the game session, including unanswered ones
   */
  async getPlayerAnswersWithQuestions(playerId: string) {
    try {
      // First, get the player's game session and the selected questions
      const { data: player, error: playerError } = await supabase
        .from('game_players')
        .select('game_session_id, game_sessions(metadata)')
        .eq('id', playerId)
        .single();

      if (playerError) throw playerError;
      if (!player) throw new Error('Player not found');

      const sessionMetadata = (player as any).game_sessions?.metadata;
      const selectedQuestionIds = sessionMetadata?.selected_question_ids || [];

      if (selectedQuestionIds.length === 0) {
        return { answers: [], error: null };
      }

      // Get all questions that were in this game
      const { data: allQuestions, error: questionsError } = await supabase
        .from('questions')
        .select('id, question_text, options')
        .in('id', selectedQuestionIds);

      if (questionsError) throw questionsError;

      // Get all answers for this player
      const { data: playerAnswers, error: answersError } = await supabase
        .from('game_answers')
        .select('id, question_id, selected_option_index, is_correct, points_earned, time_taken_ms, answered_at')
        .eq('player_id', playerId);

      if (answersError) throw answersError;

      // Type assertion for answers
      const typedAnswers = (playerAnswers || []) as Array<{
        id: string;
        question_id: string;
        selected_option_index: number;
        is_correct: boolean;
        points_earned: number;
        time_taken_ms: number;
        answered_at: string;
      }>;

      // Create a map of question_id -> answer for quick lookup
      const answersMap = new Map(typedAnswers.map(a => [a.question_id, a]));

      // Type assertion for questions
      const typedQuestions = (allQuestions || []) as Array<{
        id: string;
        question_text: string;
        options: any;
      }>;

      // Build the result with all questions, preserving the order from selected_question_ids
      const result = selectedQuestionIds.map((questionId: string) => {
        const question = typedQuestions.find(q => q.id === questionId);
        const answer = answersMap.get(questionId);

        return {
          id: answer?.id || `no-answer-${questionId}`,
          selected_option_index: answer?.selected_option_index ?? null,
          is_correct: answer?.is_correct ?? false,
          points_earned: answer?.points_earned ?? 0,
          time_taken_ms: answer?.time_taken_ms ?? 0,
          answered_at: answer?.answered_at || null,
          questions: question,
        };
      });

      return { answers: result, error: null };
    } catch (error) {
      console.error('Error fetching player answers with questions:', error);
      return { answers: null, error };
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
  async getGameQuestions(questionSetId: string, includeAnswers: boolean = false, selectedQuestionIds?: string[], difficulty?: string) {
    try {
      // Query directly from questions table (question_set_membership table was deprecated)
      let query = supabase
        .from('questions')
        .select('*')
        .eq('question_set_id', questionSetId)
        .order('order_index', { ascending: true });

      // Filter by difficulty if specified
      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }

      const { data: questions, error } = await query as { data: Question[] | null; error: any };

      if (error) throw error;

      // Filter to selected questions if provided (for limited question count games)
      let filteredQuestions: Question[] | null = questions;
      if (selectedQuestionIds && selectedQuestionIds.length > 0 && questions) {
        // Create a map for efficient lookup and preserve order
        const idSet = new Set(selectedQuestionIds);
        const idOrder = new Map(selectedQuestionIds.map((id, index) => [id, index]));

        filteredQuestions = questions
          .filter(q => idSet.has(q.id))
          .sort((a, b) => (idOrder.get(a.id) || 0) - (idOrder.get(b.id) || 0));
      }

      // SECURITY FIX: Remove is_correct flag from options before sending to client
      // This prevents students from viewing answer keys in browser DevTools
      // Exception: Hosts/teachers need to see correct answers, so they pass includeAnswers=true
      const sanitizedQuestions = filteredQuestions?.map(q => ({
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
    questionCount?: number;
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
          questionCount: params.questionCount || 20, // Default to 20 questions for solo
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
