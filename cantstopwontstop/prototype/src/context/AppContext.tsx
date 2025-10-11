import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WorkoutPlan, workoutPlans as defaultPlans } from '../data/workoutPlans';
import { storageService, WorkoutSession, UserPreferences } from '../services/StorageService';

interface AppContextType {
  // Plans
  plans: WorkoutPlan[];
  addPlan: (plan: WorkoutPlan) => Promise<void>;
  updatePlan: (plan: WorkoutPlan) => Promise<void>;
  deletePlan: (planId: string) => Promise<void>;

  // History
  workoutHistory: WorkoutSession[];
  addWorkoutSession: (session: WorkoutSession) => Promise<void>;
  getRecentWorkout: () => WorkoutSession | null;

  // Preferences
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;

  // Last Used Plan
  lastUsedPlanId: string | null;
  setLastUsedPlanId: (planId: string) => Promise<void>;

  // Loading State
  isLoading: boolean;
}

const defaultPreferences: UserPreferences = {
  mode: 'challenge',
  weightUnit: 'lbs',
  pushNotificationFrequency: 'medium',
  enabledMessageTones: {
    supportive: true,
    aggressive: true,
    motivational: true,
    humorous: true,
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [lastUsedPlanId, setLastUsedPlanIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data from storage
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load plans
        let storedPlans = await storageService.getWorkoutPlans();
        if (storedPlans.length === 0) {
          // Initialize with default plans
          await storageService.saveWorkoutPlans(defaultPlans);
          storedPlans = defaultPlans;
        }
        setPlans(storedPlans);

        // Load history
        const history = await storageService.getWorkoutHistory();
        setWorkoutHistory(history);

        // Load preferences
        const prefs = await storageService.getUserPreferences();
        if (prefs) {
          setPreferences(prefs);
        } else {
          await storageService.saveUserPreferences(defaultPreferences);
        }

        // Load last used plan
        const lastPlanId = await storageService.getLastUsedPlan();
        setLastUsedPlanIdState(lastPlanId);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  const addPlan = async (plan: WorkoutPlan) => {
    await storageService.saveWorkoutPlan(plan);
    const updatedPlans = await storageService.getWorkoutPlans();
    setPlans(updatedPlans);
  };

  const updatePlan = async (plan: WorkoutPlan) => {
    await storageService.saveWorkoutPlan(plan);
    const updatedPlans = await storageService.getWorkoutPlans();
    setPlans(updatedPlans);
  };

  const deletePlan = async (planId: string) => {
    await storageService.deleteWorkoutPlan(planId);
    const updatedPlans = await storageService.getWorkoutPlans();
    setPlans(updatedPlans);
  };

  const addWorkoutSession = async (session: WorkoutSession) => {
    await storageService.saveWorkoutSession(session);
    const updatedHistory = await storageService.getWorkoutHistory();
    setWorkoutHistory(updatedHistory);
  };

  const getRecentWorkout = () => {
    return workoutHistory.length > 0 ? workoutHistory[0] : null;
  };

  const updatePreferences = async (prefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...prefs };
    setPreferences(updated);
    await storageService.saveUserPreferences(updated);
  };

  const setLastUsedPlanId = async (planId: string) => {
    setLastUsedPlanIdState(planId);
    await storageService.saveLastUsedPlan(planId);
  };

  return (
    <AppContext.Provider
      value={{
        plans,
        addPlan,
        updatePlan,
        deletePlan,
        workoutHistory,
        addWorkoutSession,
        getRecentWorkout,
        preferences,
        updatePreferences,
        lastUsedPlanId,
        setLastUsedPlanId,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
