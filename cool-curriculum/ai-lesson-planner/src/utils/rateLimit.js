// Rate Limiting Utilities
// Manages generation rate limits to conserve API tokens

const RATE_LIMIT_KEY = 'lesson_planner_rate_limit';
const MAX_REGENERATIONS = 3;
const TIME_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Checks if the user is within rate limits
 * @returns {Object} { allowed: boolean, minutesRemaining: number, count: number }
 */
export function checkRateLimit() {
  try {
    const data = getRateLimitData();
    const now = Date.now();
    const windowStart = now - TIME_WINDOW_MS;

    // Filter regenerations within the time window
    const recentRegens = data.regenerations.filter(
      r => new Date(r.timestamp).getTime() > windowStart
    );

    if (recentRegens.length >= MAX_REGENERATIONS) {
      // Rate limit exceeded
      const oldestRegen = recentRegens[0];
      const oldestTime = new Date(oldestRegen.timestamp).getTime();
      const timeUntilReset = oldestTime + TIME_WINDOW_MS - now;
      const minutesRemaining = Math.ceil(timeUntilReset / 60000);

      return {
        allowed: false,
        minutesRemaining,
        count: recentRegens.length
      };
    }

    // Within limits
    return {
      allowed: true,
      minutesRemaining: 0,
      count: recentRegens.length
    };

  } catch (error) {
    console.error('Rate limit check error:', error);
    // On error, allow the action
    return { allowed: true, minutesRemaining: 0, count: 0 };
  }
}

/**
 * Records a new regeneration event
 * @param {string} materialId - Optional ID of the material being regenerated
 */
export function recordRegeneration(materialId = null) {
  try {
    const data = getRateLimitData();
    const now = new Date().toISOString();

    // Add new regeneration
    data.regenerations.push({
      timestamp: now,
      materialId: materialId || 'draft'
    });

    // Clean up old regenerations (older than time window)
    const windowStart = Date.now() - TIME_WINDOW_MS;
    data.regenerations = data.regenerations.filter(
      r => new Date(r.timestamp).getTime() > windowStart
    );

    // Save to localStorage
    saveRateLimitData(data);

    return true;

  } catch (error) {
    console.error('Record regeneration error:', error);
    return false;
  }
}

/**
 * Gets the current regeneration count within the time window
 */
export function getRegenerationCount() {
  try {
    const data = getRateLimitData();
    const windowStart = Date.now() - TIME_WINDOW_MS;

    const recentCount = data.regenerations.filter(
      r => new Date(r.timestamp).getTime() > windowStart
    ).length;

    return {
      count: recentCount,
      max: MAX_REGENERATIONS,
      remaining: Math.max(0, MAX_REGENERATIONS - recentCount)
    };

  } catch (error) {
    console.error('Get regeneration count error:', error);
    return { count: 0, max: MAX_REGENERATIONS, remaining: MAX_REGENERATIONS };
  }
}

/**
 * Resets the rate limit data (for testing or admin purposes)
 */
export function resetRateLimit() {
  try {
    saveRateLimitData({ regenerations: [] });
    return true;
  } catch (error) {
    console.error('Reset rate limit error:', error);
    return false;
  }
}

// --- Helper Functions ---

function getRateLimitData() {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading rate limit data:', error);
  }

  // Return default structure
  return { regenerations: [] };
}

function saveRateLimitData(data) {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving rate limit data:', error);
  }
}
