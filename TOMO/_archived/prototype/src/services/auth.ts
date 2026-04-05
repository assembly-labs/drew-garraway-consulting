/**
 * Authentication Service
 *
 * Mock authentication service for the prototype.
 * Designed to be replaced with Supabase Auth in production.
 *
 * Usage:
 *   import { authService } from '@/services/auth';
 *   const { user, error } = await authService.signIn({ email, password });
 */

import type {
  AuthUser,
  AuthSession,
  AuthResponse,
  SignOutResponse,
  SignUpCredentials,
  SignInCredentials,
  AuthError,
} from '../types/auth';

// ===========================================
// STORAGE
// ===========================================

const STORAGE_KEYS = {
  USER: 'bjj-auth-user',
  SESSION: 'bjj-auth-session',
} as const;

// ===========================================
// MOCK USER FOR PROTOTYPE
// ===========================================

const MOCK_USER: AuthUser = {
  id: 'user-001',
  email: 'demo@bjjprogress.app',
  email_verified: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: {
    provider: 'email',
    providers: ['email'],
  },
  user_metadata: {
    name: 'Demo User',
  },
};

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function generateMockSession(user: AuthUser): AuthSession {
  const now = Math.floor(Date.now() / 1000);
  return {
    access_token: `mock_token_${Date.now()}`,
    refresh_token: `mock_refresh_${Date.now()}`,
    expires_in: 3600, // 1 hour
    expires_at: now + 3600,
    token_type: 'bearer',
    user,
  };
}

function saveAuth(user: AuthUser, session: AuthSession): void {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

function getStoredUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function getStoredSession(): AuthSession | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function createError(message: string, code: AuthError['code']): AuthError {
  return { message, code };
}

// ===========================================
// AUTH SERVICE
// ===========================================

export const authService = {
  /**
   * Get current user (if authenticated)
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    // For prototype, always return mock user
    const stored = getStoredUser();
    if (stored) return stored;

    // Auto-login with mock user for demo
    const session = generateMockSession(MOCK_USER);
    saveAuth(MOCK_USER, session);
    return MOCK_USER;
  },

  /**
   * Get current session
   */
  async getSession(): Promise<AuthSession | null> {
    const session = getStoredSession();
    if (!session) return null;

    // Check if session is expired
    const now = Math.floor(Date.now() / 1000);
    if (session.expires_at < now) {
      // Session expired, try to refresh
      const refreshed = await this.refreshSession();
      return refreshed.session;
    }

    return session;
  },

  /**
   * Sign up with email and password
   */
  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Basic validation
    if (!credentials.email || !credentials.password) {
      return {
        user: null,
        session: null,
        error: createError('Email and password are required', 'invalid_credentials'),
      };
    }

    if (credentials.password.length < 8) {
      return {
        user: null,
        session: null,
        error: createError('Password must be at least 8 characters', 'weak_password'),
      };
    }

    // Create mock user
    const user: AuthUser = {
      id: `user-${Date.now()}`,
      email: credentials.email,
      email_verified: false, // Would need email verification in production
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {
        provider: 'email',
        providers: ['email'],
      },
      user_metadata: {
        name: credentials.name,
      },
    };

    const session = generateMockSession(user);
    saveAuth(user, session);

    return { user, session, error: null };
  },

  /**
   * Sign in with email and password
   */
  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // For prototype, accept any credentials and return mock user
    if (!credentials.email || !credentials.password) {
      return {
        user: null,
        session: null,
        error: createError('Email and password are required', 'invalid_credentials'),
      };
    }

    const user: AuthUser = {
      ...MOCK_USER,
      email: credentials.email,
      last_sign_in_at: new Date().toISOString(),
    };

    const session = generateMockSession(user);
    saveAuth(user, session);

    return { user, session, error: null };
  },

  /**
   * Sign out
   */
  async signOut(): Promise<SignOutResponse> {
    await new Promise(resolve => setTimeout(resolve, 200));
    clearAuth();
    return { error: null };
  },

  /**
   * Sign in with Apple (stub for iOS)
   */
  async signInWithApple(): Promise<AuthResponse> {
    // This would use expo-apple-authentication in the native app
    console.warn('Apple Sign-In is only available in the native iOS app');
    return {
      user: null,
      session: null,
      error: createError('Apple Sign-In not available in web prototype', 'apple_signin_failed'),
    };
  },

  /**
   * Request password reset
   */
  async resetPassword(email: string): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!email) {
      return {
        user: null,
        session: null,
        error: createError('Email is required', 'invalid_credentials'),
      };
    }

    // In production, this would send a reset email via Supabase
    console.log(`Password reset email would be sent to: ${email}`);

    return { user: null, session: null, error: null };
  },

  /**
   * Update password
   */
  async updatePassword(newPassword: string): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (newPassword.length < 8) {
      return {
        user: null,
        session: null,
        error: createError('Password must be at least 8 characters', 'weak_password'),
      };
    }

    const user = getStoredUser();
    if (!user) {
      return {
        user: null,
        session: null,
        error: createError('Not authenticated', 'user_not_found'),
      };
    }

    // In production, this would update via Supabase
    console.log('Password updated successfully');

    return { user, session: getStoredSession(), error: null };
  },

  /**
   * Refresh session
   */
  async refreshSession(): Promise<AuthResponse> {
    const user = getStoredUser();
    if (!user) {
      return {
        user: null,
        session: null,
        error: createError('No active session', 'expired_token'),
      };
    }

    const newSession = generateMockSession(user);
    saveAuth(user, newSession);

    return { user, session: newSession, error: null };
  },

  /**
   * Get access token for API calls
   */
  async getAccessToken(): Promise<string | null> {
    const session = await this.getSession();
    return session?.access_token || null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return getStoredUser() !== null;
  },

  /**
   * Listen for auth state changes (stub for Supabase compatibility)
   */
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    // For prototype, just call with current user
    const user = getStoredUser();
    callback(user);

    // Return unsubscribe function (no-op for prototype)
    return () => {};
  },
};
