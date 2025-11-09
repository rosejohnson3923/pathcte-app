/**
 * AdminDashboardPage
 * ==================
 * System-wide admin dashboard for monitoring all activity across pathCTE
 */

import { useState } from 'react';
import { DashboardLayout } from '../components/layout';
import { Card, Badge, Spinner, Modal } from '../components/common';
import {
  Users,
  Gamepad2,
  BookOpen,
  Activity,
  UserPlus,
  Award,
  Shield,
  Trophy,
  Mail,
  Calendar,
  Clock,
  Target,
  ExternalLink,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminService, type UserActivity, type GameActivity, type ContentStats } from '@pathcte/shared';
import { formatDistance, format } from 'date-fns';

export default function AdminDashboardPage() {
  // Modal states
  const [selectedUser, setSelectedUser] = useState<UserActivity | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameActivity | null>(null);
  const [selectedContent, setSelectedContent] = useState<ContentStats | null>(null);

  // Fetch system-wide data
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: () => adminService.getSystemOverview(),
  });

  const { data: recentGames, isLoading: gamesLoading } = useQuery({
    queryKey: ['admin', 'recentGames'],
    queryFn: () => adminService.getRecentGames(10),
  });

  const { data: recentUsers, isLoading: usersLoading } = useQuery({
    queryKey: ['admin', 'recentUsers'],
    queryFn: () => adminService.getRecentUserActivity(10),
  });

  const { data: topContent, isLoading: contentLoading } = useQuery({
    queryKey: ['admin', 'topContent'],
    queryFn: () => adminService.getPopularContent(5),
  });

  const { data: topPlayers, isLoading: playersLoading } = useQuery({
    queryKey: ['admin', 'topPlayers'],
    queryFn: () => adminService.getTopUsers('score', 5),
  });

  const isLoading = overviewLoading || gamesLoading || usersLoading || contentLoading || playersLoading;

  return (
    <DashboardLayout>
      <div>
        {/* Page Header */}
        <div className="relative mb-8 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <Shield className="absolute top-5 right-10 w-20 h-20 text-white" />
            <Activity className="absolute bottom-5 left-10 w-16 h-16 text-white" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Shield className="text-white" size={32} />
              </div>
              <h1 className="text-4xl font-display font-bold text-white">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-purple-100 text-lg ml-20">
              System-wide monitoring and analytics
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {/* Overview Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Users */}
              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {overview?.total_users || 0}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      +{overview?.new_users_30d || 0} this month
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
                      {overview?.games_in_progress || 0} in progress
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Gamepad2 className="text-purple-600 dark:text-purple-400" size={24} />
                  </div>
                </div>
              </Card>

              {/* Questions Answered */}
              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Questions Answered</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {(overview?.total_questions_answered || 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {overview?.total_questions || 0} total questions
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <BookOpen className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                </div>
              </Card>

              {/* Pathkeys Awarded */}
              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pathkeys Awarded</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {(overview?.total_pathkeys_awarded || 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {(overview?.total_tokens_awarded || 0).toLocaleString()} tokens
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <Award className="text-yellow-600 dark:text-yellow-400" size={24} />
                  </div>
                </div>
              </Card>
            </div>

            {/* User Type Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">Students</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {overview?.total_students || 0}
                    </p>
                  </div>
                  <Users className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-purple-700 dark:text-purple-300 mb-1">Teachers</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {overview?.total_teachers || 0}
                    </p>
                  </div>
                  <Users className="text-purple-600 dark:text-purple-400" size={20} />
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-green-700 dark:text-green-300 mb-1">Parents</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {overview?.total_parents || 0}
                    </p>
                  </div>
                  <Users className="text-green-600 dark:text-green-400" size={20} />
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-indigo-700 dark:text-indigo-300 mb-1">Admins</p>
                    <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                      {overview?.total_admins || 0}
                    </p>
                  </div>
                  <Shield className="text-indigo-600 dark:text-indigo-400" size={20} />
                </div>
              </Card>
            </div>

            {/* Activity Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Activity className="text-green-600 dark:text-green-400" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Active Users
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last 7 days</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {overview?.active_users_7d || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last 30 days</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {overview?.active_users_30d || 0}
                    </span>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Gamepad2 className="text-blue-600 dark:text-blue-400" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Game Activity
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Today</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {overview?.games_today || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">This week</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {overview?.games_this_week || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">This month</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {overview?.games_this_month || 0}
                    </span>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <UserPlus className="text-purple-600 dark:text-purple-400" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    New Users
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last 7 days</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {overview?.new_users_7d || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last 30 days</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {overview?.new_users_30d || 0}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Two Column Layout for Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Recent Games */}
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Gamepad2 className="text-purple-600 dark:text-purple-400" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Recent Games
                  </h3>
                </div>
                <div className="space-y-3">
                  {recentGames?.slice(0, 5).map((game) => (
                    <div
                      key={game.session_id}
                      onClick={() => setSelectedGame(game)}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={
                              game.status === 'in_progress' ? 'success' :
                              game.status === 'completed' ? 'info' : 'default'
                            }
                          >
                            {game.status}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {game.game_code}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {game.host_name || game.host_email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {game.total_players} players · {game.game_mode}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDistance(new Date(game.created_at), new Date(), { addSuffix: true })}
                        </p>
                        <ExternalLink className="text-gray-400" size={14} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Users */}
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Users className="text-blue-600 dark:text-blue-400" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Recent Users
                  </h3>
                </div>
                <div className="space-y-3">
                  {recentUsers?.slice(0, 5).map((user) => (
                    <div
                      key={user.user_id}
                      onClick={() => setSelectedUser(user)}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="info">{user.user_type}</Badge>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.display_name || user.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.total_games} games · {user.total_score} pts
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDistance(new Date(user.created_at), new Date(), { addSuffix: true })}
                        </p>
                        <ExternalLink className="text-gray-400" size={14} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Popular Content and Top Players */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Popular Question Sets */}
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <BookOpen className="text-green-600 dark:text-green-400" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Popular Content
                  </h3>
                </div>
                <div className="space-y-3">
                  {topContent?.map((content, index) => (
                    <div
                      key={content.question_set_id}
                      onClick={() => setSelectedContent(content)}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {content.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {content.times_played} plays · {content.total_questions} questions
                          {content.average_score && ` · ${content.average_score} avg`}
                        </p>
                      </div>
                      <ExternalLink className="text-gray-400" size={14} />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Top Players */}
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <Trophy className="text-yellow-600 dark:text-yellow-400" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Top Players
                  </h3>
                </div>
                <div className="space-y-3">
                  {topPlayers?.map((player, index) => (
                    <div
                      key={player.user_id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {player.display_name || player.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {player.metric_value.toLocaleString()} {player.metric_label.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}

        {/* User Detail Modal */}
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title="User Details"
        >
          {selectedUser && (
            <div className="space-y-6">
              {/* User Header */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                  {selectedUser.display_name?.charAt(0)?.toUpperCase() || selectedUser.email.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedUser.display_name || 'No display name'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Mail size={14} />
                    {selectedUser.email}
                  </p>
                </div>
                <Badge variant="info">{selectedUser.user_type}</Badge>
              </div>

              {/* User Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">Total Games</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{selectedUser.total_games}</p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <p className="text-sm text-purple-700 dark:text-purple-300 mb-1">Total Score</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{selectedUser.total_score}</p>
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Calendar className="text-gray-500 dark:text-gray-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Joined</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {format(new Date(selectedUser.created_at), 'PPP')}
                    </p>
                  </div>
                </div>
                {selectedUser.last_active && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <Clock className="text-gray-500 dark:text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Last Active</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatDistance(new Date(selectedUser.last_active), new Date(), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Target className="text-gray-500 dark:text-gray-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">User ID</p>
                    <p className="text-xs font-mono text-gray-700 dark:text-gray-300">{selectedUser.user_id}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Game Detail Modal */}
        <Modal
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          title="Game Details"
        >
          {selectedGame && (
            <div className="space-y-6">
              {/* Game Header */}
              <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={
                      selectedGame.status === 'in_progress' ? 'success' :
                      selectedGame.status === 'completed' ? 'info' : 'default'
                    }
                  >
                    {selectedGame.status}
                  </Badge>
                  <Badge variant="outline">{selectedGame.game_code}</Badge>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {selectedGame.question_set_title || 'No question set'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Hosted by {selectedGame.host_name || selectedGame.host_email}
                </p>
              </div>

              {/* Game Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <p className="text-sm text-purple-700 dark:text-purple-300 mb-1">Players</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{selectedGame.total_players}</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">Game Mode</p>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{selectedGame.game_mode}</p>
                </div>
              </div>

              {/* Game Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Calendar className="text-gray-500 dark:text-gray-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {format(new Date(selectedGame.created_at), 'PPP p')}
                    </p>
                  </div>
                </div>
                {selectedGame.ended_at && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <Clock className="text-gray-500 dark:text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Ended</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {format(new Date(selectedGame.ended_at), 'PPP p')}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Target className="text-gray-500 dark:text-gray-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Session ID</p>
                    <p className="text-xs font-mono text-gray-700 dark:text-gray-300">{selectedGame.session_id}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Content Detail Modal */}
        <Modal
          isOpen={!!selectedContent}
          onClose={() => setSelectedContent(null)}
          title="Question Set Details"
        >
          {selectedContent && (
            <div className="space-y-6">
              {/* Content Header */}
              <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {selectedContent.title}
                </h3>
                {selectedContent.created_by_email && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Mail size={14} />
                    Created by {selectedContent.created_by_email}
                  </p>
                )}
              </div>

              {/* Content Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <p className="text-xs text-green-700 dark:text-green-300 mb-1">Times Played</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{selectedContent.times_played}</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">Questions</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{selectedContent.total_questions}</p>
                </div>
                {selectedContent.average_score !== null && (
                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <p className="text-xs text-purple-700 dark:text-purple-300 mb-1">Avg Score</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{selectedContent.average_score}</p>
                  </div>
                )}
              </div>

              {/* Content Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Calendar className="text-gray-500 dark:text-gray-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {format(new Date(selectedContent.created_at), 'PPP')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Target className="text-gray-500 dark:text-gray-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Question Set ID</p>
                    <p className="text-xs font-mono text-gray-700 dark:text-gray-300">{selectedContent.question_set_id}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
