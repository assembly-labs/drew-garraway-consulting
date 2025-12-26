import { GameSettings, PresetType } from '@/types/database';

export const GAME_PRESETS: Record<PresetType, { name: string; description: string; settings: GameSettings }> = {
  family_friendly: {
    name: 'Family Friendly',
    description: '2x points around kids, Sunday 2x, nice word bonus enabled',
    settings: {
      multiplier_days: ['sunday'],
      holidays_2x: true,
      around_kids_enabled: true,
      immunity_windows: [],
      streak_rewards: true,
      nice_word_enabled: true,
      nice_word_daily_limit: 3,
      nice_word_points: -1,
    },
  },
  office_mode: {
    name: 'Office Mode',
    description: 'Weekday-only scoring, weekends are immunity',
    settings: {
      multiplier_days: [],
      holidays_2x: false,
      around_kids_enabled: false,
      immunity_windows: [
        {
          id: 'weekend',
          name: 'Weekend Off',
          day_of_week: 0, // Sunday
          start_time: '00:00',
          end_time: '23:59',
          recurring: true,
        },
        {
          id: 'weekend-sat',
          name: 'Weekend Off',
          day_of_week: 6, // Saturday
          start_time: '00:00',
          end_time: '23:59',
          recurring: true,
        },
      ],
      streak_rewards: true,
      nice_word_enabled: false,
      nice_word_daily_limit: 0,
      nice_word_points: 0,
    },
  },
  friend_group: {
    name: 'Friend Group',
    description: 'Standard scoring, no multipliers, pure chaos',
    settings: {
      multiplier_days: [],
      holidays_2x: false,
      around_kids_enabled: false,
      immunity_windows: [],
      streak_rewards: false,
      nice_word_enabled: false,
      nice_word_daily_limit: 0,
      nice_word_points: 0,
    },
  },
  hardcore: {
    name: 'Hardcore',
    description: 'No immunity, 2x holidays, aggressive streak bonuses',
    settings: {
      multiplier_days: ['sunday', 'saturday'],
      holidays_2x: true,
      around_kids_enabled: true,
      immunity_windows: [],
      streak_rewards: true,
      nice_word_enabled: true,
      nice_word_daily_limit: 2,
      nice_word_points: -2,
    },
  },
  custom: {
    name: 'Custom',
    description: 'Full control over all settings',
    settings: {
      multiplier_days: [],
      holidays_2x: false,
      around_kids_enabled: true,
      immunity_windows: [],
      streak_rewards: true,
      nice_word_enabled: true,
      nice_word_daily_limit: 3,
      nice_word_points: -1,
    },
  },
};

export const DAYS_OF_WEEK = [
  { value: 'sunday', label: 'Sunday', number: 0 },
  { value: 'monday', label: 'Monday', number: 1 },
  { value: 'tuesday', label: 'Tuesday', number: 2 },
  { value: 'wednesday', label: 'Wednesday', number: 3 },
  { value: 'thursday', label: 'Thursday', number: 4 },
  { value: 'friday', label: 'Friday', number: 5 },
  { value: 'saturday', label: 'Saturday', number: 6 },
];

export const NICE_WORD_SUGGESTIONS = [
  'Splendid',
  'Wonderful',
  'Gosh darn',
  'Delightful',
  'Magnificent',
  'Marvelous',
  'Fabulous',
  'Terrific',
  'Superb',
  'Fantastic',
  'Gracious',
  'Golly',
  'Heavens',
  'Goodness',
  'Lovely',
];

export const FUNNY_GAME_NAMES = [
  'The Swear Jar',
  'Potty Mouth Patrol',
  'Clean Speech Squad',
  'The F-Bomb Shelter',
  'Curse Control',
  'The Bleepening',
  'Language Police',
  'Sailor Mouth Society',
  'The Cuss Busters',
  'Profanity Probation',
  'The Soap Patrol',
  'Word Watchers',
  'The Clean Crew',
  'Foul Mouth Fighters',
  'The Swearing Games',
];
