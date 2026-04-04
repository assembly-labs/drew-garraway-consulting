/**
 * Insights Screen — Helper functions.
 *
 * Extracted from InsightsScreen.tsx. Pure utility functions shared across
 * all insights sub-components.
 */

import type { Insight, InsightType, WeeklyInsightOutputV2 } from '../../types/insights-types';

// ===========================================
// COMPATIBILITY LAYER
// Normalizes old and new weekly insight_data shapes into V2 format.
// ===========================================

export function normalizeInsightData(data: any): WeeklyInsightOutputV2 {
  // New format already has paragraphs
  if (data && data.paragraphs) return data as WeeklyInsightOutputV2;

  // Old format — convert insights array to paragraphs
  if (data && data.insights) {
    return {
      paragraphs: (data.insights as Array<{ type: InsightType; title: string; body: string }>).map((i) => ({
        text: i.body,
        isWatch: i.type === 'risk',
        defer: i.type === 'risk' ? 'Worth talking to your coach about this.' : undefined,
      })),
      focusNext: data.focusNext ?? '',
    };
  }

  return { paragraphs: [], focusNext: '' };
}

// ===========================================
// HELPERS
// ===========================================

export function formatWeekRange(periodStart: string, periodEnd: string): string {
  const start = new Date(periodStart + 'T00:00:00');
  const end = new Date(periodEnd + 'T00:00:00');
  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${startStr} - ${endStr}`;
}

export function formatPeriodLabel(insight: Insight): string {
  const start = new Date(insight.period_start + 'T00:00:00');
  const end = new Date(insight.period_end + 'T00:00:00');

  if (insight.tier === 'quarterly') {
    const month = start.getMonth();
    const quarter = Math.floor(month / 3) + 1;
    return `Q${quarter} ${start.getFullYear()}`;
  }

  if (insight.tier === 'monthly') {
    return start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${startStr} - ${endStr}`;
}

export function getMonthKey(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
}

export function getMonthSortKey(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00').getTime();
}
