/**
 * UserProfileContext
 *
 * Central state management for user profile data.
 * Handles:
 * - Critical onboarding data (name, belt)
 * - Progressive profiling data (collected over 20 sessions)
 * - Session count tracking for nudge triggers
 * - Profile completion percentage
 * - Demo mode with full mock profiles for prototype approval
 *
 * Persists to localStorage for prototype; would be API-backed in production.
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getProfileByBelt, type MockProfile, type ActiveProfileKey } from '../data/mock-profiles';
import { getPersonaByKey, personas, type Persona, type PersonaKey } from '../data/personas';
import { type GymSelection } from '../data/gyms';

// Combined profile type for demo mode (supports both legacy and new persona system)
type DemoProfile = MockProfile | Persona;

// Belt types
export type BeltLevel = 'white' | 'blue' | 'purple' | 'brown' | 'black';
export type TrainingGoal = 'competition' | 'fitness' | 'self-defense' | 'mental' | 'community' | 'hobby';
export type LoggingPreference = 'voice' | 'text' | 'undecided';
export type ExperienceLevel = 'new' | 'beginner' | 'intermediate' | 'experienced';
export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

export interface NotificationSettings {
  trainingReminders: boolean;
  progressUpdates: boolean;
  coachFeedback: boolean;
}

export interface BeltProgressionEvent {
  id: string;
  date: string;
  type: 'belt_promotion' | 'stripe_promotion' | 'belt_correction' | 'stripe_correction';
  fromBelt: BeltLevel | 'none';
  fromStripes: number;
  toBelt: BeltLevel;
  toStripes: number;
  createdAt: string;
  source: 'user_edit' | 'onboarding' | 'import';
  dateEstimated?: boolean;
  notes?: string;
}

// Re-export GymSelection for convenience
export type { GymSelection } from '../data/gyms';

// Generate a simple unique ID for local-first users
function generateUserId(): string {
  return 'user-' + crypto.randomUUID();
}

// Profile data structure
export interface UserProfile {
  // User identification
  userId: string;

  // Critical (required during onboarding)
  name: string;
  belt: BeltLevel;
  stripes: number;  // Now required at onboarding (0-4)
  gym: GymSelection | null;  // Now required at onboarding
  targetFrequency: number;  // Now required at onboarding (sessions per week)
  loggingPreference: LoggingPreference;

  // Optional at onboarding (captured via progressive profiling if skipped)
  trainingGoals: TrainingGoal[];
  experienceLevel: ExperienceLevel | null;

  // Progressive profiling data (collected over time)
  trainingStartDate: string | null; // ISO date string
  currentBeltDate: string | null; // ISO date string
  birthYear: number | null;
  birthDate: string | null;  // Full ISO date for birthday celebrations
  gender: Gender | null;     // For gender-specific insights (locked after set)
  beltHistory: BeltProgressionEvent[];  // Belt progression events
  notifications: NotificationSettings;  // Notification preferences
  notificationsEnabled: boolean | null;

  // Metadata
  onboardingComplete: boolean;
  sessionCount: number;
  createdAt: string;
  lastSessionAt: string | null;

  // Skip tracking (stop asking after 3 skips)
  skipCounts: {
    trainingStartDate: number;
    currentBeltDate: number;
    trainingGoals: number;
    experienceLevel: number;
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
    id: 'experienceLevel',
    sessionTrigger: 3,
    question: "How long have you been training?",
    subtitle: "This helps us personalize your experience.",
    type: 'chips',
    options: [
      { value: 'new', label: 'Brand new' },
      { value: 'beginner', label: '< 1 year' },
      { value: 'intermediate', label: '1-3 years' },
      { value: 'experienced', label: '3+ years' },
    ],
    unlocks: "Experience-appropriate content and pacing",
  },
  {
    id: 'trainingStartDate',
    sessionTrigger: 5,
    question: "When did you start training?",
    subtitle: "This helps us calculate your time on the mat.",
    type: 'date',
    unlocks: "Time-in-grade tracking and 'X years training' stats",
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
      { value: 'hobby', label: 'Hobby' },
      { value: 'mental', label: 'Mental game' },
      { value: 'self-defense', label: 'Self-defense' },
      { value: 'community', label: 'Community' },
    ],
    unlocks: "Personalized prompts and goal-aware messaging",
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
  userId: generateUserId(),
  name: '',
  belt: 'white',
  stripes: 0,
  gym: null,
  targetFrequency: 3,
  loggingPreference: 'undecided',
  trainingGoals: [],
  experienceLevel: null,
  trainingStartDate: null,
  currentBeltDate: null,
  birthYear: null,
  birthDate: null,
  gender: null,
  beltHistory: [],
  notifications: {
    trainingReminders: true,
    progressUpdates: true,
    coachFeedback: true,
  },
  notificationsEnabled: null,
  onboardingComplete: false,
  sessionCount: 0,
  createdAt: new Date().toISOString(),
  lastSessionAt: null,
  skipCounts: {
    trainingStartDate: 0,
    currentBeltDate: 0,
    trainingGoals: 0,
    experienceLevel: 0,
    birthYear: 0,
  },
  lastAskedSession: {},
};

// Onboarding data type
export interface OnboardingData {
  name: string;
  belt: BeltLevel;
  stripes: number;
  gender: Gender;
  birthDate: string; // ISO date string
  gym: GymSelection;
  targetFrequency: number;
  loggingPreference: 'voice' | 'text';
  trainingGoals?: TrainingGoal[];
  experienceLevel?: ExperienceLevel;
}

// Context type
interface UserProfileContextType {
  profile: UserProfile;
  isLoading: boolean;

  // Onboarding
  completeOnboarding: (data: OnboardingData) => void;

  // Profile updates
  updateProfile: (updates: Partial<UserProfile>) => void;
  setLoggingPreference: (pref: LoggingPreference) => void;
  updateNotifications: (updates: Partial<NotificationSettings>) => void;

  // Session tracking
  incrementSessionCount: () => void;

  // Progressive profiling
  getNextNudgeQuestion: () => ProfileQuestion | null;
  skipQuestion: (questionId: keyof UserProfile['skipCounts']) => void;
  answerQuestion: (questionId: string, value: unknown) => void;

  // Profile completion
  getProfileCompletion: () => number;
  getMissingFields: () => string[];

  // Belt history
  addBeltEvent: (event: Omit<BeltProgressionEvent, 'id' | 'createdAt'>) => void;
  getBeltHistory: () => BeltProgressionEvent[];

  // Reset (for testing)
  resetProfile: () => void;

  // Demo mode - for prototype approval
  isDemoMode: boolean;
  activeDemoProfile: DemoProfile | null;
  switchDemoProfile: (belt: ActiveProfileKey) => void;
  exitDemoMode: () => void;

  // Persona mode - enhanced demo with 6 personas
  activePersona: Persona | null;
  switchPersona: (personaKey: PersonaKey) => void;
  cycleToNextPersona: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | null>(null);

const STORAGE_KEY = 'bjj-user-profile';
const DEMO_MODE_KEY = 'bjj-demo-mode';
const BELT_HISTORY_KEY = 'bjj-belt-history';

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  // Demo mode state
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeDemoProfile, setActiveDemoProfile] = useState<DemoProfile | null>(null);
  const [activePersona, setActivePersona] = useState<Persona | null>(null);

  // Load profile from localStorage on mount
  useEffect(() => {
    // Check for demo mode first
    const demoModeStored = localStorage.getItem(DEMO_MODE_KEY);
    if (demoModeStored) {
      try {
        const parsed = JSON.parse(demoModeStored);
        const { enabled, belt, persona } = parsed;

        // Handle new persona format
        if (enabled && persona) {
          const personaProfile = getPersonaByKey(persona);
          setActivePersona(personaProfile);
          setActiveDemoProfile(personaProfile);
          setProfile(personaProfile.contextProfile);
          setIsDemoMode(true);
          setIsLoading(false);
          return;
        }

        // Handle legacy belt format
        if (enabled && belt) {
          const demoProfile = getProfileByBelt(belt);
          setActiveDemoProfile(demoProfile);
          setProfile(demoProfile.contextProfile);
          setIsDemoMode(true);
          setIsLoading(false);
          return;
        }
      } catch {
        console.error('Failed to parse demo mode settings');
      }
    }

    // Normal profile loading
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Ensure existing users without a userId get a stable one
        const userId = parsed.userId || generateUserId();
        setProfile({ ...DEFAULT_PROFILE, ...parsed, userId });
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

  // Complete onboarding with all mandatory + optional data
  const completeOnboarding = (data: OnboardingData) => {
    setProfile(prev => ({
      ...prev,
      name: data.name,
      belt: data.belt,
      stripes: data.stripes,
      gender: data.gender,
      birthDate: data.birthDate,
      gym: data.gym,
      targetFrequency: data.targetFrequency,
      loggingPreference: data.loggingPreference,
      trainingGoals: data.trainingGoals || [],
      experienceLevel: data.experienceLevel || null,
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
      // Mandatory fields from onboarding
      profile.name,
      profile.belt,
      profile.stripes !== null,
      profile.gym !== null,
      profile.targetFrequency !== null,
      profile.loggingPreference !== 'undecided',
      // Optional/progressive fields
      profile.trainingGoals.length > 0,
      profile.experienceLevel !== null,
      profile.trainingStartDate,
      profile.currentBeltDate,
      profile.birthYear,
      profile.gender !== null,
      profile.birthDate !== null,
    ];

    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  // Get list of missing fields
  const getMissingFields = (): string[] => {
    const missing: string[] = [];

    if (profile.trainingGoals.length === 0) missing.push('Training goals');
    if (profile.experienceLevel === null) missing.push('Experience level');
    if (!profile.trainingStartDate) missing.push('Training start date');
    if (!profile.currentBeltDate) missing.push('Current belt date');
    if (profile.birthYear === null) missing.push('Birth year');
    if (profile.gender === null) missing.push('Gender');
    if (profile.birthDate === null) missing.push('Birthday');

    return missing;
  };

  // Update notification settings
  const updateNotifications = (updates: Partial<NotificationSettings>) => {
    setProfile(prev => ({
      ...prev,
      notifications: { ...prev.notifications, ...updates },
    }));
  };

  // Add a belt progression event
  const addBeltEvent = (event: Omit<BeltProgressionEvent, 'id' | 'createdAt'>) => {
    const newEvent: BeltProgressionEvent = {
      ...event,
      id: `belt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    setProfile(prev => {
      const updatedHistory = [...prev.beltHistory, newEvent].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const updated = {
        ...prev,
        beltHistory: updatedHistory,
        belt: newEvent.toBelt,
        stripes: newEvent.toStripes,
      };

      // Also persist belt history separately for quick access
      localStorage.setItem(BELT_HISTORY_KEY, JSON.stringify(updatedHistory));

      return updated;
    });
  };

  // Get belt history, initializing from onboarding data if empty
  const getBeltHistory = (): BeltProgressionEvent[] => {
    if (profile.beltHistory.length > 0) return profile.beltHistory;

    // Try loading from dedicated storage
    try {
      const stored = localStorage.getItem(BELT_HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as BeltProgressionEvent[];
        if (parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore parse errors
    }

    // Initialize from onboarding data if available
    if (profile.onboardingComplete && profile.beltHistory.length === 0) {
      const initialEvents: BeltProgressionEvent[] = [];

      // Create "Started Training" event
      const startDate = profile.trainingStartDate || profile.createdAt;
      initialEvents.push({
        id: `belt-init-start`,
        date: startDate,
        type: 'belt_promotion',
        fromBelt: 'none',
        fromStripes: 0,
        toBelt: 'white',
        toStripes: 0,
        createdAt: new Date().toISOString(),
        source: 'onboarding',
        dateEstimated: !profile.trainingStartDate,
        notes: 'Started Training',
      });

      // If current belt is not white, create a promotion event
      if (profile.belt !== 'white' || profile.stripes > 0) {
        const beltDate = profile.currentBeltDate || profile.createdAt;
        initialEvents.push({
          id: `belt-init-current`,
          date: beltDate,
          type: profile.belt !== 'white' ? 'belt_promotion' : 'stripe_promotion',
          fromBelt: 'white',
          fromStripes: 0,
          toBelt: profile.belt,
          toStripes: profile.stripes,
          createdAt: new Date().toISOString(),
          source: 'onboarding',
          dateEstimated: !profile.currentBeltDate,
        });
      }

      // Persist and update state
      if (initialEvents.length > 0) {
        localStorage.setItem(BELT_HISTORY_KEY, JSON.stringify(initialEvents));
        setProfile(prev => ({ ...prev, beltHistory: initialEvents }));
      }

      return initialEvents;
    }

    return [];
  };

  // Reset profile (for testing)
  const resetProfile = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DEMO_MODE_KEY);
    localStorage.removeItem(BELT_HISTORY_KEY);
    setProfile(DEFAULT_PROFILE);
    setIsDemoMode(false);
    setActiveDemoProfile(null);
    setActivePersona(null);
  };

  // Switch to a demo profile (for prototype approval) - legacy 4-belt system
  const switchDemoProfile = (belt: ActiveProfileKey) => {
    const demoProfile = getProfileByBelt(belt);
    setActiveDemoProfile(demoProfile);
    setActivePersona(null); // Clear persona when using legacy belt switch
    setProfile(demoProfile.contextProfile);
    setIsDemoMode(true);
    localStorage.setItem(DEMO_MODE_KEY, JSON.stringify({ enabled: true, belt }));
  };

  // Switch to a persona (enhanced 6-persona system)
  const switchPersona = (personaKey: PersonaKey) => {
    const persona = getPersonaByKey(personaKey);
    setActivePersona(persona);
    setActiveDemoProfile(persona); // Also set as demo profile for backward compatibility
    setProfile(persona.contextProfile);
    setIsDemoMode(true);
    localStorage.setItem(DEMO_MODE_KEY, JSON.stringify({ enabled: true, persona: personaKey }));

    // Seed insight tracking data for demo personas
    // Only white-at-risk has no session data (to show empty state)
    const INSIGHT_STORAGE_KEY = 'bjj-insight-tracking';
    if (personaKey === 'white-at-risk') {
      // Clear insight tracking to show "no session" state
      localStorage.removeItem(INSIGHT_STORAGE_KEY);
    } else {
      // Seed with session data so insights can be generated
      // Use yesterday's date so a new insight will generate on first view
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      localStorage.setItem(INSIGHT_STORAGE_KEY, JSON.stringify({
        lastInsightDate: null, // No insight generated yet
        lastSessionDate: yesterdayStr, // Session logged yesterday
        todaysInsight: null,
      }));
    }
  };

  // Cycle to the next persona in the list (wraps around)
  const cycleToNextPersona = () => {
    // Find current index, default to -1 if not in demo mode
    const currentIndex = activePersona
      ? personas.findIndex(p => p.key === activePersona.key)
      : -1;

    // Get next index, wrapping around to 0 if at end
    const nextIndex = (currentIndex + 1) % personas.length;
    const nextPersona = personas[nextIndex];

    switchPersona(nextPersona.key);
  };

  // Exit demo mode and return to normal profile
  const exitDemoMode = () => {
    localStorage.removeItem(DEMO_MODE_KEY);
    setIsDemoMode(false);
    setActiveDemoProfile(null);
    setActivePersona(null);

    // Reload the real profile
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const userId = parsed.userId || generateUserId();
        setProfile({ ...DEFAULT_PROFILE, ...parsed, userId });
      } catch {
        setProfile(DEFAULT_PROFILE);
      }
    } else {
      setProfile(DEFAULT_PROFILE);
    }
  };

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        isLoading,
        completeOnboarding,
        updateProfile,
        setLoggingPreference,
        updateNotifications,
        incrementSessionCount,
        getNextNudgeQuestion,
        skipQuestion,
        answerQuestion,
        getProfileCompletion,
        getMissingFields,
        addBeltEvent,
        getBeltHistory,
        resetProfile,
        isDemoMode,
        activeDemoProfile,
        switchDemoProfile,
        exitDemoMode,
        activePersona,
        switchPersona,
        cycleToNextPersona,
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
