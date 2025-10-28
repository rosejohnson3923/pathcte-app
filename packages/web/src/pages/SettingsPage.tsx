/**
 * SettingsPage
 * ============
 * User settings and preferences
 */

import { useState } from 'react';
import { DashboardLayout } from '../components/layout';
import { Card, Button, Input, Badge } from '../components/common';
import { Settings, Bell, Lock, Mail, Globe, Palette } from 'lucide-react';
import { useAuthStore } from '@pathket/shared';

export default function SettingsPage() {
  const { profile } = useAuthStore();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [gameInvites, setGameInvites] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        {/* Page Header */}
        <div className="relative mb-8 rounded-2xl bg-gradient-to-br from-slate-600 via-gray-700 to-slate-800 p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Settings className="absolute top-5 right-10 w-20 h-20 text-white" />
            <Settings className="absolute bottom-5 left-10 w-16 h-16 text-white" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Settings className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-display font-bold text-white">
                  Settings
                </h1>
                <p className="text-slate-100 text-lg">
                  Manage your account and preferences
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Account Settings */}
          <Card>
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <Settings className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                  Account Information
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Update your personal information
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Display Name
                </label>
                <Input
                  type="text"
                  defaultValue={profile?.display_name || ''}
                  fullWidth
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  defaultValue={profile?.email || ''}
                  leftIcon={<Mail size={20} />}
                  fullWidth
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <Badge variant={profile?.user_type === 'teacher' ? 'info' : 'success'} className="capitalize">
                  {profile?.user_type || 'User'}
                </Badge>
              </div>

              <div className="pt-4">
                <Button variant="primary">
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card>
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <Bell className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                  Notifications
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage how you receive notifications
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive email updates about your account
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Game Invites</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get notified when invited to games
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gameInvites}
                    onChange={(e) => setGameInvites(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Weekly Digest</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive a weekly summary of your activity
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={weeklyDigest}
                    onChange={(e) => setWeeklyDigest(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                <Palette className="text-pink-600 dark:text-pink-400" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                  Appearance
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customize how Pathket looks
                </p>
              </div>
            </div>

            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">Theme</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Use the theme toggle in the header to switch between light and dark modes
              </p>
            </div>
          </Card>

          {/* Security Settings */}
          <Card>
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <Lock className="text-red-600 dark:text-red-400" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                  Security
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your password and security settings
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Button variant="outline">
                Change Password
              </Button>
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <Globe className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                  Privacy
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Control your privacy preferences
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your data is secure and private. We never share your personal information without your consent.
              </p>
              <Button variant="ghost" size="sm">
                View Privacy Policy
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
