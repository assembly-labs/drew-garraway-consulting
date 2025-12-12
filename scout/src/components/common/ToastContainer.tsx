import React from 'react';
import ReactDOM from 'react-dom';
import { Toast } from './Toast';
import { useToastContext } from '../../contexts/ToastContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastContext();

  if (toasts.length === 0) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed top-4 right-4 z-[60] space-y-3"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={removeToast}
        />
      ))}
    </div>,
    document.body
  );
};