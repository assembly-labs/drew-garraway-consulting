// Book-related types
export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  cover: string;
  formats: BookFormat[];
  subjects: string[];
  description: string;
  publication_year: number;
  pages: number;
  rating: number;
  popular?: boolean;
}

export interface BookFormat {
  type: 'physical' | 'ebook' | 'audiobook';
  status: 'available' | 'waitlist' | 'checked_out';
  copies_available?: number;
  copies_total?: number;
  wait_time?: string;
  holds?: number;
  due_date?: string;
}

// Conversation types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  books?: Book[]; // Books mentioned in the response
}

export interface ConversationState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

// API types
export interface ClaudeResponse {
  content: string;
  bookRecommendations?: string[]; // Book IDs from catalog
}

export interface SearchQuery {
  query: string;
  conversationHistory?: Message[];
}

// UI State types
export interface AppState {
  conversation: ConversationState;
  catalog: Book[];
  catalogLoading: boolean;
  catalogError: string | null;
}

// Sidebar menu item type
export interface SidebarMenuItem {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
  onClick: () => void;
  divider?: boolean;
}

// Library card data
export interface LibraryCard {
  patronName: string;
  cardNumber: string;
  expirationDate: string;
  libraryName: string;
  barcode: string;
}

// Toast notification types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  duration?: number;
}

// Checkout types
export interface CheckoutItem {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
    cover: string;
  };
  format: 'physical' | 'ebook' | 'audiobook';
  checked_out_date: string;
  due_date: string;
  days_remaining: number;
  renewals_used: number;
  renewals_max: number;
  can_renew: boolean;
  overdue: boolean;
}

export type SortOption = 'due_date' | 'title' | 'recent';
export type FormatFilter = 'all' | 'physical' | 'ebook' | 'audiobook';

// Hold types
export type HoldStatus = 'ready' | 'waiting' | 'coming_soon';

export interface HoldItem {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
    cover: string;
  };
  format: 'physical' | 'ebook' | 'audiobook';
  status: HoldStatus;
  placed_date: string;
  ready_date?: string;
  expiry_date?: string;
  days_until_expiry?: number;
  position?: number;
  queue_length?: number;
  estimated_wait?: string;
  release_date?: string;
}

// Event types
export type EventType =
  | 'book_club'
  | 'children'
  | 'teen_program'
  | 'technology'
  | 'workshop'
  | 'author_event'
  | 'lecture'
  | 'craft'
  | 'recreation'
  | 'all_ages';

export type AgeGroup =
  | 'toddler'
  | 'preschool'
  | 'child'
  | 'teen'
  | 'adult'
  | 'family'
  | 'all_ages';

export type RegistrationStatus =
  | 'open'
  | 'waitlist'
  | 'full'
  | 'drop_in';

export interface LibraryEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration_minutes: number;
  location: {
    branch: string;
    room?: string;
  };
  event_type: EventType;
  age_group: AgeGroup;
  capacity: number;
  registered: number;
  registration_status: RegistrationStatus;
  image?: string;
  facilitator?: string;
  userRegistered?: boolean;
  userOnWaitlist?: boolean;
}

export interface RegistrationForm {
  name: string;
  email: string;
  phone?: string;
  attendees?: number;
  accommodations?: string;
}

// History types
export interface HistoryItem {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
    cover: string;
    isbn?: string;
  };
  format: 'physical' | 'ebook' | 'audiobook';
  checked_out_date: string;
  returned_date: string;
  user_rating: number; // 0 means not rated
  days_borrowed: number;
}

// Fine types
export interface FineItem {
  id: string;
  type: 'overdue' | 'damaged' | 'lost' | 'processing';
  description: string;
  amount: number; // in cents
  date_incurred: string;
  item?: {
    title: string;
    author: string;
  };
  days_overdue?: number;
  status: 'outstanding' | 'paid';
}

export interface PaymentHistoryItem {
  id: string;
  amount: number; // in cents
  date: string;
  method: 'credit_card' | 'cash' | 'check';
  fines_paid: string[]; // array of fine IDs
}