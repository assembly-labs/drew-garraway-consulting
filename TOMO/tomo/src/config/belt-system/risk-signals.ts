/**
 * Risk Signal Detection System
 *
 * Defines signals that indicate a practitioner may be at risk of dropping out.
 * Based on research identifying attendance patterns, sentiment changes, and
 * behavioral indicators that precede quitting.
 *
 * Key research findings:
 * - 70-90% of white belts quit before blue belt
 * - 50% of blue belts quit before purple
 * - Peak attrition windows: 3-6 months (white), first year post-promotion (blue)
 * - Warning signs: declining attendance, stopped asking questions, avoiding sparring
 */

import type { RiskSignal, Intervention, InterventionType } from './types';

// ===========================================
// RISK SIGNALS
// ===========================================

export const riskSignals: RiskSignal[] = [
  // =====================
  // ATTENDANCE SIGNALS
  // =====================
  {
    id: 'attendance-decline',
    category: 'attendance',
    name: 'Declining Attendance',
    description:
      'Training frequency has dropped significantly from user\'s established pattern',
    detectionMethod: 'session_frequency',
    warningThreshold: '50% reduction from 4-week average',
    criticalThreshold: '75% reduction from 4-week average',
    beltModifiers: {
      white: 1.5, // Higher risk at white belt
      blue: 1.3,
      purple: 1.0,
      brown: 0.7,
      black: 0.5,
    },
    timeToDropout: '2-4 weeks',
    interventionWindow: 'First week of decline',
    suggestedIntervention: 'gentle_checkin',
    interventionMessage: {
      white:
        "We noticed you haven't trained in a while. The hardest part of BJJ is walking through the door - but you've done it before and you can do it again.",
      blue:
        "Training gaps happen. Blue belt is a long journey with natural ebbs and flows. Your mat time still counts.",
      purple:
        "Life gets busy at purple belt - career, family, responsibilities. When you're ready, the mat will be there.",
      brown:
        "After years of training, rest is sometimes exactly what the body needs. Take care of yourself.",
      black: "Rest and recovery are part of the journey at every level.",
    },
  },
  {
    id: 'extended-gap',
    category: 'attendance',
    name: 'Extended Training Gap',
    description: 'No logged sessions for an extended period',
    detectionMethod: 'session_gap',
    warningThreshold: '14 days',
    criticalThreshold: '30 days',
    beltModifiers: {
      white: 1.8, // Very high risk for white belts with gaps
      blue: 1.4,
      purple: 1.0,
      brown: 0.8,
      black: 0.6,
    },
    timeToDropout: '1-2 months after gap starts',
    interventionWindow: 'Day 7-14 of gap',
    suggestedIntervention: 'gentle_checkin',
    interventionMessage: {
      white:
        "It's been a couple weeks since your last session. Remember: every expert was once a beginner who didn't quit.",
      blue:
        "We miss you on the mats. Blue belt blues are real, but so is your progress. Come back when ready.",
      purple:
        "Life happens. Your purple belt skills don't disappear. The community is here when you return.",
      brown:
        "Sometimes stepping away provides clarity. Your experience stays with you.",
      black: "Take the time you need. The art will be here.",
    },
  },
  {
    id: 'streak-break',
    category: 'attendance',
    name: 'Streak Broken',
    description: 'User broke a training streak they were maintaining',
    detectionMethod: 'streak_break',
    warningThreshold: '7+ day streak broken',
    criticalThreshold: '30+ day streak broken',
    beltModifiers: {
      white: 1.4,
      blue: 1.2,
      purple: 0.9,
      brown: 0.7,
      black: 0.5,
    },
    timeToDropout: '2-6 weeks',
    interventionWindow: 'Immediately after break',
    suggestedIntervention: 'encouragement',
    interventionMessage: {
      white:
        "Streaks break - it happens to everyone. The important thing is getting back on the mat, not the number.",
      blue:
        "A broken streak isn't failure - it's life. Start a new one when you're ready.",
      purple: "Consistency matters more than perfection. Pick it back up.",
      brown: "Experience teaches that streaks are less important than longevity.",
      black: "Rest is part of training.",
    },
  },

  // =====================
  // PLATEAU SIGNALS
  // =====================
  {
    id: 'technique-stagnation',
    category: 'plateau',
    name: 'Technique Stagnation',
    description: 'Logging the same techniques repeatedly without variety',
    detectionMethod: 'technique_variety',
    warningThreshold: 'Same 3 techniques for 3+ weeks',
    criticalThreshold: 'Same 3 techniques for 6+ weeks',
    beltModifiers: {
      white: 0.8, // White belts SHOULD focus on basics
      blue: 1.4, // Blue belts need variety for development
      purple: 1.2,
      brown: 0.9, // Brown belts may be refining
      black: 0.6,
    },
    timeToDropout: '1-3 months',
    interventionWindow: 'Week 3-4 of pattern',
    suggestedIntervention: 'plateau_support',
    interventionMessage: {
      white:
        "Focusing on a few techniques is exactly right at white belt. Depth before breadth.",
      blue:
        "Plateaus are part of the blue belt journey. Try exploring a new guard or passing style to reignite learning.",
      purple:
        "Systems thinking helps here - what if you added one new entry or finish to your A-game?",
      brown:
        "Refinement is the brown belt path. If it feels stale, try teaching what you know - it often reveals new depth.",
      black: "Mastery comes through deep exploration of the familiar.",
    },
  },
  {
    id: 'promotion-proximity-pre',
    category: 'plateau',
    name: 'Pre-Promotion Anxiety',
    description: 'User is approaching expected promotion timeline',
    detectionMethod: 'promotion_proximity',
    warningThreshold: 'Within 3 months of typical promotion',
    criticalThreshold: 'Past typical promotion window',
    beltModifiers: {
      white: 1.3,
      blue: 1.5, // Blue belt to purple is emotionally loaded
      purple: 1.2,
      brown: 0.9, // Brown belts usually have clarity
      black: 0.5,
    },
    timeToDropout: '2-4 months',
    interventionWindow: 'Ongoing',
    suggestedIntervention: 'goal_recalibration',
    interventionMessage: {
      white:
        "Blue belt comes when it comes. Focus on the training, not the promotion.",
      blue:
        "Purple belt isn't a destination - it's a transition to deeper understanding. Your coach sees your journey.",
      purple:
        "Brown belt means being ready for black belt responsibility. Enjoy purple - it's the last belt where learning is the primary focus.",
      brown:
        "Black belt promotion recognizes the person as much as the technique. Trust the process.",
      black: "Degree progression happens on its own timeline.",
    },
  },

  // =====================
  // PSYCHOLOGICAL SIGNALS
  // =====================
  {
    id: 'sparring-avoidance',
    category: 'psychological',
    name: 'Sparring Avoidance',
    description: 'Declining sparring rounds over time',
    detectionMethod: 'sparring_avoidance',
    warningThreshold: '50% reduction in sparring rounds',
    criticalThreshold: '0 sparring for 4+ sessions',
    beltModifiers: {
      white: 1.6, // Often fear-based at white belt
      blue: 1.4, // Could be blue belt blues
      purple: 1.2,
      brown: 1.0,
      black: 0.8,
    },
    timeToDropout: '1-2 months',
    interventionWindow: 'After 2 sessions with reduced sparring',
    suggestedIntervention: 'gentle_checkin',
    interventionMessage: {
      white:
        "Sparring anxiety is completely normal at white belt. Everyone goes through it. Light rolls count too.",
      blue:
        "If sparring feels less fun lately, that's a common blue belt experience. Try rolling with people who help you grow.",
      purple:
        "Taking a break from hard sparring can be healthy. Teaching rolls or positional sparring still count.",
      brown:
        "Your body knows what it needs. Light technical rolls can be just as valuable.",
      black: "Intentional sparring choices are part of sustainable training.",
    },
  },
  {
    id: 'negative-sentiment-trend',
    category: 'psychological',
    name: 'Negative Sentiment Trend',
    description: 'Journal entries showing declining sentiment over time',
    detectionMethod: 'sentiment_analysis',
    warningThreshold: '3 consecutive sessions with negative sentiment',
    criticalThreshold: '5+ sessions with negative sentiment',
    beltModifiers: {
      white: 1.5,
      blue: 1.6, // Blue belt blues are real
      purple: 1.2,
      brown: 1.0,
      black: 0.8,
    },
    timeToDropout: '3-6 weeks',
    interventionWindow: 'After 3rd negative session',
    suggestedIntervention: 'encouragement',
    interventionMessage: {
      white:
        "Tough sessions are part of the journey. Remember: a black belt is just a white belt who didn't quit.",
      blue:
        "Blue belt blues are one of the most discussed phenomena in BJJ. You're not alone - and it passes.",
      purple:
        "Even experienced practitioners have rough patches. What made you fall in love with BJJ originally?",
      brown:
        "After years on the mat, perspective helps: every challenge is temporary.",
      black: "The art continues to teach, even through difficulty.",
    },
  },

  // =====================
  // INJURY SIGNALS
  // =====================
  {
    id: 'injury-mentions',
    category: 'injury',
    name: 'Injury Mentions',
    description: 'Journal entries mention injury or pain',
    detectionMethod: 'injury_mentions',
    warningThreshold: '2 injury mentions in 2 weeks',
    criticalThreshold: '4+ injury mentions in month',
    beltModifiers: {
      white: 1.3, // Often just soreness, but concerning
      blue: 1.4, // Accumulated injuries common
      purple: 1.2,
      brown: 1.1,
      black: 1.0,
    },
    timeToDropout: '1-3 months',
    interventionWindow: 'After first mention',
    suggestedIntervention: 'injury_guidance',
    interventionMessage: {
      white:
        "Soreness is normal, but persistent pain isn't. Listen to your body - rest is part of training.",
      blue:
        "Blue belt injuries often come from overtraining. Recovery is a skill too.",
      purple:
        "After years of training, nagging injuries are common. Smart training is sustainable training.",
      brown:
        "Your body has given you a lot. Give it what it needs to keep going.",
      black: "Longevity in BJJ requires respecting your body's signals.",
    },
  },

  // =====================
  // BURNOUT SIGNALS
  // =====================
  {
    id: 'overtraining-pattern',
    category: 'burnout',
    name: 'Overtraining Pattern',
    description: 'Unsustainably high training frequency followed by sudden drop',
    detectionMethod: 'session_frequency',
    warningThreshold: '6+ sessions/week for 3+ weeks, then 50% drop',
    criticalThreshold: '6+ sessions/week for 4+ weeks, then 75% drop',
    beltModifiers: {
      white: 1.2,
      blue: 1.4, // Competition-focused blue belts overtrain
      purple: 1.3,
      brown: 1.0,
      black: 0.8,
    },
    timeToDropout: '2-6 weeks after crash',
    interventionWindow: 'When intensity first drops',
    suggestedIntervention: 'rest_recommendation',
    interventionMessage: {
      white:
        "Enthusiasm is great, but 3-4 sessions per week builds skills better than 6 burned-out ones.",
      blue:
        "Sustainable training beats intense bursts. Your body and mind need recovery time.",
      purple:
        "You can't pour from an empty cup - especially when teaching. Balance intensity with rest.",
      brown:
        "After years of experience, you know what sustainable looks like. Trust that.",
      black: "Model sustainable training for your students.",
    },
  },
];

// ===========================================
// INTERVENTION TEMPLATES
// ===========================================

export const interventionTemplates: Record<InterventionType, Omit<Intervention, 'id' | 'triggerReason' | 'message'>> = {
  gentle_checkin: {
    type: 'gentle_checkin',
    priority: 'medium',
    title: 'How are you doing?',
    actionLabel: 'Log a session',
    actionRoute: '/log',
    showAfterDays: 1,
    expiresAfterDays: 14,
    maxShowCount: 2,
    dismissable: true,
    trackEngagement: true,
  },
  encouragement: {
    type: 'encouragement',
    priority: 'low',
    title: 'Keep going',
    actionLabel: 'View your progress',
    actionRoute: '/progress',
    showAfterDays: 0,
    expiresAfterDays: 7,
    maxShowCount: 1,
    dismissable: true,
    trackEngagement: true,
  },
  plateau_support: {
    type: 'plateau_support',
    priority: 'medium',
    title: 'Feeling stuck?',
    actionLabel: 'Explore techniques',
    actionRoute: '/techniques',
    showAfterDays: 0,
    expiresAfterDays: 14,
    maxShowCount: 2,
    dismissable: true,
    trackEngagement: true,
  },
  injury_guidance: {
    type: 'injury_guidance',
    priority: 'high',
    title: 'Take care of yourself',
    actionLabel: 'Learn more',
    showAfterDays: 0,
    expiresAfterDays: 30,
    maxShowCount: 3,
    dismissable: true,
    trackEngagement: true,
  },
  goal_recalibration: {
    type: 'goal_recalibration',
    priority: 'low',
    title: 'Update your goals',
    actionLabel: 'Review goals',
    actionRoute: '/profile',
    showAfterDays: 7,
    expiresAfterDays: 30,
    maxShowCount: 1,
    dismissable: true,
    trackEngagement: true,
  },
  community_connection: {
    type: 'community_connection',
    priority: 'low',
    title: 'Connect with your team',
    showAfterDays: 3,
    expiresAfterDays: 14,
    maxShowCount: 1,
    dismissable: true,
    trackEngagement: true,
  },
  milestone_celebration: {
    type: 'milestone_celebration',
    priority: 'low',
    title: 'Milestone reached!',
    showAfterDays: 0,
    expiresAfterDays: 7,
    maxShowCount: 1,
    dismissable: true,
    trackEngagement: false,
  },
  rest_recommendation: {
    type: 'rest_recommendation',
    priority: 'medium',
    title: 'Rest is part of training',
    showAfterDays: 0,
    expiresAfterDays: 14,
    maxShowCount: 1,
    dismissable: true,
    trackEngagement: true,
  },
};

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Get risk signal by ID
 */
export function getRiskSignal(id: string): RiskSignal | undefined {
  return riskSignals.find(signal => signal.id === id);
}

/**
 * Get all risk signals for a category
 */
export function getRiskSignalsByCategory(category: RiskSignal['category']): RiskSignal[] {
  return riskSignals.filter(signal => signal.category === category);
}

/**
 * Calculate adjusted risk score based on belt modifier
 */
export function getAdjustedRiskScore(
  signalId: string,
  baseScore: number,
  belt: string
): number {
  const signal = getRiskSignal(signalId);
  if (!signal) return baseScore;

  const modifier = signal.beltModifiers[belt as keyof typeof signal.beltModifiers] || 1.0;
  return baseScore * modifier;
}

/**
 * Get intervention message for a signal and belt
 */
export function getInterventionMessage(signalId: string, belt: string): string {
  const signal = getRiskSignal(signalId);
  if (!signal) return '';

  return (
    signal.interventionMessage[belt as keyof typeof signal.interventionMessage] ||
    signal.interventionMessage.white
  );
}

/**
 * Create an intervention from a triggered signal
 */
export function createIntervention(
  signalId: string,
  belt: string,
  triggerReason: string
): Intervention | null {
  const signal = getRiskSignal(signalId);
  if (!signal) return null;

  const template = interventionTemplates[signal.suggestedIntervention];
  const message = getInterventionMessage(signalId, belt);

  return {
    ...template,
    id: `${signalId}-${Date.now()}`,
    triggerReason,
    message,
  };
}
