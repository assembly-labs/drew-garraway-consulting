/**
 * LocalStorage API wrapper
 * Backend-ready architecture - easy to swap for REST API later
 */

const STORAGE_KEYS = {
  WORKOUT_HISTORY: 'csws_workout_history',
  USER_PREFERENCES: 'csws_user_preferences',
  CURRENT_WORKOUT: 'csws_current_workout',
  PR_RECORDS: 'csws_pr_records',
};

class API {
  // Workout History
  async getWorkoutHistory() {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
    return data ? JSON.parse(data) : [];
  }

  async saveWorkout(workoutSession) {
    const history = await this.getWorkoutHistory();
    history.unshift(workoutSession); // Add to beginning
    localStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(history));
    return workoutSession;
  }

  async deleteWorkout(workoutId) {
    const history = await this.getWorkoutHistory();
    const filtered = history.filter(w => w.id !== workoutId);
    localStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(filtered));
    return true;
  }

  // Current Workout (auto-save during active workout)
  async getCurrentWorkout() {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_WORKOUT);
    return data ? JSON.parse(data) : null;
  }

  async saveCurrentWorkout(workoutData) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_WORKOUT, JSON.stringify(workoutData));
    return workoutData;
  }

  async clearCurrentWorkout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_WORKOUT);
    return true;
  }

  // User Preferences
  async getPreferences() {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return data ? JSON.parse(data) : { soundEnabled: true, hapticEnabled: true };
  }

  async savePreferences(preferences) {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    return preferences;
  }

  // PR Records
  async getPRRecords() {
    const data = localStorage.getItem(STORAGE_KEYS.PR_RECORDS);
    return data ? JSON.parse(data) : {};
  }

  async savePRRecords(records) {
    localStorage.setItem(STORAGE_KEYS.PR_RECORDS, JSON.stringify(records));
    return records;
  }

  // Utility
  async clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  }
}

export const api = new API();
