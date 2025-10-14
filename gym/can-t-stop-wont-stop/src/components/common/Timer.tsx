import React from 'react';
import { formatTime } from '../../utils/validation';

interface TimerProps {
  timeRemaining: number; // in seconds
  totalDuration: number; // in seconds
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
}

/**
 * Timer Display Component
 *
 * Color stages:
 * - Green: > 50% time remaining
 * - Yellow: 25-50% time remaining
 * - Red: < 25% time remaining
 * - Flashing red: < 60 seconds remaining
 */
const Timer: React.FC<TimerProps> = ({
  timeRemaining,
  totalDuration,
  size = 'large',
  showProgress = false,
}) => {
  // Calculate percentage remaining
  const percentageRemaining = (timeRemaining / totalDuration) * 100;

  // Determine color based on time remaining
  let textColorClass = 'text-semantic-success'; // Green
  if (percentageRemaining < 50 && percentageRemaining >= 25) {
    textColorClass = 'text-semantic-warning'; // Yellow
  } else if (percentageRemaining < 25) {
    textColorClass = 'text-semantic-error'; // Red
  }

  // Flash animation when under 60 seconds
  const shouldFlash = timeRemaining <= 60 && timeRemaining > 0;
  const flashClass = shouldFlash ? 'animate-flash' : '';

  // Size classes
  const sizeClasses = {
    small: 'text-4xl',
    medium: 'text-6xl',
    large: 'text-7xl md:text-8xl',
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`timer-display ${sizeClasses[size]} ${textColorClass} ${flashClass} font-mono tracking-wider`}
      >
        {formatTime(timeRemaining)}
      </div>

      {showProgress && (
        <div className="w-full mt-4">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                percentageRemaining > 50
                  ? 'bg-semantic-success'
                  : percentageRemaining > 25
                  ? 'bg-semantic-warning'
                  : 'bg-semantic-error'
              }`}
              style={{ width: `${Math.max(0, percentageRemaining)}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 text-center mt-2">
            {Math.floor(percentageRemaining)}% remaining
          </p>
        </div>
      )}
    </div>
  );
};

export default Timer;
