/**
 * LoginScreen Component
 *
 * 4-screen auth flow:
 * 1. Login - Email/password + Apple/Google SSO
 * 2. Signup - Create account
 * 3. Forgot Password - Reset email
 * 4. Email Verification - Confirmation screen
 *
 * Uses authService for mock authentication (Supabase-ready).
 */

import { useState } from 'react';
import { authService } from '../../services/auth';
import { useToast } from '../ui/Toast';

type AuthScreen = 'login' | 'signup' | 'forgot' | 'verification';

interface LoginScreenProps {
  onAuthenticated: () => void;
}

export function LoginScreen({ onAuthenticated }: LoginScreenProps) {
  const { showToast } = useToast();
  const [screen, setScreen] = useState<AuthScreen>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const clearForm = () => {
    setError('');
    setShowPassword(false);
  };

  const handleSignIn = async () => {
    setError('');
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    setIsLoading(true);
    try {
      const result = await authService.signIn({ email, password });
      if (result.error) {
        setError(result.error.message);
      } else {
        onAuthenticated();
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    setError('');
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setIsLoading(true);
    try {
      const result = await authService.signUp({ email, password, name });
      if (result.error) {
        setError(result.error.message);
      } else {
        setScreen('verification');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    if (!email) {
      setError('Email is required');
      return;
    }
    setIsLoading(true);
    try {
      const result = await authService.resetPassword(email);
      if (result.error) {
        setError(result.error.message);
      } else {
        showToast({ message: 'Reset link sent to your email', type: 'success' });
        setScreen('login');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSO = async () => {
    showToast({ message: 'Available in iOS app', type: 'info' });
  };

  // Logo block used across screens
  const Logo = ({ small }: { small?: boolean }) => (
    <div style={{
      textAlign: 'center',
      marginBottom: small ? 'var(--space-lg)' : 'var(--space-2xl)',
    }}>
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: small ? '36px' : '48px',
        fontWeight: 800,
        color: 'var(--color-white)',
        letterSpacing: '0.05em',
      }}>
        TOMO
      </div>
      <div style={{
        fontSize: small ? '16px' : '20px',
        color: 'var(--color-accent)',
        marginTop: 'var(--space-xs)',
      }}>
        友
      </div>
      <div style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--color-gray-500)',
        marginTop: 'var(--space-sm)',
        fontWeight: 500,
      }}>
        Your BJJ Training Journal
      </div>
    </div>
  );

  // Apple icon SVG
  const AppleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  );

  // Google icon SVG
  const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  // Input field helper
  const InputField = ({
    type = 'text',
    placeholder,
    value,
    onChange,
    autoComplete,
    rightElement,
  }: {
    type?: string;
    placeholder: string;
    value: string;
    onChange: (val: string) => void;
    autoComplete?: string;
    rightElement?: React.ReactNode;
  }) => (
    <div style={{ position: 'relative' }}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        style={{
          width: '100%',
          height: 56,
          padding: '0 var(--space-lg)',
          paddingRight: rightElement ? '52px' : 'var(--space-lg)',
          backgroundColor: 'var(--color-gray-800)',
          border: '2px solid var(--color-gray-700)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-white)',
          fontSize: 'var(--text-base)',
          fontWeight: 500,
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-accent)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-gray-700)';
        }}
      />
      {rightElement && (
        <div style={{
          position: 'absolute',
          right: 12,
          top: '50%',
          transform: 'translateY(-50%)',
        }}>
          {rightElement}
        </div>
      )}
    </div>
  );

  // Render login screen
  if (screen === 'login') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-primary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'var(--space-2xl) var(--space-lg)',
      }}>
        <Logo />

        {/* SSO Buttons */}
        <button
          onClick={handleSSO}
          style={{
            width: '100%',
            height: 52,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-sm)',
            backgroundColor: '#fff',
            color: '#000',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: 'var(--text-base)',
            cursor: 'pointer',
            marginBottom: 'var(--space-sm)',
          }}
        >
          <AppleIcon />
          Sign in with Apple
        </button>

        <button
          onClick={handleSSO}
          style={{
            width: '100%',
            height: 52,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-sm)',
            backgroundColor: 'transparent',
            color: 'var(--color-white)',
            border: '1px solid var(--color-gray-600)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: 'var(--text-base)',
            cursor: 'pointer',
            marginBottom: 'var(--space-lg)',
          }}
        >
          <GoogleIcon />
          Sign in with Google
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-lg)',
        }}>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--color-gray-700)' }} />
          <span style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>or</span>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--color-gray-700)' }} />
        </div>

        {/* Email / Password */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
          />
          <InputField
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            rightElement={
              <button
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-gray-400)',
                  cursor: 'pointer',
                  padding: 4,
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            }
          />
        </div>

        {/* Error */}
        {error && (
          <p style={{ color: 'var(--color-negative)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-sm)', fontWeight: 500 }}>
            {error}
          </p>
        )}

        {/* Sign In Button */}
        <button
          onClick={handleSignIn}
          disabled={isLoading}
          style={{
            width: '100%',
            height: 52,
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-primary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: 'var(--text-base)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginTop: 'var(--space-md)',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        {/* Links */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
          <button
            onClick={() => { clearForm(); setScreen('forgot'); }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-gray-400)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Forgot Password?
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-md)' }}>
          <span style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>
            Don't have an account?{' '}
          </span>
          <button
            onClick={() => { clearForm(); setScreen('signup'); }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-accent)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Legal */}
        <p style={{
          textAlign: 'center',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-gray-600)',
          marginTop: 'var(--space-2xl)',
          lineHeight: 1.6,
        }}>
          By continuing, you agree to our{' '}
          <span style={{ color: 'var(--color-gray-400)', textDecoration: 'underline', cursor: 'pointer' }}>
            Privacy Policy
          </span>
          {' '}and{' '}
          <span style={{ color: 'var(--color-gray-400)', textDecoration: 'underline', cursor: 'pointer' }}>
            Terms of Service
          </span>
        </p>
      </div>
    );
  }

  // Render signup screen
  if (screen === 'signup') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-primary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'var(--space-2xl) var(--space-lg)',
      }}>
        <Logo />

        {/* SSO Buttons */}
        <button
          onClick={handleSSO}
          style={{
            width: '100%',
            height: 52,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-sm)',
            backgroundColor: '#fff',
            color: '#000',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: 'var(--text-base)',
            cursor: 'pointer',
            marginBottom: 'var(--space-sm)',
          }}
        >
          <AppleIcon />
          Sign up with Apple
        </button>

        <button
          onClick={handleSSO}
          style={{
            width: '100%',
            height: 52,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-sm)',
            backgroundColor: 'transparent',
            color: 'var(--color-white)',
            border: '1px solid var(--color-gray-600)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: 'var(--text-base)',
            cursor: 'pointer',
            marginBottom: 'var(--space-lg)',
          }}
        >
          <GoogleIcon />
          Sign up with Google
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-lg)',
        }}>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--color-gray-700)' }} />
          <span style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>or</span>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--color-gray-700)' }} />
        </div>

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <InputField
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={setName}
            autoComplete="name"
          />
          <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
          />
          <InputField
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            rightElement={
              <button
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-gray-400)',
                  cursor: 'pointer',
                  padding: 4,
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            }
          />
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-gray-500)',
            marginTop: 'var(--space-xs)',
            fontWeight: 500,
          }}>
            Must be at least 8 characters
          </p>
        </div>

        {/* Error */}
        {error && (
          <p style={{ color: 'var(--color-negative)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-sm)', fontWeight: 500 }}>
            {error}
          </p>
        )}

        {/* Create Account Button */}
        <button
          onClick={handleSignUp}
          disabled={isLoading}
          style={{
            width: '100%',
            height: 52,
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-primary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: 'var(--text-base)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginTop: 'var(--space-md)',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>

        {/* Link */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
          <span style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>
            Already have an account?{' '}
          </span>
          <button
            onClick={() => { clearForm(); setScreen('login'); }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-accent)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Render forgot password screen
  if (screen === 'forgot') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-primary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'var(--space-2xl) var(--space-lg)',
      }}>
        <Logo small />

        {/* Back button */}
        <button
          onClick={() => { clearForm(); setScreen('login'); }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-gray-400)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            padding: 0,
            marginBottom: 'var(--space-lg)',
            fontWeight: 500,
            fontSize: 'var(--text-sm)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>

        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-xl)',
          fontWeight: 700,
          color: 'var(--color-white)',
          marginBottom: 'var(--space-sm)',
        }}>
          Reset Password
        </h2>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-gray-400)',
          marginBottom: 'var(--space-lg)',
          fontWeight: 500,
        }}>
          Enter your email and we'll send you a link to reset your password.
        </p>

        <InputField
          type="email"
          placeholder="Email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />

        {/* Error */}
        {error && (
          <p style={{ color: 'var(--color-negative)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-sm)', fontWeight: 500 }}>
            {error}
          </p>
        )}

        <button
          onClick={handleForgotPassword}
          disabled={isLoading}
          style={{
            width: '100%',
            height: 52,
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-primary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: 'var(--text-base)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginTop: 'var(--space-md)',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </div>
    );
  }

  // Render verification screen
  if (screen === 'verification') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-2xl) var(--space-lg)',
        textAlign: 'center',
      }}>
        {/* Green checkmark icon */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'rgba(34, 197, 94, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-xl)',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-positive)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-xl)',
          fontWeight: 700,
          color: 'var(--color-white)',
          marginBottom: 'var(--space-sm)',
        }}>
          Check Your Email
        </h2>

        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-gray-400)',
          marginBottom: 'var(--space-lg)',
          fontWeight: 500,
          maxWidth: 300,
        }}>
          We sent a verification link to
        </p>
        <p style={{
          fontSize: 'var(--text-base)',
          color: 'var(--color-white)',
          fontWeight: 600,
          marginBottom: 'var(--space-xl)',
        }}>
          {email}
        </p>

        {/* For the prototype, allow continuing without verification */}
        <button
          onClick={onAuthenticated}
          style={{
            width: '100%',
            maxWidth: 300,
            height: 52,
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-primary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: 'var(--text-base)',
            cursor: 'pointer',
            marginBottom: 'var(--space-lg)',
          }}
        >
          Continue to App
        </button>

        <button
          onClick={() => showToast({ message: 'Verification email resent', type: 'info' })}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-gray-400)',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Didn't receive it? <span style={{ color: 'var(--color-accent)' }}>Resend</span>
        </button>

        <button
          onClick={() => { clearForm(); setScreen('login'); }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-gray-400)',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            fontWeight: 500,
            marginTop: 'var(--space-md)',
          }}
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return null;
}

export default LoginScreen;
