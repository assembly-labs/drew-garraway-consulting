/**
 * WeeklyMessageView — Mode B latest weekly insight display.
 *
 * Renders paragraphs sequentially with typewriter animation on first view.
 * ENH-09: Completed paragraphs use LinkedText for tappable technique mentions.
 * ENH-10: "Tell me more" link after signoff for single-exchange follow-up.
 *
 * Extracted from InsightsScreen.tsx.
 */

import React, { useMemo, useRef, useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useInsightTypewriter } from '../../hooks/useInsightTypewriter';
import { insightChatService } from '../../services/insights-service';
import type { Insight, ChatMessage } from '../../types/insights-types';
import type { Session } from '../../types/mvp-types';
import { normalizeInsightData, formatWeekRange } from './helpers';
import { EmberText } from './EmberText';
import { LinkedText } from './LinkedText';
import { SessionMiniCard } from './SessionMiniCard';
import { styles } from './styles';

export function WeeklyMessageView({
  insight,
  isNew,
  onViewed,
  weekSessions,
}: {
  insight: Insight;
  isNew: boolean;
  onViewed: () => void;
  weekSessions?: Session[];
}) {
  const navigation = useNavigation<any>();
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

  // ENH-09: Track which technique is expanded (shows session mini-cards)
  const [expandedTechnique, setExpandedTechnique] = useState<{
    technique: string;
    sessionIds: string[];
  } | null>(null);

  const handleTechniquePress = useCallback(
    (technique: string, sessionIds: string[]) => {
      setExpandedTechnique((prev) =>
        prev?.technique === technique ? null : { technique, sessionIds }
      );
    },
    []
  );

  const handleSessionPress = useCallback(
    (sessionId: string) => {
      navigation.navigate('JournalTab', {
        screen: 'SessionDetail',
        params: { sessionId },
      });
    },
    [navigation]
  );

  // ENH-10: Tell Me More state
  const [followUpResponse, setFollowUpResponse] = useState<string | null>(null);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const followUpChecked = useRef(false);

  // Check for existing conversation on mount/revisit
  React.useEffect(() => {
    if (followUpChecked.current) return;
    followUpChecked.current = true;
    insightChatService.getConversation(insight.id).then((conv) => {
      if (conv && conv.messages.length >= 2) {
        const assistantMsg = conv.messages.find((m: ChatMessage) => m.role === 'assistant');
        if (assistantMsg) setFollowUpResponse(assistantMsg.content);
      }
    });
  }, [insight.id]);

  const handleTellMeMore = useCallback(async () => {
    if (followUpLoading || followUpResponse) return;
    setFollowUpLoading(true);
    try {
      // Serialize insight text for context
      const insightText = normalized.paragraphs.map((p) => p.text).join('\n\n');
      const response = await insightChatService.tellMeMore(
        insight.id,
        insight.tier,
        insightText
      );
      setFollowUpResponse(response.message);
    } catch (err) {
      console.error('[ENH-10] Tell me more failed:', err);
      setFollowUpResponse(null);
    } finally {
      setFollowUpLoading(false);
    }
  }, [followUpLoading, followUpResponse, normalized, insight.id, insight.tier]);

  const weekLabel = formatWeekRange(insight.period_start, insight.period_end);

  // Expanded session cards (ENH-09)
  const expandedSessions = useMemo(() => {
    if (!expandedTechnique || !weekSessions) return [];
    return weekSessions.filter((s) =>
      expandedTechnique.sessionIds.includes(s.id)
    );
  }, [expandedTechnique, weekSessions]);

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

        // ENH-09: Use LinkedText for completed paragraphs (technique linking)
        if (paraComplete && weekSessions && weekSessions.length > 0) {
          return (
            <LinkedText
              key={i}
              text={para.text}
              sessions={weekSessions}
              onTechniquePress={handleTechniquePress}
              style={[styles.paragraphText, i < normalized.paragraphs.length - 1 && styles.paragraphSpacing]}
            />
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

      {/* ENH-09: Expanded technique → session mini-cards */}
      {expandedTechnique && expandedSessions.length > 0 && (
        <View style={styles.expandedTechniqueSection}>
          {expandedSessions.map((session) => (
            <SessionMiniCard
              key={session.id}
              session={session}
              highlightTechnique={expandedTechnique.technique}
              onPress={() => handleSessionPress(session.id)}
            />
          ))}
        </View>
      )}

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

      {/* ENH-10: Tell Me More */}
      {(isComplete || !isNew) ? (
        <View>
          {followUpLoading ? (
            <Text style={styles.followUpLoading}>Thinking...</Text>
          ) : followUpResponse ? (
            <View style={styles.followUpResponse}>
              <Text style={styles.followUpResponseText}>{followUpResponse}</Text>
            </View>
          ) : (
            <Pressable onPress={handleTellMeMore} hitSlop={8}>
              <Text style={styles.tellMeMoreLink}>Tell me more</Text>
            </Pressable>
          )}
        </View>
      ) : null}
    </Pressable>
  );
}
