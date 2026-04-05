/**
 * CollapsedWeekRow — Collapsed/expandable row for older weekly insights.
 *
 * Extracted from InsightsScreen.tsx.
 */

import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors } from '../../config/design-tokens';
import { Icons } from '../../components/Icons';
import type { Insight } from '../../types/insights-types';
import { normalizeInsightData, formatPeriodLabel } from './helpers';
import { BoldText } from './BoldText';
import { styles } from './styles';

export function CollapsedWeekRow({
  insight,
  expanded,
  onToggle,
}: {
  insight: Insight;
  expanded: boolean;
  onToggle: () => void;
}) {
  const normalized = useMemo(
    () => normalizeInsightData(insight.insight_data),
    [insight.insight_data]
  );

  const weekLabel = formatPeriodLabel(insight);

  return (
    <View style={styles.collapsedWeekCard}>
      <Pressable
        style={styles.collapsedWeekRow}
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={`${weekLabel} — ${expanded ? 'collapse' : 'expand'}`}
      >
        <Text style={styles.collapsedWeekLabel}>{weekLabel}</Text>
        {expanded ? (
          <Icons.ChevronDown size={16} color={colors.gray500} />
        ) : (
          <Icons.ChevronRight size={16} color={colors.gray500} />
        )}
      </Pressable>

      {expanded && (
        <View style={styles.collapsedWeekContent}>
          {normalized.paragraphs.map((para, i) => {
            if (para.isWatch) {
              return (
                <View key={i} style={styles.watchParagraph}>
                  <BoldText
                    text={para.text}
                    style={styles.watchParagraphText}
                    boldStyle={styles.paragraphBold}
                  />
                  {para.defer ? (
                    <Text style={styles.watchDefer}>{para.defer}</Text>
                  ) : null}
                </View>
              );
            }
            return (
              <BoldText
                key={i}
                text={para.text}
                style={[styles.paragraphText, i < normalized.paragraphs.length - 1 && styles.paragraphSpacing]}
                boldStyle={styles.paragraphBold}
              />
            );
          })}
          {normalized.focusNext ? (
            <View style={styles.focusSection}>
              <Text style={styles.focusLabel}>THIS WEEK, TRY THIS</Text>
              <Text style={styles.focusBody}>{normalized.focusNext}</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}
