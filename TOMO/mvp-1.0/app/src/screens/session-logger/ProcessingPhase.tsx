/**
 * Session Logger — Processing Phase
 *
 * Extracted from SessionLoggerScreen.tsx lines 910-969.
 * Animated loading bars while transcription + extraction runs.
 */

import React, { useRef, useEffect } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../../config/design-tokens';

export interface ProcessingPhaseProps {
  onCancel?: () => void;
}

export function ProcessingPhase({ onCancel }: ProcessingPhaseProps) {
  const bar1 = useRef(new Animated.Value(0.3)).current;
  const bar2 = useRef(new Animated.Value(0.3)).current;
  const bar3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const createWave = (bar: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(bar, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(bar, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])
      );

    const a1 = createWave(bar1, 0);
    const a2 = createWave(bar2, 150);
    const a3 = createWave(bar3, 300);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, [bar1, bar2, bar3]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.processingContent}>
        <View style={styles.processingBars}>
          {[bar1, bar2, bar3].map((bar, i) => (
            <Animated.View
              key={i}
              style={[
                styles.processingBar,
                {
                  opacity: bar,
                  transform: [{
                    scaleY: bar.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [0.5, 1],
                    }),
                  }],
                },
              ]}
            />
          ))}
        </View>
        <Text style={styles.processingTitle}>Processing your session...</Text>
        <Text style={styles.processingHint}>
          Transcribing audio and extracting details
        </Text>
        {onCancel && (
          <Pressable
            style={({ pressed }) => [styles.textOnlyButton, { marginTop: spacing.xl }, pressed && { opacity: 0.7 }]}
            onPress={onCancel}
          >
            <Text style={styles.textOnlyText}>Skip to manual entry</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  processingContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  processingBars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    marginBottom: spacing.md,
  },
  processingBar: {
    width: 6,
    height: 32,
    borderRadius: 3,
    backgroundColor: colors.gold,
  },
  processingTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  processingHint: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray500,
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
