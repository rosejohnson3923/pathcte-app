/**
 * Header Component
 * =================
 * Main navigation header with user menu
 */

import React, { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Key, User, LogOut, Settings, Home, BookOpen, Trophy } from 'lucide-react';
import { useAuthStore } from '@pathket/shared';
import { Button, ThemeToggle } from '../common';
import clsx from 'clsx';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="bg-bg-primary border-b border-border-default sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Key className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-display font-bold text-text-primary">Pathket</span>
          </Link>

          {/* Navigation */}
          {user ? (
            <nav className="flex items-center gap-8">
              {/* Main Nav Links */}
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <Home size={20} />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>

              <Link
                to="/careers"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <BookOpen size={20} />
                <span className="text-sm font-medium">Careers</span>
              </Link>

              <Link
                to="/collection"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <Trophy size={20} />
                <span className="text-sm font-medium">Pathkeys</span>
              </Link>

              {/* Token Balance */}
              {profile && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/30 rounded-full">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    T
                  </div>
                  <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">{profile.tokens}</span>
                </div>
              )}

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Menu */}
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full p-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                    {profile?.display_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                  </div>
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-bg-primary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-3 border-b border-border-subtle">
                      <p className="text-sm font-medium text-text-primary">
                        {profile?.display_name || 'User'}
                      </p>
                      <p className="text-xs text-text-tertiary truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => navigate('/profile')}
                            className={clsx(
                              'flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors',
                              active
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300'
                                : 'text-gray-700 dark:text-gray-300'
                            )}
                          >
                            <User size={16} />
                            <span>Profile</span>
                          </button>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => navigate('/settings')}
                            className={clsx(
                              'flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors',
                              active
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300'
                                : 'text-gray-700 dark:text-gray-300'
                            )}
                          >
                            <Settings size={16} />
                            <span>Settings</span>
                          </button>
                        )}
                      </Menu.Item>
                    </div>

                    <div className="py-1 border-t border-border-subtle">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleSignOut}
                            className={clsx(
                              'flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors',
                              active
                                ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
                                : 'text-gray-700 dark:text-gray-300'
                            )}
                          >
                            <LogOut size={16} />
                            <span>Sign Out</span>
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </nav>
          ) : (
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button variant="primary" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

Header.displayName = 'Header';
