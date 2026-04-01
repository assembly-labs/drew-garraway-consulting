/**
 * useInsightTypewriter — Sequential paragraph typing animation for Insights screen.
 *
 * Ports the typewriter logic from GetStartedScreen's ChatBubble (25ms/char).
 * Handles sequential paragraph reveal, 200ms pause between paragraphs,
 * and a skip() escape hatch to reveal everything instantly.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export interface TypewriterParagraph {
  text: string;
  isWatch: boolean;
  defer?: string;
}

export interface TypewriterInput {
  paragraphs: TypewriterParagraph[];
  focusNext: string;
}

export interface TypewriterOutput {
  /** Array of revealed text strings. Length = paragraphs.length + 1 (last entry is focusNext) */
  revealedTexts: string[];
  /** Index of paragraph currently typing. -1 = not started, paragraphs.length = on focusNext, paragraphs.length + 1 = complete */
  activeIndex: number;
  /** True when everything is fully revealed */
  isComplete: boolean;
  /** Skip to reveal everything instantly */
  skip: () => void;
}

export function useInsightTypewriter(
  input: TypewriterInput | null,
  shouldAnimate: boolean
): TypewriterOutput {
  const totalItems = input ? input.paragraphs.length + 1 : 0; // +1 for focusNext
  const allTexts = input
    ? [...input.paragraphs.map((p) => p.text), input.focusNext]
    : [];

  const [revealedTexts, setRevealedTexts] = useState<string[]>(() =>
    shouldAnimate ? allTexts.map(() => '') : [...allTexts]
  );
  const [activeIndex, setActiveIndex] = useState(shouldAnimate ? -1 : totalItems);
  const [isComplete, setIsComplete] = useState(!shouldAnimate);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const charIndexRef = useRef(0);
  const activeIndexRef = useRef(shouldAnimate ? -1 : totalItems);
  const skippedRef = useRef(false);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const skip = useCallback(() => {
    if (skippedRef.current || !input) return;
    skippedRef.current = true;
    cleanup();
    setRevealedTexts([...allTexts]);
    setActiveIndex(totalItems);
    setIsComplete(true);
  }, [input, allTexts, totalItems, cleanup]);

  useEffect(() => {
    if (!shouldAnimate || !input || skippedRef.current) return;

    const typeNextChar = () => {
      const idx = activeIndexRef.current;
      if (idx >= totalItems) {
        setIsComplete(true);
        return;
      }

      const fullText = allTexts[idx];
      if (charIndexRef.current >= fullText.length) {
        // Paragraph complete — pause then move to next
        timerRef.current = setTimeout(() => {
          activeIndexRef.current += 1;
          charIndexRef.current = 0;
          setActiveIndex(activeIndexRef.current);
          if (activeIndexRef.current < totalItems) {
            timerRef.current = setTimeout(typeNextChar, 25);
          } else {
            setIsComplete(true);
          }
        }, 200);
        return;
      }

      charIndexRef.current += 1;
      setRevealedTexts((prev) => {
        const next = [...prev];
        next[idx] = fullText.slice(0, charIndexRef.current);
        return next;
      });
      timerRef.current = setTimeout(typeNextChar, 25);
    };

    // Initial delay before first paragraph begins
    timerRef.current = setTimeout(() => {
      activeIndexRef.current = 0;
      charIndexRef.current = 0;
      setActiveIndex(0);
      typeNextChar();
    }, 150);

    return cleanup;
  }, [shouldAnimate, input]);

  return { revealedTexts, activeIndex, isComplete, skip };
}
