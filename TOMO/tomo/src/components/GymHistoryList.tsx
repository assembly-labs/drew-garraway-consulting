/**
 * GymHistoryList — Collapsible timeline of all gyms a user has trained at.
 *
 * Shows primary (current) gym with gold dot, past gyms with gray dot,
 * and a collapsed count of drop-in visits. Each entry shows gym name,
 * location, date range, and optional notes.
 */

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../config/design-tokens';
import { Icons } from './Icons';
import type { UserGym } from '../types/mvp-types';

interface GymHistoryListProps {
  gyms: UserGym[];
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

export function GymHistoryList({ gyms, onEditNotes }: GymHistoryListProps) {
  const [expanded, setExpanded] = useState(false);

  if (gyms.length <= 1) return null; // No history to show (only current gym)

  const homeGyms = gyms.filter(g => g.relationship === 'home');
  const visits = gyms.filter(g => g.relationship !== 'home');
  const totalGyms = homeGyms.length + (visits.length > 0 ? 1 : 0);

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
          {homeGyms.map((gym, index) => (
            <View key={gym.id} style={styles.entry}>
              <View style={styles.dotColumn}>
                <View style={[styles.dot, gym.is_primary ? styles.dotActive : styles.dotPast]} />
                {index < homeGyms.length - 1 && <View style={styles.line} />}
              </View>
              <Pressable
                style={({ pressed }) => [styles.entryContent, pressed && { opacity: 0.7 }]}
                onPress={() => onEditNotes(gym)}
              >
                <Text style={styles.entryName}>{gym.gym_name}</Text>
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
          ))}

          {visits.length > 0 && (
            <View style={styles.visitSummary}>
              <Icons.MapPin size={14} color={colors.gray600} />
              <Text style={styles.visitText}>
                {visits.length} drop-in visit{visits.length !== 1 ? 's' : ''}
              </Text>
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
  entryName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 2,
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
  visitSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    paddingLeft: 32, // align with entry text (dotColumn 24 + padding 8)
  },
  visitText: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray600,
  },
});
