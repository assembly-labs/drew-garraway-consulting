/**
 * TOMO — Journal Helper Utilities
 *
 * Date grouping for the Journal list view and AI narrative summary
 * generator for the Session Detail screen.
 *
 * USAGE:
 *   import { groupSessionsByDate, generateNarrativeSummary } from '@/utils/journal-helpers';
 *
 *   // Group sessions for the journal list
 *   const grouped = groupSessionsByDate(sessions);
 *   // Returns: [{ label: 'Today', sessions: [...] }, { label: 'This Week', sessions: [...] }, ...]
 *
 *   // Generate a narrative summary for session detail
 *   const summary = generateNarrativeSummary(session);
 *   // Returns: "90-minute gi class. Drilled knee slice passing. Sparred 3 rounds — landed an armbar, got caught in a triangle. Shoulder is a bit sore."
 */

import type { Session, Submission } from '../types/mvp-types';

// ===========================================
// DATE GROUPING
// ===========================================

interface SessionGroup {
  label: string;
  sessions: Session[];
}

/**
 * Groups sessions into display categories: Today, Yesterday, This Week, This Month, Earlier.
 * Sessions should already be sorted newest-first.
 */
export function groupSessionsByDate(sessions: Session[]): SessionGroup[] {
  const now = new Date();
  const today = stripTime(now);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Start of this week (Monday)
  const weekStart = new Date(today);
  const dayOfWeek = today.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  weekStart.setDate(weekStart.getDate() - daysToMonday);

  // Start of this month
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const groups: Record<string, Session[]> = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    'This Month': [],
    Earlier: [],
  };

  for (const session of sessions) {
    const sessionDate = stripTime(new Date(session.date + 'T00:00:00'));

    if (sessionDate.getTime() === today.getTime()) {
      groups['Today'].push(session);
    } else if (sessionDate.getTime() === yesterday.getTime()) {
      groups['Yesterday'].push(session);
    } else if (sessionDate >= weekStart) {
      groups['This Week'].push(session);
    } else if (sessionDate >= monthStart) {
      groups['This Month'].push(session);
    } else {
      groups['Earlier'].push(session);
    }
  }

  // Only return groups that have sessions
  return Object.entries(groups)
    .filter(([, sessions]) => sessions.length > 0)
    .map(([label, sessions]) => ({ label, sessions }));
}

/** Strip time component from a Date, keeping only year/month/day */
function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// ===========================================
// NARRATIVE SUMMARY GENERATOR
// ===========================================

/**
 * Generates a natural language recap from session fields.
 * This runs client-side — no LLM needed.
 *
 * Examples:
 * - "90-minute gi class. Drilled knee slice passing. Sparred 3 rounds — landed an armbar, got caught in a triangle."
 * - "60-minute no-gi open mat. 5 rounds of rolling. Worked on back escapes and felt solid."
 * - "2-hour competition. Hit a double leg and a guillotine."
 */
export function generateNarrativeSummary(session: Session): string {
  const parts: string[] = [];

  // Duration + mode + kind
  const durationStr = formatDuration(session.duration_minutes);
  const modeStr = formatMode(session.training_mode);
  const kindStr = formatKind(session.session_kind);
  parts.push(`${durationStr} ${modeStr} ${kindStr}.`);

  // Lesson topic
  if (session.lesson_topic) {
    parts.push(`Worked on ${session.lesson_topic}.`);
  }

  // Techniques drilled
  const techniques = session.techniques_drilled ?? [];
  if (techniques.length > 0) {
    const techStr = listToNaturalLanguage(techniques);
    parts.push(`Drilled ${techStr}.`);
  }

  // Sparring
  if (session.did_spar) {
    const sparParts: string[] = [];

    if (session.sparring_rounds) {
      sparParts.push(`${session.sparring_rounds} round${session.sparring_rounds !== 1 ? 's' : ''}`);
    } else {
      sparParts.push('Sparred');
    }

    const subParts: string[] = [];
    const subsGiven = session.submissions_given ?? [];
    const subsReceived = session.submissions_received ?? [];
    if (subsGiven.length > 0) {
      const subStr = formatSubmissions(subsGiven, 'landed');
      subParts.push(subStr);
    }
    if (subsReceived.length > 0) {
      const subStr = formatSubmissions(subsReceived, 'caught');
      subParts.push(subStr);
    }

    if (session.sparring_rounds && subParts.length > 0) {
      parts.push(`Sparred ${sparParts[0]} — ${subParts.join(', ')}.`);
    } else if (session.sparring_rounds) {
      parts.push(`Sparred ${sparParts[0]}.`);
    } else if (subParts.length > 0) {
      parts.push(`Sparred — ${subParts.join(', ')}.`);
    } else {
      parts.push('Sparred.');
    }
  }

  // Injuries
  const injuries = session.injuries ?? [];
  if (injuries.length > 0) {
    const str = listToNaturalLanguage(injuries);
    parts.push(`Note: ${str}.`);
  }

  return parts.join(' ');
}

// ===========================================
// FORMATTING HELPERS
// ===========================================

function formatDuration(minutes: number): string {
  if (minutes >= 120) return `${minutes / 60}-hour`;
  if (minutes === 90) return '90-minute';
  if (minutes === 60) return '60-minute';
  return `${minutes}-minute`;
}

function formatMode(mode: string): string {
  switch (mode) {
    case 'gi': return 'gi';
    case 'nogi': return 'no-gi';
    case 'other': return 'other';
    default: return '';
  }
}

function formatKind(kind: string): string {
  switch (kind) {
    case 'class': return 'class';
    case 'open_mat': return 'open mat';
    case 'competition_training': return 'comp training';
    case 'other': return 'session';
    default: return 'session';
  }
}

function formatSubmissions(subs: Submission[], verb: 'landed' | 'caught'): string {
  const parts = subs.map(s => {
    if (s.count === 1) return `${verb === 'landed' ? 'landed' : 'got caught in'} a ${s.type}`;
    return `${verb === 'landed' ? 'landed' : 'got caught in'} ${s.count} ${s.type}s`;
  });
  return parts.join(', ');
}

function listToNaturalLanguage(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

