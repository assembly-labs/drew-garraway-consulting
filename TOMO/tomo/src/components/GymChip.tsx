/**
 * GymChip — Small pressable pill showing which gym a session is being logged at.
 *
 * Used in SessionLoggerScreen (Entry + Review phases). Shows the gym name
 * with a MapPin icon. Tap to open gym picker. When overridden (drop-in),
 * shows a gold border and reset "✕" button.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../config/design-tokens';
import { Icons } from './Icons';
import { haptics } from '../utils/haptics';

interface GymChipProps {
  gymName: string | null;
  isOverridden: boolean;
  onPress: () => void;
  onReset: () => void;
}

export function GymChip({ gymName, isOverridden, onPress, onReset }: GymChipProps) {
  return (
    <View style={styles.row}>
      <Pressable
        style={({ pressed }) => [
          styles.chip,
          isOverridden && styles.chipOverridden,
          pressed && { opacity: 0.7 },
        ]}
        onPress={onPress}
      >
        <Icons.MapPin size={14} color={isOverridden ? colors.gold : colors.gray500} />
        <Text
          style={[styles.text, isOverridden && styles.textOverridden]}
          numberOfLines={1}
        >
          {gymName ?? 'Add your gym'}
        </Text>
      </Pressable>
      {isOverridden && (
        <Pressable
          style={({ pressed }) => [styles.resetButton, pressed && { opacity: 0.7 }]}
          onPress={() => { haptics.light(); onReset(); }}
          hitSlop={8}
        >
          <Icons.Close size={14} color={colors.gray500} />
        </Pressable>
      )}
    </View>
  );
}

/**
 * GymLabel — Read-only gym name for Recording phase.
 * Not tappable. Just contextual awareness.
 */
export function GymLabel({ gymName }: { gymName: string | null }) {
  if (!gymName) return null;
  return (
    <View style={styles.labelRow}>
      <Icons.MapPin size={12} color={colors.gray600} />
      <Text style={styles.labelText} numberOfLines={1}>{gymName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.gray700,
    backgroundColor: colors.gray800,
    flexShrink: 1,
  },
  chipOverridden: {
    borderColor: colors.gold,
    backgroundColor: colors.goldDim,
  },
  text: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray500,
    flexShrink: 1,
  },
  textOverridden: {
    color: colors.gold,
  },
  resetButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // GymLabel (recording phase)
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.lg,
  },
  labelText: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray600,
  },
});
