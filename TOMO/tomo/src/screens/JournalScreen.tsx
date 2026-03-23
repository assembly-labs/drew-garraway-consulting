/**
 * Journal Screen — Session history list grouped by date
 *
 * Ported from prototype's SessionHistory.tsx:
 * - Date grouping: Today / Yesterday / This Week / This Month / Earlier
 * - Filter pills: All / Gi / No-Gi
 * - Session cards with training mode badge, duration, topic
 * - Empty state with encouragement
 * - Pull to refresh
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JournalStackParamList } from '../navigation/MainTabNavigator';
import { colors, spacing, radius } from '../config/design-tokens';
import { Icons } from '../components/Icons';
import { JournalSkeleton } from '../components/Skeleton';
import { haptics } from '../utils/haptics';
import { sessionService } from '../services/supabase';
import { groupSessionsByDate } from '../utils/journal-helpers';
import type { Session } from '../types/mvp-types';

type Nav = NativeStackNavigationProp<JournalStackParamList, 'JournalList'>;
type Filter = 'all' | 'gi' | 'nogi';

export function JournalScreen() {
  const navigation = useNavigation<Nav>();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');

  const loadSessions = useCallback(async () => {
    try {
      const data = await sessionService.list();
      setSessions(data ?? []);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Re-fetch when screen comes into focus (after logging a new session)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadSessions();
    });
    return unsubscribe;
  }, [navigation, loadSessions]);

  const onRefresh = () => {
    setRefreshing(true);
    loadSessions();
  };

  // Apply filter
  const filtered = filter === 'all'
    ? sessions
    : sessions.filter((s) => s.training_mode === filter);

  // Group by date
  const grouped = groupSessionsByDate(filtered);

  // Flatten for FlatList: section headers + items
  type ListItem = { type: 'header'; label: string } | { type: 'session'; session: Session };
  const listData: ListItem[] = [];
  for (const group of grouped) {
    listData.push({ type: 'header', label: group.label });
    for (const session of group.sessions) {
      listData.push({ type: 'session', session });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Journal</Text>
      </View>

      {/* Filter pills */}
      <View style={styles.filterRow}>
        {(['all', 'gi', 'nogi'] as Filter[]).map((f) => (
          <Pressable
            key={f}
            style={({ pressed }) => [styles.filterPill, filter === f && styles.filterPillActive, pressed && { opacity: 0.7 }]}
            onPress={() => { haptics.light(); setFilter(f); }}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'All' : f === 'gi' ? 'Gi' : 'No-Gi'}
            </Text>
          </Pressable>
        ))}
        <View style={styles.filterSpacer} />
        <Text style={styles.sessionCount}>
          {sessions.length} session{sessions.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Loading skeleton */}
      {loading ? (
        <JournalSkeleton />
      ) : filtered.length === 0 && sessions.length > 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Icons.Filter size={32} color={colors.gray600} />
          </View>
          <Text style={styles.emptyTitle}>No {filter === 'gi' ? 'Gi' : 'No-Gi'} Sessions</Text>
          <Text style={styles.emptyDescription}>
            You haven't logged any {filter === 'gi' ? 'Gi' : 'No-Gi'} sessions yet. They'll show up here after your next one.
          </Text>
        </View>
      ) : sessions.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Icons.Mic size={32} color={colors.gray600} />
          </View>
          <Text style={styles.emptyTitle}>No Sessions Yet</Text>
          <Text style={styles.emptyDescription}>
            After your next training session, tap the + button to log it. Your journal
            will build over time.
          </Text>
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item, i) =>
            item.type === 'header' ? `h-${item.label}` : `s-${item.session.id}`
          }
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return <Text style={styles.sectionHeader}>{item.label}</Text>;
            }
            return (
              <SessionCard
                session={item.session}
                onPress={() =>
                  navigation.navigate('SessionDetail', { sessionId: item.session.id })
                }
              />
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.gold}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

// ============================================
// SESSION CARD
// ============================================

function SessionCard({
  session,
  onPress,
}: {
  session: Session;
  onPress: () => void;
}) {
  const modeLabel =
    session.training_mode === 'nogi'
      ? 'No-Gi'
      : session.training_mode === 'gi'
        ? 'Gi'
        : session.training_mode === 'other'
          ? 'Other'
          : '';

  const kindLabel =
    session.session_kind === 'open_mat'
      ? 'Open Mat'
      : session.session_kind
        ? session.session_kind.charAt(0).toUpperCase() + session.session_kind.slice(1)
        : '';

  const modeColor =
    session.training_mode === 'gi'
      ? colors.trainingGi
      : session.training_mode === 'nogi'
        ? colors.trainingNogi
        : colors.gray500;

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} onPress={onPress}>
      <View style={styles.cardTop}>
        {/* Mode badge */}
        <View style={[styles.modeBadge, { backgroundColor: modeColor + '22', borderColor: modeColor + '44' }]}>
          <Text style={[styles.modeBadgeText, { color: modeColor }]}>{modeLabel}</Text>
        </View>
        <Text style={styles.cardDuration}>{session.duration_minutes} min</Text>
      </View>

      {/* Kind + topic */}
      <Text style={styles.cardKind}>{kindLabel}</Text>
      {session.lesson_topic ? (
        <Text style={styles.cardTopic} numberOfLines={1}>
          {session.lesson_topic}
        </Text>
      ) : null}

      {/* Techniques preview */}
      {(session.techniques_drilled ?? []).length > 0 && (
        <Text style={styles.cardTechniques} numberOfLines={1}>
          {(session.techniques_drilled ?? []).join(', ')}
        </Text>
      )}

      {/* Sparring indicator */}
      {session.did_spar && (
        <View style={styles.sparringRow}>
          <Icons.Sparring size={14} color={colors.gray500} />
          <Text style={styles.sparringText}>
            {session.sparring_rounds ?? 0} round{(session.sparring_rounds ?? 0) !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* Chevron */}
      <View style={styles.cardChevron}>
        <Icons.ChevronRight size={16} color={colors.gray600} />
      </View>
    </Pressable>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontFamily: 'Unbounded-ExtraBold',
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
  },
  filterPillActive: {
    backgroundColor: colors.goldDim,
    borderColor: colors.gold,
  },
  filterText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray500,
  },
  filterTextActive: {
    color: colors.gold,
  },
  filterSpacer: {
    flex: 1,
  },
  sessionCount: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray500,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  sectionHeader: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  // Session card
  card: {
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray700,
    padding: spacing.md,
    marginBottom: spacing.sm,
    position: 'relative',
  },
  cardPressed: {
    backgroundColor: '#252525',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  modeBadgeText: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
  },
  cardDuration: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray400,
  },
  cardKind: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 2,
  },
  cardTopic: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray400,
    marginBottom: 4,
  },
  cardTechniques: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray500,
    fontStyle: 'italic',
    marginTop: 4,
  },
  sparringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  sparringText: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray500,
  },
  cardChevron: {
    position: 'absolute',
    right: spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },

  // Empty state
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
});
