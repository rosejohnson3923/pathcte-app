/**
 * useAnalytics Hook
 * ==================
 * Analytics hooks for teacher dashboards
 */

import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@pathket/shared';
import type { StudentStats, GameStats, QuestionSetStats, TeacherOverview } from '@pathket/shared';
import { useAuth } from './useAuth';

/**
 * Get teacher overview statistics
 */
export const useTeacherOverview = () => {
  const { user } = useAuth();

  return useQuery<TeacherOverview>({
    queryKey: ['teacher-overview', user?.id],
    queryFn: () => analyticsService.getTeacherOverview(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Get all student statistics
 */
export const useStudentStats = () => {
  const { user } = useAuth();

  return useQuery<StudentStats[]>({
    queryKey: ['student-stats', user?.id],
    queryFn: () => analyticsService.getStudentStats(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Get statistics for a specific student
 */
export const useStudentDetail = (studentId: string | undefined) => {
  const { user } = useAuth();

  return useQuery<StudentStats | null>({
    queryKey: ['student-detail', user?.id, studentId],
    queryFn: () => analyticsService.getStudentDetail(studentId!, user!.id),
    enabled: !!user && !!studentId,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Get recent games
 */
export const useRecentGames = (limit: number = 10) => {
  const { user } = useAuth();

  return useQuery<GameStats[]>({
    queryKey: ['recent-games', user?.id, limit],
    queryFn: () => analyticsService.getRecentGames(user!.id, limit),
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Get question set statistics
 */
export const useQuestionSetStats = () => {
  const { user } = useAuth();

  return useQuery<QuestionSetStats[]>({
    queryKey: ['question-set-stats', user?.id],
    queryFn: () => analyticsService.getQuestionSetStats(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Get top performing students
 */
export const useTopStudents = (limit: number = 5) => {
  const { user } = useAuth();

  return useQuery<StudentStats[]>({
    queryKey: ['top-students', user?.id, limit],
    queryFn: () => analyticsService.getTopStudents(user!.id, limit),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Get analytics for a specific game session
 */
export const useGameAnalytics = (sessionId: string | undefined) => {
  return useQuery({
    queryKey: ['game-analytics', sessionId],
    queryFn: () => analyticsService.getGameAnalytics(sessionId!),
    enabled: !!sessionId,
    staleTime: 1000 * 60 * 10, // 10 minutes (historical data)
  });
};
