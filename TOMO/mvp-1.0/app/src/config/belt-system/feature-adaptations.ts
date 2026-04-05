/**
 * Feature Adaptations by Belt Level
 *
 * Defines how each app feature adapts its behavior, content, and presentation
 * based on the user's belt level. This enables personalized experiences that
 * meet practitioners where they are in their journey.
 */

import type {
  FeatureAdaptation,
  DashboardAdaptation,
  SessionLoggerAdaptation,
  ChatbotAdaptation,
  VideoTutorialAdaptation,
  BeltProgressAdaptation,
  ProfilingAdaptation,
} from './types';

// ===========================================
// DASHBOARD ADAPTATIONS
// ===========================================

export const dashboardAdaptation: FeatureAdaptation<DashboardAdaptation> = {
  featureId: 'dashboard',
  featureName: 'Dashboard',
  description: 'Main dashboard metrics, insights, and visualization preferences',
  adaptations: {
    white: {
      primaryMetric: 'session_streak',
      secondaryMetrics: ['sessions_this_week', 'total_sessions'],
      insightFocus: 'survival_skills',
      celebrationThreshold: 10, // Celebrate every 10 sessions
      streakEmphasis: 'high', // Consistency is critical for white belts
      showCompetitionStats: false,
      progressVisualization: 'survival',
    },
    blue: {
      primaryMetric: 'technique_variety',
      secondaryMetrics: ['session_streak', 'sparring_rounds', 'time_at_belt'],
      insightFocus: 'game_development',
      celebrationThreshold: 25,
      streakEmphasis: 'medium',
      showCompetitionStats: true,
      progressVisualization: 'breadth',
    },
    purple: {
      primaryMetric: 'sparring_rounds',
      secondaryMetrics: ['teaching_sessions', 'technique_variety', 'submission_ratio'],
      insightFocus: 'systems_thinking',
      celebrationThreshold: 50,
      streakEmphasis: 'medium',
      showCompetitionStats: true,
      progressVisualization: 'depth',
    },
    brown: {
      primaryMetric: 'teaching_sessions',
      secondaryMetrics: ['sparring_rounds', 'submission_ratio', 'time_at_belt'],
      insightFocus: 'refinement',
      celebrationThreshold: 100,
      streakEmphasis: 'low', // At this level, they train because they love it
      showCompetitionStats: true,
      progressVisualization: 'refinement',
    },
    black: {
      primaryMetric: 'teaching_sessions',
      secondaryMetrics: ['total_sessions', 'sparring_rounds'],
      insightFocus: 'legacy',
      celebrationThreshold: 250,
      streakEmphasis: 'low',
      showCompetitionStats: true,
      progressVisualization: 'refinement',
    },
  },
};

// ===========================================
// SESSION LOGGER ADAPTATIONS
// ===========================================

export const sessionLoggerAdaptation: FeatureAdaptation<SessionLoggerAdaptation> = {
  featureId: 'session-logger',
  featureName: 'Session Logger',
  description: 'Voice/text logging prompts and post-session messaging',
  adaptations: {
    white: {
      promptStyle: 'encouraging',
      suggestedPrompts: [
        'What positions did you find yourself in today?',
        'Did anything feel a little less chaotic than before?',
        'What submission caught you the most?',
        'Did you remember to breathe?',
      ],
      techniqueSuggestionCount: 5, // Keep it simple
      showAdvancedFields: false,
      defaultDuration: 60,
      sparringEmphasis: 'low', // Don't stress them about rounds
      postSessionMessage:
        "Great work showing up. Consistency beats intensity - you're building your foundation.",
    },
    blue: {
      promptStyle: 'neutral',
      suggestedPrompts: [
        'What techniques did you work on?',
        'Any chains or combinations you tried?',
        'How did your guard feel today?',
        'What gave you the most trouble?',
      ],
      techniqueSuggestionCount: 10,
      showAdvancedFields: true,
      defaultDuration: 90,
      sparringEmphasis: 'medium',
      postSessionMessage:
        'Session logged. Keep developing your game - the plateau is part of the process.',
    },
    purple: {
      promptStyle: 'analytical',
      suggestedPrompts: [
        'What systems did you focus on?',
        'Any teaching moments today?',
        'How did your A-game perform?',
        'What adjustments are you making?',
      ],
      techniqueSuggestionCount: 15,
      showAdvancedFields: true,
      defaultDuration: 90,
      sparringEmphasis: 'high',
      postSessionMessage: 'Logged. Your depth of understanding grows with each session.',
    },
    brown: {
      promptStyle: 'analytical',
      suggestedPrompts: [
        'What did you refine today?',
        'Any concepts you explored deeper?',
        'Who did you help on the mat?',
        'What felt effortless?',
      ],
      techniqueSuggestionCount: 20,
      showAdvancedFields: true,
      defaultDuration: 90,
      sparringEmphasis: 'high',
      postSessionMessage: 'Session captured. The final approach continues.',
    },
    black: {
      promptStyle: 'analytical',
      suggestedPrompts: [
        'What did you teach today?',
        'Any insights from your rolls?',
        'What are you currently exploring?',
        'How did your students progress?',
      ],
      techniqueSuggestionCount: 25,
      showAdvancedFields: true,
      defaultDuration: 120,
      sparringEmphasis: 'medium', // Balance teaching and training
      postSessionMessage: 'Training logged. The journey continues.',
    },
  },
};

// ===========================================
// CHATBOT/AI RESPONSE ADAPTATIONS
// ===========================================

export const chatbotAdaptation: FeatureAdaptation<ChatbotAdaptation> = {
  featureId: 'chatbot',
  featureName: 'AI Assistant',
  description: 'Tone, vocabulary, and content depth for AI responses',
  adaptations: {
    white: {
      toneProfile: {
        primary: 'supportive',
        warmth: 'high',
        directness: 'gentle',
      },
      responseDepth: 'simple',
      technicalVocabulary: 'basic',
      encouragementLevel: 'high',
      assumedKnowledge: ['basic position names', 'tapping means submit'],
      avoidTopics: [
        'advanced leg locks',
        'competition strategy',
        'teaching methodology',
        'berimbolo',
        'saddle positions',
      ],
      emphasizeTopics: [
        'survival',
        'escapes',
        'basic sweeps',
        'position recognition',
        'when to tap',
        'relaxation',
      ],
    },
    blue: {
      toneProfile: {
        primary: 'coaching',
        warmth: 'moderate',
        directness: 'balanced',
      },
      responseDepth: 'moderate',
      technicalVocabulary: 'intermediate',
      encouragementLevel: 'moderate',
      assumedKnowledge: [
        'all major positions',
        'basic submissions',
        'guard types',
        'passing concepts',
        'competition rules',
      ],
      avoidTopics: ['advanced leg lock systems', 'heel hook reaping rules'],
      emphasizeTopics: [
        'game development',
        'combinations',
        'guard retention',
        'passing systems',
        'competition preparation',
      ],
    },
    purple: {
      toneProfile: {
        primary: 'collaborative',
        warmth: 'moderate',
        directness: 'direct',
      },
      responseDepth: 'detailed',
      technicalVocabulary: 'advanced',
      encouragementLevel: 'minimal',
      assumedKnowledge: [
        'all guard systems',
        'leg lock entries',
        'combination attacks',
        'teaching fundamentals',
        'competition strategy',
      ],
      avoidTopics: [], // Purple belts can handle any topic
      emphasizeTopics: [
        'systems thinking',
        'teaching methodology',
        'game refinement',
        'conceptual principles',
      ],
    },
    brown: {
      toneProfile: {
        primary: 'peer',
        warmth: 'professional',
        directness: 'direct',
      },
      responseDepth: 'comprehensive',
      technicalVocabulary: 'expert',
      encouragementLevel: 'minimal',
      assumedKnowledge: [
        'complete technical knowledge',
        'teaching experience',
        'competition at high level',
        'injury management',
      ],
      avoidTopics: [],
      emphasizeTopics: [
        'refinement',
        'efficiency',
        'teaching excellence',
        'legacy building',
      ],
    },
    black: {
      toneProfile: {
        primary: 'peer',
        warmth: 'professional',
        directness: 'direct',
      },
      responseDepth: 'comprehensive',
      technicalVocabulary: 'expert',
      encouragementLevel: 'minimal',
      assumedKnowledge: ['everything - complete mastery assumed'],
      avoidTopics: [],
      emphasizeTopics: [
        'innovation',
        'teaching methodology',
        'student development',
        'art contribution',
      ],
    },
  },
};

// ===========================================
// VIDEO TUTORIAL ADAPTATIONS
// ===========================================

export const videoTutorialAdaptation: FeatureAdaptation<VideoTutorialAdaptation> = {
  featureId: 'video-tutorials',
  featureName: 'Video Tutorials',
  description: 'Recommended video content and playlist curation',
  adaptations: {
    white: {
      recommendedCategories: [
        'escapes',
        'basic-sweeps',
        'closed-guard-fundamentals',
        'mount-defense',
        'back-escape',
        'posture',
      ],
      difficultyRange: { min: 1, max: 3 },
      prioritizeDefense: true,
      includeConceptual: false, // Keep it practical
      weeklyRecommendationCount: 3,
      personalizedPlaylistName: 'White Belt Essentials',
    },
    blue: {
      recommendedCategories: [
        'guard-systems',
        'passing-fundamentals',
        'submission-chains',
        'half-guard',
        'open-guard-intro',
        'takedowns',
      ],
      difficultyRange: { min: 2, max: 5 },
      prioritizeDefense: false, // Balance offense and defense
      includeConceptual: true,
      weeklyRecommendationCount: 5,
      personalizedPlaylistName: 'Blue Belt Development',
    },
    purple: {
      recommendedCategories: [
        'advanced-guards',
        'leg-locks',
        'combination-attacks',
        'guard-retention',
        'pressure-passing',
        'conceptual',
      ],
      difficultyRange: { min: 4, max: 8 },
      prioritizeDefense: false,
      includeConceptual: true,
      weeklyRecommendationCount: 5,
      personalizedPlaylistName: 'Purple Belt Systems',
    },
    brown: {
      recommendedCategories: [
        'advanced-leg-locks',
        'competition-footage',
        'high-level-concepts',
        'teaching-methodology',
        'game-refinement',
      ],
      difficultyRange: { min: 6, max: 10 },
      prioritizeDefense: false,
      includeConceptual: true,
      weeklyRecommendationCount: 3, // Quality over quantity
      personalizedPlaylistName: 'Brown Belt Refinement',
    },
    black: {
      recommendedCategories: [
        'competition-analysis',
        'teaching-methodology',
        'innovation',
        'high-level-concepts',
      ],
      difficultyRange: { min: 7, max: 10 },
      prioritizeDefense: false,
      includeConceptual: true,
      weeklyRecommendationCount: 2,
      personalizedPlaylistName: 'Black Belt Mastery',
    },
  },
};

// ===========================================
// BELT PROGRESS SCREEN ADAPTATIONS
// ===========================================

export const beltProgressAdaptation: FeatureAdaptation<BeltProgressAdaptation> = {
  featureId: 'belt-progress',
  featureName: 'Belt Progress',
  description: 'Progress visualization and milestone emphasis',
  adaptations: {
    white: {
      showTimeEstimate: false, // Don't stress about timeline
      emphasizeRequirements: 'technical',
      milestoneGranularity: 'stripes',
      comparisonBenchmark: 'none', // Don't compare - everyone's journey is different
      motivationalFraming:
        'Focus on showing up consistently. Every class builds your foundation.',
    },
    blue: {
      showTimeEstimate: true, // They can handle it now
      emphasizeRequirements: 'balanced',
      milestoneGranularity: 'both',
      comparisonBenchmark: 'average',
      motivationalFraming:
        'You have the fundamentals. Now develop your personal style and game.',
    },
    purple: {
      showTimeEstimate: true,
      emphasizeRequirements: 'subjective', // Character and teaching matter more
      milestoneGranularity: 'skills',
      comparisonBenchmark: 'none', // At this level, comparison is irrelevant
      motivationalFraming:
        'Purple belt is where you develop your BJJ identity. Teach others to deepen your understanding.',
    },
    brown: {
      showTimeEstimate: false, // It happens when it happens
      emphasizeRequirements: 'subjective',
      milestoneGranularity: 'skills',
      comparisonBenchmark: 'none',
      motivationalFraming:
        'The final approach. Refine what you have, close remaining gaps, prepare for black belt.',
    },
    black: {
      showTimeEstimate: false,
      emphasizeRequirements: 'subjective',
      milestoneGranularity: 'skills',
      comparisonBenchmark: 'none',
      motivationalFraming:
        'The degree system continues, but the focus is now on contribution to the art.',
    },
  },
};

// ===========================================
// PROGRESSIVE PROFILING ADAPTATIONS
// ===========================================

export const profilingAdaptation: FeatureAdaptation<ProfilingAdaptation> = {
  featureId: 'profiling',
  featureName: 'Progressive Profiling',
  description: 'How and when we collect additional profile data',
  adaptations: {
    white: {
      questionTiming: 'delayed', // They're overwhelmed enough
      questionStyle: 'friendly',
      skipTolerance: 3,
      priorityQuestions: ['trainingStartDate', 'targetFrequency'],
    },
    blue: {
      questionTiming: 'standard',
      questionStyle: 'friendly',
      skipTolerance: 3,
      priorityQuestions: ['gymName', 'trainingGoals', 'stripes'],
    },
    purple: {
      questionTiming: 'early', // They're invested, get data faster
      questionStyle: 'professional',
      skipTolerance: 2,
      priorityQuestions: ['currentBeltDate', 'trainingGoals'],
    },
    brown: {
      questionTiming: 'early',
      questionStyle: 'professional',
      skipTolerance: 2,
      priorityQuestions: ['currentBeltDate'],
    },
    black: {
      questionTiming: 'early',
      questionStyle: 'professional',
      skipTolerance: 1, // Expect commitment at this level
      priorityQuestions: ['currentBeltDate'],
    },
  },
};

// ===========================================
// AGGREGATED EXPORTS
// ===========================================

export const allFeatureAdaptations = {
  dashboard: dashboardAdaptation,
  sessionLogger: sessionLoggerAdaptation,
  chatbot: chatbotAdaptation,
  videoTutorials: videoTutorialAdaptation,
  beltProgress: beltProgressAdaptation,
  profiling: profilingAdaptation,
};

/**
 * Get adaptation for a specific feature and belt
 */
export function getFeatureAdaptation<T>(
  featureId: keyof typeof allFeatureAdaptations,
  belt: string
): T {
  const feature = allFeatureAdaptations[featureId];
  return feature.adaptations[belt as keyof typeof feature.adaptations] as T;
}

/**
 * Get dashboard adaptation for a belt
 */
export function getDashboardAdaptation(belt: string): DashboardAdaptation {
  return getFeatureAdaptation<DashboardAdaptation>('dashboard', belt);
}

/**
 * Get session logger adaptation for a belt
 */
export function getSessionLoggerAdaptation(belt: string): SessionLoggerAdaptation {
  return getFeatureAdaptation<SessionLoggerAdaptation>('sessionLogger', belt);
}

/**
 * Get chatbot adaptation for a belt
 */
export function getChatbotAdaptation(belt: string): ChatbotAdaptation {
  return getFeatureAdaptation<ChatbotAdaptation>('chatbot', belt);
}

/**
 * Get video tutorial adaptation for a belt
 */
export function getVideoTutorialAdaptation(belt: string): VideoTutorialAdaptation {
  return getFeatureAdaptation<VideoTutorialAdaptation>('videoTutorials', belt);
}
