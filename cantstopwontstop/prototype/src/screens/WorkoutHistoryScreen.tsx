import { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { WorkoutSession } from '../services/StorageService';
import { WorkoutSummaryScreen } from './WorkoutSummaryScreen';

interface WorkoutHistoryScreenProps {
  workoutHistory: WorkoutSession[];
  onBack: () => void;
}

export const WorkoutHistoryScreen: React.FC<WorkoutHistoryScreenProps> = ({
  workoutHistory,
  onBack,
}) => {
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutSession | null>(null);

  if (selectedWorkout) {
    return (
      <WorkoutSummaryScreen
        session={selectedWorkout}
        onDone={() => setSelectedWorkout(null)}
      />
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const getBadgeEmoji = (percentage: number) => {
    if (percentage === 100) return '🔥';
    if (percentage >= 75) return '💪';
    return '😤';
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
          Workout History
        </h1>
      </div>

      {/* Stats Summary */}
      {workoutHistory.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
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
                }}
              >
                Total
              </div>
              <div
                style={{
                  fontSize: 'clamp(20px, 5vw, 28px)',
                  fontWeight: 700,
                  color: colors.red,
                }}
              >
                {workoutHistory.length}
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
                }}
              >
                This Week
              </div>
              <div
                style={{
                  fontSize: 'clamp(20px, 5vw, 28px)',
                  fontWeight: 700,
                  color: colors.white,
                }}
              >
                {
                  workoutHistory.filter((w) => {
                    const date = new Date(w.date);
                    const now = new Date();
                    const diffDays = Math.floor(
                      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return diffDays < 7;
                  }).length
                }
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
                }}
              >
                Avg %
              </div>
              <div
                style={{
                  fontSize: 'clamp(20px, 5vw, 28px)',
                  fontWeight: 700,
                  color: colors.white,
                }}
              >
                {Math.round(
                  workoutHistory.reduce((sum, w) => sum + w.completionPercentage, 0) /
                    workoutHistory.length
                )}
                %
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {workoutHistory.length === 0 && (
        <Card style={{ marginTop: spacing.xl, textAlign: 'center', padding: spacing.l }}>
          <div style={{ fontSize: 'clamp(48px, 12vw, 64px)', marginBottom: spacing.m }}>
            💪
          </div>
          <h3
            style={{
              fontSize: 'clamp(18px, 4.5vw, 24px)',
              fontWeight: 700,
              color: colors.white,
              marginBottom: spacing.s,
            }}
          >
            No workouts yet
          </h3>
          <p
            style={{
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              color: colors.gray400,
              marginBottom: spacing.m,
            }}
          >
            Get grinding! Complete your first workout to see it here.
          </p>
        </Card>
      )}

      {/* Workout List */}
      {workoutHistory.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.s, width: '100%' }}>
          {workoutHistory.map((workout) => (
            <Card
              key={workout.id}
              onClick={() => setSelectedWorkout(workout)}
              style={{ cursor: 'pointer' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: spacing.s,
                }}
              >
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
                    {workout.planName}
                  </div>
                  <div
                    style={{
                      fontSize: 'clamp(12px, 3vw, 14px)',
                      color: colors.gray400,
                      marginBottom: spacing.xxs,
                    }}
                  >
                    {formatDate(workout.date)}
                  </div>
                  <div
                    style={{
                      fontSize: 'clamp(11px, 2.8vw, 12px)',
                      color: colors.gray500,
                    }}
                  >
                    {formatTime(workout.totalTime)} • {workout.completionPercentage}% complete •{' '}
                    {workout.totalVolume.toLocaleString()} lbs
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 'clamp(28px, 7vw, 36px)',
                    flexShrink: 0,
                  }}
                >
                  {getBadgeEmoji(workout.completionPercentage)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
