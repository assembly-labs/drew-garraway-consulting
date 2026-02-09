/**
 * Onboarding Flow Component
 *
 * 4-screen onboarding flow:
 * 1. Welcome - Set the tone
 * 2. About You - Name, Belt, Stripes (all mandatory)
 * 3. Your Training - Gym (mandatory), Frequency (mandatory), Goals/Experience (optional)
 * 4. Get Started - Voice/Text preference (mandatory), CTAs
 *
 * Design principles:
 * - 6 mandatory fields
 * - 2 optional fields (captured via progressive profiling if skipped)
 * - Large touch targets (56-80px for mandatory actions)
 * - Can complete in <60 seconds (mandatory only)
 */

import { useState } from 'react';
import { Icons } from '../ui/Icons';
import { GymPicker } from '../ui/GymPicker';
import {
  type BeltLevel,
  type TrainingGoal,
  type ExperienceLevel,
  type OnboardingData,
} from '../../context/UserProfileContext';
import { type GymSelection } from '../../data/gyms';

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
  onStartLogging: () => void;
}

type OnboardingStep = 'welcome' | 'about' | 'training' | 'start';

const BELT_OPTIONS: { value: BeltLevel; label: string; color: string }[] = [
  { value: 'white', label: 'White', color: '#FFFFFF' },
  { value: 'blue', label: 'Blue', color: '#0033A0' },
  { value: 'purple', label: 'Purple', color: '#4B0082' },
  { value: 'brown', label: 'Brown', color: '#8B4513' },
  { value: 'black', label: 'Black', color: '#000000' },
];

const STRIPE_OPTIONS = [0, 1, 2, 3, 4];

const FREQUENCY_OPTIONS = [
  { value: 2, label: '1-2x', sublabel: '/week' },
  { value: 4, label: '3-4x', sublabel: '/week' },
  { value: 5, label: '5+', sublabel: '/week' },
];

const GOAL_OPTIONS: { value: TrainingGoal; label: string }[] = [
  { value: 'competition', label: 'Compete' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'hobby', label: 'Hobby' },
  { value: 'mental', label: 'Mental' },
];

const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'beginner', label: '< 1yr' },
  { value: 'intermediate', label: '1-3y' },
  { value: 'experienced', label: '3y+' },
];

export function Onboarding({ onComplete, onStartLogging }: OnboardingProps) {
  const [step, setStep] = useState<OnboardingStep>('welcome');

  // Mandatory fields
  const [name, setName] = useState('');
  const [belt, setBelt] = useState<BeltLevel | null>(null);
  const [stripes, setStripes] = useState<number | null>(null);
  const [gym, setGym] = useState<GymSelection | null>(null);
  const [targetFrequency, setTargetFrequency] = useState<number | null>(null);
  const [loggingPreference, setLoggingPreference] = useState<'voice' | 'text'>('voice'); // Pre-selected per approved design

  // Optional fields
  const [trainingGoals, setTrainingGoals] = useState<TrainingGoal[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);

  // Validation
  const canProceedFromAbout = name.trim().length > 0 && belt !== null && stripes !== null;
  const canProceedFromTraining = gym !== null && targetFrequency !== null;

  // Handle finish
  const handleFinish = (startLogging: boolean) => {
    onComplete({
      name: name.trim(),
      belt: belt!,
      stripes: stripes!,
      gym: gym!,
      targetFrequency: targetFrequency!,
      loggingPreference,
      trainingGoals: trainingGoals.length > 0 ? trainingGoals : undefined,
      experienceLevel: experienceLevel || undefined,
    });
    if (startLogging) {
      onStartLogging();
    }
  };

  // Toggle training goal (multi-select)
  const toggleGoal = (goal: TrainingGoal) => {
    setTrainingGoals(prev =>
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  // Common styles
  const sectionLabelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--color-gray-400)',
    marginBottom: 'var(--space-md)',
  };

  // Step counter component
  const StepCounter = ({ current, total }: { current: number; total: number }) => (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '12px',
      fontWeight: 600,
      color: 'var(--color-gray-500)',
      letterSpacing: '0.05em',
      marginBottom: 'var(--space-lg)',
    }}>
      <span style={{ color: 'var(--color-accent)' }}>{current}</span> of {total}
    </div>
  );

  // Screen 1: Welcome
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
          marginBottom: 'var(--space-xs)',
        }}>
          TOMO
        </div>

        <div style={{
          fontSize: 'var(--text-2xl)',
          color: 'var(--color-accent)',
          marginBottom: 'var(--space-lg)',
        }}>
          友
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
          onClick={() => setStep('about')}
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
            minWidth: 200,
          }}
        >
          Get Started
        </button>
      </div>
    );
  }

  // Screen 2: About You
  if (step === 'about') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-primary)',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--space-xl)',
        paddingTop: 'max(var(--space-2xl), env(safe-area-inset-top))',
      }}>
        {/* Step Counter */}
        <StepCounter current={1} total={3} />

        {/* Header */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 700,
            color: 'var(--color-white)',
          }}>
            About You
          </div>
        </div>

        {/* Name Input */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <label style={sectionLabelStyle}>
            What should we call you?
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First name"
            autoFocus
            maxLength={30}
            style={{
              width: '100%',
              padding: 'var(--space-md) var(--space-lg)',
              fontSize: 'var(--text-lg)',
              fontWeight: 500,
              backgroundColor: 'var(--color-gray-900)',
              border: '2px solid var(--color-gray-700)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-white)',
              outline: 'none',
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
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <label style={sectionLabelStyle}>
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
                  width: 56,
                  height: 72,
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
                }}
              >
                <div style={{
                  width: 36,
                  height: 10,
                  backgroundColor: option.color,
                  border: option.value === 'white' ? '1px solid #666' : 'none',
                  borderRadius: 2,
                }} />
                <span style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 500,
                  color: belt === option.value
                    ? 'var(--color-accent)'
                    : 'var(--color-gray-400)',
                }}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Stripes Selector */}
        <div style={{ marginBottom: 'var(--space-xl)', flex: 1 }}>
          <label style={sectionLabelStyle}>
            How many stripes?
          </label>
          <div style={{
            display: 'flex',
            gap: 'var(--space-sm)',
            justifyContent: 'center',
          }}>
            {STRIPE_OPTIONS.map((count) => (
              <button
                key={count}
                onClick={() => setStripes(count)}
                style={{
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: stripes === count
                    ? 'var(--color-gray-800)'
                    : 'transparent',
                  border: stripes === count
                    ? '3px solid var(--color-accent)'
                    : '2px solid var(--color-gray-700)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 600,
                  color: stripes === count
                    ? 'var(--color-accent)'
                    : 'var(--color-gray-400)',
                }}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div style={{
          paddingBottom: 'max(var(--space-lg), env(safe-area-inset-bottom))',
        }}>
          <button
            onClick={() => setStep('training')}
            disabled={!canProceedFromAbout}
            style={{
              width: '100%',
              padding: 'var(--space-lg)',
              backgroundColor: canProceedFromAbout
                ? 'var(--color-accent)'
                : 'var(--color-gray-700)',
              color: canProceedFromAbout
                ? 'var(--color-primary)'
                : 'var(--color-gray-500)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wide)',
              cursor: canProceedFromAbout ? 'pointer' : 'not-allowed',
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Screen 3: Your Training
  if (step === 'training') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-primary)',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--space-xl)',
        paddingTop: 'max(var(--space-2xl), env(safe-area-inset-top))',
      }}>
        {/* Header with Back Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-xl)',
        }}>
          <button
            onClick={() => setStep('about')}
            style={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-gray-400)',
              marginLeft: -8,
            }}
            aria-label="Back"
          >
            <Icons.ChevronLeft size={24} />
          </button>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 700,
            color: 'var(--color-white)',
          }}>
            Your Training
          </div>
        </div>

        {/* Step Counter */}
        <StepCounter current={2} total={3} />

        {/* Gym Picker - Mandatory */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <label style={sectionLabelStyle}>
            Where do you train? *
          </label>
          <GymPicker value={gym} onChange={setGym} />
        </div>

        {/* Frequency - Mandatory */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <label style={sectionLabelStyle}>
            How often do you want to train? *
          </label>
          <div style={{
            display: 'flex',
            gap: 'var(--space-sm)',
          }}>
            {FREQUENCY_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setTargetFrequency(option.value)}
                style={{
                  flex: 1,
                  padding: 'var(--space-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  backgroundColor: targetFrequency === option.value
                    ? 'var(--color-gray-800)'
                    : 'transparent',
                  border: targetFrequency === option.value
                    ? '3px solid var(--color-accent)'
                    : '2px solid var(--color-gray-700)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                }}
              >
                <span style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 700,
                  color: targetFrequency === option.value
                    ? 'var(--color-accent)'
                    : 'var(--color-white)',
                }}>
                  {option.label}
                </span>
                <span style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-gray-500)',
                }}>
                  {option.sublabel}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Optional Section Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-lg)',
        }}>
          <div style={{
            flex: 1,
            height: 1,
            backgroundColor: 'var(--color-gray-700)',
          }} />
          <span style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--color-gray-500)',
          }}>
            Tell us more (optional)
          </span>
          <div style={{
            flex: 1,
            height: 1,
            backgroundColor: 'var(--color-gray-700)',
          }} />
        </div>

        {/* Training Goals - Optional */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{ ...sectionLabelStyle, marginBottom: 'var(--space-sm)' }}>
            Why do you train?
          </label>
          <div style={{
            display: 'flex',
            gap: 'var(--space-sm)',
            flexWrap: 'wrap',
          }}>
            {GOAL_OPTIONS.map((option) => {
              const isSelected = trainingGoals.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => toggleGoal(option.value)}
                  style={{
                    padding: 'var(--space-sm) var(--space-md)',
                    backgroundColor: isSelected
                      ? 'var(--color-gray-800)'
                      : 'transparent',
                    border: isSelected
                      ? '2px solid var(--color-accent)'
                      : '1px solid var(--color-gray-700)',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    color: isSelected
                      ? 'var(--color-accent)'
                      : 'var(--color-gray-400)',
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Experience Level - Optional */}
        <div style={{ marginBottom: 'var(--space-xl)', flex: 1 }}>
          <label style={{ ...sectionLabelStyle, marginBottom: 'var(--space-sm)' }}>
            How long have you trained?
          </label>
          <div style={{
            display: 'flex',
            gap: 'var(--space-sm)',
          }}>
            {EXPERIENCE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setExperienceLevel(
                  experienceLevel === option.value ? null : option.value
                )}
                style={{
                  flex: 1,
                  padding: 'var(--space-sm) var(--space-xs)',
                  backgroundColor: experienceLevel === option.value
                    ? 'var(--color-gray-800)'
                    : 'transparent',
                  border: experienceLevel === option.value
                    ? '2px solid var(--color-accent)'
                    : '1px solid var(--color-gray-700)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  color: experienceLevel === option.value
                    ? 'var(--color-accent)'
                    : 'var(--color-gray-400)',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div style={{
          paddingBottom: 'max(var(--space-lg), env(safe-area-inset-bottom))',
        }}>
          <button
            onClick={() => setStep('start')}
            disabled={!canProceedFromTraining}
            style={{
              width: '100%',
              padding: 'var(--space-lg)',
              backgroundColor: canProceedFromTraining
                ? 'var(--color-accent)'
                : 'var(--color-gray-700)',
              color: canProceedFromTraining
                ? 'var(--color-primary)'
                : 'var(--color-gray-500)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wide)',
              cursor: canProceedFromTraining ? 'pointer' : 'not-allowed',
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Screen 4: Get Started
  if (step === 'start') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-primary)',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--space-xl)',
        paddingTop: 'max(var(--space-2xl), env(safe-area-inset-top))',
      }}>
        {/* Header with Back Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-xl)',
        }}>
          <button
            onClick={() => setStep('training')}
            style={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-gray-400)',
              marginLeft: -8,
            }}
            aria-label="Back"
          >
            <Icons.ChevronLeft size={24} />
          </button>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 700,
            color: 'var(--color-white)',
          }}>
            Almost there!
          </div>
        </div>

        {/* Step Counter */}
        <StepCounter current={3} total={3} />

        {/* Logging Preference Label */}
        <label style={sectionLabelStyle}>
          How do you want to log sessions?
        </label>

        {/* Voice Option */}
        <button
          onClick={() => setLoggingPreference('voice')}
          style={{
            width: '100%',
            padding: 'var(--space-lg)',
            marginBottom: 'var(--space-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-md)',
            backgroundColor: loggingPreference === 'voice'
              ? 'var(--color-gray-800)'
              : 'var(--color-gray-900)',
            border: loggingPreference === 'voice'
              ? '3px solid var(--color-accent)'
              : '2px solid var(--color-gray-700)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-gray-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icons.Mic size={24} color={loggingPreference === 'voice' ? 'var(--color-accent)' : 'var(--color-gray-400)'} />
          </div>
          <div>
            <div style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 600,
              color: loggingPreference === 'voice'
                ? 'var(--color-accent)'
                : 'var(--color-white)',
              marginBottom: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
            }}>
              Voice
              <span style={{
                display: 'inline-block',
                padding: '2px 8px',
                backgroundColor: 'rgba(245, 166, 35, 0.15)',
                border: '1px solid var(--color-accent)',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-accent)',
              }}>
                Recommended
              </span>
            </div>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-gray-500)',
            }}>
              Just talk after class. 60 seconds, hands-free.
            </div>
          </div>
        </button>

        {/* Text Option */}
        <button
          onClick={() => setLoggingPreference('text')}
          style={{
            width: '100%',
            padding: 'var(--space-lg)',
            marginBottom: 'var(--space-xl)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-md)',
            backgroundColor: loggingPreference === 'text'
              ? 'var(--color-gray-800)'
              : 'var(--color-gray-900)',
            border: loggingPreference === 'text'
              ? '3px solid var(--color-accent)'
              : '2px solid var(--color-gray-700)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-gray-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icons.Edit size={24} color={loggingPreference === 'text' ? 'var(--color-accent)' : 'var(--color-gray-400)'} />
          </div>
          <div>
            <div style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 600,
              color: loggingPreference === 'text'
                ? 'var(--color-accent)'
                : 'var(--color-white)',
              marginBottom: 2,
            }}>
              Text
            </div>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-gray-500)',
            }}>
              Type your notes. Traditional journaling.
            </div>
          </div>
        </button>

        {/* Settings Note */}
        <p style={{
          textAlign: 'center',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--color-gray-500)',
          marginTop: 'var(--space-md)',
          marginBottom: 'var(--space-lg)',
        }}>
          You can change this later in Settings
        </p>

        {/* Success Section - Always visible since Voice is pre-selected */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}>
          {/* Checkmark */}
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--space-lg)',
          }}>
            <Icons.Check size={32} color="white" />
          </div>

          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            color: 'var(--color-white)',
            marginBottom: 'var(--space-sm)',
          }}>
            You're all set{name ? `, ${name}` : ''}!
          </div>

          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-gray-400)',
            marginBottom: 'var(--space-xl)',
            maxWidth: 280,
          }}>
            Your journey is now being tracked.
          </p>
        </div>

        {/* CTAs */}
        <div style={{
          paddingBottom: 'max(var(--space-lg), env(safe-area-inset-bottom))',
        }}>
          <button
            onClick={() => handleFinish(true)}
            style={{
              width: '100%',
              padding: 'var(--space-lg)',
              marginBottom: 'var(--space-md)',
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
            Log Your First Session
          </button>

          <button
            onClick={() => handleFinish(false)}
            style={{
              width: '100%',
              padding: 'var(--space-md)',
              backgroundColor: 'transparent',
              color: 'var(--color-gray-400)',
              border: 'none',
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
