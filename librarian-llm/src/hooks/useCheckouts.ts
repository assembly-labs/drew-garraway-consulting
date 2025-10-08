import { useState, useCallback, useEffect } from 'react';
import { CheckoutItem, SortOption, FormatFilter } from '../types';
import { mockCheckouts, refreshDaysRemaining } from '../data/mockCheckouts';
import { useToast } from './useToast';

export const useCheckouts = () => {
  const [checkouts, setCheckouts] = useState<CheckoutItem[]>([]);
  const [renewingIds, setRenewingIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>('due_date');
  const [filterBy, setFilterBy] = useState<FormatFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  // Load checkouts on mount
  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setCheckouts(refreshDaysRemaining(mockCheckouts));
      setIsLoading(false);
    }, 500);
  }, []);

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Renew a checkout item
  const renewCheckout = useCallback(async (checkoutId: string) => {
    setRenewingIds(prev => new Set(prev).add(checkoutId));

    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 90% success rate simulation
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      setCheckouts(prevCheckouts => {
        return prevCheckouts.map(checkout => {
          if (checkout.id === checkoutId) {
            // Calculate new due date (add 21 days)
            const newDueDate = new Date(checkout.due_date);
            newDueDate.setDate(newDueDate.getDate() + 21);
            const newDueDateString = newDueDate.toISOString().split('T')[0];

            // Calculate new days remaining
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            newDueDate.setHours(0, 0, 0, 0);
            const diffTime = newDueDate.getTime() - today.getTime();
            const newDaysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            const updatedCheckout = {
              ...checkout,
              due_date: newDueDateString,
              days_remaining: newDaysRemaining,
              renewals_used: checkout.renewals_used + 1,
              can_renew: checkout.renewals_used + 1 < checkout.renewals_max,
              overdue: false
            };

            // Show success toast
            toast.success('Book renewed!', {
              description: `New due date: ${formatDate(newDueDateString)}`
            });

            return updatedCheckout;
          }
          return checkout;
        });
      });
    } else {
      // Show error toast
      toast.error('Unable to renew this item', {
        description: 'Please try again or contact the library.'
      });
    }

    setRenewingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(checkoutId);
      return newSet;
    });
  }, [toast]);

  // Sort checkouts
  const sortCheckouts = useCallback((items: CheckoutItem[]): CheckoutItem[] => {
    const sorted = [...items];

    switch (sortBy) {
      case 'due_date':
        return sorted.sort((a, b) => a.days_remaining - b.days_remaining);
      case 'title':
        return sorted.sort((a, b) => a.book.title.localeCompare(b.book.title));
      case 'recent':
        return sorted.sort((a, b) =>
          new Date(b.checked_out_date).getTime() - new Date(a.checked_out_date).getTime()
        );
      default:
        return sorted;
    }
  }, [sortBy]);

  // Filter checkouts
  const filterCheckouts = useCallback((items: CheckoutItem[]): CheckoutItem[] => {
    if (filterBy === 'all') return items;
    return items.filter(item => item.format === filterBy);
  }, [filterBy]);

  // Get processed checkouts (filtered and sorted)
  const getProcessedCheckouts = useCallback((): CheckoutItem[] => {
    const filtered = filterCheckouts(checkouts);
    return sortCheckouts(filtered);
  }, [checkouts, filterCheckouts, sortCheckouts]);

  // Get count by format
  const getFormatCounts = useCallback(() => {
    const counts = {
      all: checkouts.length,
      physical: checkouts.filter(c => c.format === 'physical').length,
      ebook: checkouts.filter(c => c.format === 'ebook').length,
      audiobook: checkouts.filter(c => c.format === 'audiobook').length
    };
    return counts;
  }, [checkouts]);

  return {
    checkouts: getProcessedCheckouts(),
    allCheckouts: checkouts,
    renewingIds,
    sortBy,
    filterBy,
    isLoading,
    renewCheckout,
    setSortBy,
    setFilterBy,
    formatCounts: getFormatCounts(),
    totalCount: checkouts.length
  };
};