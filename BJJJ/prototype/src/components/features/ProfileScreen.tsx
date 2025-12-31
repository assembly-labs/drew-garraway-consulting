/**
 * ProfileScreen Component
 *
 * User profile with:
 * - Profile completion tracker
 * - Editable profile fields
 * - Belt journey visualization
 * - Training stats
 * - Settings access
 */

import { useState } from 'react';
import { useUserProfile, PROFILE_QUESTIONS, type BeltLevel } from '../../context/UserProfileContext';
import { EditSheet } from './EditSheet';
import { ProfileNudge } from './ProfileNudge';
import { useBeltPersonalization } from '../../hooks';

interface ProfileScreenProps {
  onNavigate?: (view: string) => void;
}

const BELT_COLORS: Record<BeltLevel, string> = {
  white: '#FFFFFF',
  blue: '#0033A0',
  purple: '#4B0082',
  brown: '#8B4513',
  black: '#000000',
};

const BELT_LABELS: Record<BeltLevel, string> = {
  white: 'White',
  blue: 'Blue',
  purple: 'Purple',
  brown: 'Brown',
  black: 'Black',
};

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const {
    profile,
    getProfileCompletion,
    getMissingFields,
    getNextNudgeQuestion,
    skipQuestion,
    resetProfile,
  } = useUserProfile();

  const [activeQuestion, setActiveQuestion] = useState<typeof PROFILE_QUESTIONS[0] | null>(null);

  // Belt personalization for profile display
  const { profile: beltProfile } = useBeltPersonalization();

  const completion = getProfileCompletion();
  const missingFields = getMissingFields();
  const nextQuestion = getNextNudgeQuestion();

  // Calculate training time
  const getTrainingTime = () => {
    if (!profile.trainingStartDate) return null;
    const start = new Date(profile.trainingStartDate);
    const now = new Date();
    const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    return `${months} month${months !== 1 ? 's' : ''}`;
  };

  const trainingTime = getTrainingTime();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-lg)',
    }}>
      {/* Profile Header */}
      <div className="card" style={{ textAlign: 'center' }}>
        {/* Avatar placeholder */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-gray-800)',
          margin: '0 auto var(--space-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'var(--text-2xl)',
          fontWeight: 700,
          color: 'var(--color-white)',
        }}>
          {profile.name.charAt(0).toUpperCase()}
        </div>

        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-xl)',
          marginBottom: 'var(--space-xs)',
        }}>
          {profile.name.toUpperCase()}
        </h2>

        <div style={{
          fontSize: 'var(--text-base)',
          color: 'var(--color-gray-500)',
          marginBottom: 'var(--space-md)',
        }}>
          {trainingTime ? `Training for ${trainingTime}` : 'BJJ Practitioner'}
        </div>

        {/* Belt badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          padding: 'var(--space-sm) var(--space-md)',
          backgroundColor: 'var(--color-gray-800)',
          borderRadius: 'var(--radius-full)',
        }}>
          <div style={{
            width: 24,
            height: 8,
            backgroundColor: BELT_COLORS[profile.belt],
            border: profile.belt === 'white' ? '1px solid var(--color-gray-600)' : 'none',
            borderRadius: 2,
          }} />
          <span style={{ fontWeight: 600, color: 'var(--color-white)' }}>
            {BELT_LABELS[profile.belt]} Belt
            {profile.stripes !== null && profile.stripes > 0 && (
              <span style={{ color: 'var(--color-gray-400)' }}>
                {' '}• {profile.stripes} stripe{profile.stripes > 1 ? 's' : ''}
              </span>
            )}
          </span>
        </div>

        {/* Belt Stage Name */}
        <div style={{
          marginTop: 'var(--space-md)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-gold)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          {beltProfile.stageName}
        </div>

        {/* Journey Encouragement */}
        <p style={{
          marginTop: 'var(--space-sm)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-gray-400)',
          fontStyle: 'italic',
          maxWidth: '280px',
          margin: 'var(--space-sm) auto 0',
        }}>
          {beltProfile.mindsetShift}
        </p>
      </div>

      {/* Profile Completion Card */}
      {completion < 100 && (
        <div className="card" style={{
          backgroundColor: 'rgba(252, 211, 77, 0.08)',
          border: '1px solid rgba(252, 211, 77, 0.2)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-md)',
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-widest)',
                color: 'var(--color-white)',
              }}>
                Profile Completeness
              </div>
              <div style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-gray-500)',
              }}>
                {missingFields.length} item{missingFields.length !== 1 ? 's' : ''} remaining
              </div>
            </div>
            <div style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: 'var(--color-accent)',
            }}>
              {completion}%
            </div>
          </div>

          {/* Progress bar */}
          <div style={{
            height: 8,
            backgroundColor: 'var(--color-gray-800)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            marginBottom: 'var(--space-md)',
          }}>
            <div style={{
              height: '100%',
              width: `${completion}%`,
              backgroundColor: 'var(--color-accent)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.3s ease',
            }} />
          </div>

          {/* Complete profile button */}
          {nextQuestion && (
            <button
              onClick={() => setActiveQuestion(nextQuestion)}
              style={{
                width: '100%',
                padding: 'var(--space-md)',
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-primary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-sm)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Complete Profile
            </button>
          )}
        </div>
      )}

      {/* Training Stats */}
      <div className="card">
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-sm)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-widest)',
          color: 'var(--color-gray-500)',
          marginBottom: 'var(--space-md)',
        }}>
          Training Stats
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--space-md)',
        }}>
          <div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>
              {profile.sessionCount}
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
              Sessions Logged
            </div>
          </div>

          {profile.targetFrequency && (
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>
                {profile.targetFrequency}x
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
                Weekly Target
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Details */}
      <div className="card">
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-sm)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-widest)',
          color: 'var(--color-gray-500)',
          marginBottom: 'var(--space-md)',
        }}>
          Profile Details
        </h3>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)',
        }}>
          <ProfileField
            label="Name"
            value={profile.name}
            completed={true}
          />
          <ProfileField
            label="Current Belt"
            value={`${BELT_LABELS[profile.belt]}${profile.stripes ? ` (${profile.stripes} stripes)` : ''}`}
            completed={true}
          />
          <ProfileField
            label="Training Since"
            value={profile.trainingStartDate
              ? new Date(profile.trainingStartDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              : null}
            completed={!!profile.trainingStartDate}
            onAdd={() => {
              const q = PROFILE_QUESTIONS.find(q => q.id === 'trainingStartDate');
              if (q) setActiveQuestion(q);
            }}
          />
          <ProfileField
            label="Gym"
            value={profile.gymName}
            completed={!!profile.gymName}
            onAdd={() => {
              const q = PROFILE_QUESTIONS.find(q => q.id === 'gymName');
              if (q) setActiveQuestion(q);
            }}
          />
          <ProfileField
            label="Training Goals"
            value={profile.trainingGoals.length > 0
              ? profile.trainingGoals.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(', ')
              : null}
            completed={profile.trainingGoals.length > 0}
            onAdd={() => {
              const q = PROFILE_QUESTIONS.find(q => q.id === 'trainingGoals');
              if (q) setActiveQuestion(q);
            }}
          />
          <ProfileField
            label="Logging Preference"
            value={profile.loggingPreference === 'voice' ? 'Voice' :
                   profile.loggingPreference === 'text' ? 'Text' : null}
            completed={profile.loggingPreference !== 'undecided'}
          />
        </div>
      </div>

      {/* Settings Button */}
      <button
        onClick={() => onNavigate?.('settings')}
        className="card"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-lg)',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-400)" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-white)' }}>Settings</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-400)' }}>
              Preferences, account, and more
            </div>
          </div>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-400)" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Danger Zone (for testing) */}
      <div className="card" style={{
        border: '1px solid var(--color-error)',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
      }}>
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-sm)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-widest)',
          color: 'var(--color-error)',
          marginBottom: 'var(--space-md)',
        }}>
          Developer Tools
        </h3>
        <button
          onClick={() => {
            if (confirm('Reset all profile data? This cannot be undone.')) {
              resetProfile();
              window.location.reload();
            }
          }}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: 'var(--color-error)',
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
          }}
        >
          Reset Profile (Testing)
        </button>
      </div>

      {/* Profile Question Sheet */}
      {activeQuestion && (
        <EditSheet
          isOpen={true}
          onClose={() => setActiveQuestion(null)}
          title={activeQuestion.question}
          subtitle={activeQuestion.subtitle}
          showDoneButton={false}
          height="auto"
        >
          <ProfileNudge
            question={activeQuestion}
            onComplete={() => setActiveQuestion(null)}
            onSkip={() => {
              skipQuestion(activeQuestion.id);
              setActiveQuestion(null);
            }}
          />
        </EditSheet>
      )}
    </div>
  );
}

// Profile field row component
function ProfileField({
  label,
  value,
  completed,
  onAdd,
}: {
  label: string;
  value: string | null;
  completed: boolean;
  onAdd?: () => void;
}) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'var(--space-sm) 0',
      borderBottom: '1px solid var(--color-gray-800)',
    }}>
      <div style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--color-gray-400)',
      }}>
        {label}
      </div>
      {completed ? (
        <div style={{
          fontSize: 'var(--text-base)',
          color: 'var(--color-white)',
          fontWeight: 500,
        }}>
          {value}
        </div>
      ) : (
        <button
          onClick={onAdd}
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-accent)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          + Add
        </button>
      )}
    </div>
  );
}

export default ProfileScreen;
