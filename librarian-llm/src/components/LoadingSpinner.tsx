import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative">
        {/* Spinning circle */}
        <div className={`${sizeClasses[size]} animate-spin`}>
          <div className="h-full w-full rounded-full border-4 border-gray-200 border-t-primary-600"></div>
        </div>
      </div>

      {message && (
        <p className="mt-3 text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
};

// Loading dots component for chat messages
export const LoadingDots: React.FC = () => {
  return (
    <div className="flex space-x-1 p-2">
      <div className="w-2 h-2 bg-gray-400 rounded-full loading-dot"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full loading-dot"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full loading-dot"></div>
    </div>
  );
};