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
        colorClass: 'bg-error/10 border-error dark:bg-error/20 dark:border-error',
        textClass: 'text-error dark:text-error',
        badge: 'Overdue',
        icon: '⚠️',
        label: `Overdue by ${Math.abs(days_remaining)} day${Math.abs(days_remaining) !== 1 ? 's' : ''}`,
        urgency: 'high' as const
      };
    } else if (days_remaining === 0) {
      return {
        colorClass: 'bg-error/10 border-error dark:bg-error/20 dark:border-error',
        textClass: 'text-error dark:text-error',
        badge: 'Due Today',
        icon: '⚠️',
        label: 'Due today',
        urgency: 'high' as const
      };
    } else if (days_remaining <= 3) {
      return {
        colorClass: 'bg-attention/10 border-attention dark:bg-attention/20 dark:border-attention',
        textClass: 'text-attention-dark dark:text-coral-300',
        badge: 'Due Soon',
        icon: '⏰',
        label: `Due in ${days_remaining} day${days_remaining !== 1 ? 's' : ''}`,
        urgency: 'medium' as const
      };
    } else {
      return {
        colorClass: 'bg-neutral-50 border-neutral-200 dark:bg-navy-800 dark:border-navy-700',
        textClass: 'text-neutral-700 dark:text-neutral-300',
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
          <div className="w-16 h-24 sm:w-20 sm:h-28 bg-gradient-to-br from-navy-400 to-navy-600 rounded flex items-center justify-center text-white font-bold text-xs text-center p-2">
            {checkout.book.title.substring(0, 20)}
          </div>
        </div>

        {/* Book Info */}
        <div className="flex-1">
          {/* Title and Author */}
          <div className="mb-2">
            <h3 className="font-semibold text-navy-900 dark:text-surface">
              {checkout.book.title}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              by {checkout.book.author}
            </p>
          </div>

          {/* Format Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-surface dark:bg-navy-700 border border-neutral-300 dark:border-navy-600">
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
                  ${status.urgency === 'high' ? 'bg-error-light text-error-dark dark:bg-error/30 dark:text-error' :
                    status.urgency === 'medium' ? 'bg-attention-light text-attention-dark dark:bg-attention/30 dark:text-coral-300' :
                    'bg-neutral-100 text-neutral-800 dark:bg-navy-700 dark:text-neutral-100'}
                `}>
                  {status.badge}
                </span>
              )}
            </div>
            <span className="sr-only">{status.label}</span>
          </div>

          {/* Renewals Info */}
          <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
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
                  ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed dark:bg-navy-600 dark:text-neutral-400'
                  : 'bg-navy-600 text-white hover:bg-navy-700 dark:bg-navy-500 dark:hover:bg-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2'}
                min-w-[100px]
              `}
            >
              {isRenewing ? 'Renewing...' : 'Renew'}
            </button>
          ) : (
            <div className="text-sm text-neutral-500 dark:text-neutral-400 italic">
              Maximum renewals reached ({checkout.renewals_max}/{checkout.renewals_max})
            </div>
          )}
        </div>
      </div>
    </article>
  );
};