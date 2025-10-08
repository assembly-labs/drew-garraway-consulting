import { useState, useCallback, useEffect } from 'react';
import { HoldItem } from '../types';
import { mockHolds } from '../data/mockHolds';
import { useToast } from './useToast';

export const useHolds = () => {
  const [holds, setHolds] = useState<HoldItem[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  // Load holds on mount
  useEffect(() => {
    setTimeout(() => {
      setHolds(mockHolds);
      setIsLoading(false);
    }, 500);
  }, []);

  // Group holds by status
  const groupHoldsByStatus = useCallback(() => {
    const grouped = {
      ready: holds.filter(h => h.status === 'ready'),
      waiting: holds.filter(h => h.status === 'waiting'),
      coming_soon: holds.filter(h => h.status === 'coming_soon')
    };
    return grouped;
  }, [holds]);

  // Cancel hold
  const cancelHold = useCallback(async (holdId: string, bookTitle: string) => {
    setProcessingId(holdId);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Remove hold from list
    setHolds(prev => prev.filter(h => h.id !== holdId));
    toast.success(`Hold cancelled for '${bookTitle}'`);
    setProcessingId(null);
  }, [toast]);

  // Freeze hold
  const freezeHold = useCallback(async (holdId: string, _bookTitle: string, freezeUntil: string) => {
    setProcessingId(holdId);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Format date for display
    const date = new Date(freezeUntil);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    toast.success(`Hold frozen until ${formattedDate}`);
    setProcessingId(null);
  }, [toast]);

  // Check out digital item
  const checkOutDigital = useCallback(async (holdId: string, _bookTitle: string) => {
    setProcessingId(holdId);

    // Show loading toast
    toast.info('Opening in Libby app...', { duration: 1500 });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Remove hold from list
    setHolds(prev => prev.filter(h => h.id !== holdId));
    toast.success('Checked out! Enjoy your book.');
    setProcessingId(null);
  }, [toast]);

  return {
    holds,
    groupedHolds: groupHoldsByStatus(),
    isLoading,
    processingId,
    totalCount: holds.length,
    cancelHold,
    freezeHold,
    checkOutDigital
  };
};