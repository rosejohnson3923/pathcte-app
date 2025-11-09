/**
 * @pathcte/shared
 * Shared code for Pathcte platform (types, services, hooks, utils)
 */

// Types
export * from './types';

// Configuration
export * from './config/supabase';
export * from './config/constants';
export * from './config/azure-storage';

// Design System
export * from './design-system';

// Services
export * from './services/azure-storage.service';
export * from './services/auth.service';
export * from './services/supabase.service';
export * from './services/game.service';
export * from './services/realtime.service';
export * from './services/analytics.service';
export * from './services/tournament.service';
export * from './services/admin.service';
export * from './services/pathkey.service';
export * from './services/teacher-analytics.service';

// Hooks (will be added)
// export * from './hooks';

// Utils
export * from './utils';

// Store
export * from './store';
