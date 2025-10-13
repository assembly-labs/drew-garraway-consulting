import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import exercisesData from '../data/exercises.json';
import workoutTemplates from '../data/workoutTemplates.json';

const WorkoutContext = createContext();

export function WorkoutProvider({ children }) {
  // Selection state
  const [selectedDay, setSelectedDay] = useState(null); // 'MONDAY', 'FRIDAY', 'WEEKEND'
  const [selectedDuration, setSelectedDuration] = useState(null); // 60, 45, 30
  const [workoutPlan, setWorkoutPlan] = useState(null); // Generated workout plan

  // Active workout state
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  // Load any saved in-progress workout on mount
  useEffect(() => {
    async function loadSavedWorkout() {
      const saved = await api.getCurrentWorkout();
      if (saved) {
        setCurrentWorkout(saved);
        setSelectedDay(saved.dayType);
        setSelectedDuration(saved.durationSelected);
      }
    }
    loadSavedWorkout();
  }, []);

  /**
   * Generate workout plan based on selected day
   */
  const generateWorkoutPlan = (dayType, duration) => {
    const template = workoutTemplates[dayType];
    if (!template) return null;

    // Get exercises for this day
    const exercises = template.exerciseIds
      .map(id => exercisesData.find(ex => ex.id === id))
      .filter(Boolean)
      .map(exercise => ({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        category: exercise.category,
        description: exercise.description,
        equipment: exercise.equipment,
        sets: Array.from({ length: exercise.sets }, (_, i) => ({
          setNumber: i + 1,
          reps: 0,
          weight: 0,
          completed: false,
        })),
        targetReps: exercise.reps,
        isPR: false,
      }));

    const plan = {
      name: template.name,
      description: template.description,
      dayType,
      duration,
      exercises,
    };

    setWorkoutPlan(plan);
    return plan;
  };

  /**
   * Start workout
   */
  const startWorkout = async (plan) => {
    const workout = {
      id: `workout-${Date.now()}`,
      date: new Date().toISOString(),
      dayType: plan.dayType,
      durationSelected: plan.duration,
      startTime: new Date().toISOString(),
      exercises: plan.exercises,
      completionStatus: 'In Progress',
    };

    setCurrentWorkout(workout);
    setIsWorkoutActive(true);
    await api.saveCurrentWorkout(workout);

    return workout;
  };

  /**
   * Update exercise data (auto-save)
   */
  const updateExercise = async (exerciseId, setIndex, updates) => {
    if (!currentWorkout) return;

    const updatedWorkout = {
      ...currentWorkout,
      exercises: currentWorkout.exercises.map(ex => {
        if (ex.exerciseId === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map((set, idx) => {
              if (idx === setIndex) {
                return { ...set, ...updates };
              }
              return set;
            }),
          };
        }
        return ex;
      }),
    };

    setCurrentWorkout(updatedWorkout);
    await api.saveCurrentWorkout(updatedWorkout);
  };

  /**
   * Complete workout
   */
  const completeWorkout = async (finalWorkout) => {
    const completedWorkout = {
      ...finalWorkout,
      endTime: new Date().toISOString(),
      completionStatus: 'Completed',
    };

    await api.saveWorkout(completedWorkout);
    await api.clearCurrentWorkout();

    setCurrentWorkout(null);
    setIsWorkoutActive(false);
    setSelectedDay(null);
    setSelectedDuration(null);
    setWorkoutPlan(null);

    return completedWorkout;
  };

  /**
   * Fail workout (time ran out)
   */
  const failWorkout = async () => {
    if (!currentWorkout) return;

    const failedWorkout = {
      ...currentWorkout,
      endTime: new Date().toISOString(),
      completionStatus: 'Failed',
    };

    await api.saveWorkout(failedWorkout);
    await api.clearCurrentWorkout();

    setCurrentWorkout(null);
    setIsWorkoutActive(false);

    return failedWorkout;
  };

  /**
   * Discard workout
   */
  const discardWorkout = async () => {
    await api.clearCurrentWorkout();
    setCurrentWorkout(null);
    setIsWorkoutActive(false);
    setSelectedDay(null);
    setSelectedDuration(null);
    setWorkoutPlan(null);
  };

  const value = {
    // Selection
    selectedDay,
    setSelectedDay,
    selectedDuration,
    setSelectedDuration,

    // Plan
    workoutPlan,
    generateWorkoutPlan,

    // Active workout
    currentWorkout,
    isWorkoutActive,
    startWorkout,
    updateExercise,
    completeWorkout,
    failWorkout,
    discardWorkout,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within WorkoutProvider');
  }
  return context;
}
