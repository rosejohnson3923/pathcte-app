/**
 * Theme Toggle Component
 * ======================
 * Button to switch between light and dark themes
 */

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useUIStore } from '@pathcte/shared';
import clsx from 'clsx';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, toggleTheme } = useUIStore();

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        'relative p-2 rounded-lg transition-colors',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        'focus:outline-none focus:ring-2 focus:ring-purple-500',
        className
      )}
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon size={20} className="text-gray-600" />
      ) : (
        <Sun size={20} className="text-amber-400" />
      )}
    </button>
  );
};

ThemeToggle.displayName = 'ThemeToggle';
