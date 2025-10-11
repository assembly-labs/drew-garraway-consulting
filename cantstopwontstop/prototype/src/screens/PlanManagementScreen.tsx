import { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { WorkoutPlan } from '../data/workoutPlans';

interface PlanManagementScreenProps {
  plans: WorkoutPlan[];
  onBack: () => void;
  onCreateNew: () => void;
  onSelectPlan: (plan: WorkoutPlan) => void;
  onDeletePlan: (planId: string) => void;
}

export const PlanManagementScreen: React.FC<PlanManagementScreenProps> = ({
  plans,
  onBack,
  onCreateNew,
  onSelectPlan,
  onDeletePlan,
}) => {
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  const handleDeleteClick = (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingPlanId(planId);
  };

  const confirmDelete = () => {
    if (deletingPlanId) {
      onDeletePlan(deletingPlanId);
      setDeletingPlanId(null);
    }
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
          My Plans
        </h1>
      </div>

      {/* Create New Button */}
      <div style={{ marginBottom: spacing.l, width: '100%' }}>
        <Button onClick={onCreateNew} fullWidth size="large">
          + CREATE NEW PLAN
        </Button>
      </div>

      {/* Empty State */}
      {plans.length === 0 && (
        <Card style={{ textAlign: 'center', padding: spacing.l }}>
          <div style={{ fontSize: 'clamp(48px, 12vw, 64px)', marginBottom: spacing.m }}>
            📋
          </div>
          <h3
            style={{
              fontSize: 'clamp(18px, 4.5vw, 24px)',
              fontWeight: 700,
              color: colors.white,
              marginBottom: spacing.s,
            }}
          >
            No plans yet
          </h3>
          <p
            style={{
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              color: colors.gray400,
            }}
          >
            Create your first workout plan to get started!
          </p>
        </Card>
      )}

      {/* Plans List */}
      {plans.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.s, width: '100%' }}>
          {plans.map((plan) => (
            <Card
              key={plan.id}
              onClick={() => onSelectPlan(plan)}
              style={{ cursor: 'pointer', position: 'relative' }}
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
                      fontSize: 'clamp(16px, 4vw, 18px)',
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
                      fontSize: 'clamp(13px, 3.2vw, 14px)',
                      color: colors.gray400,
                      marginBottom: spacing.xs,
                      wordBreak: 'break-word',
                      lineHeight: 1.4,
                    }}
                  >
                    {plan.description}
                  </div>
                  <div
                    style={{
                      fontSize: 'clamp(11px, 2.8vw, 12px)',
                      color: colors.gray500,
                    }}
                  >
                    {plan.exercises.length} exercises • {plan.estimatedTime} min •{' '}
                    {plan.difficulty}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteClick(plan.id, e)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: colors.red,
                    fontSize: 'clamp(20px, 5vw, 24px)',
                    cursor: 'pointer',
                    padding: spacing.xs,
                    flexShrink: 0,
                  }}
                  aria-label="Delete plan"
                >
                  🗑
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPlanId && (
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
            zIndex: 1000,
            width: '100%',
            maxWidth: '100vw',
          }}
        >
          <div
            style={{
              maxWidth: 'min(400px, 90vw)',
              width: '100%',
            }}
          >
            <h2
              style={{
                fontSize: 'clamp(24px, 6vw, 32px)',
                fontWeight: 800,
                color: colors.white,
                marginBottom: spacing.s,
                textAlign: 'center',
              }}
            >
              Delete Plan?
            </h2>
            <p
              style={{
                fontSize: 'clamp(14px, 3.5vw, 16px)',
                color: colors.whiteMuted,
                marginBottom: spacing.xl,
                textAlign: 'center',
              }}
            >
              This action cannot be undone. The plan will be permanently deleted.
            </p>
            <Button
              onClick={confirmDelete}
              fullWidth
              size="large"
              style={{ marginBottom: spacing.s }}
            >
              DELETE
            </Button>
            <button
              onClick={() => setDeletingPlanId(null)}
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
      )}
    </div>
  );
};
