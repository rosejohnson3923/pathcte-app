/**
 * Theme Management
 * ================
 * Light/Dark theme switching system
 * Works in both web (data-theme attribute) and mobile (context)
 */

import { glass, semantic, shadows } from './tokens';

export type Theme = 'light' | 'dark';

// ============================================================================
// THEME-AWARE TOKENS
// ============================================================================

/**
 * Get theme-specific values based on current theme
 * @param theme - 'light' or 'dark'
 */
export const getThemeColors = (theme: Theme) => {
  return theme === 'light' ? semantic.light : semantic.dark;
};

export const getGlassColors = (theme: Theme) => {
  return theme === 'light' ? glass.light : glass.dark;
};

export const getThemeShadows = (theme: Theme) => {
  if (theme === 'dark') {
    return {
      xs: '0 1px 2px 0 rgba(0, 0, 0, 0.2)',
      sm: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
      purple: '0 10px 40px -10px rgba(168, 85, 247, 0.5)',
      teal: '0 10px 40px -10px rgba(20, 184, 166, 0.5)',
      pink: '0 10px 40px -10px rgba(236, 72, 153, 0.5)',
    };
  }
  return shadows;
};

// ============================================================================
// THEME UTILITIES
// ============================================================================

/**
 * Get theme from localStorage or system preference
 * Web only - use useTheme hook in mobile
 */
export const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';

  const stored = localStorage.getItem('theme') as Theme | null;
  if (stored === 'light' || stored === 'dark') return stored;

  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

/**
 * Save theme to localStorage
 * Web only - use useTheme hook in mobile
 */
export const setStoredTheme = (theme: Theme): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('theme', theme);
};

/**
 * Apply theme to document
 * Web only - use useTheme hook in mobile
 */
export const applyTheme = (theme: Theme): void => {
  if (typeof window === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  // Also add/remove 'dark' class for Tailwind
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

/**
 * Toggle between light and dark theme
 * Web only - use useTheme hook in mobile
 */
export const toggleTheme = (currentTheme: Theme): Theme => {
  return currentTheme === 'light' ? 'dark' : 'light';
};

/**
 * Initialize theme on app load
 * Web only - call in main.tsx
 */
export const initializeTheme = (): Theme => {
  const theme = getStoredTheme();
  applyTheme(theme);
  return theme;
};

// ============================================================================
// THEME CONSTANTS
// ============================================================================

export const THEME = {
  LIGHT: 'light' as const,
  DARK: 'dark' as const,
  STORAGE_KEY: 'theme',
  ATTRIBUTE: 'data-theme',
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type ThemeColors = ReturnType<typeof getThemeColors>;
export type GlassColors = ReturnType<typeof getGlassColors>;
export type ThemeShadows = ReturnType<typeof getThemeShadows>;
