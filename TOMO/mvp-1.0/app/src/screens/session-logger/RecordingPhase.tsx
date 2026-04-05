/**
 * Session Logger — Recording Phase
 *
 * Extracted from SessionLoggerScreen.tsx lines 828-904.
 * Pulsing mic circle, timer, stop and cancel buttons.
 */

import React, { useRef, useCallback } from 'react';
import { View, Text, Pressable, Animated, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, touchTargets } from '../../config/design-tokens';
import { Icons } from '../../components/Icons';
import { GymLabel } from '../../components/GymChip';

export interface RecordingPhaseProps {
  duration: string;
  pulseAnim: Animated.Value;
  onStop: () => void;
  onCancel: () => void;
  gymName: string | null;
}

export function RecordingPhase({
  duration,
  pulseAnim,
  onStop,
  onCancel,
  gymName,
}: RecordingPhaseProps) {
  const cancelRef = useRef(false);

  const handleCancel = useCallback(() => {
    // Double-tap guard
    if (cancelRef.current) return;
    cancelRef.current = true;

    // Parse elapsed seconds from "M:SS" format
    const parts = duration.split(':');
    const totalSeconds = (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);

    if (totalSeconds < 3) {
      // Under 3 seconds — cancel instantly
      onCancel();
    } else {
      // 3+ seconds — confirm discard
      Alert.alert(
        'Discard this recording?',
        undefined,
        [
          { text: 'Keep Recording', style: 'cancel', onPress: () => { cancelRef.current = false; } },
          { text: 'Discard', style: 'destructive', onPress: onCancel },
        ],
        // onDismiss fires when alert is dismissed without choosing an option (e.g. tap outside on Android).
        // Reset the guard so Cancel button works again.
        { onDismiss: () => { cancelRef.current = false; } },
      );
      // Do NOT reset guard here — let the Alert callbacks handle it.
      // Resetting synchronously created a race where a second tap could slip through
      // before the Alert rendered.
    }
  }, [duration, onCancel]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.recordingCancelRow}>
        <Pressable
          style={({ pressed }) => pressed && { opacity: 0.5 }}
          onPress={handleCancel}
          hitSlop={12}
        >
          <Text style={styles.recordingCancelText}>Cancel</Text>
        </Pressable>
      </View>
      <View style={styles.recordingContent}>
        <GymLabel gymName={gymName} />
        <Animated.View style={[styles.recordingCircle, { opacity: pulseAnim }]}>
          <Text style={styles.recordingKanji}>友</Text>
        </Animated.View>

        <Text style={styles.recordingTimer}>{duration}</Text>
        <Text style={styles.recordingHint}>Describe your session...</Text>

        <Pressable
          style={({ pressed }) => [styles.stopButton, pressed && { opacity: 0.85 }]}
          onPress={onStop}
        >
          <Icons.Stop size={24} color={colors.black} />
          <Text style={styles.stopButtonText}>Stop Recording</Text>
        </Pressable>
      </View>
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
  recordingContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  recordingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  recordingKanji: {
    fontSize: 32,
    color: colors.gold,
    fontWeight: '700',
  },
  recordingTimer: {
    fontFamily: 'Unbounded-ExtraBold',
    fontSize: 48,
    fontWeight: '800',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  recordingHint: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray400,
    marginBottom: spacing['2xl'],
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.gold,
    paddingHorizontal: spacing.xl,
    paddingVertical: 18,
    borderRadius: radius.xl,
    minHeight: touchTargets.primary,
  },
  stopButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    fontWeight: '700',
    color: colors.black,
  },
});
