import { useState, useEffect } from 'react';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { Exercise } from '../data/exerciseLibrary';

interface ExerciseSet {
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
}

interface ExerciseModuleProps {
  exercise: Exercise;
  exerciseIndex: number;
  sets: ExerciseSet[];
  onUpdateSet: (setIndex: number, reps: number, weight: number) => void;
  onCompleteSet: (setIndex: number) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const ExerciseModule: React.FC<ExerciseModuleProps> = ({
  exercise,
  exerciseIndex,
  sets,
  onUpdateSet,
  onCompleteSet,
  isExpanded,
  onToggleExpand,
}) => {
  const [localSets, setLocalSets] = useState(sets);

  // Sync local state with props when sets change
  useEffect(() => {
    setLocalSets(sets);
  }, [sets]);

  const handleRepsChange = (setIndex: number, value: string) => {
    const reps = Math.max(0, Math.min(69, parseInt(value) || 0));
    const newSets = [...localSets];
    newSets[setIndex].reps = reps;
    setLocalSets(newSets);
  };

  const handleWeightChange = (setIndex: number, value: string) => {
    const weight = Math.max(0, Math.min(9999, parseFloat(value) || 0));
    const newSets = [...localSets];
    newSets[setIndex].weight = weight;
    setLocalSets(newSets);
  };

  const handleBlur = (setIndex: number) => {
    // Auto-save on blur
    onUpdateSet(setIndex, localSets[setIndex].reps, localSets[setIndex].weight);
  };

  const handleCompleteSet = (setIndex: number) => {
    // Save first, then mark complete
    onUpdateSet(setIndex, localSets[setIndex].reps, localSets[setIndex].weight);
    onCompleteSet(setIndex);
  };

  const completedCount = sets.filter((s) => s.completed).length;
  const totalSets = sets.length;

  return (
    <div
      style={{
        backgroundColor: isExpanded ? colors.gray900 : colors.gray800,
        border: `2px solid ${isExpanded ? colors.red : colors.gray700}`,
        borderRadius: '8px',
        marginBottom: spacing.s,
        transition: 'all 0.2s',
        width: '100%',
      }}
    >
      {/* Header - Always Visible */}
      <button
        onClick={onToggleExpand}
        style={{
          width: '100%',
          padding: spacing.m,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: spacing.s,
        }}
      >
        <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
          <div
            style={{
              fontSize: 'clamp(16px, 4vw, 18px)',
              fontWeight: 700,
              color: colors.white,
              marginBottom: spacing.xxs,
              wordBreak: 'break-word',
            }}
          >
            {exercise.icon} {exercise.name}
          </div>
          <div
            style={{
              fontSize: 'clamp(12px, 3vw, 14px)',
              color: completedCount === totalSets ? colors.green : colors.gray400,
              fontWeight: 600,
            }}
          >
            {completedCount}/{totalSets} sets {completedCount === totalSets ? '✓' : ''}
          </div>
        </div>
        <div
          style={{
            fontSize: 'clamp(20px, 5vw, 24px)',
            color: colors.white,
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
            flexShrink: 0,
          }}
        >
          ▼
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          style={{
            padding: `0 ${spacing.m} ${spacing.m}`,
          }}
        >
          {/* Form Tips */}
          {exercise.formTips && exercise.formTips.length > 0 && (
            <div
              style={{
                backgroundColor: colors.gray800,
                borderRadius: '4px',
                padding: spacing.s,
                marginBottom: spacing.m,
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(11px, 2.8vw, 12px)',
                  color: colors.gray400,
                  marginBottom: spacing.xxs,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Form Tips
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: spacing.m,
                  fontSize: 'clamp(12px, 3vw, 13px)',
                  color: colors.gray300,
                  lineHeight: 1.4,
                }}
              >
                {exercise.formTips.slice(0, 2).map((tip, i) => (
                  <li key={i} style={{ marginBottom: spacing.xxs }}>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.s }}>
            {localSets.map((set, setIndex) => (
              <div
                key={setIndex}
                style={{
                  backgroundColor: set.completed ? colors.gray700 : colors.gray800,
                  border: `1px solid ${set.completed ? colors.green : colors.gray600}`,
                  borderRadius: '4px',
                  padding: spacing.s,
                  opacity: set.completed ? 0.7 : 1,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: spacing.xs,
                  }}
                >
                  <div
                    style={{
                      fontSize: 'clamp(14px, 3.5vw, 16px)',
                      fontWeight: 700,
                      color: colors.white,
                    }}
                  >
                    Set {set.setNumber}
                  </div>
                  {set.completed && (
                    <div
                      style={{
                        fontSize: 'clamp(12px, 3vw, 14px)',
                        color: colors.green,
                        fontWeight: 600,
                      }}
                    >
                      ✓ Done
                    </div>
                  )}
                </div>

                {/* Input Fields */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: spacing.xs,
                    marginBottom: spacing.xs,
                  }}
                >
                  {/* Reps Input */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 'clamp(10px, 2.5vw, 11px)',
                        color: colors.gray400,
                        marginBottom: '2px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Reps
                    </label>
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => handleRepsChange(setIndex, e.target.value)}
                      onBlur={() => handleBlur(setIndex)}
                      disabled={set.completed}
                      style={{
                        width: '100%',
                        padding: spacing.xs,
                        fontSize: 'clamp(18px, 4.5vw, 24px)',
                        fontWeight: 700,
                        color: colors.white,
                        backgroundColor: set.completed ? colors.gray600 : colors.gray900,
                        border: `2px solid ${colors.gray700}`,
                        borderRadius: '4px',
                        textAlign: 'center',
                        opacity: set.completed ? 0.6 : 1,
                      }}
                    />
                  </div>

                  {/* Weight Input */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 'clamp(10px, 2.5vw, 11px)',
                        color: colors.gray400,
                        marginBottom: '2px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Weight (lbs)
                    </label>
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) => handleWeightChange(setIndex, e.target.value)}
                      onBlur={() => handleBlur(setIndex)}
                      disabled={set.completed}
                      style={{
                        width: '100%',
                        padding: spacing.xs,
                        fontSize: 'clamp(18px, 4.5vw, 24px)',
                        fontWeight: 700,
                        color: colors.white,
                        backgroundColor: set.completed ? colors.gray600 : colors.gray900,
                        border: `2px solid ${colors.gray700}`,
                        borderRadius: '4px',
                        textAlign: 'center',
                        opacity: set.completed ? 0.6 : 1,
                      }}
                    />
                  </div>
                </div>

                {/* Complete Button */}
                {!set.completed && (
                  <button
                    onClick={() => handleCompleteSet(setIndex)}
                    style={{
                      width: '100%',
                      padding: spacing.xs,
                      backgroundColor: colors.red,
                      border: 'none',
                      borderRadius: '4px',
                      color: colors.white,
                      fontSize: 'clamp(14px, 3.5vw, 16px)',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    DONE
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
