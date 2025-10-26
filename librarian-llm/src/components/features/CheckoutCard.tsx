import React from 'react';
import { CheckoutItem } from '../../types';

interface CheckoutCardProps {
  checkout: CheckoutItem;
  onRenew: (checkoutId: string) => void;
  isRenewing: boolean;
}

export const CheckoutCard: React.FC<CheckoutCardProps> = ({
  checkout,
  onRenew,
  isRenewing
}) => {
  // Get due date status for styling and messaging
  const getDueDateStatus = () => {
    const { days_remaining } = checkout;

    if (days_remaining < 0) {
      return {
        colorClass: 'bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-700',
        textClass: 'text-red-800 dark:text-red-200',
        badge: 'Overdue',
        icon: '⚠️',
        label: `Overdue by ${Math.abs(days_remaining)} day${Math.abs(days_remaining) !== 1 ? 's' : ''}`,
        urgency: 'high' as const
      };
    } else if (days_remaining === 0) {
      return {
        colorClass: 'bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-700',
        textClass: 'text-red-800 dark:text-red-200',
        badge: 'Due Today',
        icon: '⚠️',
        label: 'Due today',
        urgency: 'high' as const
      };
    } else if (days_remaining <= 3) {
      return {
        colorClass: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900 dark:border-yellow-700',
        textClass: 'text-yellow-800 dark:text-yellow-200',
        badge: 'Due Soon',
        icon: '⏰',
        label: `Due in ${days_remaining} day${days_remaining !== 1 ? 's' : ''}`,
        urgency: 'medium' as const
      };
    } else {
      return {
        colorClass: 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700',
        textClass: 'text-gray-700 dark:text-gray-300',
        badge: null,
        icon: '✓',
        label: `Due in ${days_remaining} days`,
        urgency: 'low' as const
      };
    }
  };

  const status = getDueDateStatus();

  // Get format icon and label
  const getFormatDisplay = () => {
    switch (checkout.format) {
      case 'physical':
        return { icon: '📕', label: 'Physical' };
      case 'ebook':
        return { icon: '📱', label: 'eBook' };
      case 'audiobook':
        return { icon: '🎧', label: 'Audiobook' };
    }
  };

  const format = getFormatDisplay();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <article
      className={`
        border rounded-lg p-4 transition-all
        ${status.colorClass}
        hover:shadow-md
      `}
      aria-label={`${checkout.book.title} by ${checkout.book.author}, ${format.label}, ${status.label}`}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Book Cover Placeholder */}
        <div className="flex-shrink-0">
          <div className="w-16 h-24 sm:w-20 sm:h-28 bg-gradient-to-br from-blue-400 to-blue-600 rounded flex items-center justify-center text-white font-bold text-xs text-center p-2">
            {checkout.book.title.substring(0, 20)}
          </div>
        </div>

        {/* Book Info */}
        <div className="flex-1">
          {/* Title and Author */}
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {checkout.book.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              by {checkout.book.author}
            </p>
          </div>

          {/* Format Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
              <span>{format.icon}</span>
              <span>{format.label}</span>
            </span>
          </div>

          {/* Due Date Info */}
          <div className={`flex flex-col sm:flex-row sm:items-center gap-2 ${status.textClass}`}>
            <div className="flex items-center gap-2">
              <span className="text-lg" aria-hidden="true">{status.icon}</span>
              <span className="text-sm font-medium">
                Due: {formatDate(checkout.due_date)}
              </span>
              {status.badge && (
                <span className={`
                  inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                  ${status.urgency === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                    status.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'}
                `}>
                  {status.badge}
                </span>
              )}
            </div>
            <span className="sr-only">{status.label}</span>
          </div>

          {/* Renewals Info */}
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Renewals: {checkout.renewals_used}/{checkout.renewals_max}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-end sm:items-center">
          {checkout.can_renew ? (
            <button
              onClick={() => onRenew(checkout.id)}
              disabled={isRenewing}
              aria-label={`Renew ${checkout.book.title}`}
              aria-busy={isRenewing}
              className={`
                px-4 py-2 rounded-md font-medium transition-all
                ${isRenewing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
                  : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'}
                min-w-[100px]
              `}
            >
              {isRenewing ? 'Renewing...' : 'Renew'}
            </button>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400 italic">
              Maximum renewals reached ({checkout.renewals_max}/{checkout.renewals_max})
            </div>
          )}
        </div>
      </div>
    </article>
  );
};