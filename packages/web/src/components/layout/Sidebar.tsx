/**
 * Sidebar Component
 * ==================
 * Dashboard sidebar navigation
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Trophy,
  Gamepad2,
  ShoppingCart,
  BarChart3,
  FileQuestion,
  Users,
  Settings,
} from 'lucide-react';
import { useAuthStore } from '@pathket/shared';
import clsx from 'clsx';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { profile } = useAuthStore();
  const isTeacher = profile?.user_type === 'teacher';
  const isStudent = profile?.user_type === 'student';

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    clsx(
      'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group',
      isActive
        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30'
        : 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 hover:shadow-md dark:text-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 dark:hover:text-white'
    );

  return (
    <aside className={clsx('w-64 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 border-r border-gray-200 dark:border-gray-800 flex flex-col', className)}>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {/* Common Links */}
        <NavLink to="/dashboard" className={navLinkClasses} end>
          <Home size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/careers" className={navLinkClasses}>
          <BookOpen size={20} />
          <span>Explore Careers</span>
        </NavLink>

        <NavLink to="/collection" className={navLinkClasses}>
          <Trophy size={20} />
          <span>My Pathkeys</span>
        </NavLink>

        {/* Student-specific Links */}
        {isStudent && (
          <>
            <NavLink to="/games/join" className={navLinkClasses}>
              <Gamepad2 size={20} />
              <span>Join Game</span>
            </NavLink>

            <NavLink to="/market" className={navLinkClasses}>
              <ShoppingCart size={20} />
              <span>Market</span>
            </NavLink>
          </>
        )}

        {/* Teacher-specific Links */}
        {isTeacher && (
          <>
            <div className="pt-6 pb-2">
              <div className="px-4 flex items-center gap-2">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-400/40 dark:via-purple-500/30 to-transparent"></div>
                <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  Teaching Tools
                </p>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-400/40 dark:via-purple-500/30 to-transparent"></div>
              </div>
            </div>

            <NavLink to="/games/host" className={navLinkClasses}>
              <Gamepad2 size={20} />
              <span>Host Game</span>
            </NavLink>

            <NavLink to="/question-sets" className={navLinkClasses}>
              <FileQuestion size={20} />
              <span>Question Sets</span>
            </NavLink>

            <NavLink to="/students" className={navLinkClasses}>
              <Users size={20} />
              <span>My Students</span>
            </NavLink>

            <NavLink to="/analytics" className={navLinkClasses}>
              <BarChart3 size={20} />
              <span>Analytics</span>
            </NavLink>
          </>
        )}

        {/* Settings at bottom */}
        <div className="pt-4">
          <NavLink to="/settings" className={navLinkClasses}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </div>
      </nav>

      {/* User Role Badge */}
      {profile && (
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-transparent">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
                {profile.display_name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{profile.display_name || 'User'}</p>
                <div
                  className={clsx(
                    'px-2 py-0.5 rounded-full text-xs font-bold inline-block',
                    isTeacher && 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
                    isStudent && 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300',
                    !isTeacher && !isStudent && 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300'
                  )}
                >
                  {profile.user_type.charAt(0).toUpperCase() + profile.user_type.slice(1)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

Sidebar.displayName = 'Sidebar';
