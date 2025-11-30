import { create } from 'zustand';
import { format, differenceInDays } from 'date-fns';
import { createRepository } from '@/data/repositories';
import { CLUSTERS } from '@/config/clusters';

const MAX_EDITABLE_DAYS = 7;

interface HabitState {
  currentDate: string;
  completedHabits: Set<string>;
  loading: boolean;

  // Actions
  loadDate: (date: string) => Promise<void>;
  toggleHabit: (habitId: string) => Promise<void>;
  calculateStreak: () => Promise<number>;
  isDateEditable: (date: string) => boolean;
}

const repository = createRepository();

export const useHabitStore = create<HabitState>((set, get) => ({
  currentDate: format(new Date(), 'yyyy-MM-dd'),
  completedHabits: new Set(),
  loading: false,

  loadDate: async (date: string) => {
    set({ loading: true });
    const log = await repository.getLog(date);
    const completed = new Set(
      Object.entries(log?.habits || {})
        .filter(([, isComplete]) => isComplete)
        .map(([habitId]) => habitId)
    );
    set({ currentDate: date, completedHabits: completed, loading: false });
  },

  toggleHabit: async (habitId: string) => {
    const { currentDate, completedHabits, isDateEditable } = get();

    // Check if date is editable before allowing toggle
    if (!isDateEditable(currentDate)) {
      // Cannot edit habits beyond the 7-day window
      return;
    }

    const newCompleted = new Set(completedHabits);

    if (newCompleted.has(habitId)) {
      newCompleted.delete(habitId);
      await repository.markIncomplete(habitId, currentDate);

      // Trigger haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    } else {
      newCompleted.add(habitId);
      await repository.markComplete(habitId, currentDate);

      // Trigger haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }

    set({ completedHabits: newCompleted });
  },

  calculateStreak: async () => {
    const today = new Date();
    let streak = 0;

    // Go backwards from today
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = format(checkDate, 'yyyy-MM-dd');

      const log = await repository.getLog(dateStr);
      if (!log) break;

      const completedIds = Object.entries(log.habits)
        .filter(([, isComplete]) => isComplete)
        .map(([id]) => id);

      // Check if all clusters were complete on this day
      const allClustersComplete = CLUSTERS.every(cluster =>
        cluster.isComplete(completedIds)
      );

      if (allClustersComplete) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  },

  isDateEditable: (date: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0); // Reset to start of day

    const daysDiff = differenceInDays(today, checkDate);

    // Can edit if within 0-6 days ago (today + 6 previous days = 7 total)
    return daysDiff >= 0 && daysDiff < MAX_EDITABLE_DAYS;
  },
}));