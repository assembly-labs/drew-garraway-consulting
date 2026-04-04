/**
 * PreInsightSection — Mode A pre-insight holding message.
 *
 * Contains QuoteTypewriter (tightly coupled internal component) and
 * PreInsightLimitation (the exported component). These are kept in one file
 * because PreInsightLimitation renders QuoteTypewriter.
 *
 * Extracted from InsightsScreen.tsx.
 */

import React, { useMemo, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useInsightTypewriter } from '../../hooks/useInsightTypewriter';
import { getRandomQuote } from '../../data/quotes';
import { EmberText } from './EmberText';
import { styles } from './styles';

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
// PRE-INSIGHT LIMITATION (exported)
// ===========================================

export function PreInsightLimitation({
  limitation,
  belt,
  gender,
  hasBeenSeen,
  onSeen,
}: {
  limitation: { message: string };
  belt: string;
  gender: string | null;
  hasBeenSeen: boolean;
  onSeen: () => void;
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
      {showQuote && (
        <QuoteTypewriter belt={belt} gender={gender} />
      )}
    </Pressable>
  );
}
