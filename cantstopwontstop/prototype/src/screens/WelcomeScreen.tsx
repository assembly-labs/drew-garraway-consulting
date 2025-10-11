import { Button } from '../components/Button';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  return (
    <div
      style={{
        backgroundColor: colors.black,
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.m,
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden',
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(64px, 15vw, 96px)',
          fontWeight: 800,
          color: colors.white,
          marginBottom: spacing.l,
          textAlign: 'center',
          lineHeight: 1,
        }}
      >
        🔥
      </h1>
      <h1
        style={{
          fontSize: 'clamp(32px, 8vw, 48px)',
          fontWeight: 700,
          color: colors.white,
          marginBottom: spacing.s,
          textAlign: 'center',
          letterSpacing: '-0.02em',
          width: '100%',
          maxWidth: '90vw',
        }}
      >
        CAN'T STOP
        <br />
        WON'T STOP
      </h1>
      <p
        style={{
          fontSize: 'clamp(14px, 4vw, 18px)',
          color: colors.whiteMuted,
          maxWidth: 'min(320px, 90vw)',
          textAlign: 'center',
          marginBottom: spacing.xl,
          lineHeight: 1.5,
          padding: `0 ${spacing.s}`,
        }}
      >
        The relentless workout timer. Set your time. Grind through exercises. Finish or fail.
      </p>
      <div style={{ width: '100%', maxWidth: 'min(400px, 90vw)', padding: `0 ${spacing.s}` }}>
        <Button onClick={onContinue} size="large" fullWidth>
          LET'S GO
        </Button>
      </div>
    </div>
  );
};
