import { DashboardLayout } from '../components/layout';
import { useAuth, useUserPathkeys, useGameCount, useUserGamePlayers } from '../hooks';
import { Card, Spinner } from '../components/common';
import { Trophy, Gamepad2, BookOpen, TrendingUp } from 'lucide-react';
import { getPathkeyImageUrl, getPlaceholderImageUrl } from '@pathket/shared';

export default function DashboardPage() {
  const { profile, isTeacher, isStudent } = useAuth();

  // Fetch real data
  const { data: userPathkeys, isLoading: pathkeysLoading } = useUserPathkeys();
  const gameCount = useGameCount();
  const { data: recentGames, isLoading: gamesLoading } = useUserGamePlayers(5);

  // Calculate stats
  const pathkeyCount = userPathkeys?.length || 0;
  const uniqueCareersExplored = new Set(userPathkeys?.map(up => up.pathkey_id)).size;

  return (
    <DashboardLayout>
      <div>
        {/* Hero Section with Gradient */}
        <div className="relative mb-8 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-8 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-display font-bold text-white mb-2">
              Welcome back, {profile?.display_name || 'User'}! 👋
            </h1>
            <p className="text-purple-100 text-lg">
              {isTeacher && 'Manage your classes and host engaging career exploration games.'}
              {isStudent && 'Continue your career exploration journey and collect more pathkeys!'}
            </p>
          </div>
        </div>

        {/* Stats Grid with Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Tokens Card */}
          <Card className="p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <div className="w-7 h-7 rounded-full bg-white/30 backdrop-blur-sm"></div>
                </div>
                <TrendingUp className="text-amber-600 opacity-20 group-hover:opacity-40 transition-opacity" size={40} />
              </div>
              <p className="text-3xl font-bold text-text-primary mb-1">{profile?.tokens || 0}</p>
              <p className="text-sm font-medium text-text-secondary">Tokens</p>
            </div>
          </Card>

          {/* Pathkeys Card */}
          <Card className="p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <Trophy className="text-white" size={28} />
                </div>
              </div>
              {pathkeysLoading ? (
                <Spinner size="sm" />
              ) : (
                <p className="text-3xl font-bold text-text-primary mb-1">{pathkeyCount}</p>
              )}
              <p className="text-sm font-medium text-text-secondary">Pathkeys Collected</p>
            </div>
          </Card>

          {/* Games Card */}
          <Card className="p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-cyan-50 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <Gamepad2 className="text-white" size={28} />
                </div>
              </div>
              <p className="text-3xl font-bold text-text-primary mb-1">{gameCount}</p>
              <p className="text-sm font-medium text-text-secondary">Games Played</p>
            </div>
          </Card>

          {/* Careers Card */}
          <Card className="p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <BookOpen className="text-white" size={28} />
                </div>
              </div>
              {pathkeysLoading ? (
                <Spinner size="sm" />
              ) : (
                <p className="text-3xl font-bold text-text-primary mb-1">{uniqueCareersExplored}</p>
              )}
              <p className="text-sm font-medium text-text-secondary">Careers Explored</p>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-6">
              <Card.Title className="text-white mb-1">Recent Games</Card.Title>
              <Card.Description className="text-teal-50">Your latest game sessions</Card.Description>
            </div>
            <Card.Content className="p-6">
              {gamesLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : recentGames && recentGames.length > 0 ? (
                <div className="space-y-3">
                  {recentGames.map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50/50 to-cyan-50/50 rounded-xl hover:shadow-md transition-all duration-200 border border-teal-100"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-md">
                          <Gamepad2 className="text-white" size={22} />
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary flex items-center gap-2">
                            {game.placement === 1 && (
                              <span className="text-xl">🏆</span>
                            )}
                            <span className="text-lg">{game.score || 0}</span>
                            <span className="text-sm text-text-tertiary font-normal">points</span>
                          </p>
                          <p className="text-xs text-text-tertiary font-medium">
                            {new Date(game.joined_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {game.placement && (
                          <div className="px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-sm font-bold">
                            #{game.placement}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-secondary">
                  <Gamepad2 size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No games played yet</p>
                  <p className="text-sm">Join a game to get started!</p>
                </div>
              )}
            </Card.Content>
          </Card>

          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6">
              <Card.Title className="text-white mb-1">Recent Pathkeys</Card.Title>
              <Card.Description className="text-purple-50">Your latest collectibles</Card.Description>
            </div>
            <Card.Content className="p-6">
              {pathkeysLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : userPathkeys && userPathkeys.length > 0 ? (
                <div className="space-y-3">
                  {userPathkeys.slice(0, 5).map((userPathkey) => (
                    <div
                      key={userPathkey.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl hover:shadow-md transition-all duration-200 border border-purple-100 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-purple-200 via-purple-300 to-pink-200 flex-shrink-0 shadow-lg ring-2 ring-purple-100 group-hover:ring-purple-300 transition-all group-hover:scale-105">
                          <img
                            src={getPathkeyImageUrl(userPathkey.pathkey_id)}
                            alt="Pathkey"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              e.currentTarget.src = getPlaceholderImageUrl('pathkey');
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary mb-1">Pathkey #{userPathkey.pathkey_id.slice(0, 8)}</p>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                              ×{userPathkey.quantity || 1}
                            </span>
                            <p className="text-xs text-text-tertiary">
                              {new Date(userPathkey.acquired_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-secondary">
                  <Trophy size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No pathkeys yet</p>
                  <p className="text-sm">Play games to earn pathkeys!</p>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
