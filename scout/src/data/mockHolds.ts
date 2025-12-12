import { HoldItem } from '../types';

// Get a date string X days from today
const getDateFromToday = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

export const mockHolds: HoldItem[] = [
  {
    id: "hold_001",
    book: {
      id: "book_201",
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      cover: ""
    },
    format: "ebook",
    status: "ready",
    placed_date: getDateFromToday(-18),
    ready_date: getDateFromToday(-3),
    expiry_date: getDateFromToday(3),
    days_until_expiry: 3,
    position: undefined,
    queue_length: undefined,
    estimated_wait: undefined
  },
  {
    id: "hold_002",
    book: {
      id: "book_202",
      title: "Tomorrow, and Tomorrow, and Tomorrow",
      author: "Gabrielle Zevin",
      cover: ""
    },
    format: "physical",
    status: "waiting",
    placed_date: getDateFromToday(-15),
    ready_date: undefined,
    expiry_date: undefined,
    days_until_expiry: undefined,
    position: 3,
    queue_length: 12,
    estimated_wait: "~2 weeks"
  },
  {
    id: "hold_003",
    book: {
      id: "book_203",
      title: "Holly",
      author: "Stephen King",
      cover: ""
    },
    format: "audiobook",
    status: "waiting",
    placed_date: getDateFromToday(-10),
    ready_date: undefined,
    expiry_date: undefined,
    days_until_expiry: undefined,
    position: 1,
    queue_length: 8,
    estimated_wait: "~1 week"
  },
  {
    id: "hold_004",
    book: {
      id: "book_204",
      title: "The Women",
      author: "Kristin Hannah",
      cover: ""
    },
    format: "physical",
    status: "coming_soon",
    placed_date: getDateFromToday(-5),
    ready_date: undefined,
    expiry_date: undefined,
    days_until_expiry: undefined,
    position: undefined,
    queue_length: undefined,
    estimated_wait: undefined,
    release_date: "2026-03-15"
  }
];