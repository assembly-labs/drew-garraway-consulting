import { IHabitRepository } from './HabitRepository';
import { HabitLog, SessionData } from '@/types';

const STORAGE_KEY = 'habit-tracker-logs';

export class LocalStorageRepository implements IHabitRepository {
  private getAllLogs(): Record<string, HabitLog> {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }

  private saveLogs(logs: Record<string, HabitLog>): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }

  async markComplete(habitId: string, date: string): Promise<void> {
    const logs = this.getAllLogs();
    if (!logs[date]) {
      logs[date] = { date, habits: {} };
    }
    logs[date].habits[habitId] = true;
    this.saveLogs(logs);
  }

  async markIncomplete(habitId: string, date: string): Promise<void> {
    const logs = this.getAllLogs();
    if (!logs[date]) {
      logs[date] = { date, habits: {} };
    }
    logs[date].habits[habitId] = false;
    this.saveLogs(logs);
  }

  async isComplete(habitId: string, date: string): Promise<boolean> {
    const logs = this.getAllLogs();
    return logs[date]?.habits[habitId] || false;
  }

  async getLog(date: string): Promise<HabitLog | null> {
    const logs = this.getAllLogs();
    return logs[date] || null;
  }

  async getDateRange(startDate: string, endDate: string): Promise<HabitLog[]> {
    const logs = this.getAllLogs();
    return Object.values(logs).filter(log => {
      return log.date >= startDate && log.date <= endDate;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async saveSession(_habitId: string, _date: string, _data: SessionData): Promise<void> {
    // Future implementation for detailed session data
    // Session save not implemented yet
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getSession(_habitId: string, _date: string): Promise<SessionData | null> {
    // Future implementation
    return null;
  }
}