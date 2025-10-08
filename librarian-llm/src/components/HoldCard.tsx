import React from 'react';
import { HoldItem } from '../types';

interface HoldCardProps {
  hold: HoldItem;
  onCancel: (holdId: string, bookTitle: string) => void;
  onFreeze: (holdId: string, bookTitle: string) => void;
  onCheckOut: (holdId: string, bookTitle: string) => void;
  isProcessing: boolean;
}

export const HoldCard: React.FC<HoldCardProps> = ({
  hold,
  onCancel,
  onFreeze,
  onCheckOut,
  isProcessing
}) => {
  // Get status display info
  const getStatusDisplay = () => {
    switch (hold.status) {
      case 'ready':
        return {
          badge: '✅ Ready for pickup',
          badgeClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          cardClass: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
        };
      case 'waiting':
        return {
          badge: '⏳ In queue',
          badgeClass: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          cardClass: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700'
        };
      case 'coming_soon':
        return {
          badge: '📅 Coming soon',
          badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          cardClass: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700'
        };
    }
  };

  // Get format display
  const getFormatDisplay = () => {
    switch (hold.format) {
      case 'physical':
        return { icon: '📕', label: 'Physical' };
      case 'ebook':
        return { icon: '📱', label: 'eBook' };
      case 'audiobook':
        return { icon: '🎧', label: 'Audiobook' };
    }
  };

  // Get expiry warning for ready items
  const getExpiryWarning = () => {
    if (hold.status !== 'ready' || !hold.days_until_expiry) return null;

    if (hold.days_until_expiry === 0) {
      return { message: 'Expires today!', urgent: true, color: 'text-red-600 dark:text-red-400' };
    } else if (hold.days_until_expiry === 1) {
      return { message: 'Expires tomorrow', urgent: true, color: 'text-orange-600 dark:text-orange-400' };
    } else if (hold.days_until_expiry <= 3) {
      return { message: `Expires in ${hold.days_until_expiry} days`, urgent: false, color: 'text-yellow-600 dark:text-yellow-400' };
    } else {
      return { message: `Expires in ${hold.days_until_expiry} days`, urgent: false, color: 'text-gray-600 dark:text-gray-400' };
    }
  };

  // Get queue position message
  const getQueueMessage = () => {
    if (hold.status !== 'waiting' || !hold.position || !hold.queue_length) return null;

    if (hold.position === 1) {
      return {
        message: "You're next in line! 🎉",
        color: 'text-green-600 dark:text-green-400 font-semibold'
      };
    }
    return {
      message: `You're #${hold.position} of ${hold.queue_length} in line`,
      color: 'text-gray-600 dark:text-gray-400'
    };
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const status = getStatusDisplay();
  const format = getFormatDisplay();
  const expiryWarning = getExpiryWarning();
  const queueMessage = getQueueMessage();

  return (
    <article
      className={`border rounded-lg p-4 transition-all hover:shadow-md ${status.cardClass}`}
      aria-label={`${hold.book.title} by ${hold.book.author}, ${format.label}, ${status.badge}`}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Book Cover Placeholder */}
        <div className="flex-shrink-0">
          <div className="w-16 h-24 sm:w-20 sm:h-28 bg-gradient-to-br from-purple-400 to-purple-600 rounded flex items-center justify-center text-white font-bold text-xs text-center p-2">
            {hold.book.title.substring(0, 20)}
          </div>
        </div>

        {/* Book Info */}
        <div className="flex-1">
          {/* Title and Author */}
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {hold.book.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              by {hold.book.author}
            </p>
          </div>

          {/* Format Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
              <span>{format.icon}</span>
              <span>{format.label}</span>
            </span>
          </div>

          {/* Status Badge */}
          <div className="mb-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.badgeClass}`}>
              {status.badge}
            </span>
          </div>

          {/* Status-specific details */}
          {hold.status === 'ready' && (
            <div className="space-y-1">
              {hold.format === 'physical' ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Available at Main Branch
                </p>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Available to check out now
                </p>
              )}
              {expiryWarning && (
                <p className={`text-sm font-medium ${expiryWarning.color}`}>
                  {expiryWarning.urgent && '⚠️ '}{expiryWarning.message}
                </p>
              )}
            </div>
          )}

          {hold.status === 'waiting' && (
            <div className="space-y-1">
              {queueMessage && (
                <p className={`text-sm ${queueMessage.color}`}>
                  {queueMessage.message}
                </p>
              )}
              {hold.estimated_wait && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Estimated wait: {hold.estimated_wait}
                </p>
              )}
            </div>
          )}

          {hold.status === 'coming_soon' && hold.release_date && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Not yet released. Available {formatDate(hold.release_date)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                We'll notify you when it's available
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:items-end gap-2">
          {hold.status === 'ready' && (
            <>
              {hold.format !== 'physical' && (
                <button
                  onClick={() => onCheckOut(hold.id, hold.book.title)}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
                >
                  Check Out Now
                </button>
              )}
              <button
                onClick={() => onCancel(hold.id, hold.book.title)}
                disabled={isProcessing}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 rounded text-sm"
              >
                Cancel Hold
              </button>
            </>
          )}

          {hold.status === 'waiting' && (
            <div className="flex gap-2">
              <button
                onClick={() => onCancel(hold.id, hold.book.title)}
                disabled={isProcessing}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel Hold
              </button>
              <button
                onClick={() => onFreeze(hold.id, hold.book.title)}
                disabled={isProcessing}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Freeze Hold
              </button>
            </div>
          )}

          {hold.status === 'coming_soon' && (
            <button
              onClick={() => onCancel(hold.id, hold.book.title)}
              disabled={isProcessing}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel Hold
            </button>
          )}
        </div>
      </div>
    </article>
  );
};