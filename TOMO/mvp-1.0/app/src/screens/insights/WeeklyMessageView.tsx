/**
 * WeeklyMessageView — Mode B latest weekly insight display.
 *
 * Renders paragraphs sequentially with typewriter animation on first view.
 *
 * Extracted from InsightsScreen.tsx.
 */

import React, { useMemo, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useInsightTypewriter } from '../../hooks/useInsightTypewriter';
import type { Insight } from '../../types/insights-types';
import { normalizeInsightData, formatWeekRange } from './helpers';
import { EmberText } from './EmberText';
import { styles } from './styles';

export function WeeklyMessageView({
  insight,
  isNew,
  onViewed,
}: {
  insight: Insight;
  isNew: boolean;
  onViewed: () => void;
}) {
  const normalized = useMemo(
    () => normalizeInsightData(insight.insight_data),
    [insight.insight_data]
  );

  const { revealedTexts, activeIndex, isComplete, skip } = useInsightTypewriter(
    normalized,
    isNew
  );

  // Mark as viewed once typewriter completes
  const hasMarkedViewed = useRef(false);
  React.useEffect(() => {
    if (isComplete && isNew && !hasMarkedViewed.current) {
      hasMarkedViewed.current = true;
      onViewed();
    }
  }, [isComplete, isNew, onViewed]);

  const weekLabel = formatWeekRange(insight.period_start, insight.period_end);

  return (
    <Pressable style={styles.weeklyMessageContainer} onPress={skip} accessible={false}>
      {/* Week header */}
      <Text style={styles.weekRangeLabel}>{weekLabel}</Text>

      {/* Paragraphs */}
      {normalized.paragraphs.map((para, i) => {
        const displayText = isNew ? (revealedTexts[i] ?? '') : para.text;
        // Only show paragraphs that have started (activeIndex reached them)
        const hasStarted = !isNew || activeIndex >= i;
        if (!hasStarted) return null;

        // Is this the paragraph currently being typed?
        const isTypingThis = isNew && activeIndex === i && !isComplete;
        // Is this paragraph done (moved on to next or complete)?
        const paraComplete = !isNew || isComplete || activeIndex > i;

        if (para.isWatch) {
          return (
            <View key={i} style={styles.watchParagraph}>
              <EmberText
                text={displayText}
                isAnimating={isTypingThis}
                isComplete={paraComplete}
                style={styles.watchParagraphText}
              />
              {para.defer && (isComplete || activeIndex > i) ? (
                <Text style={styles.watchDefer}>{para.defer}</Text>
              ) : null}
            </View>
          );
        }

        return (
          <EmberText
            key={i}
            text={displayText}
            isAnimating={isTypingThis}
            isComplete={paraComplete}
            style={[styles.paragraphText, i < normalized.paragraphs.length - 1 && styles.paragraphSpacing]}
          />
        );
      })}

      {/* Focus section — shown after all paragraphs complete */}
      {normalized.focusNext ? (() => {
        const focusIdx = normalized.paragraphs.length;
        const focusText = isNew ? (revealedTexts[focusIdx] ?? '') : normalized.focusNext;
        const isTypingFocus = isNew && activeIndex === focusIdx && !isComplete;
        const focusDone = !isNew || isComplete || activeIndex > focusIdx;
        return (
          <View
            style={[
              styles.focusSection,
              (!isNew || (isComplete || activeIndex >= focusIdx)) ? {} : styles.focusSectionHidden,
            ]}
          >
            <Text style={styles.focusLabel}>THIS WEEK, TRY THIS</Text>
            <EmberText
              text={focusText}
              isAnimating={isTypingFocus}
              isComplete={focusDone}
              style={styles.focusBody}
            />
          </View>
        );
      })() : null}

      {/* Signoff */}
      {(isComplete || !isNew) ? (
        <Text style={styles.signoff}>
          Your coach knows your game better than any app.
        </Text>
      ) : null}
    </Pressable>
  );
}
