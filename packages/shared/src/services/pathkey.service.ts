/**
 * Pathkey Service
 * ===============
 * Handles awarding and tracking of pathkeys based on the three-section award system
 *
 * Section 1: Career Mastery (unlock career image) - Top 3 in Career mode
 * Section 2: Industry/Cluster Mastery (unlock lock) - 3 sets with 90% accuracy
 * Section 3: Business Driver Mastery (unlock key) - 5 questions per driver with 90% accuracy
 *
 * Design: docs/PATHKEY_AWARD_SYSTEM_DESIGN.md
 */

import { supabase } from '../config/supabase';
import type { GameSession, GamePlayer, GameAnswer } from '../types/database.types';

// Development/Testing Configuration
// Set to true to enable pathkey awards for any number of players (useful for testing)
// Set to false for production (requires 3+ players for competitive gameplay)
const ALLOW_SINGLE_PLAYER_PATHKEY_AWARDS = process.env.NODE_ENV !== 'production';

// Section 2 requirements
const SECTION_2_REQUIRED_SETS = 3;
const SECTION_2_ACCURACY_THRESHOLD = 90;

// Section 3 requirements
const SECTION_3_CHUNK_SIZE = 5;
const SECTION_3_ACCURACY_THRESHOLD = 90;
const SECTION_3_REQUIRED_DRIVERS = ['people', 'product', 'pricing', 'process', 'proceeds', 'profits'];

export interface PathkeyAwardResult {
  success: boolean;
  careerMasteryAwarded?: boolean;
  industryMasteryProgress?: number;
  clusterMasteryProgress?: number;
  businessDriverProgress?: { [driver: string]: boolean };
  error?: any;
}

/**
 * Pathkey Service
 * Handles all pathkey award logic
 */
export const pathkeyService = {
  /**
   * Process pathkey awards after game ends
   * Called from game.service.ts endGame()
   */
  async processGameEndPathkeys(sessionId: string): Promise<{ success: boolean; error?: any }> {
    try {
      // Get game session details
      const { data: session, error: sessionError } = await supabase
        .from('game_sessions')
        .select(`
          id,
          game_mode,
          exploration_type,
          question_set_id,
          question_sets (
            career_id,
            career_sector,
            career_cluster
          )
        `)
        .eq('id', sessionId)
        .single();

      if (sessionError || !session) {
        console.error('Error fetching session:', sessionError);
        return { success: false, error: sessionError };
      }

      // Get all players with their placements
      const { data: players, error: playersError } = await supabase
        .from('game_players')
        .select('*')
        .eq('game_session_id', sessionId)
        .order('placement', { ascending: true });

      if (playersError || !players) {
        console.error('Error fetching players:', playersError);
        return { success: false, error: playersError };
      }

      const totalPlayers = players.length;
      const minimumPlayers = ALLOW_SINGLE_PLAYER_PATHKEY_AWARDS ? 1 : 3;

      // Process each player
      for (const player of players) {
        if (!player.user_id) {
          console.log(`Skipping guest player: ${player.display_name}`);
          continue;
        }

        // Section 1: Career Mastery (Top 3 in Career mode)
        if (
          session.exploration_type === 'career' &&
          player.placement &&
          player.placement <= 3 &&
          totalPlayers >= minimumPlayers
        ) {
          const questionSet = (session as any).question_sets;
          const careerId = questionSet?.career_id;

          if (careerId) {
            console.log(`Checking Career Mastery for ${player.display_name} (placement ${player.placement})`);
            await this.awardCareerMastery(player.user_id, careerId);
          }
        }

        // Section 2: Industry/Cluster Mastery (check after completing any question set)
        // Only check if player has already unlocked Section 1 for at least one career
        const hasCareerMastery = await this.hasAnyCareerMastery(player.user_id);
        if (hasCareerMastery) {
          // Calculate accuracy for this session
          const accuracy = player.total_answers > 0
            ? (player.correct_answers / player.total_answers) * 100
            : 0;

          if (accuracy >= SECTION_2_ACCURACY_THRESHOLD) {
            const questionSet = (session as any).question_sets;

            // Track for Industry path
            if (questionSet?.career_sector && !questionSet?.career_id) {
              await this.trackIndustryProgress(player.user_id, questionSet.career_sector, sessionId, accuracy);
            }

            // Track for Cluster path
            if (questionSet?.career_cluster && !questionSet?.career_id) {
              await this.trackClusterProgress(player.user_id, questionSet.career_cluster, sessionId, accuracy);
            }
          }
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error processing pathkey awards:', error);
      return { success: false, error };
    }
  },

  /**
   * Process Business Driver progress after each answer
   * Called from game.service.ts submitAnswer()
   */
  async processBusinessDriverProgress(
    userId: string,
    careerId: string,
    businessDriver: string,
    isCorrect: boolean
  ): Promise<{ success: boolean; masteryAchieved?: boolean; error?: any }> {
    try {
      // Get or create progress record
      const { data: progress, error: fetchError } = await supabase
        .from('student_business_driver_progress')
        .select('*')
        .eq('student_id', userId)
        .eq('career_id', careerId)
        .eq('business_driver', businessDriver)
        .single();

      let currentProgress = progress;

      // Create if doesn't exist
      if (!currentProgress) {
        const { data: newProgress, error: createError } = await supabase
          .from('student_business_driver_progress')
          .insert({
            student_id: userId,
            career_id: careerId,
            business_driver: businessDriver,
            current_chunk_questions: 0,
            current_chunk_correct: 0,
            mastery_achieved: false,
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating business driver progress:', createError);
          return { success: false, error: createError };
        }

        currentProgress = newProgress;
      }

      // If already mastered, no need to continue
      if (currentProgress.mastery_achieved) {
        return { success: true, masteryAchieved: true };
      }

      // Update chunk progress
      const newQuestionCount = currentProgress.current_chunk_questions + 1;
      const newCorrectCount = currentProgress.current_chunk_correct + (isCorrect ? 1 : 0);

      // Check if chunk is complete
      if (newQuestionCount === SECTION_3_CHUNK_SIZE) {
        const accuracy = (newCorrectCount / SECTION_3_CHUNK_SIZE) * 100;

        if (accuracy >= SECTION_3_ACCURACY_THRESHOLD) {
          // Chunk succeeded - mark mastery achieved
          const { error: updateError } = await supabase
            .from('student_business_driver_progress')
            .update({
              mastery_achieved: true,
              mastery_achieved_at: new Date().toISOString(),
              current_chunk_questions: 0,
              current_chunk_correct: 0,
            })
            .eq('student_id', userId)
            .eq('career_id', careerId)
            .eq('business_driver', businessDriver);

          if (updateError) {
            console.error('Error updating business driver mastery:', updateError);
            return { success: false, error: updateError };
          }

          console.log(`Business driver mastery achieved: ${businessDriver} for career ${careerId}`);

          // Check if all drivers are now complete
          await this.checkBusinessDriverCompletion(userId, careerId);

          return { success: true, masteryAchieved: true };
        } else {
          // Chunk failed - reset
          const { error: resetError } = await supabase
            .from('student_business_driver_progress')
            .update({
              current_chunk_questions: 0,
              current_chunk_correct: 0,
            })
            .eq('student_id', userId)
            .eq('career_id', careerId)
            .eq('business_driver', businessDriver);

          if (resetError) {
            console.error('Error resetting chunk:', resetError);
            return { success: false, error: resetError };
          }

          console.log(`Chunk failed for ${businessDriver}, resetting`);
          return { success: true, masteryAchieved: false };
        }
      } else {
        // Update chunk in progress
        const { error: updateError } = await supabase
          .from('student_business_driver_progress')
          .update({
            current_chunk_questions: newQuestionCount,
            current_chunk_correct: newCorrectCount,
            last_updated: new Date().toISOString(),
          })
          .eq('student_id', userId)
          .eq('career_id', careerId)
          .eq('business_driver', businessDriver);

        if (updateError) {
          console.error('Error updating chunk progress:', updateError);
          return { success: false, error: updateError };
        }

        return { success: true, masteryAchieved: false };
      }
    } catch (error) {
      console.error('Error processing business driver progress:', error);
      return { success: false, error };
    }
  },

  /**
   * Award Career Mastery (Section 1)
   */
  async awardCareerMastery(userId: string, careerId: string): Promise<boolean> {
    try {
      // Get or create student pathkey record
      const { data: existing } = await supabase
        .from('student_pathkeys')
        .select('*')
        .eq('student_id', userId)
        .eq('career_id', careerId)
        .single();

      if (existing?.career_mastery_unlocked) {
        console.log(`Career mastery already unlocked for user ${userId}, career ${careerId}`);
        return true;
      }

      // Award career mastery
      const { error } = await supabase
        .from('student_pathkeys')
        .upsert({
          student_id: userId,
          career_id: careerId,
          career_mastery_unlocked: true,
          career_mastery_unlocked_at: new Date().toISOString(),
        }, {
          onConflict: 'student_id,career_id',
        });

      if (error) {
        console.error('Error awarding career mastery:', error);
        return false;
      }

      console.log(`✅ Career Mastery awarded to user ${userId} for career ${careerId}`);
      return true;
    } catch (error) {
      console.error('Error in awardCareerMastery:', error);
      return false;
    }
  },

  /**
   * Track Industry path progress (Section 2)
   */
  async trackIndustryProgress(
    userId: string,
    careerSector: string,
    questionSetId: string,
    accuracy: number
  ): Promise<boolean> {
    try {
      // Find careers that match this sector where student has Career Mastery
      const { data: eligibleCareers, error: careersError } = await supabase
        .from('student_pathkeys')
        .select(`
          career_id,
          careers!inner (
            sector
          )
        `)
        .eq('student_id', userId)
        .eq('career_mastery_unlocked', true)
        .eq('careers.sector', careerSector);

      if (careersError || !eligibleCareers || eligibleCareers.length === 0) {
        console.log(`No eligible careers found for sector ${careerSector}`);
        return false;
      }

      // Track progress for each eligible career
      for (const record of eligibleCareers) {
        const careerId = record.career_id;

        // Insert progress record (will be ignored if duplicate)
        await supabase
          .from('student_pathkey_progress')
          .insert({
            student_id: userId,
            career_id: careerId,
            mastery_type: 'industry',
            question_set_id: questionSetId,
            accuracy: accuracy,
          })
          .select();

        // Check if student now has 3+ completed sets
        const { data: progressRecords } = await supabase
          .from('student_pathkey_progress')
          .select('*')
          .eq('student_id', userId)
          .eq('career_id', careerId)
          .eq('mastery_type', 'industry')
          .gte('accuracy', SECTION_2_ACCURACY_THRESHOLD);

        if (progressRecords && progressRecords.length >= SECTION_2_REQUIRED_SETS) {
          // Award industry mastery
          await supabase
            .from('student_pathkeys')
            .update({
              industry_mastery_unlocked: true,
              industry_mastery_via: 'industry',
              industry_mastery_unlocked_at: new Date().toISOString(),
            })
            .eq('student_id', userId)
            .eq('career_id', careerId);

          console.log(`✅ Industry Mastery awarded to user ${userId} for career ${careerId}`);
        }
      }

      return true;
    } catch (error) {
      console.error('Error tracking industry progress:', error);
      return false;
    }
  },

  /**
   * Track Cluster path progress (Section 2)
   */
  async trackClusterProgress(
    userId: string,
    careerCluster: string,
    questionSetId: string,
    accuracy: number
  ): Promise<boolean> {
    try {
      // Find careers that match this cluster where student has Career Mastery
      const { data: eligibleCareers, error: careersError } = await supabase
        .from('student_pathkeys')
        .select(`
          career_id,
          careers!inner (
            career_cluster
          )
        `)
        .eq('student_id', userId)
        .eq('career_mastery_unlocked', true)
        .eq('careers.career_cluster', careerCluster);

      if (careersError || !eligibleCareers || eligibleCareers.length === 0) {
        console.log(`No eligible careers found for cluster ${careerCluster}`);
        return false;
      }

      // Track progress for each eligible career
      for (const record of eligibleCareers) {
        const careerId = record.career_id;

        // Insert progress record (will be ignored if duplicate)
        await supabase
          .from('student_pathkey_progress')
          .insert({
            student_id: userId,
            career_id: careerId,
            mastery_type: 'cluster',
            question_set_id: questionSetId,
            accuracy: accuracy,
          })
          .select();

        // Check if student now has 3+ completed sets
        const { data: progressRecords } = await supabase
          .from('student_pathkey_progress')
          .select('*')
          .eq('student_id', userId)
          .eq('career_id', careerId)
          .eq('mastery_type', 'cluster')
          .gte('accuracy', SECTION_2_ACCURACY_THRESHOLD);

        if (progressRecords && progressRecords.length >= SECTION_2_REQUIRED_SETS) {
          // Award cluster mastery
          await supabase
            .from('student_pathkeys')
            .update({
              cluster_mastery_unlocked: true,
              industry_mastery_via: 'cluster',
              industry_mastery_unlocked_at: new Date().toISOString(),
            })
            .eq('student_id', userId)
            .eq('career_id', careerId);

          console.log(`✅ Cluster Mastery awarded to user ${userId} for career ${careerId}`);
        }
      }

      return true;
    } catch (error) {
      console.error('Error tracking cluster progress:', error);
      return false;
    }
  },

  /**
   * Check if all business drivers are complete for a career
   */
  async checkBusinessDriverCompletion(userId: string, careerId: string): Promise<boolean> {
    try {
      // Get all driver progress records
      const { data: driverProgress, error } = await supabase
        .from('student_business_driver_progress')
        .select('business_driver, mastery_achieved')
        .eq('student_id', userId)
        .eq('career_id', careerId);

      if (error || !driverProgress) {
        console.error('Error checking driver completion:', error);
        return false;
      }

      // Check if all 6 drivers are mastered
      const completedDrivers = driverProgress
        .filter(d => d.mastery_achieved)
        .map(d => d.business_driver);

      const allComplete = SECTION_3_REQUIRED_DRIVERS.every(driver =>
        completedDrivers.includes(driver)
      );

      if (allComplete) {
        // Award business driver mastery (Section 3)
        await supabase
          .from('student_pathkeys')
          .update({
            business_driver_mastery_unlocked: true,
            business_driver_mastery_unlocked_at: new Date().toISOString(),
          })
          .eq('student_id', userId)
          .eq('career_id', careerId);

        console.log(`✅ Business Driver Mastery (KEY) awarded to user ${userId} for career ${careerId}`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error in checkBusinessDriverCompletion:', error);
      return false;
    }
  },

  /**
   * Check if student has any career mastery unlocked
   */
  async hasAnyCareerMastery(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('student_pathkeys')
        .select('career_id')
        .eq('student_id', userId)
        .eq('career_mastery_unlocked', true)
        .limit(1);

      if (error) {
        console.error('Error checking career mastery:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error in hasAnyCareerMastery:', error);
      return false;
    }
  },

  /**
   * Get student's pathkey progress for a specific career
   */
  async getPathkeyProgress(userId: string, careerId: string) {
    try {
      const { data, error } = await supabase
        .from('student_pathkeys')
        .select(`
          *,
          careers (
            title,
            career_sector,
            career_cluster,
            pathkey_career_image,
            pathkey_lock_image,
            pathkey_key_image,
            pathkey_images_complete
          )
        `)
        .eq('student_id', userId)
        .eq('career_id', careerId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error fetching pathkey progress:', error);
        return { progress: null, error };
      }

      return { progress: data, error: null };
    } catch (error) {
      console.error('Error in getPathkeyProgress:', error);
      return { progress: null, error };
    }
  },

  /**
   * Get all pathkeys earned by a student
   */
  async getStudentPathkeys(userId: string) {
    try {
      const { data, error } = await supabase
        .from('student_pathkeys')
        .select(`
          *,
          careers (
            id,
            title,
            career_sector,
            career_cluster,
            pathkey_career_image,
            pathkey_lock_image,
            pathkey_key_image,
            pathkey_images_complete
          )
        `)
        .eq('student_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching student pathkeys:', error);
        return { pathkeys: null, error };
      }

      return { pathkeys: data, error: null };
    } catch (error) {
      console.error('Error in getStudentPathkeys:', error);
      return { pathkeys: null, error };
    }
  },
};
