/**
 * SessionDetail Component
 * Full session view with AI narrative summary + structured data
 *
 * EDIT MODE ARCHITECTURE:
 * - Section-based editing via bottom sheets
 * - Changes are staged until explicitly saved
 * - Visual indicators for edit mode and pending changes
 * - Smooth animations and haptic-like feedback
 */

import { useState, useMemo } from 'react';
import { type Session } from './SessionCard';
import {
  TrainingDetailsEdit,
  TechniquesEdit,
  InsightsEdit,
  NotesEdit,
  EnergyMoodEdit,
  SparringEdit,
} from './EditSections';

// Extended session data for detail view
interface SessionDetailData extends Session {
  notes: string;
  isPrivate: boolean;
  energyLevel: 1 | 2 | 3 | 4 | 5;
  mood: 1 | 2 | 3 | 4 | 5;
  sparringDetails: SparringRound[];
  workedWell: string[];  // Override optional to required
  sparringRounds: number; // Override optional to required
}

interface SparringRound {
  partnerId: string;
  partnerName: string;
  partnerBelt: string;
  outcome: 'submission-win' | 'submission-loss' | 'points-win' | 'points-loss' | 'draw' | 'positional';
  submissionType?: string;
  notes?: string;
}

// Mock extended data for demonstration
const getExtendedSessionData = (session: Session): SessionDetailData => {
  return {
    ...session,
    notes: '',
    isPrivate: false,
    energyLevel: 4,
    mood: 3,
    workedWell: session.workedWell || [],
    sparringRounds: session.sparringRounds || 0,
    sparringDetails: session.sparringRounds ? [
      {
        partnerId: '1',
        partnerName: 'Marcus',
        partnerBelt: 'Purple',
        outcome: 'submission-loss',
        submissionType: 'Triangle',
      },
      {
        partnerId: '2',
        partnerName: 'Jake',
        partnerBelt: 'Blue',
        outcome: 'draw',
      },
    ] : [],
  };
};

// Generate AI narrative summary
const generateNarrativeSummary = (data: SessionDetailData): string => {
  const parts: string[] = [];

  const typeLabel = data.trainingType === 'gi' ? 'Gi' :
                    data.trainingType === 'nogi' ? 'No-Gi' :
                    data.trainingType === 'openmat' ? 'open mat' :
                    data.trainingType === 'competition' ? 'competition prep' : 'training';

  parts.push(`${data.durationMinutes}-minute ${typeLabel} session.`);

  if (data.techniques.length > 0) {
    parts.push(`You drilled ${data.techniques.join(' and ').toLowerCase()}.`);
  }

  if (data.workedWell.length > 0) {
    parts.push(`${data.workedWell[0]} is clicking.`);
  }

  if (data.struggles.length > 0) {
    parts.push(`Still working on ${data.struggles[0].toLowerCase()}.`);
  }

  return parts.join(' ');
};

const trainingTypeLabels: Record<Session['trainingType'], string> = {
  gi: 'Gi',
  nogi: 'No-Gi',
  openmat: 'Open Mat',
  private: 'Private',
  competition: 'Competition',
};

interface SessionDetailProps {
  session: Session;
  onBack: () => void;
  onSave?: (session: SessionDetailData) => void;
}

// Edit affordance button component
function EditButton({ onClick, hasChanges }: { onClick: () => void; hasChanges?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        padding: 'var(--space-xs)',
        cursor: 'pointer',
        color: hasChanges ? 'var(--color-accent)' : 'var(--color-gray-400)',
        opacity: 0.8,
        transition: 'all 0.2s',
        position: 'relative',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.color = 'var(--color-accent)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.opacity = '0.8';
        e.currentTarget.style.color = hasChanges ? 'var(--color-accent)' : 'var(--color-gray-400)';
      }}
      aria-label="Edit"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
      {hasChanges && (
        <span style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 8,
          height: 8,
          backgroundColor: 'var(--color-accent)',
          borderRadius: 'var(--radius-full)',
        }} />
      )}
    </button>
  );
}

export function SessionDetail({ session, onBack, onSave }: SessionDetailProps) {
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  // UI state
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);

  // Active edit sheet
  const [activeSheet, setActiveSheet] = useState<
    'training' | 'techniques' | 'working' | 'struggles' | 'notes' | 'energy' | 'sparring' | null
  >(null);

  // Session data state (editable copy)
  const [data, setData] = useState<SessionDetailData>(() => getExtendedSessionData(session));

  // Track original data for comparison
  const [originalData] = useState<SessionDetailData>(() => getExtendedSessionData(session));

  // Derive hasUnsavedChanges from data comparison (avoids cascading renders)
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(data) !== JSON.stringify(originalData);
  }, [data, originalData]);

  // Generate narrative from current data
  const narrativeSummary = generateNarrativeSummary(data);

  // Handle entering edit mode
  const handleEnterEditMode = () => {
    setIsEditing(true);
  };

  // Handle exiting edit mode
  const handleExitEditMode = () => {
    if (hasUnsavedChanges) {
      setShowDiscardConfirm(true);
    } else {
      setIsEditing(false);
    }
  };

  // Handle save
  const handleSave = () => {
    onSave?.(data);
    setIsEditing(false);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  // Handle discard
  const handleDiscard = () => {
    setData(getExtendedSessionData(session));
    setIsEditing(false);
    setShowDiscardConfirm(false);
  };

  // Handle back with unsaved changes check
  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowDiscardConfirm(true);
    } else {
      onBack();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-gray-100)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'var(--color-primary)',
        padding: 'var(--space-lg)',
        paddingTop: 'max(var(--space-lg), env(safe-area-inset-top))',
        borderBottom: isEditing ? '3px solid var(--color-accent)' : 'none',
        transition: 'border-color 0.3s',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-md)',
        }}>
          <button
            onClick={handleBack}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-gray-300)',
              cursor: 'pointer',
              padding: 'var(--space-sm)',
              marginLeft: '-var(--space-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-xs)',
              fontSize: 'var(--text-base)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>

          {/* Edit Mode Toggle */}
          {!isEditing ? (
            <button
              onClick={handleEnterEditMode}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-gray-600)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-sm) var(--space-md)',
                color: 'var(--color-gray-300)',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-wide)',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent)';
                e.currentTarget.style.color = 'var(--color-accent)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-gray-600)';
                e.currentTarget.style.color = 'var(--color-gray-300)';
              }}
            >
              Edit
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button
                onClick={handleExitEditMode}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--color-gray-600)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-sm) var(--space-md)',
                  color: 'var(--color-gray-300)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--tracking-wide)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                style={{
                  background: hasUnsavedChanges ? 'var(--color-accent)' : 'var(--color-gray-700)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-sm) var(--space-md)',
                  color: hasUnsavedChanges ? 'var(--color-primary)' : 'var(--color-gray-500)',
                  cursor: hasUnsavedChanges ? 'pointer' : 'not-allowed',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--tracking-wide)',
                  transition: 'all 0.2s',
                }}
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* Edit mode indicator */}
        {isEditing && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-md)',
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: 'rgba(252, 211, 77, 0.1)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(252, 211, 77, 0.3)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-accent)',
            }}>
              Tap any section to edit
            </span>
            {hasUnsavedChanges && (
              <span style={{
                marginLeft: 'auto',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-accent)',
                fontWeight: 600,
              }}>
                Unsaved changes
              </span>
            )}
          </div>
        )}

        {/* Date/Time/Type header - now editable in edit mode */}
        <div
          onClick={() => isEditing && setActiveSheet('training')}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            cursor: isEditing ? 'pointer' : 'default',
            padding: isEditing ? 'var(--space-sm)' : 0,
            marginLeft: isEditing ? 'calc(-1 * var(--space-sm))' : 0,
            marginRight: isEditing ? 'calc(-1 * var(--space-sm))' : 0,
            borderRadius: 'var(--radius-md)',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => {
            if (isEditing) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <div>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              color: 'var(--color-white)',
              marginBottom: 'var(--space-xs)',
            }}>
              {data.date}
            </h1>
            <div style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-gray-400)',
            }}>
              {data.time} • {data.durationMinutes} min
              {data.sparringRounds ? ` • ${data.sparringRounds} rounds` : ''}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <span
              className={`training-badge training-${data.trainingType}`}
              style={{ fontSize: 'var(--text-base)' }}
            >
              {trainingTypeLabels[data.trainingType]}
            </span>
            {isEditing && <EditButton onClick={() => setActiveSheet('training')} />}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: 'var(--space-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
      }}>
        {/* AI Narrative Summary - Collapsible */}
        <div className="card" style={{
          borderLeft: '4px solid var(--color-accent)',
          backgroundColor: 'var(--color-gray-50)',
        }}>
          <button
            onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-widest)',
                color: 'var(--color-gray-500)',
                marginBottom: 'var(--space-xs)',
              }}>
                Session Summary
              </div>
              {isSummaryExpanded && (
                <p style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-gray-700)',
                  lineHeight: 'var(--leading-relaxed)',
                  fontStyle: 'italic',
                }}>
                  "{narrativeSummary}"
                </p>
              )}
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-gray-400)"
              strokeWidth="2"
              style={{
                transform: isSummaryExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                flexShrink: 0,
                marginLeft: 'var(--space-md)',
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {/* Energy & Mood Section */}
        <div
          className="card"
          onClick={() => isEditing && setActiveSheet('energy')}
          style={{
            cursor: isEditing ? 'pointer' : 'default',
            transition: 'box-shadow 0.2s, transform 0.2s',
          }}
          onMouseOver={(e) => {
            if (isEditing) {
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-sm)',
          }}>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-widest)',
              color: 'var(--color-gray-500)',
            }}>
              How You Felt
            </div>
            {isEditing && <EditButton onClick={() => setActiveSheet('energy')} />}
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-xl)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-400)', marginBottom: 'var(--space-xs)' }}>Energy</div>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    style={{
                      width: 24,
                      height: 8,
                      borderRadius: 2,
                      backgroundColor: level <= data.energyLevel ? 'var(--color-warning)' : 'var(--color-gray-200)',
                    }}
                  />
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-400)', marginBottom: 'var(--space-xs)' }}>Mood</div>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    style={{
                      width: 24,
                      height: 8,
                      borderRadius: 2,
                      backgroundColor: level <= data.mood ? 'var(--color-info)' : 'var(--color-gray-200)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Techniques Section */}
        <div
          className="card"
          onClick={() => isEditing && setActiveSheet('techniques')}
          style={{
            cursor: isEditing ? 'pointer' : 'default',
            transition: 'box-shadow 0.2s, transform 0.2s',
          }}
          onMouseOver={(e) => {
            if (isEditing) {
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-sm)',
          }}>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-widest)',
              color: 'var(--color-gray-500)',
            }}>
              Techniques Drilled
            </div>
            {isEditing && <EditButton onClick={() => setActiveSheet('techniques')} />}
          </div>
          {data.techniques.length > 0 ? (
            data.techniques.map((tech, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-sm) 0',
                  borderBottom: i < data.techniques.length - 1 ? '1px solid var(--color-gray-200)' : 'none',
                }}
              >
                <span style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-gray-800)',
                }}>
                  {tech}
                </span>
              </div>
            ))
          ) : (
            <div style={{
              padding: 'var(--space-md)',
              textAlign: 'center',
              color: 'var(--color-gray-400)',
              border: '2px dashed var(--color-gray-200)',
              borderRadius: 'var(--radius-md)',
            }}>
              {isEditing ? 'Tap to add techniques' : 'No techniques recorded'}
            </div>
          )}
        </div>

        {/* Sparring Section */}
        {(data.sparringRounds || isEditing) && (
          <div
            className="card"
            onClick={() => isEditing && setActiveSheet('sparring')}
            style={{
              cursor: isEditing ? 'pointer' : 'default',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
            onMouseOver={(e) => {
              if (isEditing) {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-sm)',
            }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-widest)',
                color: 'var(--color-gray-500)',
              }}>
                Sparring ({data.sparringRounds || 0} rounds)
              </div>
              {isEditing && <EditButton onClick={() => setActiveSheet('sparring')} />}
            </div>
            {data.sparringDetails.length > 0 ? (
              data.sparringDetails.map((round, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-sm) 0',
                    borderBottom: i < data.sparringDetails.length - 1 ? '1px solid var(--color-gray-200)' : 'none',
                  }}
                >
                  <span style={{ color: 'var(--color-gray-700)' }}>
                    vs {round.partnerName} ({round.partnerBelt})
                  </span>
                  <span style={{
                    color: round.outcome.includes('win') ? 'var(--color-success)' :
                           round.outcome.includes('loss') ? 'var(--color-error)' :
                           'var(--color-gray-500)',
                    fontSize: 'var(--text-sm)',
                  }}>
                    {round.outcome.replace('-', ' ')}
                  </span>
                </div>
              ))
            ) : (
              <div style={{
                padding: 'var(--space-md)',
                textAlign: 'center',
                color: 'var(--color-gray-400)',
                border: '2px dashed var(--color-gray-200)',
                borderRadius: 'var(--radius-md)',
              }}>
                {isEditing ? 'Tap to add round details' : 'No round details recorded'}
              </div>
            )}
          </div>
        )}

        {/* What's Working Section */}
        <div
          className="card"
          onClick={() => isEditing && setActiveSheet('working')}
          style={{
            backgroundColor: 'rgba(34, 197, 94, 0.08)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            cursor: isEditing ? 'pointer' : 'default',
            transition: 'box-shadow 0.2s, transform 0.2s',
          }}
          onMouseOver={(e) => {
            if (isEditing) {
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-sm)',
          }}>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-widest)',
              color: 'var(--color-success)',
            }}>
              What's Working
            </div>
            {isEditing && <EditButton onClick={() => setActiveSheet('working')} />}
          </div>
          {data.workedWell.length > 0 ? (
            data.workedWell.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-sm)',
                  padding: 'var(--space-xs) 0',
                }}
              >
                <span style={{
                  color: 'var(--color-success)',
                  fontWeight: 600,
                  fontSize: 'var(--text-lg)',
                }}>
                  ✓
                </span>
                <span style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-gray-700)',
                }}>
                  {item}
                </span>
              </div>
            ))
          ) : (
            <div style={{
              padding: 'var(--space-md)',
              textAlign: 'center',
              color: 'var(--color-success-text)',
            }}>
              {isEditing ? 'Tap to add what went well' : 'Nothing recorded yet'}
            </div>
          )}
        </div>

        {/* Needs Work Section */}
        <div
          className="card"
          onClick={() => isEditing && setActiveSheet('struggles')}
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            cursor: isEditing ? 'pointer' : 'default',
            transition: 'box-shadow 0.2s, transform 0.2s',
          }}
          onMouseOver={(e) => {
            if (isEditing) {
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-sm)',
          }}>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-widest)',
              color: 'var(--color-error)',
            }}>
              Needs Work
            </div>
            {isEditing && <EditButton onClick={() => setActiveSheet('struggles')} />}
          </div>
          {data.struggles.length > 0 ? (
            data.struggles.map((struggle, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-sm)',
                  padding: 'var(--space-xs) 0',
                }}
              >
                <span style={{
                  color: 'var(--color-error)',
                  fontWeight: 600,
                  fontSize: 'var(--text-lg)',
                }}>
                  ✗
                </span>
                <span style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-gray-700)',
                }}>
                  {struggle}
                </span>
              </div>
            ))
          ) : (
            <div style={{
              padding: 'var(--space-md)',
              textAlign: 'center',
              color: 'var(--color-error-text)',
            }}>
              {isEditing ? 'Tap to add areas for improvement' : 'Nothing recorded yet'}
            </div>
          )}
        </div>

        {/* Notes/Reflection Section */}
        <div
          className="card"
          onClick={() => isEditing && setActiveSheet('notes')}
          style={{
            cursor: isEditing ? 'pointer' : 'default',
            transition: 'box-shadow 0.2s, transform 0.2s',
          }}
          onMouseOver={(e) => {
            if (isEditing) {
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-sm)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
            }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-widest)',
                color: 'var(--color-gray-500)',
              }}>
                Personal Notes
              </span>
              {data.isPrivate && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-400)" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}
            </div>
            {isEditing && <EditButton onClick={() => setActiveSheet('notes')} />}
          </div>
          {data.notes ? (
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-gray-700)',
              lineHeight: 'var(--leading-relaxed)',
              whiteSpace: 'pre-wrap',
            }}>
              {data.notes}
            </p>
          ) : (
            <div style={{
              padding: 'var(--space-lg)',
              textAlign: 'center',
              color: 'var(--color-gray-400)',
              border: '2px dashed var(--color-gray-200)',
              borderRadius: 'var(--radius-md)',
            }}>
              {isEditing ? 'Tap to add a reflection' : 'No notes added'}
            </div>
          )}
        </div>

        {/* Bottom padding for safe area */}
        <div style={{ height: 'var(--space-xl)' }} />
      </div>

      {/* Edit Sheets */}
      <TrainingDetailsEdit
        isOpen={activeSheet === 'training'}
        onClose={() => setActiveSheet(null)}
        trainingType={data.trainingType}
        durationMinutes={data.durationMinutes}
        sparringRounds={data.sparringRounds || 0}
        onSave={(updates) => {
          setData({
            ...data,
            ...updates,
          });
        }}
      />

      <TechniquesEdit
        isOpen={activeSheet === 'techniques'}
        onClose={() => setActiveSheet(null)}
        techniques={data.techniques}
        onSave={(techniques) => {
          setData({ ...data, techniques });
        }}
      />

      <InsightsEdit
        isOpen={activeSheet === 'working'}
        onClose={() => setActiveSheet(null)}
        items={data.workedWell}
        type="working"
        onSave={(workedWell) => {
          setData({ ...data, workedWell });
        }}
      />

      <InsightsEdit
        isOpen={activeSheet === 'struggles'}
        onClose={() => setActiveSheet(null)}
        items={data.struggles}
        type="struggles"
        onSave={(struggles) => {
          setData({ ...data, struggles });
        }}
      />

      <NotesEdit
        isOpen={activeSheet === 'notes'}
        onClose={() => setActiveSheet(null)}
        notes={data.notes}
        isPrivate={data.isPrivate}
        onSave={({ notes, isPrivate }) => {
          setData({ ...data, notes, isPrivate });
        }}
      />

      <EnergyMoodEdit
        isOpen={activeSheet === 'energy'}
        onClose={() => setActiveSheet(null)}
        energyLevel={data.energyLevel}
        mood={data.mood}
        onSave={({ energyLevel, mood }) => {
          setData({ ...data, energyLevel, mood });
        }}
      />

      <SparringEdit
        isOpen={activeSheet === 'sparring'}
        onClose={() => setActiveSheet(null)}
        rounds={data.sparringDetails}
        roundCount={data.sparringRounds || 0}
        onSave={({ rounds, roundCount }) => {
          setData({
            ...data,
            sparringDetails: rounds,
            sparringRounds: roundCount,
          });
        }}
      />

      {/* Discard Confirmation Modal */}
      {showDiscardConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-lg)',
        }}>
          <div style={{
            backgroundColor: 'var(--color-white)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-xl)',
            maxWidth: 340,
            width: '100%',
            textAlign: 'center',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-lg)',
              marginBottom: 'var(--space-sm)',
            }}>
              Discard changes?
            </h3>
            <p style={{
              color: 'var(--color-gray-600)',
              marginBottom: 'var(--space-xl)',
              lineHeight: 'var(--leading-relaxed)',
            }}>
              You have unsaved changes. Are you sure you want to discard them?
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button
                onClick={() => setShowDiscardConfirm(false)}
                style={{
                  flex: 1,
                  padding: 'var(--space-md)',
                  border: '1px solid var(--color-gray-300)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-gray-700)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Keep Editing
              </button>
              <button
                onClick={handleDiscard}
                style={{
                  flex: 1,
                  padding: 'var(--space-md)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-error)',
                  color: 'var(--color-white)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Success Toast */}
      {showSaveToast && (
        <div style={{
          position: 'fixed',
          bottom: 'max(var(--space-xl), env(safe-area-inset-bottom))',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3000,
          backgroundColor: 'var(--color-success)',
          color: 'var(--color-white)',
          padding: 'var(--space-md) var(--space-xl)',
          borderRadius: 'var(--radius-full)',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Session updated
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(100%); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default SessionDetail;
