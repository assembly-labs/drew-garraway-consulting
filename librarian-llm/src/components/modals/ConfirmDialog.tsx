import React, { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmStyle?: 'default' | 'destructive';
  warning?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmStyle = 'default',
  warning = false,
  onConfirm,
  onCancel
}) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isOpen && cancelButtonRef.current) {
      timeoutId = setTimeout(() => cancelButtonRef.current?.focus(), 100);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50 transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        className="relative bg-surface dark:bg-navy-800 rounded-lg shadow-2xl max-w-md w-full mx-4 p-6"
      >
        {warning && (
          <div className="mb-4 text-center text-4xl">⚠️</div>
        )}

        <h2 id="dialog-title" className="text-xl font-bold text-navy-900 dark:text-white mb-3">
          {title}
        </h2>

        <p id="dialog-description" className="text-neutral-600 dark:text-neutral-300 mb-6">
          {message}
        </p>

        <div className="flex gap-3 justify-end">
          <button
            ref={cancelButtonRef}
            onClick={onCancel}
            className="px-4 py-2 text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-navy-700 rounded-md hover:bg-neutral-200 dark:hover:bg-navy-600 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              confirmStyle === 'destructive'
                ? 'bg-error text-white hover:bg-error/90 focus:ring-error'
                : 'bg-navy-600 text-white hover:bg-navy-700 focus:ring-navy-500'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};