/**
 * PostSaveQuote — Full-screen quote overlay shown after session save.
 *
 * Displays a belt-aware, gender-weighted quote from a martial arts figure
 * for 4 seconds, then fades out and calls onComplete. Double-tap to dismiss early.
 *
 * Quote pool: 135+ quotes from 48+ people across BJJ, MMA, boxing, wrestling,
 * judo, and traditional martial arts. ~19% from women athletes.
 *
 * Selection: Fisher-Yates shuffle, last 5 tracked in AsyncStorage to prevent repeats.
 * Female users see ~50% women athlete quotes.
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing } from '../config/design-tokens';
import { getRandomQuote, type Quote, type BeltLevel } from '../data/quotes';

const DISPLAY_DURATION = 4000; // 4 seconds
const FADE_DURATION = 200;
const DOUBLE_TAP_WINDOW = 300; // ms
const RECENT_QUOTES_KEY = 'tomo_recent_quote_ids';
const MAX_RECENT = 5;

interface PostSaveQuoteProps {
  belt: BeltLevel;
  gender: string | null;
  onComplete: () => void;
}

async function getRecentIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(RECENT_QUOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveRecentId(id: string): Promise<void> {
  try {
    const recent = await getRecentIds();
    const updated = [id, ...recent.filter((r) => r !== id)].slice(0, MAX_RECENT);
    await AsyncStorage.setItem(RECENT_QUOTES_KEY, JSON.stringify(updated));
  } catch {
    // Non-critical — quote tracking failing should never block navigation
  }
}

export function PostSaveQuote({ belt, gender, onComplete }: PostSaveQuoteProps) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapRef = useRef<number>(0);
  const dismissingRef = useRef(false);
  const quoteIdRef = useRef<string>('');

  // Select quote on mount
  useEffect(() => {
    let mounted = true;
    getRecentIds().then((recentIds) => {
      if (!mounted) return;
      const selected = getRandomQuote(belt, recentIds, gender);
      setQuote(selected);
      quoteIdRef.current = selected.id;
    });
    return () => { mounted = false; };
  }, [belt, gender]);

  // Start timer + progress animation once quote is loaded
  useEffect(() => {
    if (!quote) return;

    // Progress line animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: DISPLAY_DURATION,
      useNativeDriver: false,
    }).start();

    // Auto-dismiss timer
    timerRef.current = setTimeout(dismiss, DISPLAY_DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [quote]);

  const dismiss = useCallback(() => {
    if (dismissingRef.current) return;
    dismissingRef.current = true;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: FADE_DURATION,
      useNativeDriver: true,
    }).start(() => {
      saveRecentId(quoteIdRef.current);
      onComplete();
    });
  }, [fadeAnim, onComplete]);

  const handlePress = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < DOUBLE_TAP_WINDOW) {
      // Double tap detected
      dismiss();
    }
    lastTapRef.current = now;
  }, [dismiss]);

  if (!quote) return null;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <SafeAreaView style={styles.container}>
        <Pressable style={styles.pressable} onPress={handlePress}>
          <View style={styles.quoteArea}>
            <Text style={styles.quoteText}>{quote.text}</Text>
            <Text style={styles.quoteAttribution}>{quote.attribution}</Text>
          </View>

          {/* Progress line */}
          <View style={styles.progressContainer}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
        </Pressable>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.black,
    zIndex: 100,
  },
  container: {
    flex: 1,
  },
  pressable: {
    flex: 1,
  },
  quoteArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 180,
    paddingHorizontal: 40,
  },
  quoteText: {
    fontFamily: 'Inter',
    fontSize: 17,
    fontWeight: '500',
    color: colors.gray300,
    lineHeight: 28,
    textAlign: 'center',
  },
  quoteAttribution: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(245, 166, 35, 0.6)',
    marginTop: 12,
    textAlign: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 32,
    left: 40,
    right: 40,
    height: 2,
    backgroundColor: 'rgba(245, 166, 35, 0.1)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(245, 166, 35, 0.3)',
    borderRadius: 1,
  },
});
