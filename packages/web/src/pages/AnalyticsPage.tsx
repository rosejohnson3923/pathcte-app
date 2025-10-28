/**
 * AnalyticsPage
 * =============
 * Teacher analytics dashboard showing student performance and game statistics
 */

import { DashboardLayout } from '../components/layout';
import { Card, Badge } from '../components/common';
import { BarChart3, TrendingUp, Users, Gamepad2, Trophy, Target } from 'lucide-react';

export default function AnalyticsPage() {
  // Mock data - will be replaced with real data from hooks
  const stats = {
    totalStudents: 28,
    totalGames: 15,
    avgParticipation: 85,
    avgScore: 78,
    pathkeysEarned: 156,
    topPerformers: [
      { name: 'Jordan Lee', score: 1580, games: 15 },
      { name: 'Alex Johnson', score: 1250, games: 12 },
      { name: 'Sam Williams', score: 890, games: 8 },
    ],
  };

  const recentGames = [
    {
      id: '1',
      title: 'Career Exploration Basics',
      date: '2025-01-28',
      participants: 24,
      avgScore: 82,
    },
    {
      id: '2',
      title: 'STEM Careers Quiz',
      date: '2025-01-26',
      participants: 22,
      avgScore: 75,
    },
    {
      id: '3',
      title: 'Healthcare Careers',
      date: '2025-01-25',
      participants: 26,
      avgScore: 88,
    },
  ];

  return (
    <DashboardLayout>
      <div>
        {/* Page Header */}
        <div className="relative mb-8 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <BarChart3 className="absolute top-5 right-10 w-20 h-20 text-white" />
            <BarChart3 className="absolute bottom-5 left-10 w-16 h-16 text-white" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <BarChart3 className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-display font-bold text-white">
                  Analytics Dashboard
                </h1>
                <p className="text-purple-100 text-lg">
                  Track classroom performance and engagement
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Students */}
          <Card className="p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <Users className="text-white" size={28} />
                </div>
              </div>
              <p className="text-3xl font-bold text-text-primary mb-1">{stats.totalStudents}</p>
              <p className="text-sm font-medium text-text-secondary">Total Students</p>
            </div>
          </Card>

          {/* Total Games */}
          <Card className="p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <Gamepad2 className="text-white" size={28} />
                </div>
              </div>
              <p className="text-3xl font-bold text-text-primary mb-1">{stats.totalGames}</p>
              <p className="text-sm font-medium text-text-secondary">Games Hosted</p>
            </div>
          </Card>

          {/* Avg Participation */}
          <Card className="p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <TrendingUp className="text-white" size={28} />
                </div>
              </div>
              <p className="text-3xl font-bold text-text-primary mb-1">{stats.avgParticipation}%</p>
              <p className="text-sm font-medium text-text-secondary">Avg Participation</p>
            </div>
          </Card>

          {/* Avg Score */}
          <Card className="p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <Target className="text-white" size={28} />
                </div>
              </div>
              <p className="text-3xl font-bold text-text-primary mb-1">{stats.avgScore}%</p>
              <p className="text-sm font-medium text-text-secondary">Class Average</p>
            </div>
          </Card>

          {/* Pathkeys Earned */}
          <Card className="p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <Trophy className="text-white" size={28} />
                </div>
              </div>
              <p className="text-3xl font-bold text-text-primary mb-1">{stats.pathkeysEarned}</p>
              <p className="text-sm font-medium text-text-secondary">Pathkeys Earned</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers */}
          <Card>
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 rounded-t-xl">
              <Card.Title className="text-white mb-1">Top Performers</Card.Title>
              <Card.Description className="text-amber-50">
                Your highest scoring students
              </Card.Description>
            </div>
            <Card.Content className="p-6">
              <div className="space-y-4">
                {stats.topPerformers.map((student, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-100 dark:border-amber-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {student.games} games played
                        </p>
                      </div>
                    </div>
                    <Badge variant="warning" className="text-lg font-bold">
                      {student.score}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Recent Games */}
          <Card>
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-t-xl">
              <Card.Title className="text-white mb-1">Recent Games</Card.Title>
              <Card.Description className="text-purple-50">
                Your latest game sessions
              </Card.Description>
            </div>
            <Card.Content className="p-6">
              <div className="space-y-4">
                {recentGames.map((game) => (
                  <div
                    key={game.id}
                    className="p-4 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-100 dark:border-purple-800"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {game.title}
                      </h4>
                      <Badge variant="info">{game.avgScore}%</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{new Date(game.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{game.participants} students</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            💡 Coming Soon: Advanced Analytics
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-400">
            Detailed analytics including individual student progress tracking, question performance analysis,
            engagement trends, and exportable reports are currently in development.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
