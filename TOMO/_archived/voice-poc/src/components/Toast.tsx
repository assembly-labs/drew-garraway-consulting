import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'error' | 'success';
  duration?: number;
  onDismiss: () => void;
}

export function Toast({
  message,
  type = 'error',
  duration = 5000,
  onDismiss,
}: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onDismiss, 150); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      className={`toast toast--${type}${isExiting ? ' toast-exit' : ''}`}
      role="alert"
    >
      <span className="toast-message">{message}</span>
    </div>
  );
}
