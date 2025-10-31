/**
 * Analytics Service
 * =================
 * Service for querying analytics data and generating reports
 */

import { supabase } from '../config/supabase';

export interface StudentStats {
  user_id: string;
  display_name: string;
  email?: string;
  total_games: number;
  total_score: number;
  average_score: number;
  total_correct: number;
  total_questions: number;
  accuracy: number;
  pathkeys_earned: number;
  tokens_earned: number;
  last_active: string | null;
}

export interface GameStats {
  session_id: string;
  game_code: string;
  question_set_title: string;
  game_mode: string;
  created_at: string;
  ended_at: string | null;
  total_players: number;
  average_score: number;
  completion_rate: number;
}

export interface QuestionSetStats {
  question_set_id: string;
  title: string;
  times_played: number;
  average_score: number;
  total_questions: number;
  difficulty_level: string;
}

export interface TeacherOverview {
  total_students: number;
  total_games: number;
  total_questions_answered: number;
  average_class_score: number;
  active_students_30d: number;
  pathkeys_awarded: number;
}

class AnalyticsService {
  /**
   * Get overview statistics for a teacher
   */
  async getTeacherOverview(teacherId: string): Promise<TeacherOverview> {
    try {
      // Get total games hosted
      const { data: games, error: gamesError } = await supabase
        .from('game_sessions')
        .select('id, created_at')
        .eq('host_id', teacherId);

      if (gamesError) throw gamesError;

      const gameIds = (games as any)?.map((g: any) => g.id) || [];

      if (gameIds.length === 0) {
        return {
          total_students: 0,
          total_games: 0,
          total_questions_answered: 0,
          average_class_score: 0,
          active_students_30d: 0,
          pathkeys_awarded: 0,
        };
      }

      // Get all players who participated in teacher's games (excluding teacher themselves)
      const { data: players, error: playersError } = await supabase
        .from('game_players')
        .select('user_id, score, correct_answers, total_answers, joined_at')
        .in('game_session_id', gameIds)
        .neq('user_id', teacherId);  // Exclude teacher from student stats

      if (playersError) throw playersError;

      const playersData = players as any[];

      // Calculate unique students
      const uniqueStudents = new Set(playersData?.map((p: any) => p.user_id) || []);

      // Calculate active students (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const activeStudents = new Set(
        playersData?.filter((p: any) => new Date(p.joined_at) > thirtyDaysAgo).map((p: any) => p.user_id) || []
      );

      // Calculate total questions answered
      const totalQuestionsAnswered = playersData?.reduce((sum: number, p: any) => sum + (p.total_answers || 0), 0) || 0;

      // Calculate average score
      const validScores = playersData?.filter((p: any) => p.score !== null && p.score !== undefined) || [];
      const averageScore = validScores.length > 0
        ? validScores.reduce((sum: number, p: any) => sum + p.score, 0) / validScores.length
        : 0;

      // Get pathkeys awarded (count user_pathkeys for students who played teacher's games)
      const { count: pathkeysCount } = await supabase
        .from('user_pathkeys')
        .select('*', { count: 'exact', head: true })
        .in('user_id', Array.from(uniqueStudents));

      return {
        total_students: uniqueStudents.size,
        total_games: games?.length || 0,
        total_questions_answered: totalQuestionsAnswered,
        average_class_score: Math.round(averageScore * 10) / 10,
        active_students_30d: activeStudents.size,
        pathkeys_awarded: pathkeysCount || 0,
      };
    } catch (error) {
      console.error('Error fetching teacher overview:', error);
      throw error;
    }
  }

  /**
   * Get statistics for all students who have participated in teacher's games
   */
  async getStudentStats(teacherId: string): Promise<StudentStats[]> {
    try {
      // Get all games hosted by this teacher
      const { data: games, error: gamesError } = await supabase
        .from('game_sessions')
        .select('id')
        .eq('host_id', teacherId);

      if (gamesError) throw gamesError;

      const gameIds = (games as any)?.map((g: any) => g.id) || [];

      if (gameIds.length === 0) {
        return [];
      }

      // Get all players who participated (excluding the teacher themselves)
      const { data: players, error: playersError } = await supabase
        .from('game_players')
        .select('user_id, display_name, score, correct_answers, total_answers, joined_at')
        .in('game_session_id', gameIds)
        .neq('user_id', teacherId);  // Exclude teacher from student stats

      if (playersError) throw playersError;

      const playersData = players as any[];

      // Group by user_id
      const userStatsMap = new Map<string, {
        display_name: string;
        games: number;
        totalScore: number;
        totalCorrect: number;
        totalQuestions: number;
        lastActive: string;
      }>();

      playersData?.forEach((player: any) => {
        const existing = userStatsMap.get(player.user_id);
        if (existing) {
          existing.games += 1;
          existing.totalScore += player.score || 0;
          existing.totalCorrect += player.correct_answers || 0;
          existing.totalQuestions += player.total_answers || 0;
          if (new Date(player.joined_at) > new Date(existing.lastActive)) {
            existing.lastActive = player.joined_at;
          }
        } else {
          userStatsMap.set(player.user_id, {
            display_name: player.display_name || 'Unknown',
            games: 1,
            totalScore: player.score || 0,
            totalCorrect: player.correct_answers || 0,
            totalQuestions: player.total_answers || 0,
            lastActive: player.joined_at,
          });
        }
      });

      // Get pathkeys and tokens for each user
      const userIds = Array.from(userStatsMap.keys());

      const { data: pathkeys } = await supabase
        .from('user_pathkeys')
        .select('user_id')
        .in('user_id', userIds);

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, tokens, email')
        .in('id', userIds);

      const pathkeysData = pathkeys as any[];
      const profilesData = profiles as any[];

      const pathkeysMap = new Map<string, number>();
      pathkeysData?.forEach((p: any) => {
        pathkeysMap.set(p.user_id, (pathkeysMap.get(p.user_id) || 0) + 1);
      });

      const tokensMap = new Map<string, number>();
      const emailMap = new Map<string, string>();
      profilesData?.forEach((p: any) => {
        tokensMap.set(p.id, p.tokens || 0);
        emailMap.set(p.id, p.email);
      });

      // Build final stats array
      const stats: StudentStats[] = [];
      userStatsMap.forEach((data, userId) => {
        const averageScore = data.games > 0 ? data.totalScore / data.games : 0;
        const accuracy = data.totalQuestions > 0 ? (data.totalCorrect / data.totalQuestions) * 100 : 0;

        stats.push({
          user_id: userId,
          display_name: data.display_name,
          email: emailMap.get(userId),
          total_games: data.games,
          total_score: data.totalScore,
          average_score: Math.round(averageScore * 10) / 10,
          total_correct: data.totalCorrect,
          total_questions: data.totalQuestions,
          accuracy: Math.round(accuracy * 10) / 10,
          pathkeys_earned: pathkeysMap.get(userId) || 0,
          tokens_earned: tokensMap.get(userId) || 0,
          last_active: data.lastActive,
        });
      });

      // Sort by total score descending
      return stats.sort((a, b) => b.total_score - a.total_score);
    } catch (error) {
      console.error('Error fetching student stats:', error);
      throw error;
    }
  }

  /**
   * Get statistics for a specific student
   */
  async getStudentDetail(studentId: string, teacherId: string): Promise<StudentStats | null> {
    const allStats = await this.getStudentStats(teacherId);
    return allStats.find((s) => s.user_id === studentId) || null;
  }

  /**
   * Get recent games hosted by a teacher
   */
  async getRecentGames(teacherId: string, limit: number = 10): Promise<GameStats[]> {
    try {
      const { data: sessions, error } = await supabase
        .from('game_sessions')
        .select(`
          id,
          game_code,
          game_mode,
          status,
          created_at,
          ended_at,
          question_sets (
            title
          )
        `)
        .eq('host_id', teacherId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const sessionsData = sessions as any[];

      if (!sessionsData || sessionsData.length === 0) {
        return [];
      }

      // Get player stats for each session
      const sessionIds = sessionsData.map((s: any) => s.id);
      const { data: players, error: playersError } = await supabase
        .from('game_players')
        .select('game_session_id, score, placement')
        .in('game_session_id', sessionIds);

      if (playersError) throw playersError;

      const playersData = players as any[];

      // Group players by session
      const playersMap = new Map<string, any[]>();
      playersData?.forEach((player: any) => {
        if (!playersMap.has(player.game_session_id)) {
          playersMap.set(player.game_session_id, []);
        }
        playersMap.get(player.game_session_id)?.push(player);
      });

      // Build game stats
      return sessionsData.map((session: any) => {
        const sessionPlayers = playersMap.get(session.id) || [];
        const totalPlayers = sessionPlayers.length;
        const completedPlayers = sessionPlayers.filter((p: any) => p.placement !== null);
        const validScores = sessionPlayers.filter((p: any) => p.score !== null && p.score !== undefined);
        const averageScore = validScores.length > 0
          ? validScores.reduce((sum: number, p: any) => sum + p.score, 0) / validScores.length
          : 0;
        const completionRate = totalPlayers > 0 ? (completedPlayers.length / totalPlayers) * 100 : 0;

        return {
          session_id: session.id,
          game_code: session.game_code,
          question_set_title: session.question_sets?.title || 'Unknown',
          game_mode: session.game_mode,
          created_at: session.created_at,
          ended_at: session.ended_at,
          total_players: totalPlayers,
          average_score: Math.round(averageScore * 10) / 10,
          completion_rate: Math.round(completionRate * 10) / 10,
        };
      });
    } catch (error) {
      console.error('Error fetching recent games:', error);
      throw error;
    }
  }

  /**
   * Get question set statistics for a teacher
   */
  async getQuestionSetStats(teacherId: string): Promise<QuestionSetStats[]> {
    try {
      // Get all question sets created by teacher
      const { data: questionSets, error: setsError } = await supabase
        .from('question_sets')
        .select('id, title, total_questions, difficulty_level, times_played, average_score')
        .eq('creator_id', teacherId);

      if (setsError) throw setsError;

      const questionSetsData = questionSets as any[];

      return (questionSetsData || []).map((set: any) => ({
        question_set_id: set.id,
        title: set.title,
        times_played: set.times_played || 0,
        average_score: set.average_score || 0,
        total_questions: set.total_questions || 0,
        difficulty_level: set.difficulty_level || 'medium',
      }));
    } catch (error) {
      console.error('Error fetching question set stats:', error);
      throw error;
    }
  }

  /**
   * Get top performing students
   */
  async getTopStudents(teacherId: string, limit: number = 5): Promise<StudentStats[]> {
    const allStats = await this.getStudentStats(teacherId);
    return allStats.slice(0, limit);
  }

  /**
   * Get analytics for a specific game session
   */
  async getGameAnalytics(sessionId: string) {
    try {
      const { data: session, error: sessionError } = await supabase
        .from('game_sessions')
        .select(`
          *,
          question_sets (
            title,
            total_questions
          )
        `)
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      const { data: players, error: playersError } = await supabase
        .from('game_players')
        .select('*')
        .eq('game_session_id', sessionId)
        .order('placement', { ascending: true, nullsFirst: false });

      if (playersError) throw playersError;

      const playersData = players as any[];

      return {
        session,
        players: playersData || [],
        totalPlayers: playersData?.length || 0,
        completedPlayers: playersData?.filter((p: any) => p.placement !== null).length || 0,
        averageScore: playersData && playersData.length > 0
          ? playersData.reduce((sum: number, p: any) => sum + (p.score || 0), 0) / playersData.length
          : 0,
      };
    } catch (error) {
      console.error('Error fetching game analytics:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();

// Export class for testing
export { AnalyticsService };
