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
import type { Insight } from '../types/insights-types';

import {
  InsightsSkeleton,
  PreInsightLimitation,
  WeeklyMessageView,
  CollapsedWeekRow,
  QuarterlyCard,
  MonthlyCard,
  EmptyNoWeekly,
  styles,
} from './insights';

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
      const thisWeekCount = sessions.filter(
        (s) => s.date >= weekStart && s.date <= weekEnd && s.deleted_at === null
      ).length;
      setSessionsThisWeek(thisWeekCount);
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

  const latestWeekly = sortedWeekly[0] ?? null;
  const olderWeekly = sortedWeekly.slice(1);

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
      ) : isPreInsight ? (
        // Mode A: Pre-insight holding message
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
          <PreInsightLimitation
            limitation={limitation!}
            belt={profile?.belt ?? 'white'}
            gender={profile?.gender ?? null}
            hasBeenSeen={preInsightSeen}
            onSeen={() => setPreInsightSeen(true)}
          />
        </ScrollView>
      ) : (
        // Mode B: Has data — full weekly message view
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

          {/* Latest weekly — full message style */}
          {latestWeekly ? (
            <WeeklyMessageView
              insight={latestWeekly}
              isNew={shouldAnimate(latestWeekly)}
              onViewed={() => handleInsightViewed(latestWeekly.id)}
            />
          ) : (
            <EmptyNoWeekly />
          )}

          {/* Older weekly rows — collapsed */}
          {olderWeekly.length > 0 && (
            <View style={styles.olderSection}>
              <Text style={styles.olderSectionLabel}>EARLIER</Text>
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
