import { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { WorkoutPlan } from '../data/workoutPlans';

interface PreFlightScreenProps {
  plan: WorkoutPlan;
  mode: 'challenge' | 'beast';
  onStart: (totalTimeInSeconds: number) => void;
  onBack: () => void;
}

export const PreFlightScreen: React.FC<PreFlightScreenProps> = ({
  plan,
  mode,
  onStart,
  onBack,
}) => {
  const [totalMinutes, setTotalMinutes] = useState(plan.estimatedTime);

  return (
    <div
      style={{
        backgroundColor: colors.black,
        minHeight: '100dvh',
        padding: spacing.m,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          marginTop: spacing.l,
          marginBottom: spacing.l,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.s,
          width: '100%',
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: colors.white,
            fontSize: 'clamp(24px, 6vw, 32px)',
            cursor: 'pointer',
            padding: spacing.xs,
          }}
        >
          ←
        </button>
        <h1
          style={{
            fontSize: 'clamp(24px, 6vw, 32px)',
            fontWeight: 700,
            color: colors.white,
            flex: 1,
          }}
        >
          Pre-Flight Check
        </h1>
      </div>

      {/* Plan Info */}
      <Card style={{ marginBottom: spacing.l }}>
        <div
          style={{
            fontSize: 'clamp(18px, 4.5vw, 24px)',
            fontWeight: 700,
            color: colors.white,
            marginBottom: spacing.xs,
            wordBreak: 'break-word',
          }}
        >
          {plan.name}
        </div>
        <div
          style={{
            fontSize: 'clamp(13px, 3.2vw, 14px)',
            color: colors.gray400,
            marginBottom: spacing.s,
            wordBreak: 'break-word',
          }}
        >
          {plan.description}
        </div>
        <div
          style={{
            fontSize: 'clamp(12px, 3vw, 14px)',
            color: colors.gray500,
          }}
        >
          {plan.exercises.length} exercises • {plan.difficulty}
        </div>
      </Card>

      {/* Mode Display */}
      <Card
        style={{
          marginBottom: spacing.l,
          borderColor: colors.red,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: spacing.s,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 'clamp(11px, 2.8vw, 12px)',
                color: colors.gray500,
                marginBottom: spacing.xxs,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Mode
            </div>
            <div
              style={{
                fontSize: 'clamp(18px, 4.5vw, 20px)',
                fontWeight: 700,
                color: colors.red,
                textTransform: 'uppercase',
              }}
            >
              {mode === 'challenge' ? '⚡ CHALLENGE' : '💪 BEAST'}
            </div>
          </div>
          <div
            style={{
              fontSize: 'clamp(12px, 3vw, 14px)',
              color: colors.gray400,
              textAlign: 'right',
            }}
          >
            {mode === 'challenge' ? '3 pauses allowed' : 'Zero pauses'}
          </div>
        </div>
      </Card>

      {/* Time Selector */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div
          style={{
            textAlign: 'center',
            marginBottom: spacing.l,
          }}
        >
          <div
            style={{
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              color: colors.gray400,
              marginBottom: spacing.m,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Total Gym Time
          </div>
          <div
            style={{
              fontSize: 'clamp(64px, 16vw, 96px)',
              fontWeight: 800,
              color: colors.red,
              marginBottom: spacing.m,
            }}
          >
            {totalMinutes}
          </div>
          <div
            style={{
              fontSize: 'clamp(20px, 5vw, 24px)',
              color: colors.white,
              fontWeight: 600,
            }}
          >
            MINUTES
          </div>
        </div>

        {/* Time Controls */}
        <div
          style={{
            display: 'flex',
            gap: spacing.s,
            justifyContent: 'center',
            marginBottom: spacing.xl,
          }}
        >
          <button
            onClick={() => setTotalMinutes(Math.max(15, totalMinutes - 5))}
            style={{
              background: colors.gray800,
              border: 'none',
              color: colors.white,
              fontSize: 'clamp(24px, 6vw, 32px)',
              padding: spacing.m,
              borderRadius: '4px',
              cursor: 'pointer',
              minWidth: 'clamp(60px, 15vw, 80px)',
            }}
          >
            -5
          </button>
          <button
            onClick={() => setTotalMinutes(totalMinutes + 5)}
            style={{
              background: colors.gray800,
              border: 'none',
              color: colors.white,
              fontSize: 'clamp(24px, 6vw, 32px)',
              padding: spacing.m,
              borderRadius: '4px',
              cursor: 'pointer',
              minWidth: 'clamp(60px, 15vw, 80px)',
            }}
          >
            +5
          </button>
        </div>

        {/* Slider */}
        <input
          type="range"
          min="15"
          max="120"
          step="5"
          value={totalMinutes}
          onChange={(e) => setTotalMinutes(Number(e.target.value))}
          style={{
            width: '100%',
            marginBottom: spacing.xl,
            accentColor: colors.red,
          }}
        />
      </div>

      {/* Warning */}
      <Card
        style={{
          marginBottom: spacing.l,
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          borderColor: colors.red,
        }}
      >
        <p
          style={{
            fontSize: 'clamp(14px, 3.5vw, 16px)',
            color: colors.whiteMuted,
            textAlign: 'center',
            margin: 0,
            fontWeight: 600,
          }}
        >
          ⚠️ Timer starts immediately. No stopping. Ready?
        </p>
      </Card>

      {/* Start Button */}
      <Button
        onClick={() => onStart(totalMinutes * 60)}
        size="large"
        fullWidth
        style={{
          animation: 'pulse 2s infinite',
        }}
      >
        <div
          style={{
            fontSize: 'clamp(20px, 5vw, 28px)',
            fontWeight: 800,
            letterSpacing: '0.05em',
          }}
        >
          START GRINDING
        </div>
      </Button>

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.02);
            }
          }
        `}
      </style>
    </div>
  );
};
