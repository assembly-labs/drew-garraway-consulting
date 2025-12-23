/**
 * UserProfileContext
 *
 * Central state management for user profile data.
 * Handles:
 * - Critical onboarding data (name, belt)
 * - Progressive profiling data (collected over 20 sessions)
 * - Session count tracking for nudge triggers
 * - Profile completion percentage
 *
 * Persists to localStorage for prototype; would be API-backed in production.
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Belt types
export type BeltLevel = 'white' | 'blue' | 'purple' | 'brown' | 'black';
export type TrainingGoal = 'competition' | 'fitness' | 'self-defense' | 'mental' | 'community';
export type LoggingPreference = 'voice' | 'type' | 'undecided';

// Profile data structure
export interface UserProfile {
  // Critical (required during onboarding)
  name: string;
  belt: BeltLevel;

  // Progressive profiling data
  stripes: number | null;
  trainingStartDate: string | null; // ISO date string
  currentBeltDate: string | null; // ISO date string
  gymName: string | null;
  trainingGoals: TrainingGoal[];
  targetFrequency: number | null; // sessions per week
  birthYear: number | null;
  loggingPreference: LoggingPreference;
  notificationsEnabled: boolean | null;

  // Metadata
  onboardingComplete: boolean;
  sessionCount: number;
  createdAt: string;
  lastSessionAt: string | null;

  // Skip tracking (stop asking after 3 skips)
  skipCounts: {
    stripes: number;
    trainingStartDate: number;
    currentBeltDate: number;
    gymName: number;
    trainingGoals: number;
    targetFrequency: number;
    birthYear: number;
  };

  // Last asked session (don't ask same question twice in a row)
  lastAskedSession: {
    [key: string]: number;
  };
}

// Profile nudge question definitions
export interface ProfileQuestion {
  id: keyof UserProfile['skipCounts'];
  sessionTrigger: number;
  question: string;
  subtitle?: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'chips';
  options?: { value: string; label: string }[];
  unlocks: string;
}

export const PROFILE_QUESTIONS: ProfileQuestion[] = [
  {
    id: 'trainingStartDate',
    sessionTrigger: 3,
    question: "When did you start training?",
    subtitle: "This helps us calculate your time on the mat.",
    type: 'date',
    unlocks: "Time-in-grade tracking and 'X years training' stats",
  },
  {
    id: 'stripes',
    sessionTrigger: 5,
    question: "How many stripes on your belt?",
    type: 'chips',
    options: [
      { value: '0', label: 'None' },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
    ],
    unlocks: "More precise progress percentage",
  },
  {
    id: 'gymName',
    sessionTrigger: 7,
    question: "What's your gym called?",
    subtitle: "This enables future coach connection features.",
    type: 'text',
    unlocks: "Gym connection and coach features",
  },
  {
    id: 'trainingGoals',
    sessionTrigger: 10,
    question: "Why do you train?",
    subtitle: "Select all that apply.",
    type: 'multiselect',
    options: [
      { value: 'competition', label: 'Competition' },
      { value: 'fitness', label: 'Fitness' },
      { value: 'self-defense', label: 'Self-defense' },
      { value: 'mental', label: 'Mental game' },
      { value: 'community', label: 'Community' },
    ],
    unlocks: "Personalized prompts and goal-aware messaging",
  },
  {
    id: 'targetFrequency',
    sessionTrigger: 12,
    question: "How often do you want to train?",
    subtitle: "Per week",
    type: 'chips',
    options: [
      { value: '2', label: '2x' },
      { value: '3', label: '3x' },
      { value: '4', label: '4x' },
      { value: '5', label: '5x+' },
    ],
    unlocks: "Consistency benchmarks and streak calibration",
  },
  {
    id: 'currentBeltDate',
    sessionTrigger: 15,
    question: "When did you get your current belt?",
    subtitle: "Approximate month and year is fine.",
    type: 'date',
    unlocks: "Accurate promotion timeline estimates",
  },
  {
    id: 'birthYear',
    sessionTrigger: 18,
    question: "What decade were you born?",
    subtitle: "This unlocks age-based peer comparisons.",
    type: 'chips',
    options: [
      { value: '1960', label: '60s' },
      { value: '1970', label: '70s' },
      { value: '1980', label: '80s' },
      { value: '1990', label: '90s' },
      { value: '2000', label: '00s' },
    ],
    unlocks: "Peer comparisons with practitioners your age",
  },
];

// Default profile state
const DEFAULT_PROFILE: UserProfile = {
  name: '',
  belt: 'white',
  stripes: null,
  trainingStartDate: null,
  currentBeltDate: null,
  gymName: null,
  trainingGoals: [],
  targetFrequency: null,
  birthYear: null,
  loggingPreference: 'undecided',
  notificationsEnabled: null,
  onboardingComplete: false,
  sessionCount: 0,
  createdAt: new Date().toISOString(),
  lastSessionAt: null,
  skipCounts: {
    stripes: 0,
    trainingStartDate: 0,
    currentBeltDate: 0,
    gymName: 0,
    trainingGoals: 0,
    targetFrequency: 0,
    birthYear: 0,
  },
  lastAskedSession: {},
};

// Context type
interface UserProfileContextType {
  profile: UserProfile;
  isLoading: boolean;

  // Onboarding
  completeOnboarding: (name: string, belt: BeltLevel) => void;

  // Profile updates
  updateProfile: (updates: Partial<UserProfile>) => void;
  setLoggingPreference: (pref: LoggingPreference) => void;

  // Session tracking
  incrementSessionCount: () => void;

  // Progressive profiling
  getNextNudgeQuestion: () => ProfileQuestion | null;
  skipQuestion: (questionId: keyof UserProfile['skipCounts']) => void;
  answerQuestion: (questionId: string, value: unknown) => void;

  // Profile completion
  getProfileCompletion: () => number;
  getMissingFields: () => string[];

  // Reset (for testing)
  resetProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | null>(null);

const STORAGE_KEY = 'bjj-user-profile';

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProfile({ ...DEFAULT_PROFILE, ...parsed });
      } catch {
        console.error('Failed to parse stored profile');
      }
    }
    setIsLoading(false);
  }, []);

  // Persist profile changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
  }, [profile, isLoading]);

  // Complete onboarding with critical data
  const completeOnboarding = (name: string, belt: BeltLevel) => {
    setProfile(prev => ({
      ...prev,
      name,
      belt,
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
    }));
  };

  // General profile update
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  // Set logging preference
  const setLoggingPreference = (pref: LoggingPreference) => {
    setProfile(prev => ({ ...prev, loggingPreference: pref }));
  };

  // Increment session count
  const incrementSessionCount = () => {
    setProfile(prev => ({
      ...prev,
      sessionCount: prev.sessionCount + 1,
      lastSessionAt: new Date().toISOString(),
    }));
  };

  // Get next nudge question based on session count
  const getNextNudgeQuestion = (): ProfileQuestion | null => {
    const { sessionCount, skipCounts, lastAskedSession } = profile;

    for (const question of PROFILE_QUESTIONS) {
      const fieldValue = profile[question.id as keyof UserProfile];
      const isAnswered = fieldValue !== null &&
        (Array.isArray(fieldValue) ? fieldValue.length > 0 : true);

      // Skip if already answered
      if (isAnswered) continue;

      // Skip if skipped 3+ times
      if (skipCounts[question.id] >= 3) continue;

      // Skip if not at trigger session yet
      if (sessionCount < question.sessionTrigger) continue;

      // Skip if asked in last 3 sessions
      const lastAsked = lastAskedSession[question.id] || 0;
      if (sessionCount - lastAsked < 3 && lastAsked > 0) continue;

      return question;
    }

    return null;
  };

  // Skip a question
  const skipQuestion = (questionId: keyof UserProfile['skipCounts']) => {
    setProfile(prev => ({
      ...prev,
      skipCounts: {
        ...prev.skipCounts,
        [questionId]: prev.skipCounts[questionId] + 1,
      },
      lastAskedSession: {
        ...prev.lastAskedSession,
        [questionId]: prev.sessionCount,
      },
    }));
  };

  // Answer a question
  const answerQuestion = (questionId: string, value: unknown) => {
    setProfile(prev => ({
      ...prev,
      [questionId]: value,
      lastAskedSession: {
        ...prev.lastAskedSession,
        [questionId]: prev.sessionCount,
      },
    }));
  };

  // Calculate profile completion percentage
  const getProfileCompletion = (): number => {
    const fields = [
      profile.name,
      profile.belt,
      profile.stripes,
      profile.trainingStartDate,
      profile.currentBeltDate,
      profile.gymName,
      profile.trainingGoals.length > 0,
      profile.targetFrequency,
      profile.birthYear,
      profile.loggingPreference !== 'undecided',
    ];

    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  // Get list of missing fields
  const getMissingFields = (): string[] => {
    const missing: string[] = [];

    if (profile.stripes === null) missing.push('Belt stripes');
    if (!profile.trainingStartDate) missing.push('Training start date');
    if (!profile.currentBeltDate) missing.push('Current belt date');
    if (!profile.gymName) missing.push('Gym name');
    if (profile.trainingGoals.length === 0) missing.push('Training goals');
    if (profile.targetFrequency === null) missing.push('Target frequency');
    if (profile.birthYear === null) missing.push('Birth year');

    return missing;
  };

  // Reset profile (for testing)
  const resetProfile = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(DEFAULT_PROFILE);
  };

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        isLoading,
        completeOnboarding,
        updateProfile,
        setLoggingPreference,
        incrementSessionCount,
        getNextNudgeQuestion,
        skipQuestion,
        answerQuestion,
        getProfileCompletion,
        getMissingFields,
        resetProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }
  return context;
}
