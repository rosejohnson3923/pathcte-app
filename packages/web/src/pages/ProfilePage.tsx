/**
 * ProfilePage
 * ===========
 * User profile page showing achievements, stats, and collection
 */

import { DashboardLayout } from '../components/layout';
import { Card, Badge, Button } from '../components/common';
import { User, Trophy, Gamepad2, Award, Calendar, Mail } from 'lucide-react';
import { useAuthStore } from '@pathket/shared';
import { useUserPathkeys, useGameCount } from '../hooks';

export default function ProfilePage() {
  const { user, profile } = useAuthStore();
  const { data: userPathkeys } = useUserPathkeys();
  const gameCount = useGameCount();

  const pathkeyCount = userPathkeys?.length || 0;
  const uniqueCareersExplored = new Set(userPathkeys?.map(up => up.pathkey_id)).size;

  // Mock achievements
  const achievements = [
    { id: '1', title: 'First Steps', description: 'Played your first game', earned: true, icon: '🎮' },
    { id: '2', title: 'Collector', description: 'Collected 10 pathkeys', earned: pathkeyCount >= 10, icon: '🏆' },
    { id: '3', title: 'Explorer', description: 'Explored 25 careers', earned: uniqueCareersExplored >= 25, icon: '🧭' },
    { id: '4', title: 'Dedication', description: 'Played 20 games', earned: gameCount >= 20, icon: '🔥' },
  ];

  const joinDate = user?.created_at ? new Date(user.created_at) : null;

  return (
    <DashboardLayout>
      <div>
        {/* Profile Header */}
        <div className="relative mb-8 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <User className="absolute top-5 right-10 w-20 h-20 text-white" />
            <User className="absolute bottom-5 left-10 w-16 h-16 text-white" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm flex items-center justify-center text-white font-bold text-4xl shadow-2xl border-4 border-white/30">
                {profile?.display_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-display font-bold text-white mb-2">
                  {profile?.display_name || 'User'}
                </h1>
                <div className="flex items-center gap-3 text-purple-100 mb-3">
                  <div className="flex items-center gap-1">
                    <Mail size={16} />
                    <span>{user?.email}</span>
                  </div>
                  {joinDate && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>Joined {joinDate.toLocaleDateString()}</span>
                      </div>
                    </>
                  )}
                </div>
                <Badge variant="info" className="capitalize bg-white/20 text-white border-white/30">
                  {profile?.user_type || 'User'}
                </Badge>
              </div>

              <Button variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Tokens */}
          <Card className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <div className="w-8 h-8 rounded-full bg-white/30"></div>
            </div>
            <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {profile?.tokens || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Tokens</p>
          </Card>

          {/* Pathkeys */}
          <Card className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Trophy className="text-white" size={32} />
            </div>
            <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {pathkeyCount}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Pathkeys Collected</p>
          </Card>

          {/* Games */}
          <Card className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Gamepad2 className="text-white" size={32} />
            </div>
            <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {gameCount}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Games Played</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Achievements */}
          <Card>
            <div className="flex items-start gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <Award className="text-amber-600 dark:text-amber-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  Achievements
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {achievements.filter(a => a.earned).length} of {achievements.length} unlocked
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    achievement.earned
                      ? 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-300 dark:border-amber-700'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900 dark:text-gray-100">
                          {achievement.title}
                        </h4>
                        {achievement.earned && (
                          <Badge variant="success" className="text-xs">Earned</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <div className="flex items-start gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  Recent Activity
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your latest actions
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {userPathkeys && userPathkeys.slice(0, 5).map((userPathkey, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Collected a pathkey
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(userPathkey.acquired_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {(!userPathkeys || userPathkeys.length === 0) && (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                  <p className="text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
