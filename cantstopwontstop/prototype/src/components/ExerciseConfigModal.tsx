import { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { Exercise } from '../data/exerciseLibrary';

export interface ExerciseConfig {
  exercise: Exercise;
  sets: number;
  reps: number;
  weight: number;
  restTime: number;
}

interface ExerciseConfigModalProps {
  exercise: Exercise;
  initialConfig?: Partial<ExerciseConfig>;
  onSave: (config: ExerciseConfig) => void;
  onCancel: () => void;
}

export const ExerciseConfigModal: React.FC<ExerciseConfigModalProps> = ({
  exercise,
  initialConfig,
  onSave,
  onCancel,
}) => {
  const [sets, setSets] = useState(initialConfig?.sets ?? exercise.defaultSets);
  const [reps, setReps] = useState(initialConfig?.reps ?? exercise.defaultReps);
  const [weight, setWeight] = useState(initialConfig?.weight ?? 0);
  const [restTime, setRestTime] = useState(initialConfig?.restTime ?? exercise.restTime);
  const [showTips, setShowTips] = useState(false);

  const handleSave = () => {
    if (sets < 1 || sets > 10) {
      alert('Sets must be between 1 and 10');
      return;
    }
    if (reps < 1 || reps > 100) {
      alert('Reps must be between 1 and 100');
      return;
    }

    onSave({
      exercise,
      sets,
      reps,
      weight,
      restTime,
    });
  };

  const restTimeOptions = [
    { value: 0, label: '0s' },
    { value: 30, label: '30s' },
    { value: 60, label: '60s' },
    { value: 90, label: '90s' },
    { value: 120, label: '120s' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.m,
        zIndex: 1002,
        width: '100%',
        maxWidth: '100vw',
        overflowY: 'auto',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          maxWidth: 'min(500px, 90vw)',
          width: '100%',
          backgroundColor: colors.black,
          border: `2px solid ${colors.red}`,
          borderRadius: '8px',
          padding: spacing.m,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2
          style={{
            fontSize: 'clamp(20px, 5vw, 24px)',
            fontWeight: 800,
            color: colors.white,
            marginBottom: spacing.xs,
            wordBreak: 'break-word',
          }}
        >
          {exercise.icon} {exercise.name}
        </h2>
        <p
          style={{
            fontSize: 'clamp(13px, 3.2vw, 14px)',
            color: colors.gray400,
            marginBottom: spacing.l,
            lineHeight: 1.5,
          }}
        >
          {exercise.description}
        </p>

        {/* Configuration Inputs */}
        <div style={{ marginBottom: spacing.l }}>
          <label
            style={{
              display: 'block',
              fontSize: 'clamp(12px, 3vw, 14px)',
              color: colors.gray400,
              marginBottom: spacing.xs,
              fontWeight: 600,
            }}
          >
            Sets (1-10)
          </label>
          <Input
            type="number"
            min="1"
            max="10"
            value={sets}
            onChange={(e) => setSets(Number(e.target.value))}
            style={{ marginBottom: spacing.m }}
          />

          <label
            style={{
              display: 'block',
              fontSize: 'clamp(12px, 3vw, 14px)',
              color: colors.gray400,
              marginBottom: spacing.xs,
              fontWeight: 600,
            }}
          >
            Reps (1-100)
          </label>
          <Input
            type="number"
            min="1"
            max="100"
            value={reps}
            onChange={(e) => setReps(Number(e.target.value))}
            style={{ marginBottom: spacing.m }}
          />

          <label
            style={{
              display: 'block',
              fontSize: 'clamp(12px, 3vw, 14px)',
              color: colors.gray400,
              marginBottom: spacing.xs,
              fontWeight: 600,
            }}
          >
            Weight (lbs)
          </label>
          <Input
            type="number"
            min="0"
            max="999"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            placeholder="0 for bodyweight"
            style={{ marginBottom: spacing.m }}
          />

          <label
            style={{
              display: 'block',
              fontSize: 'clamp(12px, 3vw, 14px)',
              color: colors.gray400,
              marginBottom: spacing.xs,
              fontWeight: 600,
            }}
          >
            Rest Between Sets
          </label>
          <div style={{ display: 'flex', gap: spacing.xs, marginBottom: spacing.m, flexWrap: 'wrap' }}>
            {restTimeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setRestTime(option.value)}
                style={{
                  flex: '1 1 auto',
                  minWidth: 'clamp(50px, 15vw, 70px)',
                  padding: spacing.s,
                  background: restTime === option.value ? colors.red : colors.gray800,
                  border: 'none',
                  borderRadius: '4px',
                  color: colors.white,
                  fontSize: 'clamp(12px, 3vw, 14px)',
                  fontWeight: restTime === option.value ? 700 : 400,
                  cursor: 'pointer',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* How-To Tips */}
        <div style={{ marginBottom: spacing.l }}>
          <button
            onClick={() => setShowTips(!showTips)}
            style={{
              width: '100%',
              padding: spacing.s,
              background: colors.gray800,
              border: 'none',
              borderRadius: '4px',
              color: colors.white,
              fontSize: 'clamp(13px, 3.2vw, 14px)',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Form Tips</span>
            <span>{showTips ? '▼' : '▶'}</span>
          </button>

          {showTips && (
            <div
              style={{
                marginTop: spacing.s,
                padding: spacing.s,
                backgroundColor: colors.gray900,
                borderRadius: '4px',
              }}
            >
              <ul
                style={{
                  margin: 0,
                  paddingLeft: spacing.m,
                  color: colors.gray400,
                  fontSize: 'clamp(12px, 3vw, 14px)',
                  lineHeight: 1.6,
                }}
              >
                {exercise.formTips.map((tip, i) => (
                  <li key={i} style={{ marginBottom: spacing.xs }}>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <Button onClick={handleSave} fullWidth size="large" style={{ marginBottom: spacing.s }}>
          SAVE & ADD
        </Button>
        <button
          onClick={onCancel}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: colors.white,
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: 'clamp(14px, 3.5vw, 16px)',
            padding: spacing.s,
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
