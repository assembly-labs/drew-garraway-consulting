/**
 * ReviewPhase - Editable form with extracted data
 *
 * Shows the same form as EntryPhase but pre-filled with AI-extracted data.
 * User can edit any field before saving. Offers re-record option.
 */

import { useState } from 'react';
import { SubmissionPicker } from '../../ui';
import { DURATION_OPTIONS, TRAINING_TYPE_OPTIONS, RECENT_TECHNIQUES } from './constants';
import type { ReviewPhaseProps } from './types';

function TranscriptSection({ transcript }: { transcript: string }) {
  const [expanded, setExpanded] = useState(false);
  const lines = transcript.split('\n');
  const preview = lines.slice(0, 3).join('\n');
  const hasMore = lines.length > 3;

  return (
    <div style={{
      marginBottom: 'var(--space-lg)',
      padding: 'var(--space-md)',
      backgroundColor: 'var(--color-gray-900)',
      border: '1px solid var(--color-gray-800)',
      borderRadius: 'var(--radius-md)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-sm)',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          color: 'var(--color-gray-400)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-wider)',
        }}>
          Voice Transcript
        </span>
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-gold)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 'var(--space-xs)',
            }}
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
      <p style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--color-gray-300)',
        lineHeight: 1.5,
        margin: 0,
        whiteSpace: 'pre-wrap',
      }}>
        {expanded ? transcript : preview}
        {!expanded && hasMore && '...'}
      </p>
    </div>
  );
}

export function ReviewPhase({ sessionData, updateField, onSave, onReRecord, isValid }: ReviewPhaseProps) {
  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const [customDuration, setCustomDuration] = useState('');

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-black)',
      zIndex: 100,
    }}>
      {/* Header */}
      <div style={{
        padding: 'var(--space-lg)',
        paddingTop: 'max(var(--space-lg), env(safe-area-inset-top))',
        borderBottom: '1px solid var(--color-gray-800)',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-lg)',
          fontWeight: 700,
          color: 'var(--color-white)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-wider)',
          marginBottom: 'var(--space-xs)',
        }}>
          Review Session
        </h1>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-gray-500)',
          margin: 0,
        }}>
          Edit anything that doesn't look right
        </p>
      </div>

      {/* Scrollable content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'var(--space-lg)',
      }}>
        {/* Voice Transcript (collapsible) */}
        {sessionData.voiceTranscript && (
          <TranscriptSection transcript={sessionData.voiceTranscript} />
        )}

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
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
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
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lesson Topic */}
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
            What Did Coach Teach?
          </label>
          <input
            type="text"
            value={sessionData.lessonTopic || ''}
            onChange={e => updateField('lessonTopic', e.target.value || null)}
            placeholder="Today's lesson topic (optional)"
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
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
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

        {/* Sparring Toggle */}
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
            Did You Spar?
          </label>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button
              onClick={() => updateField('didSpar', true)}
              style={{
                flex: 1,
                padding: 'var(--space-md)',
                backgroundColor: sessionData.didSpar === true ? 'var(--color-gold)' : 'var(--color-gray-800)',
                border: sessionData.didSpar === true ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-700)',
                borderRadius: 'var(--radius-md)',
                color: sessionData.didSpar === true ? 'var(--color-black)' : 'var(--color-gray-300)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: '48px',
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
                flex: 1,
                padding: 'var(--space-md)',
                backgroundColor: sessionData.didSpar === false ? 'var(--color-gold)' : 'var(--color-gray-800)',
                border: sessionData.didSpar === false ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-700)',
                borderRadius: 'var(--radius-md)',
                color: sessionData.didSpar === false ? 'var(--color-black)' : 'var(--color-gray-300)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: '48px',
              }}
            >
              No
            </button>
          </div>
        </div>

        {/* Sparring Details (expanded if Yes) */}
        {sessionData.didSpar && (
          <div style={{
            backgroundColor: 'var(--color-gray-900)',
            border: '1px solid var(--color-gray-800)',
            borderLeft: '3px solid var(--color-positive)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-lg)',
            marginBottom: 'var(--space-lg)',
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

        {/* What You Worked On */}
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
            What You Worked On
          </label>

          {sessionData.techniquesDrilled.length > 0 ? (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-xs)',
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
          ) : (
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-gray-500)',
              fontStyle: 'italic',
            }}>
              Nothing extracted - add techniques below
            </p>
          )}

          {/* Quick add */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-xs)',
            marginTop: 'var(--space-sm)',
          }}>
            {RECENT_TECHNIQUES.filter(t => !sessionData.techniquesDrilled.includes(t)).slice(0, 4).map(technique => (
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

        {/* Reflection: What Clicked */}
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
            What Clicked Today?
          </label>
          <textarea
            value={sessionData.workedWell.join('\n')}
            onChange={e => {
              const lines = e.target.value.split('\n').filter(line => line.trim() !== '');
              updateField('workedWell', lines.length > 0 ? lines : [e.target.value]);
            }}
            placeholder="A breakthrough, something that felt good..."
            rows={2}
            style={{
              width: '100%',
              padding: 'var(--space-md)',
              backgroundColor: 'var(--color-gray-900)',
              border: '1px solid var(--color-positive)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-white)',
              fontSize: 'var(--text-base)',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Reflection: What Gave Trouble */}
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
            What Gave You Trouble?
          </label>
          <textarea
            value={sessionData.struggles.join('\n')}
            onChange={e => {
              const lines = e.target.value.split('\n').filter(line => line.trim() !== '');
              updateField('struggles', lines.length > 0 ? lines : [e.target.value]);
            }}
            placeholder="Something you want to work on..."
            rows={2}
            style={{
              width: '100%',
              padding: 'var(--space-md)',
              backgroundColor: 'var(--color-gray-900)',
              border: '1px solid var(--color-negative)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-white)',
              fontSize: 'var(--text-base)',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Energy Level */}
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
            How Did You Feel Today?
          </label>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            {[1, 2, 3, 4, 5].map(level => {
              const isSelected = sessionData.energyLevel === level;
              const labels = ['Exhausted', 'Tired', 'Okay', 'Good', 'Great'];
              return (
                <button
                  key={level}
                  onClick={() => updateField('energyLevel', level)}
                  style={{
                    flex: 1,
                    padding: 'var(--space-sm) var(--space-xs)',
                    backgroundColor: isSelected ? 'var(--color-gold)' : 'var(--color-gray-800)',
                    border: isSelected ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-700)',
                    borderRadius: 'var(--radius-md)',
                    color: isSelected ? 'var(--color-black)' : 'var(--color-gray-300)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    minHeight: '48px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px',
                  }}
                >
                  <span style={{ fontSize: 'var(--text-base)' }}>{level}</span>
                  <span style={{ fontSize: '10px', opacity: 0.7 }}>{labels[level - 1]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
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
            Notes
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

      {/* Action buttons (sticky at bottom) */}
      <div style={{
        flexShrink: 0,
        padding: 'var(--space-lg)',
        paddingBottom: 'max(var(--space-lg), env(safe-area-inset-bottom))',
        backgroundColor: 'var(--color-black)',
        borderTop: '1px solid var(--color-gray-800)',
        display: 'flex',
        gap: 'var(--space-md)',
      }}>
        <button
          onClick={onReRecord}
          style={{
            flex: 1,
            padding: 'var(--space-md)',
            backgroundColor: 'transparent',
            color: 'var(--color-gray-400)',
            border: '1px solid var(--color-gray-600)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-base)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            cursor: 'pointer',
            minHeight: '56px',
          }}
        >
          Re-Record
        </button>
        <button
          onClick={onSave}
          disabled={!isValid}
          style={{
            flex: 2,
            padding: 'var(--space-md)',
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
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
