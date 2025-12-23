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
} from '../types/database';

// ===========================================
// STORAGE KEYS
// ===========================================

const STORAGE_KEYS = {
  PROFILE: 'bjj-user-profile',
  SESSIONS: 'bjj-sessions',
  TECHNIQUE_PROGRESS: 'bjj-technique-progress',
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
// EXPORTED API
// ===========================================

export const api = {
  profile: profileService,
  sessions: sessionsService,
  techniqueProgress: techniqueProgressService,
};

// Export individual services for direct import if needed
export { profileService, sessionsService, techniqueProgressService };
