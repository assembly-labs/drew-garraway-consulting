/**
 * GymHistoryList — Collapsible timeline of all gyms a user has trained at.
 *
 * Shows primary (current) gym with gold dot, past gyms with gray dot,
 * session count per gym, and expandable drop-in visit details.
 */

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../config/design-tokens';
import { Icons } from './Icons';
import type { UserGym } from '../types/mvp-types';

interface GymHistoryListProps {
  gyms: UserGym[];
  sessionCounts: Record<string, number>;
  onEditNotes: (gym: UserGym) => void;
}

function formatDateRange(startedAt: string, endedAt: string | null): string {
  const start = formatMonthYear(startedAt);
  if (!endedAt) return `${start} \u2013 present`;
  return `${start} \u2013 ${formatMonthYear(endedAt)}`;
}

function formatMonthYear(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const MAX_VISIBLE_VISITS = 5;

export function GymHistoryList({ gyms, sessionCounts, onEditNotes }: GymHistoryListProps) {
  const [expanded, setExpanded] = useState(false);
  const [showAllVisits, setShowAllVisits] = useState(false);

  if (gyms.length <= 1) return null;

  const homeGyms = gyms.filter(g => g.relationship === 'home');
  const visits = gyms.filter(g => g.relationship !== 'home');
  const visibleVisits = showAllVisits ? visits : visits.slice(0, MAX_VISIBLE_VISITS);

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.header, pressed && { opacity: 0.7 }]}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.headerText}>
          Gym History ({homeGyms.length} gym{homeGyms.length !== 1 ? 's' : ''})
        </Text>
        {expanded ? (
          <Icons.ChevronDown size={16} color={colors.gray500} />
        ) : (
          <Icons.ChevronRight size={16} color={colors.gray500} />
        )}
      </Pressable>

      {expanded && (
        <View style={styles.timeline}>
          {homeGyms.map((gym, index) => {
            const count = sessionCounts[gym.id] ?? 0;
            return (
              <View key={gym.id} style={styles.entry}>
                <View style={styles.dotColumn}>
                  <View style={[styles.dot, gym.is_primary ? styles.dotActive : styles.dotPast]} />
                  {index < homeGyms.length - 1 && <View style={styles.line} />}
                </View>
                <Pressable
                  style={({ pressed }) => [styles.entryContent, pressed && { opacity: 0.7 }]}
                  onPress={() => onEditNotes(gym)}
                >
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryName} numberOfLines={1}>{gym.gym_name}</Text>
                    {count > 0 && (
                      <Text style={styles.entryCount}>{count}</Text>
                    )}
                  </View>
                  {gym.gym_city && (
                    <Text style={styles.entryLocation}>
                      {[gym.gym_city, gym.gym_state].filter(Boolean).join(', ')}
                    </Text>
                  )}
                  <Text style={styles.entryDates}>
                    {formatDateRange(gym.started_at, gym.ended_at)}
                  </Text>
                  {gym.notes && (
                    <Text style={styles.entryNotes}>"{gym.notes}"</Text>
                  )}
                </Pressable>
              </View>
            );
          })}

          {/* Drop-in visits */}
          {visits.length > 0 && (
            <View style={styles.visitsSection}>
              <Text style={styles.visitsSectionTitle}>
                Drop-in visits ({visits.length})
              </Text>
              {visibleVisits.map((visit) => (
                <Pressable
                  key={visit.id}
                  style={({ pressed }) => [styles.visitRow, pressed && { opacity: 0.7 }]}
                  onPress={() => onEditNotes(visit)}
                >
                  <Text style={styles.visitName} numberOfLines={1}>{visit.gym_name}</Text>
                  <Text style={styles.visitDate}>{formatShortDate(visit.started_at)}</Text>
                </Pressable>
              ))}
              {visits.length > MAX_VISIBLE_VISITS && !showAllVisits && (
                <Pressable
                  style={({ pressed }) => [pressed && { opacity: 0.7 }]}
                  onPress={() => setShowAllVisits(true)}
                >
                  <Text style={styles.showAllText}>
                    Show all {visits.length} visits
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray700,
  },
  headerText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray400,
  },
  timeline: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  entry: {
    flexDirection: 'row',
    minHeight: 60,
  },
  dotColumn: {
    width: 24,
    alignItems: 'center',
    paddingTop: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    backgroundColor: colors.gold,
  },
  dotPast: {
    backgroundColor: colors.gray600,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.gray700,
    marginTop: 4,
  },
  entryContent: {
    flex: 1,
    paddingLeft: spacing.sm,
    paddingBottom: spacing.md,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  entryName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
    flex: 1,
    marginRight: spacing.sm,
  },
  entryCount: {
    fontFamily: 'JetBrains Mono',
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray500,
  },
  entryLocation: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray500,
    marginBottom: 1,
  },
  entryDates: {
    fontFamily: 'JetBrains Mono',
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray600,
    marginBottom: 2,
  },
  entryNotes: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray400,
    fontStyle: 'italic',
    marginTop: 2,
  },
  // Drop-in visits section
  visitsSection: {
    paddingLeft: 32, // align with entry text (dotColumn 24 + padding 8)
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray700,
    marginTop: spacing.sm,
  },
  visitsSectionTitle: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray600,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  visitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  visitName: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray400,
    flex: 1,
    marginRight: spacing.sm,
  },
  visitDate: {
    fontFamily: 'JetBrains Mono',
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray600,
  },
  showAllText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    fontWeight: '600',
    color: colors.gold,
    paddingVertical: spacing.sm,
  },
});
