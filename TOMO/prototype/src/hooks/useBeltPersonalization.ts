/**
 * useBeltPersonalization Hook
 *
 * React hook that provides access to the belt personalization system.
 * Integrates with UserProfileContext to provide belt-specific adaptations,
 * risk detection, and personalized content.
 *
 * Usage:
 *   const {
 *     profile,              // Belt psychology profile
 *     dashboard,            // Dashboard adaptations
 *     sessionLogger,        // Session logger adaptations
 *     chatbot,              // AI response adaptations
 *     isInRiskWindow,       // Whether user is in dropout risk window
 *     analyzeJournal,       // Analyze journal text for patterns
 *   } = useBeltPersonalization();
 */

import { useMemo, useCallback } from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import {
  getBeltProfile,
  getDashboardAdaptation,
  getSessionLoggerAdaptation,
  getChatbotAdaptation,
  getVideoTutorialAdaptation,
  isInDropoutRiskWindow,
  getCurrentPlateauPattern,
  analyzeJournalEntry,
  quickSentimentCheck,
  type BeltPsychologyProfile,
  type DashboardAdaptation,
  type SessionLoggerAdaptation,
  type ChatbotAdaptation,
  type VideoTutorialAdaptation,
  type JournalAnalysisResult,
  type PlateauPattern,
} from '../config/belt-system';

// ===========================================
// HOOK RETURN TYPE
// ===========================================

export interface BeltPersonalizationResult {
  // Belt psychology profile
  profile: BeltPsychologyProfile;

  // Feature adaptations
  dashboard: DashboardAdaptation;
  sessionLogger: SessionLoggerAdaptation;
  chatbot: ChatbotAdaptation;
  videoTutorials: VideoTutorialAdaptation;

  // Risk detection
  isInRiskWindow: boolean;
  currentPlateau: PlateauPattern | null;
  daysAtBelt: number;
  monthsAtBelt: number;

  // Utility functions
  analyzeJournal: (sessionId: string, text: string) => JournalAnalysisResult;
  checkSentiment: (text: string) => 'positive' | 'neutral' | 'negative';
  getPostSessionMessage: () => string;
  getSuggestedPrompts: () => string[];
}

// ===========================================
// MAIN HOOK
// ===========================================

export function useBeltPersonalization(): BeltPersonalizationResult {
  const { profile: userProfile } = useUserProfile();
  const belt = userProfile.belt;

  // Calculate time at belt
  const { daysAtBelt, monthsAtBelt } = useMemo(() => {
    if (!userProfile.currentBeltDate) {
      return { daysAtBelt: 0, monthsAtBelt: 0 };
    }

    const beltDate = new Date(userProfile.currentBeltDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - beltDate.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);

    return { daysAtBelt: days, monthsAtBelt: months };
  }, [userProfile.currentBeltDate]);

  // Get belt psychology profile
  const profile = useMemo(() => getBeltProfile(belt), [belt]);

  // Get feature adaptations
  const dashboard = useMemo(() => getDashboardAdaptation(belt), [belt]);
  const sessionLogger = useMemo(() => getSessionLoggerAdaptation(belt), [belt]);
  const chatbot = useMemo(() => getChatbotAdaptation(belt), [belt]);
  const videoTutorials = useMemo(() => getVideoTutorialAdaptation(belt), [belt]);

  // Check if in dropout risk window
  const isInRiskWindow = useMemo(
    () => isInDropoutRiskWindow(belt, monthsAtBelt),
    [belt, monthsAtBelt]
  );

  // Get current plateau pattern if applicable
  const currentPlateau = useMemo(
    () => getCurrentPlateauPattern(belt, monthsAtBelt),
    [belt, monthsAtBelt]
  );

  // Journal analysis function
  const analyzeJournal = useCallback(
    (sessionId: string, text: string): JournalAnalysisResult => {
      return analyzeJournalEntry(sessionId, text, belt);
    },
    [belt]
  );

  // Quick sentiment check
  const checkSentiment = useCallback((text: string) => {
    return quickSentimentCheck(text);
  }, []);

  // Get post-session message
  const getPostSessionMessage = useCallback(() => {
    return sessionLogger.postSessionMessage;
  }, [sessionLogger]);

  // Get suggested prompts
  const getSuggestedPrompts = useCallback(() => {
    return sessionLogger.suggestedPrompts;
  }, [sessionLogger]);

  return {
    profile,
    dashboard,
    sessionLogger,
    chatbot,
    videoTutorials,
    isInRiskWindow,
    currentPlateau,
    daysAtBelt,
    monthsAtBelt,
    analyzeJournal,
    checkSentiment,
    getPostSessionMessage,
    getSuggestedPrompts,
  };
}

// ===========================================
// CONVENIENCE HOOKS
// ===========================================

/**
 * Get just the dashboard adaptations
 */
export function useDashboardAdaptation(): DashboardAdaptation {
  const { dashboard } = useBeltPersonalization();
  return dashboard;
}

/**
 * Get just the session logger adaptations
 */
export function useSessionLoggerAdaptation(): SessionLoggerAdaptation {
  const { sessionLogger } = useBeltPersonalization();
  return sessionLogger;
}

/**
 * Get just the chatbot adaptations
 */
export function useChatbotAdaptation(): ChatbotAdaptation {
  const { chatbot } = useBeltPersonalization();
  return chatbot;
}

/**
 * Check if user is in a dropout risk window
 */
export function useDropoutRiskStatus(): {
  isInRiskWindow: boolean;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  message: string | null;
} {
  const { profile, isInRiskWindow } = useBeltPersonalization();

  const message = isInRiskWindow
    ? `You're at a common challenge point in your ${profile.belt} belt journey. This is normal - keep showing up.`
    : null;

  return {
    isInRiskWindow,
    riskLevel: profile.dropoutRiskLevel,
    message,
  };
}

/**
 * Get suggested content based on belt level
 */
export function useBeltSuggestedContent(): {
  insightFocus: string;
  videoCategories: string[];
  emphasizeTopics: string[];
} {
  const { dashboard, videoTutorials, chatbot } = useBeltPersonalization();

  return {
    insightFocus: dashboard.insightFocus,
    videoCategories: videoTutorials.recommendedCategories,
    emphasizeTopics: chatbot.emphasizeTopics,
  };
}

/**
 * Get motivational context for the user's current stage
 */
export function useBeltMotivation(): {
  stageName: string;
  mindsetShift: string;
  dominantMotivations: string[];
  encouragement: string;
} {
  const { profile } = useBeltPersonalization();

  // Generate encouragement based on belt
  const encouragementByBelt: Record<string, string> = {
    white:
      "Every black belt was once a white belt who didn't quit. Focus on showing up consistently.",
    blue:
      "Blue belt blues are temporary. You've proven you can do the hard thing - keep going.",
    purple:
      "Purple belt is where you develop your identity. Enjoy teaching - it deepens your own understanding.",
    brown:
      "The final approach. Refine what you have, and prepare for the responsibility ahead.",
    black: "Your journey continues. Teaching others is now your highest expression of the art.",
  };

  return {
    stageName: profile.stageName,
    mindsetShift: profile.mindsetShift,
    dominantMotivations: profile.dominantMotivations,
    encouragement: encouragementByBelt[profile.belt] || encouragementByBelt.white,
  };
}
