import { Button } from '../components/Button';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';

interface InitialSelectionScreenProps {
  onViewHistory: () => void;
  onStartWorkout: () => void;
}

export const InitialSelectionScreen: React.FC<InitialSelectionScreenProps> = ({
  onViewHistory,
  onStartWorkout,
}) => {
  return (
    <div
      style={{
        backgroundColor: colors.black,
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.l,
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden',
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontSize: 'clamp(32px, 8vw, 48px)',
          fontWeight: 800,
          color: colors.white,
          textAlign: 'center',
          marginBottom: spacing.xl,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Can't Stop Won't Stop
      </h1>

      {/* Selection Buttons */}
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.m,
        }}
      >
        {/* History Button */}
        <button
          onClick={onViewHistory}
          style={{
            background: colors.gray800,
            border: `2px solid ${colors.gray700}`,
            borderRadius: '12px',
            padding: spacing.l,
            cursor: 'pointer',
            transition: 'all 0.2s',
            width: '100%',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = colors.white;
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = colors.gray700;
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div
            style={{
              fontSize: 'clamp(48px, 12vw, 64px)',
              marginBottom: spacing.s,
            }}
          >
            📊
          </div>
          <div
            style={{
              fontSize: 'clamp(24px, 6vw, 32px)',
              fontWeight: 700,
              color: colors.white,
              marginBottom: spacing.xs,
              textTransform: 'uppercase',
            }}
          >
            HISTORY
          </div>
          <div
            style={{
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              color: colors.gray400,
            }}
          >
            View past workouts
          </div>
        </button>

        {/* Present Day Button */}
        <button
          onClick={onStartWorkout}
          style={{
            background: colors.red,
            border: `2px solid ${colors.red}`,
            borderRadius: '12px',
            padding: spacing.l,
            cursor: 'pointer',
            transition: 'all 0.2s',
            width: '100%',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = colors.white;
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = colors.red;
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div
            style={{
              fontSize: 'clamp(48px, 12vw, 64px)',
              marginBottom: spacing.s,
            }}
          >
            💪
          </div>
          <div
            style={{
              fontSize: 'clamp(24px, 6vw, 32px)',
              fontWeight: 700,
              color: colors.white,
              marginBottom: spacing.xs,
              textTransform: 'uppercase',
            }}
          >
            PRESENT DAY
          </div>
          <div
            style={{
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              color: colors.white,
            }}
          >
            Start new workout
          </div>
        </button>
      </div>
    </div>
  );
};
