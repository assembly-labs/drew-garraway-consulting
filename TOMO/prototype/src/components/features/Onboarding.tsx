/**
 * Onboarding Flow Component
 *
 * Minimal critical-path onboarding:
 * 1. Name + Belt (required, cannot skip)
 * 2. Mic permission (contextual, can skip)
 * 3. First action (log now or explore)
 *
 * Design principles:
 * - 2 required fields only
 * - Large touch targets (80px belts)
 * - Can complete in <30 seconds
 * - Respects exhausted user state if coming right after training
 */

import { useState } from 'react';
import { type BeltLevel, type LoggingPreference } from '../../context/UserProfileContext';

interface OnboardingProps {
  onComplete: (name: string, belt: BeltLevel, loggingPref: LoggingPreference) => void;
  onStartLogging: () => void;
}

type OnboardingStep = 'welcome' | 'identity' | 'mic' | 'ready';

const BELT_OPTIONS: { value: BeltLevel; label: string; color: string; borderColor: string }[] = [
  { value: 'white', label: 'White', color: '#FFFFFF', borderColor: '#D4D4D4' },
  { value: 'blue', label: 'Blue', color: '#0033A0', borderColor: '#0033A0' },
  { value: 'purple', label: 'Purple', color: '#4B0082', borderColor: '#4B0082' },
  { value: 'brown', label: 'Brown', color: '#8B4513', borderColor: '#8B4513' },
  { value: 'black', label: 'Black', color: '#000000', borderColor: '#333333' },
];

export function Onboarding({ onComplete, onStartLogging }: OnboardingProps) {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [name, setName] = useState('');
  const [belt, setBelt] = useState<BeltLevel | null>(null);
  const [loggingPref, setLoggingPref] = useState<LoggingPreference>('undecided');

  const canProceedFromIdentity = name.trim().length > 0 && belt !== null;

  const handleIdentitySubmit = () => {
    if (canProceedFromIdentity) {
      setStep('mic');
    }
  };

  const handleMicChoice = (pref: LoggingPreference) => {
    setLoggingPref(pref);
    setStep('ready');
  };

  const handleFinish = (startLogging: boolean) => {
    onComplete(name.trim(), belt!, loggingPref);
    if (startLogging) {
      onStartLogging();
    }
  };

  // Welcome screen
  if (step === 'welcome') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-primary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'var(--space-xl)',
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-3xl)',
          fontWeight: 700,
          color: 'var(--color-white)',
          letterSpacing: 'var(--tracking-wider)',
          marginBottom: 'var(--space-md)',
        }}>
          ALLY
        </div>

        <p style={{
          fontSize: 'var(--text-lg)',
          color: 'var(--color-gray-400)',
          marginBottom: 'var(--space-xl)',
          maxWidth: 300,
          lineHeight: 'var(--leading-relaxed)',
        }}>
          Track your journey.<br />
          See your progress.<br />
          Know what's next.
        </p>

        <div style={{
          width: 80,
          height: 4,
          backgroundColor: 'var(--color-accent)',
          borderRadius: 'var(--radius-full)',
          marginBottom: 'var(--space-2xl)',
        }} />

        <button
          onClick={() => setStep('identity')}
          style={{
            padding: 'var(--space-lg) var(--space-2xl)',
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-primary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            cursor: 'pointer',
            transition: 'transform 0.1s',
            minWidth: 200,
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.98)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Get Started
        </button>
      </div>
    );
  }

  // Identity screen (Name + Belt - REQUIRED)
  if (step === 'identity') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-primary)',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--space-xl)',
        paddingTop: 'max(var(--space-2xl), env(safe-area-inset-top))',
      }}>
        {/* Header */}
        <div style={{
          marginBottom: 'var(--space-2xl)',
        }}>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            color: 'var(--color-white)',
            marginBottom: 'var(--space-xs)',
          }}>
            Let's get you started.
          </div>
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-gray-400)',
          }}>
            Just two quick questions.
          </p>
        </div>

        {/* Name Input */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-widest)',
            color: 'var(--color-gray-400)',
            marginBottom: 'var(--space-sm)',
          }}>
            What should we call you?
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First name"
            autoFocus
            style={{
              width: '100%',
              padding: 'var(--space-lg)',
              fontSize: 'var(--text-xl)',
              fontWeight: 600,
              backgroundColor: 'var(--color-gray-900)',
              border: '2px solid var(--color-gray-700)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-white)',
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
        </div>

        {/* Belt Selector */}
        <div style={{ marginBottom: 'var(--space-xl)', flex: 1 }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-widest)',
            color: 'var(--color-gray-400)',
            marginBottom: 'var(--space-md)',
          }}>
            What's your current belt?
          </label>
          <div style={{
            display: 'flex',
            gap: 'var(--space-sm)',
            justifyContent: 'center',
          }}>
            {BELT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setBelt(option.value)}
                style={{
                  width: 64,
                  height: 80,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-xs)',
                  backgroundColor: belt === option.value
                    ? 'var(--color-gray-800)'
                    : 'transparent',
                  border: belt === option.value
                    ? '3px solid var(--color-accent)'
                    : '2px solid var(--color-gray-700)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {/* Belt visual */}
                <div style={{
                  width: 40,
                  height: 12,
                  backgroundColor: option.color,
                  border: option.value === 'white' ? '1px solid #999' : 'none',
                  borderRadius: 2,
                  boxShadow: belt === option.value
                    ? '0 0 8px rgba(252, 211, 77, 0.5)'
                    : 'none',
                }} />
                <span style={{
                  fontSize: 'var(--text-xs)',
                  color: belt === option.value
                    ? 'var(--color-accent)'
                    : 'var(--color-gray-400)',
                  fontWeight: belt === option.value ? 600 : 500,
                }}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div style={{
          paddingBottom: 'max(var(--space-lg), env(safe-area-inset-bottom))',
        }}>
          <button
            onClick={handleIdentitySubmit}
            disabled={!canProceedFromIdentity}
            style={{
              width: '100%',
              padding: 'var(--space-lg)',
              backgroundColor: canProceedFromIdentity
                ? 'var(--color-accent)'
                : 'var(--color-gray-700)',
              color: canProceedFromIdentity
                ? 'var(--color-primary)'
                : 'var(--color-gray-500)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wide)',
              cursor: canProceedFromIdentity ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Mic permission screen (can skip)
  if (step === 'mic') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-primary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'var(--space-xl)',
        textAlign: 'center',
      }}>
        {/* Mic icon */}
        <div style={{
          width: 100,
          height: 100,
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-gray-900)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-xl)',
        }}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 700,
          color: 'var(--color-white)',
          marginBottom: 'var(--space-md)',
        }}>
          After class, just talk.
        </h2>

        <p style={{
          fontSize: 'var(--text-base)',
          color: 'var(--color-gray-400)',
          marginBottom: 'var(--space-sm)',
          maxWidth: 300,
          lineHeight: 'var(--leading-relaxed)',
        }}>
          Voice logging captures your session in 60 seconds.
          No typing with tired hands.
        </p>

        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-gray-500)',
          marginBottom: 'var(--space-2xl)',
          maxWidth: 280,
          fontStyle: 'italic',
        }}>
          "90 minute gi class, drilled armbars, got caught in a triangle..."
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
          width: '100%',
          maxWidth: 300,
        }}>
          <button
            onClick={() => handleMicChoice('voice')}
            style={{
              width: '100%',
              padding: 'var(--space-lg)',
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-primary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-base)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wide)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-sm)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            </svg>
            Enable Voice Logging
          </button>

          <button
            onClick={() => handleMicChoice('text')}
            style={{
              width: '100%',
              padding: 'var(--space-md)',
              backgroundColor: 'transparent',
              color: 'var(--color-gray-400)',
              border: '1px solid var(--color-gray-700)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-base)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-gray-500)';
              e.currentTarget.style.color = 'var(--color-gray-300)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-gray-700)';
              e.currentTarget.style.color = 'var(--color-gray-400)';
            }}
          >
            I'd rather type
          </button>
        </div>
      </div>
    );
  }

  // Ready screen
  if (step === 'ready') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-primary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'var(--space-xl)',
        textAlign: 'center',
      }}>
        {/* Success checkmark */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-xl)',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 700,
          color: 'var(--color-white)',
          marginBottom: 'var(--space-sm)',
        }}>
          You're all set, {name}.
        </h2>

        <p style={{
          fontSize: 'var(--text-base)',
          color: 'var(--color-gray-400)',
          marginBottom: 'var(--space-2xl)',
          maxWidth: 280,
          lineHeight: 'var(--leading-relaxed)',
        }}>
          Your journey is now being tracked.
          After your next session, come back and log it.
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
          width: '100%',
          maxWidth: 300,
        }}>
          <button
            onClick={() => handleFinish(true)}
            style={{
              width: '100%',
              padding: 'var(--space-lg)',
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-primary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-base)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wide)',
              cursor: 'pointer',
            }}
          >
            Just trained? Log it now
          </button>

          <button
            onClick={() => handleFinish(false)}
            style={{
              width: '100%',
              padding: 'var(--space-md)',
              backgroundColor: 'transparent',
              color: 'var(--color-gray-400)',
              border: '1px solid var(--color-gray-700)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-base)',
              cursor: 'pointer',
            }}
          >
            Explore the app first
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default Onboarding;
