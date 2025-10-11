import { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';

interface ModeSelectionScreenProps {
  onModeSelected: (mode: 'challenge' | 'beast') => void;
}

export const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({
  onModeSelected,
}) => {
  const [selectedMode, setSelectedMode] = useState<'challenge' | 'beast' | null>(null);

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
      <h1
        style={{
          fontSize: 'clamp(24px, 6vw, 32px)',
          fontWeight: 700,
          color: colors.white,
          marginTop: spacing.xl,
          marginBottom: spacing.l,
          width: '100%',
        }}
      >
        Choose Your Mode
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.m, flex: 1 }}>
        <Card
          onClick={() => setSelectedMode('challenge')}
          borderColor={selectedMode === 'challenge' ? colors.red : colors.gray800}
        >
          <h2
            style={{
              fontSize: 'clamp(20px, 5vw, 24px)',
              fontWeight: 800,
              color: colors.white,
              marginBottom: spacing.s,
              wordBreak: 'break-word',
            }}
          >
            ⚡ CHALLENGE MODE
          </h2>
          <p
            style={{
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              color: colors.whiteMuted,
              marginBottom: spacing.s,
              lineHeight: 1.5,
            }}
          >
            3 pauses allowed during workout. For those who need mercy.
          </p>
          <div
            style={{
              fontSize: 'clamp(12px, 3vw, 14px)',
              color: colors.gray500,
              lineHeight: 1.6,
            }}
          >
            • Limited pause functionality
            <br />• Best for building discipline
            <br />• Recommended for most users
          </div>
        </Card>

        <Card
          onClick={() => setSelectedMode('beast')}
          borderColor={selectedMode === 'beast' ? colors.red : colors.gray800}
        >
          <h2
            style={{
              fontSize: 'clamp(20px, 5vw, 24px)',
              fontWeight: 800,
              color: colors.white,
              marginBottom: spacing.s,
              wordBreak: 'break-word',
            }}
          >
            💪 BEAST MODE
          </h2>
          <p
            style={{
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              color: colors.whiteMuted,
              marginBottom: spacing.s,
              lineHeight: 1.5,
            }}
          >
            ZERO pauses. No weakness allowed. Pure grind.
          </p>
          <div
            style={{
              fontSize: 'clamp(12px, 3vw, 14px)',
              color: colors.gray500,
              lineHeight: 1.6,
            }}
          >
            • No pause button
            <br />• Finish or quit early
            <br />• For the committed
          </div>
        </Card>
      </div>

      <div style={{ marginTop: spacing.l }}>
        <Button
          onClick={() => selectedMode && onModeSelected(selectedMode)}
          disabled={!selectedMode}
          fullWidth
          size="large"
        >
          CONTINUE
        </Button>
      </div>
    </div>
  );
};
