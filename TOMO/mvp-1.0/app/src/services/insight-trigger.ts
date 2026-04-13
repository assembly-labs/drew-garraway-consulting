/**
 * Insight Generation Trigger
 *
 * Shared service that fires after a session is saved. Background, non-blocking.
 * Extracted from SessionLoggerScreen so it can be reused by any screen that
 * saves a session.
 */

import { sessionService } from './supabase';
import { insightService, insightGenerationService } from './insights-service';
import { buildWeeklyInput, getWeekBounds, toDateString, type ProfileContext } from './insights-engine';
import type { Profile } from '../types/mvp-types';
import type { WeeklyInsightOutputV2 } from '../types/insights-types';

// ============================================
// INSIGHT GENERATION TRIGGER
// Fires after session save. Background, non-blocking.
// ============================================

export async function maybeTriggerWeeklyInsight(profile: Profile | null): Promise<void> {
  if (!profile) return;

  // Check if weekly insight already exists for this week
  const { start } = getWeekBounds(new Date());
  const exists = await insightService.existsForPeriod('weekly', start);
  if (exists) return;

  // Build input from all sessions + profile
  const allSessions = await sessionService.list();
  const profileCtx: ProfileContext = {
    name: profile.name,
    belt: profile.belt,
    stripes: profile.stripes,
    targetFrequency: profile.target_frequency,
    trainingGoals: profile.training_goals,
    experienceLevel: profile.experience_level,
    gymName: profile.gym_name,
    birthDate: profile.birth_date,
    gender: profile.gender,
  };

  const input = buildWeeklyInput(
    allSessions,
    profileCtx,
    '', // UCD text (empty for now, Phase 2)
    null, // monthly context (Phase 2)
    null, // quarterly priorities (Phase 3)
  );

  // Only generate if there's at least 1 session this week
  if (input.sessionsThisWeek < 1) return;

  // ENH-02 + ENH-03: Fetch the most recent prior weekly insight for focusNext and lens
  const lastWeeklyInsight = await insightService.getLatest('weekly');
  let lastFocusNext: string | null = null;
  let lastLens: string | null = null;
  if (lastWeeklyInsight) {
    const data = lastWeeklyInsight.insight_data as unknown as WeeklyInsightOutputV2 & { lens?: string };
    if (data?.focusNext) lastFocusNext = data.focusNext;
    if (data?.lens) lastLens = data.lens;
  }

  // ENH-06: Compute days since last session (across all sessions, not just this week)
  let daysSinceLastSession: number | undefined;
  const activeSessions = allSessions.filter((s) => s.deleted_at === null);
  if (activeSessions.length > 1) {
    // Sort descending by date, skip the one just saved (most recent) — use second-most-recent
    const sorted = [...activeSessions].sort((a, b) => b.date.localeCompare(a.date));
    if (sorted.length >= 2) {
      const previousDate = sorted[1].date;
      const today = toDateString(new Date());
      const msPerDay = 1000 * 60 * 60 * 24;
      daysSinceLastSession = Math.floor(
        (new Date(today).getTime() - new Date(previousDate).getTime()) / msPerDay
      );
    }
  }

  // Fire generation with enhanced input
  await insightGenerationService.generateWeekly({
    ...input,
    lastFocusNext,
    lastLens,
    daysSinceLastSession,
  } as any);
}
