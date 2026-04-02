/**
 * Authentication Types
 *
 * Types for authentication state and operations.
 * Designed to work with Supabase Auth in production.
 */

// ===========================================
// USER TYPES
// ===========================================

export interface AuthUser {
  id: string; // UUID from Supabase auth.users
  email: string;
  email_verified: boolean;
  phone?: string;
  phone_verified?: boolean;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  app_metadata: AppMetadata;
  user_metadata: UserMetadata;
}

export interface AppMetadata {
  provider?: string; // 'email', 'apple', 'google'
  providers?: string[];
}

export interface UserMetadata {
  name?: string;
  avatar_url?: string;
  full_name?: string; // From Apple Sign-In
}

// ===========================================
// SESSION TYPES
// ===========================================

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number; // seconds
  expires_at: number; // Unix timestamp
  token_type: 'bearer';
  user: AuthUser;
}

// ===========================================
// AUTH STATE
// ===========================================

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  session: AuthSession | null;
  error: AuthError | null;
}

// ===========================================
// AUTH ERRORS
// ===========================================

export interface AuthError {
  message: string;
  code: AuthErrorCode;
}

export type AuthErrorCode =
  | 'invalid_credentials'
  | 'email_not_verified'
  | 'user_not_found'
  | 'email_taken'
  | 'weak_password'
  | 'rate_limit'
  | 'network_error'
  | 'expired_token'
  | 'invalid_token'
  | 'apple_signin_failed'
  | 'unknown';

// ===========================================
// AUTH OPERATIONS
// ===========================================

export interface SignUpCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ===========================================
// AUTH RESPONSES
// ===========================================

export interface AuthResponse {
  user: AuthUser | null;
  session: AuthSession | null;
  error: AuthError | null;
}

export interface SignOutResponse {
  error: AuthError | null;
}

// ===========================================
// OAUTH PROVIDERS
// ===========================================

export type OAuthProvider = 'apple' | 'google';

export interface OAuthSignInOptions {
  provider: OAuthProvider;
  redirectTo?: string;
  scopes?: string[];
}

// ===========================================
// AUTH CONTEXT TYPE
// ===========================================

export interface AuthContextType {
  // State
  user: AuthUser | null;
  session: AuthSession | null;
  status: AuthStatus;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Email/Password Auth
  signUp: (credentials: SignUpCredentials) => Promise<AuthResponse>;
  signIn: (credentials: SignInCredentials) => Promise<AuthResponse>;
  signOut: () => Promise<SignOutResponse>;

  // Password Management
  resetPassword: (email: string) => Promise<AuthResponse>;
  updatePassword: (request: UpdatePasswordRequest) => Promise<AuthResponse>;

  // OAuth
  signInWithApple: () => Promise<AuthResponse>;
  signInWithGoogle?: () => Promise<AuthResponse>;

  // Session Management
  refreshSession: () => Promise<AuthResponse>;
  getAccessToken: () => Promise<string | null>;
}
