/**
 * ManualLogger Component
 *
 * Manual-first session logging with voice assist option.
 * Designed for exhausted post-training users with minimal cognitive load.
 *
 * Flow:
 * 1. "Tell me" voice button at top (optional, fills form)
 * 2. Quick context: Training type, Duration, What you learned
 * 3. Did you spar? (gates sparring section)
 * 4. IF sparred: Rounds, Subs given, Submitted by
 * 5. Notes (optional)
 * 6. Review & Save
 *
 * Data Collection Philosophy:
 * Only collect data users will reliably provide.
 * See: Data Science Audit (Dec 2024)
 */

import { useState } from 'react';
import { useBeltPersonalization } from '../../hooks';
import { SubmissionPicker } from '../ui';
import type { TrainingType, SessionData } from '../../types/database';
import { DEFAULT_SESSION_DATA } from '../../types/database';

// ===========================================
// PROPS
// ===========================================

interface ManualLoggerProps {
  onComplete?: () => void;
  onCancel?: () => void;
  onVoiceAssist?: () => void; // Trigger voice recording to fill form
}

// ===========================================
// DURATION OPTIONS
// ===========================================

const DURATION_OPTIONS = [
  { value: 60, label: '60 min' },
  { value: 90, label: '90 min' },
  { value: 120, label: '2 hrs' },
];

// ===========================================
// COMPONENT
// ===========================================

// Training type color mapping
const TRAINING_TYPE_COLORS: Record<TrainingType, string> = {
  gi: 'var(--color-training-gi)',
  nogi: 'var(--color-training-nogi)',
  openmat: 'var(--color-training-openmat)',
  private: 'var(--color-training-private)',
  competition: 'var(--color-training-competition)',
  drilling: 'var(--color-gold)', // Drilling uses gold accent
};

export function ManualLogger({ onComplete, onCancel, onVoiceAssist }: ManualLoggerProps) {
  const { sessionLogger } = useBeltPersonalization();

  // Form state
  const [sessionData, setSessionData] = useState<SessionData>({
    ...DEFAULT_SESSION_DATA,
  });
  const [customDuration, setCustomDuration] = useState('');
  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update a field
  const updateField = <K extends keyof SessionData>(field: K, value: SessionData[K]) => {
    setSessionData(prev => ({ ...prev, [field]: value }));
  };

  // Check if form is valid (required fields filled)
  const isValid = () => {
    return (
      sessionData.trainingType !== null &&
      sessionData.durationMinutes !== null &&
      sessionData.techniquesDrilled.length > 0
    );
  };

  // Handle save
  const handleSave = async () => {
    if (!isValid()) return;

    setIsSubmitting(true);

    // In production, this would call api.sessions.create()
    // For prototype, simulate save
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('Session saved:', sessionData);
    setIsSubmitting(false);
    onComplete?.();
  };

  // Get belt-appropriate prompt
  const getPrompt = () => {
    const prompts = sessionLogger.suggestedPrompts;
    return prompts[0] || "What did you work on today?";
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-black)',
      }}
    >
      {/* Scrollable content area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--space-lg)',
          paddingTop: 'max(var(--space-lg), env(safe-area-inset-top))',
          paddingBottom: 'var(--space-xl)',
        }}
      >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-xl)',
        }}
      >
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-gray-400)',
            cursor: 'pointer',
            padding: 'var(--space-sm)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            minHeight: '44px',
          }}
        >
          Cancel
        </button>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            color: 'var(--color-white)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
          }}
        >
          Log Session
        </h1>
        <div style={{ width: 60 }} /> {/* Spacer for centering */}
      </div>

      {/* Voice Assist Button */}
      {onVoiceAssist && (
        <button
          onClick={onVoiceAssist}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-sm)',
            padding: 'var(--space-md) var(--space-lg)',
            backgroundColor: 'var(--color-gray-900)',
            border: '1px dashed var(--color-gray-600)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-gray-300)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            cursor: 'pointer',
            marginBottom: 'var(--space-xl)',
            minHeight: '56px',
            transition: 'all 0.2s ease',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
          Tell me about your session
        </button>
      )}

      {/* Training Type */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <label
          style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
            color: 'var(--color-gray-400)',
            marginBottom: 'var(--space-sm)',
          }}
        >
          Training Type *
        </label>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'var(--space-sm)',
          }}
        >
          {(['gi', 'nogi', 'openmat', 'private'] as TrainingType[]).map(type => {
            const isSelected = sessionData.trainingType === type;
            const typeColor = TRAINING_TYPE_COLORS[type];
            return (
              <button
                key={type}
                onClick={() => updateField('trainingType', type)}
                style={{
                  padding: 'var(--space-md)',
                  backgroundColor: isSelected ? typeColor : 'var(--color-gray-800)',
                  border: isSelected
                    ? `2px solid ${typeColor}`
                    : '1px solid var(--color-gray-700)',
                  borderRadius: 'var(--radius-md)',
                  color: isSelected ? 'var(--color-white)' : 'var(--color-gray-300)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  minHeight: '56px',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s ease',
                }}
              >
                {type === 'openmat' ? 'Open Mat' : type === 'nogi' ? 'No-Gi' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <label
          style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
            color: 'var(--color-gray-400)',
            marginBottom: 'var(--space-sm)',
          }}
        >
          Duration *
        </label>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-sm)',
          }}
        >
          {DURATION_OPTIONS.map(opt => {
            const isSelected = sessionData.durationMinutes === opt.value && !showCustomDuration;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  updateField('durationMinutes', opt.value);
                  setShowCustomDuration(false);
                }}
                style={{
                  flex: 1,
                  padding: 'var(--space-md)',
                  backgroundColor: isSelected ? 'var(--color-gold)' : 'var(--color-gray-800)',
                  border: isSelected ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-700)',
                  borderRadius: 'var(--radius-md)',
                  color: isSelected ? 'var(--color-black)' : 'var(--color-gray-300)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  minHeight: '56px',
                  transition: 'all 0.15s ease',
                }}
              >
                {opt.label}
              </button>
            );
          })}
          <button
            onClick={() => setShowCustomDuration(true)}
            style={{
              flex: 1,
              padding: 'var(--space-md)',
              backgroundColor: showCustomDuration ? 'var(--color-gold)' : 'var(--color-gray-800)',
              border: showCustomDuration ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-700)',
              borderRadius: 'var(--radius-md)',
              color: showCustomDuration ? 'var(--color-black)' : 'var(--color-gray-300)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: '56px',
              transition: 'all 0.15s ease',
            }}
          >
            Other
          </button>
        </div>
        {showCustomDuration && (
          <div style={{ marginTop: 'var(--space-sm)' }}>
            <input
              type="number"
              value={customDuration}
              onChange={e => {
                setCustomDuration(e.target.value);
                const mins = parseInt(e.target.value);
                if (!isNaN(mins) && mins > 0) {
                  updateField('durationMinutes', mins);
                }
              }}
              placeholder="Minutes"
              autoFocus
              style={{
                width: '100%',
                padding: 'var(--space-md)',
                backgroundColor: 'var(--color-gray-900)',
                border: '1px solid var(--color-gray-700)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-white)',
                fontSize: 'var(--text-base)',
              }}
            />
          </div>
        )}
      </div>

      {/* What did you learn/drill? */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <label
          style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
            color: 'var(--color-gray-400)',
            marginBottom: 'var(--space-sm)',
          }}
        >
          What did you learn/drill? *
        </label>
        <input
          type="text"
          value={sessionData.lessonTopic || ''}
          onChange={e => {
            updateField('lessonTopic', e.target.value);
            // Also add to techniques drilled as first item
            if (e.target.value.trim()) {
              updateField('techniquesDrilled', [e.target.value.trim()]);
            } else {
              updateField('techniquesDrilled', []);
            }
          }}
          placeholder={getPrompt()}
          style={{
            width: '100%',
            padding: 'var(--space-md)',
            backgroundColor: 'var(--color-gray-900)',
            border: '1px solid var(--color-gray-700)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-white)',
            fontSize: 'var(--text-base)',
          }}
        />
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-gray-500)',
            marginTop: 'var(--space-sm)',
          }}
        >
          e.g., "Half guard sweeps" or "Knee slice passing"
        </p>
      </div>

      {/* Did you spar? */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <label
          style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
            color: 'var(--color-gray-400)',
            marginBottom: 'var(--space-sm)',
          }}
        >
          Did you spar?
        </label>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-sm)',
          }}
        >
          <button
            onClick={() => updateField('didSpar', true)}
            style={{
              padding: 'var(--space-md)',
              backgroundColor: sessionData.didSpar
                ? 'var(--color-positive)'
                : 'var(--color-gray-800)',
              border: sessionData.didSpar
                ? '2px solid var(--color-positive)'
                : '1px solid var(--color-gray-700)',
              borderRadius: 'var(--radius-md)',
              color: sessionData.didSpar
                ? 'var(--color-black)'
                : 'var(--color-gray-300)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: '56px',
              transition: 'all 0.15s ease',
            }}
          >
            Yes
          </button>
          <button
            onClick={() => {
              updateField('didSpar', false);
              updateField('sparringRounds', null);
              updateField('submissionsGiven', []);
              updateField('submissionsReceived', []);
            }}
            style={{
              padding: 'var(--space-md)',
              backgroundColor: sessionData.didSpar === false
                ? 'var(--color-gray-600)'
                : 'var(--color-gray-800)',
              border: sessionData.didSpar === false
                ? '2px solid var(--color-gray-500)'
                : '1px solid var(--color-gray-700)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-gray-300)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: '56px',
              transition: 'all 0.15s ease',
            }}
          >
            No
          </button>
        </div>
      </div>

      {/* Sparring Section (gated) */}
      {sessionData.didSpar && (
        <div
          style={{
            backgroundColor: 'var(--color-gray-900)',
            border: '1px solid var(--color-gray-800)',
            borderLeft: '3px solid var(--color-positive)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-lg)',
            marginBottom: 'var(--space-xl)',
          }}
        >
          {/* Rounds */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-wider)',
                color: 'var(--color-gray-400)',
                marginBottom: 'var(--space-sm)',
              }}
            >
              How many rounds?
            </label>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-xs)',
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => {
                const isSelected = sessionData.sparringRounds === n;
                return (
                  <button
                    key={n}
                    onClick={() => updateField('sparringRounds', n)}
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: isSelected ? 'var(--color-gold)' : 'var(--color-gray-800)',
                      border: isSelected ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-700)',
                      borderRadius: 'var(--radius-md)',
                      color: isSelected ? 'var(--color-black)' : 'var(--color-gray-300)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subs Given */}
          <SubmissionPicker
            label="Subs given"
            selectedSubmissions={sessionData.submissionsGiven}
            onSubmissionsChange={subs => updateField('submissionsGiven', subs)}
            userHistory={[]} // Would come from user's history in production
          />

          {/* Submitted By */}
          <SubmissionPicker
            label="Submitted by"
            selectedSubmissions={sessionData.submissionsReceived}
            onSubmissionsChange={subs => updateField('submissionsReceived', subs)}
            userHistory={[]} // Would come from user's history in production
          />
        </div>
      )}

      {/* Notes (optional) */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <label
          style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
            color: 'var(--color-gray-400)',
            marginBottom: 'var(--space-sm)',
          }}
        >
          Notes (optional)
        </label>
        <textarea
          value={sessionData.rawText || ''}
          onChange={e => updateField('rawText', e.target.value)}
          placeholder="Anything else you want to remember?"
          rows={3}
          style={{
            width: '100%',
            padding: 'var(--space-md)',
            backgroundColor: 'var(--color-gray-900)',
            border: '1px solid var(--color-gray-700)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-white)',
            fontSize: 'var(--text-base)',
            resize: 'vertical',
          }}
        />
      </div>
      </div>{/* End scrollable content area */}

      {/* Save Button (sticky at bottom) */}
      <div
        style={{
          flexShrink: 0,
          padding: 'var(--space-lg)',
          paddingBottom: 'max(var(--space-lg), env(safe-area-inset-bottom))',
          backgroundColor: 'var(--color-black)',
          borderTop: '1px solid var(--color-gray-800)',
        }}
      >
        <button
          onClick={handleSave}
          disabled={!isValid() || isSubmitting}
          style={{
            width: '100%',
            padding: 'var(--space-lg)',
            backgroundColor: isValid()
              ? 'var(--color-gold)'
              : 'var(--color-gray-800)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: isValid()
              ? 'var(--color-black)'
              : 'var(--color-gray-500)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-base)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            cursor: isValid() ? 'pointer' : 'not-allowed',
            minHeight: '56px',
            transition: 'all 0.2s ease',
          }}
        >
          {isSubmitting ? 'Saving...' : 'Save Session'}
        </button>
      </div>
    </div>
  );
}

export default ManualLogger;
