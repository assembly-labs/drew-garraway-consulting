import { CheckoutItem } from '../types';

// Calculate days remaining from today
const calculateDaysRemaining = (dueDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Get a date string X days from today
const getDateFromToday = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

export const mockCheckouts: CheckoutItem[] = [
  {
    id: "checkout_001",
    book: {
      id: "book_042",
      title: "The Midnight Library",
      author: "Matt Haig",
      cover: ""
    },
    format: "physical",
    checked_out_date: getDateFromToday(-11), // 11 days ago
    due_date: getDateFromToday(10), // Due in 10 days
    days_remaining: 10,
    renewals_used: 1,
    renewals_max: 3,
    can_renew: true,
    overdue: false
  },
  {
    id: "checkout_002",
    book: {
      id: "book_087",
      title: "Educated",
      author: "Tara Westover",
      cover: ""
    },
    format: "audiobook",
    checked_out_date: getDateFromToday(-15), // 15 days ago
    due_date: getDateFromToday(6), // Due in 6 days
    days_remaining: 6,
    renewals_used: 0,
    renewals_max: 3,
    can_renew: true,
    overdue: false
  },
  {
    id: "checkout_003",
    book: {
      id: "book_123",
      title: "Atomic Habits",
      author: "James Clear",
      cover: ""
    },
    format: "ebook",
    checked_out_date: getDateFromToday(-18), // 18 days ago
    due_date: getDateFromToday(3), // Due in 3 days
    days_remaining: 3,
    renewals_used: 3,
    renewals_max: 3,
    can_renew: false, // Max renewals reached
    overdue: false
  },
  {
    id: "checkout_004",
    book: {
      id: "book_156",
      title: "Project Hail Mary",
      author: "Andy Weir",
      cover: ""
    },
    format: "physical",
    checked_out_date: getDateFromToday(-23), // 23 days ago
    due_date: getDateFromToday(-2), // Overdue by 2 days
    days_remaining: -2,
    renewals_used: 2,
    renewals_max: 3,
    can_renew: true,
    overdue: true
  }
];

// Helper function to update days_remaining dynamically
export const refreshDaysRemaining = (checkouts: CheckoutItem[]): CheckoutItem[] => {
  return checkouts.map(checkout => ({
    ...checkout,
    days_remaining: calculateDaysRemaining(checkout.due_date),
    overdue: calculateDaysRemaining(checkout.due_date) < 0
  }));
};