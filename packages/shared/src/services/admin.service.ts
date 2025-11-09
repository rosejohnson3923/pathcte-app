/**
 * Admin Service
 * ==============
 * Service for system-wide analytics and monitoring
 * Only accessible to users with user_type = 'admin'
 */

import { supabase } from '../config/supabase';
import type { Profile, GameSession } from '../types/database.types';

export interface SystemOverview {
  // User statistics
  total_users: number;
  total_students: number;
  total_teachers: number;
  total_parents: number;
  total_admins: number;
  active_users_7d: number;
  active_users_30d: number;
  new_users_7d: number;
  new_users_30d: number;

  // Game statistics
  total_games: number;
  games_today: number;
  games_this_week: number;
  games_this_month: number;
  games_in_progress: number;
  total_questions_answered: number;

  // Content statistics
  total_question_sets: number;
  total_questions: number;
  total_pathkeys_awarded: number;
  total_tokens_awarded: number;
}

export interface UserActivity {
  user_id: string;
  email: string;
  display_name: string | null;
  user_type: string;
  created_at: string;
  last_active: string | null;
  total_games: number;
  total_score: number;
}

export interface GameActivity {
  session_id: string;
  game_code: string;
  host_email: string;
  host_name: string | null;
  game_mode: string;
  status: string;
  created_at: string;
  ended_at: string | null;
  total_players: number;
  question_set_title: string | null;
}

export interface ContentStats {
  question_set_id: string;
  title: string;
  created_by_email: string | null;
  created_at: string;
  total_questions: number;
  times_played: number;
  average_score: number | null;
}

export interface TopUser {
  user_id: string;
  email: string;
  display_name: string | null;
  user_type: string;
  metric_value: number;
  metric_label: string;
}

class AdminService {
  /**
   * Get system-wide overview statistics
   */
  async getSystemOverview(): Promise<SystemOverview> {
    try {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Get user statistics
      const { data: allUsers, error: usersError } = await supabase
        .from('profiles')
        .select('id, user_type, created_at, updated_at');

      if (usersError) throw usersError;

      const users = (allUsers || []) as Profile[];

      const total_users = users.length;
      const total_students = users.filter(u => u.user_type === 'student').length;
      const total_teachers = users.filter(u => u.user_type === 'teacher').length;
      const total_parents = users.filter(u => u.user_type === 'parent').length;
      const total_admins = users.filter(u => u.user_type === 'admin').length;

      const new_users_7d = users.filter(u => new Date(u.created_at) > sevenDaysAgo).length;
      const new_users_30d = users.filter(u => new Date(u.created_at) > thirtyDaysAgo).length;

      // Active users based on game participation
      const { data: recentPlayers7d } = await supabase
        .from('game_players')
        .select('user_id, joined_at')
        .gte('joined_at', sevenDaysAgo.toISOString());

      const { data: recentPlayers30d } = await supabase
        .from('game_players')
        .select('user_id, joined_at')
        .gte('joined_at', thirtyDaysAgo.toISOString());

      const active_users_7d = new Set((recentPlayers7d || []).map((p: any) => p.user_id)).size;
      const active_users_30d = new Set((recentPlayers30d || []).map((p: any) => p.user_id)).size;

      // Get game statistics
      const { data: allGames, error: gamesError } = await supabase
        .from('game_sessions')
        .select('id, status, created_at, ended_at');

      if (gamesError) throw gamesError;

      const games = (allGames || []) as GameSession[];

      const total_games = games.length;
      const games_today = games.filter(g => new Date(g.created_at) >= today).length;
      const games_this_week = games.filter(g => new Date(g.created_at) > sevenDaysAgo).length;
      const games_this_month = games.filter(g => new Date(g.created_at) > thirtyDaysAgo).length;
      const games_in_progress = games.filter(g => g.status === 'in_progress').length;

      // Get total questions answered
      const { count: answersCount, error: answersError } = await supabase
        .from('game_answers')
        .select('*', { count: 'exact', head: true });

      if (answersError) throw answersError;

      // Get content statistics
      const { count: questionSetsCount } = await supabase
        .from('question_sets')
        .select('*', { count: 'exact', head: true });

      const { count: questionsCount } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });

      // Get pathkeys and tokens awarded
      const { data: playerData } = await supabase
        .from('game_players')
        .select('pathkeys_earned, tokens_earned');

      const total_pathkeys_awarded = (playerData || []).reduce((sum: number, p: any) =>
        sum + (p.pathkeys_earned || 0), 0);
      const total_tokens_awarded = (playerData || []).reduce((sum: number, p: any) =>
        sum + (p.tokens_earned || 0), 0);

      return {
        total_users,
        total_students,
        total_teachers,
        total_parents,
        total_admins,
        active_users_7d,
        active_users_30d,
        new_users_7d,
        new_users_30d,
        total_games,
        games_today,
        games_this_week,
        games_this_month,
        games_in_progress,
        total_questions_answered: answersCount || 0,
        total_question_sets: questionSetsCount || 0,
        total_questions: questionsCount || 0,
        total_pathkeys_awarded,
        total_tokens_awarded,
      };
    } catch (error) {
      console.error('[AdminService] Error getting system overview:', error);
      throw error;
    }
  }

  /**
   * Get recent user activity
   */
  async getRecentUserActivity(limit: number = 50): Promise<UserActivity[]> {
    try {
      // Get recent users with their game participation
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          display_name,
          user_type,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const users = data as Profile[];

      // Get game stats for each user
      const userActivities = await Promise.all(
        users.map(async (user) => {
          const { data: playerData } = await supabase
            .from('game_players')
            .select('score, joined_at')
            .eq('user_id', user.id)
            .order('joined_at', { ascending: false })
            .limit(1);

          const totalScore = await supabase
            .from('game_players')
            .select('score')
            .eq('user_id', user.id);

          const total_score = (totalScore.data || []).reduce((sum: number, p: any) =>
            sum + (p.score || 0), 0);

          const { count: gamesCount } = await supabase
            .from('game_players')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

          const lastActivity = (playerData as any)?.[0]?.joined_at || null;

          return {
            user_id: user.id,
            email: user.email || '',
            display_name: user.display_name,
            user_type: user.user_type,
            created_at: user.created_at,
            last_active: lastActivity,
            total_games: gamesCount || 0,
            total_score,
          };
        })
      );

      return userActivities;
    } catch (error) {
      console.error('[AdminService] Error getting recent user activity:', error);
      throw error;
    }
  }

  /**
   * Get recent game activity
   */
  async getRecentGames(limit: number = 50): Promise<GameActivity[]> {
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .select(`
          id,
          game_code,
          game_mode,
          status,
          created_at,
          ended_at,
          host_id,
          question_set_id,
          question_sets (title),
          profiles!game_sessions_host_id_fkey (email, display_name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Get player counts for each game
      const gameActivities = await Promise.all(
        (data || []).map(async (game: any) => {
          const { count } = await supabase
            .from('game_players')
            .select('*', { count: 'exact', head: true })
            .eq('game_session_id', game.id);

          return {
            session_id: game.id,
            game_code: game.game_code,
            host_email: game.profiles?.email || 'Unknown',
            host_name: game.profiles?.display_name,
            game_mode: game.game_mode,
            status: game.status,
            created_at: game.created_at,
            ended_at: game.ended_at,
            total_players: count || 0,
            question_set_title: game.question_sets?.title || null,
          };
        })
      );

      return gameActivities;
    } catch (error) {
      console.error('[AdminService] Error getting recent games:', error);
      throw error;
    }
  }

  /**
   * Get popular content statistics
   */
  async getPopularContent(limit: number = 20): Promise<ContentStats[]> {
    try {
      const { data, error } = await supabase
        .from('question_sets')
        .select('id, title, created_at, creator_id')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Get usage stats for each question set
      const contentStats = await Promise.all(
        (data || []).map(async (qs: any) => {
          // Get creator email
          let created_by_email = null;
          if (qs.creator_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('email')
              .eq('id', qs.creator_id)
              .single();
            const profileData = profile as any;
            created_by_email = profileData?.email || null;
          }

          // Count questions in set
          const { count: questionCount } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true })
            .eq('question_set_id', qs.id);

          // Count times played
          const { count: timesPlayed } = await supabase
            .from('game_sessions')
            .select('*', { count: 'exact', head: true })
            .eq('question_set_id', qs.id);

          // Get average score
          const { data: games } = await supabase
            .from('game_sessions')
            .select('id')
            .eq('question_set_id', qs.id);

          let average_score = null;
          if (games && games.length > 0) {
            const gameIds = games.map((g: any) => g.id);
            const { data: players } = await supabase
              .from('game_players')
              .select('score')
              .in('game_session_id', gameIds);

            if (players && players.length > 0) {
              const totalScore = players.reduce((sum: number, p: any) => sum + (p.score || 0), 0);
              average_score = Math.round(totalScore / players.length);
            }
          }

          return {
            question_set_id: qs.id,
            title: qs.title,
            created_by_email,
            created_at: qs.created_at,
            total_questions: questionCount || 0,
            times_played: timesPlayed || 0,
            average_score,
          };
        })
      );

      // Sort by times played
      contentStats.sort((a, b) => b.times_played - a.times_played);

      return contentStats;
    } catch (error) {
      console.error('[AdminService] Error getting popular content:', error);
      throw error;
    }
  }

  /**
   * Get top users by various metrics
   */
  async getTopUsers(metric: 'games' | 'score' | 'pathkeys', limit: number = 10): Promise<TopUser[]> {
    try {
      const { data: allPlayers, error } = await supabase
        .from('game_players')
        .select(`
          user_id,
          score,
          pathkeys_earned,
          profiles (email, display_name, user_type)
        `);

      if (error) throw error;

      // Aggregate by user
      const userMetrics = new Map<string, any>();

      (allPlayers || []).forEach((player: any) => {
        const userId = player.user_id;
        if (!userMetrics.has(userId)) {
          userMetrics.set(userId, {
            user_id: userId,
            email: player.profiles?.email || '',
            display_name: player.profiles?.display_name,
            user_type: player.profiles?.user_type || 'unknown',
            total_games: 0,
            total_score: 0,
            total_pathkeys: 0,
          });
        }

        const user = userMetrics.get(userId);
        user.total_games += 1;
        user.total_score += player.score || 0;
        user.total_pathkeys += player.pathkeys_earned || 0;
      });

      // Convert to array and sort by metric
      const users = Array.from(userMetrics.values());

      let sortedUsers: any[];
      let metric_label: string;

      switch (metric) {
        case 'games':
          sortedUsers = users.sort((a, b) => b.total_games - a.total_games);
          metric_label = 'Games Played';
          break;
        case 'score':
          sortedUsers = users.sort((a, b) => b.total_score - a.total_score);
          metric_label = 'Total Score';
          break;
        case 'pathkeys':
          sortedUsers = users.sort((a, b) => b.total_pathkeys - a.total_pathkeys);
          metric_label = 'Pathkeys Earned';
          break;
        default:
          sortedUsers = users;
          metric_label = 'Unknown';
      }

      return sortedUsers.slice(0, limit).map(user => ({
        user_id: user.user_id,
        email: user.email,
        display_name: user.display_name,
        user_type: user.user_type,
        metric_value: user[`total_${metric}`] || 0,
        metric_label,
      }));
    } catch (error) {
      console.error('[AdminService] Error getting top users:', error);
      throw error;
    }
  }

  /**
   * Search users by email or name
   */
  async searchUsers(query: string, limit: number = 50): Promise<UserActivity[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, display_name, user_type, created_at, updated_at')
        .or(`email.ilike.%${query}%,display_name.ilike.%${query}%`)
        .limit(limit);

      if (error) throw error;

      // Get game stats for matched users
      const users = data as Profile[];
      const userActivities = await Promise.all(
        users.map(async (user) => {
          const { data: playerData } = await supabase
            .from('game_players')
            .select('score, joined_at')
            .eq('user_id', user.id)
            .order('joined_at', { ascending: false })
            .limit(1);

          const totalScore = await supabase
            .from('game_players')
            .select('score')
            .eq('user_id', user.id);

          const total_score = (totalScore.data || []).reduce((sum: number, p: any) =>
            sum + (p.score || 0), 0);

          const { count: gamesCount } = await supabase
            .from('game_players')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

          const lastActivity = (playerData as any)?.[0]?.joined_at || null;

          return {
            user_id: user.id,
            email: user.email || '',
            display_name: user.display_name,
            user_type: user.user_type,
            created_at: user.created_at,
            last_active: lastActivity,
            total_games: gamesCount || 0,
            total_score,
          };
        })
      );

      return userActivities;
    } catch (error) {
      console.error('[AdminService] Error searching users:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
