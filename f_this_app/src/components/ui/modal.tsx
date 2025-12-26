'use client';

import { Fragment, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  showClose?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  full: 'max-w-full mx-4',
};

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  showClose = true,
  size = 'md',
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
              'w-full p-6 rounded-2xl',
              'bg-gradient-to-b from-gray-800 to-gray-900',
              'border border-gray-700 shadow-2xl',
              sizes[size]
            )}
          >
            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-center justify-between mb-4">
                {title && (
                  <h2 className="text-xl font-bold text-white">{title}</h2>
                )}
                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            {children}
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}

// Bottom sheet variant for mobile
export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
}: Omit<ModalProps, 'size'>) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'fixed left-0 right-0 bottom-0 z-50',
              'p-6 pt-4 rounded-t-3xl',
              'bg-gradient-to-b from-gray-800 to-gray-900',
              'border-t border-gray-700',
              'max-h-[90vh] overflow-y-auto'
            )}
          >
            {/* Handle */}
            <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-4" />

            {/* Header */}
            {title && (
              <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
            )}

            {/* Content */}
            {children}
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}
