import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { WorkoutSession } from '../services/StorageService';

interface WorkoutSummaryScreenProps {
  session: WorkoutSession;
  onDone: () => void;
}

export const WorkoutSummaryScreen: React.FC<WorkoutSummaryScreenProps> = ({
  session,
  onDone,
}) => {
  const getBadge = () => {
    if (session.completionPercentage === 100) {
      return { text: 'CRUSHED IT', color: colors.red, emoji: '🔥' };
    } else if (session.completionPercentage >= 75) {
      return { text: 'GOOD EFFORT', color: '#EAB308', emoji: '💪' };
    } else {
      return { text: 'WEAK', color: colors.gray500, emoji: '😤' };
    }
  };

  const badge = getBadge();
  const completedExercises = session.exercises.filter((e) => e.completed).length;
  const totalExercises = session.exercises.length;
  const completedSets = session.exercises.reduce(
    (total, ex) => total + ex.sets.filter((s) => s.completed).length,
    0
  );
  const totalSets = session.exercises.reduce((total, ex) => total + ex.sets.length, 0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        backgroundColor: colors.black,
        minHeight: '100dvh',
        padding: spacing.m,
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          marginTop: spacing.xl,
          marginBottom: spacing.xl,
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div style={{ fontSize: 'clamp(64px, 15vw, 96px)', marginBottom: spacing.s }}>
          {badge.emoji}
        </div>
        <h1
          style={{
            fontSize: 'clamp(32px, 8vw, 48px)',
            fontWeight: 800,
            color: badge.color,
            marginBottom: spacing.s,
            letterSpacing: '0.05em',
          }}
        >
          {badge.text}
        </h1>
        <p
          style={{
            fontSize: 'clamp(16px, 4vw, 20px)',
            color: colors.whiteMuted,
            marginBottom: spacing.s,
          }}
        >
          {session.planName}
        </p>
        <div
          style={{
            fontSize: 'clamp(14px, 3.5vw, 16px)',
            color: colors.gray500,
          }}
        >
          {new Date(session.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: spacing.s,
          marginBottom: spacing.l,
          width: '100%',
        }}
      >
        <Card>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 'clamp(11px, 2.8vw, 12px)',
                color: colors.gray500,
                marginBottom: spacing.xxs,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Time
            </div>
            <div
              style={{
                fontSize: 'clamp(24px, 6vw, 32px)',
                fontWeight: 700,
                color: colors.white,
              }}
            >
              {formatTime(session.totalTime)}
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 'clamp(11px, 2.8vw, 12px)',
                color: colors.gray500,
                marginBottom: spacing.xxs,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Completion
            </div>
            <div
              style={{
                fontSize: 'clamp(24px, 6vw, 32px)',
                fontWeight: 700,
                color: colors.red,
              }}
            >
              {session.completionPercentage}%
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 'clamp(11px, 2.8vw, 12px)',
                color: colors.gray500,
                marginBottom: spacing.xxs,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Exercises
            </div>
            <div
              style={{
                fontSize: 'clamp(24px, 6vw, 32px)',
                fontWeight: 700,
                color: colors.white,
              }}
            >
              {completedExercises}/{totalExercises}
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 'clamp(11px, 2.8vw, 12px)',
                color: colors.gray500,
                marginBottom: spacing.xxs,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Sets
            </div>
            <div
              style={{
                fontSize: 'clamp(24px, 6vw, 32px)',
                fontWeight: 700,
                color: colors.white,
              }}
            >
              {completedSets}/{totalSets}
            </div>
          </div>
        </Card>
      </div>

      {/* Volume & Pauses */}
      <Card style={{ marginBottom: spacing.l }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: spacing.s,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 'clamp(11px, 2.8vw, 12px)',
                color: colors.gray500,
                marginBottom: spacing.xxs,
              }}
            >
              Total Volume
            </div>
            <div
              style={{
                fontSize: 'clamp(20px, 5vw, 24px)',
                fontWeight: 700,
                color: colors.red,
              }}
            >
              {session.totalVolume.toLocaleString()} lbs
            </div>
          </div>
          {session.mode === 'challenge' && (
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: 'clamp(11px, 2.8vw, 12px)',
                  color: colors.gray500,
                  marginBottom: spacing.xxs,
                }}
              >
                Pauses Used
              </div>
              <div
                style={{
                  fontSize: 'clamp(20px, 5vw, 24px)',
                  fontWeight: 700,
                  color: colors.white,
                }}
              >
                {session.pausesUsed}/3
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Exercise List */}
      <div style={{ marginBottom: spacing.l, width: '100%' }}>
        <h3
          style={{
            fontSize: 'clamp(16px, 4vw, 18px)',
            fontWeight: 700,
            color: colors.white,
            marginBottom: spacing.s,
          }}
        >
          Exercise Breakdown
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, width: '100%' }}>
          {session.exercises.map((exercise, index) => (
            <Card
              key={index}
              style={{
                opacity: exercise.completed ? 1 : 0.5,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: spacing.s }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 'clamp(14px, 3.5vw, 16px)',
                      fontWeight: 700,
                      color: colors.white,
                      marginBottom: spacing.xxs,
                      wordBreak: 'break-word',
                    }}
                  >
                    {exercise.exerciseName}
                  </div>
                  <div
                    style={{
                      fontSize: 'clamp(12px, 3vw, 14px)',
                      color: colors.gray400,
                    }}
                  >
                    {exercise.sets.filter((s) => s.completed).length}/{exercise.sets.length} sets
                    {exercise.skipped && ' • Skipped'}
                  </div>
                </div>
                <div style={{ fontSize: 'clamp(24px, 6vw, 32px)', flexShrink: 0 }}>
                  {exercise.completed ? '✅' : exercise.skipped ? '⏭' : '❌'}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Done Button */}
      <div style={{ marginTop: spacing.xl, marginBottom: spacing.xl, width: '100%' }}>
        <Button onClick={onDone} size="large" fullWidth>
          DONE
        </Button>
      </div>
    </div>
  );
};
