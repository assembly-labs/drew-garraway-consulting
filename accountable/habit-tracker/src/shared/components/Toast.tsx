import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ToastProps {
  message: string;
  onUndo?: () => void;
  onDismiss: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  onUndo,
  onDismiss,
  duration = 5000
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-24 left-6 right-6 z-50"
    >
      <div className="bg-gray-900 text-white rounded-lg shadow-2xl px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-medium">{message}</span>

        <div className="flex items-center gap-2 ml-4">
          {onUndo && (
            <button
              onClick={() => {
                onUndo();
                onDismiss();
              }}
              className="text-blue-400 font-semibold text-sm hover:text-blue-300 transition-colors uppercase tracking-wide"
            >
              Undo
            </button>
          )}
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: Array<ToastProps & { id: string }>;
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <AnimatePresence mode="sync">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          onUndo={toast.onUndo}
          onDismiss={() => onDismiss(toast.id)}
          duration={toast.duration}
        />
      ))}
    </AnimatePresence>
  );
};
