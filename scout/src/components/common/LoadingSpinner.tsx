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
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative">
        {/* Book flip animation */}
        <div className={`${sizeClasses[size]} animate-book-flip`}>
          📖
        </div>
      </div>

      {message && (
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 animate-pulse">
          {message || "Finding your next great read..."}
        </p>
      )}
    </div>
  );
};