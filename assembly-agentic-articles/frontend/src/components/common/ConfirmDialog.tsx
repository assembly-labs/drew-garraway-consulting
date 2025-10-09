import React, { useRef, useEffect } from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false
}) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Focus cancel button by default (safer)
  useEffect(() => {
    if (isOpen && cancelButtonRef.current) {
      setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle Enter key to confirm
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isOpen) {
        e.preventDefault();
        handleConfirm();
      }
    };

    if (isOpen) {
      document.addEventListener('keypress', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex gap-3 justify-end">
          <button
            ref={cancelButtonRef}
            onClick={onClose}
            className="btn btn-secondary"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <div className="flex gap-4">
        {danger && (
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        )}
        <div className="flex-1">
          <p className="text-text-primary text-base">
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
