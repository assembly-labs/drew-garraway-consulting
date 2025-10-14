import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { WorkoutData } from './WorkoutContext';

// Types
export interface User {
  id: string;
  email?: string;
  username: string;
  createdAt: Date;
}

export interface UserStats {
  totalWorkouts: number;
  totalPRs: number;
  currentStreak: number;
  longestStreak: number;
  averageCompletionRate: number;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;

  // Workout history
  workoutHistory: WorkoutData[];
  addWorkout: (workout: WorkoutData) => void;
  getWorkoutHistory: () => WorkoutData[];

  // Stats
  userStats: UserStats;
  updateStats: () => void;

  // Auth state (for future implementation)
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutData[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    totalWorkouts: 0,
    totalPRs: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageCompletionRate: 0,
  });

  // Load workout history from localStorage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('workoutHistory');
    if (storedHistory) {
      try {
        const parsed = JSON.parse(storedHistory);
        // Convert date strings back to Date objects
        const workouts = parsed.map((w: any) => ({
          ...w,
          date: new Date(w.date),
        }));
        setWorkoutHistory(workouts);
      } catch (error) {
        console.error('Failed to load workout history:', error);
      }
    }
  }, []);

  // Save workout history to localStorage whenever it changes
  useEffect(() => {
    if (workoutHistory.length > 0) {
      localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
      updateStats();
    }
  }, [workoutHistory]);

  // Add a completed workout to history
  const addWorkout = (workout: WorkoutData) => {
    const workoutWithId = {
      ...workout,
      id: `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    setWorkoutHistory(prev => [workoutWithId, ...prev]); // Add to beginning (most recent first)
  };

  // Get workout history
  const getWorkoutHistory = () => {
    return workoutHistory;
  };

  // Calculate user stats from workout history
  const updateStats = () => {
    const totalWorkouts = workoutHistory.length;
    const totalPRs = workoutHistory.reduce((sum, workout) => sum + workout.prsAchieved, 0);

    // Calculate completion rate
    const completedWorkouts = workoutHistory.filter(w => w.completionStatus === 'Completed').length;
    const averageCompletionRate = totalWorkouts > 0
      ? Math.round((completedWorkouts / totalWorkouts) * 100)
      : 0;

    // Calculate current streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const sortedWorkouts = [...workoutHistory].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Simple streak calculation (workouts on consecutive days)
    let lastDate: Date | null = null;
    for (const workout of sortedWorkouts) {
      const workoutDate = new Date(workout.date);
      workoutDate.setHours(0, 0, 0, 0);

      if (!lastDate) {
        tempStreak = 1;
        currentStreak = 1;
      } else {
        const dayDiff = Math.floor((lastDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff === 1) {
          tempStreak++;
          currentStreak++;
        } else if (dayDiff === 0) {
          // Same day, don't break streak but don't increment
          continue;
        } else {
          // Streak broken
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
          tempStreak = 1;
          currentStreak = 0; // Current streak only counts from most recent
        }
      }

      lastDate = workoutDate;
    }

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }

    setUserStats({
      totalWorkouts,
      totalPRs,
      currentStreak,
      longestStreak,
      averageCompletionRate,
    });
  };

  // Login function (placeholder for future backend integration)
  const login = async (email: string, _password: string) => {
    // TODO: Implement actual authentication
    console.log('Login called with:', email);

    // For now, create a mock user
    const mockUser: User = {
      id: 'user_' + Date.now(),
      email,
      username: email.split('@')[0],
      createdAt: new Date(),
    };

    setUser(mockUser);
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Optionally clear workout history on logout
    // setWorkoutHistory([]);
    // localStorage.removeItem('workoutHistory');
  };

  const value: UserContextType = {
    user,
    setUser,
    workoutHistory,
    addWorkout,
    getWorkoutHistory,
    userStats,
    updateStats,
    isAuthenticated,
    login,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
