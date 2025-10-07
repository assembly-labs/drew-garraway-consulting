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