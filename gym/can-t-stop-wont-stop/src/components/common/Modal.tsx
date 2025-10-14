import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'danger' | 'fullscreen';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  actions?: React.ReactNode;
}

/**
 * Modal Component
 *
 * Variants:
 * - default: Standard modal with dark background
 * - danger: Modal with red border (for warnings)
 * - fullscreen: Full-screen overlay modal
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  variant = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  actions,
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const overlayClasses =
    variant === 'fullscreen'
      ? 'bg-primary-black bg-opacity-95'
      : 'bg-black bg-opacity-80';

  const modalClasses = {
    default: 'bg-primary-black border-2 border-white rounded-medium max-w-md w-full mx-4',
    danger: 'bg-primary-black border-4 border-primary-red rounded-medium max-w-md w-full mx-4',
    fullscreen: 'w-full h-full bg-transparent',
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${overlayClasses} animate-fade-in`}
      onClick={handleOverlayClick}
    >
      <div
        className={`${modalClasses[variant]} shadow-level3 animate-slide-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && variant !== 'fullscreen' && (
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            {title && <h2 className="text-h3 font-bold text-white">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-white hover:text-primary-red transition-colors text-2xl min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close modal"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={variant === 'fullscreen' ? 'h-full' : 'p-6'}>
          {children}
        </div>

        {/* Actions */}
        {actions && variant !== 'fullscreen' && (
          <div className="flex gap-4 p-6 border-t border-gray-800">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
