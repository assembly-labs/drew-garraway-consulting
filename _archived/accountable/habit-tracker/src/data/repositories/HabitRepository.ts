import { HabitLog, SessionData } from '@/types';

export interface IHabitRepository {
  // Basic completion
  markComplete(habitId: string, date: string): Promise<void>;
  markIncomplete(habitId: string, date: string): Promise<void>;
  isComplete(habitId: string, date: string): Promise<boolean>;

  // Get logs for date
  getLog(date: string): Promise<HabitLog | null>;

  // Get logs for date range
  getDateRange(startDate: string, endDate: string): Promise<HabitLog[]>;

  // Session data (for future module expansion)
  saveSession(habitId: string, date: string, data: SessionData): Promise<void>;
  getSession(habitId: string, date: string): Promise<SessionData | null>;
}