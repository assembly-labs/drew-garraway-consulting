/**
 * Insights Screen — Weekly training debrief in message style.
 *
 * Three modes:
 *   A. Pre-insight: account < 7 days old OR 0 sessions — typewriter holding message.
 *   B. Has insight data: latest weekly rendered as sequential paragraphs with
 *      typewriter on first view. Older weeks collapsed below.
 *   C. Loading / error states.
 *
 * Quarterly and monthly cards are preserved for backward compatibility but
 * the primary weekly experience is the new message-style render.
 */

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Animated,
  type TextStyle,
  type StyleProp,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius } from '../config/design-tokens';
import { Icons } from '../components/Icons';
import { insightService } from '../services/insights-service';
import { sessionService } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useInsightTypewriter } from '../hooks/useInsightTypewriter';
import { parseBold } from '../utils/text-helpers';
import type {
  Insight,
  InsightType,
  WeeklyInsightOutput,
  MonthlyInsightOutput,
  QuarterlyInsightOutput,
  WeeklyInsightParagraph,
  WeeklyInsightOutputV2,
} from '../types/insights-types';

// ===========================================
// COMPATIBILITY LAYER
// Normalizes old and new weekly insight_data shapes into V2 format.
// ===========================================

function normalizeInsightData(data: any): WeeklyInsightOutputV2 {
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

function formatWeekRange(periodStart: string, periodEnd: string): string {
  const start = new Date(periodStart + 'T00:00:00');
  const end = new Date(periodEnd + 'T00:00:00');
  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${startStr} - ${endStr}`;
}

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

// ===========================================
// BOLD TEXT RENDERER
// Renders a string with **bold** markers using inline Text spans.
// ===========================================

function BoldText({
  text,
  style,
  boldStyle,
}: {
  text: string;
  style: object;
  boldStyle: object;
}) {
  const segments = parseBold(text);
  return (
    <Text style={style}>
      {segments.map((seg, i) =>
        seg.bold ? (
          <Text key={i} style={boldStyle}>
            {seg.text}
          </Text>
        ) : (
          <Text key={i}>{seg.text}</Text>
        )
      )}
    </Text>
  );
}

// ===========================================
// EMBER TEXT — Gold trailing glow typewriter effect
// Ported from prototype's TrainingFeedback.tsx GlowText.
// 12-character gold trail fades to settled gray-200.
// ===========================================

const TRAIL_LENGTH = 12;

function EmberText({
  text,
  isAnimating,
  style,
  isComplete,
}: {
  text: string;
  isAnimating: boolean;
  style: StyleProp<TextStyle>;
  isComplete: boolean;
}) {
  if (!text) return null;

  // Strip bold markers for character-level rendering during animation
  const cleanText = text.replace(/\*\*/g, '');

  // Once animation is done or not animating, render with BoldText for proper bold styling
  if (!isAnimating || isComplete) {
    return <BoldText text={text} style={[style, { color: colors.gray300 }]} boldStyle={{ fontWeight: '700', color: colors.white }} />;
  }

  const charCount = cleanText.length;
  const trailStart = Math.max(0, charCount - TRAIL_LENGTH);

  // Settled portion (already revealed, no glow)
  const settledText = cleanText.slice(0, trailStart);
  // Trail portion (last 12 chars, gold glow)
  const trailChars = cleanText.slice(trailStart);

  return (
    <Text style={style}>
      {settledText.length > 0 && (
        <Text style={{ color: colors.gray300 }}>{settledText}</Text>
      )}
      {trailChars.split('').map((char, i) => {
        const distanceFromEnd = trailChars.length - 1 - i;
        const intensity = 1 - distanceFromEnd / TRAIL_LENGTH;
        const alpha = 0.4 + intensity * 0.6;
        const shadowBlur = 4 + intensity * 8;
        const shadowAlpha = intensity * 0.4;

        return (
          <Text
            key={`${trailStart + i}`}
            style={{
              color: `rgba(245, 166, 35, ${alpha})`,
              textShadowColor: `rgba(245, 166, 35, ${shadowAlpha})`,
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: shadowBlur,
            }}
          >
            {char}
          </Text>
        );
      })}
      <EmberCursor />
    </Text>
  );
}

/** Pulsing gold cursor bar at the typing position */
function EmberCursor() {
  const opacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.3, duration: 750, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.8, duration: 750, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.Text
      style={{
        color: 'rgba(245, 166, 35, 0.8)',
        opacity,
        fontSize: 15,
        fontWeight: '300',
      }}
    >
      |
    </Animated.Text>
  );
}

// ===========================================
// SKELETON
// ===========================================

function InsightsSkeleton() {
  return (
    <View style={styles.skeletonContainer}>
      <View style={[styles.skeletonBar, { width: 100, height: 11, marginBottom: spacing.lg }]} />
      <View style={[styles.skeletonBar, { width: '90%', height: 15, marginBottom: 12 }]} />
      <View style={[styles.skeletonBar, { width: '75%', height: 15, marginBottom: 12 }]} />
      <View style={[styles.skeletonBar, { width: '85%', height: 15, marginBottom: 20 }]} />
      <View style={[styles.skeletonBar, { width: '60%', height: 15, marginBottom: 12 }]} />
      <View style={[styles.skeletonBar, { width: '70%', height: 15 }]} />
    </View>
  );
}

// ===========================================
// PRE-INSIGHT TYPEWRITER MESSAGE (Mode A)
// Shown when account < 7 days old OR 0 sessions.
// ===========================================

function PreInsightMessage({
  message,
  hasBeenSeen,
  onSeen,
}: {
  message: string;
  hasBeenSeen: boolean;
  onSeen: () => void;
}) {
  const input = useMemo(
    () => ({ paragraphs: [{ text: message, isWatch: false }], focusNext: '' }),
    [message]
  );

  const { revealedTexts, isComplete, skip } = useInsightTypewriter(
    input,
    !hasBeenSeen
  );

  const hasNotifiedSeen = useRef(false);
  React.useEffect(() => {
    if (isComplete && !hasBeenSeen && !hasNotifiedSeen.current) {
      hasNotifiedSeen.current = true;
      onSeen();
    }
  }, [isComplete, hasBeenSeen, onSeen]);

  const displayText = hasBeenSeen ? message : (revealedTexts[0] ?? '');
  const isAnimating = !hasBeenSeen && !isComplete;

  return (
    <Pressable style={styles.preInsightContainer} onPress={skip}>
      <EmberText
        text={displayText}
        isAnimating={isAnimating}
        isComplete={isComplete || hasBeenSeen}
        style={styles.preInsightText}
      />
    </Pressable>
  );
}

// ===========================================
// WEEKLY MESSAGE VIEW (Mode B — latest week)
// Renders paragraphs sequentially with typewriter on first view.
// ===========================================

function WeeklyMessageView({
  insight,
  isNew,
  onViewed,
}: {
  insight: Insight;
  isNew: boolean;
  onViewed: () => void;
}) {
  const normalized = useMemo(
    () => normalizeInsightData(insight.insight_data),
    [insight.insight_data]
  );

  const { revealedTexts, activeIndex, isComplete, skip } = useInsightTypewriter(
    normalized,
    isNew
  );

  // Mark as viewed once typewriter completes
  const hasMarkedViewed = useRef(false);
  React.useEffect(() => {
    if (isComplete && isNew && !hasMarkedViewed.current) {
      hasMarkedViewed.current = true;
      onViewed();
    }
  }, [isComplete, isNew, onViewed]);

  const weekLabel = formatWeekRange(insight.period_start, insight.period_end);

  return (
    <Pressable style={styles.weeklyMessageContainer} onPress={skip} accessible={false}>
      {/* Week header */}
      <Text style={styles.weekRangeLabel}>{weekLabel}</Text>

      {/* Paragraphs */}
      {normalized.paragraphs.map((para, i) => {
        const displayText = isNew ? (revealedTexts[i] ?? '') : para.text;
        // Only show paragraphs that have started (activeIndex reached them)
        const hasStarted = !isNew || activeIndex >= i;
        if (!hasStarted) return null;

        // Is this the paragraph currently being typed?
        const isTypingThis = isNew && activeIndex === i && !isComplete;
        // Is this paragraph done (moved on to next or complete)?
        const paraComplete = !isNew || isComplete || activeIndex > i;

        if (para.isWatch) {
          return (
            <View key={i} style={styles.watchParagraph}>
              <EmberText
                text={displayText}
                isAnimating={isTypingThis}
                isComplete={paraComplete}
                style={styles.watchParagraphText}
              />
              {para.defer && (isComplete || activeIndex > i) ? (
                <Text style={styles.watchDefer}>{para.defer}</Text>
              ) : null}
            </View>
          );
        }

        return (
          <EmberText
            key={i}
            text={displayText}
            isAnimating={isTypingThis}
            isComplete={paraComplete}
            style={[styles.paragraphText, i < normalized.paragraphs.length - 1 && styles.paragraphSpacing]}
          />
        );
      })}

      {/* Focus section — shown after all paragraphs complete */}
      {normalized.focusNext ? (() => {
        const focusIdx = normalized.paragraphs.length;
        const focusText = isNew ? (revealedTexts[focusIdx] ?? '') : normalized.focusNext;
        const isTypingFocus = isNew && activeIndex === focusIdx && !isComplete;
        const focusDone = !isNew || isComplete || activeIndex > focusIdx;
        return (
          <View
            style={[
              styles.focusSection,
              (!isNew || (isComplete || activeIndex >= focusIdx)) ? {} : styles.focusSectionHidden,
            ]}
          >
            <Text style={styles.focusLabel}>THIS WEEK, TRY THIS</Text>
            <EmberText
              text={focusText}
              isAnimating={isTypingFocus}
              isComplete={focusDone}
              style={styles.focusBody}
            />
          </View>
        );
      })() : null}

      {/* Signoff */}
      {(isComplete || !isNew) ? (
        <Text style={styles.signoff}>
          Your coach knows your game better than any app.
        </Text>
      ) : null}
    </Pressable>
  );
}

// ===========================================
// COLLAPSED WEEKLY ROW (older weeks)
// ===========================================

function CollapsedWeekRow({
  insight,
  expanded,
  onToggle,
}: {
  insight: Insight;
  expanded: boolean;
  onToggle: () => void;
}) {
  const normalized = useMemo(
    () => normalizeInsightData(insight.insight_data),
    [insight.insight_data]
  );

  const weekLabel = formatPeriodLabel(insight);

  return (
    <View style={styles.collapsedWeekCard}>
      <Pressable
        style={styles.collapsedWeekRow}
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={`${weekLabel} — ${expanded ? 'collapse' : 'expand'}`}
      >
        <Text style={styles.collapsedWeekLabel}>{weekLabel}</Text>
        {expanded ? (
          <Icons.ChevronDown size={16} color={colors.gray500} />
        ) : (
          <Icons.ChevronRight size={16} color={colors.gray500} />
        )}
      </Pressable>

      {expanded && (
        <View style={styles.collapsedWeekContent}>
          {normalized.paragraphs.map((para, i) => {
            if (para.isWatch) {
              return (
                <View key={i} style={styles.watchParagraph}>
                  <BoldText
                    text={para.text}
                    style={styles.watchParagraphText}
                    boldStyle={styles.paragraphBold}
                  />
                  {para.defer ? (
                    <Text style={styles.watchDefer}>{para.defer}</Text>
                  ) : null}
                </View>
              );
            }
            return (
              <BoldText
                key={i}
                text={para.text}
                style={[styles.paragraphText, i < normalized.paragraphs.length - 1 && styles.paragraphSpacing]}
                boldStyle={styles.paragraphBold}
              />
            );
          })}
          {normalized.focusNext ? (
            <View style={styles.focusSection}>
              <Text style={styles.focusLabel}>THIS WEEK, TRY THIS</Text>
              <Text style={styles.focusBody}>{normalized.focusNext}</Text>
            </View>
          ) : null}
        </View>
      )}
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
  isNew: boolean;
  onViewed: () => void;
}) {
  const data = insight.insight_data as QuarterlyInsightOutput;
  const periodLabel = formatPeriodLabel(insight);

  const hasTriggeredView = useRef(false);
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
        {data.quarterSentence}
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
      <View style={styles.readMoreRow}>
        <Text style={styles.readMoreLink}>
          {expanded ? 'Collapse' : 'Read Full Review'}
        </Text>
        {!expanded && <Icons.ChevronRight size={16} color={colors.gold} />}
      </View>
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

  const hasTriggeredView = useRef(false);
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
        {data.overview}
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
      <View style={styles.readMoreRow}>
        <Text style={styles.readMoreLinkWhite}>
          {expanded ? 'Collapse' : 'Read Full Review'}
        </Text>
        {!expanded && <Icons.ChevronRight size={16} color={colors.gray300} />}
      </View>
    </Pressable>
  );
}

// ===========================================
// EMPTY STATES
// ===========================================

function EmptyNoSessions() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Icons.Mic size={28} color={colors.gray600} />
      </View>
      <Text style={styles.emptyTitle}>No Insights Yet</Text>
      <Text style={styles.emptyDescription}>
        Log your first session to start building insights. Your training data
        feeds the system that learns your game.
      </Text>
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
  const { profile } = useAuth();

  const [insights, setInsights] = useState<Insight[]>([]);
  const [sessionCount, setSessionCount] = useState<number | null>(null);
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

    setInsights((prev) =>
      prev.map((i) =>
        i.id === insightId
          ? { ...i, has_been_viewed: true, first_viewed_at: new Date().toISOString() }
          : i
      )
    );
  }, []);

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

  // Determine if we're in Mode A (pre-insight)
  const isPreInsight = totalSessions === 0 || accountAgeDays < 7;

  const preInsightMessage: string = useMemo(() => {
    if (totalSessions === 0) {
      return 'TOMO needs at least one week of training data before your first debrief. Log your sessions this week and your first insights will be here next week.';
    }
    return "You've been putting in the work. TOMO needs a full week of training data to spot patterns and put together your first debrief. Keep logging.";
  }, [totalSessions]);

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
          <PreInsightMessage
            message={preInsightMessage}
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
  },
  headerSubtitle: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray500,
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 60,
  },

  // -------------------------------------------
  // SKELETON
  // -------------------------------------------
  skeletonContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  skeletonBar: {
    backgroundColor: colors.gray700,
    borderRadius: radius.md,
    opacity: 0.5,
  },

  // -------------------------------------------
  // PRE-INSIGHT (Mode A)
  // -------------------------------------------
  preInsightContainer: {
    paddingTop: spacing.lg,
  },
  preInsightText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray300,
    lineHeight: 24,
  },

  // -------------------------------------------
  // WEEKLY MESSAGE VIEW (Mode B — latest)
  // -------------------------------------------
  weeklyMessageContainer: {
    paddingTop: spacing.md,
  },
  weekRangeLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray600,
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  paragraphText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray300,
    lineHeight: 24,
  },
  paragraphSpacing: {
    marginBottom: 16,
  },
  paragraphBold: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
  watchParagraph: {
    borderLeftWidth: 2,
    borderLeftColor: colors.negative,
    paddingLeft: 12,
    marginBottom: 16,
  },
  watchParagraphText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray300,
    lineHeight: 24,
  },
  watchDefer: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray500,
    marginTop: 6,
    lineHeight: 20,
  },
  focusSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#222222',
  },
  focusSectionHidden: {
    opacity: 0,
  },
  focusLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 11,
    fontWeight: '600',
    color: colors.gold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  focusBody: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray300,
    lineHeight: 24,
  },
  signoff: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray600,
    marginTop: 24,
    lineHeight: 20,
  },

  // -------------------------------------------
  // COLLAPSED OLDER WEEKS
  // -------------------------------------------
  olderSection: {
    marginTop: spacing.xl,
  },
  olderSectionLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray500,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  collapsedWeekCard: {
    backgroundColor: colors.gray800,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gray700,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  collapsedWeekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 44,
  },
  collapsedWeekLabel: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray400,
  },
  collapsedWeekContent: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: colors.gray700,
    paddingTop: 12,
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
    backgroundColor: '#242424',
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
    fontFamily: 'Inter',
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
  readMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
  },
  readMoreLink: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '600',
    color: colors.gold,
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
    fontFamily: 'Inter',
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
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray300,
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
  // NEW BADGE
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
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '700',
    color: colors.gold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
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
  emptyTitle: {
    fontFamily: 'Inter',
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
});
