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
          session_type,
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

      const playersData = players as any[];
      const sessionData = session as any;
      const totalPlayers = playersData.length;
      const minimumPlayers = ALLOW_SINGLE_PLAYER_PATHKEY_AWARDS ? 1 : 3;

      // Process each player
      for (const player of playersData) {
        if (!player.user_id) {
          console.log(`Skipping guest player: ${player.display_name}`);
          continue;
        }

        // Section 1: Career Mastery
        // Two paths to earn:
        // 1. Solo career_quest: Completing any solo career quest game
        // 2. Multiplayer exploration_type='career': Top 3 placement with minimum players
        const isSoloCareerQuest = sessionData.game_mode === 'career_quest' && sessionData.session_type === 'solo';
        const isMultiplayerCareerExploration =
          sessionData.exploration_type === 'career' &&
          player.placement &&
          player.placement <= 3 &&
          totalPlayers >= minimumPlayers;

        if (isSoloCareerQuest || isMultiplayerCareerExploration) {
          const questionSet = sessionData.question_sets;
          const careerId = questionSet?.career_id;

          if (careerId) {
            const awardReason = isSoloCareerQuest
              ? `solo career_quest completion`
              : `placement ${player.placement} in multiplayer career exploration`;
            console.log(`Awarding Career Mastery to ${player.display_name} - ${awardReason}`);
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
            const questionSet = sessionData.question_sets;

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
      const { data: progress } = await supabase
        .from('student_business_driver_progress')
        .select('*')
        .eq('student_id', userId)
        .eq('career_id', careerId)
        .eq('business_driver', businessDriver)
        .single();

      let currentProgress = progress as any;

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
          } as any)
          .select()
          .single();

        if (createError) {
          console.error('Error creating business driver progress:', createError);
          return { success: false, error: createError };
        }

        currentProgress = newProgress as any;
      }

      // If already mastered, no need to continue
      if (currentProgress?.mastery_achieved) {
        return { success: true, masteryAchieved: true };
      }

      // Update chunk progress
      const newQuestionCount = (currentProgress?.current_chunk_questions || 0) + 1;
      const newCorrectCount = (currentProgress?.current_chunk_correct || 0) + (isCorrect ? 1 : 0);

      // Check if chunk is complete
      if (newQuestionCount === SECTION_3_CHUNK_SIZE) {
        const accuracy = (newCorrectCount / SECTION_3_CHUNK_SIZE) * 100;

        if (accuracy >= SECTION_3_ACCURACY_THRESHOLD) {
          // Chunk succeeded - mark mastery achieved
          const updateData: any = {
            mastery_achieved: true,
            mastery_achieved_at: new Date().toISOString(),
            current_chunk_questions: 0,
            current_chunk_correct: 0,
          };
          const { error: updateError } = await (supabase
            .from('student_business_driver_progress') as any)
            .update(updateData)
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
          const resetData: any = {
            current_chunk_questions: 0,
            current_chunk_correct: 0,
          };
          const { error: resetError } = await (supabase
            .from('student_business_driver_progress') as any)
            .update(resetData)
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
        const updateData: any = {
          current_chunk_questions: newQuestionCount,
          current_chunk_correct: newCorrectCount,
          updated_at: new Date().toISOString(),
        };
        const { error: updateError } = await (supabase
          .from('student_business_driver_progress') as any)
          .update(updateData)
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

      const existingData = existing as any;
      if (existingData?.career_mastery_unlocked) {
        console.log(`Career mastery already unlocked for user ${userId}, career ${careerId}`);
        return true;
      }

      // Award career mastery
      const upsertData: any = {
        student_id: userId,
        career_id: careerId,
        career_mastery_unlocked: true,
        career_mastery_unlocked_at: new Date().toISOString(),
      };
      const { error } = await supabase
        .from('student_pathkeys')
        .upsert(upsertData, {
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
        const recordData = record as any;
        const careerId = recordData.career_id;

        // Insert progress record (will be ignored if duplicate)
        await supabase
          .from('student_pathkey_progress')
          .insert({
            student_id: userId,
            career_id: careerId,
            mastery_type: 'industry',
            question_set_id: questionSetId,
            accuracy: accuracy,
          } as any)
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
          const updateData: any = {
            industry_mastery_unlocked: true,
            industry_mastery_via: 'industry',
            industry_mastery_unlocked_at: new Date().toISOString(),
          };
          await (supabase
            .from('student_pathkeys') as any)
            .update(updateData)
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
        const recordData = record as any;
        const careerId = recordData.career_id;

        // Insert progress record (will be ignored if duplicate)
        await supabase
          .from('student_pathkey_progress')
          .insert({
            student_id: userId,
            career_id: careerId,
            mastery_type: 'cluster',
            question_set_id: questionSetId,
            accuracy: accuracy,
          } as any)
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
          const updateData: any = {
            cluster_mastery_unlocked: true,
            industry_mastery_via: 'cluster',
            industry_mastery_unlocked_at: new Date().toISOString(),
          };
          await (supabase
            .from('student_pathkeys') as any)
            .update(updateData)
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
      const driverData = driverProgress as any[];
      const completedDrivers = driverData
        .filter(d => d.mastery_achieved)
        .map(d => d.business_driver);

      const allComplete = SECTION_3_REQUIRED_DRIVERS.every(driver =>
        completedDrivers.includes(driver)
      );

      if (allComplete) {
        // Award business driver mastery (Section 3)
        const updateData: any = {
          business_driver_mastery_unlocked: true,
          business_driver_mastery_unlocked_at: new Date().toISOString(),
        };
        await (supabase
          .from('student_pathkeys') as any)
          .update(updateData)
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

  /**
   * Get business driver progress for a student's career
   */
  async getBusinessDriverProgress(userId: string, careerId: string) {
    try {
      const { data, error } = await supabase
        .from('student_business_driver_progress')
        .select('business_driver, current_progress, mastery_achieved')
        .eq('student_id', userId)
        .eq('career_id', careerId);

      if (error) {
        console.error('Error fetching business driver progress:', error);
        return { drivers: null, error };
      }

      return { drivers: data, error: null };
    } catch (error) {
      console.error('Error in getBusinessDriverProgress:', error);
      return { drivers: null, error };
    }
  },

  /**
   * Get student pathkey progress for all careers
   * Returns enriched data ready for CareerPathkeyCard component
   */
  async getAllCareerPathkeyProgress(userId: string) {
    try {
      // Get all careers
      const { data: careers, error: careersError } = await supabase
        .from('careers')
        .select(`
          id,
          title,
          sector,
          career_cluster,
          pathkey_career_image,
          pathkey_lock_image,
          pathkey_key_image
        `)
        .order('title');

      if (careersError) {
        console.error('Error fetching careers:', careersError);
        return { pathkeys: null, error: careersError };
      }

      // Get student's pathkey progress
      const { data: studentPathkeys, error: pathkeysError } = await supabase
        .from('student_pathkeys')
        .select('*')
        .eq('student_id', userId);

      if (pathkeysError) {
        console.error('Error fetching student pathkeys:', pathkeysError);
        return { pathkeys: null, error: pathkeysError };
      }

      // Get all business driver progress
      const { data: allDriverProgress, error: driversError } = await supabase
        .from('student_business_driver_progress')
        .select('career_id, business_driver, current_chunk_correct, mastery_achieved')
        .eq('student_id', userId);

      if (driversError) {
        console.error('Error fetching driver progress:', driversError);
        // Continue without driver data
      }

      // Get Section 2 progress (industry/cluster sets)
      const { data: section2Progress, error: section2Error } = await supabase
        .from('student_pathkey_progress')
        .select('career_id, mastery_type, accuracy')
        .eq('student_id', userId)
        .gte('accuracy', SECTION_2_ACCURACY_THRESHOLD);

      if (section2Error) {
        console.error('Error fetching section 2 progress:', section2Error);
        // Continue without section 2 data
      }

      // Map careers to pathkey card data
      const careersData = careers as any[];
      const studentPathkeysData = studentPathkeys as any[];
      const allDriverProgressData = allDriverProgress as any[];
      const section2ProgressData = section2Progress as any[];

      const pathkeys = careersData?.map((career) => {
        const studentProgress = studentPathkeysData?.find(sp => sp.career_id === career.id);
        const driverProgress = allDriverProgressData?.filter(d => d.career_id === career.id) || [];
        const sets = section2ProgressData?.filter(s => s.career_id === career.id) || [];

        return {
          careerId: career.id,
          careerTitle: career.title,
          careerSector: career.sector,
          careerCluster: career.career_cluster,

          section1: {
            unlocked: studentProgress?.career_mastery_unlocked || false,
            unlockedAt: studentProgress?.career_mastery_unlocked_at,
          },

          section2: {
            unlocked: studentProgress?.cluster_mastery_unlocked || studentProgress?.industry_mastery_unlocked || false,
            unlockedAt: studentProgress?.industry_mastery_unlocked_at,
            via: studentProgress?.industry_mastery_via as 'industry' | 'cluster' | undefined,
            progress: sets.length,
            required: SECTION_2_REQUIRED_SETS,
          },

          section3: {
            unlocked: studentProgress?.business_driver_mastery_unlocked || false,
            unlockedAt: studentProgress?.business_driver_mastery_unlocked_at,
            drivers: SECTION_3_REQUIRED_DRIVERS.map(driver => {
              const progress = driverProgress.find(d => d.business_driver === driver);
              return {
                driver,
                mastered: progress?.mastery_achieved || false,
                currentProgress: progress?.current_chunk_correct || 0,
                required: SECTION_3_CHUNK_SIZE,
              };
            }),
          },

          images: {
            career: career.pathkey_career_image,
            lock: career.pathkey_lock_image,
            key: career.pathkey_key_image,
          },
        };
      }) || [];

      return { pathkeys, error: null };
    } catch (error) {
      console.error('Error in getAllCareerPathkeyProgress:', error);
      return { pathkeys: null, error };
    }
  },
};
