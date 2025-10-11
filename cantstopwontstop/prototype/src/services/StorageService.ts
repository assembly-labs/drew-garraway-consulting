import { WorkoutPlan } from '../data/workoutPlans';
import { Exercise } from '../data/exerciseLibrary';

export interface WorkoutSession {
  id: string;
  planId: string;
  planName: string;
  date: string;
  startTime: string;
  endTime: string;
  totalTime: number; // seconds
  mode: 'challenge' | 'beast';
  exercises: {
    exerciseId: string;
    exerciseName: string;
    completed: boolean;
    skipped: boolean;
    sets: {
      setNumber: number;
      reps: number;
      weight?: number;
      completed: boolean;
    }[];
  }[];
  completionPercentage: number;
  totalVolume: number;
  pausesUsed: number;
}

export interface UserPreferences {
  mode: 'challenge' | 'beast';
  weightUnit: 'lbs' | 'kg';
  pushNotificationFrequency: 'off' | 'low' | 'medium' | 'high';
  enabledMessageTones: {
    supportive: boolean;
    aggressive: boolean;
    motivational: boolean;
    humorous: boolean;
  };
}

const STORAGE_KEYS = {
  WORKOUT_PLANS: 'workout_plans',
  WORKOUT_HISTORY: 'workout_history',
  USER_PREFERENCES: 'user_preferences',
  LAST_USED_PLAN: 'last_used_plan',
};

class StorageService {
  // Workout Plans
  async saveWorkoutPlans(plans: WorkoutPlan[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.WORKOUT_PLANS, JSON.stringify(plans));
  }

  async getWorkoutPlans(): Promise<WorkoutPlan[]> {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUT_PLANS);
    return data ? JSON.parse(data) : [];
  }

  async saveWorkoutPlan(plan: WorkoutPlan): Promise<void> {
    const plans = await this.getWorkoutPlans();
    const existingIndex = plans.findIndex((p) => p.id === plan.id);

    if (existingIndex >= 0) {
      plans[existingIndex] = plan;
    } else {
      plans.push(plan);
    }

    await this.saveWorkoutPlans(plans);
  }

  async deleteWorkoutPlan(planId: string): Promise<void> {
    const plans = await this.getWorkoutPlans();
    const filtered = plans.filter((p) => p.id !== planId);
    await this.saveWorkoutPlans(filtered);
  }

  // Workout History
  async saveWorkoutSession(session: WorkoutSession): Promise<void> {
    const history = await this.getWorkoutHistory();
    history.unshift(session); // Add to beginning
    localStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(history));
  }

  async getWorkoutHistory(): Promise<WorkoutSession[]> {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
    return data ? JSON.parse(data) : [];
  }

  async getWorkoutById(id: string): Promise<WorkoutSession | null> {
    const history = await this.getWorkoutHistory();
    return history.find((w) => w.id === id) || null;
  }

  // User Preferences
  async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  }

  async getUserPreferences(): Promise<UserPreferences | null> {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return data ? JSON.parse(data) : null;
  }

  // Last Used Plan
  async saveLastUsedPlan(planId: string): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.LAST_USED_PLAN, planId);
  }

  async getLastUsedPlan(): Promise<string | null> {
    return localStorage.getItem(STORAGE_KEYS.LAST_USED_PLAN);
  }

  // Clear All Data
  async clearAllData(): Promise<void> {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}

export const storageService = new StorageService();
