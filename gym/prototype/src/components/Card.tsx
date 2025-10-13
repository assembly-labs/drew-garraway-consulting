import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  borderColor?: string;
}

export const Card: React.FC<CardProps> = ({ children, onClick, borderColor }) => {
  const styles: React.CSSProperties = {
    backgroundColor: colors.blackSecondary,
    padding: 'clamp(12px, 3vw, 16px)',
    border: `1px solid ${borderColor || colors.gray800}`,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'border-color 0.2s ease',
    width: '100%',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
  };

  return (
    <div
      style={styles}
      onClick={onClick}
      onTouchStart={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = colors.red;
        }
      }}
      onTouchEnd={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = borderColor || colors.gray800;
        }
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = colors.red;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = borderColor || colors.gray800;
        }
      }}
    >
      {children}
    </div>
  );
};
