// Minimal type definitions for optimization system
// Extracted from main types for standalone use

export type MaterialType = 'book' | 'dvd' | 'game' | 'equipment' | 'comic' | 'audiovisual' | 'thing';

export type ItemFormatType =
  | 'physical' | 'ebook' | 'audiobook'
  | 'dvd' | 'bluray' | 'cd' | 'vinyl'
  | 'ps5' | 'xbox' | 'switch' | 'pc' | 'retro'
  | 'equipment' | 'tool' | 'device'
  | 'comic' | 'manga' | 'graphic-novel';

export interface ItemFormat {
  type: ItemFormatType;
  status: 'available' | 'waitlist' | 'checked_out' | 'maintenance' | 'reserved';
  copies_available?: number;
  copies_total?: number;
  wait_time?: string;
  holds?: number;
  due_date?: string;
  booking_required?: boolean;
  slots_available?: string[];
  checkout_duration_days?: number;
  deposit_required?: number;
  age_restriction?: string;
}

export interface LibraryItem {
  id: string;
  itemType: MaterialType;
  title: string;
  cover: string;
  formats: ItemFormat[];
  description: string;
  rating?: number;
  popular?: boolean;
  details?: any;
}

export interface Book extends LibraryItem {
  itemType: 'book';
  isbn: string;
  author: string;
  subjects: string[];
  publication_year: number;
  pages: number;
}

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

export interface ThingItem extends LibraryItem {
  itemType: 'thing';
  category: string;
  brand?: string;
  includes?: string[];
  condition?: string;
  suitable_ages?: string;
}

export type CatalogItem = Book | MediaItem | GameItem | EquipmentItem | ComicItem | ThingItem;

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  books?: CatalogItem[];
}