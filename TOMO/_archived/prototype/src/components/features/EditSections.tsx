/**
 * Edit Section Components
 * Individual edit sheets for each session data section
 *
 * UX Philosophy:
 * - Each section is self-contained and focused
 * - Visual feedback for every action
 * - Easy add/remove with confirmation for destructive actions
 * - Smart suggestions where applicable
 */

import { useState } from 'react';
import { EditSheet } from './EditSheet';
import { type Session } from './SessionCard';

// ============================================
// TRAINING DETAILS EDIT SHEET
// Edit: Training Type, Duration, Date/Time
// ============================================

interface TrainingDetailsEditProps {
  isOpen: boolean;
  onClose: () => void;
  trainingType: Session['trainingType'];
  durationMinutes: number;
  sparringRounds: number;
  onSave: (data: {
    trainingType: Session['trainingType'];
    durationMinutes: number;
    sparringRounds: number;
  }) => void;
}

const trainingTypes: { value: Session['trainingType']; label: string; color: string }[] = [
  { value: 'gi', label: 'Gi', color: 'var(--color-info)' },
  { value: 'nogi', label: 'No-Gi', color: 'var(--color-warning)' },
  { value: 'openmat', label: 'Open Mat', color: '#A855F7' },
  { value: 'private', label: 'Private', color: 'var(--color-success)' },
  { value: 'competition', label: 'Competition', color: 'var(--color-error)' },
];

const durationPresets = [30, 45, 60, 75, 90, 120];

export function TrainingDetailsEdit({
  isOpen,
  onClose,
  trainingType: initialType,
  durationMinutes: initialDuration,
  sparringRounds: initialRounds,
  onSave,
}: TrainingDetailsEditProps) {
  const [trainingType, setTrainingType] = useState(initialType);
  const [durationMinutes, setDurationMinutes] = useState(initialDuration);
  const [sparringRounds, setSparringRounds] = useState(initialRounds);

  const handleSave = () => {
    onSave({ trainingType, durationMinutes, sparringRounds });
    onClose();
  };

  return (
    <EditSheet
      isOpen={isOpen}
      onClose={onClose}
      onDone={handleSave}
      title="Training Details"
      subtitle="Adjust your session info"
      height="auto"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
        {/* Training Type */}
        <div>
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
            Training Type
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--space-sm)',
          }}>
            {trainingTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setTrainingType(type.value)}
                style={{
                  padding: 'var(--space-md) var(--space-sm)',
                  border: trainingType === type.value
                    ? `2px solid ${type.color}`
                    : '2px solid var(--color-gray-700)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: trainingType === type.value
                    ? `${type.color}15`
                    : 'transparent',
                  color: trainingType === type.value
                    ? type.color
                    : 'var(--color-gray-300)',
                  fontWeight: 600,
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
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
            Duration
          </label>
          <div style={{
            display: 'flex',
            gap: 'var(--space-sm)',
            flexWrap: 'wrap',
          }}>
            {durationPresets.map((mins) => (
              <button
                key={mins}
                onClick={() => setDurationMinutes(mins)}
                style={{
                  padding: 'var(--space-sm) var(--space-md)',
                  border: durationMinutes === mins
                    ? '2px solid var(--color-accent)'
                    : '2px solid var(--color-gray-700)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: durationMinutes === mins
                    ? 'rgba(252, 211, 77, 0.15)'
                    : 'transparent',
                  color: durationMinutes === mins
                    ? 'var(--color-accent)'
                    : 'var(--color-gray-300)',
                  fontWeight: 600,
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {mins} min
              </button>
            ))}
          </div>
          {/* Custom duration input */}
          <div style={{
            marginTop: 'var(--space-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
          }}>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              min={1}
              max={300}
              style={{
                width: 80,
                padding: 'var(--space-sm)',
                border: '1px solid var(--color-gray-600)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-gray-900)',
                color: 'var(--color-white)',
                fontSize: 'var(--text-base)',
                textAlign: 'center',
              }}
            />
            <span style={{ color: 'var(--color-gray-400)' }}>minutes</span>
          </div>
        </div>

        {/* Sparring Rounds */}
        <div>
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
            Sparring Rounds
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-md)',
          }}>
            <button
              onClick={() => setSparringRounds(Math.max(0, sparringRounds - 1))}
              style={{
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--color-gray-600)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'transparent',
                color: 'var(--color-gray-300)',
                fontSize: 'var(--text-xl)',
                cursor: 'pointer',
              }}
            >
              −
            </button>
            <span style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: 'var(--color-white)',
              minWidth: 50,
              textAlign: 'center',
            }}>
              {sparringRounds}
            </span>
            <button
              onClick={() => setSparringRounds(sparringRounds + 1)}
              style={{
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--color-gray-600)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'transparent',
                color: 'var(--color-gray-300)',
                fontSize: 'var(--text-xl)',
                cursor: 'pointer',
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </EditSheet>
  );
}


// ============================================
// TECHNIQUES EDIT SHEET
// Add, remove, reorder techniques drilled
// ============================================

interface TechniquesEditProps {
  isOpen: boolean;
  onClose: () => void;
  techniques: string[];
  onSave: (techniques: string[]) => void;
}

// Common techniques for suggestions
const TECHNIQUE_SUGGESTIONS = [
  'Armbar from guard',
  'Triangle choke',
  'Kimura',
  'Americana',
  'Rear naked choke',
  'Guillotine',
  'Knee slice pass',
  'Toreando pass',
  'Hip escape',
  'Bridge and roll',
  'Scissor sweep',
  'Flower sweep',
  'Half guard retention',
  'Closed guard control',
  'Mount escapes',
  'Side control escapes',
  'Back takes',
  'Arm drag series',
  'Single leg defense',
  'Double leg takedown',
];

export function TechniquesEdit({
  isOpen,
  onClose,
  techniques: initialTechniques,
  onSave,
}: TechniquesEditProps) {
  const [techniques, setTechniques] = useState<string[]>(initialTechniques);
  const [newTechnique, setNewTechnique] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter suggestions based on input
  const filteredSuggestions = TECHNIQUE_SUGGESTIONS.filter(
    (t) =>
      t.toLowerCase().includes(newTechnique.toLowerCase()) &&
      !techniques.includes(t)
  );

  const handleAddTechnique = (tech: string) => {
    if (tech.trim() && !techniques.includes(tech.trim())) {
      setTechniques([...techniques, tech.trim()]);
      setNewTechnique('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveTechnique = (index: number) => {
    setTechniques(techniques.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(techniques);
    onClose();
  };

  return (
    <EditSheet
      isOpen={isOpen}
      onClose={onClose}
      onDone={handleSave}
      title="Techniques Drilled"
      subtitle="What did you work on?"
      height="full"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {/* Add new technique input */}
        <div style={{ position: 'relative' }}>
          <div style={{
            display: 'flex',
            gap: 'var(--space-sm)',
          }}>
            <input
              type="text"
              value={newTechnique}
              onChange={(e) => {
                setNewTechnique(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => setShowSuggestions(newTechnique.length > 0)}
              placeholder="Add a technique..."
              style={{
                flex: 1,
                padding: 'var(--space-md)',
                border: '2px solid var(--color-gray-600)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-gray-900)',
                color: 'var(--color-white)',
                fontSize: 'var(--text-base)',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddTechnique(newTechnique);
                }
              }}
            />
            <button
              onClick={() => handleAddTechnique(newTechnique)}
              disabled={!newTechnique.trim()}
              style={{
                padding: 'var(--space-md) var(--space-lg)',
                backgroundColor: newTechnique.trim() ? 'var(--color-accent)' : 'var(--color-gray-700)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: newTechnique.trim() ? 'var(--color-primary)' : 'var(--color-gray-500)',
                fontWeight: 600,
                cursor: newTechnique.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
              }}
            >
              Add
            </button>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: 'var(--space-xs)',
              backgroundColor: 'var(--color-gray-900)',
              border: '1px solid var(--color-gray-600)',
              borderRadius: 'var(--radius-md)',
              maxHeight: 200,
              overflowY: 'auto',
              zIndex: 10,
            }}>
              {filteredSuggestions.slice(0, 5).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleAddTechnique(suggestion)}
                  style={{
                    width: '100%',
                    padding: 'var(--space-sm) var(--space-md)',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-gray-200)',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--color-gray-800)',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-gray-800)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Current techniques list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {techniques.length === 0 ? (
            <div style={{
              padding: 'var(--space-xl)',
              textAlign: 'center',
              color: 'var(--color-gray-500)',
              border: '2px dashed var(--color-gray-700)',
              borderRadius: 'var(--radius-md)',
            }}>
              No techniques added yet
            </div>
          ) : (
            techniques.map((tech, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-md)',
                  backgroundColor: 'var(--color-gray-900)',
                  border: '1px solid var(--color-gray-700)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <span style={{ color: 'var(--color-white)' }}>{tech}</span>
                <button
                  onClick={() => handleRemoveTechnique(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-error)',
                    cursor: 'pointer',
                    padding: 'var(--space-xs)',
                    opacity: 0.7,
                    transition: 'opacity 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}
                  aria-label="Remove technique"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Quick add from recent */}
        {techniques.length < 5 && (
          <div>
            <p style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-500)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wide)',
              marginBottom: 'var(--space-sm)',
            }}>
              Quick add
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
              {TECHNIQUE_SUGGESTIONS.slice(0, 6)
                .filter((t) => !techniques.includes(t))
                .map((tech) => (
                  <button
                    key={tech}
                    onClick={() => handleAddTechnique(tech)}
                    style={{
                      padding: 'var(--space-xs) var(--space-sm)',
                      backgroundColor: 'var(--color-gray-800)',
                      border: '1px solid var(--color-gray-600)',
                      borderRadius: 'var(--radius-full)',
                      color: 'var(--color-gray-300)',
                      fontSize: 'var(--text-sm)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-gray-700)';
                      e.currentTarget.style.color = 'var(--color-white)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-gray-800)';
                      e.currentTarget.style.color = 'var(--color-gray-300)';
                    }}
                  >
                    + {tech}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </EditSheet>
  );
}


// ============================================
// INSIGHTS EDIT SHEET
// For "What's Working" and "Needs Work" sections
// ============================================

interface InsightsEditProps {
  isOpen: boolean;
  onClose: () => void;
  items: string[];
  onSave: (items: string[]) => void;
  type: 'working' | 'struggles';
}

export function InsightsEdit({
  isOpen,
  onClose,
  items: initialItems,
  onSave,
  type,
}: InsightsEditProps) {
  const [items, setItems] = useState<string[]>(initialItems);
  const [newItem, setNewItem] = useState('');

  const isWorking = type === 'working';
  const accentColor = isWorking ? 'var(--color-success)' : 'var(--color-error)';
  const title = isWorking ? "What's Working" : "Needs Work";
  const subtitle = isWorking
    ? "What felt good this session?"
    : "What needs more practice?";
  const placeholder = isWorking
    ? "e.g., Knee slice passing felt smooth"
    : "e.g., Losing underhook in half guard";

  const handleAddItem = () => {
    if (newItem.trim() && !items.includes(newItem.trim())) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(items);
    onClose();
  };

  return (
    <EditSheet
      isOpen={isOpen}
      onClose={onClose}
      onDone={handleSave}
      title={title}
      subtitle={subtitle}
      height="half"
      accentColor={accentColor}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {/* Add new item */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-sm)',
        }}>
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={placeholder}
            style={{
              flex: 1,
              padding: 'var(--space-md)',
              border: `2px solid ${isWorking ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-gray-900)',
              color: 'var(--color-white)',
              fontSize: 'var(--text-base)',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddItem();
              }
            }}
          />
          <button
            onClick={handleAddItem}
            disabled={!newItem.trim()}
            style={{
              padding: 'var(--space-md) var(--space-lg)',
              backgroundColor: newItem.trim() ? accentColor : 'var(--color-gray-700)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: newItem.trim() ? 'var(--color-white)' : 'var(--color-gray-500)',
              fontWeight: 600,
              cursor: newItem.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Add
          </button>
        </div>

        {/* Current items list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {items.length === 0 ? (
            <div style={{
              padding: 'var(--space-xl)',
              textAlign: 'center',
              color: 'var(--color-gray-500)',
              border: '2px dashed var(--color-gray-700)',
              borderRadius: 'var(--radius-md)',
            }}>
              {isWorking
                ? "What went well today?"
                : "Any areas to focus on next time?"}
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)',
                  padding: 'var(--space-md)',
                  backgroundColor: isWorking
                    ? 'rgba(34, 197, 94, 0.1)'
                    : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${isWorking
                    ? 'rgba(34, 197, 94, 0.2)'
                    : 'rgba(239, 68, 68, 0.2)'}`,
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <span style={{
                  color: accentColor,
                  fontWeight: 600,
                  fontSize: 'var(--text-lg)',
                }}>
                  {isWorking ? '✓' : '✗'}
                </span>
                <span style={{
                  flex: 1,
                  color: 'var(--color-white)',
                }}>
                  {item}
                </span>
                <button
                  onClick={() => handleRemoveItem(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-gray-500)',
                    cursor: 'pointer',
                    padding: 'var(--space-xs)',
                    transition: 'color 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = accentColor}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-gray-500)'}
                  aria-label="Remove item"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </EditSheet>
  );
}


// ============================================
// NOTES EDIT SHEET
// Personal notes with privacy toggle
// ============================================

interface NotesEditProps {
  isOpen: boolean;
  onClose: () => void;
  notes: string;
  isPrivate: boolean;
  onSave: (data: { notes: string; isPrivate: boolean }) => void;
}

export function NotesEdit({
  isOpen,
  onClose,
  notes: initialNotes,
  isPrivate: initialPrivate,
  onSave,
}: NotesEditProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [isPrivate, setIsPrivate] = useState(initialPrivate);

  const handleSave = () => {
    onSave({ notes, isPrivate });
    onClose();
  };

  return (
    <EditSheet
      isOpen={isOpen}
      onClose={onClose}
      onDone={handleSave}
      title="Personal Notes"
      subtitle="Add a reflection about this session"
      height="half"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', height: '100%' }}>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did training feel today? Any breakthroughs or frustrations? What do you want to remember?"
          style={{
            flex: 1,
            minHeight: 150,
            padding: 'var(--space-md)',
            border: '2px solid var(--color-gray-600)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-gray-900)',
            color: 'var(--color-white)',
            fontSize: 'var(--text-base)',
            fontFamily: 'inherit',
            lineHeight: 'var(--leading-relaxed)',
            resize: 'vertical',
          }}
        />

        {/* Privacy toggle */}
        <button
          onClick={() => setIsPrivate(!isPrivate)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-md)',
            backgroundColor: isPrivate
              ? 'rgba(252, 211, 77, 0.1)'
              : 'var(--color-gray-900)',
            border: isPrivate
              ? '1px solid rgba(252, 211, 77, 0.3)'
              : '1px solid var(--color-gray-700)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isPrivate ? 'var(--color-accent)' : 'var(--color-gray-400)'}
              strokeWidth="2"
            >
              {isPrivate ? (
                <>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </>
              ) : (
                <>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                </>
              )}
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{
                color: isPrivate ? 'var(--color-accent)' : 'var(--color-white)',
                fontWeight: 600,
              }}>
                {isPrivate ? 'Private note' : 'Visible note'}
              </div>
              <div style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-gray-400)',
              }}>
                {isPrivate
                  ? 'Only you can see this'
                  : 'May be visible to coach or training partners'}
              </div>
            </div>
          </div>

          {/* Toggle switch */}
          <div style={{
            width: 44,
            height: 24,
            backgroundColor: isPrivate ? 'var(--color-accent)' : 'var(--color-gray-600)',
            borderRadius: 'var(--radius-full)',
            padding: 2,
            transition: 'background-color 0.2s',
          }}>
            <div style={{
              width: 20,
              height: 20,
              backgroundColor: 'var(--color-white)',
              borderRadius: 'var(--radius-full)',
              transform: isPrivate ? 'translateX(20px)' : 'translateX(0)',
              transition: 'transform 0.2s',
            }} />
          </div>
        </button>
      </div>
    </EditSheet>
  );
}


// ============================================
// ENERGY & MOOD EDIT SHEET
// Visual sliders for energy and mood
// ============================================

interface EnergyMoodEditProps {
  isOpen: boolean;
  onClose: () => void;
  energyLevel: 1 | 2 | 3 | 4 | 5;
  mood: 1 | 2 | 3 | 4 | 5;
  onSave: (data: { energyLevel: 1 | 2 | 3 | 4 | 5; mood: 1 | 2 | 3 | 4 | 5 }) => void;
}

const energyLabels = ['Exhausted', 'Tired', 'Normal', 'Energized', 'Peak'];
const moodLabels = ['Frustrated', 'Discouraged', 'Neutral', 'Good', 'Great'];

export function EnergyMoodEdit({
  isOpen,
  onClose,
  energyLevel: initialEnergy,
  mood: initialMood,
  onSave,
}: EnergyMoodEditProps) {
  const [energyLevel, setEnergyLevel] = useState<1 | 2 | 3 | 4 | 5>(initialEnergy);
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5>(initialMood);

  const handleSave = () => {
    onSave({ energyLevel, mood });
    onClose();
  };

  const renderScale = (
    value: number,
    onChange: (val: 1 | 2 | 3 | 4 | 5) => void,
    labels: string[],
    color: string
  ) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 'var(--space-xs)',
      }}>
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            onClick={() => onChange(level as 1 | 2 | 3 | 4 | 5)}
            style={{
              flex: 1,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: value === level
                ? `2px solid ${color}`
                : '2px solid var(--color-gray-700)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: value === level
                ? `${color}20`
                : 'transparent',
              color: value === level
                ? color
                : 'var(--color-gray-400)',
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {level}
          </button>
        ))}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 'var(--text-xs)',
        color: 'var(--color-gray-500)',
      }}>
        <span>{labels[0]}</span>
        <span>{labels[4]}</span>
      </div>
      <div style={{
        textAlign: 'center',
        fontSize: 'var(--text-base)',
        color: color,
        fontWeight: 600,
        minHeight: 24,
      }}>
        {labels[value - 1]}
      </div>
    </div>
  );

  return (
    <EditSheet
      isOpen={isOpen}
      onClose={onClose}
      onDone={handleSave}
      title="How Did You Feel?"
      subtitle="Track your energy and mood"
      height="auto"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
        {/* Energy Level */}
        <div>
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
            Energy Level
          </label>
          {renderScale(energyLevel, setEnergyLevel, energyLabels, 'var(--color-warning)')}
        </div>

        {/* Mood */}
        <div>
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
            Mood
          </label>
          {renderScale(mood, setMood, moodLabels, 'var(--color-info)')}
        </div>
      </div>
    </EditSheet>
  );
}


// ============================================
// SPARRING ROUNDS EDIT SHEET
// Add, edit, remove sparring rounds
// ============================================

interface SparringRound {
  partnerId: string;
  partnerName: string;
  partnerBelt: string;
  outcome: 'submission-win' | 'submission-loss' | 'points-win' | 'points-loss' | 'draw' | 'positional';
  submissionType?: string;
  notes?: string;
}

interface SparringEditProps {
  isOpen: boolean;
  onClose: () => void;
  rounds: SparringRound[];
  roundCount: number;
  onSave: (data: { rounds: SparringRound[]; roundCount: number }) => void;
}

const outcomes = [
  { value: 'submission-win', label: 'Sub Win', color: 'var(--color-success)' },
  { value: 'submission-loss', label: 'Sub Loss', color: 'var(--color-error)' },
  { value: 'points-win', label: 'Points Win', color: 'var(--color-success)' },
  { value: 'points-loss', label: 'Points Loss', color: 'var(--color-error)' },
  { value: 'draw', label: 'Draw', color: 'var(--color-gray-400)' },
  { value: 'positional', label: 'Positional', color: 'var(--color-info)' },
];

const belts = ['White', 'Blue', 'Purple', 'Brown', 'Black'];

export function SparringEdit({
  isOpen,
  onClose,
  rounds: initialRounds,
  roundCount: initialCount,
  onSave,
}: SparringEditProps) {
  const [rounds, setRounds] = useState<SparringRound[]>(initialRounds);
  const [roundCount, setRoundCount] = useState(initialCount);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newRound, setNewRound] = useState<Partial<SparringRound>>({});

  const handleAddRound = () => {
    if (newRound.partnerName) {
      const round: SparringRound = {
        partnerId: `partner-${Date.now()}`,
        partnerName: newRound.partnerName,
        partnerBelt: newRound.partnerBelt || 'White',
        outcome: newRound.outcome || 'positional',
        submissionType: newRound.submissionType,
        notes: newRound.notes,
      };
      setRounds([...rounds, round]);
      setRoundCount(roundCount + 1);
      setNewRound({});
      setEditingIndex(null);
    }
  };

  const handleRemoveRound = (index: number) => {
    setRounds(rounds.filter((_, i) => i !== index));
    setRoundCount(Math.max(0, roundCount - 1));
  };

  const handleSave = () => {
    onSave({ rounds, roundCount });
    onClose();
  };

  return (
    <EditSheet
      isOpen={isOpen}
      onClose={onClose}
      onDone={handleSave}
      title="Sparring Rounds"
      subtitle={`${roundCount} round${roundCount !== 1 ? 's' : ''} recorded`}
      height="full"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {/* Round count quick adjust */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-md)',
          backgroundColor: 'var(--color-gray-900)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-gray-700)',
        }}>
          <span style={{ color: 'var(--color-gray-300)' }}>Total rounds</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <button
              onClick={() => setRoundCount(Math.max(0, roundCount - 1))}
              style={{
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--color-gray-600)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'transparent',
                color: 'var(--color-gray-300)',
                cursor: 'pointer',
              }}
            >
              −
            </button>
            <span style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              color: 'var(--color-white)',
              minWidth: 30,
              textAlign: 'center',
            }}>
              {roundCount}
            </span>
            <button
              onClick={() => setRoundCount(roundCount + 1)}
              style={{
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--color-gray-600)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'transparent',
                color: 'var(--color-gray-300)',
                cursor: 'pointer',
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Detailed rounds */}
        <div>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-gray-500)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            marginBottom: 'var(--space-sm)',
          }}>
            Round Details (optional)
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {rounds.map((round, index) => (
              <div
                key={index}
                style={{
                  padding: 'var(--space-md)',
                  backgroundColor: 'var(--color-gray-900)',
                  border: '1px solid var(--color-gray-700)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ color: 'var(--color-white)', fontWeight: 600 }}>
                      vs {round.partnerName}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-gray-400)',
                    }}>
                      {round.partnerBelt} belt •{' '}
                      <span style={{
                        color: outcomes.find(o => o.value === round.outcome)?.color,
                      }}>
                        {outcomes.find(o => o.value === round.outcome)?.label}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveRound(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-gray-500)',
                      cursor: 'pointer',
                      padding: 'var(--space-xs)',
                    }}
                    aria-label="Remove round"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {/* Add new round form */}
            <div style={{
              padding: 'var(--space-md)',
              border: '2px dashed var(--color-gray-700)',
              borderRadius: 'var(--radius-md)',
            }}>
              {editingIndex === -1 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  <input
                    type="text"
                    placeholder="Partner's name"
                    value={newRound.partnerName || ''}
                    onChange={(e) => setNewRound({ ...newRound, partnerName: e.target.value })}
                    style={{
                      padding: 'var(--space-sm)',
                      border: '1px solid var(--color-gray-600)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-gray-900)',
                      color: 'var(--color-white)',
                    }}
                  />
                  <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    <select
                      value={newRound.partnerBelt || 'White'}
                      onChange={(e) => setNewRound({ ...newRound, partnerBelt: e.target.value })}
                      style={{
                        flex: 1,
                        padding: 'var(--space-sm)',
                        border: '1px solid var(--color-gray-600)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-gray-900)',
                        color: 'var(--color-white)',
                      }}
                    >
                      {belts.map(belt => (
                        <option key={belt} value={belt}>{belt}</option>
                      ))}
                    </select>
                    <select
                      value={newRound.outcome || 'positional'}
                      onChange={(e) => setNewRound({ ...newRound, outcome: e.target.value as SparringRound['outcome'] })}
                      style={{
                        flex: 1,
                        padding: 'var(--space-sm)',
                        border: '1px solid var(--color-gray-600)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-gray-900)',
                        color: 'var(--color-white)',
                      }}
                    >
                      {outcomes.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    <button
                      onClick={() => setEditingIndex(null)}
                      style={{
                        flex: 1,
                        padding: 'var(--space-sm)',
                        border: '1px solid var(--color-gray-600)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'transparent',
                        color: 'var(--color-gray-300)',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddRound}
                      disabled={!newRound.partnerName}
                      style={{
                        flex: 1,
                        padding: 'var(--space-sm)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: newRound.partnerName ? 'var(--color-accent)' : 'var(--color-gray-700)',
                        color: newRound.partnerName ? 'var(--color-primary)' : 'var(--color-gray-500)',
                        fontWeight: 600,
                        cursor: newRound.partnerName ? 'pointer' : 'not-allowed',
                      }}
                    >
                      Add Round
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setEditingIndex(-1)}
                  style={{
                    width: '100%',
                    padding: 'var(--space-md)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-gray-400)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-sm)',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add round details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </EditSheet>
  );
}
