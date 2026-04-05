/**
 * MonthlyCard — Monthly insight card.
 *
 * Extracted from InsightsScreen.tsx.
 */

import React, { useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors } from '../../config/design-tokens';
import { Icons } from '../../components/Icons';
import type { Insight, MonthlyInsightOutput } from '../../types/insights-types';
import { formatPeriodLabel } from './helpers';
import { styles } from './styles';

export function MonthlyCard({
  insight,
  expanded,
  onToggle,
  isNew,
  onViewed,
}: {
  insight: Insight;
  expanded: boolean;
  onToggle: () => void;
  isNew: boolean;
  onViewed: () => void;
}) {
  const data = insight.insight_data as MonthlyInsightOutput;
  const periodLabel = formatPeriodLabel(insight);

  const hasTriggeredView = useRef(false);
  React.useEffect(() => {
    if (isNew && !hasTriggeredView.current) {
      hasTriggeredView.current = true;
      onViewed();
    }
  }, [isNew, onViewed]);

  return (
    <Pressable
      style={({ pressed }) => [styles.monthlyCard, pressed && styles.cardPressed]}
      onPress={onToggle}
    >
      {isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>
      )}
      <Text style={styles.monthlyLabel}>MONTHLY CHECK-IN</Text>
      <Text style={styles.monthlyPeriod}>{periodLabel}</Text>
      <Text style={styles.monthlyPreview} numberOfLines={expanded ? undefined : 3}>
        {data.overview}
      </Text>
      {expanded && (
        <View style={styles.expandedContent}>
          {data.developing ? (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionLabel}>DEVELOPING</Text>
              <Text style={styles.expandedSectionBody}>{data.developing}</Text>
            </View>
          ) : null}
          {data.sparring ? (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionLabel}>SPARRING</Text>
              <Text style={styles.expandedSectionBody}>{data.sparring}</Text>
            </View>
          ) : null}
          {data.consistency ? (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionLabel}>CONSISTENCY</Text>
              <Text style={styles.expandedSectionBody}>{data.consistency}</Text>
            </View>
          ) : null}
          {data.watch ? (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionLabel}>WATCH</Text>
              <Text style={styles.expandedSectionBody}>{data.watch}</Text>
            </View>
          ) : null}
          {data.focusNextMonth ? (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionLabel}>FOCUS NEXT MONTH</Text>
              <Text style={styles.expandedSectionBody}>{data.focusNextMonth}</Text>
            </View>
          ) : null}
        </View>
      )}
      <View style={styles.readMoreRow}>
        <Text style={styles.readMoreLinkWhite}>
          {expanded ? 'Collapse' : 'Read Full Review'}
        </Text>
        {!expanded && <Icons.ChevronRight size={16} color={colors.gray300} />}
      </View>
    </Pressable>
  );
}
