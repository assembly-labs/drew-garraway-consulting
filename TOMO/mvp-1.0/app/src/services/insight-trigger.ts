/**
 * Insight Generation Trigger
 *
 * Shared service that fires after a session is saved. Background, non-blocking.
 * Extracted from SessionLoggerScreen so it can be reused by any screen that
 * saves a session.
 */

import { sessionService } from './supabase';
import { insightService, insightGenerationService } from './insights-service';
import { buildWeeklyInput, getWeekBounds, type ProfileContext } from './insights-engine';
import type { Profile } from '../types/mvp-types';

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

  // Fire generation
  await insightGenerationService.generateWeekly(input);
}
