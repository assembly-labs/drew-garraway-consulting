/**
 * InsightsSkeleton — Loading skeleton for the Insights screen.
 *
 * Extracted from InsightsScreen.tsx.
 */

import React from 'react';
import { View } from 'react-native';
import { spacing } from '../../config/design-tokens';
import { styles } from './styles';

export function InsightsSkeleton() {
  return (
    <View style={styles.skeletonContainer}>
      <View style={[styles.skeletonBar, { width: 100, height: 11, marginBottom: spacing.lg }]} />
      <View style={[styles.skeletonBar, { width: '90%', height: 15, marginBottom: 12 }]} />
      <View style={[styles.skeletonBar, { width: '75%', height: 15, marginBottom: 12 }]} />
      <View style={[styles.skeletonBar, { width: '85%', height: 15, marginBottom: 20 }]} />
      <View style={[styles.skeletonBar, { width: '60%', height: 15, marginBottom: 12 }]} />
      <View style={[styles.skeletonBar, { width: '70%', height: 15 }]} />
    </View>
  );
}
