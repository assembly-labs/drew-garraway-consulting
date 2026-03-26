/**
 * GymCard — Displays the user's current home gym.
 *
 * Shows gym name, location, affiliation badge, session count, and duration.
 * Tap the edit icon to change home gym. Drop-in logging lives in the
 * session logger (not here).
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../config/design-tokens';
import { Icons } from './Icons';
import type { UserGym } from '../types/mvp-types';

interface GymCardProps {
  primaryGym: UserGym | null;
  fallbackGymName?: string;
  sessionCount: number;
  onChangeGym: () => void;
}

function formatDuration(startedAt: string): string {
  const start = new Date(startedAt + 'T00:00:00');
  const now = new Date();
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());

  if (months < 1) return 'Started this month';
  if (months === 1) return '1 month';
  if (months < 12) return `${months} months`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
  return `${years}y ${remainingMonths}m`;
}

function formatSessionCount(count: number): string {
  if (count === 0) return 'No sessions yet';
  if (count === 1) return '1 session';
  return `${count} sessions`;
}

export function GymCard({ primaryGym, fallbackGymName, sessionCount, onChangeGym }: GymCardProps) {
  const gymName = primaryGym?.gym_name ?? fallbackGymName ?? 'No gym set';
  const location = primaryGym
    ? [primaryGym.gym_city, primaryGym.gym_state].filter(Boolean).join(', ')
    : null;
  const affiliation = primaryGym?.gym_affiliation;
  const duration = primaryGym?.started_at ? formatDuration(primaryGym.started_at) : null;

  return (
    <View style={styles.card}>
      {/* Header: gym name + edit button */}
      <View style={styles.header}>
        <Text style={styles.gymName} numberOfLines={1}>{gymName}</Text>
        <Pressable
          style={({ pressed }) => [styles.editButton, pressed && { opacity: 0.7 }]}
          onPress={onChangeGym}
          hitSlop={8}
        >
          <Icons.Edit size={14} color={colors.gray500} />
        </Pressable>
      </View>

      {/* Location */}
      {location ? (
        <Text style={styles.location} numberOfLines={1}>{location}</Text>
      ) : null}

      {/* Stats row: affiliation badge + session count / duration */}
      <View style={styles.statsRow}>
        {affiliation ? (
          <View style={styles.affiliationBadge}>
            <Text style={styles.affiliationText}>{affiliation.toUpperCase()}</Text>
          </View>
        ) : null}

        <View style={styles.countBlock}>
          <Text style={styles.countText}>{formatSessionCount(sessionCount)}</Text>
          {duration ? (
            <Text style={styles.durationText}>Training {duration}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray700,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  gymName: {
    fontFamily: 'Inter-Bold',
    fontSize: 19,
    fontWeight: '700',
    color: colors.white,
    flex: 1,
    marginRight: spacing.sm,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  location: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray500,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  affiliationBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.lg,
    backgroundColor: colors.goldDim,
    borderWidth: 1,
    borderColor: 'rgba(245, 166, 35, 0.2)',
  },
  affiliationText: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 11,
    fontWeight: '600',
    color: colors.gold,
    letterSpacing: 1,
  },
  countBlock: {
    flex: 1,
  },
  countText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray400,
  },
  durationText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray600,
    marginTop: 1,
  },
});
