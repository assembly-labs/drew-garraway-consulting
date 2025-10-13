/**
 * Personal Record (PR) Detection System
 */

/**
 * Detect if current exercise data is a PR compared to history
 * @param {Object} currentExercise - Current exercise with sets
 * @param {Array} exerciseHistory - Previous workouts for this exercise
 * @returns {boolean} - True if PR achieved
 */
export function detectPR(currentExercise, exerciseHistory) {
  if (!exerciseHistory || exerciseHistory.length === 0) {
    // First time doing this exercise - automatically a PR
    return true;
  }

  // Get max weight and reps from current workout
  const currentMaxWeight = Math.max(...currentExercise.sets.map(s => s.weight || 0));
  const currentMaxReps = Math.max(...currentExercise.sets.map(s => s.reps || 0));

  // Get historical best
  let historicalMaxWeight = 0;
  let historicalMaxReps = 0;

  exerciseHistory.forEach(workout => {
    const exercise = workout.exercises.find(ex => ex.exerciseId === currentExercise.exerciseId);
    if (exercise && exercise.sets) {
      const maxWeight = Math.max(...exercise.sets.map(s => s.weight || 0));
      const maxReps = Math.max(...exercise.sets.map(s => s.reps || 0));

      if (maxWeight > historicalMaxWeight) {
        historicalMaxWeight = maxWeight;
      }
      if (maxReps > historicalMaxReps) {
        historicalMaxReps = maxReps;
      }
    }
  });

  // PR if: higher weight OR (same weight AND more reps)
  if (currentMaxWeight > historicalMaxWeight) {
    return true;
  }

  if (currentMaxWeight === historicalMaxWeight && currentMaxReps > historicalMaxReps) {
    return true;
  }

  return false;
}

/**
 * Calculate PR records from workout history
 * @param {Array} workoutHistory - All workout sessions
 * @returns {Object} - Map of exerciseId to best weight and reps
 */
export function calculatePRRecords(workoutHistory) {
  const prRecords = {};

  workoutHistory.forEach(workout => {
    workout.exercises?.forEach(exercise => {
      const exerciseId = exercise.exerciseId;

      if (!exercise.sets || exercise.sets.length === 0) return;

      const maxWeight = Math.max(...exercise.sets.map(s => s.weight || 0));
      const maxReps = Math.max(...exercise.sets.map(s => s.reps || 0));

      if (!prRecords[exerciseId]) {
        prRecords[exerciseId] = {
          exerciseName: exercise.exerciseName,
          maxWeight,
          maxReps,
          date: workout.date,
        };
      } else {
        // Update if better
        if (maxWeight > prRecords[exerciseId].maxWeight) {
          prRecords[exerciseId].maxWeight = maxWeight;
          prRecords[exerciseId].date = workout.date;
        }
        if (maxReps > prRecords[exerciseId].maxReps) {
          prRecords[exerciseId].maxReps = maxReps;
        }
      }
    });
  });

  return prRecords;
}

/**
 * Get PRs achieved in a workout session
 * @param {Object} workoutSession - Current workout
 * @param {Array} workoutHistory - Historical workouts (excluding current)
 * @returns {Array} - List of exercises where PRs were achieved
 */
export function getPRsInWorkout(workoutSession, workoutHistory) {
  const prs = [];

  workoutSession.exercises?.forEach(exercise => {
    if (detectPR(exercise, workoutHistory)) {
      prs.push({
        exerciseId: exercise.exerciseId,
        exerciseName: exercise.exerciseName,
        maxWeight: Math.max(...exercise.sets.map(s => s.weight || 0)),
        maxReps: Math.max(...exercise.sets.map(s => s.reps || 0)),
      });
    }
  });

  return prs;
}
