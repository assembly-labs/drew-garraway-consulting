import { useState, useCallback, useMemo } from 'react';
import { FineItem, PaymentHistoryItem } from '../types';
import { mockFines, mockPaymentHistory, getTotalFines } from '../data/mockFines';
import { useToast } from './useToast';

export const useFines = () => {
  const [fines, setFines] = useState<FineItem[]>(mockFines);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>(mockPaymentHistory);
  const [selectedFineIds, setSelectedFineIds] = useState<string[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const toast = useToast();

  // Calculate totals
  const totalOutstanding = useMemo(() => getTotalFines(fines), [fines]);

  const selectedTotal = useMemo(() => {
    return fines
      .filter(fine => selectedFineIds.includes(fine.id))
      .reduce((total, fine) => total + fine.amount, 0);
  }, [fines, selectedFineIds]);

  // Toggle fine selection
  const toggleFineSelection = useCallback((fineId: string) => {
    setSelectedFineIds(prev => {
      if (prev.includes(fineId)) {
        return prev.filter(id => id !== fineId);
      } else {
        return [...prev, fineId];
      }
    });
  }, []);

  // Select all fines
  const selectAllFines = useCallback(() => {
    const outstandingIds = fines
      .filter(fine => fine.status === 'outstanding')
      .map(fine => fine.id);
    setSelectedFineIds(outstandingIds);
  }, [fines]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedFineIds([]);
  }, []);

  // Process payment
  const processPayment = useCallback(async (paymentMethod: 'credit_card' | 'cash' | 'check') => {
    if (selectedFineIds.length === 0) {
      toast.error('Please select at least one fine to pay');
      return;
    }

    setIsProcessingPayment(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate 90% success rate for credit card, 100% for cash/check (handled at library)
    const isSuccess = paymentMethod !== 'credit_card' || Math.random() > 0.1;

    if (isSuccess) {
      // Create payment history entry
      const newPayment: PaymentHistoryItem = {
        id: `payment_${Date.now()}`,
        amount: selectedTotal,
        date: new Date().toISOString().split('T')[0],
        method: paymentMethod,
        fines_paid: [...selectedFineIds]
      };

      // Update fines to paid status
      setFines(prev =>
        prev.map(fine =>
          selectedFineIds.includes(fine.id)
            ? { ...fine, status: 'paid' as const }
            : fine
        )
      );

      // Add to payment history
      setPaymentHistory(prev => [newPayment, ...prev]);

      // Clear selection
      setSelectedFineIds([]);

      // Show success message
      if (paymentMethod === 'credit_card') {
        toast.success('Payment successful! Your fines have been cleared.');
      } else {
        toast.info(`Payment method confirmed. Please visit the library with your ${paymentMethod === 'cash' ? 'cash' : 'check'}.`);
      }
    } else {
      toast.error('Payment failed. Please try again or contact the library.');
    }

    setIsProcessingPayment(false);
  }, [selectedFineIds, selectedTotal, toast]);

  // Format currency
  const formatCurrency = useCallback((cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  }, []);

  return {
    fines: fines.filter(fine => fine.status === 'outstanding'),
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
  };
};