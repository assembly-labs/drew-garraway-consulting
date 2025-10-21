import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Types
export type DayType = 'Monday' | 'Friday' | 'Weekend' | null;
export type DurationType = 60 | 45 | 30 | null;
export type CompletionStatus = 'Completed' | 'Failed' | 'Incomplete';

export interface ExerciseSet {
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface Exercise {
  exerciseId: string;
  exerciseName: string;
  sets: ExerciseSet[];
  isPR: boolean;
  category?: string;
  equipment?: string;
  description?: string;
}

export interface WorkoutData {
  id?: string;
  dayType: DayType;
  durationSelected: DurationType;
  completionStatus: CompletionStatus;
  timeElapsed: number; // seconds
  exercises: Exercise[];
  prsAchieved: number;
  date: Date;
}

interface WorkoutContextType {
  // Selection state
  selectedDay: DayType;
  selectedDuration: DurationType;
  setSelectedDay: (day: DayType) => void;
  setSelectedDuration: (duration: DurationType) => void;

  // Current workout state
  currentWorkout: WorkoutData | null;
  setCurrentWorkout: (workout: WorkoutData | null) => void;

  // Active workout state
  isWorkoutActive: boolean;
  startWorkout: (exercises: Exercise[]) => void;
  endWorkout: () => void;

  // Exercise state
  updateExerciseSet: (exerciseId: string, setIndex: number, reps: number, weight: number) => void;
  completeExerciseSet: (exerciseId: string, setIndex: number) => void;

  // Timer state
  timeRemaining: number; // seconds
  setTimeRemaining: (time: number) => void;

  // Reset
  resetWorkoutSelection: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Selection state
  const [selectedDay, setSelectedDay] = useState<DayType>(null);
  const [selectedDuration, setSelectedDuration] = useState<DurationType>(60); // Default to 60 min

  // Current workout state
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutData | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Start a new workout
  const startWorkout = (exercises: Exercise[]) => {
    const workout: WorkoutData = {
      dayType: selectedDay,
      durationSelected: selectedDuration,
      completionStatus: 'Incomplete',
      timeElapsed: 0,
      exercises: exercises,
      prsAchieved: 0,
      date: new Date(),
    };

    setCurrentWorkout(workout);
    setIsWorkoutActive(true);
    setTimeRemaining((selectedDuration || 60) * 60); // Convert minutes to seconds
  };

  // End the workout
  const endWorkout = () => {
    setIsWorkoutActive(false);
    // Don't clear currentWorkout here - we need it for post-workout edit
  };

  // Update a specific set's reps and weight
  const updateExerciseSet = (exerciseId: string, setIndex: number, reps: number, weight: number) => {
    if (!currentWorkout) return;

    const updatedExercises = currentWorkout.exercises.map(exercise => {
      if (exercise.exerciseId === exerciseId) {
        const updatedSets = exercise.sets.map((set, idx) => {
          if (idx === setIndex) {
            return { ...set, reps, weight };
          }
          return set;
        });
        return { ...exercise, sets: updatedSets };
      }
      return exercise;
    });

    setCurrentWorkout({
      ...currentWorkout,
      exercises: updatedExercises,
    });
  };

  // Mark a set as completed
  const completeExerciseSet = (exerciseId: string, setIndex: number) => {
    if (!currentWorkout) return;

    const updatedExercises = currentWorkout.exercises.map(exercise => {
      if (exercise.exerciseId === exerciseId) {
        const updatedSets = exercise.sets.map((set, idx) => {
          if (idx === setIndex) {
            return { ...set, completed: true };
          }
          return set;
        });
        return { ...exercise, sets: updatedSets };
      }
      return exercise;
    });

    setCurrentWorkout({
      ...currentWorkout,
      exercises: updatedExercises,
    });
  };

  // Reset all workout selection (for starting fresh)
  const resetWorkoutSelection = () => {
    setSelectedDay(null);
    setSelectedDuration(null);
    setCurrentWorkout(null);
    setIsWorkoutActive(false);
    setTimeRemaining(0);
  };

  const value: WorkoutContextType = {
    selectedDay,
    selectedDuration,
    setSelectedDay,
    setSelectedDuration,
    currentWorkout,
    setCurrentWorkout,
    isWorkoutActive,
    startWorkout,
    endWorkout,
    updateExerciseSet,
    completeExerciseSet,
    timeRemaining,
    setTimeRemaining,
    resetWorkoutSelection,
  };

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
};

// Custom hook to use the WorkoutContext
export const useWorkout = (): WorkoutContextType => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

export default WorkoutContext;
