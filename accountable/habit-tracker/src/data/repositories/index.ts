import { IHabitRepository } from './HabitRepository';
import { LocalStorageRepository } from './LocalStorageRepo';

// Factory function - easy to swap implementations later
export const createRepository = (): IHabitRepository => {
  return new LocalStorageRepository();
};

export * from './HabitRepository';