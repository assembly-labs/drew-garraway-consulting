// Mock reading history data
import { HistoryItem } from '../types';
import { getDateFromToday } from '../utils/dateHelpers';

export const mockHistory: HistoryItem[] = [
  // 2025 Items (5 books)
  {
    id: "history_001",
    book: {
      id: "book_042",
      title: "The Midnight Library",
      author: "Matt Haig",
      cover: "/covers/midnight-library.jpg",
      isbn: "978-0-52-555947-4"
    },
    format: "physical",
    checked_out_date: getDateFromToday(-45),
    returned_date: getDateFromToday(-24),
    user_rating: 5,
    days_borrowed: 21
  },
  {
    id: "history_002",
    book: {
      id: "book_087",
      title: "Educated",
      author: "Tara Westover",
      cover: "/covers/educated.jpg",
      isbn: "978-0-39-959050-4"
    },
    format: "audiobook",
    checked_out_date: getDateFromToday(-38),
    returned_date: getDateFromToday(-17),
    user_rating: 4,
    days_borrowed: 21
  },
  {
    id: "history_003",
    book: {
      id: "book_123",
      title: "Atomic Habits",
      author: "James Clear",
      cover: "/covers/atomic-habits.jpg",
      isbn: "978-0-73-521129-2"
    },
    format: "ebook",
    checked_out_date: getDateFromToday(-60),
    returned_date: getDateFromToday(-46),
    user_rating: 5,
    days_borrowed: 14
  },
  {
    id: "history_004",
    book: {
      id: "book_156",
      title: "Project Hail Mary",
      author: "Andy Weir",
      cover: "/covers/hail-mary.jpg",
      isbn: "978-0-59-313523-1"
    },
    format: "physical",
    checked_out_date: getDateFromToday(-80),
    returned_date: getDateFromToday(-61),
    user_rating: 0, // Not rated yet
    days_borrowed: 19
  },
  {
    id: "history_005",
    book: {
      id: "book_201",
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      cover: "/covers/evelyn-hugo.jpg",
      isbn: "978-1-50-116198-3"
    },
    format: "ebook",
    checked_out_date: getDateFromToday(-100),
    returned_date: getDateFromToday(-86),
    user_rating: 4,
    days_borrowed: 14
  },

  // 2024 Items (3 books)
  {
    id: "history_006",
    book: {
      id: "book_312",
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      cover: "/covers/sapiens.jpg",
      isbn: "978-0-06-231609-7"
    },
    format: "physical",
    checked_out_date: "2024-11-01",
    returned_date: "2024-11-15",
    user_rating: 3,
    days_borrowed: 14
  },
  {
    id: "history_007",
    book: {
      id: "book_445",
      title: "The Silent Patient",
      author: "Alex Michaelides",
      cover: "/covers/silent-patient.jpg",
      isbn: "978-1-25-030169-7"
    },
    format: "audiobook",
    checked_out_date: "2024-09-10",
    returned_date: "2024-09-24",
    user_rating: 5,
    days_borrowed: 14
  },
  {
    id: "history_008",
    book: {
      id: "book_567",
      title: "Where the Crawdads Sing",
      author: "Delia Owens",
      cover: "/covers/crawdads.jpg",
      isbn: "978-0-73-521909-0"
    },
    format: "ebook",
    checked_out_date: "2024-07-15",
    returned_date: "2024-08-05",
    user_rating: 4,
    days_borrowed: 21
  }
];