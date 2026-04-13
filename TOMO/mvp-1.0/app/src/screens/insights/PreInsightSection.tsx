/**
 * PreInsightSection — Mode A pre-insight holding message.
 *
 * Contains QuoteTypewriter (tightly coupled internal component),
 * PreInsightLimitation (the exported component), and
 * ReturnWelcome (ENH-06: warm re-entry after 14+ day gap).
 *
 * Extracted from InsightsScreen.tsx.
 */

import React, { useMemo, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useInsightTypewriter } from '../../hooks/useInsightTypewriter';
import { getRandomQuote } from '../../data/quotes';
import { EmberText } from './EmberText';
import { styles } from './styles';
import type { Insight } from '../../types/insights-types';
import { CollapsedWeekRow } from './CollapsedWeekRow';

// ===========================================
// QUOTE TYPEWRITER (internal — not exported)
// ===========================================

function QuoteTypewriter({
  belt,
  gender,
}: {
  belt: string;
  gender: string | null;
}) {
  const quote = useMemo(
    () => getRandomQuote((belt as any) || 'global', [], gender),
    [] // fresh quote on each mount
  );

  const input = useMemo(
    () => ({
      paragraphs: [{ text: `"${quote.text}"`, isWatch: false }],
      focusNext: '',
    }),
    [quote.text]
  );

  const { revealedTexts, isComplete, skip } = useInsightTypewriter(input, true);

  const displayText = revealedTexts[0] ?? '';
  const isAnimating = !isComplete;

  return (
    <Pressable style={styles.quoteContainer} onPress={skip}>
      <EmberText
        text={displayText}
        isAnimating={isAnimating}
        isComplete={isComplete}
        style={styles.quoteText}
      />
      {isComplete && (
        <Text style={styles.quoteAttribution}>{quote.attribution}</Text>
      )}
    </Pressable>
  );
}

// ===========================================
// RETURN WELCOME (ENH-06 — exported)
// ===========================================

/**
 * Shown when the user returns after a 14+ day gap and the limitation state
 * is 'no_sessions'. Replaces the standard limitation message with a warm,
 * gap-neutral re-entry message and the most recent insight if available.
 */
export function ReturnWelcome({
  lastInsight,
}: {
  lastInsight: Insight | null;
}) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <View style={styles.preInsightContainer}>
      <Text style={styles.preInsightText}>
        Pick up where you left off. The mat will be there.
      </Text>
      {lastInsight ? (
        <View style={styles.returnLastInsightWrapper}>
          <CollapsedWeekRow
            insight={lastInsight}
            expanded={expanded}
            onToggle={() => setExpanded((v) => !v)}
          />
        </View>
      ) : null}
    </View>
  );
}

// ===========================================
// PRE-INSIGHT LIMITATION (exported)
// ===========================================

export function PreInsightLimitation({
  limitation,
  belt,
  gender,
  hasBeenSeen,
  onSeen,
  hasPastInsights = false,
}: {
  limitation: { message: string };
  belt: string;
  gender: string | null;
  hasBeenSeen: boolean;
  onSeen: () => void;
  hasPastInsights?: boolean;
}) {
  const input = useMemo(
    () => ({ paragraphs: [{ text: limitation.message, isWatch: false }], focusNext: '' }),
    [limitation.message]
  );

  const { revealedTexts, isComplete, skip } = useInsightTypewriter(
    input,
    !hasBeenSeen
  );

  const hasNotifiedSeen = useRef(false);
  React.useEffect(() => {
    if (isComplete && !hasBeenSeen && !hasNotifiedSeen.current) {
      hasNotifiedSeen.current = true;
      onSeen();
    }
  }, [isComplete, hasBeenSeen, onSeen]);

  const displayText = hasBeenSeen ? limitation.message : (revealedTexts[0] ?? '');
  const isAnimating = !hasBeenSeen && !isComplete;
  const showQuote = isComplete || hasBeenSeen;

  return (
    <Pressable style={styles.preInsightContainer} onPress={skip}>
      <EmberText
        text={displayText}
        isAnimating={isAnimating}
        isComplete={isComplete || hasBeenSeen}
        style={styles.preInsightText}
      />
      {showQuote && !hasPastInsights && (
        <QuoteTypewriter belt={belt} gender={gender} />
      )}
    </Pressable>
  );
}
