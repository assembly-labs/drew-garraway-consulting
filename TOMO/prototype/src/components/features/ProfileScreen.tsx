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
import { useUserProfile, PROFILE_QUESTIONS, type BeltLevel, type BeltProgressionEvent } from '../../context/UserProfileContext';
import { EditSheet } from './EditSheet';
import { ProfileNudge } from './ProfileNudge';
import { useToast } from '../ui/Toast';
import { useBeltPersonalization } from '../../hooks';
import type { Persona } from '../../data/personas';

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
    activeDemoProfile,
    addBeltEvent,
    getBeltHistory,
  } = useUserProfile();

  const { showToast } = useToast();
  const [activeQuestion, setActiveQuestion] = useState<typeof PROFILE_QUESTIONS[0] | null>(null);
  const [showAddPromotion, setShowAddPromotion] = useState(false);

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
        {/* Avatar */}
        <div style={{
          width: 120,
          height: 120,
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-gray-800)',
          margin: '0 auto var(--space-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'var(--text-2xl)',
          fontWeight: 700,
          color: 'var(--color-white)',
          overflow: 'hidden',
          border: `3px solid ${BELT_COLORS[profile.belt]}`,
        }}>
          {activeDemoProfile && (activeDemoProfile as Persona).avatarUrl ? (
            <img
              src={(activeDemoProfile as Persona).avatarUrl}
              alt={profile.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            profile.name.charAt(0).toUpperCase()
          )}
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

      {/* Belt & Stripe History */}
      <BeltHistoryModule
        profile={profile}
        getBeltHistory={getBeltHistory}
        onRecordPromotion={() => setShowAddPromotion(true)}
      />

      {/* Add Promotion Sheet */}
      {showAddPromotion && (
        <EditSheet
          isOpen={true}
          onClose={() => setShowAddPromotion(false)}
          title="Record a Promotion"
          subtitle="Log a belt or stripe promotion"
          showDoneButton={false}
          height="auto"
        >
          <AddPromotionSheet
            currentBelt={profile.belt}
            currentStripes={profile.stripes}
            onSave={(event) => {
              addBeltEvent(event);
              setShowAddPromotion(false);
              showToast({ message: 'Promotion recorded', type: 'success' });
            }}
            onCancel={() => setShowAddPromotion(false)}
          />
        </EditSheet>
      )}

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
            value={profile.gym?.gymName || null}
            completed={!!profile.gym}
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

// Belt History Module component
function BeltHistoryModule({
  profile,
  getBeltHistory,
  onRecordPromotion,
}: {
  profile: { belt: BeltLevel; stripes: number };
  getBeltHistory: () => BeltProgressionEvent[];
  onRecordPromotion: () => void;
}) {
  const history = getBeltHistory();

  // Compute time at current belt
  const getTimeAtCurrentBelt = () => {
    if (history.length === 0) return null;
    // Find the most recent event for the current belt
    const sorted = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const currentBeltEvent = sorted.find(e => e.toBelt === profile.belt);
    if (!currentBeltEvent) return null;

    const start = new Date(currentBeltEvent.date);
    const now = new Date();
    const totalMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years > 0) {
      return `${years}y ${months}m`;
    }
    return `${months}m`;
  };

  const timeAtBelt = getTimeAtCurrentBelt();

  // Stripe marks for belt badge
  const stripeMarks = [];
  for (let i = 0; i < profile.stripes; i++) {
    stripeMarks.push(
      <div key={i} style={{
        width: 3,
        height: 10,
        backgroundColor: profile.belt === 'white' ? '#333' : '#fff',
        borderRadius: 1,
      }} />
    );
  }

  return (
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
        Belt & Stripe History
      </h3>

      {/* Current Belt Display */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        marginBottom: 'var(--space-md)',
      }}>
        {/* Belt Badge - 52px colored rectangle with stripe marks */}
        <div style={{
          width: 52,
          height: 18,
          backgroundColor: BELT_COLORS[profile.belt],
          border: profile.belt === 'white' ? '1px solid var(--color-gray-600)' : 'none',
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 2,
          paddingRight: 4,
          flexShrink: 0,
        }}>
          {stripeMarks}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: 'var(--color-white)', fontSize: 'var(--text-base)' }}>
            {BELT_LABELS[profile.belt]} Belt
            {profile.stripes > 0 && (
              <span style={{ color: 'var(--color-gray-400)', fontWeight: 500 }}>
                {' '}{profile.stripes} stripe{profile.stripes !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {timeAtBelt && (
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-500)',
              marginTop: 2,
            }}>
              Time at current belt: {timeAtBelt}
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      {history.length > 0 && (
        <div style={{
          position: 'relative',
          paddingLeft: 24,
          marginBottom: 'var(--space-lg)',
        }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            left: 7,
            top: 4,
            bottom: 4,
            width: 2,
            backgroundColor: 'var(--color-gray-800)',
          }} />

          {[...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((event) => {
            const isStarted = event.notes === 'Started Training' || event.fromBelt === 'none';
            const dotColor = isStarted ? 'var(--color-accent)' : BELT_COLORS[event.toBelt];
            const date = new Date(event.date);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

            return (
              <div key={event.id} style={{
                position: 'relative',
                paddingBottom: 'var(--space-md)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-sm)',
              }}>
                {/* Dot */}
                <div style={{
                  position: 'absolute',
                  left: -20,
                  top: 2,
                  width: 12,
                  height: 12,
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: dotColor,
                  border: `2px solid ${isStarted ? 'var(--color-accent)' : 'var(--color-gray-700)'}`,
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {isStarted && (
                    <svg width="6" height="6" viewBox="0 0 24 24" fill="var(--color-primary)">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: 'var(--color-white)',
                  }}>
                    {isStarted ? 'Started Training' : `${BELT_LABELS[event.toBelt]} Belt${event.toStripes > 0 ? ` (${event.toStripes} stripe${event.toStripes !== 1 ? 's' : ''})` : ''}`}
                  </div>
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-gray-500)',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {dateStr}{event.dateEstimated ? ' (est.)' : ''}
                  </div>
                  {event.notes && !isStarted && (
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-gray-400)',
                      marginTop: 2,
                      fontStyle: 'italic',
                    }}>
                      {event.notes}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Record a Promotion button */}
      <button
        onClick={onRecordPromotion}
        style={{
          width: '100%',
          padding: 'var(--space-md)',
          backgroundColor: 'transparent',
          color: 'var(--color-accent)',
          border: '2px solid var(--color-accent)',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          fontSize: 'var(--text-sm)',
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
        Record a Promotion
      </button>

      {/* Disclaimer */}
      <p style={{
        marginTop: 'var(--space-md)',
        fontSize: 'var(--text-xs)',
        color: 'var(--color-gray-600)',
        textAlign: 'center',
        fontStyle: 'italic',
      }}>
        Belt promotions are your coach's decision — this is for personal context and tracking only.
      </p>
    </div>
  );
}

// Add Promotion Sheet content
function AddPromotionSheet({
  currentBelt,
  currentStripes,
  onSave,
  onCancel,
}: {
  currentBelt: BeltLevel;
  currentStripes: number;
  onSave: (event: Omit<BeltProgressionEvent, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [selectedBelt, setSelectedBelt] = useState<BeltLevel>(currentBelt);
  const [selectedStripes, setSelectedStripes] = useState(currentStripes);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const belts: BeltLevel[] = ['white', 'blue', 'purple', 'brown', 'black'];

  const handleSave = () => {
    const isBeltChange = selectedBelt !== currentBelt;
    onSave({
      date,
      type: isBeltChange ? 'belt_promotion' : 'stripe_promotion',
      fromBelt: currentBelt,
      fromStripes: currentStripes,
      toBelt: selectedBelt,
      toStripes: selectedStripes,
      source: 'user_edit',
      notes: notes || undefined,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Belt Selector */}
      <div>
        <label style={{
          display: 'block',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: 'var(--color-gray-400)',
          marginBottom: 'var(--space-sm)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Belt
        </label>
        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
          {belts.map(belt => (
            <button
              key={belt}
              onClick={() => setSelectedBelt(belt)}
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-full)',
                backgroundColor: BELT_COLORS[belt],
                border: selectedBelt === belt
                  ? '3px solid var(--color-accent)'
                  : belt === 'white'
                    ? '2px solid var(--color-gray-600)'
                    : '2px solid transparent',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
                transform: selectedBelt === belt ? 'scale(1.1)' : 'scale(1)',
              }}
              aria-label={`${BELT_LABELS[belt]} belt`}
            />
          ))}
        </div>
        <div style={{
          textAlign: 'center',
          marginTop: 'var(--space-xs)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-white)',
          fontWeight: 500,
        }}>
          {BELT_LABELS[selectedBelt]}
        </div>
      </div>

      {/* Stripe Selector */}
      <div>
        <label style={{
          display: 'block',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: 'var(--color-gray-400)',
          marginBottom: 'var(--space-sm)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Stripes
        </label>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'center' }}>
          {[0, 1, 2, 3, 4].map(stripe => (
            <button
              key={stripe}
              onClick={() => setSelectedStripes(stripe)}
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                backgroundColor: selectedStripes === stripe ? 'var(--color-accent)' : 'var(--color-gray-800)',
                color: selectedStripes === stripe ? 'var(--color-primary)' : 'var(--color-white)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 'var(--text-base)',
                transition: 'all 0.15s ease',
              }}
            >
              {stripe}
            </button>
          ))}
        </div>
      </div>

      {/* Date Input */}
      <div>
        <label style={{
          display: 'block',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: 'var(--color-gray-400)',
          marginBottom: 'var(--space-sm)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Date
        </label>
        <input
          type="date"
          value={date}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => setDate(e.target.value)}
          style={{
            width: '100%',
            padding: 'var(--space-md)',
            backgroundColor: 'var(--color-gray-800)',
            border: '1px solid var(--color-gray-700)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-white)',
            fontSize: 'var(--text-base)',
            fontFamily: 'var(--font-mono)',
          }}
        />
      </div>

      {/* Notes */}
      <div>
        <label style={{
          display: 'block',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: 'var(--color-gray-400)',
          marginBottom: 'var(--space-sm)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Promoted by Professor Garcia"
          rows={3}
          style={{
            width: '100%',
            padding: 'var(--space-md)',
            backgroundColor: 'var(--color-gray-800)',
            border: '1px solid var(--color-gray-700)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-white)',
            fontSize: 'var(--text-sm)',
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Warning */}
      <p style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--color-warning, #f59e0b)',
        textAlign: 'center',
      }}>
        This creates a permanent record.
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: 'var(--space-md)',
            backgroundColor: 'var(--color-gray-800)',
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          style={{
            flex: 1,
            padding: 'var(--space-md)',
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-primary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default ProfileScreen;
