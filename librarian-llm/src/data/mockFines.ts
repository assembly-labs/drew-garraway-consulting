// Mock fines data
import { FineItem, PaymentHistoryItem } from '../types';
import { getDateFromToday } from '../utils/dateHelpers';

export const mockFines: FineItem[] = [
  {
    id: "fine_001",
    type: "overdue",
    description: "Late return fee",
    amount: 350, // $3.50
    date_incurred: getDateFromToday(-15),
    item: {
      title: "The Silent Patient",
      author: "Alex Michaelides"
    },
    days_overdue: 7,
    status: "outstanding"
  },
  {
    id: "fine_002",
    type: "damaged",
    description: "Water damage to book",
    amount: 1500, // $15.00
    date_incurred: getDateFromToday(-8),
    item: {
      title: "Atomic Habits",
      author: "James Clear"
    },
    status: "outstanding"
  }
];

export const mockPaymentHistory: PaymentHistoryItem[] = [
  {
    id: "payment_001",
    amount: 250,
    date: getDateFromToday(-30),
    method: "credit_card",
    fines_paid: ["fine_old_001"]
  },
  {
    id: "payment_002",
    amount: 500,
    date: getDateFromToday(-60),
    method: "cash",
    fines_paid: ["fine_old_002", "fine_old_003"]
  }
];

// Calculate total outstanding fines
export const getTotalFines = (fines: FineItem[]) => {
  return fines
    .filter(fine => fine.status === 'outstanding')
    .reduce((total, fine) => total + fine.amount, 0);
};