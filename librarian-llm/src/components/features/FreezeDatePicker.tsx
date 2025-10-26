import React, { useState, useEffect, useRef } from 'react';

interface FreezeDatePickerProps {
  isOpen: boolean;
  bookTitle: string;
  onConfirm: (date: string) => void;
  onCancel: () => void;
}

export const FreezeDatePicker: React.FC<FreezeDatePickerProps> = ({
  isOpen,
  bookTitle,
  onConfirm,
  onCancel
}) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Calculate min and max dates
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);
  const maxDateString = maxDate.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(minDate);

  // Focus management
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isOpen && dateInputRef.current) {
      timeoutId = setTimeout(() => dateInputRef.current?.focus(), 100);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
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
  }, [isOpen, onCancel]);

  const handleConfirm = () => {
    onConfirm(selectedDate);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50 transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="freeze-title"
        aria-describedby="freeze-description"
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4 p-6"
      >
        <h2 id="freeze-title" className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Freeze hold for '{bookTitle}'
        </h2>

        <p id="freeze-description" className="text-gray-600 dark:text-gray-300 mb-4">
          Your hold will be paused until the date you choose. You won't lose your place in line.
        </p>

        <div className="mb-4">
          <label htmlFor="freeze-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select date to resume hold
          </label>
          <input
            ref={dateInputRef}
            id="freeze-date"
            type="date"
            min={minDate}
            max={maxDateString}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Maximum freeze: 60 days
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
          >
            Freeze Hold
          </button>
        </div>
      </div>
    </div>
  );
};