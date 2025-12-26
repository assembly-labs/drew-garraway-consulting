import { Game, GameSettings } from '@/types/database';
import { DAYS_OF_WEEK } from '@/lib/constants/presets';

// Check if today is a multiplier day
export function isMultiplierDay(settings: GameSettings): boolean {
  const today = new Date();
  const dayName = DAYS_OF_WEEK[today.getDay()].value;
  return settings.multiplier_days.includes(dayName);
}

// Check if we're in an immunity window
export function isInImmunityWindow(settings: GameSettings): boolean {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  for (const window of settings.immunity_windows) {
    if (window.recurring && window.day_of_week === currentDay) {
      if (currentTime >= window.start_time && currentTime <= window.end_time) {
        return true;
      }
    }
  }
  return false;
}

// Check if cease-fire is active
export function isCeaseFireActive(game: Game): boolean {
  if (!game.cease_fire_until) return false;
  return new Date() < new Date(game.cease_fire_until);
}

// Calculate points for a curse report
export function calculateCursePoints(game: Game): { points: number; multiplier: number } {
  let multiplier = 1;

  // Check for 2x day
  if (isMultiplierDay(game.settings)) {
    multiplier = 2;
  }

  // Check for around kids mode
  if (game.around_kids_active) {
    multiplier = 2;
  }

  return {
    points: 1 * multiplier,
    multiplier,
  };
}

// Check if reporting is allowed right now
export function canReportCurse(game: Game): { allowed: boolean; reason?: string } {
  if (game.status !== 'active') {
    return { allowed: false, reason: 'Game is not active' };
  }

  if (isCeaseFireActive(game)) {
    return { allowed: false, reason: 'Cease-fire is active' };
  }

  if (isInImmunityWindow(game.settings)) {
    return { allowed: false, reason: 'Immunity window is active' };
  }

  return { allowed: true };
}

// Calculate streak bonus points (negative = good)
export function calculateStreakBonus(streakDays: number): number {
  if (streakDays >= 7) return -3; // Full week clean
  if (streakDays >= 3) return -1; // 3+ days clean
  return 0;
}

// Check if a user had a clean day (no curses)
export function hadCleanDay(lastCurseDate: string | null): boolean {
  if (!lastCurseDate) return true;
  const lastCurse = new Date(lastCurseDate);
  const today = new Date();
  return lastCurse.toDateString() !== today.toDateString();
}

// Get curse count for today
export function getCursesToday(reports: { timestamp: string }[]): number {
  const today = new Date().toDateString();
  return reports.filter((r) => new Date(r.timestamp).toDateString() === today).length;
}

// Format score display (lower is better, like golf)
export function formatScore(score: number): string {
  if (score === 0) return '0';
  return `+${score}`;
}

// Get rank suffix (1st, 2nd, 3rd, etc.)
export function getRankSuffix(rank: number): string {
  if (rank % 100 >= 11 && rank % 100 <= 13) return 'th';
  switch (rank % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

// Format rank display
export function formatRank(rank: number): string {
  return `${rank}${getRankSuffix(rank)}`;
}
