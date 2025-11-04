import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  type?: 'error' | 'warning' | 'info';
  suggestions?: string[];
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Oops! Something went wrong',
  message,
  onRetry,
  type = 'error',
  suggestions = []
}) => {
  const typeStyles = {
    error: 'bg-error-light border-error text-error-dark',
    warning: 'bg-attention-light border-attention text-attention-dark',
    info: 'bg-navy-50 border-navy-200 text-navy-800'
  };

  const iconStyles = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  // Get helpful suggestions based on error type
  const getDefaultSuggestions = () => {
    if (suggestions.length > 0) return suggestions;

    if (message.toLowerCase().includes('api key')) {
      return [
        'Check that your API key is correctly set in the .env file',
        'Ensure your API key starts with "sk-ant-api03-"',
        'Verify your API key has not been revoked'
      ];
    }
    if (message.toLowerCase().includes('network') || message.toLowerCase().includes('connection')) {
      return [
        'Check your internet connection',
        'Try refreshing the page',
        'Wait a moment and try again'
      ];
    }
    if (message.toLowerCase().includes('rate limit')) {
      return [
        'You\'ve made too many requests',
        'Wait a few seconds before trying again',
        'Consider spacing out your queries'
      ];
    }
    return [];
  };

  const helpfulSuggestions = getDefaultSuggestions();

  return (
    <div
      className={`rounded-lg border-2 p-4 ${typeStyles[type]}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start space-x-3">
        <span className="text-2xl" aria-hidden="true">
          {iconStyles[type]}
        </span>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className="text-sm">{message}</p>

          {helpfulSuggestions.length > 0 && (
            <div className="mt-3 text-sm">
              <p className="font-medium mb-1">Try these steps:</p>
              <ul className="list-disc list-inside space-y-1 opacity-90">
                {helpfulSuggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2 bg-surface border border-current rounded-md hover:bg-neutral-50 transition-colors text-sm font-medium"
              aria-label="Try again"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};