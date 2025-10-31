/**
 * useAuth Hook
 * =============
 * Simplified auth hook wrapping authStore
 */

import { useAuthStore } from '@pathcte/shared';

export const useAuth = () => {
  const {
    user,
    session,
    profile,
    isLoading,
    isAuthenticated,
    error,
    initialize,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshSession,
    clearError,
  } = useAuthStore();

  return {
    // State
    user,
    session,
    profile,
    isLoading,
    isAuthenticated,
    error,

    // Actions
    initialize,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshSession,
    clearError,

    // Computed
    isTeacher: profile?.user_type === 'teacher',
    isStudent: profile?.user_type === 'student',
    isParent: profile?.user_type === 'parent',
  };
};
