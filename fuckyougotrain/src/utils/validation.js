/**
 * Input validation utilities
 */

/**
 * Validate reps (0-69)
 * Returns clamped value and optional easter egg message
 */
export function validateReps(value) {
  const num = parseInt(value, 10);

  if (isNaN(num) || value === '') return { value: 0, message: null };
  if (num < 0) return { value: 0, message: 'Reps must be at least 0' };
  if (num > 69) return { value: 69, message: 'Reps capped at 69' };

  // Easter egg for 69 reps
  if (num === 69) {
    return {
      value: 69,
      message: '69 reps? Nice. But are you sure?',
      isEasterEgg: true,
    };
  }

  return { value: num, message: null };
}

/**
 * Validate weight (0-9999)
 */
export function validateWeight(value) {
  const num = parseFloat(value);

  if (isNaN(num) || value === '') return { value: 0, message: null };
  if (num < 0) return { value: 0, message: 'Weight must be at least 0' };
  if (num > 9999) return { value: 9999, message: 'Weight capped at 9999 lbs' };

  return { value: num, message: null };
}

/**
 * Validate duration selection
 */
export function validateDuration(duration) {
  const validDurations = [60, 45, 30];
  return validDurations.includes(duration) ? duration : 60;
}

/**
 * Validate day type
 */
export function validateDayType(dayType) {
  const validDays = ['MONDAY', 'FRIDAY', 'WEEKEND'];
  return validDays.includes(dayType) ? dayType : 'MONDAY';
}
