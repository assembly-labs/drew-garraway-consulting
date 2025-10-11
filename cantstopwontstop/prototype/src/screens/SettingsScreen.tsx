import { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { UserPreferences } from '../services/StorageService';

interface SettingsScreenProps {
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  onBack: () => void;
  onClearData: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  preferences,
  onUpdatePreferences,
  onBack,
  onClearData,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [confirmStep, setConfirmStep] = useState(0);

  const handleClearData = () => {
    if (confirmStep < 2) {
      setConfirmStep(confirmStep + 1);
    } else {
      onClearData();
      setShowClearConfirm(false);
      setConfirmStep(0);
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
          Settings
        </h1>
      </div>

      {/* Workout Mode */}
      <div style={{ marginBottom: spacing.l, width: '100%' }}>
        <h3
          style={{
            fontSize: 'clamp(16px, 4vw, 18px)',
            fontWeight: 700,
            color: colors.white,
            marginBottom: spacing.s,
          }}
        >
          Workout Mode
        </h3>
        <div style={{ display: 'flex', gap: spacing.s }}>
          <Card
            onClick={() => onUpdatePreferences({ mode: 'challenge' })}
            borderColor={preferences.mode === 'challenge' ? colors.red : colors.gray800}
            style={{ flex: 1, cursor: 'pointer' }}
          >
            <div
              style={{
                fontSize: 'clamp(16px, 4vw, 18px)',
                fontWeight: 700,
                color: colors.white,
                marginBottom: spacing.xs,
              }}
            >
              ⚡ Challenge
            </div>
            <div style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: colors.gray400 }}>
              3 pauses allowed
            </div>
          </Card>
          <Card
            onClick={() => onUpdatePreferences({ mode: 'beast' })}
            borderColor={preferences.mode === 'beast' ? colors.red : colors.gray800}
            style={{ flex: 1, cursor: 'pointer' }}
          >
            <div
              style={{
                fontSize: 'clamp(16px, 4vw, 18px)',
                fontWeight: 700,
                color: colors.white,
                marginBottom: spacing.xs,
              }}
            >
              💪 Beast
            </div>
            <div style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: colors.gray400 }}>
              Zero pauses
            </div>
          </Card>
        </div>
      </div>

      {/* Weight Unit */}
      <div style={{ marginBottom: spacing.l, width: '100%' }}>
        <h3
          style={{
            fontSize: 'clamp(16px, 4vw, 18px)',
            fontWeight: 700,
            color: colors.white,
            marginBottom: spacing.s,
          }}
        >
          Weight Unit
        </h3>
        <div style={{ display: 'flex', gap: spacing.s }}>
          <button
            onClick={() => onUpdatePreferences({ weightUnit: 'lbs' })}
            style={{
              flex: 1,
              padding: spacing.m,
              background: preferences.weightUnit === 'lbs' ? colors.red : colors.gray800,
              border: 'none',
              borderRadius: '4px',
              color: colors.white,
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              fontWeight: preferences.weightUnit === 'lbs' ? 700 : 400,
              cursor: 'pointer',
            }}
          >
            Pounds (lbs)
          </button>
          <button
            onClick={() => onUpdatePreferences({ weightUnit: 'kg' })}
            style={{
              flex: 1,
              padding: spacing.m,
              background: preferences.weightUnit === 'kg' ? colors.red : colors.gray800,
              border: 'none',
              borderRadius: '4px',
              color: colors.white,
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              fontWeight: preferences.weightUnit === 'kg' ? 700 : 400,
              cursor: 'pointer',
            }}
          >
            Kilograms (kg)
          </button>
        </div>
      </div>

      {/* Push Notification Frequency */}
      <div style={{ marginBottom: spacing.l, width: '100%' }}>
        <h3
          style={{
            fontSize: 'clamp(16px, 4vw, 18px)',
            fontWeight: 700,
            color: colors.white,
            marginBottom: spacing.s,
          }}
        >
          Push Message Frequency
        </h3>
        <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
          {(['off', 'low', 'medium', 'high'] as const).map((freq) => (
            <button
              key={freq}
              onClick={() => onUpdatePreferences({ pushNotificationFrequency: freq })}
              style={{
                flex: '1 1 auto',
                minWidth: 'clamp(70px, 20vw, 90px)',
                padding: spacing.s,
                background:
                  preferences.pushNotificationFrequency === freq ? colors.red : colors.gray800,
                border: 'none',
                borderRadius: '4px',
                color: colors.white,
                fontSize: 'clamp(12px, 3vw, 14px)',
                fontWeight: preferences.pushNotificationFrequency === freq ? 700 : 400,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {freq}
            </button>
          ))}
        </div>
      </div>

      {/* Message Tones */}
      <div style={{ marginBottom: spacing.l, width: '100%' }}>
        <h3
          style={{
            fontSize: 'clamp(16px, 4vw, 18px)',
            fontWeight: 700,
            color: colors.white,
            marginBottom: spacing.s,
          }}
        >
          Message Tones
        </h3>
        <Card>
          {Object.entries(preferences.enabledMessageTones).map(([tone, enabled]) => (
            <button
              key={tone}
              onClick={() =>
                onUpdatePreferences({
                  enabledMessageTones: {
                    ...preferences.enabledMessageTones,
                    [tone]: !enabled,
                  },
                })
              }
              style={{
                width: '100%',
                padding: spacing.s,
                background: 'none',
                border: 'none',
                borderBottom: `1px solid ${colors.gray800}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  color: colors.white,
                  textTransform: 'capitalize',
                  textAlign: 'left',
                }}
              >
                {tone}
              </span>
              <span style={{ fontSize: 'clamp(20px, 5vw, 24px)' }}>
                {enabled ? '✅' : '⬜'}
              </span>
            </button>
          ))}
        </Card>
      </div>

      {/* About */}
      <div style={{ marginBottom: spacing.l, width: '100%' }}>
        <h3
          style={{
            fontSize: 'clamp(16px, 4vw, 18px)',
            fontWeight: 700,
            color: colors.white,
            marginBottom: spacing.s,
          }}
        >
          About
        </h3>
        <Card>
          <div style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', color: colors.gray400 }}>
            <div style={{ marginBottom: spacing.xs }}>
              <strong style={{ color: colors.white }}>Version:</strong> 1.0.0 (Prototype)
            </div>
            <div>
              <strong style={{ color: colors.white }}>Built with:</strong> React + TypeScript
            </div>
          </div>
        </Card>
      </div>

      {/* Danger Zone */}
      <div style={{ marginBottom: spacing.xl, width: '100%' }}>
        <h3
          style={{
            fontSize: 'clamp(16px, 4vw, 18px)',
            fontWeight: 700,
            color: colors.red,
            marginBottom: spacing.s,
          }}
        >
          Danger Zone
        </h3>
        <Button
          onClick={() => setShowClearConfirm(true)}
          fullWidth
          style={{ backgroundColor: '#991B1B', color: colors.white }}
        >
          🗑 Reset All Data
        </Button>
      </div>

      {/* Clear Data Confirmation */}
      {showClearConfirm && (
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
          }}
        >
          <div style={{ maxWidth: 'min(400px, 90vw)', width: '100%' }}>
            <div style={{ fontSize: 'clamp(64px, 15vw, 96px)', textAlign: 'center', marginBottom: spacing.m }}>
              ⚠️
            </div>
            <h2
              style={{
                fontSize: 'clamp(24px, 6vw, 32px)',
                fontWeight: 800,
                color: colors.red,
                marginBottom: spacing.s,
                textAlign: 'center',
              }}
            >
              Delete All Data?
            </h2>
            <p
              style={{
                fontSize: 'clamp(14px, 3.5vw, 16px)',
                color: colors.white,
                marginBottom: spacing.xl,
                textAlign: 'center',
              }}
            >
              {confirmStep === 0 && 'All your plans, workouts, and history will be permanently deleted.'}
              {confirmStep === 1 && 'This action cannot be undone. Are you absolutely sure?'}
              {confirmStep === 2 && 'Last chance! Click again to confirm deletion.'}
            </p>
            <Button
              onClick={handleClearData}
              fullWidth
              size="large"
              style={{ marginBottom: spacing.s, backgroundColor: '#991B1B' }}
            >
              {confirmStep === 0 && 'DELETE DATA'}
              {confirmStep === 1 && 'YES, DELETE EVERYTHING'}
              {confirmStep === 2 && 'CONFIRM DELETION'}
            </Button>
            <button
              onClick={() => {
                setShowClearConfirm(false);
                setConfirmStep(0);
              }}
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
