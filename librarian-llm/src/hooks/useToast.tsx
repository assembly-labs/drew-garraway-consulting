import { useToastContext } from '../contexts/ToastContext';

interface ToastOptions {
  description?: string;
  duration?: number;
}

export const useToast = () => {
  const { addToast, removeToast } = useToastContext();

  const toast = {
    success: (message: string, options?: ToastOptions) => {
      addToast({
        type: 'success',
        message,
        ...options
      });
    },
    error: (message: string, options?: ToastOptions) => {
      addToast({
        type: 'error',
        message,
        ...options
      });
    },
    warning: (message: string, options?: ToastOptions) => {
      addToast({
        type: 'warning',
        message,
        ...options
      });
    },
    info: (message: string, options?: ToastOptions) => {
      addToast({
        type: 'info',
        message,
        ...options
      });
    },
    remove: removeToast
  };

  return toast;
};