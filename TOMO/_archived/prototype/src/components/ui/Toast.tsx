/**
 * Toast Notification System
 *
 * Provides non-blocking feedback for user actions.
 * Automatically dismisses after a configurable duration.
 *
 * Usage:
 *   import { ToastProvider, useToast } from '@/components/ui/Toast';
 *
 *   // In component:
 *   const { showToast } = useToast();
 *   showToast({ message: 'Session saved!', type: 'success' });
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// ===========================================
// TYPES
// ===========================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number; // ms
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
}

// ===========================================
// CONTEXT
// ===========================================

const ToastContext = createContext<ToastContextType | null>(null);

// ===========================================
// PROVIDER
// ===========================================

interface ToastProviderProps {
  children: ReactNode;
  /** Default duration in ms (default: 4000) */
  defaultDuration?: number;
  /** Maximum toasts shown at once (default: 3) */
  maxToasts?: number;
}

export function ToastProvider({
  children,
  defaultDuration = 4000,
  maxToasts = 3,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const duration = toast.duration ?? defaultDuration;

    setToasts(prev => {
      const newToasts = [...prev, { ...toast, id }];
      // Limit number of toasts
      if (newToasts.length > maxToasts) {
        return newToasts.slice(-maxToasts);
      }
      return newToasts;
    });

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => hideToast(id), duration);
    }
  }, [defaultDuration, maxToasts, hideToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={hideToast} />
    </ToastContext.Provider>
  );
}

// ===========================================
// HOOK
// ===========================================

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

// ===========================================
// TOAST CONTAINER
// ===========================================

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 'calc(80px + env(safe-area-inset-bottom))', // Above tab bar
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        width: '100%',
        maxWidth: '400px',
        padding: '0 var(--space-4)',
        pointerEvents: 'none',
      }}
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// ===========================================
// TOAST ICON (must be outside ToastItem to prevent recreation)
// ===========================================

function ToastIcon({ type }: { type: ToastType }) {
  const iconProps = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (type) {
    case 'success':
      return (
        <svg {...iconProps}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case 'error':
      return (
        <svg {...iconProps}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );
    case 'warning':
      return (
        <svg {...iconProps}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case 'info':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
  }
}

// ===========================================
// TOAST ITEM
// ===========================================

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 200);
  }, [toast.id, onDismiss]);

  // Color schemes by type (dark theme, SVG lineart icons)
  const styles = {
    success: {
      background: 'var(--color-positive)',
    },
    error: {
      background: 'var(--color-negative)',
    },
    warning: {
      background: 'var(--color-warning)',
    },
    info: {
      background: 'var(--color-info)',
    },
  };

  const { background } = styles[toast.type];

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        background,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        color: toast.type === 'warning' ? 'var(--color-black)' : 'var(--color-white)',
        fontWeight: 500,
        fontSize: 'var(--text-sm)',
        pointerEvents: 'auto',
        animation: isExiting
          ? 'toast-slide-out var(--duration-fast, 0.15s) ease-in forwards'
          : 'toast-slide-in var(--duration-normal, 0.25s) cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      {/* Icon - SVG lineart */}
      <span
        aria-hidden="true"
        style={{
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '50%',
        }}
      >
        <ToastIcon type={toast.type} />
      </span>

      {/* Message */}
      <span style={{ flex: 1 }}>{toast.message}</span>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        style={{
          padding: 'var(--space-1)',
          background: 'rgba(0,0,0,0.2)',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          color: 'inherit',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '28px',
          minHeight: '28px',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

// ===========================================
// CSS KEYFRAMES (add to index.css)
// ===========================================

// @keyframes toast-enter {
//   from {
//     opacity: 0;
//     transform: translateY(20px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }
//
// @keyframes toast-exit {
//   from {
//     opacity: 1;
//     transform: translateY(0);
//   }
//   to {
//     opacity: 0;
//     transform: translateY(-10px);
//   }
// }
