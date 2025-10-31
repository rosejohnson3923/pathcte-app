/**
 * Authentication Store
 * ====================
 * Zustand store for authentication state management
 * Platform-agnostic: Works in web and mobile
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, Session } from '@supabase/supabase-js';
import { authService } from '../services/auth.service';
import type { Database } from '../types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  // State
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: {
    email: string;
    password: string;
    fullName: string;
    role: 'student' | 'teacher' | 'parent';
    schoolId?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  refreshSession: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Storage adapter for web (localStorage) and mobile (AsyncStorage)
const getStorage = () => {
  // For web
  if (typeof window !== 'undefined' && window.localStorage) {
    return createJSONStorage(() => localStorage);
  }
  // For mobile, AsyncStorage would be passed here
  // This allows the store to work without modification
  return undefined;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      session: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      // Initialize auth state
      initialize: async () => {
        set({ isLoading: true, error: null });

        try {
          // Get current session
          const { session, error: sessionError } = await authService.getSession();

          if (sessionError || !session) {
            set({ isLoading: false, isAuthenticated: false });
            return;
          }

          // Get user
          const { user, error: userError } = await authService.getUser();

          if (userError || !user) {
            set({ isLoading: false, isAuthenticated: false });
            return;
          }

          // Get profile
          const { profile, error: profileError } = await authService.getProfile(user.id);

          set({
            user,
            session,
            profile: profileError ? null : profile,
            isAuthenticated: true,
            isLoading: false,
          });

          // Set up auth state listener
          authService.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
              set({
                user: null,
                session: null,
                profile: null,
                isAuthenticated: false,
              });
            } else if (event === 'SIGNED_IN' && session) {
              set({
                user: session.user,
                session,
                isAuthenticated: true,
              });

              // Fetch profile
              authService.getProfile(session.user.id).then(({ profile }) => {
                if (profile) {
                  set({ profile });
                }
              });
            } else if (event === 'TOKEN_REFRESHED' && session) {
              set({ session });
            }
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({
            error: error instanceof Error ? error.message : 'Initialization failed',
            isLoading: false,
          });
        }
      },

      // Sign in
      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const { user, session, error } = await authService.signIn({ email, password });

          if (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          if (!user || !session) {
            set({ error: 'Sign in failed', isLoading: false });
            return { success: false, error: 'Sign in failed' };
          }

          // Get profile
          const { profile } = await authService.getProfile(user.id);

          set({
            user,
            session,
            profile,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Sign up
      signUp: async (data) => {
        console.log('[AuthStore] Starting signup process');
        set({ isLoading: true, error: null });

        try {
          console.log('[AuthStore] Calling authService.signUp with:', {
            email: data.email,
            fullName: data.fullName,
            role: data.role,
            hasSchoolId: !!data.schoolId,
          });

          const { user, session, error } = await authService.signUp(data);

          if (error) {
            console.error('[AuthStore] Auth service returned error:', error);
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          if (!user) {
            console.error('[AuthStore] No user returned from authService');
            set({ error: 'Sign up failed', isLoading: false });
            return { success: false, error: 'Sign up failed' };
          }

          // Session may be null if email confirmation is enabled
          if (!session) {
            console.warn('[AuthStore] No session returned - email confirmation may be required');
            set({ isLoading: false });
            return {
              success: true,
              error: 'Please check your email to confirm your account'
            };
          }

          console.log('[AuthStore] User created successfully, fetching profile for userId:', user.id);

          // Get profile
          const { profile, error: profileError } = await authService.getProfile(user.id);

          if (profileError) {
            console.warn('[AuthStore] Profile fetch error (continuing anyway):', profileError);
          } else {
            console.log('[AuthStore] Profile fetched successfully');
          }

          set({
            user,
            session,
            profile,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          console.log('[AuthStore] Signup completed successfully');
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
          console.error('[AuthStore] Unexpected error during signup:', {
            error,
            message: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
          });
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Sign out
      signOut: async () => {
        set({ isLoading: true, error: null });

        try {
          await authService.signOut();

          set({
            user: null,
            session: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Sign out error:', error);
          set({
            error: error instanceof Error ? error.message : 'Sign out failed',
            isLoading: false,
          });
        }
      },

      // Update profile
      updateProfile: async (updates) => {
        const { user, profile } = get();
        if (!user || !profile) {
          return { success: false, error: 'Not authenticated' };
        }

        set({ isLoading: true, error: null });

        try {
          const { profile: updatedProfile, error } = await authService.updateProfile(user.id, updates);

          if (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          set({ profile: updatedProfile, isLoading: false });
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Update failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Refresh session
      refreshSession: async () => {
        try {
          const { session, error } = await authService.refreshSession();

          if (error || !session) {
            return;
          }

          set({ session });
        } catch (error) {
          console.error('Session refresh error:', error);
        }
      },

      // Setters
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setProfile: (profile) => set({ profile }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'pathcte-auth-storage',
      storage: getStorage(),
      partialize: (state) => ({
        // Only persist user, session, and profile
        user: state.user,
        session: state.session,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
