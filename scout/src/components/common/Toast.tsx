import React, { useEffect, useState } from 'react';
import { Toast as ToastType } from '../../types';

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(toast.id), 200);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-sage-50 border-sage-200 text-sage-800 dark:bg-sage-900 dark:border-sage-700 dark:text-sage-200';
      case 'error':
        return 'bg-error-light border-error text-error-dark dark:bg-error/20 dark:border-error dark:text-error';
      case 'warning':
        return 'bg-attention-light border-attention text-attention-dark dark:bg-attention/20 dark:border-attention dark:text-coral-300';
      case 'info':
        return 'bg-navy-50 border-navy-200 text-navy-800 dark:bg-navy-900 dark:border-navy-700 dark:text-navy-200';
    }
  };

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      className={`
        ${getStyles()}
        ${isExiting ? 'toast-exit' : 'toast-enter'}
        flex items-start gap-3 p-4 rounded-lg border shadow-lg
        min-w-[300px] max-w-[400px]
      `}
    >
      {/* Icon */}
      <span className="text-xl flex-shrink-0" aria-hidden="true">
        {getIcon()}
      </span>

      {/* Content */}
      <div className="flex-1">
        <p className="font-medium">{toast.message}</p>
        {toast.description && (
          <p className="mt-1 text-sm opacity-90">{toast.description}</p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 rounded"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};