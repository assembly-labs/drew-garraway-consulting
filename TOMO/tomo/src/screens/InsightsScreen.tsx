/**
 * Insights Screen — Tiered AI training insights (weekly/monthly/quarterly)
 *
 * Displays the user's generated insights grouped by tier:
 * - Quarterly card (gold border, premium feel)
 * - Monthly card (white border)
 * - Weekly cards grouped by month
 *
 * Empty states for 0 sessions, <5 sessions, and no weekly insights.
 * Coach deferral footer at bottom.
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius, typography, pressedStyles } from '../config/design-tokens';
import { insightService } from '../services/insights-service';
import { sessionService } from '../services/supabase';
import type {
  Insight,
  InsightType,
  WeeklyInsightOutput,
  MonthlyInsightOutput,
  QuarterlyInsightOutput,
} from '../types/insights-types';

// ===========================================
// TYPE BADGE COLORS
// ===========================================

const TYPE_BADGE_COLORS: Record<InsightType, { bg: string; text: string }> = {
  technique: { bg: colors.infoDim, text: colors.info },
  consistency: { bg: colors.goldDim, text: '#F5A623' },
  sparring: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e' },
  risk: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' },
  milestone: { bg: colors.goldDim, text: '#F5A623' },
  game_development: { bg: colors.purpleDim, text: colors.purple },
};

// ===========================================
// HELPERS
// ===========================================

function formatPeriodLabel(insight: Insight): string {
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

  // Weekly — show date range
  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${startStr} - ${endStr}`;
}

function getMonthKey(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
}

function getMonthSortKey(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00').getTime();
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

// ===========================================
// SKELETON
// ===========================================

function InsightsSkeleton() {
  return (
    <View style={styles.skeletonContainer}>
      {/* Quarterly skeleton */}
      <View style={[styles.skeletonCard, { borderLeftColor: colors.gold, borderLeftWidth: 3 }]}>
        <View style={[styles.skeletonBar, { width: 140, height: 12, marginBottom: 12 }]} />
        <View style={[styles.skeletonBar, { width: '80%', height: 16, marginBottom: 8 }]} />
        <View style={[styles.skeletonBar, { width: '60%', height: 14 }]} />
      </View>
      {/* Monthly skeleton */}
      <View style={[styles.skeletonCard, { borderLeftColor: colors.white, borderLeftWidth: 2 }]}>
        <View style={[styles.skeletonBar, { width: 120, height: 12, marginBottom: 12 }]} />
        <View style={[styles.skeletonBar, { width: '70%', height: 16, marginBottom: 8 }]} />
        <View style={[styles.skeletonBar, { width: '50%', height: 14 }]} />
      </View>
      {/* Weekly skeletons */}
      <View style={[styles.skeletonBar, { width: 100, height: 12, marginTop: spacing.lg, marginBottom: spacing.sm }]} />
      {[1, 2].map((i) => (
        <View key={i} style={[styles.skeletonCard, { marginBottom: spacing.sm }]}>
          <View style={[styles.skeletonBar, { width: '60%', height: 14, marginBottom: 8 }]} />
          <View style={[styles.skeletonBar, { width: '90%', height: 12, marginBottom: 6 }]} />
          <View style={[styles.skeletonBar, { width: '40%', height: 12 }]} />
        </View>
      ))}
    </View>
  );
}

// ===========================================
// PROGRESS INDICATOR
// ===========================================

function SessionProgressBar({ current, target }: { current: number; target: number }) {
  const pct = Math.min(current / target, 1);
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
      </View>
      <Text style={styles.progressLabel}>
        {current} / {target} sessions
      </Text>
    </View>
  );
}

// ===========================================
// QUARTERLY CARD
// ===========================================

function QuarterlyCard({
  insight,
  expanded,
  onToggle,
  isNew,
  onViewed,
}: {
  insight: Insight;
  expanded: boolean;
  onToggle: () => void;
  /** True if this insight has never been viewed — typewriter should play */
  isNew: boolean;
  /** Called once when the insight is first rendered as new */
  onViewed: () => void;
}) {
  const data = insight.insight_data as QuarterlyInsightOutput;
  const periodLabel = formatPeriodLabel(insight);

  // Mark as viewed on first render when new
  const hasTriggeredView = React.useRef(false);
  React.useEffect(() => {
    if (isNew && !hasTriggeredView.current) {
      hasTriggeredView.current = true;
      onViewed();
    }
  }, [isNew, onViewed]);

  return (
    <Pressable
      style={({ pressed }) => [styles.quarterlyCard, pressed && styles.cardPressed]}
      onPress={onToggle}
    >
      {isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>
      )}
      <Text style={styles.quarterlyLabel}>QUARTERLY REVIEW</Text>
      <Text style={styles.quarterlyPeriod}>{periodLabel}</Text>
      <Text style={styles.quarterlyPreview} numberOfLines={expanded ? undefined : 3}>
        {expanded ? data.quarterSentence : truncateText(data.quarterSentence, 100)}
      </Text>
      {expanded && (
        <View style={styles.expandedContent}>
          {data.gameForming ? (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionLabel}>GAME FORMING</Text>
              <Text style={styles.expandedSectionBody}>{data.gameForming}</Text>
            </View>
          ) : null}
          {data.progression ? (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionLabel}>PROGRESSION</Text>
              <Text style={styles.expandedSectionBody}>{data.progression}</Text>
            </View>
          ) : null}
          {data.consistency ? (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionLabel}>CONSISTENCY</Text>
              <Text style={styles.expandedSectionBody}>{data.consistency}</Text>
            </View>
          ) : null}
          {data.bodyCheck ? (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionLabel}>BODY CHECK</Text>
              <Text style={styles.expandedSectionBody}>{data.bodyCheck}</Text>
            </View>
          ) : null}
          {data.nextQuarterPriorities?.length > 0 && (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionLabel}>NEXT QUARTER PRIORITIES</Text>
              {data.nextQuarterPriorities.map((p, i) => (
                <Text key={i} style={styles.expandedSectionBody}>
                  {i + 1}. {p}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}
      <Text style={styles.readMoreLink}>
        {expanded ? 'Collapse' : 'Read Full Review  \u2192'}
      </Text>
    </Pressable>
  );
}

// ===========================================
// MONTHLY CARD
// ===========================================

function MonthlyCard({
  insight,
  expanded,
  onToggle,
  isNew,
  onViewed,
}: {
  insight: Insight;
  expanded: boolean;
  onToggle: () => void;
  isNew: boolean;
  onViewed: () => void;
}) {
  const data = insight.insight_data as MonthlyInsightOutput;
  const periodLabel = formatPeriodLabel(insight);

  const hasTriggeredView = React.useRef(false);
  React.useEffect(() => {
    if (isNew && !hasTriggeredView.current) {
      hasTriggeredView.current = true;
      onViewed();
    }
  }, [isNew, onViewed]);

  return (
    <Pressable
      style={({ pressed }) => [styles.monthlyCard, pressed && styles.cardPressed]}
      onPress={onToggle}
    >
      {isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>
      )}
      <Text style={styles.monthlyLabel}>MONTHLY CHECK-IN</Text>
      <Text style={styles.monthlyPeriod}>{periodLabel}</Text>
      <Text style={styles.monthlyPreview} numberOfLines={expanded ? undefined : 3}>
        {expanded ? data.overview : truncateText(data.overview, 100)}
      </Text>
      {expanded && (
        <View style={styles.expandedContent}>
          {data.developing ? (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionLabel}>DEVELOPING</Text>
              <Text style={styles.expandedSectionBody}>{data.developing}</Text>
            </View>
          ) : null}
          {data.sparring ? (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionLabel}>SPARRING</Text>
              <Text style={styles.expandedSectionBody}>{data.sparring}</Text>
            </View>
          ) : null}
          {data.consistency ? (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionLabel}>CONSISTENCY</Text>
              <Text style={styles.expandedSectionBody}>{data.consistency}</Text>
            </View>
          ) : null}
          {data.watch ? (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionLabel}>WATCH</Text>
              <Text style={styles.expandedSectionBody}>{data.watch}</Text>
            </View>
          ) : null}
          {data.focusNextMonth ? (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionLabel}>FOCUS NEXT MONTH</Text>
              <Text style={styles.expandedSectionBody}>{data.focusNextMonth}</Text>
            </View>
          ) : null}
        </View>
      )}
      <Text style={styles.readMoreLinkWhite}>
        {expanded ? 'Collapse' : 'Read Full Review  \u2192'}
      </Text>
    </Pressable>
  );
}

// ===========================================
// WEEKLY INSIGHT ITEM
// ===========================================

function WeeklyInsightItem({
  item,
}: {
  item: { type: InsightType; title: string; body: string };
}) {
  const badge = TYPE_BADGE_COLORS[item.type] ?? TYPE_BADGE_COLORS.technique;

  return (
    <View style={styles.weeklyInsightItem}>
      <View style={styles.weeklyInsightHeader}>
        <View style={[styles.typeBadge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.typeBadgeText, { color: badge.text }]}>
            {item.type.replace('_', ' ')}
          </Text>
        </View>
      </View>
      <Text style={styles.weeklyInsightTitle}>{item.title}</Text>
      <Text style={styles.weeklyInsightBody}>{item.body}</Text>
    </View>
  );
}

// ===========================================
// WEEKLY CARD
// ===========================================

function WeeklyCard({
  insight,
  isNew,
  onViewed,
}: {
  insight: Insight;
  isNew: boolean;
  onViewed: () => void;
}) {
  const data = insight.insight_data as WeeklyInsightOutput;
  const periodLabel = formatPeriodLabel(insight);

  const hasTriggeredView = React.useRef(false);
  React.useEffect(() => {
    if (isNew && !hasTriggeredView.current) {
      hasTriggeredView.current = true;
      onViewed();
    }
  }, [isNew, onViewed]);

  return (
    <View style={styles.weeklyCard}>
      <View style={styles.weeklyCardHeader}>
        <Text style={styles.weeklyDateRange}>{periodLabel}</Text>
        {isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
      </View>
      {data.insights.map((item, i) => (
        <WeeklyInsightItem key={i} item={item} />
      ))}
      {data.focusNext ? (
        <View style={styles.focusNextRow}>
          <Text style={styles.focusNextLabel}>FOCUS NEXT</Text>
          <Text style={styles.focusNextBody}>{data.focusNext}</Text>
        </View>
      ) : null}
    </View>
  );
}

// ===========================================
// EMPTY STATES
// ===========================================

function EmptyNoSessions() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>--</Text>
      </View>
      <Text style={styles.emptyTitle}>No Insights Yet</Text>
      <Text style={styles.emptyDescription}>
        Log your first session to start building insights. Your training data
        feeds the AI that learns your game.
      </Text>
    </View>
  );
}

function EmptyFewSessions({ sessionCount }: { sessionCount: number }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>...</Text>
      </View>
      <Text style={styles.emptyTitle}>Building Your Profile</Text>
      <Text style={styles.emptyDescription}>
        Keep logging — insights unlock after 5 sessions. The more data TOMO has,
        the sharper your feedback gets.
      </Text>
      <SessionProgressBar current={sessionCount} target={5} />
    </View>
  );
}

function EmptyNoWeekly() {
  return (
    <View style={styles.emptyWeekly}>
      <Text style={styles.emptyWeeklyText}>
        Your first weekly debrief will appear after you log a session this week.
      </Text>
    </View>
  );
}

// ===========================================
// MAIN SCREEN
// ===========================================

export function InsightsScreen() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [sessionCount, setSessionCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuarterly, setExpandedQuarterly] = useState(false);
  const [expandedMonthly, setExpandedMonthly] = useState(false);

  // Track which insights are being viewed for the first time this session.
  // When an unviewed insight is rendered, the typewriter plays, then we
  // mark it viewed in the DB so it never animates again.
  const [viewedThisSession, setViewedThisSession] = useState<Set<string>>(new Set());

  /**
   * Determine if an insight should play the typewriter animation.
   * True only when: has_been_viewed is false AND we haven't already
   * started the animation this session (prevents re-trigger on re-render).
   */
  const shouldAnimate = useCallback(
    (insight: Insight): boolean => {
      return !insight.has_been_viewed && !viewedThisSession.has(insight.id);
    },
    [viewedThisSession]
  );

  /**
   * Called when an insight's typewriter animation starts (or when an
   * unviewed insight is first rendered). Marks it viewed in the DB
   * and in local state so it won't animate again — even if the user
   * backgrounds the app and comes back.
   */
  const handleInsightViewed = useCallback(
    (insightId: string) => {
      // Update local state immediately (prevents re-animation on re-render)
      setViewedThisSession((prev) => {
        if (prev.has(insightId)) return prev;
        const next = new Set(prev);
        next.add(insightId);
        return next;
      });

      // Update DB in background (non-blocking, fire-and-forget)
      insightService.markAsViewed(insightId);

      // Update the insights array so has_been_viewed reflects truth
      setInsights((prev) =>
        prev.map((i) =>
          i.id === insightId
            ? { ...i, has_been_viewed: true, first_viewed_at: new Date().toISOString() }
            : i
        )
      );
    },
    []
  );

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [allInsights, sessions] = await Promise.all([
        insightService.list(),
        sessionService.list(),
      ]);
      setInsights(allInsights);
      setSessionCount(sessions.length);
    } catch (err) {
      console.error('Failed to load insights:', err);
      setError('Could not load insights. Pull down to retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Load on mount and on focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Separate insights by tier
  const latestQuarterly = useMemo(
    () => insights.find((i) => i.tier === 'quarterly') ?? null,
    [insights]
  );
  const latestMonthly = useMemo(
    () => insights.find((i) => i.tier === 'monthly') ?? null,
    [insights]
  );
  const weeklyInsights = useMemo(
    () => insights.filter((i) => i.tier === 'weekly'),
    [insights]
  );

  // Group weekly insights by month
  const weeklyByMonth = useMemo(() => {
    const groups: { monthLabel: string; sortKey: number; insights: Insight[] }[] = [];
    const monthMap = new Map<string, Insight[]>();

    for (const wi of weeklyInsights) {
      const key = getMonthKey(wi.period_start);
      if (!monthMap.has(key)) monthMap.set(key, []);
      monthMap.get(key)!.push(wi);
    }

    for (const [label, ins] of monthMap.entries()) {
      groups.push({
        monthLabel: label,
        sortKey: getMonthSortKey(ins[0].period_start),
        insights: ins,
      });
    }

    // Sort groups newest first
    groups.sort((a, b) => b.sortKey - a.sortKey);
    return groups;
  }, [weeklyInsights]);

  const totalSessions = sessionCount ?? 0;

  // ===========================================
  // RENDER
  // ===========================================

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>INSIGHTS</Text>
        {totalSessions > 0 && !loading && (
          <Text style={styles.headerSubtitle}>
            Based on {totalSessions} session{totalSessions !== 1 ? 's' : ''}
          </Text>
        )}
      </View>

      {/* Loading */}
      {loading ? (
        <InsightsSkeleton />
      ) : error ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Something went wrong</Text>
          <Text style={styles.emptyDescription}>{error}</Text>
        </View>
      ) : totalSessions === 0 ? (
        <EmptyNoSessions />
      ) : totalSessions < 5 && insights.length === 0 ? (
        <EmptyFewSessions sessionCount={totalSessions} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.gold}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Quarterly Card */}
          {latestQuarterly && (
            <QuarterlyCard
              insight={latestQuarterly}
              expanded={expandedQuarterly}
              onToggle={() => setExpandedQuarterly((v) => !v)}
              isNew={shouldAnimate(latestQuarterly)}
              onViewed={() => handleInsightViewed(latestQuarterly.id)}
            />
          )}

          {/* Monthly Card */}
          {latestMonthly && (
            <MonthlyCard
              insight={latestMonthly}
              expanded={expandedMonthly}
              onToggle={() => setExpandedMonthly((v) => !v)}
              isNew={shouldAnimate(latestMonthly)}
              onViewed={() => handleInsightViewed(latestMonthly.id)}
            />
          )}

          {/* Weekly Cards grouped by month */}
          {weeklyByMonth.length > 0 ? (
            weeklyByMonth.map((group) => (
              <View key={group.monthLabel}>
                <Text style={styles.monthDivider}>{group.monthLabel}</Text>
                {group.insights.map((wi) => (
                  <WeeklyCard
                    key={wi.id}
                    insight={wi}
                    isNew={shouldAnimate(wi)}
                    onViewed={() => handleInsightViewed(wi.id)}
                  />
                ))}
              </View>
            ))
          ) : (
            <EmptyNoWeekly />
          )}

          {/* Coach Deferral Footer */}
          <View style={styles.coachFooter}>
            <Text style={styles.coachFooterText}>
              Your coach knows your game better than any app. These insights
              supplement — never replace — their guidance.
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontFamily: 'Unbounded-ExtraBold',
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray500,
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'],
  },

  // -------------------------------------------
  // QUARTERLY CARD
  // -------------------------------------------
  quarterlyCard: {
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray700,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    padding: spacing.md,
    marginBottom: spacing.md,
    minHeight: 44,
  },
  cardPressed: {
    backgroundColor: pressedStyles.card.backgroundColor,
  },
  quarterlyLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  quarterlyPeriod: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
  },
  quarterlyPreview: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray400,
    lineHeight: 22,
  },
  readMoreLink: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.gold,
    marginTop: 10,
  },

  // -------------------------------------------
  // MONTHLY CARD
  // -------------------------------------------
  monthlyCard: {
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray700,
    borderLeftWidth: 2,
    borderLeftColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.md,
    minHeight: 44,
  },
  monthlyLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  monthlyPeriod: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
  },
  monthlyPreview: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray400,
    lineHeight: 22,
  },
  readMoreLinkWhite: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray300,
    marginTop: 10,
  },

  // -------------------------------------------
  // EXPANDED CONTENT (shared by quarterly/monthly)
  // -------------------------------------------
  expandedContent: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray700,
    paddingTop: 12,
  },
  expandedSection: {
    marginBottom: 12,
  },
  expandedSectionLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  expandedSectionBody: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray400,
    lineHeight: 22,
  },

  // -------------------------------------------
  // MONTH DIVIDER
  // -------------------------------------------
  monthDivider: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  // -------------------------------------------
  // WEEKLY CARD
  // -------------------------------------------
  weeklyCard: {
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray700,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  weeklyDateRange: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },

  // -------------------------------------------
  // WEEKLY INSIGHT ITEM
  // -------------------------------------------
  weeklyInsightItem: {
    marginBottom: 10,
  },
  weeklyInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  typeBadgeText: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  weeklyInsightTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 2,
  },
  weeklyInsightBody: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray400,
    lineHeight: 22,
  },

  // -------------------------------------------
  // FOCUS NEXT
  // -------------------------------------------
  focusNextRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.gray700,
  },
  focusNextLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  focusNextBody: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray300,
    lineHeight: 22,
  },

  // -------------------------------------------
  // EMPTY STATES
  // -------------------------------------------
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.gray800,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyIconText: {
    fontFamily: 'JetBrains Mono-Bold',
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray600,
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray500,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyWeekly: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  emptyWeeklyText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray500,
    textAlign: 'center',
    lineHeight: 22,
  },

  // -------------------------------------------
  // PROGRESS BAR
  // -------------------------------------------
  progressContainer: {
    width: '100%',
    maxWidth: 240,
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gray700,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.gold,
  },
  progressLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
    letterSpacing: 0.5,
  },

  // -------------------------------------------
  // COACH DEFERRAL FOOTER
  // -------------------------------------------
  coachFooter: {
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  coachFooterText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray600,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
  },

  // -------------------------------------------
  // NEW BADGE (shown on unviewed insights)
  // -------------------------------------------
  newBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.goldDim,
    marginBottom: 8,
  },
  newBadgeText: {
    fontFamily: 'JetBrains Mono-Bold',
    fontSize: 12,
    fontWeight: '700',
    color: colors.gold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  weeklyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  // -------------------------------------------
  // SKELETON
  // -------------------------------------------
  skeletonContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  skeletonCard: {
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray700,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  skeletonBar: {
    backgroundColor: colors.gray700,
    borderRadius: radius.md,
    opacity: 0.5,
  },
});
