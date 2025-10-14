/**
 * Exercise Library
 * Based on the Top 50 Exercises for Men in Their 40s
 */

export interface ExerciseTemplate {
  exerciseId: string;
  exerciseName: string;
  category: string;
  equipment: string;
  defaultSets: number;
  defaultReps: number;
  defaultWeight: number;
  description: string;
}

export const exerciseLibrary: ExerciseTemplate[] = [
  // Leg Exercises
  {
    exerciseId: 'goblet-squat',
    exerciseName: 'Dumbbell Goblet Squat',
    category: 'Legs',
    equipment: 'Dumbbell',
    defaultSets: 4,
    defaultReps: 10,
    defaultWeight: 35,
    description: 'Safest squat variation - hold dumbbell at chest, squat to parallel',
  },
  {
    exerciseId: 'trap-bar-deadlift',
    exerciseName: 'Trap Bar Deadlift',
    category: 'Legs',
    equipment: 'Trap Bar',
    defaultSets: 4,
    defaultReps: 6,
    defaultWeight: 135,
    description: 'Reduces lumbar spine stress - stand inside bar, lift with neutral grip',
  },
  {
    exerciseId: 'romanian-deadlift',
    exerciseName: 'Romanian Deadlift (Dumbbell)',
    category: 'Legs',
    equipment: 'Dumbbells',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 40,
    description: 'Hip hinge with slight knee bend, targets hamstrings and glutes',
  },
  {
    exerciseId: 'bulgarian-split-squat',
    exerciseName: 'Bulgarian Split Squat',
    category: 'Legs',
    equipment: 'Dumbbells',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 25,
    description: 'Rear foot elevated, builds glutes and quads unilaterally',
  },
  {
    exerciseId: 'hip-thrust',
    exerciseName: 'Hip Thrust',
    category: 'Legs',
    equipment: 'Barbell',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 95,
    description: 'Upper back on bench, maximum glute activation',
  },

  // Back Exercises
  {
    exerciseId: 'single-arm-row',
    exerciseName: 'Dumbbell Single-Arm Row',
    category: 'Back',
    equipment: 'Dumbbell',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 40,
    description: 'One hand on bench, row with opposite arm',
  },
  {
    exerciseId: 'chest-supported-row',
    exerciseName: 'Chest-Supported Dumbbell Row',
    category: 'Back',
    equipment: 'Dumbbells',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 35,
    description: 'Lie prone on incline bench, eliminates lower back stress',
  },
  {
    exerciseId: 'pull-ups',
    exerciseName: 'Pull-Ups',
    category: 'Back',
    equipment: 'Pull-Up Bar',
    defaultSets: 4,
    defaultReps: 8,
    defaultWeight: 0,
    description: 'Essential upper body pulling movement',
  },
  {
    exerciseId: 'face-pulls',
    exerciseName: 'Face Pulls',
    category: 'Back',
    equipment: 'Cable',
    defaultSets: 3,
    defaultReps: 15,
    defaultWeight: 40,
    description: 'Critical for shoulder health - pull rope toward face',
  },

  // Chest & Shoulders
  {
    exerciseId: 'push-ups',
    exerciseName: 'Standard Push-Up',
    category: 'Chest',
    equipment: 'Bodyweight',
    defaultSets: 3,
    defaultReps: 15,
    defaultWeight: 0,
    description: 'Fundamental bodyweight exercise, chest and core',
  },
  {
    exerciseId: 'db-shoulder-press',
    exerciseName: 'Standing Dumbbell Shoulder Press',
    category: 'Shoulders',
    equipment: 'Dumbbells',
    defaultSets: 3,
    defaultReps: 8,
    defaultWeight: 30,
    description: 'Press dumbbells overhead while standing, engages core',
  },
  {
    exerciseId: 'landmine-press',
    exerciseName: 'Landmine Press',
    category: 'Shoulders',
    equipment: 'Barbell',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 45,
    description: 'Reduces shoulder stress by 30-40%, angular press',
  },

  // Core
  {
    exerciseId: 'pallof-press',
    exerciseName: 'Pallof Press',
    category: 'Core',
    equipment: 'Cable',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 30,
    description: 'Gold standard anti-rotation exercise',
  },
  {
    exerciseId: 'dead-bug',
    exerciseName: 'Dead Bug',
    category: 'Core',
    equipment: 'Bodyweight',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 0,
    description: 'Core stability, opposite arm and leg extend',
  },
  {
    exerciseId: 'rkc-plank',
    exerciseName: 'RKC Plank',
    category: 'Core',
    equipment: 'Bodyweight',
    defaultSets: 3,
    defaultReps: 1,
    defaultWeight: 0,
    description: 'Maximum tension plank - hold 20-30 seconds',
  },
];

// Workout Templates by Day
export const workoutTemplates: Record<string, ExerciseTemplate[]> = {
  Monday: [
    exerciseLibrary.find(e => e.exerciseId === 'goblet-squat')!,
    exerciseLibrary.find(e => e.exerciseId === 'trap-bar-deadlift')!,
    exerciseLibrary.find(e => e.exerciseId === 'bulgarian-split-squat')!,
    exerciseLibrary.find(e => e.exerciseId === 'hip-thrust')!,
    exerciseLibrary.find(e => e.exerciseId === 'pallof-press')!,
    exerciseLibrary.find(e => e.exerciseId === 'rkc-plank')!,
  ],
  Friday: [
    exerciseLibrary.find(e => e.exerciseId === 'single-arm-row')!,
    exerciseLibrary.find(e => e.exerciseId === 'chest-supported-row')!,
    exerciseLibrary.find(e => e.exerciseId === 'pull-ups')!,
    exerciseLibrary.find(e => e.exerciseId === 'db-shoulder-press')!,
    exerciseLibrary.find(e => e.exerciseId === 'face-pulls')!,
    exerciseLibrary.find(e => e.exerciseId === 'dead-bug')!,
  ],
  Weekend: [
    exerciseLibrary.find(e => e.exerciseId === 'romanian-deadlift')!,
    exerciseLibrary.find(e => e.exerciseId === 'push-ups')!,
    exerciseLibrary.find(e => e.exerciseId === 'landmine-press')!,
    exerciseLibrary.find(e => e.exerciseId === 'goblet-squat')!,
    exerciseLibrary.find(e => e.exerciseId === 'face-pulls')!,
    exerciseLibrary.find(e => e.exerciseId === 'pallof-press')!,
  ],
};
