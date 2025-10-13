import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
}) => {
  const heights = {
    small: 'clamp(44px, 12vw, 52px)',
    medium: 'clamp(52px, 14vw, 60px)',
    large: 'clamp(60px, 16vw, 72px)',
  };

  const styles: React.CSSProperties = {
    width: fullWidth ? '100%' : 'auto',
    minWidth: fullWidth ? undefined : 'clamp(120px, 30vw, 200px)',
    height: heights[size],
    backgroundColor: variant === 'primary' ? colors.red : 'transparent',
    border: variant === 'secondary' ? `2px solid ${colors.white}` : 'none',
    color: colors.white,
    fontSize: 'clamp(14px, 4vw, 18px)',
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.1s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: `0 clamp(12px, 3vw, 24px)`,
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
  };

  return (
    <button
      style={styles}
      onClick={onClick}
      disabled={disabled}
      onTouchStart={(e) => {
        e.currentTarget.style.transform = 'scale(0.98)';
        e.currentTarget.style.opacity = '0.9';
      }}
      onTouchEnd={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.opacity = '1';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.98)';
        e.currentTarget.style.opacity = '0.9';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.opacity = '1';
      }}
    >
      {children}
    </button>
  );
};
