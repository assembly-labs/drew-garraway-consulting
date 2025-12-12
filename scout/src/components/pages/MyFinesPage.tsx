import React, { useState } from 'react';
import { FineCard } from '../features/FineCard';
import { PaymentModal } from '../modals/PaymentModal';
import { useFines } from '../../hooks/useFines';

interface MyFinesPageProps {
  onClose: () => void;
}

export const MyFinesPage: React.FC<MyFinesPageProps> = ({ onClose }) => {
  const {
    fines,
    paymentHistory,
    selectedFineIds,
    totalOutstanding,
    selectedTotal,
    isProcessingPayment,
    showPaymentHistory,
    setShowPaymentHistory,
    toggleFineSelection,
    selectAllFines,
    clearSelection,
    processPayment,
    formatCurrency
  } = useFines();

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Handle payment
  const handlePayment = async (paymentMethod: 'credit_card' | 'cash' | 'check') => {
    await processPayment(paymentMethod);
    setShowPaymentModal(false);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-page dark:bg-navy-900">
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        amount={selectedTotal}
        selectedFinesCount={selectedFineIds.length}
        onConfirm={handlePayment}
        onCancel={() => setShowPaymentModal(false)}
      />

      {/* Header */}
      <header className="bg-white dark:bg-navy-800 shadow-sm border-b border-neutral-300 dark:border-navy-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-navy-700 transition-colors focus:outline-none focus:ring-2 focus:ring-navy"
                aria-label="Back to main"
              >
                <svg className="w-6 h-6 text-neutral-text dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-navy-900 dark:text-neutral-100">
                  My Fines & Fees
                </h1>
                {totalOutstanding > 0 && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Balance due: {formatCurrency(totalOutstanding)}
                  </p>
                )}
              </div>
            </div>

            {/* View Toggle */}
            <button
              onClick={() => setShowPaymentHistory(!showPaymentHistory)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              {showPaymentHistory ? 'View Outstanding' : 'View Payment History'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {totalOutstanding === 0 && !showPaymentHistory ? (
          // Zero balance celebration
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
              No Fines!
            </h2>
            <p className="text-neutral-text dark:text-neutral-300 max-w-md mx-auto">
              You have no outstanding fines. Keep up the great work returning your items on time!
            </p>

            {paymentHistory.length > 0 && (
              <button
                onClick={() => setShowPaymentHistory(true)}
                className="mt-6 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
              >
                View Payment History
              </button>
            )}
          </div>
        ) : showPaymentHistory ? (
          // Payment History
          <div>
            <h2 className="text-lg font-semibold text-navy-900 dark:text-neutral-100 mb-4">
              Payment History
            </h2>

            {paymentHistory.length === 0 ? (
              <div className="bg-white dark:bg-navy-800 border border-neutral-300 dark:border-navy-700 rounded-lg p-8 text-center">
                <p className="text-neutral-text dark:text-neutral-300">
                  No payment history available
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentHistory.map(payment => (
                  <div
                    key={payment.id}
                    className="bg-white dark:bg-navy-800 border border-neutral-300 dark:border-navy-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-navy-900 dark:text-neutral-100">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-sm text-neutral-text dark:text-neutral-300">
                          Paid on {formatDate(payment.date)}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          Method: {payment.method === 'credit_card' ? 'Credit Card' :
                                   payment.method === 'cash' ? 'Cash' : 'Check'}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {payment.fines_paid.length} {payment.fines_paid.length === 1 ? 'fine' : 'fines'} paid
                        </p>
                      </div>
                      <span className="text-sm text-green-600 dark:text-green-400">
                        ✓ Paid
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Outstanding Fines
          <div>
            {/* Total and Actions */}
            <div className="bg-white dark:bg-navy-800 border border-neutral-300 dark:border-navy-700 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-navy-900 dark:text-neutral-100">
                    Outstanding Fines
                  </h2>
                  <p className="text-sm text-neutral-text dark:text-neutral-300">
                    {fines.length} {fines.length === 1 ? 'fine' : 'fines'} • Total: {formatCurrency(totalOutstanding)}
                  </p>
                </div>

                {fines.length > 0 && (
                  <div className="flex gap-2">
                    {selectedFineIds.length === fines.length ? (
                      <button
                        onClick={clearSelection}
                        className="text-sm text-neutral-text dark:text-neutral-300 hover:text-gray-800 dark:hover:text-gray-200"
                      >
                        Clear Selection
                      </button>
                    ) : (
                      <button
                        onClick={selectAllFines}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        Select All
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Bar */}
              {selectedFineIds.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {selectedFineIds.length} {selectedFineIds.length === 1 ? 'fine' : 'fines'} selected
                    </p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      Total: {formatCurrency(selectedTotal)}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    disabled={isProcessingPayment}
                    className="px-4 py-2 bg-navy text-white rounded-md hover:bg-navy-600 transition-colors focus:outline-none focus:ring-2 focus:ring-navy disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessingPayment ? 'Processing...' : 'Pay Selected'}
                  </button>
                </div>
              )}
            </div>

            {/* Fines List */}
            {fines.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-navy-900 dark:text-neutral-100 mb-2">
                  All clear!
                </h3>
                <p className="text-neutral-text dark:text-neutral-300">
                  You have no outstanding fines.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {fines.map(fine => (
                  <FineCard
                    key={fine.id}
                    fine={fine}
                    isSelected={selectedFineIds.includes(fine.id)}
                    onToggleSelect={toggleFineSelection}
                  />
                ))}
              </div>
            )}

            {/* Payment Information */}
            <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-navy-900 dark:text-neutral-100 mb-2">
                Payment Options
              </h3>
              <ul className="space-y-2 text-sm text-neutral-text dark:text-neutral-300">
                <li className="flex items-start">
                  <span className="mr-2">💳</span>
                  <span>Pay online with credit or debit card (instant)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">💵</span>
                  <span>Pay with cash at any library branch</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📝</span>
                  <span>Pay by check at any library branch</span>
                </li>
              </ul>
              <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-400">
                Note: Items cannot be checked out while fines exceed $10.00
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};