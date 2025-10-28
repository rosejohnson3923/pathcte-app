/**
 * Design System Tokens
 * ====================
 * Adapted from Pathfinity design system
 * Works in both web (CSS variables/Tailwind) and mobile (StyleSheet)
 *
 * STRUCTURE:
 * - All values are primitives (numbers, strings) for React Native compatibility
 * - Color values as hex strings
 * - Spacing values as numbers (pixels)
 * - Typography sizes as numbers (pixels)
 *
 * USAGE:
 * Web: Import into tailwind.config.js
 * Mobile: Import into StyleSheet.create()
 */

// ============================================================================
// COLORS
// ============================================================================

export const colors = {
  // Neutrals
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },

  // Brand - Pathfinity Purple (shared with Pathket)
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Teal - Experience
  teal: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },

  // Magenta - Discover
  magenta: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },

  // Blue
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Semantic Colors
  green: {
    500: '#10b981',
    600: '#059669',
  },
  red: {
    500: '#ef4444',
    600: '#dc2626',
  },
  amber: {
    500: '#f59e0b',
    600: '#d97706',
  },

  // Pathket-Specific: Rarity Colors
  rarity: {
    common: '#9ca3af',
    uncommon: '#10b981',
    rare: '#3b82f6',
    epic: '#8b5cf6',
    legendary: '#f59e0b',
  },
} as const;

// ============================================================================
// SPACING (in pixels)
// ============================================================================

export const spacing = {
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  fontFamily: {
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, Courier, monospace',
  },

  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
    '7xl': 72,
    '8xl': 96,
    '9xl': 128,
  },

  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  letterSpacing: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
} as const;

// ============================================================================
// BORDERS
// ============================================================================

export const borders = {
  width: {
    none: 0,
    thin: 1,
    base: 2,
    thick: 3,
    heavy: 4,
  },

  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  },
} as const;

// ============================================================================
// SHADOWS (CSS strings for web, objects for mobile)
// ============================================================================

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

  // Colored shadows
  purple: '0 10px 40px -10px rgba(168, 85, 247, 0.3)',
  teal: '0 10px 40px -10px rgba(20, 184, 166, 0.3)',
  pink: '0 10px 40px -10px rgba(236, 72, 153, 0.3)',

  // Focus shadows
  focus: '0 0 0 3px rgba(168, 85, 247, 0.1)',
  focusError: '0 0 0 3px rgba(239, 68, 68, 0.1)',
  focusSuccess: '0 0 0 3px rgba(34, 197, 94, 0.1)',
} as const;

// ============================================================================
// GLASSMORPHISM
// ============================================================================

export const glass = {
  // Blur intensity
  blur: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },

  // Light theme
  light: {
    background: {
      base: 'rgba(255, 255, 255, 0.7)',
      elevated: 'rgba(255, 255, 255, 0.8)',
      subtle: 'rgba(255, 255, 255, 0.5)',
    },
    border: {
      default: 'rgba(255, 255, 255, 0.8)',
      strong: 'rgba(255, 255, 255, 0.9)',
      subtle: 'rgba(255, 255, 255, 0.3)',
    },
    shadow: {
      default: '0 8px 32px rgba(0, 0, 0, 0.1)',
      strong: '0 12px 48px rgba(0, 0, 0, 0.15)',
    },
    game: {
      primary: 'rgba(102, 126, 234, 0.15)',
      success: 'rgba(16, 185, 129, 0.15)',
      warning: 'rgba(245, 158, 11, 0.15)',
    },
    text: {
      primary: 'rgb(17, 24, 39)',
      secondary: 'rgb(55, 65, 81)',
      tertiary: 'rgb(75, 85, 99)',
      muted: 'rgb(107, 114, 128)',
    },
    icon: {
      primary: 'rgb(124, 58, 237)',
      accent: 'rgb(234, 179, 8)',
      success: 'rgb(22, 163, 74)',
      warning: 'rgb(234, 88, 12)',
    },
  },

  // Dark theme
  dark: {
    background: {
      base: 'rgba(0, 0, 0, 0.5)',
      elevated: 'rgba(0, 0, 0, 0.6)',
      subtle: 'rgba(0, 0, 0, 0.3)',
    },
    border: {
      default: 'rgba(255, 255, 255, 0.1)',
      strong: 'rgba(255, 255, 255, 0.2)',
      subtle: 'rgba(255, 255, 255, 0.05)',
    },
    shadow: {
      default: '0 8px 32px rgba(0, 0, 0, 0.3)',
      strong: '0 12px 48px rgba(0, 0, 0, 0.5)',
    },
    game: {
      primary: 'rgba(102, 126, 234, 0.25)',
      success: 'rgba(16, 185, 129, 0.25)',
      warning: 'rgba(245, 158, 11, 0.25)',
    },
    text: {
      primary: 'rgb(255, 255, 255)',
      secondary: 'rgba(255, 255, 255, 0.9)',
      tertiary: 'rgba(255, 255, 255, 0.8)',
      muted: 'rgba(255, 255, 255, 0.7)',
    },
    icon: {
      primary: 'rgb(255, 255, 255)',
      accent: 'rgb(253, 224, 71)',
      success: 'rgb(134, 239, 172)',
      warning: 'rgb(251, 146, 60)',
    },
  },
} as const;

// ============================================================================
// EFFECTS
// ============================================================================

export const effects = {
  opacity: {
    0: 0,
    5: 0.05,
    10: 0.1,
    20: 0.2,
    25: 0.25,
    30: 0.3,
    40: 0.4,
    50: 0.5,
    60: 0.6,
    70: 0.7,
    75: 0.75,
    80: 0.8,
    90: 0.9,
    95: 0.95,
    100: 1,
  },

  transition: {
    none: 'none',
    all: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    shadow: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// ============================================================================
// ANIMATION
// ============================================================================

export const animation = {
  duration: {
    instant: 0,
    fast: 150,
    base: 250,
    moderate: 350,
    slow: 500,
    slower: 750,
    slowest: 1000,
  },

  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// ============================================================================
// Z-INDEX
// ============================================================================

export const zIndex = {
  auto: 'auto',
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// ============================================================================
// BREAKPOINTS (in pixels)
// ============================================================================

export const breakpoints = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// ============================================================================
// SEMANTIC TOKENS
// ============================================================================

export const semantic = {
  // Light theme (default)
  light: {
    background: {
      primary: '#ffffff',
      secondary: colors.gray[50],
      tertiary: colors.gray[100],
      elevated: '#ffffff',
    },
    text: {
      primary: colors.gray[900],
      secondary: colors.gray[600],
      tertiary: colors.gray[500],
      inverse: '#ffffff',
    },
    border: {
      default: colors.gray[200],
      strong: colors.gray[300],
      subtle: colors.gray[100],
    },
    status: {
      success: colors.green[500],
      error: colors.red[500],
      warning: colors.amber[500],
      info: colors.blue[500],
    },
  },

  // Dark theme
  dark: {
    background: {
      primary: colors.gray[900],
      secondary: colors.gray[800],
      tertiary: colors.gray[700],
      elevated: colors.gray[800],
    },
    text: {
      primary: colors.gray[50],
      secondary: colors.gray[300],
      tertiary: colors.gray[400],
      inverse: colors.gray[900],
    },
    border: {
      default: colors.gray[700],
      strong: colors.gray[600],
      subtle: colors.gray[800],
    },
    status: {
      success: colors.green[500],
      error: colors.red[500],
      warning: colors.amber[500],
      info: colors.blue[500],
    },
  },
} as const;

// ============================================================================
// GAME-SPECIFIC TOKENS
// ============================================================================

export const game = {
  pathkey: {
    size: {
      sm: 80,
      md: 120,
      lg: 160,
      xl: 200,
    },
    rarity: {
      common: {
        color: colors.rarity.common,
        label: 'Common',
        dropRate: 0.45,
        tokensValue: 10,
      },
      uncommon: {
        color: colors.rarity.uncommon,
        label: 'Uncommon',
        dropRate: 0.3,
        tokensValue: 25,
      },
      rare: {
        color: colors.rarity.rare,
        label: 'Rare',
        dropRate: 0.15,
        tokensValue: 50,
      },
      epic: {
        color: colors.rarity.epic,
        label: 'Epic',
        dropRate: 0.07,
        tokensValue: 100,
      },
      legendary: {
        color: colors.rarity.legendary,
        label: 'Legendary',
        dropRate: 0.03,
        tokensValue: 250,
      },
    },
  },

  card: {
    size: {
      sm: { width: 160, height: 120 },
      md: { width: 220, height: 170 },
      lg: { width: 280, height: 220 },
    },
  },
} as const;

// ============================================================================
// TYPE EXPORTS FOR TYPESCRIPT
// ============================================================================

export type Color = typeof colors;
export type Spacing = typeof spacing;
export type Typography = typeof typography;
export type Borders = typeof borders;
export type Shadows = typeof shadows;
export type Glass = typeof glass;
export type Effects = typeof effects;
export type Animation = typeof animation;
export type ZIndex = typeof zIndex;
export type Breakpoints = typeof breakpoints;
export type Semantic = typeof semantic;
export type Game = typeof game;

// ============================================================================
// DEFAULT EXPORT WITH ALL TOKENS
// ============================================================================

export const tokens = {
  colors,
  spacing,
  typography,
  borders,
  shadows,
  glass,
  effects,
  animation,
  zIndex,
  breakpoints,
  semantic,
  game,
} as const;

export default tokens;
