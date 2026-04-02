/**
 * Onboarding Screen 1: Welcome
 *
 * Logo, cycling typewriter value props, "Get Started" CTA.
 * No data collected. Minimal, Apple-style welcome.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { colors, spacing, radius } from '../../config/design-tokens';
import { haptics } from '../../utils/haptics';
import { OnboardingProgressBar } from '../../components/OnboardingProgressBar';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

// ============================================
// CYCLING PHRASES
// ============================================

const PHRASES = [
  'Your training. Remembered.',
  'Every session. A lesson.',
  "Let's roll.",
];

const TYPEWRITER_SPEED = 35;       // ms per character
const HOLD_DURATION = 2000;        // ms to hold completed phrase
const ERASE_SPEED = 20;            // ms per character (faster than typing)
const PAUSE_BETWEEN = 400;         // ms pause between erase and next phrase

// ============================================
// TYPEWRITER HOOK
// ============================================

function useCyclingTypewriter(phrases: string[]) {
  const [displayedText, setDisplayedText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [skipped, setSkipped] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const charIndexRef = useRef(0);
  const phaseRef = useRef<'typing' | 'holding' | 'erasing' | 'pausing'>('typing');

  const tick = useCallback(() => {
    const currentPhrase = phrases[phraseIndex];

    switch (phaseRef.current) {
      case 'typing': {
        if (charIndexRef.current < currentPhrase.length) {
          charIndexRef.current++;
          setDisplayedText(currentPhrase.slice(0, charIndexRef.current));
          timerRef.current = setTimeout(tick, TYPEWRITER_SPEED);
        } else {
          // Done typing — hold
          phaseRef.current = 'holding';
          setIsTyping(false);
          timerRef.current = setTimeout(tick, HOLD_DURATION);
        }
        break;
      }
      case 'holding': {
        // Start erasing
        phaseRef.current = 'erasing';
        setIsTyping(true);
        timerRef.current = setTimeout(tick, ERASE_SPEED);
        break;
      }
      case 'erasing': {
        if (charIndexRef.current > 0) {
          charIndexRef.current--;
          setDisplayedText(currentPhrase.slice(0, charIndexRef.current));
          timerRef.current = setTimeout(tick, ERASE_SPEED);
        } else {
          // Done erasing — pause before next
          phaseRef.current = 'pausing';
          timerRef.current = setTimeout(tick, PAUSE_BETWEEN);
        }
        break;
      }
      case 'pausing': {
        // Move to next phrase
        const nextIndex = (phraseIndex + 1) % phrases.length;
        setPhraseIndex(nextIndex);
        charIndexRef.current = 0;
        phaseRef.current = 'typing';
        setIsTyping(true);
        timerRef.current = setTimeout(tick, TYPEWRITER_SPEED);
        break;
      }
    }
  }, [phraseIndex, phrases]);

  // Start the cycle
  useEffect(() => {
    if (skipped) return;
    // Initial delay before first character
    timerRef.current = setTimeout(tick, 600);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [tick, skipped]);

  // Skip: instantly show the last phrase and stop
  const skip = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const lastPhrase = phrases[phrases.length - 1];
    setDisplayedText(lastPhrase);
    setIsTyping(false);
    setSkipped(true);
  }, [phrases]);

  return { displayedText, isTyping, skipped, skip };
}

// ============================================
// CURSOR COMPONENT
// ============================================

function BlinkingCursor() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );
    blink.start();
    return () => blink.stop();
  }, [opacity]);

  return (
    <Animated.Text style={[styles.cursor, { opacity }]}>|</Animated.Text>
  );
}

// ============================================
// SCREEN
// ============================================

export function WelcomeScreen({ navigation }: Props) {
  const { displayedText, skipped, skip } = useCyclingTypewriter(PHRASES);

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingProgressBar screenName="Welcome" />
      <Pressable style={styles.content} onPress={skipped ? undefined : skip}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>TOMO</Text>
          <Text style={styles.logoSubtext}>友</Text>
        </View>

        {/* Cycling typewriter */}
        <View style={styles.typewriterContainer}>
          <Text style={styles.typewriterText}>
            {displayedText}
            {!skipped && <BlinkingCursor />}
          </Text>
        </View>
      </Pressable>

      {/* CTA */}
      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => { haptics.medium(); navigation.navigate('AboutYou'); }}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  logoText: {
    fontFamily: 'Unbounded-ExtraBold',
    fontSize: 48,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 8,
  },
  logoSubtext: {
    fontFamily: 'Inter',
    fontSize: 32,
    color: colors.gold,
    marginTop: spacing.sm,
  },
  typewriterContainer: {
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typewriterText: {
    fontFamily: 'Inter',
    fontSize: 17,
    fontWeight: '500',
    color: colors.gray400,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  cursor: {
    fontFamily: 'Inter',
    fontSize: 17,
    fontWeight: '500',
    color: colors.gold,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.gold,
    paddingVertical: 18,
    borderRadius: radius.xl,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    fontWeight: '700',
    color: colors.black,
  },
});
