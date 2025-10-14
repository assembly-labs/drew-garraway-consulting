/**
 * Validation Utilities for Can't Stop Won't Stop
 *
 * All validation rules as per specification:
 * - Reps: 0-69 (with easter egg at 69)
 * - Weight: 0-9999
 */

export interface ValidationResult {
  isValid: boolean;
  value: number;
  message?: string;
  isEasterEgg?: boolean;
}

/**
 * Validate reps input (0-69)
 * Returns validated value clamped to range
 */
export const validateReps = (value: string | number): ValidationResult => {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;

  // Handle invalid input
  if (isNaN(num)) {
    return {
      isValid: false,
      value: 0,
      message: 'Please enter a valid number',
    };
  }

  // Clamp to 0-69 range
  let clampedValue = num;
  let message: string | undefined;

  if (num < 0) {
    clampedValue = 0;
    message = 'Reps cannot be negative';
  } else if (num > 69) {
    clampedValue = 69;
    message = 'Maximum 69 reps allowed';
  }

  // Easter egg at 69
  const isEasterEgg = clampedValue === 69;
  if (isEasterEgg) {
    message = '69 reps? Nice. But are you sure?';
  }

  return {
    isValid: true,
    value: clampedValue,
    message,
    isEasterEgg,
  };
};

/**
 * Validate weight input (0-9999)
 * Returns validated value clamped to range
 */
export const validateWeight = (value: string | number): ValidationResult => {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  // Handle invalid input
  if (isNaN(num)) {
    return {
      isValid: false,
      value: 0,
      message: 'Please enter a valid number',
    };
  }

  // Clamp to 0-9999 range
  let clampedValue = num;
  let message: string | undefined;

  if (num < 0) {
    clampedValue = 0;
    message = 'Weight cannot be negative';
  } else if (num > 9999) {
    clampedValue = 9999;
    message = 'Maximum weight is 9999';
  }

  // Round to 1 decimal place
  clampedValue = Math.round(clampedValue * 10) / 10;

  return {
    isValid: true,
    value: clampedValue,
    message,
  };
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return {
      isValid: false,
      message: 'Email is required',
    };
  }

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: 'Please enter a valid email address',
    };
  }

  return { isValid: true };
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (!password) {
    return {
      isValid: false,
      message: 'Password is required',
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters',
    };
  }

  // Optional: Check for password strength
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return {
      isValid: false,
      message: 'Password must contain uppercase, lowercase, and numbers',
    };
  }

  return { isValid: true };
};

/**
 * Validate username
 */
export const validateUsername = (username: string): { isValid: boolean; message?: string } => {
  if (!username) {
    return {
      isValid: false,
      message: 'Username is required',
    };
  }

  if (username.length < 3) {
    return {
      isValid: false,
      message: 'Username must be at least 3 characters',
    };
  }

  if (username.length > 20) {
    return {
      isValid: false,
      message: 'Username must be less than 20 characters',
    };
  }

  // Only allow alphanumeric and underscores
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      message: 'Username can only contain letters, numbers, and underscores',
    };
  }

  return { isValid: true };
};

/**
 * Format time in MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format date for display
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * Format duration (e.g., "45 min")
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Check if a value is within a range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Debounce function for input validation
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
