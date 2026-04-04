/**
 * EmptyStates — Empty state components for the Insights screen.
 *
 * EmptyNoSessions: shown when no sessions have been logged at all.
 * EmptyNoWeekly: shown in Mode B when there's no weekly insight yet this week.
 *
 * Extracted from InsightsScreen.tsx.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../config/design-tokens';
import { Icons } from '../../components/Icons';
import { styles } from './styles';

export function EmptyNoSessions() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Icons.Mic size={28} color={colors.gray600} />
      </View>
      <Text style={styles.emptyTitle}>No Insights Yet</Text>
      <Text style={styles.emptyDescription}>
        Log your first session to start building insights. Your training data
        feeds the system that learns your game.
      </Text>
    </View>
  );
}

export function EmptyNoWeekly() {
  return (
    <View style={styles.emptyWeekly}>
      <Text style={styles.emptyWeeklyText}>
        Your first weekly debrief will appear after you log a session this week.
      </Text>
    </View>
  );
}
