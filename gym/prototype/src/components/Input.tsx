import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number';
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
}) => {
  const styles: React.CSSProperties = {
    width: '100%',
    height: 'clamp(52px, 14vw, 60px)',
    backgroundColor: colors.blackSecondary,
    border: `1px solid ${colors.gray700}`,
    color: colors.white,
    fontSize: 'clamp(14px, 4vw, 18px)',
    padding: 'clamp(12px, 3vw, 16px)',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
  };

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={styles}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = colors.red;
        e.currentTarget.style.borderWidth = '2px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = colors.gray700;
        e.currentTarget.style.borderWidth = '1px';
      }}
    />
  );
};
