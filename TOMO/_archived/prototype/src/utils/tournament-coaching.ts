/**
 * Tournament Coaching Text Generator
 *
 * Generates supportive, personalized coaching text for the Tournament Readiness module.
 * Text is belt-aware, score-aware, and considers training history.
 */

import { TRAINING_BENCHMARKS, type BeltLevel, getVolumeLabel } from '../data/training-benchmarks';

export interface CoachingTextInput {
  belt: BeltLevel;
  score: number;                    // 0-100 readiness score
  sessionsPerWeek: number;          // Current training frequency
  totalSessions: number;            // Lifetime sessions logged
  competitionHistory: number;       // Number of past competitions
  daysUntilCompetition?: number;    // Optional: days until their comp
}

export interface CoachingTextOutput {
  headline: string;
  volumeInsight: string;
  coachingParagraphs: string[];
  actionItems: string[];
}

/**
 * Generate supportive coaching text based on user's readiness profile
 */
export function generateCoachingText(input: CoachingTextInput): CoachingTextOutput {
  const { belt, score, sessionsPerWeek, competitionHistory, daysUntilCompetition } = input;
  const benchmark = TRAINING_BENCHMARKS[belt];
  const volumeLabel = getVolumeLabel(sessionsPerWeek, belt);
  const isFirstComp = competitionHistory === 0;

  // Generate headline based on score and experience
  const headline = getHeadline(score, isFirstComp);

  // Generate volume insight
  const volumeInsight = getVolumeInsight(sessionsPerWeek, benchmark, volumeLabel, belt);

  // Generate coaching paragraphs
  const coachingParagraphs = getCoachingParagraphs(
    score, belt, isFirstComp, daysUntilCompetition
  );

  // Generate action items
  const actionItems = getActionItems(score, belt, volumeLabel, isFirstComp);

  return {
    headline,
    volumeInsight,
    coachingParagraphs,
    actionItems,
  };
}

function getHeadline(score: number, isFirstComp: boolean): string {
  if (isFirstComp) {
    if (score < 40) {
      return "Your first competition is a learning experience, not a test.";
    } else if (score < 70) {
      return "You're more prepared than most first-time competitors.";
    } else {
      return "You've built a solid foundation. Time to test it.";
    }
  }

  // Has competed before
  if (score < 40) {
    return "You know what competition feels like. Build on that experience.";
  } else if (score < 60) {
    return "You've been here before. Trust what you've built.";
  } else if (score < 80) {
    return "Your preparation is showing. Stay focused.";
  } else {
    return "You've put in the work. Time to compete.";
  }
}

function getVolumeInsight(
  sessionsPerWeek: number,
  benchmark: typeof TRAINING_BENCHMARKS[BeltLevel],
  volumeLabel: ReturnType<typeof getVolumeLabel>,
  belt: BeltLevel
): string {
  const beltName = belt.charAt(0).toUpperCase() + belt.slice(1);
  const avgSessions = benchmark.average.sessions;
  const compSessions = benchmark.competitor.sessions;

  switch (volumeLabel) {
    case 'below_casual':
      return `You're training ${sessionsPerWeek}x/week. Most ${belt} belt competitors train ${compSessions}x. Consider adding sessions if your schedule allows—even open mat counts.`;

    case 'casual':
      return `At ${sessionsPerWeek}x/week, you're below the ${avgSessions}x average for ${belt} belts preparing for competition. One more session per week would make a difference.`;

    case 'average':
      return `You're training ${sessionsPerWeek}x/week—right at the average for ${belt} belt competitors. Solid foundation. Quality over quantity from here.`;

    case 'above_average':
      return `At ${sessionsPerWeek}x/week, you're training more than most ${belt} belt competitors. Your volume is not the limiting factor.`;

    case 'competitor':
      return `${sessionsPerWeek}x/week puts you at competitor-level volume for ${belt} belts. Focus on recovery and peaking at the right time.`;

    default:
      return `You're training ${sessionsPerWeek}x/week. ${beltName} belt competitors typically train ${avgSessions}-${compSessions}x/week.`;
  }
}

function getCoachingParagraphs(
  score: number,
  belt: BeltLevel,
  isFirstComp: boolean,
  daysUntilCompetition?: number
): string[] {
  const paragraphs: string[] = [];

  // First-time competitor messaging
  if (isFirstComp) {
    if (belt === 'white') {
      paragraphs.push(
        "Most white belts competing have trained 3-6 months. Your goal isn't to win—it's to experience competition, feel the adrenaline, and learn what tournament rolling feels like. Everything after that is a bonus."
      );
    } else if (belt === 'blue') {
      paragraphs.push(
        "First competition at blue belt is intimidating—everyone knows what they're doing now. But you've earned this belt. Trust your training and focus on executing your game, not winning."
      );
    } else {
      paragraphs.push(
        "Competing for the first time at ${belt} belt takes courage. You've already proven yourself on the mat. This is just a new arena to test your skills."
      );
    }
  }

  // Score-based messaging
  if (score < 40) {
    paragraphs.push(
      "Your readiness score suggests there's room to build. That doesn't mean you shouldn't compete—some of the best learning happens in competition. Just adjust your expectations: focus on executing 1-2 techniques you know well."
    );
  } else if (score < 60) {
    paragraphs.push(
      "You're in the middle of the readiness spectrum. You have enough training to compete meaningfully, but you might face opponents who've prepared more intensely. Compete with your A-game—the techniques you've drilled most."
    );
  } else if (score < 80) {
    paragraphs.push(
      "Your preparation puts you ahead of many competitors at your level. You've done the work. In the final weeks, focus on sharpening what you know rather than adding new techniques."
    );
  } else {
    paragraphs.push(
      "You're as prepared as most people get. At this point, it's about mental preparation and trusting your training. Avoid overtraining in the final week—show up rested and ready."
    );
  }

  // Time-based messaging
  if (daysUntilCompetition !== undefined) {
    if (daysUntilCompetition <= 7) {
      paragraphs.push(
        "With less than a week out, focus on light drilling and visualization. No hard sparring—you can't gain fitness now, but you can lose it to injury. Trust the work you've already done."
      );
    } else if (daysUntilCompetition <= 21) {
      paragraphs.push(
        "In the final 2-3 weeks, sharpen your competition sequences: your opening (guard pull or takedown), your best sweep, and your highest-percentage submission. Drill these until they're automatic."
      );
    } else if (daysUntilCompetition <= 42) {
      paragraphs.push(
        "With 4-6 weeks out, you still have time to address weaknesses. Pick one area—escapes, guard retention, or a specific pass—and drill it intensively. You can make meaningful progress in this window."
      );
    }
  }

  return paragraphs;
}

function getActionItems(
  score: number,
  belt: BeltLevel,
  volumeLabel: ReturnType<typeof getVolumeLabel>,
  isFirstComp: boolean
): string[] {
  const items: string[] = [];

  // Volume-based recommendations
  if (volumeLabel === 'below_casual' || volumeLabel === 'casual') {
    items.push("Add one more training session per week if possible—even open mat counts");
  }

  // Score-based recommendations
  if (score < 50) {
    items.push("Focus on your A-game: one takedown/pull, one sweep, one submission");
    items.push("Drill your escapes until they're reflexive—you'll need them under pressure");
  } else {
    items.push("Drill your competition opener (guard pull → sweep or takedown → pass)");
    items.push("Add positional sparring from your weakest position");
  }

  // First comp recommendations
  if (isFirstComp) {
    items.push("Do at least one tournament-style round: 5-6 min, reset if submission");
    items.push("Practice your weigh-in routine and pre-match warmup");
  } else {
    items.push("Review footage of your last competition—identify patterns");
  }

  // Belt-specific
  if (belt === 'white') {
    items.push("Practice starting from standing—most white belts neglect this");
  } else if (belt === 'blue' || belt === 'purple') {
    items.push("Work on your opening 30 seconds—many matches are decided early");
  }

  return items.slice(0, 4); // Max 4 action items
}

/**
 * Get score level label for display
 */
export function getScoreLevel(score: number): {
  label: string;
  color: string;
} {
  if (score < 30) {
    return { label: 'BUILDING', color: 'var(--color-gray-400)' };
  } else if (score < 50) {
    return { label: 'DEVELOPING', color: 'var(--color-warning)' };
  } else if (score < 70) {
    return { label: 'PREPARED', color: 'var(--color-gold)' };
  } else if (score < 85) {
    return { label: 'READY', color: 'var(--color-positive)' };
  } else {
    return { label: 'PEAK', color: 'var(--color-positive)' };
  }
}
