/**
 * OnboardingProgressBar — Thin animated gold bar for onboarding flow
 *
 * Renders a 3px bar at the top of each onboarding screen.
 * Automatically calculates progress from the screen name and
 * ONBOARDING_SCREEN_ORDER array — add/remove screens and all
 * percentages auto-adjust.
 *
 * Animation: On mount, bar animates FROM the previous screen's progress
 * TO the current screen's progress, creating the illusion of one
 * continuous bar advancing across the entire flow.
 *
 * Usage:
 *   <OnboardingProgressBar screenName="AboutYou" />
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { colors } from '../config/design-tokens';
import { ONBOARDING_SCREEN_ORDER } from '../navigation/OnboardingNavigator';

interface Props {
  screenName: string;
}

export function OnboardingProgressBar({ screenName }: Props) {
  const index = (ONBOARDING_SCREEN_ORDER as readonly string[]).indexOf(screenName);
  const total = ONBOARDING_SCREEN_ORDER.length;

  // Progress values: previous screen → current screen
  const prevProgress = index > 0 ? index / total : 0;
  const targetProgress = (index + 1) / total;

  const animValue = useRef(new Animated.Value(prevProgress)).current;

  useEffect(() => {
    // Brief delay so the bar animation starts after the screen transition begins
    const timer = setTimeout(() => {
      Animated.timing(animValue, {
        toValue: targetProgress,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false, // width % can't use native driver
      }).start();
    }, 150);

    return () => clearTimeout(timer);
  }, [targetProgress]); // eslint-disable-line react-hooks/exhaustive-deps

  // Interpolate to percentage string for width
  const width = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width }]} />
    </View>
  );
}

const BAR_HEIGHT = 3;

const styles = StyleSheet.create({
  track: {
    height: BAR_HEIGHT,
    backgroundColor: colors.gray800,
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: BAR_HEIGHT,
    backgroundColor: colors.gold,
    borderTopRightRadius: BAR_HEIGHT / 2,
    borderBottomRightRadius: BAR_HEIGHT / 2,
  },
});
