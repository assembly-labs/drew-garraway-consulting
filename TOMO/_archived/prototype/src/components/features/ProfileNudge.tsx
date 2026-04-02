/**
 * ProfileNudge Component
 *
 * Progressive profiling system that asks one question at a time
 * based on session count milestones.
 *
 * Features:
 * - Non-blocking bottom card design
 * - Skip tracking (stops after 3 skips)
 * - Shows unlock value for each question
 * - Celebratory confirmation when answered
 */

import { useState } from 'react';
import {
  useUserProfile,
  type ProfileQuestion,
  type TrainingGoal,
} from '../../context/UserProfileContext';
import { EditSheet } from './EditSheet';

interface ProfileNudgeProps {
  question: ProfileQuestion;
  onComplete: () => void;
  onSkip: () => void;
}

export function ProfileNudge({ question, onComplete, onSkip }: ProfileNudgeProps) {
  const { answerQuestion } = useUserProfile();
  const [value, setValue] = useState<string | string[] | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    if (value === null) return;

    // Convert value to appropriate type
    let finalValue: unknown = value;

    if (question.id === 'birthYear') {
      finalValue = parseInt(value as string, 10);
    }

    if (question.id === 'trainingGoals') {
      finalValue = value as TrainingGoal[];
    }

    answerQuestion(question.id, finalValue);
    setShowSuccess(true);

    // Brief celebration, then complete
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const canSubmit = value !== null &&
    (Array.isArray(value) ? value.length > 0 : value !== '');

  // Success state
  if (showSuccess) {
    return (
      <div style={{
        backgroundColor: 'var(--color-gray-900)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        border: '1px solid var(--color-success)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <div style={{
            fontWeight: 600,
            color: 'var(--color-white)',
            marginBottom: 'var(--space-xs)',
          }}>
            Got it!
          </div>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-gray-400)',
          }}>
            {question.unlocks.split(' ')[0]} unlocked.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'var(--color-gray-900)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-lg)',
      border: '1px solid var(--color-gray-700)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 'var(--space-md)',
      }}>
        <div>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-accent)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            marginBottom: 'var(--space-xs)',
          }}>
            Quick question
          </div>
          <div style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 600,
            color: 'var(--color-white)',
          }}>
            {question.question}
          </div>
          {question.subtitle && (
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-gray-400)',
              marginTop: 'var(--space-xs)',
            }}>
              {question.subtitle}
            </div>
          )}
        </div>
        <button
          onClick={onSkip}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-gray-500)',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            padding: 'var(--space-xs)',
          }}
        >
          Skip
        </button>
      </div>

      {/* Input based on type */}
      {question.type === 'text' && (
        <input
          type="text"
          value={(value as string) || ''}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter here..."
          style={{
            width: '100%',
            padding: 'var(--space-md)',
            backgroundColor: 'var(--color-gray-800)',
            border: '1px solid var(--color-gray-600)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-white)',
            fontSize: 'var(--text-base)',
            marginBottom: 'var(--space-md)',
          }}
        />
      )}

      {question.type === 'chips' && question.options && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-md)',
        }}>
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => setValue(option.value)}
              style={{
                padding: 'var(--space-sm) var(--space-lg)',
                backgroundColor: value === option.value
                  ? 'var(--color-accent)'
                  : 'var(--color-gray-800)',
                border: value === option.value
                  ? '2px solid var(--color-accent)'
                  : '2px solid var(--color-gray-600)',
                borderRadius: 'var(--radius-md)',
                color: value === option.value
                  ? 'var(--color-primary)'
                  : 'var(--color-gray-300)',
                fontSize: 'var(--text-base)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {question.type === 'multiselect' && question.options && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-md)',
        }}>
          {question.options.map((option) => {
            const selected = Array.isArray(value) && value.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => {
                  if (Array.isArray(value)) {
                    if (selected) {
                      setValue(value.filter(v => v !== option.value));
                    } else {
                      setValue([...value, option.value]);
                    }
                  } else {
                    setValue([option.value]);
                  }
                }}
                style={{
                  padding: 'var(--space-sm) var(--space-md)',
                  backgroundColor: selected
                    ? 'var(--color-accent)'
                    : 'var(--color-gray-800)',
                  border: selected
                    ? '2px solid var(--color-accent)'
                    : '2px solid var(--color-gray-600)',
                  borderRadius: 'var(--radius-md)',
                  color: selected
                    ? 'var(--color-primary)'
                    : 'var(--color-gray-300)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                }}
              >
                {selected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {option.label}
              </button>
            );
          })}
        </div>
      )}

      {question.type === 'date' && (
        <input
          type="month"
          value={(value as string) || ''}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: '100%',
            padding: 'var(--space-md)',
            backgroundColor: 'var(--color-gray-800)',
            border: '1px solid var(--color-gray-600)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-white)',
            fontSize: 'var(--text-base)',
            marginBottom: 'var(--space-md)',
          }}
        />
      )}

      {/* Unlock message */}
      <div style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--color-gray-500)',
        marginBottom: 'var(--space-md)',
      }}>
        Unlocks: {question.unlocks}
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        style={{
          width: '100%',
          padding: 'var(--space-md)',
          backgroundColor: canSubmit
            ? 'var(--color-accent)'
            : 'var(--color-gray-700)',
          color: canSubmit
            ? 'var(--color-primary)'
            : 'var(--color-gray-500)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          cursor: canSubmit ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
        }}
      >
        Save
      </button>
    </div>
  );
}

/**
 * ProfileNudgeCard - Simpler inline card for dashboard
 */
export function ProfileNudgeCard() {
  const { getNextNudgeQuestion, skipQuestion, getProfileCompletion, getMissingFields } = useUserProfile();
  const [showSheet, setShowSheet] = useState(false);

  const question = getNextNudgeQuestion();
  const completion = getProfileCompletion();
  const missingFields = getMissingFields();

  // Don't show if profile is complete or no questions
  if (completion === 100 || !question) {
    return null;
  }

  return (
    <>
      <div
        onClick={() => setShowSheet(true)}
        style={{
          backgroundColor: 'rgba(252, 211, 77, 0.1)',
          border: '1px solid rgba(252, 211, 77, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <div>
              <div style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                color: 'var(--color-primary)',
              }}>
                Complete your profile
              </div>
              <div style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-gray-700)',
              }}>
                {completion}% complete • {missingFields.length} items remaining
              </div>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-600)" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>

      {/* Profile nudge sheet */}
      <EditSheet
        isOpen={showSheet}
        onClose={() => setShowSheet(false)}
        title="Quick question"
        showDoneButton={false}
        height="auto"
      >
        <ProfileNudge
          question={question}
          onComplete={() => setShowSheet(false)}
          onSkip={() => {
            skipQuestion(question.id);
            setShowSheet(false);
          }}
        />
      </EditSheet>
    </>
  );
}

export default ProfileNudge;
