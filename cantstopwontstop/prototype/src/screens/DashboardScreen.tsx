import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { WorkoutPlan } from '../data/workoutPlans';
import { WorkoutSession } from '../services/StorageService';

interface DashboardScreenProps {
  onStartWorkout: (plan: WorkoutPlan) => void;
  selectedPlan: WorkoutPlan;
  onPlanSelected: (plan: WorkoutPlan) => void;
  availablePlans: WorkoutPlan[];
  onManagePlans: () => void;
  onViewHistory: () => void;
  onSettings?: () => void;
  recentWorkout: WorkoutSession | null;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onStartWorkout,
  selectedPlan,
  onPlanSelected,
  availablePlans,
  onManagePlans,
  onViewHistory,
  onSettings,
  recentWorkout,
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
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
          marginBottom: spacing.xl,
          width: '100%',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(24px, 6vw, 32px)',
            fontWeight: 700,
            color: colors.white,
            marginBottom: spacing.xs,
            wordBreak: 'break-word',
          }}
        >
          Can't Stop Won't Stop
        </h1>
        <p
          style={{
            fontSize: 'clamp(12px, 3vw, 14px)',
            color: colors.gray500,
          }}
        >
          Ready to grind?
        </p>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', gap: spacing.s, marginBottom: spacing.l, width: '100%' }}>
        <button
          onClick={onManagePlans}
          style={{
            flex: 1,
            padding: spacing.s,
            background: colors.gray800,
            border: 'none',
            borderRadius: '4px',
            color: colors.white,
            fontSize: 'clamp(12px, 3vw, 14px)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          📋 Plans
        </button>
        <button
          onClick={onViewHistory}
          style={{
            flex: 1,
            padding: spacing.s,
            background: colors.gray800,
            border: 'none',
            borderRadius: '4px',
            color: colors.white,
            fontSize: 'clamp(12px, 3vw, 14px)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          📊 History
        </button>
        {onSettings && (
          <button
            onClick={onSettings}
            style={{
              flex: 1,
              padding: spacing.s,
              background: colors.gray800,
              border: 'none',
              borderRadius: '4px',
              color: colors.white,
              fontSize: 'clamp(12px, 3vw, 14px)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ⚙️ Settings
          </button>
        )}
      </div>

      {/* Workout Plan Selector */}
      <div style={{ marginBottom: spacing.l, width: '100%' }}>
        <h3
          style={{
            fontSize: 'clamp(16px, 4vw, 18px)',
            fontWeight: 700,
            color: colors.white,
            marginBottom: spacing.s,
          }}
        >
          Choose Your Workout
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, width: '100%' }}>
          {availablePlans.map((plan) => (
            <Card
              key={plan.id}
              onClick={() => onPlanSelected(plan)}
              borderColor={selectedPlan.id === plan.id ? colors.red : colors.gray800}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.xs }}>
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
                    {plan.name}
                  </div>
                  <div
                    style={{
                      fontSize: 'clamp(12px, 3vw, 14px)',
                      color: colors.gray400,
                      marginBottom: spacing.xxs,
                      lineHeight: 1.4,
                      wordBreak: 'break-word',
                    }}
                  >
                    {plan.description}
                  </div>
                  <div
                    style={{
                      fontSize: 'clamp(11px, 2.8vw, 12px)',
                      color: colors.gray500,
                      wordBreak: 'break-word',
                    }}
                  >
                    {plan.exercises.length} exercises • {plan.estimatedTime} min • {plan.difficulty}
                  </div>
                </div>
                {selectedPlan.id === plan.id && (
                  <div style={{ fontSize: 'clamp(20px, 5vw, 24px)', marginLeft: spacing.xs, flexShrink: 0 }}>✓</div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Widget */}
      {recentWorkout && (
        <Card style={{ marginBottom: spacing.l }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: spacing.s, flexWrap: 'wrap' }}>
            <div style={{ minWidth: '120px' }}>
              <div
                style={{
                  fontSize: 'clamp(11px, 2.8vw, 12px)',
                  color: colors.gray500,
                  marginBottom: spacing.xxs,
                }}
              >
                Last Workout
              </div>
              <div
                style={{
                  fontSize: 'clamp(18px, 4.5vw, 24px)',
                  fontWeight: 700,
                  color: colors.red,
                }}
              >
                {formatDate(recentWorkout.date)}
              </div>
            </div>
            <div style={{ textAlign: 'right', minWidth: '120px' }}>
              <div
                style={{
                  fontSize: 'clamp(11px, 2.8vw, 12px)',
                  color: colors.gray500,
                  marginBottom: spacing.xxs,
                }}
              >
                Completion
              </div>
              <div
                style={{
                  fontSize: 'clamp(18px, 4.5vw, 24px)',
                  fontWeight: 700,
                  color: colors.red,
                }}
              >
                {recentWorkout.completionPercentage}% 🔥
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Hero CTA */}
      <div
        style={{
          marginTop: spacing.xl,
          marginBottom: spacing.xl,
          width: '100%',
        }}
      >
        <Button
          onClick={() => onStartWorkout(selectedPlan)}
          size="large"
          fullWidth
        >
          <div style={{ width: '100%', padding: `0 ${spacing.xs}` }}>
            <div style={{ fontSize: 'clamp(20px, 5vw, 32px)', fontWeight: 800, wordBreak: 'break-word' }}>START WORKOUT</div>
            <div style={{ fontSize: 'clamp(11px, 3vw, 12px)', fontWeight: 400, marginTop: spacing.xxs, wordBreak: 'break-word' }}>
              {selectedPlan.name}
            </div>
          </div>
        </Button>
      </div>

      {/* Selected Plan Details */}
      <div
        style={{
          marginBottom: spacing.l,
          width: '100%',
        }}
      >
        <h3
          style={{
            fontSize: 'clamp(16px, 4vw, 18px)',
            fontWeight: 700,
            color: colors.white,
            marginBottom: spacing.s,
          }}
        >
          Workout Details
        </h3>
        <Card>
          <div
            style={{
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              color: colors.whiteMuted,
              marginBottom: spacing.xs,
              wordBreak: 'break-word',
            }}
          >
            <strong>{selectedPlan.name}</strong>
          </div>
          <div
            style={{
              fontSize: 'clamp(11px, 2.8vw, 12px)',
              color: colors.gray500,
              marginBottom: spacing.s,
            }}
          >
            {selectedPlan.category} • {selectedPlan.difficulty}
          </div>
          <div
            style={{
              marginTop: spacing.s,
              fontSize: 'clamp(11px, 2.8vw, 12px)',
              color: colors.gray400,
            }}
          >
            <div style={{ marginBottom: spacing.xs, color: colors.white, fontWeight: 600, fontSize: 'clamp(12px, 3vw, 14px)' }}>
              Exercises ({selectedPlan.exercises.length}):
            </div>
            {selectedPlan.exercises.map((ex) => (
              <div key={ex.id} style={{ marginBottom: spacing.xxs, wordBreak: 'break-word', lineHeight: 1.5 }}>
                • {ex.icon} {ex.name} - {ex.defaultSets}x{ex.defaultReps}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
