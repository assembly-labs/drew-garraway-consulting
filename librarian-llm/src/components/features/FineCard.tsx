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
        return { icon: '⏰', label: 'Overdue Fine', color: 'text-yellow-600 dark:text-yellow-400' };
      case 'damaged':
        return { icon: '💔', label: 'Damage Fee', color: 'text-red-600 dark:text-red-400' };
      case 'lost':
        return { icon: '🔍', label: 'Lost Item', color: 'text-purple-600 dark:text-purple-400' };
      case 'processing':
        return { icon: '📋', label: 'Processing Fee', color: 'text-blue-600 dark:text-blue-400' };
      default:
        return { icon: '💵', label: 'Fine', color: 'text-gray-600 dark:text-gray-400' };
    }
  };

  const typeInfo = getFineTypeInfo(fine.type);

  return (
    <article
      className={`bg-white dark:bg-gray-800 border rounded-lg p-4 transition-all ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900'
          : 'border-gray-200 dark:border-gray-700'
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
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
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
              <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                {fine.description}
              </p>
              {fine.item && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span className="font-medium">{fine.item.title}</span> by {fine.item.author}
                </p>
              )}
              {fine.days_overdue && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {fine.days_overdue} days overdue
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Incurred on {formatDate(fine.date_incurred)}
              </p>
            </div>

            {/* Amount */}
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(fine.amount)}
              </div>
              {fine.status === 'outstanding' && (
                <span className="text-xs text-red-600 dark:text-red-400">
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