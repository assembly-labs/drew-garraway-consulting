/**
 * TOMO — Auth Context & Hook
 *
 * Manages authentication state throughout the app.
 * Handles login, signup, sign out, and auto-redirects.
 *
 * USAGE:
 *   // In App.tsx, wrap your app:
 *   <AuthProvider>
 *     <Navigation />
 *   </AuthProvider>
 *
 *   // In any screen:
 *   const { user, profile, isLoading, signOut } = useAuth();
 *
 * FLOW:
 *   App launches → check for existing session
 *     → No session → show Login/Signup screens
 *     → Has session, no profile → show Onboarding
 *     → Has session + profile → show main app (Journal tab)
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, profileService } from '../services/supabase';
import { offlineQueue } from '../services/offline-queue';
import type { Profile } from '../types/mvp-types';
import type { User } from '@supabase/supabase-js';

// ===========================================
// TYPES
// ===========================================

type AuthState = 'loading' | 'unauthenticated' | 'needs_onboarding' | 'authenticated';

interface AuthContextValue {
  /** Current Supabase user (null if not logged in) */
  user: User | null;
  /** User's profile (null if not onboarded yet) */
  profile: Profile | null;
  /** Current auth state — use this to decide which screens to show */
  authState: AuthState;
  /** True while initial auth check is running */
  isLoading: boolean;
  /** Sign in with email + password */
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  /** Create account with email + password */
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  /** Sign out and clear local state */
  signOut: () => Promise<void>;
  /** Refresh profile from database (call after onboarding completes) */
  refreshProfile: () => Promise<void>;
}

// ===========================================
// CONTEXT
// ===========================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ===========================================
// PROVIDER
// ===========================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Compute auth state from user + profile
  const authState: AuthState = isLoading
    ? 'loading'
    : !user
      ? 'unauthenticated'
      : !profile?.onboarding_complete
        ? 'needs_onboarding'
        : 'authenticated';

  // Load profile for a given user
  const loadProfile = useCallback(async (userId: string) => {
    const fetchedProfile = await profileService.get();
    setProfile(fetchedProfile);
  }, []);

  // Initial auth check on app launch
  useEffect(() => {
    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await loadProfile(session.user.id);
        }
      } catch (err) {
        console.error('Auth init failed:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, [loadProfile]);

  // Listen for auth state changes (login, logout, token refresh)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await loadProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  // --- Auth Actions ---

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    await offlineQueue.clear();
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadProfile(user.id);
    }
  }, [user, loadProfile]);

  // --- Render ---

  const value: AuthContextValue = {
    user,
    profile,
    authState,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

// ===========================================
// HOOK
// ===========================================

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
