/**
 * AnalyticsPage
 * =============
 * Teacher analytics dashboard showing student performance and game statistics
 */

import { DashboardLayout } from '../components/layout';
import { Card, Badge, Spinner } from '../components/common';
import { BarChart3, TrendingUp, Users, Gamepad2, Trophy, Target } from 'lucide-react';
import { useTeacherOverview, useRecentGames, useTopStudents } from '../hooks';

export default function AnalyticsPage() {
  const { data: overview, isLoading: overviewLoading } = useTeacherOverview();
  const { data: recentGames, isLoading: gamesLoading } = useRecentGames(5);
  const { data: topStudents, isLoading: studentsLoading } = useTopStudents(3);

  const isLoading = overviewLoading || gamesLoading || studentsLoading;

  return (
    <DashboardLayout>
      <div>
        {/* Page Header */}
        <div className="relative mb-8 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 p-8 overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <BarChart3 className="absolute top-5 right-10 w-20 h-20 text-white" />
            <BarChart3 className="absolute bottom-5 left-10 w-16 h-16 text-white" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <BarChart3 className="text-white" size={32} />
              </div>
              <h1 className="text-4xl font-display font-bold text-white">
                Analytics Dashboard
              </h1>
            </div>
            <p className="text-purple-100 text-lg ml-20">
              Track student progress and game performance
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Total Students */}
              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {overview?.total_students || 0}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      {overview?.active_students_30d || 0} active (30d)
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Users className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                </div>
              </Card>

              {/* Total Games */}
              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Games</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {overview?.total_games || 0}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {overview?.total_questions_answered || 0} questions answered
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Gamepad2 className="text-purple-600 dark:text-purple-400" size={24} />
                  </div>
                </div>
              </Card>

              {/* Average Score */}
              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Class Average</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {overview?.average_class_score?.toFixed(1) || '0.0'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      cumulative average across all games
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                </div>
              </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Pathkeys Awarded */}
              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pathkeys Awarded</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {overview?.pathkeys_awarded || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Trophy className="text-amber-600 dark:text-amber-400" size={24} />
                  </div>
                </div>
              </Card>

              {/* Participation Rate */}
              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Participation Rate</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {overview?.total_students && overview.active_students_30d
                        ? Math.round((overview.active_students_30d / overview.total_students) * 100)
                        : 0}%
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Last 30 days
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <Target className="text-indigo-600 dark:text-indigo-400" size={24} />
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Top Performers */}
              <Card>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Top Performers</h3>
                {topStudents && topStudents.length > 0 ? (
                  <div className="space-y-3">
                    {topStudents.map((student, index) => (
                      <div
                        key={student.user_id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            index === 0
                              ? 'bg-amber-500 text-white'
                              : index === 1
                              ? 'bg-gray-400 text-white'
                              : 'bg-orange-600 text-white'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                              {student.display_name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {student.total_games} games • {student.accuracy.toFixed(1)}% accuracy
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 dark:text-gray-100">
                            {student.average_score.toFixed(1)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">avg score</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No student data yet
                  </p>
                )}
              </Card>

              {/* Recent Games */}
              <Card>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Recent Games</h3>
                {recentGames && recentGames.length > 0 ? (
                  <div className="space-y-3">
                    {recentGames.map((game) => (
                      <div
                        key={game.session_id}
                        className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {game.question_set_title}
                          </p>
                          <Badge variant="default">{game.game_mode}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{game.total_players} players</span>
                          <span>•</span>
                          <span>Avg: {game.average_score.toFixed(1)}</span>
                          <span>•</span>
                          <span>{game.completion_rate.toFixed(0)}% completed</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {new Date(game.created_at).toLocaleDateString()} at{' '}
                          {new Date(game.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No games played yet
                  </p>
                )}
              </Card>
            </div>
          </>
        )}

        {/* Info Card */}
        {!isLoading && overview && overview.total_games === 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Get Started with Analytics
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              Host your first game to start tracking student progress and performance. Analytics will
              automatically populate as students play games.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
