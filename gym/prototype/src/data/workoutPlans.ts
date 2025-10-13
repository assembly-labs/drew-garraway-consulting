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
    id: 'monday',
    name: 'MONDAY',
    description: 'Lower body and back focused workout. Build strength in your posterior chain and legs.',
    exercises: [
      getExercise('general-warmup'),
      getExercise('specific-warmup'),
      getExercise('trap-bar-deadlift'),
      getExercise('goblet-squat'),
      getExercise('single-arm-row'),
      getExercise('incline-pushup'),
      getExercise('pallof-press'),
      getExercise('rkc-plank'),
      getExercise('cooldown'),
    ],
    estimatedTime: 60,
    difficulty: 'Intermediate',
    category: 'Lower Body & Back',
  },
  {
    id: 'friday',
    name: 'FRIDAY',
    description: 'Upper body and legs. Shoulders, back, and unilateral leg work for balanced strength.',
    exercises: [
      getExercise('general-warmup'),
      getExercise('specific-warmup'),
      getExercise('db-shoulder-press'),
      getExercise('pullups-lat-pulldown'),
      getExercise('bulgarian-split-squat'),
      getExercise('romanian-deadlift'),
      getExercise('face-pulls'),
      getExercise('dead-bug'),
      getExercise('cooldown'),
    ],
    estimatedTime: 60,
    difficulty: 'Intermediate',
    category: 'Upper Body & Legs',
  },
  {
    id: 'saturday-sunday',
    name: 'SATURDAY/SUNDAY',
    description: 'Full body workout with glutes, back, and core emphasis. Perfect weekend session.',
    exercises: [
      getExercise('general-warmup'),
      getExercise('specific-warmup'),
      getExercise('hip-thrust'),
      getExercise('chest-supported-row'),
      getExercise('reverse-lunge'),
      getExercise('standard-pushup'),
      getExercise('single-leg-rdl'),
      getExercise('side-plank'),
      getExercise('zone2-rowing-cooldown'),
    ],
    estimatedTime: 60,
    difficulty: 'Intermediate',
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
