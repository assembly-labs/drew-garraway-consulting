import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { calculatePRRecords } from '../utils/prDetection';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [prRecords, setPRRecords] = useState({});
  const [preferences, setPreferences] = useState({
    soundEnabled: true,
    hapticEnabled: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load user data on mount
  useEffect(() => {
    async function loadUserData() {
      try {
        const [history, prefs] = await Promise.all([
          api.getWorkoutHistory(),
          api.getPreferences(),
        ]);

        setWorkoutHistory(history);
        setPreferences(prefs);

        // Calculate PR records from history
        const prs = calculatePRRecords(history);
        setPRRecords(prs);
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, []);

  /**
   * Add workout to history
   */
  const addWorkoutToHistory = async (workout) => {
    await api.saveWorkout(workout);
    const updatedHistory = await api.getWorkoutHistory();
    setWorkoutHistory(updatedHistory);

    // Recalculate PRs
    const prs = calculatePRRecords(updatedHistory);
    setPRRecords(prs);
  };

  /**
   * Delete workout from history
   */
  const deleteWorkoutFromHistory = async (workoutId) => {
    await api.deleteWorkout(workoutId);
    const updatedHistory = await api.getWorkoutHistory();
    setWorkoutHistory(updatedHistory);

    // Recalculate PRs
    const prs = calculatePRRecords(updatedHistory);
    setPRRecords(prs);
  };

  /**
   * Update preferences
   */
  const updatePreferences = async (newPrefs) => {
    const updated = { ...preferences, ...newPrefs };
    await api.savePreferences(updated);
    setPreferences(updated);
  };

  /**
   * Get recent workout
   */
  const getRecentWorkout = () => {
    return workoutHistory[0] || null;
  };

  /**
   * Get workouts for specific exercise
   */
  const getExerciseHistory = (exerciseId) => {
    return workoutHistory.filter(workout =>
      workout.exercises?.some(ex => ex.exerciseId === exerciseId)
    );
  };

  /**
   * Get workout stats
   */
  const getStats = () => {
    const totalWorkouts = workoutHistory.length;
    const completedWorkouts = workoutHistory.filter(w => w.completionStatus === 'Completed').length;
    const totalPRs = Object.keys(prRecords).length;

    return {
      totalWorkouts,
      completedWorkouts,
      failedWorkouts: workoutHistory.filter(w => w.completionStatus === 'Failed').length,
      totalPRs,
      completionRate: totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0,
    };
  };

  /**
   * Clear all data
   */
  const clearAllData = async () => {
    await api.clearAllData();
    setWorkoutHistory([]);
    setPRRecords({});
    setPreferences({ soundEnabled: true, hapticEnabled: true });
  };

  const value = {
    workoutHistory,
    prRecords,
    preferences,
    isLoading,
    addWorkoutToHistory,
    deleteWorkoutFromHistory,
    updatePreferences,
    getRecentWorkout,
    getExerciseHistory,
    getStats,
    clearAllData,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
