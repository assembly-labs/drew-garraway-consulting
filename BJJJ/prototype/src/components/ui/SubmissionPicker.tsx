/**
 * SubmissionPicker Component
 *
 * UX-optimized submission selection for exhausted post-training users.
 * Designed with body-region-first approach for quick selection.
 *
 * Flow:
 * 1. User's go-to submissions (learned from history) shown first
 * 2. Body region buttons (Neck, Arms, Legs)
 * 3. Expand to see common submissions for that region
 * 4. Tap to add/increment count (shows "×2" badge)
 * 5. X to remove entirely
 *
 * Design: Large touch targets (56px+), minimal cognitive load
 */

import { useState } from 'react';
import type { SubmissionCount } from '../../types/database';

// ===========================================
// SUBMISSION DATA BY BODY REGION
// ===========================================

// Simplified 3-region type for UI picker (groups granular regions)
type PickerRegion = 'neck' | 'arms' | 'legs';

interface SubmissionOption {
  name: string;
  region: PickerRegion;
  common: boolean; // Show in quick picks
}

const SUBMISSIONS_BY_REGION: Record<PickerRegion, SubmissionOption[]> = {
  neck: [
    { name: 'RNC', region: 'neck', common: true },
    { name: 'Triangle', region: 'neck', common: true },
    { name: 'Guillotine', region: 'neck', common: true },
    { name: 'Darce', region: 'neck', common: true },
    { name: 'Anaconda', region: 'neck', common: false },
    { name: 'Ezekiel', region: 'neck', common: false },
    { name: 'Bow and Arrow', region: 'neck', common: false },
    { name: 'Baseball Bat Choke', region: 'neck', common: false },
    { name: 'North South Choke', region: 'neck', common: false },
    { name: 'Arm Triangle', region: 'neck', common: true },
    { name: 'Loop Choke', region: 'neck', common: false },
    { name: 'Clock Choke', region: 'neck', common: false },
    { name: 'Cross Collar Choke', region: 'neck', common: false },
    { name: 'Paper Cutter', region: 'neck', common: false },
    { name: 'Von Flue Choke', region: 'neck', common: false },
    { name: 'Peruvian Necktie', region: 'neck', common: false },
  ],
  arms: [
    { name: 'Armbar', region: 'arms', common: true },
    { name: 'Kimura', region: 'arms', common: true },
    { name: 'Americana', region: 'arms', common: true },
    { name: 'Omoplata', region: 'arms', common: true },
    { name: 'Wristlock', region: 'arms', common: false },
    { name: 'Straight Armlock', region: 'arms', common: false },
    { name: 'Bicep Slicer', region: 'arms', common: false },
    { name: 'Tarikoplata', region: 'arms', common: false },
    { name: 'Baratoplata', region: 'arms', common: false },
  ],
  legs: [
    { name: 'Heel Hook', region: 'legs', common: true },
    { name: 'Knee Bar', region: 'legs', common: true },
    { name: 'Ankle Lock', region: 'legs', common: true },
    { name: 'Toe Hold', region: 'legs', common: true },
    { name: 'Calf Slicer', region: 'legs', common: false },
    { name: 'Inside Heel Hook', region: 'legs', common: false },
    { name: 'Outside Heel Hook', region: 'legs', common: false },
    { name: 'Estima Lock', region: 'legs', common: false },
  ],
};

// Common submissions shown in quick picks (before region selection)
// Reserved for future "quick pick" feature
const _COMMON_SUBMISSIONS = [
  'RNC',
  'Armbar',
  'Triangle',
  'Guillotine',
  'Kimura',
  'Heel Hook',
  'Americana',
  'Darce',
];
void _COMMON_SUBMISSIONS; // Suppress unused warning

// ===========================================
// COMPONENT PROPS
// ===========================================

interface SubmissionPickerProps {
  label: string; // "Subs given" or "Submitted by"
  selectedSubmissions: SubmissionCount[];
  onSubmissionsChange: (submissions: SubmissionCount[]) => void;
  userHistory?: string[]; // User's historical submissions for "Your Go-Tos"
  onVoiceInput?: () => void; // Callback to trigger voice input
}

// ===========================================
// COMPONENT
// ===========================================

export function SubmissionPicker({
  label,
  selectedSubmissions,
  onSubmissionsChange,
  userHistory = [],
  onVoiceInput,
}: SubmissionPickerProps) {
  const [expandedRegion, setExpandedRegion] = useState<PickerRegion | null>(null);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherValue, setOtherValue] = useState('');

  // Helper: get names of selected submissions
  const selectedNames = selectedSubmissions.map(s => s.name);

  // Get user's go-to submissions (top 4 from history, not already selected)
  const userGoTos = userHistory
    .slice(0, 4)
    .filter(sub => !selectedNames.includes(sub));

  // Add or increment a submission (tap-to-increment pattern)
  const addOrIncrement = (submissionName: string) => {
    const existing = selectedSubmissions.find(s => s.name === submissionName);
    if (existing) {
      // Increment count
      onSubmissionsChange(
        selectedSubmissions.map(s =>
          s.name === submissionName ? { ...s, count: s.count + 1 } : s
        )
      );
    } else {
      // Add new with count 1
      onSubmissionsChange([...selectedSubmissions, { name: submissionName, count: 1 }]);
    }
  };

  // Decrement submission count (for future long-press behavior)
  const decrementOrRemove = (submissionName: string) => {
    const existing = selectedSubmissions.find(s => s.name === submissionName);
    if (existing && existing.count > 1) {
      onSubmissionsChange(
        selectedSubmissions.map(s =>
          s.name === submissionName ? { ...s, count: s.count - 1 } : s
        )
      );
    } else {
      onSubmissionsChange(selectedSubmissions.filter(s => s.name !== submissionName));
    }
  };
  void decrementOrRemove; // Reserved for long-press gesture

  // Add custom submission
  const addOtherSubmission = () => {
    const trimmed = otherValue.trim();
    if (trimmed && !selectedNames.includes(trimmed)) {
      onSubmissionsChange([...selectedSubmissions, { name: trimmed, count: 1 }]);
      setOtherValue('');
      setShowOtherInput(false);
    }
  };

  // Remove a selected submission entirely
  const removeSubmission = (submissionName: string) => {
    onSubmissionsChange(selectedSubmissions.filter(s => s.name !== submissionName));
  };

  // Get submissions for expanded region (excluding already selected)
  const getRegionSubmissions = (region: PickerRegion) => {
    return SUBMISSIONS_BY_REGION[region];
  };

  // Get count for a submission (0 if not selected)
  const getCount = (submissionName: string): number => {
    const found = selectedSubmissions.find(s => s.name === submissionName);
    return found ? found.count : 0;
  };

  return (
    <div
      style={{
        marginBottom: 'var(--space-lg)',
      }}
    >
      {/* Label */}
      <div
        style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--color-gray-400)',
          marginBottom: 'var(--space-sm)',
        }}
      >
        {label}
      </div>

      {/* Selected Submissions with Count Badges */}
      {selectedSubmissions.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-xs)',
            marginBottom: 'var(--space-md)',
          }}
        >
          {selectedSubmissions.map(sub => {
            const isGiven = label.toLowerCase().includes('given');
            const accentColor = isGiven ? 'var(--color-positive)' : 'var(--color-negative)';
            const bgColor = isGiven ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)';

            return (
              <div
                key={sub.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: bgColor,
                  border: `1px solid ${accentColor}`,
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                }}
              >
                {/* Tap to increment */}
                <button
                  onClick={() => addOrIncrement(sub.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-xs)',
                    padding: 'var(--space-xs) var(--space-sm)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--color-white)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {sub.name}
                  {sub.count > 1 && (
                    <span
                      style={{
                        backgroundColor: accentColor,
                        color: 'var(--color-black)',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-full)',
                        minWidth: '20px',
                        textAlign: 'center',
                      }}
                    >
                      ×{sub.count}
                    </span>
                  )}
                </button>
                {/* X to remove */}
                <button
                  onClick={() => removeSubmission(sub.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 var(--space-sm)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderLeft: `1px solid ${accentColor}`,
                    color: 'var(--color-gray-400)',
                    cursor: 'pointer',
                    height: '100%',
                    minHeight: '32px',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* User's Go-Tos (if they have history) */}
      {userGoTos.length > 0 && (
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-500)',
              marginBottom: 'var(--space-xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Your go-tos
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
            {userGoTos.map(sub => (
              <button
                key={sub}
                onClick={() => addOrIncrement(sub)}
                style={{
                  padding: 'var(--space-sm) var(--space-md)',
                  backgroundColor: 'var(--color-gray-800)',
                  border: '1px solid var(--color-gray-700)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-white)',
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Body Region Buttons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-md)',
        }}
      >
        {(['neck', 'arms', 'legs'] as PickerRegion[]).map(region => (
          <button
            key={region}
            onClick={() => setExpandedRegion(expandedRegion === region ? null : region)}
            style={{
              padding: 'var(--space-md)',
              backgroundColor: expandedRegion === region
                ? 'var(--color-gray-700)'
                : 'var(--color-gray-800)',
              border: expandedRegion === region
                ? '1px solid var(--color-accent)'
                : '1px solid var(--color-gray-700)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-white)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              textTransform: 'uppercase',
              cursor: 'pointer',
              minHeight: '56px',
            }}
          >
            {region === 'neck' && 'Neck'}
            {region === 'arms' && 'Arms'}
            {region === 'legs' && 'Legs'}
          </button>
        ))}
      </div>

      {/* Expanded Region Submissions */}
      {expandedRegion && (
        <div
          style={{
            backgroundColor: 'var(--color-gray-900)',
            border: '1px solid var(--color-gray-800)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            marginBottom: 'var(--space-md)',
          }}
        >
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-500)',
              marginBottom: 'var(--space-sm)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {expandedRegion === 'neck' && 'Chokes & Strangles'}
            {expandedRegion === 'arms' && 'Arm Attacks'}
            {expandedRegion === 'legs' && 'Leg Attacks'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
            {getRegionSubmissions(expandedRegion).map(sub => {
              const count = getCount(sub.name);
              const isSelected = count > 0;
              const isGiven = label.toLowerCase().includes('given');
              const accentColor = isGiven ? 'var(--color-positive)' : 'var(--color-negative)';

              return (
                <button
                  key={sub.name}
                  onClick={() => addOrIncrement(sub.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-xs)',
                    padding: 'var(--space-sm) var(--space-md)',
                    backgroundColor: isSelected
                      ? (isGiven ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)')
                      : (sub.common ? 'var(--color-gray-800)' : 'var(--color-gray-850)'),
                    border: isSelected
                      ? `1px solid ${accentColor}`
                      : '1px solid var(--color-gray-700)',
                    borderRadius: 'var(--radius-md)',
                    color: isSelected
                      ? 'var(--color-white)'
                      : (sub.common ? 'var(--color-white)' : 'var(--color-gray-400)'),
                    fontSize: 'var(--text-sm)',
                    fontWeight: isSelected ? 600 : 400,
                    cursor: 'pointer',
                    minHeight: '44px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {sub.name}
                  {count > 0 && (
                    <span
                      style={{
                        backgroundColor: accentColor,
                        color: 'var(--color-black)',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-full)',
                        minWidth: '20px',
                        textAlign: 'center',
                      }}
                    >
                      {count > 1 ? `×${count}` : '+'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions Row */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-sm)',
        }}
      >
        {/* Voice Input Button */}
        {onVoiceInput && (
          <button
            onClick={onVoiceInput}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-sm)',
              padding: 'var(--space-md)',
              backgroundColor: 'var(--color-gray-800)',
              border: '1px solid var(--color-gray-700)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-gray-400)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              minHeight: '48px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
            Just say it
          </button>
        )}

        {/* Other Button */}
        <button
          onClick={() => setShowOtherInput(!showOtherInput)}
          style={{
            flex: 1,
            padding: 'var(--space-md)',
            backgroundColor: 'var(--color-gray-800)',
            border: '1px solid var(--color-gray-700)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-gray-400)',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            minHeight: '48px',
          }}
        >
          Other
        </button>
      </div>

      {/* Other Input */}
      {showOtherInput && (
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-sm)',
            marginTop: 'var(--space-sm)',
          }}
        >
          <input
            type="text"
            value={otherValue}
            onChange={e => setOtherValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addOtherSubmission()}
            placeholder="Enter submission name"
            autoFocus
            style={{
              flex: 1,
              padding: 'var(--space-sm) var(--space-md)',
              backgroundColor: 'var(--color-gray-900)',
              border: '1px solid var(--color-gray-700)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-white)',
              fontSize: 'var(--text-sm)',
              minHeight: '44px',
            }}
          />
          <button
            onClick={addOtherSubmission}
            disabled={!otherValue.trim()}
            style={{
              padding: 'var(--space-sm) var(--space-md)',
              backgroundColor: otherValue.trim()
                ? 'var(--color-accent)'
                : 'var(--color-gray-700)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: otherValue.trim()
                ? 'var(--color-primary)'
                : 'var(--color-gray-500)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              cursor: otherValue.trim() ? 'pointer' : 'not-allowed',
              minHeight: '44px',
            }}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}

export default SubmissionPicker;
