// Material type definitions
export type MaterialType = 'book' | 'dvd' | 'game' | 'equipment' | 'comic' | 'audiovisual' | 'thing';

// Extended format types for different materials
export type ItemFormatType =
  | 'physical' | 'ebook' | 'audiobook'  // existing book formats
  | 'dvd' | 'bluray' | 'cd' | 'vinyl'    // media formats
  | 'ps5' | 'xbox' | 'switch' | 'pc' | 'retro'     // game platforms
  | 'equipment' | 'tool' | 'device'       // equipment types
  | 'comic' | 'manga' | 'graphic-novel';  // comic formats

// Base interface for all library items
export interface LibraryItem {
  id: string;
  itemType: MaterialType;
  title: string;
  cover: string;
  formats: ItemFormat[];
  description: string;
  rating?: number;
  popular?: boolean;
}

// Updated format structure with new fields for special materials
export interface ItemFormat {
  type: ItemFormatType;
  status: 'available' | 'waitlist' | 'checked_out' | 'maintenance' | 'reserved';
  copies_available?: number;
  copies_total?: number;
  wait_time?: string;
  holds?: number;
  due_date?: string;
  // New fields for special materials
  booking_required?: boolean;
  slots_available?: string[];
  checkout_duration_days?: number;
  deposit_required?: number;
  age_restriction?: string;
}

// Book-related types (now extends LibraryItem)
export interface Book extends LibraryItem {
  itemType: 'book';
  isbn: string;
  author: string;
  subjects: string[];
  publication_year: number;
  pages: number;
}

// Keep BookFormat for backward compatibility
export interface BookFormat extends ItemFormat {
  type: 'physical' | 'ebook' | 'audiobook';
}

// Media item types (DVDs, Blu-rays, etc.)
export interface MediaItem extends LibraryItem {
  itemType: 'dvd' | 'audiovisual';
  director?: string;
  actors?: string[];
  runtime_minutes?: number;
  release_year: number;
  rating_mpaa?: string;
  episodes?: number;
  season?: number;
}

// Game item types
export interface GameItem extends LibraryItem {
  itemType: 'game';
  platform: string[];
  developer: string;
  publisher?: string;
  release_year: number;
  rating_esrb?: string;
  players?: string;
  online_multiplayer?: boolean;
  includes?: string[];
}

// Equipment item types
export interface EquipmentItem extends LibraryItem {
  itemType: 'equipment';
  category: string;
  manufacturer?: string;
  model?: string;
  includes: string[];
  requirements?: string[];
  instructions_url?: string;
  replacement_cost?: number;
}

// Comic/Graphic Novel types
export interface ComicItem extends LibraryItem {
  itemType: 'comic';
  author?: string;
  artist?: string;
  series?: string;
  issue_number?: number;
  volume?: number;
  publisher: string;
  publication_year: number;
}

// General "Thing" types (board games, tools, etc.)
export interface ThingItem extends LibraryItem {
  itemType: 'thing';
  category: string;
  brand?: string;
  includes?: string[];
  condition?: string;
  suitable_ages?: string;
}

// Union type for all library materials
export type CatalogItem = Book | MediaItem | GameItem | EquipmentItem | ComicItem | ThingItem;

// Conversation types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  books?: CatalogItem[]; // Items mentioned in the response
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