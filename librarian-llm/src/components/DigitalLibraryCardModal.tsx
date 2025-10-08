import React, { useEffect, useRef } from 'react';
import { LibraryCard } from '../types';

interface DigitalLibraryCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
}

export const DigitalLibraryCardModal: React.FC<DigitalLibraryCardModalProps> = ({
  isOpen,
  onClose,
  onAction
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Mock library card data
  const cardData: LibraryCard = {
    patronName: 'Alex Johnson',
    cardNumber: '2491-3847-5820-1163',
    expirationDate: 'December 2026',
    libraryName: 'Anytown Public Library',
    barcode: '249138475820163'
  };

  // Focus management
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
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
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  if (!isOpen) return null;

  // Generate barcode SVG
  const generateBarcodeSVG = (code: string) => {
    const bars = code.split('').map((digit, i) => (
      <rect
        key={i}
        x={i * 4}
        y="0"
        width={parseInt(digit) % 2 === 0 ? 3 : 1}
        height="40"
        fill="black"
      />
    ));
    return (
      <svg width="200" height="40" className="mx-auto">
        {bars}
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 md:mx-auto overflow-hidden transform transition-all"
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 z-10"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Card Container */}
        <div className="p-6 md:p-8">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Your Digital Library Card
          </h2>

          {/* Library Card Visual */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white shadow-xl">
            {/* Library Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📚</span>
                <div>
                  <h3 className="text-lg font-bold">{cardData.libraryName}</h3>
                  <p className="text-xs opacity-90">Public Library System</p>
                </div>
              </div>
            </div>

            {/* Card Details */}
            <div className="space-y-4">
              {/* Patron Name */}
              <div>
                <p className="text-xs uppercase opacity-75 mb-1">Cardholder</p>
                <p className="text-xl font-semibold">{cardData.patronName}</p>
              </div>

              {/* Card Number */}
              <div>
                <p className="text-xs uppercase opacity-75 mb-1">Card Number</p>
                <p className="font-mono text-lg tracking-wider">{cardData.cardNumber}</p>
              </div>

              {/* Barcode */}
              <div className="bg-white rounded-lg p-3">
                {generateBarcodeSVG(cardData.barcode)}
                <p className="text-center text-xs text-gray-600 mt-1 font-mono">
                  {cardData.barcode}
                </p>
              </div>

              {/* Expiration */}
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs uppercase opacity-75">Valid Through</p>
                  <p className="text-sm">{cardData.expirationDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-75">Member Since</p>
                  <p className="text-sm">January 2024</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => onAction('save')}
              className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 font-medium"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>💾</span>
                <span>Save to Device</span>
              </span>
            </button>

            <button
              onClick={() => onAction('wallet')}
              className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>📱</span>
                <span>Add to Apple Wallet</span>
              </span>
            </button>
          </div>

          {/* Footer note */}
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
            This digital card is valid at all branch locations
          </p>
        </div>
      </div>
    </div>
  );
};