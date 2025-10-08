import React, { useState } from 'react';
import { HoldCard } from './HoldCard';
import { ConfirmDialog } from './ConfirmDialog';
import { FreezeDatePicker } from './FreezeDatePicker';
import { useHolds } from '../hooks/useHolds';

interface MyHoldsPageProps {
  onClose: () => void;
}

export const MyHoldsPage: React.FC<MyHoldsPageProps> = ({ onClose }) => {
  const {
    groupedHolds,
    isLoading,
    processingId,
    totalCount,
    cancelHold,
    freezeHold,
    checkOutDigital
  } = useHolds();

  // Dialog states
  const [cancelDialog, setCancelDialog] = useState<{ holdId: string; bookTitle: string } | null>(null);
  const [freezeDialog, setFreezeDialog] = useState<{ holdId: string; bookTitle: string } | null>(null);

  // Handle cancel confirmation
  const handleCancelConfirm = async () => {
    if (cancelDialog) {
      await cancelHold(cancelDialog.holdId, cancelDialog.bookTitle);
      setCancelDialog(null);
    }
  };

  // Handle freeze confirmation
  const handleFreezeConfirm = async (date: string) => {
    if (freezeDialog) {
      await freezeHold(freezeDialog.holdId, freezeDialog.bookTitle, date);
      setFreezeDialog(null);
    }
  };

  // Handle check out
  const handleCheckOut = async (holdId: string, bookTitle: string) => {
    await checkOutDigital(holdId, bookTitle);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Dialogs */}
      <ConfirmDialog
        isOpen={!!cancelDialog}
        title="Cancel this hold?"
        message={cancelDialog ? `Are you sure you want to cancel your hold on '${cancelDialog.bookTitle}'? You'll lose your place in line.` : ''}
        confirmText="Cancel Hold"
        cancelText="Keep Hold"
        confirmStyle="destructive"
        onConfirm={handleCancelConfirm}
        onCancel={() => setCancelDialog(null)}
      />

      {freezeDialog && (
        <FreezeDatePicker
          isOpen={!!freezeDialog}
          bookTitle={freezeDialog.bookTitle}
          onConfirm={handleFreezeConfirm}
          onCancel={() => setFreezeDialog(null)}
        />
      )}

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Back to main"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                My Holds
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {totalCount === 0
                  ? 'You have no holds'
                  : `You have ${totalCount} ${totalCount === 1 ? 'item' : 'items'} on hold`}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          // Loading state
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border rounded-lg p-4 bg-white dark:bg-gray-800 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : totalCount === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No holds yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              You don't have any holds. Place a hold on popular titles to reserve them when they become available!
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          // Holds list grouped by status
          <div className="space-y-6">
            {/* Ready for Pickup */}
            {groupedHolds.ready.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  ━━━ READY FOR PICKUP ({groupedHolds.ready.length}) ━━━
                </h2>
                <div className="space-y-3">
                  {groupedHolds.ready.map(hold => (
                    <HoldCard
                      key={hold.id}
                      hold={hold}
                      onCancel={(id, title) => setCancelDialog({ holdId: id, bookTitle: title })}
                      onFreeze={(id, title) => setFreezeDialog({ holdId: id, bookTitle: title })}
                      onCheckOut={handleCheckOut}
                      isProcessing={processingId === hold.id}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Waiting */}
            {groupedHolds.waiting.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  ━━━ WAITING ({groupedHolds.waiting.length}) ━━━
                </h2>
                <div className="space-y-3">
                  {groupedHolds.waiting.map(hold => (
                    <HoldCard
                      key={hold.id}
                      hold={hold}
                      onCancel={(id, title) => setCancelDialog({ holdId: id, bookTitle: title })}
                      onFreeze={(id, title) => setFreezeDialog({ holdId: id, bookTitle: title })}
                      onCheckOut={handleCheckOut}
                      isProcessing={processingId === hold.id}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Coming Soon */}
            {groupedHolds.coming_soon.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  ━━━ COMING SOON ({groupedHolds.coming_soon.length}) ━━━
                </h2>
                <div className="space-y-3">
                  {groupedHolds.coming_soon.map(hold => (
                    <HoldCard
                      key={hold.id}
                      hold={hold}
                      onCancel={(id, title) => setCancelDialog({ holdId: id, bookTitle: title })}
                      onFreeze={(id, title) => setFreezeDialog({ holdId: id, bookTitle: title })}
                      onCheckOut={handleCheckOut}
                      isProcessing={processingId === hold.id}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
};