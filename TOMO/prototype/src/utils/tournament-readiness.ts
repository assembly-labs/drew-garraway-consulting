/**
 * Tournament Readiness Score
 *
 * Calculates competition readiness based on the Four Pillars:
 * - Technical Proficiency (35%)
 * - Sparring Performance (30%)
 * - Consistency (20%)
 * - Competition Experience (15%)
 *
 * Belt-specific adjustments lower thresholds for newer practitioners
 * to encourage first competition experiences.
 */

export type Belt = 'white' | 'blue' | 'purple' | 'brown' | 'black';

export interface TournamentReadinessInput {
  belt: Belt;
  // Consistency metrics
  currentStreak: number;
  sessionsThisMonth: number;
  sessionsLastMonth: number;
  weeklyTarget: number;
  weeksHitTarget: number;
  totalWeeksTracked: number;
  // Technical metrics
  techniquesLogged: number;
  techniqueCategories: {
    guards: number;
    passes: number;
    submissions: number;
    escapes: number;
    takedowns: number;
  };
  // Sparring metrics
  submissionsLanded: number;
  timesTapped: number;
  sparringRoundsThisMonth: number;
  // Competition history
  totalCompetitions: number;
  totalMatches: number;
  competitionWins: number;
  medals: { gold: number; silver: number; bronze: number };
  // Upcoming competition
  hasUpcomingCompetition?: boolean;
  daysUntilCompetition?: number;
}

export interface PillarScore {
  score: number; // 0-100
  label: string;
  insight: string;
  weight: number;
}

export interface TournamentReadinessResult {
  overallScore: number; // 0-100
  readinessLevel: 'not_ready' | 'building' | 'approaching' | 'ready' | 'peak';
  pillars: {
    technical: PillarScore;
    sparring: PillarScore;
    consistency: PillarScore;
    experience: PillarScore;
  };
  beltMessage: string;
  recommendation: string;
  urgencyLevel: 'none' | 'low' | 'medium' | 'high';
}

// ===========================================
// BELT-SPECIFIC THRESHOLDS
// ===========================================

const beltThresholds: Record<Belt, {
  techniquesToReady: number;
  submissionsToReady: number;
  sessionsPerMonthToReady: number;
  experienceMultiplier: number;
}> = {
  white: {
    techniquesToReady: 15, // Lower bar - encourage first comp
    submissionsToReady: 5,
    sessionsPerMonthToReady: 8,
    experienceMultiplier: 1.5, // Bonus for any competition experience
  },
  blue: {
    techniquesToReady: 25,
    submissionsToReady: 15,
    sessionsPerMonthToReady: 10,
    experienceMultiplier: 1.3,
  },
  purple: {
    techniquesToReady: 40,
    submissionsToReady: 25,
    sessionsPerMonthToReady: 12,
    experienceMultiplier: 1.2,
  },
  brown: {
    techniquesToReady: 50,
    submissionsToReady: 35,
    sessionsPerMonthToReady: 12,
    experienceMultiplier: 1.1,
  },
  black: {
    techniquesToReady: 60,
    submissionsToReady: 50,
    sessionsPerMonthToReady: 10, // Can compete on less volume
    experienceMultiplier: 1.0,
  },
};

// ===========================================
// PILLAR CALCULATIONS
// ===========================================

function calculateTechnicalScore(input: TournamentReadinessInput): PillarScore {
  const thresholds = beltThresholds[input.belt];
  const { techniqueCategories, techniquesLogged } = input;

  // Base score from technique count
  const countScore = Math.min(100, (techniquesLogged / thresholds.techniquesToReady) * 100);

  // Category coverage bonus (having techniques across all categories)
  const categories = Object.values(techniqueCategories);
  const categoriesWithTechniques = categories.filter(c => c > 0).length;
  const coverageBonus = (categoriesWithTechniques / 5) * 20;

  // Weighted score
  const score = Math.min(100, countScore * 0.7 + coverageBonus * 0.3);

  // Insights based on gaps
  let insight = '';
  if (techniqueCategories.escapes < 3) {
    insight = 'Escape drills needed before competing.';
  } else if (techniqueCategories.takedowns < 3) {
    insight = 'Work takedowns or guard pulling strategy.';
  } else if (score >= 80) {
    insight = 'Technical base is competition-ready.';
  } else {
    insight = 'Continue drilling fundamentals.';
  }

  return {
    score: Math.round(score),
    label: 'Technical',
    insight,
    weight: 0.35,
  };
}

function calculateSparringScore(input: TournamentReadinessInput): PillarScore {
  const thresholds = beltThresholds[input.belt];
  const { submissionsLanded, timesTapped, sparringRoundsThisMonth } = input;

  // Submission score
  const subScore = Math.min(100, (submissionsLanded / thresholds.submissionsToReady) * 100);

  // Ratio score (not getting tapped too much is also important)
  const ratio = timesTapped > 0 ? submissionsLanded / timesTapped : submissionsLanded;
  const ratioScore = Math.min(100, ratio * 50); // 2:1 ratio = 100

  // Volume score (are you sparring enough?)
  const volumeScore = Math.min(100, (sparringRoundsThisMonth / 20) * 100);

  // Weighted combination
  const score = subScore * 0.4 + ratioScore * 0.3 + volumeScore * 0.3;

  let insight = '';
  if (sparringRoundsThisMonth < 10) {
    insight = 'Increase sparring volume before comp.';
  } else if (ratio < 0.5) {
    insight = 'Focus on defense and survival.';
  } else if (score >= 80) {
    insight = 'Sparring performance is strong.';
  } else {
    insight = 'Keep building mat time.';
  }

  return {
    score: Math.round(Math.min(100, score)),
    label: 'Sparring',
    insight,
    weight: 0.30,
  };
}

function calculateConsistencyScore(input: TournamentReadinessInput): PillarScore {
  const thresholds = beltThresholds[input.belt];
  const {
    currentStreak,
    sessionsThisMonth,
    weeksHitTarget,
    totalWeeksTracked,
  } = input;

  // Monthly session score
  const monthlyScore = Math.min(100, (sessionsThisMonth / thresholds.sessionsPerMonthToReady) * 100);

  // Streak score (training consistently)
  const streakScore = Math.min(100, currentStreak * 10); // 10 day streak = 100

  // Target hit rate
  const targetRate = totalWeeksTracked > 0 ? weeksHitTarget / totalWeeksTracked : 0;
  const targetScore = targetRate * 100;

  const score = monthlyScore * 0.4 + streakScore * 0.3 + targetScore * 0.3;

  let insight = '';
  if (currentStreak === 0) {
    insight = 'Get back on the mat before competing.';
  } else if (sessionsThisMonth < 6) {
    insight = 'Ramp up training frequency.';
  } else if (score >= 80) {
    insight = 'Training consistency is excellent.';
  } else {
    insight = 'Maintain current pace.';
  }

  return {
    score: Math.round(Math.min(100, score)),
    label: 'Consistency',
    insight,
    weight: 0.20,
  };
}

function calculateExperienceScore(input: TournamentReadinessInput): PillarScore {
  const thresholds = beltThresholds[input.belt];
  const { totalCompetitions, totalMatches, competitionWins, medals } = input;

  // Competition count score
  const compScore = Math.min(100, totalCompetitions * 25); // 4 comps = 100

  // Match experience
  const matchScore = Math.min(100, totalMatches * 10); // 10 matches = 100

  // Win rate bonus
  const winRate = totalMatches > 0 ? competitionWins / totalMatches : 0;
  const winBonus = winRate * 30;

  // Medal bonus
  const medalBonus = (medals.gold * 15 + medals.silver * 10 + medals.bronze * 5);

  let baseScore = compScore * 0.4 + matchScore * 0.4 + winBonus * 0.1 + Math.min(30, medalBonus) * 0.1;

  // Apply belt multiplier (gives bonus to less experienced belts)
  baseScore = Math.min(100, baseScore * thresholds.experienceMultiplier);

  let insight = '';
  if (totalCompetitions === 0) {
    insight = input.belt === 'white'
      ? 'First comp is a learning experience. Go for it.'
      : 'Consider entering a local tournament.';
  } else if (totalCompetitions < 3) {
    insight = 'Building competition experience.';
  } else if (baseScore >= 80) {
    insight = 'Solid competition track record.';
  } else {
    insight = 'Keep competing to build experience.';
  }

  return {
    score: Math.round(baseScore),
    label: 'Experience',
    insight,
    weight: 0.15,
  };
}

// ===========================================
// BELT-SPECIFIC MESSAGES
// ===========================================

function getBeltMessage(belt: Belt, score: number, hasCompeted: boolean): string {
  if (!hasCompeted) {
    switch (belt) {
      case 'white':
        return "Your first competition is about the experience, not the medal. Sign up.";
      case 'blue':
        return "Competition accelerates development. Time to test your game.";
      case 'purple':
        return "At purple belt, competition reveals your A-game gaps.";
      case 'brown':
        return "Competition at brown belt is about refinement under pressure.";
      case 'black':
        return "Competition keeps the art sharp.";
    }
  }

  if (score >= 80) {
    return "You're ready. Pick your tournament.";
  } else if (score >= 60) {
    return "Getting close. A few more weeks of focused prep.";
  } else if (score >= 40) {
    return "Building toward competition shape.";
  } else {
    return "Focus on consistent training first.";
  }
}

function getRecommendation(pillars: TournamentReadinessResult['pillars'], belt: Belt): string {
  // Find weakest pillar
  const pillarArray = Object.values(pillars);
  const weakest = pillarArray.reduce((a, b) => a.score < b.score ? a : b);

  if (weakest.score < 40) {
    return weakest.insight;
  }

  // All pillars decent - give belt-specific advice
  switch (belt) {
    case 'white':
      return 'Drill your escapes and one reliable submission.';
    case 'blue':
      return 'Develop your A-game sequence. Practice under pressure.';
    case 'purple':
      return 'Sharpen transitions between your best positions.';
    case 'brown':
      return 'Fine-tune timing and efficiency. Trust your game.';
    case 'black':
      return 'Prepare mentally. Your body knows what to do.';
    default:
      return 'Keep training consistently.';
  }
}

// ===========================================
// MAIN CALCULATION
// ===========================================

export function calculateTournamentReadiness(
  input: TournamentReadinessInput
): TournamentReadinessResult {
  const pillars = {
    technical: calculateTechnicalScore(input),
    sparring: calculateSparringScore(input),
    consistency: calculateConsistencyScore(input),
    experience: calculateExperienceScore(input),
  };

  // Calculate weighted overall score
  const overallScore = Math.round(
    pillars.technical.score * pillars.technical.weight +
    pillars.sparring.score * pillars.sparring.weight +
    pillars.consistency.score * pillars.consistency.weight +
    pillars.experience.score * pillars.experience.weight
  );

  // Determine readiness level
  let readinessLevel: TournamentReadinessResult['readinessLevel'];
  if (overallScore >= 85) {
    readinessLevel = 'peak';
  } else if (overallScore >= 70) {
    readinessLevel = 'ready';
  } else if (overallScore >= 55) {
    readinessLevel = 'approaching';
  } else if (overallScore >= 35) {
    readinessLevel = 'building';
  } else {
    readinessLevel = 'not_ready';
  }

  // Urgency based on upcoming competition
  let urgencyLevel: TournamentReadinessResult['urgencyLevel'] = 'none';
  if (input.hasUpcomingCompetition && input.daysUntilCompetition !== undefined) {
    if (input.daysUntilCompetition <= 7) {
      urgencyLevel = 'high';
    } else if (input.daysUntilCompetition <= 21) {
      urgencyLevel = 'medium';
    } else if (input.daysUntilCompetition <= 42) {
      urgencyLevel = 'low';
    }
  }

  return {
    overallScore,
    readinessLevel,
    pillars,
    beltMessage: getBeltMessage(input.belt, overallScore, input.totalCompetitions > 0),
    recommendation: getRecommendation(pillars, input.belt),
    urgencyLevel,
  };
}

// ===========================================
// READINESS LEVEL DISPLAY CONFIG
// ===========================================

export const readinessLevelConfig: Record<TournamentReadinessResult['readinessLevel'], {
  label: string;
  color: string;
  description: string;
}> = {
  not_ready: {
    label: 'Building',
    color: 'var(--color-gray-500)',
    description: 'Focus on fundamentals',
  },
  building: {
    label: 'Developing',
    color: 'var(--color-warning)',
    description: 'Making progress',
  },
  approaching: {
    label: 'Approaching',
    color: 'var(--color-gold)',
    description: 'Getting close',
  },
  ready: {
    label: 'Ready',
    color: 'var(--color-success)',
    description: 'Competition shape',
  },
  peak: {
    label: 'Peak',
    color: 'var(--color-gold)',
    description: 'Optimal readiness',
  },
};
