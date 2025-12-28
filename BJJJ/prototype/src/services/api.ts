/**
 * API Service Layer
 *
 * Abstraction layer for data operations. Currently uses localStorage,
 * but designed to swap to Supabase with minimal changes.
 *
 * Usage:
 *   import { api } from '@/services/api';
 *   const sessions = await api.sessions.list();
 *
 * When migrating to Supabase:
 *   1. Update the implementation in each service
 *   2. No changes needed in components
 */

import type {
  Profile,
  ProfileInsert,
  ProfileUpdate,
  Session,
  SessionInsert,
  SessionUpdate,
  SessionFilters,
  TechniqueProgress,
  TechniqueProgressInsert,
  TechniqueProgressUpdate,
  ApiResponse,
  UserStats,
  SubmissionRecord,
  SubmissionInsert,
  SubmissionStats,
  BeltLevel,
} from '../types/database';
import { getBodyRegion } from '../types/database';

// ===========================================
// STORAGE KEYS
// ===========================================

const STORAGE_KEYS = {
  PROFILE: 'bjj-user-profile',
  SESSIONS: 'bjj-sessions',
  TECHNIQUE_PROGRESS: 'bjj-technique-progress',
  SUBMISSIONS: 'bjj-submissions',
} as const;

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function generateId(): string {
  return crypto.randomUUID();
}

function getTimestamp(): string {
  return new Date().toISOString();
}

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    console.error(`Failed to read ${key} from storage`);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save ${key} to storage`, error);
  }
}

// ===========================================
// PROFILE SERVICE
// ===========================================

const profileService = {
  async get(): Promise<ApiResponse<Profile>> {
    const profile = getFromStorage<Profile | null>(STORAGE_KEYS.PROFILE, null);
    return { data: profile, error: null };
  },

  async create(data: ProfileInsert): Promise<ApiResponse<Profile>> {
    const now = getTimestamp();
    const profile: Profile = {
      id: data.id,
      name: data.name,
      belt_level: data.belt_level || 'white',
      stripes: data.stripes || 0,
      gym_name: data.gym_name || null,
      training_start_date: data.training_start_date || null,
      target_frequency: data.target_frequency || null,
      logging_preference: data.logging_preference || 'undecided',
      onboarding_complete: data.onboarding_complete || false,
      session_count: data.session_count || 0,
      created_at: now,
      updated_at: now,
    };
    saveToStorage(STORAGE_KEYS.PROFILE, profile);
    return { data: profile, error: null };
  },

  async update(data: ProfileUpdate): Promise<ApiResponse<Profile>> {
    const existing = getFromStorage<Profile | null>(STORAGE_KEYS.PROFILE, null);
    if (!existing) {
      return { data: null, error: { message: 'Profile not found', code: 'NOT_FOUND' } };
    }
    const updated: Profile = {
      ...existing,
      ...data,
      updated_at: getTimestamp(),
    };
    saveToStorage(STORAGE_KEYS.PROFILE, updated);
    return { data: updated, error: null };
  },

  async delete(): Promise<ApiResponse<null>> {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    return { data: null, error: null };
  },
};

// ===========================================
// SESSIONS SERVICE
// ===========================================

const sessionsService = {
  async list(filters?: SessionFilters): Promise<ApiResponse<Session[]>> {
    let sessions = getFromStorage<Session[]>(STORAGE_KEYS.SESSIONS, []);

    // Apply filters
    if (filters) {
      if (filters.startDate) {
        sessions = sessions.filter(s => s.date >= filters.startDate!);
      }
      if (filters.endDate) {
        sessions = sessions.filter(s => s.date <= filters.endDate!);
      }
      if (filters.trainingType) {
        sessions = sessions.filter(s => s.training_type === filters.trainingType);
      }
    }

    // Sort by date descending (most recent first)
    sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Apply pagination
    if (filters?.offset) {
      sessions = sessions.slice(filters.offset);
    }
    if (filters?.limit) {
      sessions = sessions.slice(0, filters.limit);
    }

    return { data: sessions, error: null };
  },

  async get(id: string): Promise<ApiResponse<Session>> {
    const sessions = getFromStorage<Session[]>(STORAGE_KEYS.SESSIONS, []);
    const session = sessions.find(s => s.id === id);
    if (!session) {
      return { data: null, error: { message: 'Session not found', code: 'NOT_FOUND' } };
    }
    return { data: session, error: null };
  },

  async create(data: SessionInsert): Promise<ApiResponse<Session>> {
    const sessions = getFromStorage<Session[]>(STORAGE_KEYS.SESSIONS, []);
    const now = getTimestamp();
    const session: Session = {
      id: generateId(),
      user_id: data.user_id,
      date: data.date,
      time: data.time || null,
      training_type: data.training_type,
      duration_minutes: data.duration_minutes || null,
      lesson_topic: data.lesson_topic || null,
      techniques_drilled: data.techniques_drilled || [],
      did_spar: data.did_spar ?? false,
      sparring_rounds: data.sparring_rounds || null,
      techniques: data.techniques || [],
      worked_well: data.worked_well || [],
      struggles: data.struggles || [],
      notes: data.notes || null,
      voice_transcript: data.voice_transcript || null,
      created_at: now,
      updated_at: now,
    };
    sessions.push(session);
    saveToStorage(STORAGE_KEYS.SESSIONS, sessions);

    // Increment session count in profile
    await profileService.update({
      session_count: sessions.length,
    });

    return { data: session, error: null };
  },

  async update(id: string, data: SessionUpdate): Promise<ApiResponse<Session>> {
    const sessions = getFromStorage<Session[]>(STORAGE_KEYS.SESSIONS, []);
    const index = sessions.findIndex(s => s.id === id);
    if (index === -1) {
      return { data: null, error: { message: 'Session not found', code: 'NOT_FOUND' } };
    }
    const updated: Session = {
      ...sessions[index],
      ...data,
      updated_at: getTimestamp(),
    };
    sessions[index] = updated;
    saveToStorage(STORAGE_KEYS.SESSIONS, sessions);
    return { data: updated, error: null };
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    const sessions = getFromStorage<Session[]>(STORAGE_KEYS.SESSIONS, []);
    const filtered = sessions.filter(s => s.id !== id);
    if (filtered.length === sessions.length) {
      return { data: null, error: { message: 'Session not found', code: 'NOT_FOUND' } };
    }
    saveToStorage(STORAGE_KEYS.SESSIONS, filtered);
    return { data: null, error: null };
  },

  async getStats(userId: string): Promise<ApiResponse<UserStats>> {
    const sessions = getFromStorage<Session[]>(STORAGE_KEYS.SESSIONS, [])
      .filter(s => s.user_id === userId);

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    const totalSparringRounds = sessions.reduce((sum, s) => sum + (s.sparring_rounds || 0), 0);
    const sessionsThisWeek = sessions.filter(s => new Date(s.date) >= weekAgo).length;
    const sessionsThisMonth = sessions.filter(s => new Date(s.date) >= monthAgo).length;

    // Calculate streaks
    const dates = [...new Set(sessions.map(s => s.date))].sort().reverse();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < dates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
        const sessionDate = new Date(dates[i]);
        const daysDiff = Math.floor((now.getTime() - sessionDate.getTime()) / (24 * 60 * 60 * 1000));
        if (daysDiff <= 7) currentStreak = 1;
      } else {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        const diff = Math.floor((prev.getTime() - curr.getTime()) / (24 * 60 * 60 * 1000));
        if (diff <= 7) {
          tempStreak++;
          if (i < 7) currentStreak = tempStreak;
        } else {
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    // Count techniques
    const techniqueCount: Record<string, number> = {};
    sessions.forEach(s => {
      s.techniques.forEach(t => {
        techniqueCount[t] = (techniqueCount[t] || 0) + 1;
      });
    });
    const mostPracticedTechniques = Object.entries(techniqueCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    const stats: UserStats = {
      totalSessions: sessions.length,
      totalMinutes,
      totalSparringRounds,
      currentStreak,
      longestStreak,
      sessionsThisWeek,
      sessionsThisMonth,
      averageSessionDuration: sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0,
      mostPracticedTechniques,
      recentActivity: sessions.slice(0, 5),
    };

    return { data: stats, error: null };
  },
};

// ===========================================
// TECHNIQUE PROGRESS SERVICE
// ===========================================

const techniqueProgressService = {
  async list(userId: string): Promise<ApiResponse<TechniqueProgress[]>> {
    const progress = getFromStorage<TechniqueProgress[]>(STORAGE_KEYS.TECHNIQUE_PROGRESS, [])
      .filter(p => p.user_id === userId);
    return { data: progress, error: null };
  },

  async get(userId: string, techniqueId: string): Promise<ApiResponse<TechniqueProgress>> {
    const progress = getFromStorage<TechniqueProgress[]>(STORAGE_KEYS.TECHNIQUE_PROGRESS, []);
    const found = progress.find(p => p.user_id === userId && p.technique_id === techniqueId);
    if (!found) {
      return { data: null, error: { message: 'Progress not found', code: 'NOT_FOUND' } };
    }
    return { data: found, error: null };
  },

  async upsert(data: TechniqueProgressInsert): Promise<ApiResponse<TechniqueProgress>> {
    const allProgress = getFromStorage<TechniqueProgress[]>(STORAGE_KEYS.TECHNIQUE_PROGRESS, []);
    const existingIndex = allProgress.findIndex(
      p => p.user_id === data.user_id && p.technique_id === data.technique_id
    );

    const now = getTimestamp();

    if (existingIndex >= 0) {
      // Update existing
      const updated: TechniqueProgress = {
        ...allProgress[existingIndex],
        ...data,
        updated_at: now,
      };
      allProgress[existingIndex] = updated;
      saveToStorage(STORAGE_KEYS.TECHNIQUE_PROGRESS, allProgress);
      return { data: updated, error: null };
    } else {
      // Create new
      const newProgress: TechniqueProgress = {
        id: generateId(),
        user_id: data.user_id,
        technique_id: data.technique_id,
        proficiency: data.proficiency || 'learning',
        times_drilled: data.times_drilled || 0,
        times_used_live: data.times_used_live || 0,
        success_rate: data.success_rate || null,
        notes: data.notes || null,
        last_practiced: data.last_practiced || null,
        created_at: now,
        updated_at: now,
      };
      allProgress.push(newProgress);
      saveToStorage(STORAGE_KEYS.TECHNIQUE_PROGRESS, allProgress);
      return { data: newProgress, error: null };
    }
  },

  async update(id: string, data: TechniqueProgressUpdate): Promise<ApiResponse<TechniqueProgress>> {
    const allProgress = getFromStorage<TechniqueProgress[]>(STORAGE_KEYS.TECHNIQUE_PROGRESS, []);
    const index = allProgress.findIndex(p => p.id === id);
    if (index === -1) {
      return { data: null, error: { message: 'Progress not found', code: 'NOT_FOUND' } };
    }
    const updated: TechniqueProgress = {
      ...allProgress[index],
      ...data,
      updated_at: getTimestamp(),
    };
    allProgress[index] = updated;
    saveToStorage(STORAGE_KEYS.TECHNIQUE_PROGRESS, allProgress);
    return { data: updated, error: null };
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    const allProgress = getFromStorage<TechniqueProgress[]>(STORAGE_KEYS.TECHNIQUE_PROGRESS, []);
    const filtered = allProgress.filter(p => p.id !== id);
    saveToStorage(STORAGE_KEYS.TECHNIQUE_PROGRESS, filtered);
    return { data: null, error: null };
  },
};

// ===========================================
// SUBMISSIONS SERVICE
// ===========================================

const submissionsService = {
  async list(userId: string): Promise<ApiResponse<SubmissionRecord[]>> {
    const submissions = getFromStorage<SubmissionRecord[]>(STORAGE_KEYS.SUBMISSIONS, [])
      .filter(s => s.user_id === userId);
    return { data: submissions, error: null };
  },

  async listBySession(sessionId: string): Promise<ApiResponse<SubmissionRecord[]>> {
    const submissions = getFromStorage<SubmissionRecord[]>(STORAGE_KEYS.SUBMISSIONS, [])
      .filter(s => s.session_id === sessionId);
    return { data: submissions, error: null };
  },

  async create(data: SubmissionInsert): Promise<ApiResponse<SubmissionRecord>> {
    const submissions = getFromStorage<SubmissionRecord[]>(STORAGE_KEYS.SUBMISSIONS, []);
    const now = getTimestamp();

    const submission: SubmissionRecord = {
      id: generateId(),
      session_id: data.session_id,
      user_id: data.user_id,
      technique_name: data.technique_name,
      outcome: data.outcome,
      body_region: getBodyRegion(data.technique_name),
      partner_belt: data.partner_belt || null,
      position: data.position || null,
      date: data.date,
      created_at: now,
    };

    submissions.push(submission);
    saveToStorage(STORAGE_KEYS.SUBMISSIONS, submissions);
    return { data: submission, error: null };
  },

  async createBatch(submissions: SubmissionInsert[]): Promise<ApiResponse<SubmissionRecord[]>> {
    const allSubmissions = getFromStorage<SubmissionRecord[]>(STORAGE_KEYS.SUBMISSIONS, []);
    const now = getTimestamp();

    const newRecords: SubmissionRecord[] = submissions.map(data => ({
      id: generateId(),
      session_id: data.session_id,
      user_id: data.user_id,
      technique_name: data.technique_name,
      outcome: data.outcome,
      body_region: getBodyRegion(data.technique_name),
      partner_belt: data.partner_belt || null,
      position: data.position || null,
      date: data.date,
      created_at: now,
    }));

    allSubmissions.push(...newRecords);
    saveToStorage(STORAGE_KEYS.SUBMISSIONS, allSubmissions);
    return { data: newRecords, error: null };
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    const submissions = getFromStorage<SubmissionRecord[]>(STORAGE_KEYS.SUBMISSIONS, []);
    const filtered = submissions.filter(s => s.id !== id);
    saveToStorage(STORAGE_KEYS.SUBMISSIONS, filtered);
    return { data: null, error: null };
  },

  async deleteBySession(sessionId: string): Promise<ApiResponse<null>> {
    const submissions = getFromStorage<SubmissionRecord[]>(STORAGE_KEYS.SUBMISSIONS, []);
    const filtered = submissions.filter(s => s.session_id !== sessionId);
    saveToStorage(STORAGE_KEYS.SUBMISSIONS, filtered);
    return { data: null, error: null };
  },

  /**
   * Get computed submission stats for a user
   * @param userId - User ID
   * @param userBelt - User's current belt (used to determine if achilles heel should be shown)
   */
  async getStats(userId: string, userBelt: BeltLevel): Promise<ApiResponse<SubmissionStats>> {
    const submissions = getFromStorage<SubmissionRecord[]>(STORAGE_KEYS.SUBMISSIONS, [])
      .filter(s => s.user_id === userId);

    const given = submissions.filter(s => s.outcome === 'given');
    const received = submissions.filter(s => s.outcome === 'received');

    // Count by technique
    const givenByTechnique: Record<string, number> = {};
    const receivedByTechnique: Record<string, number> = {};

    given.forEach(s => {
      givenByTechnique[s.technique_name] = (givenByTechnique[s.technique_name] || 0) + 1;
    });
    received.forEach(s => {
      receivedByTechnique[s.technique_name] = (receivedByTechnique[s.technique_name] || 0) + 1;
    });

    // Sort by count
    const givenSorted = Object.entries(givenByTechnique)
      .sort((a, b) => b[1] - a[1])
      .map(([technique, count]) => ({ technique, count }));

    const receivedSorted = Object.entries(receivedByTechnique)
      .sort((a, b) => b[1] - a[1])
      .map(([technique, count]) => ({ technique, count }));

    // Deadliest attack: only show if total given >= 50
    const totalGiven = given.length;
    const deadliestAttack = totalGiven >= 50 && givenSorted.length > 0
      ? { technique: givenSorted[0].technique, count: givenSorted[0].count }
      : null;

    // Achilles heel: only for white and blue belts
    const showAchillesHeel = userBelt === 'white' || userBelt === 'blue';
    const achillesHeel = showAchillesHeel && receivedSorted.length > 0
      ? { technique: receivedSorted[0].technique, count: receivedSorted[0].count }
      : null;

    // Body heat map
    const bodyHeatMap: SubmissionStats['bodyHeatMap'] = {
      given: { neck: 0, arms: 0, legs: 0 },
      received: { neck: 0, arms: 0, legs: 0 },
    };

    given.forEach(s => {
      bodyHeatMap.given[s.body_region]++;
    });
    received.forEach(s => {
      bodyHeatMap.received[s.body_region]++;
    });

    const stats: SubmissionStats = {
      totalGiven,
      totalReceived: received.length,
      deadliestAttack,
      achillesHeel,
      bodyHeatMap,
      techniqueBreakdown: {
        given: givenSorted,
        received: receivedSorted,
      },
    };

    return { data: stats, error: null };
  },
};

// ===========================================
// EXPORTED API
// ===========================================

export const api = {
  profile: profileService,
  sessions: sessionsService,
  techniqueProgress: techniqueProgressService,
  submissions: submissionsService,
};

// Export individual services for direct import if needed
export { profileService, sessionsService, techniqueProgressService, submissionsService };
