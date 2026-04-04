/**
 * QuarterlyCard — Quarterly insight card.
 *
 * Extracted from InsightsScreen.tsx.
 */

import React, { useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors } from '../../config/design-tokens';
import { Icons } from '../../components/Icons';
import type { Insight, QuarterlyInsightOutput } from '../../types/insights-types';
import { formatPeriodLabel } from './helpers';
import { styles } from './styles';

export function QuarterlyCard({
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
  const data = insight.insight_data as QuarterlyInsightOutput;
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
      style={({ pressed }) => [styles.quarterlyCard, pressed && styles.cardPressed]}
      onPress={onToggle}
    >
      {isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>
      )}
      <Text style={styles.quarterlyLabel}>QUARTERLY REVIEW</Text>
      <Text style={styles.quarterlyPeriod}>{periodLabel}</Text>
      <Text style={styles.quarterlyPreview} numberOfLines={expanded ? undefined : 3}>
        {data.quarterSentence}
      </Text>
      {expanded && (
        <View style={styles.expandedContent}>
          {data.gameForming ? (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionLabel}>GAME FORMING</Text>
              <Text style={styles.expandedSectionBody}>{data.gameForming}</Text>
            </View>
          ) : null}
          {data.progression ? (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionLabel}>PROGRESSION</Text>
              <Text style={styles.expandedSectionBody}>{data.progression}</Text>
            </View>
          ) : null}
          {data.consistency ? (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionLabel}>CONSISTENCY</Text>
              <Text style={styles.expandedSectionBody}>{data.consistency}</Text>
            </View>
          ) : null}
          {data.bodyCheck ? (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionLabel}>BODY CHECK</Text>
              <Text style={styles.expandedSectionBody}>{data.bodyCheck}</Text>
            </View>
          ) : null}
          {data.nextQuarterPriorities?.length > 0 && (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionLabel}>NEXT QUARTER PRIORITIES</Text>
              {data.nextQuarterPriorities.map((p, i) => (
                <Text key={i} style={styles.expandedSectionBody}>
                  {i + 1}. {p}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}
      <View style={styles.readMoreRow}>
        <Text style={styles.readMoreLink}>
          {expanded ? 'Collapse' : 'Read Full Review'}
        </Text>
        {!expanded && <Icons.ChevronRight size={16} color={colors.gold} />}
      </View>
    </Pressable>
  );
}
