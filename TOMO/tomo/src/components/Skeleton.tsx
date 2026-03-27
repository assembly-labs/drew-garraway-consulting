/**
 * TOMO — Loading Skeleton Components
 *
 * Pulsing placeholder shapes that match the real layout of journal cards,
 * session detail sections, and profile rows. Shows while data loads.
 *
 * USAGE:
 *   import { JournalSkeleton, SessionDetailSkeleton, ProfileSkeleton } from '@/components/Skeleton';
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, spacing, radius } from '../config/design-tokens';

// --- Pulsing bar ---

function PulseBar({
  width,
  height = 14,
  borderRadius: br = radius.md,
  style,
}: {
  width: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
}) {
  const opacity = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.55, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.2, duration: 600, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius: br,
          backgroundColor: colors.gray600,
          opacity,
        },
        style,
      ]}
    />
  );
}

// --- Journal list skeleton (3 cards) ---

function JournalCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <PulseBar width={56} height={24} borderRadius={radius.full} />
        <PulseBar width={48} height={14} />
      </View>
      <PulseBar width={120} height={16} style={{ marginTop: 8 }} />
      <PulseBar width="80%" height={12} style={{ marginTop: 8 }} />
    </View>
  );
}

export function JournalSkeleton() {
  return (
    <View style={styles.listContainer}>
      <PulseBar width={80} height={12} style={{ marginBottom: spacing.sm }} />
      <JournalCardSkeleton />
      <JournalCardSkeleton />
      <JournalCardSkeleton />
    </View>
  );
}

// --- Session detail skeleton ---

function SectionSkeleton({ lines = 2 }: { lines?: number }) {
  return (
    <View style={styles.section}>
      <PulseBar width={100} height={11} style={{ marginBottom: spacing.sm }} />
      {Array.from({ length: lines }).map((_, i) => (
        <PulseBar
          key={i}
          width={i === lines - 1 ? '60%' : '90%'}
          height={14}
          style={{ marginTop: i > 0 ? 6 : 0 }}
        />
      ))}
    </View>
  );
}

export function SessionDetailSkeleton() {
  return (
    <View style={styles.detailContainer}>
      {/* Header placeholder */}
      <View style={styles.detailHeader}>
        <PulseBar width={160} height={18} />
        <View style={[styles.cardTopRow, { marginTop: 8 }]}>
          <PulseBar width={48} height={22} borderRadius={radius.full} />
          <PulseBar width={60} height={14} />
          <PulseBar width={50} height={14} />
        </View>
      </View>
      {/* Narrative */}
      <View style={styles.narrativeSkeleton}>
        <PulseBar width="95%" height={14} />
        <PulseBar width="75%" height={14} style={{ marginTop: 6 }} />
      </View>
      <SectionSkeleton />
      <SectionSkeleton lines={3} />
      <SectionSkeleton lines={1} />
    </View>
  );
}

// --- Profile skeleton ---

export function ProfileSkeleton() {
  return (
    <View style={styles.profileContainer}>
      {/* Avatar */}
      <View style={styles.profileHeader}>
        <PulseBar width={100} height={100} borderRadius={50} />
        <PulseBar width={140} height={22} style={{ marginTop: spacing.md }} />
        <PulseBar width={100} height={14} style={{ marginTop: spacing.sm }} />
      </View>
      {/* Info rows */}
      <View style={styles.profileCard}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i}>
            <View style={styles.profileRow}>
              <PulseBar width={100} height={14} />
              <PulseBar width={80} height={14} />
            </View>
            {i < 4 && <View style={styles.profileDivider} />}
          </View>
        ))}
      </View>
    </View>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  card: {
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray700,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section: {
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray700,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  detailContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  detailHeader: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  narrativeSkeleton: {
    borderLeftWidth: 3,
    borderLeftColor: colors.gray700,
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  profileContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  profileCard: {
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray700,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 16,
  },
  profileDivider: {
    height: 1,
    backgroundColor: colors.gray700,
    marginHorizontal: spacing.md,
  },
});
