/**
 * Authentication Service
 * ======================
 * Platform-agnostic authentication service using Supabase Auth
 * Works in both web and mobile applications
 */

import { supabase } from '../config/supabase';
import type {
  User,
  Session,
  AuthError,
  AuthChangeEvent,
} from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  role: 'student' | 'teacher' | 'parent';
  schoolId?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResult {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export interface ProfileResult {
  profile: Profile | null;
  error: Error | null;
}

class AuthService {
  /**
   * Sign up a new user with email and password
   */
  async signUp(data: SignUpData): Promise<AuthResult> {
    try {
      const { email, password, fullName, role, schoolId } = data;

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });

      if (authError) {
        return { user: null, session: null, error: authError };
      }

      if (!authData.user) {
        return {
          user: null,
          session: null,
          error: {
            message: 'User creation failed',
            name: 'SignUpError',
            status: 500,
          } as AuthError,
        };
      }

      // Create profile in database
      const profileData = {
        id: authData.user.id,
        email,
        full_name: fullName,
        role,
        school_id: schoolId || null,
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .insert(profileData as any);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't fail the signup if profile creation fails
        // The profile can be created later via a database trigger or manually
      }

      return {
        user: authData.user,
        session: authData.session,
        error: null,
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        user: null,
        session: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          name: 'SignUpError',
          status: 500,
        } as AuthError,
      };
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(data: SignInData): Promise<AuthResult> {
    try {
      const { email, password } = data;

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return { user: null, session: null, error: authError };
      }

      return {
        user: authData.user,
        session: authData.session,
        error: null,
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        user: null,
        session: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          name: 'SignInError',
          status: 500,
        } as AuthError,
      };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return {
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          name: 'SignOutError',
          status: 500,
        } as AuthError,
      };
    }
  }

  /**
   * Get the current session
   */
  async getSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      return { session: data.session, error };
    } catch (error) {
      console.error('Get session error:', error);
      return {
        session: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          name: 'SessionError',
          status: 500,
        } as AuthError,
      };
    }
  }

  /**
   * Get the current user
   */
  async getUser(): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.getUser();
      return { user: data.user, error };
    } catch (error) {
      console.error('Get user error:', error);
      return {
        user: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          name: 'UserError',
          status: 500,
        } as AuthError,
      };
    }
  }

  /**
   * Get user profile from database
   */
  async getProfile(userId: string): Promise<ProfileResult> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return { profile: null, error: new Error(error.message) };
      }

      return { profile: data, error: null };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        profile: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    updates: Partial<Profile>
  ): Promise<{ profile: Profile | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        // @ts-expect-error - Complex generic type issue with Supabase update
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { profile: null, error: new Error(error.message) };
      }

      return { profile: data, error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        profile: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  }

  /**
   * Reset password via email
   */
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/reset-password`,
      });
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          name: 'ResetPasswordError',
          status: 500,
        } as AuthError,
      };
    }
  }

  /**
   * Update user password
   */
  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error };
    } catch (error) {
      console.error('Update password error:', error);
      return {
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          name: 'UpdatePasswordError',
          status: 500,
        } as AuthError,
      };
    }
  }

  /**
   * Sign in with OAuth provider (Google, GitHub, etc.)
   */
  async signInWithOAuth(provider: 'google' | 'github' | 'discord'): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
        },
      });
      return { error };
    } catch (error) {
      console.error('OAuth sign in error:', error);
      return {
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          name: 'OAuthError',
          status: 500,
        } as AuthError,
      };
    }
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  /**
   * Refresh the current session
   */
  async refreshSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      return { session: data.session, error };
    } catch (error) {
      console.error('Refresh session error:', error);
      return {
        session: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          name: 'RefreshError',
          status: 500,
        } as AuthError,
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const { session } = await this.getSession();
    return session !== null;
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export class for testing
export { AuthService };
