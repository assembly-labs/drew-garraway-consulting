/**
 * Insights Screen — Weekly training debrief in message style.
 *
 * Three modes:
 *   A. Pre-insight: 0 sessions this week — typewriter holding message.
 *   B. Has insight data: latest weekly rendered as sequential paragraphs with
 *      typewriter on first view. Older weeks collapsed below.
 *   C. Loading / error states.
 *
 * Quarterly and monthly cards are preserved for backward compatibility but
 * the primary weekly experience is the new message-style render.
 */

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { colors } from '../config/design-tokens';
import { insightService } from '../services/insights-service';
import { sessionService } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useInsightsBadge } from '../hooks/useInsightsBadge';
import { getInsightLimitation } from '../data/insight-limitations';
import { getWeekBounds } from '../services/insights-engine';
import { maybeTriggerWeeklyInsight } from '../services/insight-trigger';
import type { Insight } from '../types/insights-types';
import type { Session } from '../types/mvp-types';

import {
  InsightsSkeleton,
  PreInsightLimitation,
  WeeklyMessageView,
  CollapsedWeekRow,
  QuarterlyCard,
  MonthlyCard,
  styles,
  normalizeInsightData,
} from './insights';
import { ReturnWelcome } from './insights/PreInsightSection';

// ===========================================
// MAIN SCREEN
// ===========================================

export function InsightsScreen() {
  const { profile } = useAuth();
  const { clearBadge } = useInsightsBadge();
  const isFocused = useIsFocused();
  const fetchInFlightRef = useRef(false);

  const [insights, setInsights] = useState<Insight[]>([]);
  const [sessionCount, setSessionCount] = useState<number | null>(null);
  const [sessionsThisWeek, setSessionsThisWeek] = useState(0);
  const [weekSessions, setWeekSessions] = useState<Session[]>([]);
  const [lastSessionDate, setLastSessionDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuarterly, setExpandedQuarterly] = useState(false);
  const [expandedMonthly, setExpandedMonthly] = useState(false);

  // Track collapsed state for older weekly rows
  const [expandedOlderWeeks, setExpandedOlderWeeks] = useState<Set<string>>(new Set());

  // Track which insights are being viewed for the first time this session
  const [viewedThisSession, setViewedThisSession] = useState<Set<string>>(new Set());

  // Track whether the pre-insight holding message has been seen (so it doesn't re-animate)
  const [preInsightSeen, setPreInsightSeen] = useState(false);

  const shouldAnimate = useCallback(
    (insight: Insight): boolean => {
      return !insight.has_been_viewed && !viewedThisSession.has(insight.id);
    },
    [viewedThisSession]
  );

  const handleInsightViewed = useCallback((insightId: string) => {
    setViewedThisSession((prev) => {
      if (prev.has(insightId)) return prev;
      const next = new Set(prev);
      next.add(insightId);
      return next;
    });

    // Fire-and-forget — non-blocking
    insightService.markAsViewed(insightId);
    clearBadge();

    setInsights((prev) =>
      prev.map((i) =>
        i.id === insightId
          ? { ...i, has_been_viewed: true, first_viewed_at: new Date().toISOString() }
          : i
      )
    );
  }, [clearBadge]);

  const loadData = useCallback(async () => {
    if (fetchInFlightRef.current) return;
    fetchInFlightRef.current = true;
    try {
      setError(null);
      const [allInsights, sessions] = await Promise.all([
        insightService.list(),
        sessionService.list(),
      ]);
      setInsights(allInsights);
      setSessionCount(sessions.length);

      // Count sessions in the current week for limitation logic
      const { start: weekStart, end: weekEnd } = getWeekBounds(new Date());
      const activeSessions = sessions.filter((s) => s.deleted_at === null);
      const thisWeekSessions = activeSessions.filter(
        (s) => s.date >= weekStart && s.date <= weekEnd
      );
      setSessionsThisWeek(thisWeekSessions.length);
      setWeekSessions(thisWeekSessions);

      // ENH-06: track the most recent session date (for returning-user detection)
      const sorted = [...activeSessions].sort((a, b) => b.date.localeCompare(a.date));
      setLastSessionDate(sorted[0]?.date ?? null);
    } catch (err) {
      console.error('Failed to load insights:', err);
      setError('Could not load insights. Pull down to retry.');
    } finally {
      fetchInFlightRef.current = false;
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Load on mount and on tab focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const toggleOlderWeek = useCallback((id: string) => {
    setExpandedOlderWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

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

  // Sort weekly newest-first; first is the latest, rest are older
  const sortedWeekly = useMemo(
    () =>
      [...weeklyInsights].sort(
        (a, b) =>
          new Date(b.period_start).getTime() - new Date(a.period_start).getTime()
      ),
    [weeklyInsights]
  );

  const totalSessions = sessionCount ?? 0;

  // Account age in days
  const accountAgeDays = profile?.created_at
    ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / 86400000)
    : 0;

  // Check if any weekly insight matches the current week
  const currentWeekStart = useMemo(() => getWeekBounds(new Date()).start, []);
  const hasInsightThisWeek = useMemo(
    () => sortedWeekly.some((i) => i.period_start === currentWeekStart),
    [sortedWeekly, currentWeekStart]
  );

  // Determine if we're in Mode A (pre-insight) via limitation state
  const limitation = getInsightLimitation(sessionsThisWeek, accountAgeDays, hasInsightThisWeek);
  const isPreInsight = limitation !== null;

  // ENH-06: detect returning user (14+ day gap)
  const daysSinceLastSession = useMemo(() => {
    if (!lastSessionDate) return null;
    const today = new Date();
    const last = new Date(lastSessionDate + 'T00:00:00');
    return Math.floor((today.getTime() - last.getTime()) / 86400000);
  }, [lastSessionDate]);
  const isReturning = limitation?.state === 'no_sessions' && typeof daysSinceLastSession === 'number' && daysSinceLastSession >= 14;

  // ENH-02: extract focusNext from the most recent prior weekly insight
  const lastFocusNext = useMemo(() => {
    // The most recent weekly insight that is NOT the current week
    const priorInsight = sortedWeekly.find((i) => i.period_start !== currentWeekStart);
    if (!priorInsight) return null;
    const normalized = normalizeInsightData(priorInsight.insight_data);
    return normalized.focusNext || null;
  }, [sortedWeekly, currentWeekStart]);

  // When pre-insight: all weekly insights are "older" (no current week to feature)
  // When not pre-insight: feature the current week's insight, rest are older
  const currentWeekInsight = isPreInsight
    ? null
    : (sortedWeekly.find((i) => i.period_start === currentWeekStart) ?? null);
  const olderWeekly = isPreInsight
    ? sortedWeekly
    : sortedWeekly.filter((i) => i.period_start !== currentWeekStart);

  // Auto-poll every 3s while "generating" state is showing and screen is focused.
  // Stops after 30 seconds or when the insight arrives.
  useEffect(() => {
    if (limitation?.state !== 'generating' || !isFocused) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      if (Date.now() - startTime > 30_000) {
        clearInterval(interval);
        return;
      }
      loadData();
    }, 3_000);

    return () => clearInterval(interval);
  }, [limitation?.state, isFocused, loadData]);

  // Tab-focus generation trigger: if the user has sessions this week but no
  // insight (state === 'generating'), attempt generation from the tab itself.
  // This provides a second chance if the session-save trigger failed silently.
  const generationAttemptedRef = useRef(false);

  useEffect(() => {
    if (!isFocused) generationAttemptedRef.current = false;
  }, [isFocused]);

  useEffect(() => {
    if (limitation?.state === 'generating' && profile && isFocused && !generationAttemptedRef.current) {
      generationAttemptedRef.current = true;
      maybeTriggerWeeklyInsight(profile)
        .then(() => loadData())
        .catch((err) => console.warn('[Insights] Tab-focus trigger failed:', err?.message ?? err));
    }
  }, [limitation?.state, profile, isFocused, loadData]);

  // ===========================================
  // RENDER
  // ===========================================

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insights</Text>
        {totalSessions > 0 && !loading && (
          <Text style={styles.headerSubtitle}>
            Based on {totalSessions} session{totalSessions !== 1 ? 's' : ''}
          </Text>
        )}
      </View>

      {loading ? (
        <InsightsSkeleton />
      ) : error ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Something went wrong</Text>
          <Text style={styles.emptyDescription}>{error}</Text>
        </View>
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
          {/* Pre-insight holding message (new week, no insight yet) */}
          {isPreInsight && (
            <>
              {/* ENH-06: warm re-entry for users returning after 14+ day gap */}
              {isReturning ? (
                <ReturnWelcome lastInsight={sortedWeekly[0] ?? null} />
              ) : (
                <>
                  {/* ENH-02: Focus Echo — show last week's focus above the limitation message */}
                  {lastFocusNext && limitation?.state === 'no_sessions' ? (
                    <View style={styles.focusEchoContainer}>
                      <Text style={styles.focusEchoLabel}>LAST WEEK'S FOCUS</Text>
                      <Text style={styles.focusEchoText}>{lastFocusNext}</Text>
                    </View>
                  ) : null}
                  <PreInsightLimitation
                    limitation={limitation!}
                    belt={profile?.belt ?? 'white'}
                    gender={profile?.gender ?? null}
                    hasBeenSeen={preInsightSeen}
                    onSeen={() => setPreInsightSeen(true)}
                    hasPastInsights={olderWeekly.length > 0}
                  />
                </>
              )}
            </>
          )}

          {/* Current week's insight — full message style */}
          {!isPreInsight && currentWeekInsight && (
            <WeeklyMessageView
              insight={currentWeekInsight}
              isNew={shouldAnimate(currentWeekInsight)}
              onViewed={() => handleInsightViewed(currentWeekInsight.id)}
              weekSessions={weekSessions}
            />
          )}

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

          {/* Older weekly rows — collapsed */}
          {olderWeekly.length > 0 && (
            <View style={styles.olderSection}>
              <Text style={styles.olderSectionLabel}>PREVIOUS WEEKS</Text>
              {olderWeekly.map((wi) => (
                <CollapsedWeekRow
                  key={wi.id}
                  insight={wi}
                  expanded={expandedOlderWeeks.has(wi.id)}
                  onToggle={() => toggleOlderWeek(wi.id)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
