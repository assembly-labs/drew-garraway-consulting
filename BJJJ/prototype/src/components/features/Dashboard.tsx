/**
 * Dashboard Feature
 * Main home screen for practitioners
 * Shows training summary, recent sessions, belt progress, and quick actions
 */

import { currentUser } from '../../data/users';
import { mockTrainingStats, mockJournalEntries } from '../../data/journal';
import { mockProgressSummary, mockGoals, mockTonyChenPromotionReadiness } from '../../data/progress';
import { BeltBadge, StatCard, TrainingBadge, ProgressRing } from '../ui';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const user = currentUser;
  const stats = mockTrainingStats;
  const progress = mockProgressSummary;
  const readiness = mockTonyChenPromotionReadiness;
  const recentEntries = mockJournalEntries.slice(0, 3);
  const activeGoals = mockGoals.filter(g => !g.isComplete).slice(0, 3);

  // Calculate greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Hero Welcome Section */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
          color: 'var(--color-white)',
          padding: 'var(--space-xl)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{
              color: 'var(--color-gray-300)',
              marginBottom: 'var(--space-xs)',
              fontSize: 'var(--text-sm)',
            }}>
              {greeting},
            </p>
            <h2 style={{
              color: 'var(--color-white)',
              marginBottom: 'var(--space-sm)',
              fontSize: 'var(--text-2xl)',
            }}>
              {user.firstName} {user.lastName}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <BeltBadge belt={user.belt} stripes={user.stripes} size="lg" />
              <span style={{
                color: 'var(--color-gray-300)',
                fontSize: 'var(--text-sm)',
              }}>
                {progress.timeAtBelt} at {user.belt} belt
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-primary)',
              padding: 'var(--space-sm) var(--space-md)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: 'var(--text-2xl)',
              fontFamily: 'var(--font-heading)',
            }}>
              {stats.currentStreak}
            </div>
            <span style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-300)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wider)',
            }}>
              Day Streak
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--space-md)'
      }}>
        <StatCard
          label="This Month"
          value={stats.thisMonth.sessions}
          subtitle="Sessions"
          trend="up"
          trendValue="+3 vs last"
        />
        <StatCard
          label="Total Hours"
          value={stats.totalHours}
          subtitle="Mat time"
        />
      </div>

      {/* Belt Progress Card */}
      <div className="card">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-md)',
        }}>
          <div>
            <h3 style={{ marginBottom: 'var(--space-xs)' }}>Purple Belt Progress</h3>
            <p className="text-muted text-small" style={{ marginBottom: 0 }}>
              {readiness.technicalProgress.overallPercentage}% requirements complete
            </p>
          </div>
          <ProgressRing
            percentage={readiness.technicalProgress.overallPercentage}
            size={70}
            strokeWidth={5}
          />
        </div>

        {/* Time requirement */}
        <div style={{
          backgroundColor: readiness.meetsTimeRequirement ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
          border: `1px solid ${readiness.meetsTimeRequirement ? 'var(--color-success)' : 'var(--color-warning)'}`,
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--space-sm) var(--space-md)',
          marginBottom: 'var(--space-md)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <span style={{
              color: readiness.meetsTimeRequirement ? 'var(--color-success)' : 'var(--color-warning)',
              fontWeight: 600,
            }}>
              {readiness.meetsTimeRequirement ? '✓' : '○'}
            </span>
            <span className="text-small">
              Time in grade: <strong>{readiness.timeAtCurrentBelt}</strong> / {readiness.timeRequired} months
            </span>
          </div>
        </div>

        {/* Category Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {readiness.technicalProgress.byCategory.slice(0, 4).map((cat) => (
            <div key={cat.category}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}>
                <span className="text-small" style={{ textTransform: 'capitalize' }}>
                  {cat.category.replace('-', ' ')}
                </span>
                <span className="text-small text-muted">
                  {cat.completed}/{cat.total}
                </span>
              </div>
              <div className="progress-bar" style={{ height: 6 }}>
                <div
                  className="progress-fill"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn btn-outline"
          onClick={() => onNavigate('progress')}
          style={{ width: '100%', marginTop: 'var(--space-md)' }}
        >
          View Full Progress
        </button>
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--space-md)'
      }}>
        <button
          className="btn btn-primary"
          onClick={() => onNavigate('voice-logger')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 'var(--space-lg)',
            gap: 'var(--space-sm)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
          <span>Log Training</span>
        </button>
        <button
          className="btn btn-dark"
          onClick={() => onNavigate('library')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 'var(--space-lg)',
            gap: 'var(--space-sm)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span>Techniques</span>
        </button>
      </div>

      {/* Recent Sessions */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Sessions</span>
          <button
            onClick={() => onNavigate('journal')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-accent-text)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
            }}
          >
            View All
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {recentEntries.map((entry, i) => {
            const date = new Date(entry.date);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            let dateLabel: string;
            if (date.toDateString() === today.toDateString()) {
              dateLabel = 'Today';
            } else if (date.toDateString() === yesterday.toDateString()) {
              dateLabel = 'Yesterday';
            } else {
              dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }

            return (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: i < recentEntries.length - 1 ? 'var(--space-md)' : 0,
                  borderBottom: i < recentEntries.length - 1 ? '1px solid var(--color-gray-200)' : 'none',
                }}
              >
                <div>
                  <div className="font-bold">{dateLabel}</div>
                  <div className="text-small text-muted">
                    {entry.duration} min • {entry.techniques.length} technique{entry.techniques.length !== 1 ? 's' : ''} • {entry.sparringRounds.length} roll{entry.sparringRounds.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <TrainingBadge type={entry.type} size="sm" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Goals */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Active Goals</span>
          <span className="text-muted text-small">{activeGoals.length} goals</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {activeGoals.map((goal) => {
            const progress = goal.targetValue && goal.currentValue
              ? Math.round((goal.currentValue / goal.targetValue) * 100)
              : null;

            return (
              <div key={goal.id}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--space-xs)',
                }}>
                  <span className="font-bold text-small">{goal.title}</span>
                  {goal.targetDate && (
                    <span className="text-muted text-small">
                      {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
                {progress !== null && (
                  <div className="progress-bar" style={{ height: 6 }}>
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
                {progress === null && (
                  <p className="text-muted text-small" style={{ marginBottom: 0 }}>
                    {goal.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sparring Record Summary */}
      <div className="card">
        <h3 style={{ marginBottom: 'var(--space-md)' }}>Sparring Record</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-md)',
          textAlign: 'center',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 800,
              color: 'var(--color-success)',
            }}>
              {stats.sparringRecord.wins}
            </div>
            <div className="text-small text-muted">Wins</div>
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 800,
              color: 'var(--color-error)',
            }}>
              {stats.sparringRecord.losses}
            </div>
            <div className="text-small text-muted">Losses</div>
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 800,
              color: 'var(--color-gray-500)',
            }}>
              {stats.sparringRecord.draws}
            </div>
            <div className="text-small text-muted">Draws</div>
          </div>
        </div>
        <div style={{
          marginTop: 'var(--space-md)',
          padding: 'var(--space-sm)',
          backgroundColor: 'var(--color-gray-100)',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'center',
        }}>
          <span className="text-small">
            Win Rate: <strong style={{ color: 'var(--color-accent-text)' }}>
              {Math.round((stats.sparringRecord.wins / (stats.sparringRecord.wins + stats.sparringRecord.losses + stats.sparringRecord.draws)) * 100)}%
            </strong>
          </span>
        </div>
      </div>

      {/* Coach Feedback Preview */}
      {readiness.coachNotes && (
        <div
          className="card"
          style={{
            borderLeft: '4px solid var(--color-accent)',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-sm)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-text)" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="card-title" style={{ margin: 0 }}>Coach Feedback</span>
          </div>
          <p className="text-small" style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-gray-700)' }}>
            "{readiness.coachNotes}"
          </p>
          <div className="text-small text-muted">
            Last assessment: {new Date(readiness.lastAssessmentDate || '').toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>
      )}
    </div>
  );
}
