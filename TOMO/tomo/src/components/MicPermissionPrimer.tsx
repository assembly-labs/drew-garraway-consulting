/**
 * MicPermissionPrimer — Pre-permission modal for microphone access.
 *
 * Shows a branded explanation of why TOMO needs the mic before the
 * iOS system dialog fires. Apple's data shows this doubles grant rates.
 *
 * Usage:
 *   <MicPermissionPrimer
 *     visible={showPrimer}
 *     onEnable={handleEnable}   // User tapped "Enable Microphone"
 *     onSkip={handleSkip}       // User tapped "Maybe Later"
 *   />
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';
import { colors, spacing, radius } from '../config/design-tokens';
import { Icons } from './Icons';
import { haptics } from '../utils/haptics';

interface MicPermissionPrimerProps {
  visible: boolean;
  onEnable: () => void;
  onSkip: () => void;
}

export function MicPermissionPrimer({
  visible,
  onEnable,
  onSkip,
}: MicPermissionPrimerProps) {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          damping: 20,
          stiffness: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Icons.Mic size={36} color={colors.gold} />
          </View>

          {/* Headline */}
          <Text style={styles.headline}>
            Voice is how TOMO captures your best training moments
          </Text>

          {/* Body */}
          <Text style={styles.body}>
            After each session, just talk — TOMO listens and pulls out the
            details so you don't have to type while you're gassed.
          </Text>

          {/* Enable button */}
          <Pressable
            style={({ pressed }) => [
              styles.enableButton,
              pressed && { opacity: 0.85 },
            ]}
            onPress={() => {
              haptics.medium();
              onEnable();
            }}
          >
            <Text style={styles.enableButtonText}>Enable Microphone</Text>
          </Pressable>

          {/* Skip */}
          <Pressable
            style={({ pressed }) => [
              styles.skipButton,
              pressed && { opacity: 0.5 },
            ]}
            onPress={() => {
              haptics.light();
              onSkip();
            }}
            hitSlop={12}
          >
            <Text style={styles.skipText}>Maybe Later</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.gray800,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.gray700,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  headline: {
    fontFamily: 'Unbounded-Bold',
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 26,
  },
  body: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray400,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  enableButton: {
    backgroundColor: colors.gold,
    paddingVertical: 16,
    borderRadius: radius.xl,
    alignItems: 'center',
    width: '100%',
  },
  enableButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    fontWeight: '700',
    color: colors.black,
  },
  skipButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  skipText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray500,
  },
});
