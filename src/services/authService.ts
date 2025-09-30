import { supabase } from '@/integrations/supabase/client';
import { User, Session, AuthError } from '@supabase/supabase-js';

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
  company?: string;
  role?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  company?: string;
  role?: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
}

class AuthService {
  // Sign up with email and password
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const { user, session, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            company: data.company,
            role: data.role
          }
        }
      });

      return { user, session, error };
    } catch (error) {
      return { user: null, session: null, error: error as AuthError };
    }
  }

  // Sign in with email and password
  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const { user, session, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      return { user, session, error };
    } catch (error) {
      return { user: null, session: null, error: error as AuthError };
    }
  }

  // Sign in with Google OAuth
  async signInWithGoogle(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  // Sign in with GitHub OAuth
  async signInWithGitHub(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  // Sign out
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  // Update password
  async updatePassword(password: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  // Update user profile
  async updateProfile(updates: {
    full_name?: string;
    avatar_url?: string;
    company?: string;
    role?: string;
  }): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  // Get current session
  async getSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      return { session, error };
    } catch (error) {
      return { session: null, error: error as AuthError };
    }
  }

  // Get current user
  async getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { user, error };
    } catch (error) {
      return { user: null, error: error as AuthError };
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Verify email
  async verifyEmail(token: string, type: 'signup' | 'recovery'): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  // Get user profile from database
  async getUserProfile(userId: string): Promise<{ profile: UserProfile | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      return { profile: data, error };
    } catch (error) {
      return { profile: null, error };
    }
  }

  // Create or update user profile
  async upsertUserProfile(profile: Partial<UserProfile>): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(profile);

      return { error };
    } catch (error) {
      return { error };
    }
  }

  // Check if user has completed onboarding
  async hasCompletedOnboarding(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', userId)
        .single();

      return !error && data?.onboarding_completed === true;
    } catch (error) {
      return false;
    }
  }

  // Mark onboarding as completed
  async completeOnboarding(userId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', userId);

      return { error };
    } catch (error) {
      return { error };
    }
  }

  // Get user preferences
  async getUserPreferences(userId: string): Promise<{ preferences: any; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      return { preferences: data, error };
    } catch (error) {
      return { preferences: null, error };
    }
  }

  // Update user preferences
  async updateUserPreferences(userId: string, preferences: any): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          preferences,
          updated_at: new Date().toISOString()
        });

      return { error };
    } catch (error) {
      return { error };
    }
  }

  // Delete user account
  async deleteAccount(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.admin.deleteUser(
        (await this.getCurrentUser()).user?.id || ''
      );
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  // Get user activity logs
  async getUserActivity(userId: string, limit = 50): Promise<{ activity: any[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      return { activity: data || [], error };
    } catch (error) {
      return { activity: [], error };
    }
  }

  // Log user activity
  async logActivity(userId: string, action: string, metadata?: any): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('user_activity')
        .insert({
          user_id: userId,
          action,
          metadata,
          created_at: new Date().toISOString()
        });

      return { error };
    } catch (error) {
      return { error };
    }
  }
}

export const authService = new AuthService();
