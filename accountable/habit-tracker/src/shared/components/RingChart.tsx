import { motion } from 'framer-motion';

interface RingChartProps {
  label: string;
  value: number; // 0-100 percentage
  color: 'blue' | 'purple' | 'green';
}

export const RingChart: React.FC<RingChartProps> = ({ label, value, color }) => {
  const radius = 40;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const colorMap = {
    blue: {
      bg: 'stroke-blue-100',
      fill: 'stroke-blue-500',
      text: 'text-blue-600'
    },
    purple: {
      bg: 'stroke-purple-100',
      fill: 'stroke-purple-500',
      text: 'text-purple-600'
    },
    green: {
      bg: 'stroke-green-100',
      fill: 'stroke-green-500',
      text: 'text-green-600'
    }
  };

  const colors = colorMap[color];

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            className={colors.bg}
            strokeWidth={strokeWidth}
            fill="none"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <motion.circle
            className={colors.fill}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{
              strokeDasharray: `${circumference} ${circumference}`,
            }}
          />
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${colors.text}`}>
            {Math.round(value)}%
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-600 font-medium">{label}</p>
    </div>
  );
};