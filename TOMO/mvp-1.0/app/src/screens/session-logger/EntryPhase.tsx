/**
 * Session Logger — Entry Phase
 *
 * Extracted from SessionLoggerScreen.tsx lines 696-822.
 * Training mode, session kind, duration, sparring toggle.
 */

import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, touchTargets } from '../../config/design-tokens';
import { Icons } from '../../components/Icons';
import { haptics } from '../../utils/haptics';
import { GymChip } from '../../components/GymChip';
import { EntryFields, RECORDING_PROMPTS } from './types';

export interface EntryPhaseProps {
  entry: EntryFields;
  setEntry: React.Dispatch<React.SetStateAction<EntryFields>>;
  onRecord: () => void;
  onTextOnly: () => void;
  onCancel: () => void;
  gymName: string | null;
  isGymOverridden: boolean;
  onGymPress: () => void;
  onGymReset: () => void;
}

export function EntryPhase({
  entry,
  setEntry,
  onRecord,
  onTextOnly,
  onCancel,
  gymName,
  isGymOverridden,
  onGymPress,
  onGymReset,
}: EntryPhaseProps) {
  const [promptIndex] = useState(Math.floor(Math.random() * RECORDING_PROMPTS.length));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.recordingCancelRow}>
        <Pressable
          style={({ pressed }) => pressed && { opacity: 0.5 }}
          onPress={onCancel}
          hitSlop={12}
        >
          <Text style={styles.recordingCancelText}>Cancel</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.entryContent}>
        <Text style={styles.phaseTitle}>Log Your Training</Text>
        <GymChip
          gymName={gymName}
          isOverridden={isGymOverridden}
          onPress={onGymPress}
          onReset={onGymReset}
        />

        {/* Training Mode */}
        <Text style={styles.fieldLabel}>TRAINING MODE</Text>
        <View style={styles.chipRow}>
          {(['gi', 'nogi', 'other'] as const).map((mode) => (
            <Pressable
              key={mode}
              style={({ pressed }) => [styles.entryChip, entry.trainingMode === mode && styles.entryChipSelected, pressed && { opacity: 0.7 }]}
              onPress={() => { haptics.light(); setEntry((p) => ({ ...p, trainingMode: mode })); }}
            >
              <Text style={[styles.entryChipText, entry.trainingMode === mode && styles.entryChipTextSelected]}>
                {mode === 'nogi' ? 'No-Gi' : mode === 'gi' ? 'Gi' : 'Other'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Session Kind */}
        <Text style={styles.fieldLabel}>SESSION TYPE</Text>
        <View style={styles.chipRow}>
          {(['class', 'open_mat', 'competition_training', 'other'] as const).map((kind) => (
            <Pressable
              key={kind}
              style={({ pressed }) => [styles.entryChip, entry.sessionKind === kind && styles.entryChipSelected, pressed && { opacity: 0.7 }]}
              onPress={() => { haptics.light(); setEntry((p) => ({ ...p, sessionKind: kind })); }}
            >
              <Text style={[styles.entryChipText, entry.sessionKind === kind && styles.entryChipTextSelected]}>
                {kind === 'open_mat' ? 'Open Mat' : kind === 'competition_training' ? 'Comp Training' : kind === 'class' ? 'Regular Class' : 'Other'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Duration */}
        <Text style={styles.fieldLabel}>DURATION</Text>
        <View style={styles.chipRow}>
          {[60, 75, 90, 120].map((min) => (
            <Pressable
              key={min}
              style={({ pressed }) => [styles.entryChip, entry.durationMinutes === min && styles.entryChipSelected, pressed && { opacity: 0.7 }]}
              onPress={() => { haptics.light(); setEntry((p) => ({ ...p, durationMinutes: min })); }}
            >
              <Text style={[styles.entryChipText, entry.durationMinutes === min && styles.entryChipTextSelected]}>
                {min} min
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Sparring */}
        <Text style={styles.fieldLabel}>DID YOU SPAR?</Text>
        <View style={styles.chipRow}>
          {([true, false] as const).map((val) => (
            <Pressable
              key={String(val)}
              style={({ pressed }) => [styles.entryChip, entry.didSpar === val && styles.entryChipSelected, pressed && { opacity: 0.7 }]}
              onPress={() => { haptics.light(); setEntry((p) => ({ ...p, didSpar: val })); }}
            >
              <Text style={[styles.entryChipText, entry.didSpar === val && styles.entryChipTextSelected]}>
                {val ? 'Yes' : 'No'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Prompt */}
        <Text style={styles.recordPrompt}>{RECORDING_PROMPTS[promptIndex]}</Text>

        {/* Record Button */}
        <Pressable
          style={({ pressed }) => [styles.recordButton, pressed && { opacity: 0.85 }]}
          onPress={onRecord}
        >
          <Icons.Mic size={36} color={colors.black} />
          <Text style={styles.recordButtonText}>Record</Text>
        </Pressable>

        {/* Text fallback */}
        <Pressable style={({ pressed }) => [styles.textOnlyButton, pressed && { opacity: 0.7 }]} onPress={onTextOnly}>
          <Text style={styles.textOnlyText}>Type instead</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  recordingCancelRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  recordingCancelText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray400,
  },
  entryContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  phaseTitle: {
    fontFamily: 'Unbounded-ExtraBold',
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    marginBottom: spacing.xl,
  },
  fieldLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
    letterSpacing: 2,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  entryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
    minHeight: touchTargets.primary,
    justifyContent: 'center',
  },
  entryChipSelected: {
    backgroundColor: colors.goldDim,
    borderColor: colors.gold,
  },
  entryChipText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray400,
  },
  entryChipTextSelected: {
    color: colors.gold,
  },
  recordPrompt: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray400,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: spacing['2xl'],
    marginBottom: spacing.lg,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.gold,
    paddingVertical: 20,
    borderRadius: radius.xl,
    minHeight: touchTargets.recording,
  },
  recordButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
  },
  textOnlyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  textOnlyText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray500,
    textDecorationLine: 'underline',
  },
});
