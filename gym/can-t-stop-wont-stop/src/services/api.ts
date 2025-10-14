import type { WorkoutData } from '../context/WorkoutContext';
import type { User } from '../context/UserContext';

// API Base URL (will be configured via environment variables)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Generic API request handler with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Authentication APIs
export const authAPI = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (email: string, password: string, username: string): Promise<{ user: User; token: string }> => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    });
  },

  logout: async (): Promise<void> => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },
};

// Workout APIs
export const workoutAPI = {
  // Save a completed workout
  saveWorkout: async (workout: WorkoutData): Promise<WorkoutData> => {
    return apiRequest('/workouts', {
      method: 'POST',
      body: JSON.stringify(workout),
    });
  },

  // Get all workouts for the current user
  getWorkouts: async (): Promise<WorkoutData[]> => {
    return apiRequest('/workouts', {
      method: 'GET',
    });
  },

  // Get a specific workout by ID
  getWorkoutById: async (workoutId: string): Promise<WorkoutData> => {
    return apiRequest(`/workouts/${workoutId}`, {
      method: 'GET',
    });
  },

  // Update a workout
  updateWorkout: async (workoutId: string, workout: Partial<WorkoutData>): Promise<WorkoutData> => {
    return apiRequest(`/workouts/${workoutId}`, {
      method: 'PUT',
      body: JSON.stringify(workout),
    });
  },

  // Delete a workout
  deleteWorkout: async (workoutId: string): Promise<void> => {
    return apiRequest(`/workouts/${workoutId}`, {
      method: 'DELETE',
    });
  },
};

// Exercise Library APIs
export const exerciseAPI = {
  // Get all exercises
  getAllExercises: async (): Promise<any[]> => {
    return apiRequest('/exercises', {
      method: 'GET',
    });
  },

  // Get exercises by category
  getExercisesByCategory: async (category: string): Promise<any[]> => {
    return apiRequest(`/exercises/category/${category}`, {
      method: 'GET',
    });
  },

  // Get a specific exercise by ID
  getExerciseById: async (exerciseId: string): Promise<any> => {
    return apiRequest(`/exercises/${exerciseId}`, {
      method: 'GET',
    });
  },
};

// User Profile APIs
export const userAPI = {
  // Get user profile
  getProfile: async (): Promise<User> => {
    return apiRequest('/user/profile', {
      method: 'GET',
    });
  },

  // Update user profile
  updateProfile: async (updates: Partial<User>): Promise<User> => {
    return apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Get user stats
  getStats: async (): Promise<any> => {
    return apiRequest('/user/stats', {
      method: 'GET',
    });
  },
};

// Offline support: Check if we're online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Queue for offline operations (can be enhanced later)
let offlineQueue: Array<{ endpoint: string; options: RequestInit }> = [];

export const queueOfflineRequest = (endpoint: string, options: RequestInit) => {
  offlineQueue.push({ endpoint, options });
  localStorage.setItem('offlineQueue', JSON.stringify(offlineQueue));
};

export const processOfflineQueue = async () => {
  if (!isOnline() || offlineQueue.length === 0) return;

  const queue = [...offlineQueue];
  offlineQueue = [];
  localStorage.removeItem('offlineQueue');

  for (const request of queue) {
    try {
      await apiRequest(request.endpoint, request.options);
    } catch (error) {
      console.error('Failed to process offline request:', error);
      // Re-queue if it fails
      queueOfflineRequest(request.endpoint, request.options);
    }
  }
};

// Listen for online event to process offline queue
if (typeof window !== 'undefined') {
  window.addEventListener('online', processOfflineQueue);
}

export default {
  auth: authAPI,
  workout: workoutAPI,
  exercise: exerciseAPI,
  user: userAPI,
};
