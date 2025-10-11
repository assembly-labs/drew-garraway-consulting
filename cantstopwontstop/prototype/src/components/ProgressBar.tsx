import { colors } from '../constants/colors';

interface ProgressBarProps {
  percentage: number; // 0-100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        backgroundColor: colors.gray900,
        zIndex: 9999,
        width: '100%',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${clampedPercentage}%`,
          backgroundColor: colors.red,
          transition: 'width 0.5s linear',
          boxShadow: `0 0 10px ${colors.red}`,
        }}
      />
    </div>
  );
};
