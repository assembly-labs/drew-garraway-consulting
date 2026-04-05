/**
 * EmberText — Gold trailing glow typewriter effect.
 * Ported from prototype's TrainingFeedback.tsx GlowText.
 * 12-character gold trail fades to settled gray-200.
 *
 * Also exports EmberCursor — pulsing gold cursor bar at the typing position.
 *
 * Extracted from InsightsScreen.tsx.
 */

import React, { useRef, useEffect } from 'react';
import { Text, Animated, type StyleProp, type TextStyle } from 'react-native';
import { colors } from '../../config/design-tokens';
import { BoldText } from './BoldText';

export const TRAIL_LENGTH = 12;

export function EmberText({
  text,
  isAnimating,
  style,
  isComplete,
}: {
  text: string;
  isAnimating: boolean;
  style: StyleProp<TextStyle>;
  isComplete: boolean;
}) {
  if (!text) return null;

  // Strip bold markers for character-level rendering during animation
  const cleanText = text.replace(/\*\*/g, '');

  // Once animation is done or not animating, render with BoldText for proper bold styling
  if (!isAnimating || isComplete) {
    return <BoldText text={text} style={[style, { color: colors.gray300 }]} boldStyle={{ fontWeight: '700', color: colors.white }} />;
  }

  const charCount = cleanText.length;
  const trailStart = Math.max(0, charCount - TRAIL_LENGTH);

  // Settled portion (already revealed, no glow)
  const settledText = cleanText.slice(0, trailStart);
  // Trail portion (last 12 chars, gold glow)
  const trailChars = cleanText.slice(trailStart);

  return (
    <Text style={style}>
      {settledText.length > 0 && (
        <Text style={{ color: colors.gray300 }}>{settledText}</Text>
      )}
      {trailChars.split('').map((char, i) => {
        const distanceFromEnd = trailChars.length - 1 - i;
        const intensity = 1 - distanceFromEnd / TRAIL_LENGTH;
        const alpha = 0.4 + intensity * 0.6;
        const shadowBlur = 4 + intensity * 8;
        const shadowAlpha = intensity * 0.4;

        return (
          <Text
            key={`${trailStart + i}`}
            style={{
              color: `rgba(245, 166, 35, ${alpha})`,
              textShadowColor: `rgba(245, 166, 35, ${shadowAlpha})`,
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: shadowBlur,
            }}
          >
            {char}
          </Text>
        );
      })}
      <EmberCursor />
    </Text>
  );
}

/** Pulsing gold cursor bar at the typing position */
export function EmberCursor() {
  const opacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.3, duration: 750, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.8, duration: 750, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.Text
      style={{
        color: 'rgba(245, 166, 35, 0.8)',
        opacity,
        fontSize: 15,
        fontWeight: '300',
      }}
    >
      |
    </Animated.Text>
  );
}
