import { Exercise, exerciseLibrary } from './exerciseLibrary';

export interface ExerciseInPlan extends Exercise {
  customSets?: number;
  customReps?: number;
  customWeight?: number;
  customRestTime?: number;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  exercises: ExerciseInPlan[];
  estimatedTime: number; // in minutes
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
}

// Helper to get exercises by ID
const getExercise = (id: string): Exercise => {
  const exercise = exerciseLibrary.find((ex) => ex.id === id);
  if (!exercise) throw new Error(`Exercise ${id} not found`);
  return exercise;
};

export const workoutPlans: WorkoutPlan[] = [
  {
    id: 'quick-burn',
    name: 'Quick Burn',
    description: 'Fast and effective 20-minute workout to get your blood pumping. Perfect for busy days.',
    exercises: [
      getExercise('plank'),
      getExercise('dumbbell-curl'),
      getExercise('pull-ups'),
    ],
    estimatedTime: 20,
    difficulty: 'Beginner',
    category: 'Quick Workout',
  },
  {
    id: 'upper-body-blast',
    name: 'Upper Body Blast',
    description: 'Comprehensive upper body workout targeting chest, back, shoulders, and arms.',
    exercises: [
      getExercise('bench-press'),
      getExercise('overhead-press'),
      getExercise('barbell-row'),
      getExercise('pull-ups'),
    ],
    estimatedTime: 35,
    difficulty: 'Intermediate',
    category: 'Upper Body',
  },
  {
    id: 'lower-body-power',
    name: 'Lower Body Power',
    description: 'Heavy compound movements for building explosive leg strength and power.',
    exercises: [
      getExercise('squat'),
      getExercise('deadlift'),
      getExercise('plank'),
    ],
    estimatedTime: 40,
    difficulty: 'Advanced',
    category: 'Lower Body',
  },
  {
    id: 'full-body-strength',
    name: 'Full Body Strength',
    description: 'Complete full-body workout hitting all major muscle groups with compound movements.',
    exercises: [
      getExercise('bench-press'),
      getExercise('squat'),
      getExercise('barbell-row'),
      getExercise('overhead-press'),
      getExercise('pull-ups'),
    ],
    estimatedTime: 45,
    difficulty: 'Intermediate',
    category: 'Full Body',
  },
  {
    id: 'the-gauntlet',
    name: 'The Gauntlet',
    description: 'The ultimate test. All exercises, maximum effort. Beast mode recommended.',
    exercises: [
      getExercise('bench-press'),
      getExercise('squat'),
      getExercise('deadlift'),
      getExercise('overhead-press'),
      getExercise('pull-ups'),
      getExercise('barbell-row'),
      getExercise('dumbbell-curl'),
      getExercise('plank'),
    ],
    estimatedTime: 60,
    difficulty: 'Advanced',
    category: 'Full Body',
  },
];

// Helper function to get a plan by ID
export const getPlanById = (id: string): WorkoutPlan | undefined => {
  return workoutPlans.find((plan) => plan.id === id);
};

// Helper to get plans by difficulty
export const getPlansByDifficulty = (
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
): WorkoutPlan[] => {
  return workoutPlans.filter((plan) => plan.difficulty === difficulty);
};
