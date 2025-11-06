/**
 * Application Constants
 * Shared constants across all platforms
 */

// ============================================================================
// GAME CONFIGURATION
// ============================================================================

export const GAME_MODES = {
  CAREER_QUEST: 'career_quest',
  PATH_DEFENSE: 'path_defense',
  CAREER_CLASH: 'career_clash',
  MYSTERY_PATH: 'mystery_path',
  SPEED_RUN: 'speed_run',
  TEAM_CHALLENGE: 'team_challenge',
} as const;

export const GAME_CODE_LENGTH = 6;
export const GAME_CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// Scoring and timing configuration per game mode
// Set penalty to 0 to disable it for a specific mode
// time_multiplier: 1.0 = normal, 0.5 = half time, 2.0 = double time
export const GAME_MODE_SCORING = {
  career_quest: {
    correct_points: 25,
    incorrect_penalty: -10,
    no_answer_penalty: -10,
    time_multiplier: 1.0,
  },
  path_defense: {
    correct_points: 25,
    incorrect_penalty: -10,
    no_answer_penalty: -10,
    time_multiplier: 1.0,
  },
  career_clash: {
    correct_points: 25,
    incorrect_penalty: -10,
    no_answer_penalty: -10,
    time_multiplier: 1.0,
  },
  mystery_path: {
    correct_points: 25,
    incorrect_penalty: -10,
    no_answer_penalty: -10,
    time_multiplier: 1.0,
  },
  speed_run: {
    correct_points: 25,
    incorrect_penalty: -10,
    no_answer_penalty: -10,
    time_multiplier: 0.5, // Lightning! Path runs at half time
  },
  team_challenge: {
    correct_points: 25,
    incorrect_penalty: -10,
    no_answer_penalty: -10,
    time_multiplier: 1.0,
  },
} as const;

export const DEFAULT_GAME_SETTINGS = {
  MAX_PLAYERS: 50,
  DEFAULT_TIME_LIMIT: 30, // seconds
  DEFAULT_POINTS: 10,
  ALLOW_LATE_JOIN: true,
  IS_PUBLIC: false,
};

// ============================================================================
// PATHKEY CONFIGURATION
// ============================================================================

export const RARITY_CONFIG = {
  common: {
    label: 'Common',
    color: '#9CA3AF', // gray
    dropRate: 0.45,
    tokensValue: 10,
  },
  uncommon: {
    label: 'Uncommon',
    color: '#10B981', // green
    dropRate: 0.3,
    tokensValue: 25,
  },
  rare: {
    label: 'Rare',
    color: '#3B82F6', // blue
    dropRate: 0.15,
    tokensValue: 50,
  },
  epic: {
    label: 'Epic',
    color: '#8B5CF6', // purple
    dropRate: 0.07,
    tokensValue: 100,
  },
  legendary: {
    label: 'Legendary',
    color: '#F59E0B', // orange
    dropRate: 0.03,
    tokensValue: 250,
  },
} as const;

// ============================================================================
// TOKEN ECONOMY
// ============================================================================

export const TOKEN_REWARDS = {
  GAME_PARTICIPATION: 5,
  GAME_WIN: 20,
  CORRECT_ANSWER: 2,
  PERFECT_SCORE: 50,
  DAILY_LOGIN: 10,
  ACHIEVEMENT_UNLOCK: 25,
  FIRST_GAME: 100,
} as const;

export const TOKEN_COSTS = {
  HINT: 5,
  RETRY: 10,
  UNLOCK_PATHKEY: 100,
  CUSTOM_AVATAR: 50,
} as const;

// ============================================================================
// SUBSCRIPTION TIERS
// ============================================================================

export const SUBSCRIPTION_TIERS = {
  free: {
    label: 'Free',
    maxQuestionSets: 5,
    maxQuestionsPerSet: 20,
    maxStudents: 30,
    features: ['basic_games', 'basic_analytics'],
  },
  plus: {
    label: 'Plus',
    price: 9.99,
    maxQuestionSets: 50,
    maxQuestionsPerSet: 100,
    maxStudents: 150,
    features: ['all_games', 'advanced_analytics', 'custom_pathkeys', 'priority_support'],
  },
  flex: {
    label: 'Flex',
    price: 19.99,
    maxQuestionSets: -1, // unlimited
    maxQuestionsPerSet: -1, // unlimited
    maxStudents: -1, // unlimited
    features: [
      'all_games',
      'advanced_analytics',
      'custom_pathkeys',
      'priority_support',
      'white_label',
      'api_access',
    ],
  },
} as const;

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
  },
  DISPLAY_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
  QUESTION_TEXT: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 500,
  },
  QUESTION_SET_TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
  },
} as const;

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: '/auth/signin',
    SIGN_UP: '/auth/signup',
    SIGN_OUT: '/auth/signout',
    REFRESH: '/auth/refresh',
  },
  GAMES: {
    CREATE: '/games/create',
    JOIN: '/games/join',
    START: '/games/start',
    END: '/games/end',
  },
  PATHKEYS: {
    LIST: '/pathkeys',
    DETAIL: '/pathkeys/:id',
    USER_COLLECTION: '/pathkeys/collection',
    UNLOCK: '/pathkeys/unlock',
  },
} as const;

// ============================================================================
// UI CONSTANTS
// ============================================================================

export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000,
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_ALREADY_EXISTS: 'Email already in use',
    WEAK_PASSWORD: 'Password is too weak',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  },
  GAME: {
    CODE_INVALID: 'Invalid game code',
    GAME_FULL: 'This game is full',
    GAME_STARTED: 'This game has already started',
    NOT_HOST: 'Only the host can perform this action',
  },
  NETWORK: {
    OFFLINE: 'You appear to be offline',
    TIMEOUT: 'Request timed out',
    GENERIC: 'Something went wrong. Please try again.',
  },
} as const;

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  AUTH: {
    SIGNED_IN: 'Welcome back!',
    SIGNED_UP: 'Account created successfully!',
    SIGNED_OUT: 'Signed out successfully',
  },
  GAME: {
    CREATED: 'Game created!',
    JOINED: 'Joined game successfully',
    COMPLETED: 'Game completed!',
  },
  PATHKEY: {
    UNLOCKED: 'New Pathkey unlocked!',
  },
} as const;
