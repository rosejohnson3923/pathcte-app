/**
 * Teacher Analytics Service
 * ==========================
 * Provides classroom-level analytics and insights for teachers
 * - Student pathkey progress tracking
 * - Popular career/industry/business driver analytics
 * - Question set recommendations for balanced pathkey awards
 */

import { supabase } from '../config/supabase';
import type { BusinessDriver } from '../types/database.types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TeacherStudentPathkeyProgress {
  student_id: string;
  student_email: string;
  student_name: string;
  total_pathkeys: number;

  // Career-specific progress
  careers_in_progress: CareerProgress[];
  completed_careers: number;

  // Popular choices
  most_played_career: string | null;
  most_played_industry: string | null;
  weakest_business_driver: BusinessDriver | null;
}

export interface CareerProgress {
  career_id: string;
  career_title: string;
  career_sector: string;

  // Section 1: Career Mastery
  career_mastery_unlocked: boolean;
  career_mastery_unlocked_at: string | null;

  // Section 2: Industry/Cluster Mastery
  industry_mastery_unlocked: boolean;
  industry_mastery_progress: number; // 0-3 (number of qualifying sets)

  // Section 3: Business Driver Mastery
  business_driver_mastery_unlocked: boolean;
  business_drivers_completed: BusinessDriver[];
  business_drivers_in_progress: BusinessDriver[];
}

export interface ClassroomAnalytics {
  // Overall stats
  total_students: number;
  total_games_played: number;
  total_pathkeys_awarded: number;

  // Popular content
  most_popular_careers: PopularityMetric[];
  most_popular_industries: PopularityMetric[];
  weakest_business_drivers: BusinessDriverMetric[];

  // Student engagement
  students_needing_help: StudentNeedingHelp[];
  most_active_students: StudentActivity[];
}

export interface PopularityMetric {
  name: string;
  play_count: number;
  student_count: number;
  avg_accuracy: number;
}

export interface BusinessDriverMetric {
  driver: BusinessDriver;
  total_attempts: number;
  avg_accuracy: number;
  students_struggling: number; // Students below 70% accuracy
}

export interface StudentNeedingHelp {
  student_id: string;
  student_name: string;
  student_email: string;
  issue: 'low_accuracy' | 'stuck_progress' | 'no_activity';
  details: string;
}

export interface StudentActivity {
  student_id: string;
  student_name: string;
  student_email: string;
  games_played: number;
  pathkeys_earned: number;
  last_active: string;
}

export interface QuestionSetRecommendation {
  question_set_id: string;
  title: string;
  career_sector: string | null;
  career_cluster: string | null;
  reason: string;
  benefit_student_count: number;
  benefit_students: string[]; // Student names
}

// ============================================================================
// TEACHER ANALYTICS SERVICE
// ============================================================================

class TeacherAnalyticsService {
  /**
   * Get all students for a teacher (by school or direct assignment)
   */
  async getTeacherStudents(teacherId: string): Promise<string[]> {
    try {
      // Get teacher's school
      const { data: teacher } = await supabase
        .from('profiles')
        .select('school_id')
        .eq('id', teacherId)
        .single();

      const teacherSchoolId = (teacher as any)?.school_id;
      if (!teacherSchoolId) {
        return [];
      }

      // Get all students in same school
      const { data: students } = await supabase
        .from('profiles')
        .select('id')
        .eq('school_id', teacherSchoolId)
        .eq('user_type', 'student');

      return (students || []).map((s: any) => s.id);
    } catch (error) {
      console.error('[TeacherAnalytics] Error getting teacher students:', error);
      return [];
    }
  }

  /**
   * Get detailed pathkey progress for all students in classroom
   */
  async getStudentPathkeyProgress(teacherId: string): Promise<TeacherStudentPathkeyProgress[]> {
    try {
      const studentIds = await this.getTeacherStudents(teacherId);
      if (studentIds.length === 0) return [];

      const progressData: TeacherStudentPathkeyProgress[] = [];

      for (const studentId of studentIds) {
        // Get student profile
        const { data: student } = await supabase
          .from('profiles')
          .select('email, display_name')
          .eq('id', studentId)
          .single();

        if (!student) continue;

        // Get all student pathkey records
        const { data: pathkeys } = await supabase
          .from('student_pathkeys')
          .select(`
            *,
            careers (
              id,
              title,
              sector
            )
          `)
          .eq('student_id', studentId);

        const pathkeysData = (pathkeys || []) as any[];

        // Calculate careers in progress
        const careersInProgress: CareerProgress[] = pathkeysData.map(pk => ({
          career_id: pk.career_id,
          career_title: pk.careers?.title || 'Unknown',
          career_sector: pk.careers?.sector || 'Unknown',
          career_mastery_unlocked: pk.career_mastery_unlocked,
          career_mastery_unlocked_at: pk.career_mastery_unlocked_at,
          industry_mastery_unlocked: pk.industry_mastery_unlocked,
          industry_mastery_progress: 0, // TODO: Calculate from student_pathkey_progress
          business_driver_mastery_unlocked: pk.business_driver_mastery_unlocked,
          business_drivers_completed: [], // TODO: Get from student_business_driver_progress
          business_drivers_in_progress: [],
        }));

        // Get most played content
        const { data: gamePlays } = await supabase
          .from('game_players')
          .select(`
            game_session_id,
            game_sessions!inner (
              question_set_id,
              question_sets (
                career_id,
                career_sector,
                careers (title)
              )
            )
          `)
          .eq('user_id', studentId);

        const plays = (gamePlays || []) as any[];

        // Analyze most played career
        const careerCounts = new Map<string, number>();
        const industryCounts = new Map<string, number>();

        plays.forEach(play => {
          const qs = play.game_sessions?.question_sets;
          if (qs?.career_id && qs.careers?.title) {
            careerCounts.set(qs.careers.title, (careerCounts.get(qs.careers.title) || 0) + 1);
          }
          if (qs?.career_sector) {
            industryCounts.set(qs.career_sector, (industryCounts.get(qs.career_sector) || 0) + 1);
          }
        });

        const mostPlayedCareer = [...careerCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;
        const mostPlayedIndustry = [...industryCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;

        // Get weakest business driver
        const { data: driverProgress } = await supabase
          .from('student_business_driver_progress')
          .select('business_driver, current_chunk_questions, current_chunk_correct, mastery_achieved')
          .eq('student_id', studentId);

        const drivers = (driverProgress || []) as any[];
        const driverAccuracy = drivers
          .filter(d => !d.mastery_achieved && d.current_chunk_questions > 0)
          .map(d => ({
            driver: d.business_driver as BusinessDriver,
            accuracy: (d.current_chunk_correct / d.current_chunk_questions) * 100,
          }))
          .sort((a, b) => a.accuracy - b.accuracy);

        const weakestBusinessDriver = driverAccuracy[0]?.driver || null;

        progressData.push({
          student_id: studentId,
          student_email: (student as any).email || '',
          student_name: (student as any).display_name || '',
          total_pathkeys: pathkeysData.filter(pk =>
            pk.career_mastery_unlocked &&
            pk.industry_mastery_unlocked &&
            pk.business_driver_mastery_unlocked
          ).length,
          careers_in_progress: careersInProgress,
          completed_careers: pathkeysData.filter(pk =>
            pk.career_mastery_unlocked &&
            pk.industry_mastery_unlocked &&
            pk.business_driver_mastery_unlocked
          ).length,
          most_played_career: mostPlayedCareer,
          most_played_industry: mostPlayedIndustry,
          weakest_business_driver: weakestBusinessDriver,
        });
      }

      return progressData;
    } catch (error) {
      console.error('[TeacherAnalytics] Error getting student pathkey progress:', error);
      throw error;
    }
  }

  /**
   * Get classroom-wide analytics
   */
  async getClassroomAnalytics(teacherId: string): Promise<ClassroomAnalytics> {
    try {
      const studentIds = await this.getTeacherStudents(teacherId);
      if (studentIds.length === 0) {
        return this.getEmptyAnalytics();
      }

      // Get all game plays by students
      const { data: gamePlays } = await supabase
        .from('game_players')
        .select(`
          user_id,
          score,
          correct_answers,
          total_answers,
          joined_at,
          pathkeys_earned,
          game_session_id,
          game_sessions!inner (
            question_set_id,
            question_sets (
              career_id,
              career_sector,
              career_cluster,
              careers (title)
            )
          )
        `)
        .in('user_id', studentIds);

      const plays = (gamePlays || []) as any[];

      // Calculate total stats
      const total_students = studentIds.length;
      const total_games_played = plays.length;
      const total_pathkeys_awarded = plays.reduce((sum, p) => sum + (p.pathkeys_earned || 0), 0);

      // Calculate most popular careers
      const careerStats = new Map<string, { plays: number; students: Set<string>; total_correct: number; total_questions: number }>();

      plays.forEach(play => {
        const career = play.game_sessions?.question_sets?.careers?.title;
        if (career) {
          const stats = careerStats.get(career) || { plays: 0, students: new Set(), total_correct: 0, total_questions: 0 };
          stats.plays++;
          stats.students.add(play.user_id);
          stats.total_correct += play.correct_answers || 0;
          stats.total_questions += play.total_answers || 0;
          careerStats.set(career, stats);
        }
      });

      const most_popular_careers: PopularityMetric[] = [...careerStats.entries()]
        .map(([name, stats]) => ({
          name,
          play_count: stats.plays,
          student_count: stats.students.size,
          avg_accuracy: stats.total_questions > 0 ? (stats.total_correct / stats.total_questions) * 100 : 0,
        }))
        .sort((a, b) => b.play_count - a.play_count)
        .slice(0, 10);

      // Calculate most popular industries
      const industryStats = new Map<string, { plays: number; students: Set<string>; total_correct: number; total_questions: number }>();

      plays.forEach(play => {
        const industry = play.game_sessions?.question_sets?.career_sector;
        if (industry) {
          const stats = industryStats.get(industry) || { plays: 0, students: new Set(), total_correct: 0, total_questions: 0 };
          stats.plays++;
          stats.students.add(play.user_id);
          stats.total_correct += play.correct_answers || 0;
          stats.total_questions += play.total_answers || 0;
          industryStats.set(industry, stats);
        }
      });

      const most_popular_industries: PopularityMetric[] = [...industryStats.entries()]
        .map(([name, stats]) => ({
          name,
          play_count: stats.plays,
          student_count: stats.students.size,
          avg_accuracy: stats.total_questions > 0 ? (stats.total_correct / stats.total_questions) * 100 : 0,
        }))
        .sort((a, b) => b.play_count - a.play_count)
        .slice(0, 10);

      // Calculate weakest business drivers across classroom
      const { data: allDriverProgress } = await supabase
        .from('student_business_driver_progress')
        .select('student_id, business_driver, current_chunk_questions, current_chunk_correct, mastery_achieved')
        .in('student_id', studentIds);

      const driverStats = new Map<BusinessDriver, { total_questions: number; total_correct: number; students_struggling: Set<string> }>();

      (allDriverProgress || []).forEach((dp: any) => {
        const driver = dp.business_driver as BusinessDriver;
        const stats = driverStats.get(driver) || { total_questions: 0, total_correct: 0, students_struggling: new Set() };
        stats.total_questions += dp.current_chunk_questions || 0;
        stats.total_correct += dp.current_chunk_correct || 0;

        // Check if student is struggling (< 70% accuracy and not mastered)
        const accuracy = dp.current_chunk_questions > 0 ? (dp.current_chunk_correct / dp.current_chunk_questions) * 100 : 0;
        if (!dp.mastery_achieved && accuracy < 70 && dp.current_chunk_questions >= 3) {
          stats.students_struggling.add(dp.student_id);
        }

        driverStats.set(driver, stats);
      });

      const weakest_business_drivers: BusinessDriverMetric[] = [...driverStats.entries()]
        .map(([driver, stats]) => ({
          driver,
          total_attempts: stats.total_questions,
          avg_accuracy: stats.total_questions > 0 ? (stats.total_correct / stats.total_questions) * 100 : 0,
          students_struggling: stats.students_struggling.size,
        }))
        .sort((a, b) => a.avg_accuracy - b.avg_accuracy)
        .slice(0, 6);

      // Identify students needing help
      const students_needing_help: StudentNeedingHelp[] = [];

      const progressData = await this.getStudentPathkeyProgress(teacherId);

      progressData.forEach(student => {
        // Check for low overall accuracy
        const studentPlays = plays.filter(p => p.user_id === student.student_id);
        const totalCorrect = studentPlays.reduce((sum, p) => sum + (p.correct_answers || 0), 0);
        const totalQuestions = studentPlays.reduce((sum, p) => sum + (p.total_answers || 0), 0);
        const overallAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

        if (studentPlays.length >= 5 && overallAccuracy < 60) {
          students_needing_help.push({
            student_id: student.student_id,
            student_name: student.student_name,
            student_email: student.student_email,
            issue: 'low_accuracy',
            details: `Overall accuracy: ${overallAccuracy.toFixed(1)}% across ${studentPlays.length} games`,
          });
        }

        // Check for stuck progress (played many games but no pathkeys)
        if (studentPlays.length >= 10 && student.total_pathkeys === 0) {
          students_needing_help.push({
            student_id: student.student_id,
            student_name: student.student_name,
            student_email: student.student_email,
            issue: 'stuck_progress',
            details: `Played ${studentPlays.length} games but hasn't earned any pathkeys`,
          });
        }

        // Check for no recent activity (no games in last 14 days)
        const recentPlay = studentPlays
          .map(p => new Date(p.joined_at))
          .sort((a, b) => b.getTime() - a.getTime())[0];

        if (recentPlay) {
          const daysSincePlay = (Date.now() - recentPlay.getTime()) / (1000 * 60 * 60 * 24);
          if (daysSincePlay > 14) {
            students_needing_help.push({
              student_id: student.student_id,
              student_name: student.student_name,
              student_email: student.student_email,
              issue: 'no_activity',
              details: `No activity for ${Math.floor(daysSincePlay)} days`,
            });
          }
        }
      });

      // Get most active students
      const studentActivityMap = new Map<string, { games_played: number; pathkeys_earned: number; last_active: Date }>();

      plays.forEach(play => {
        const activity = studentActivityMap.get(play.user_id) || { games_played: 0, pathkeys_earned: 0, last_active: new Date(0) };
        activity.games_played++;
        activity.pathkeys_earned += play.pathkeys_earned || 0;
        const playDate = new Date(play.joined_at);
        if (playDate > activity.last_active) {
          activity.last_active = playDate;
        }
        studentActivityMap.set(play.user_id, activity);
      });

      const most_active_students: StudentActivity[] = [...studentActivityMap.entries()]
        .map(([student_id, activity]) => {
          const student = progressData.find(s => s.student_id === student_id);
          return {
            student_id,
            student_name: student?.student_name || 'Unknown',
            student_email: student?.student_email || '',
            games_played: activity.games_played,
            pathkeys_earned: activity.pathkeys_earned,
            last_active: activity.last_active.toISOString(),
          };
        })
        .sort((a, b) => b.games_played - a.games_played)
        .slice(0, 10);

      return {
        total_students,
        total_games_played,
        total_pathkeys_awarded,
        most_popular_careers,
        most_popular_industries,
        weakest_business_drivers,
        students_needing_help,
        most_active_students,
      };
    } catch (error) {
      console.error('[TeacherAnalytics] Error getting classroom analytics:', error);
      return this.getEmptyAnalytics();
    }
  }

  /**
   * Get recommended question sets to help students with stuck progress
   */
  async getQuestionSetRecommendations(teacherId: string): Promise<QuestionSetRecommendation[]> {
    try {
      const studentIds = await this.getTeacherStudents(teacherId);
      if (studentIds.length === 0) return [];

      const recommendations: QuestionSetRecommendation[] = [];

      // Get all student pathkey progress
      const { data: allPathkeys } = await supabase
        .from('student_pathkeys')
        .select(`
          student_id,
          career_id,
          industry_mastery_unlocked,
          business_driver_mastery_unlocked,
          careers!inner (
            id,
            title,
            sector,
            career_cluster
          )
        `)
        .in('student_id', studentIds);

      const pathkeys = (allPathkeys || []) as any[];

      // Get profiles for student names
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', studentIds);

      const profileMap = new Map((profiles || []).map((p: any) => [p.id, p.display_name || 'Student']));

      // Find careers where students need industry mastery
      const needIndustryMastery = pathkeys.filter(pk => !pk.industry_mastery_unlocked);
      const careerGroupsNeedingIndustry = new Map<string, Set<string>>();

      needIndustryMastery.forEach(pk => {
        const sector = pk.careers.sector;
        if (!careerGroupsNeedingIndustry.has(sector)) {
          careerGroupsNeedingIndustry.set(sector, new Set());
        }
        careerGroupsNeedingIndustry.get(sector)!.add(pk.student_id);
      });

      // Recommend industry overview sets
      for (const [sector, studentSet] of careerGroupsNeedingIndustry.entries()) {
        const { data: industrySets } = await supabase
          .from('question_sets')
          .select('id, title, career_sector, career_cluster')
          .eq('career_sector', sector)
          .is('career_id', null)
          .eq('is_public', true)
          .limit(3);

        (industrySets || []).forEach((set: any) => {
          recommendations.push({
            question_set_id: set.id,
            title: set.title,
            career_sector: set.career_sector,
            career_cluster: set.career_cluster,
            reason: `Helps ${studentSet.size} student${studentSet.size > 1 ? 's' : ''} unlock Industry Mastery for ${sector} careers`,
            benefit_student_count: studentSet.size,
            benefit_students: Array.from(studentSet).map(id => profileMap.get(id) || 'Student'),
          });
        });
      }

      // Get weakest business drivers across classroom
      const { data: driverProgress } = await supabase
        .from('student_business_driver_progress')
        .select('student_id, business_driver, current_chunk_questions, current_chunk_correct, mastery_achieved')
        .in('student_id', studentIds);

      const driverNeedsHelp = new Map<BusinessDriver, Set<string>>();

      (driverProgress || []).forEach((dp: any) => {
        const accuracy = dp.current_chunk_questions > 0 ? (dp.current_chunk_correct / dp.current_chunk_questions) * 100 : 0;
        if (!dp.mastery_achieved && accuracy < 70 && dp.current_chunk_questions >= 3) {
          if (!driverNeedsHelp.has(dp.business_driver)) {
            driverNeedsHelp.set(dp.business_driver, new Set());
          }
          driverNeedsHelp.get(dp.business_driver)!.add(dp.student_id);
        }
      });

      // Recommend sets targeting weak business drivers
      // (This is complex - we'd need to analyze which sets have more questions for specific drivers)
      // For now, just mention the insight

      // Sort by benefit count
      recommendations.sort((a, b) => b.benefit_student_count - a.benefit_student_count);

      return recommendations.slice(0, 5);
    } catch (error) {
      console.error('[TeacherAnalytics] Error getting question set recommendations:', error);
      return [];
    }
  }

  private getEmptyAnalytics(): ClassroomAnalytics {
    return {
      total_students: 0,
      total_games_played: 0,
      total_pathkeys_awarded: 0,
      most_popular_careers: [],
      most_popular_industries: [],
      weakest_business_drivers: [],
      students_needing_help: [],
      most_active_students: [],
    };
  }
}

export const teacherAnalyticsService = new TeacherAnalyticsService();
