import { useEffect } from 'react';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: colors.red,
    error: '#DC2626',
    info: colors.gray700,
  }[type];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: spacing.l,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: bgColor,
        color: colors.white,
        padding: `${spacing.s} ${spacing.m}`,
        borderRadius: '8px',
        fontSize: 'clamp(14px, 3.5vw, 16px)',
        fontWeight: 600,
        zIndex: 9999,
        animation: 'slideUp 0.3s ease-out',
        maxWidth: 'min(400px, 90vw)',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
      }}
      onClick={onClose}
    >
      {message}
      <style>
        {`
          @keyframes slideUp {
            from {
              transform: translate(-50%, 20px);
              opacity: 0;
            }
            to {
              transform: translate(-50%, 0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};
