/**
 * Sidebar Component
 * ==================
 * Dashboard sidebar navigation with mobile drawer support
 */

import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
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
  X,
} from 'lucide-react';
import { useAuthStore } from '@pathcte/shared';
import clsx from 'clsx';

interface SidebarProps {
  className?: string;
  // Mobile drawer props
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  className,
  isMobileOpen = false,
  onMobileClose = () => {}
}) => {
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

  // Sidebar content (reused for both desktop and mobile)
  const SidebarContent = (
    <>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {/* Common Links */}
        <NavLink
          to="/dashboard"
          className={navLinkClasses}
          end
          onClick={() => onMobileClose()}
        >
          <Home size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/careers"
          className={navLinkClasses}
          onClick={() => onMobileClose()}
        >
          <BookOpen size={20} />
          <span>Explore Careers</span>
        </NavLink>

        <NavLink
          to="/collection"
          className={navLinkClasses}
          onClick={() => onMobileClose()}
        >
          <Trophy size={20} />
          <span>My Pathkeys</span>
        </NavLink>

        {/* Student-specific Links */}
        {isStudent && (
          <>
            <NavLink
              to="/join-game"
              className={navLinkClasses}
              onClick={() => onMobileClose()}
            >
              <Gamepad2 size={20} />
              <span>Join Game</span>
            </NavLink>

            <NavLink
              to="/market"
              className={navLinkClasses}
              onClick={() => onMobileClose()}
            >
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

            <NavLink
              to="/host-game"
              className={navLinkClasses}
              onClick={() => onMobileClose()}
            >
              <Gamepad2 size={20} />
              <span>Host Game</span>
            </NavLink>

            <NavLink
              to="/question-sets"
              className={navLinkClasses}
              onClick={() => onMobileClose()}
            >
              <FileQuestion size={20} />
              <span>Question Sets</span>
            </NavLink>

            <NavLink
              to="/students"
              className={navLinkClasses}
              onClick={() => onMobileClose()}
            >
              <Users size={20} />
              <span>My Students</span>
            </NavLink>

            <NavLink
              to="/analytics"
              className={navLinkClasses}
              onClick={() => onMobileClose()}
            >
              <BarChart3 size={20} />
              <span>Analytics</span>
            </NavLink>
          </>
        )}

        {/* Settings at bottom */}
        <div className="pt-4">
          <NavLink
            to="/settings"
            className={navLinkClasses}
            onClick={() => onMobileClose()}
          >
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
    </>
  );

  return (
    <>
      {/* Desktop Sidebar (>= lg) */}
      <aside className={clsx(
        'hidden lg:flex w-64 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 border-r border-gray-200 dark:border-gray-800 flex-col',
        className
      )}>
        {SidebarContent}
      </aside>

      {/* Mobile Drawer (< lg) */}
      <Transition.Root show={isMobileOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={onMobileClose}>
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          {/* Drawer */}
          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                {/* Close button */}
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={onMobileClose}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <X className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>

                {/* Sidebar content */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 px-0 pb-2">
                  {/* Logo */}
                  <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200 dark:border-gray-800">
                    <img
                      className="h-10 w-auto dark:hidden"
                      src="/pathCTE_wNoText_Light.svg"
                      alt="PathCTE"
                    />
                    <img
                      className="h-10 w-auto hidden dark:block"
                      src="/pathCTE_wNoText_Dark.svg"
                      alt="PathCTE"
                    />
                    <span className="ml-2 text-xl font-display font-bold text-gray-900 dark:text-white">
                      PathCTE
                    </span>
                  </div>

                  {/* Content */}
                  {SidebarContent}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

Sidebar.displayName = 'Sidebar';
