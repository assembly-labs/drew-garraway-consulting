/**
 * EntryPhase - Core fields + Record button
 *
 * First screen of the voice logger flow. Captures:
 * - Training type (Gi/No-Gi/Open Mat)
 * - Duration
 * - Sparring details (rounds, submissions)
 * - Optional techniques and notes
 */

import { useState } from 'react';
import { SubmissionPicker } from '../../ui';
import { DURATION_OPTIONS, TRAINING_TYPE_OPTIONS, RECENT_TECHNIQUES } from './constants';
import type { EntryPhaseProps } from './types';

export function EntryPhase({
  sessionData,
  updateField,
  sparringSelected,
  setSparringSelected,
  onRecord,
  onCancel,
  onSave,
  isValid,
}: EntryPhaseProps) {
  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const [customDuration, setCustomDuration] = useState('');

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-lg)',
        paddingTop: 'max(var(--space-lg), env(safe-area-inset-top))',
        flexShrink: 0,
      }}>
        <div style={{ width: 48 }} />
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-lg)',
          fontWeight: 700,
          color: 'var(--color-white)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-wider)',
        }}>
          Log Session
        </h1>
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-gray-400)',
            cursor: 'pointer',
            padding: '12px',
            borderRadius: 'var(--radius-full)',
            minWidth: '48px',
            minHeight: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'var(--space-lg)',
        paddingTop: 0,
        WebkitOverflowScrolling: 'touch',
      }}>
        {/* === RECORD BUTTON (Primary CTA at top) === */}
        <div style={{
          marginBottom: 'var(--space-xl)',
        }}>
          <button
            onClick={onRecord}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-xl)',
              backgroundColor: 'var(--color-gold-dim)',
              border: '2px solid var(--color-gold)',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              minHeight: '120px',
              transition: 'all 0.2s ease',
            }}
          >
            {/* Mic icon */}
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-sm)',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-black)" strokeWidth="2.5">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-base)',
              fontWeight: 700,
              color: 'var(--color-gold)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wide)',
            }}>
              Tap to Record
            </span>
            <span style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-gray-400)',
              marginTop: '4px',
            }}>
              Tell me what you worked on
            </span>
          </button>
        </div>

        {/* === CORE FIELDS (Tier 1) === */}

        {/* Training Type */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
            color: 'var(--color-gray-400)',
            marginBottom: 'var(--space-sm)',
          }}>
            Training Type
          </label>
          <div style={{
            display: 'flex',
            gap: 'var(--space-sm)',
          }}>
            {TRAINING_TYPE_OPTIONS.map(opt => {
              const isSelected = sessionData.trainingType === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => updateField('trainingType', opt.value)}
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
                    minHeight: '48px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
            color: 'var(--color-gray-400)',
            marginBottom: 'var(--space-sm)',
          }}>
            Duration
          </label>
          <div style={{
            display: 'flex',
            gap: 'var(--space-sm)',
          }}>
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
                    minHeight: '48px',
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
                minHeight: '48px',
                transition: 'all 0.15s ease',
              }}
            >
              Other
            </button>
          </div>
          {showCustomDuration && (
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
                marginTop: 'var(--space-sm)',
                padding: 'var(--space-md)',
                backgroundColor: 'var(--color-gray-900)',
                border: '1px solid var(--color-gray-700)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-white)',
                fontSize: 'var(--text-base)',
              }}
            />
          )}
        </div>

        {/* Did You Spar? */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
            color: 'var(--color-gray-400)',
            marginBottom: 'var(--space-sm)',
          }}>
            Did You Spar?
          </label>
          <div style={{
            display: 'flex',
            gap: 'var(--space-sm)',
          }}>
            <button
              onClick={() => {
                setSparringSelected(true);
                updateField('didSpar', true);
              }}
              style={{
                flex: 1,
                padding: 'var(--space-md)',
                backgroundColor: sparringSelected === true ? 'var(--color-gold)' : 'var(--color-gray-800)',
                border: sparringSelected === true ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-700)',
                borderRadius: 'var(--radius-md)',
                color: sparringSelected === true ? 'var(--color-black)' : 'var(--color-gray-300)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: '48px',
                transition: 'all 0.15s ease',
              }}
            >
              Yes
            </button>
            <button
              onClick={() => {
                setSparringSelected(false);
                updateField('didSpar', false);
                updateField('sparringRounds', null);
                updateField('submissionsGiven', []);
                updateField('submissionsReceived', []);
              }}
              style={{
                flex: 1,
                padding: 'var(--space-md)',
                backgroundColor: sparringSelected === false ? 'var(--color-gold)' : 'var(--color-gray-800)',
                border: sparringSelected === false ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-700)',
                borderRadius: 'var(--radius-md)',
                color: sparringSelected === false ? 'var(--color-black)' : 'var(--color-gray-300)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: '48px',
                transition: 'all 0.15s ease',
              }}
            >
              No
            </button>
          </div>
        </div>

        {/* Sparring Details (expanded if Yes) */}
        {sparringSelected === true && (
          <div style={{
            backgroundColor: 'var(--color-gray-900)',
            border: '1px solid var(--color-gray-800)',
            borderLeft: '3px solid var(--color-positive)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-lg)',
            marginBottom: 'var(--space-xl)',
          }}>
            {/* Rounds */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--color-gray-400)',
                marginBottom: 'var(--space-sm)',
              }}>
                Rounds
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => {
                  const isSelected = sessionData.sparringRounds === n;
                  return (
                    <button
                      key={n}
                      onClick={() => updateField('sparringRounds', n)}
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: isSelected ? 'var(--color-gold)' : 'var(--color-gray-800)',
                        border: isSelected ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-700)',
                        borderRadius: 'var(--radius-sm)',
                        color: isSelected ? 'var(--color-black)' : 'var(--color-gray-300)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 600,
                        cursor: 'pointer',
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
              userHistory={[]}
            />

            {/* Submitted By */}
            <SubmissionPicker
              label="Submitted by"
              selectedSubmissions={sessionData.submissionsReceived}
              onSubmissionsChange={subs => updateField('submissionsReceived', subs)}
              userHistory={[]}
            />
          </div>
        )}

        {/* === OPTIONAL FIELDS (Tier 2) === */}

        {/* What You Worked On */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
            color: 'var(--color-gray-500)',
            marginBottom: 'var(--space-sm)',
          }}>
            What You Worked On
            <span style={{
              marginLeft: 'var(--space-sm)',
              fontWeight: 500,
              color: 'var(--color-gray-600)',
              textTransform: 'none',
              letterSpacing: 'normal',
            }}>
              optional
            </span>
          </label>

          {/* Selected techniques */}
          {sessionData.techniquesDrilled.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-xs)',
              marginBottom: 'var(--space-sm)',
            }}>
              {sessionData.techniquesDrilled.map(technique => (
                <div
                  key={technique}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--color-gold-dim)',
                    border: '1px solid var(--color-gold)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <span style={{
                    padding: 'var(--space-xs) var(--space-sm)',
                    color: 'var(--color-gold)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                  }}>
                    {technique}
                  </span>
                  <button
                    onClick={() => {
                      updateField('techniquesDrilled', sessionData.techniquesDrilled.filter(t => t !== technique));
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 var(--space-sm)',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderLeft: '1px solid var(--color-gold)',
                      color: 'var(--color-gray-400)',
                      cursor: 'pointer',
                      minHeight: '28px',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Quick add chips */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-xs)',
          }}>
            {RECENT_TECHNIQUES.filter(t => !sessionData.techniquesDrilled.includes(t)).map(technique => (
              <button
                key={technique}
                onClick={() => {
                  updateField('techniquesDrilled', [...sessionData.techniquesDrilled, technique]);
                }}
                style={{
                  padding: 'var(--space-xs) var(--space-sm)',
                  backgroundColor: 'var(--color-gray-800)',
                  border: '1px solid var(--color-gray-700)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--color-gray-400)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                + {technique}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
            color: 'var(--color-gray-500)',
            marginBottom: 'var(--space-sm)',
          }}>
            Notes
            <span style={{
              marginLeft: 'var(--space-sm)',
              fontWeight: 500,
              color: 'var(--color-gray-600)',
              textTransform: 'none',
              letterSpacing: 'normal',
            }}>
              optional
            </span>
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
      </div>

      {/* Save button (sticky at bottom) */}
      <div style={{
        flexShrink: 0,
        padding: 'var(--space-lg)',
        paddingBottom: 'max(var(--space-lg), env(safe-area-inset-bottom))',
        backgroundColor: 'var(--color-black)',
        borderTop: '1px solid var(--color-gray-800)',
      }}>
        <button
          onClick={onSave}
          disabled={!isValid}
          style={{
            width: '100%',
            padding: 'var(--space-lg)',
            backgroundColor: isValid ? 'var(--color-gold)' : 'var(--color-gray-800)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: isValid ? 'var(--color-black)' : 'var(--color-gray-500)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-base)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            cursor: isValid ? 'pointer' : 'not-allowed',
            minHeight: '56px',
            transition: 'all 0.2s ease',
          }}
        >
          Save Session
        </button>
      </div>
    </div>
  );
}
