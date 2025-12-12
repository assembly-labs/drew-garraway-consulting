import React from 'react';
import { FineItem } from '../../types';

interface FineCardProps {
  fine: FineItem;
  isSelected: boolean;
  onToggleSelect: (fineId: string) => void;
}

export const FineCard: React.FC<FineCardProps> = ({
  fine,
  isSelected,
  onToggleSelect
}) => {
  // Format currency
  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
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

  // Get fine type icon and color
  const getFineTypeInfo = (type: FineItem['type']) => {
    switch (type) {
      case 'overdue':
        return { icon: '⏰', label: 'Overdue Fine', color: 'text-attention dark:text-attention' };
      case 'damaged':
        return { icon: '💔', label: 'Damage Fee', color: 'text-error dark:text-error' };
      case 'lost':
        return { icon: '🔍', label: 'Lost Item', color: 'text-coral-600 dark:text-coral-400' };
      case 'processing':
        return { icon: '📋', label: 'Processing Fee', color: 'text-navy-600 dark:text-navy-400' };
      default:
        return { icon: '💵', label: 'Fine', color: 'text-neutral-600 dark:text-neutral-400' };
    }
  };

  const typeInfo = getFineTypeInfo(fine.type);

  return (
    <article
      className={`bg-surface dark:bg-navy-800 border rounded-lg p-4 transition-all ${
        isSelected
          ? 'border-navy-500 ring-2 ring-navy-200 dark:ring-navy-900'
          : 'border-neutral-200 dark:border-navy-700'
      }`}
      aria-label={`${typeInfo.label} of ${formatCurrency(fine.amount)} for ${fine.item?.title || fine.description}`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <div className="pt-1">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(fine.id)}
              className="w-5 h-5 text-navy-600 rounded focus:ring-2 focus:ring-navy-500"
              aria-label={`Select ${typeInfo.label} of ${formatCurrency(fine.amount)}`}
            />
          </label>
        </div>

        {/* Fine Icon */}
        <div className={`text-2xl ${typeInfo.color}`}>
          {typeInfo.icon}
        </div>

        {/* Fine Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className={`font-semibold ${typeInfo.color}`}>
                {typeInfo.label}
              </h3>
              <p className="text-sm text-navy-900 dark:text-surface mt-1">
                {fine.description}
              </p>
              {fine.item && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  <span className="font-medium">{fine.item.title}</span> by {fine.item.author}
                </p>
              )}
              {fine.days_overdue && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {fine.days_overdue} days overdue
                </p>
              )}
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                Incurred on {formatDate(fine.date_incurred)}
              </p>
            </div>

            {/* Amount */}
            <div className="text-right">
              <div className="text-xl font-bold text-navy-900 dark:text-surface">
                {formatCurrency(fine.amount)}
              </div>
              {fine.status === 'outstanding' && (
                <span className="text-xs text-error dark:text-error">
                  Outstanding
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};