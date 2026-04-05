/**
 * Journal Pattern Analysis
 *
 * Patterns to detect in journal entries that provide insight into
 * the practitioner's experience. Used to:
 * - Provide belt-appropriate encouragement/guidance
 * - Detect risk signals (negative sentiment, injury mentions)
 * - Celebrate progress moments
 *
 * Patterns use RegExp for matching and provide belt-contextualized responses.
 */

import type { JournalPattern, JournalAnalysisResult, DetectedPattern } from './types';

// ===========================================
// JOURNAL PATTERNS
// ===========================================

export const journalPatterns: JournalPattern[] = [
  // =====================
  // EGO CHALLENGE PATTERNS
  // =====================
  {
    id: 'got-smashed',
    name: 'Got Dominated',
    category: 'ego_challenge',
    patterns: [
      /got (smashed|destroyed|wrecked|crushed|dominated|mauled)/i,
      /couldn'?t do anything/i,
      /felt helpless/i,
      /got tapped (out )?(like )?(\d+ times|constantly|repeatedly|a lot)/i,
      /smaller (person|guy|girl|partner) (tapped|submitted|beat) me/i,
    ],
    signal: 'got_smashed',
    confidence: 'high',
    responseKey: 'ego_humility',
    beltContextResponses: {
      white:
        "This is completely normal and part of the process. 'Getting mauled by 140 lb people and Big Bang Theory lookalikes' is a shared white belt experience. The fact that you showed up is what matters.",
      blue:
        "Even at blue belt, tough days happen. Getting dominated by higher belts or even athletic white belts is part of the journey. Focus on what you learned, not the outcome.",
      purple:
        "Rough sessions happen at every level. At purple, the key is identifying what concepts or positions need work - this session just showed you where to focus.",
      brown:
        "Even brown belts have off days. The difference is you can analyze exactly what went wrong and address it.",
      black:
        "Every roll is data. What did this session teach you about gaps in your game?",
    },
  },
  {
    id: 'tapped-by-lower-belt',
    name: 'Tapped by Lower Belt',
    category: 'ego_challenge',
    patterns: [
      /(white|lower) belt (got|caught|tapped|submitted) me/i,
      /tapped (by|to) a (white|new|lower) belt/i,
      /newer (guy|student|person) (caught|got|tapped) me/i,
    ],
    signal: 'got_smashed',
    confidence: 'high',
    responseKey: 'lower_belt_tap',
    beltContextResponses: {
      white: "N/A", // White belts don't have lower belts
      blue:
        "Getting caught by white belts is more common than people admit. It's normal - they're hungry and you're their target. Use it to identify your defensive gaps.",
      purple:
        "Lower belt taps happen to everyone. An athletic white belt with good timing can catch anyone. What matters is what you do with that information.",
      brown:
        "At brown belt, you sometimes let things happen to work on specific positions. If it wasn't intentional, consider it a gift - a reminder to stay sharp.",
      black:
        "Even at black belt, complacency can lead to catches. It's a good reminder to stay present in every roll.",
    },
  },

  // =====================
  // PROGRESS PATTERNS
  // =====================
  {
    id: 'first-submission',
    name: 'First Submission',
    category: 'progress_indicator',
    patterns: [
      /first (time )?(I )?(ever )?(got|hit|landed) (a|an|the) (armbar|triangle|choke|submission|sub|kimura|guillotine)/i,
      /finally (got|landed|hit) (a|my first)/i,
      /got my first (tap|submission|sub)/i,
    ],
    signal: 'first_success',
    confidence: 'high',
    responseKey: 'first_sub',
    beltContextResponses: {
      white:
        "That first submission in live rolling is a milestone. It means you're starting to see opportunities under pressure. Celebrate this - it's a real achievement.",
      blue:
        "Landing a new submission is progress. Even at blue belt, adding weapons to your arsenal is exciting.",
      purple:
        "New submission entries are always worth noting. How does this fit into your overall game?",
      brown:
        "Expanding your finishing repertoire continues even at brown belt. Nice work.",
      black: "Adding submissions at black belt shows continued growth.",
    },
  },
  {
    id: 'first-sweep',
    name: 'First Sweep',
    category: 'progress_indicator',
    patterns: [
      /first (time )?(I )?(ever )?(got|hit|landed) (a|the) sweep/i,
      /finally swept someone/i,
      /swept (a |an )?upper belt/i,
    ],
    signal: 'first_success',
    confidence: 'high',
    responseKey: 'first_sweep',
    beltContextResponses: {
      white:
        "Your first sweep is huge! It means you're starting to understand leverage and timing. This is a breakthrough moment.",
      blue:
        "Sweeps are the foundation of guard offense. Getting consistent sweeps is a sign of real development.",
      purple:
        "Sweeps become more about setup and timing at purple. What made this one work?",
      brown: "Efficient sweeps are the mark of refined guard play. Nice.",
      black: "Economy of motion in sweeps is beautiful to see.",
    },
  },
  {
    id: 'survived-round',
    name: 'Survived a Round',
    category: 'progress_indicator',
    patterns: [
      /survived (the )?(whole |entire )?(round|roll)/i,
      /didn'?t (get )?(tap|tapped|submitted)/i,
      /made it through without tapping/i,
      /no taps( today)?/i,
    ],
    signal: 'first_success',
    confidence: 'medium',
    responseKey: 'survival',
    beltContextResponses: {
      white:
        "Survival is the first real skill in BJJ. Not getting submitted against someone better means your defense is developing. This is huge progress.",
      blue:
        "Defensive resilience is what separates blue belts from white belts. Being untappable is a real achievement.",
      purple:
        "At purple, survival should be expected - but against tough partners, it's still worth noting.",
      brown:
        "Brown belt defense should be extremely difficult to crack. Good session.",
      black: "Solid defense is the foundation of everything.",
    },
  },
  {
    id: 'technique-click',
    name: 'Technique Clicked',
    category: 'progress_indicator',
    patterns: [
      /(finally )?(started to )?(get|understand|feel|click)/i,
      /something clicked/i,
      /it (all )?made sense/i,
      /finally (get|understand|feel) (the |how )/i,
      /breakthrough/i,
    ],
    signal: 'technique_breakthrough',
    confidence: 'medium',
    responseKey: 'breakthrough',
    beltContextResponses: {
      white:
        "These 'click' moments are the best part of learning. Your brain is making connections that will compound over time.",
      blue:
        "Breakthroughs like this are what carry you through plateaus. Remember this feeling when things get hard.",
      purple:
        "At purple belt, these insights are often about systems and connections between techniques. Deep understanding is emerging.",
      brown:
        "The refinement phase is full of these micro-insights. They add up to mastery.",
      black: "The art reveals itself continuously to those who keep exploring.",
    },
  },

  // =====================
  // PLATEAU PATTERNS
  // =====================
  {
    id: 'stuck-feeling',
    name: 'Feeling Stuck',
    category: 'plateau_indicator',
    patterns: [
      /feel(ing)? stuck/i,
      /not (getting|making|seeing) (any )?(better|progress|improvement)/i,
      /plateau/i,
      /same mistakes/i,
      /can'?t (seem to )?improve/i,
      /going nowhere/i,
    ],
    signal: 'stuck_feeling',
    confidence: 'high',
    responseKey: 'plateau',
    beltContextResponses: {
      white:
        "Feeling stuck is actually a sign of awareness - you can now see what you can't do. This is progress, even if it doesn't feel like it. Trust the process.",
      blue:
        "Blue belt plateau is so common it has a name: Blue Belt Blues. The learning curve flattens, but you're still improving - you just can't see it day to day.",
      purple:
        "Purple belt plateaus are often about depth, not breadth. Instead of learning new techniques, try going deeper into your existing game.",
      brown:
        "At brown belt, progress is measured in subtle improvements. Marginal gains compound over time.",
      black:
        "The plateau at black belt is where the art deepens rather than expands. Teaching often reveals new insights.",
    },
  },
  {
    id: 'considering-quitting',
    name: 'Considering Quitting',
    category: 'plateau_indicator',
    patterns: [
      /(think|thinking) about (quitting|stopping|taking a break)/i,
      /should I quit/i,
      /want to quit/i,
      /not sure (if )?I (should |want to )?continue/i,
      /losing motivation/i,
      /don'?t feel like training/i,
    ],
    signal: 'motivation_low',
    confidence: 'high',
    responseKey: 'considering_quit',
    beltContextResponses: {
      white:
        "The desire to quit is incredibly common - most people do. But those who push through these moments are the ones who make it to blue belt. Take a few days off if needed, but don't disappear.",
      blue:
        "Blue belt is when many quit - the goal has been achieved but the journey is long. Consider: is it BJJ you want to quit, or just the current approach? Try switching training intensity or focus.",
      purple:
        "Keith Owen's advice: 'If you decide to consider quitting BJJ, you should at least wait until you're a purple belt. At least by then, you know if you like BJJ or not.' You've made it this far.",
      brown:
        "At brown belt, taking a break is different from quitting. You're almost there. What would it take to continue sustainably?",
      black:
        "Even black belts have seasons of less training. The art will always be there when you need it.",
    },
  },

  // =====================
  // INJURY PATTERNS
  // =====================
  {
    id: 'injury-concern',
    name: 'Injury Mentioned',
    category: 'injury_mention',
    patterns: [
      /hurt (my|a) (knee|shoulder|back|neck|finger|elbow|ankle|wrist|rib)/i,
      /(knee|shoulder|back|neck|finger|elbow|ankle|wrist|rib) (hurts|is (sore|painful|bothering))/i,
      /injured/i,
      /can'?t (train|roll) (because|due to) (pain|injury)/i,
      /sitting out/i,
      /taking time off (for|due to)/i,
    ],
    signal: 'injury_concern',
    confidence: 'high',
    responseKey: 'injury',
    beltContextResponses: {
      white:
        "Injuries at white belt are often from going too hard or not tapping early enough. Listen to your body - there's no shame in taking time to heal. BJJ will be here when you're ready.",
      blue:
        "Accumulated injuries are common at blue belt. The key is learning to train around them and not pushing through when you shouldn't. Smart training is sustainable training.",
      purple:
        "After years of training, injury management becomes a skill. Consider what you can still work on while protecting the injured area.",
      brown:
        "Your body has given you a lot. Give it what it needs. Technical work and teaching can replace hard sparring during recovery.",
      black:
        "Longevity in BJJ requires respecting your body's signals. Recovery is part of the art.",
    },
  },

  // =====================
  // POSITIVE PATTERNS
  // =====================
  {
    id: 'great-session',
    name: 'Great Session',
    category: 'motivation_signal',
    patterns: [
      /(great|awesome|amazing|fantastic|best) (session|class|training|day)/i,
      /loved (today|training|class)/i,
      /so much fun/i,
      /this is why I train/i,
      /reminded me why I love/i,
    ],
    signal: 'motivation_high',
    confidence: 'high',
    responseKey: 'great_day',
    beltContextResponses: {
      white:
        "Days like this are why people fall in love with BJJ. Remember this feeling when the hard days come.",
      blue:
        "Great sessions fuel the journey. Soak it in - these days build the resilience for plateaus.",
      purple:
        "Enjoying training at purple belt is a sign you've found sustainable motivation. That's huge.",
      brown: "The love of training at this level is what carries people to black belt.",
      black: "The joy of training never fades for those who truly embrace the art.",
    },
  },

  // =====================
  // TEACHING PATTERNS
  // =====================
  {
    id: 'helped-someone',
    name: 'Helped Someone',
    category: 'teaching_mention',
    patterns: [
      /helped (a |the )?(white belt|new person|beginner|someone)/i,
      /showed (a |the )?(white belt|new person|beginner|someone)/i,
      /taught (a |the )?(white belt|new person|beginner|someone)/i,
      /coached (someone|them)/i,
    ],
    signal: 'teaching_experience',
    confidence: 'high',
    responseKey: 'teaching',
    beltContextResponses: {
      white:
        "Even as a white belt, helping someone newer than you is valuable. Teaching reinforces your own learning.",
      blue:
        "Teaching is part of the blue belt journey. Explaining techniques to white belts deepens your own understanding.",
      purple:
        "Purple belt is the teaching belt. These moments are as valuable for your growth as your own training.",
      brown:
        "Teaching is preparation for black belt. Every interaction with a lower belt is practice for your future role.",
      black:
        "Developing students is the highest expression of the art. Thank you for giving back.",
    },
  },
];

// ===========================================
// ANALYSIS FUNCTIONS
// ===========================================

/**
 * Analyze a journal entry for patterns
 */
export function analyzeJournalEntry(
  sessionId: string,
  text: string,
  belt: string
): JournalAnalysisResult {
  const detectedPatterns: DetectedPattern[] = [];
  const riskSignals: string[] = [];

  // Check each pattern against the text
  for (const pattern of journalPatterns) {
    for (const regex of pattern.patterns) {
      const match = text.match(regex);
      if (match) {
        // Check negative patterns don't also match
        let negated = false;
        if (pattern.negativePatterns) {
          for (const negRegex of pattern.negativePatterns) {
            if (text.match(negRegex)) {
              negated = true;
              break;
            }
          }
        }

        if (!negated) {
          detectedPatterns.push({
            patternId: pattern.id,
            matchedText: match[0],
            signal: pattern.signal,
            confidence: pattern.confidence,
          });

          // Add to risk signals if applicable
          if (
            pattern.signal === 'stuck_feeling' ||
            pattern.signal === 'motivation_low' ||
            pattern.signal === 'injury_concern'
          ) {
            riskSignals.push(pattern.id);
          }

          break; // Only match each pattern once per entry
        }
      }
    }
  }

  // Determine overall sentiment
  const overallSentiment = calculateSentiment(detectedPatterns);

  // Get suggested follow-up if needed
  const suggestedFollowUp = getSuggestedFollowUp(detectedPatterns, belt);

  // Get belt-appropriate response if we have patterns
  const beltAppropriateResponse = detectedPatterns.length > 0
    ? getBeltAppropriateResponse(detectedPatterns[0].patternId, belt)
    : null;

  return {
    sessionId,
    detectedPatterns,
    overallSentiment,
    riskSignals,
    suggestedFollowUp,
    beltAppropriateResponse,
  };
}

/**
 * Calculate overall sentiment from detected patterns
 */
function calculateSentiment(
  patterns: DetectedPattern[]
): 'positive' | 'neutral' | 'negative' | 'mixed' {
  if (patterns.length === 0) return 'neutral';

  const signalSentiments: Record<string, 'positive' | 'negative' | 'neutral'> = {
    got_smashed: 'negative',
    first_success: 'positive',
    technique_breakthrough: 'positive',
    stuck_feeling: 'negative',
    motivation_low: 'negative',
    motivation_high: 'positive',
    injury_concern: 'negative',
    teaching_experience: 'positive',
    partner_issue: 'negative',
    competition_anxiety: 'negative',
  };

  let positive = 0;
  let negative = 0;

  for (const pattern of patterns) {
    const sentiment = signalSentiments[pattern.signal] || 'neutral';
    if (sentiment === 'positive') positive++;
    if (sentiment === 'negative') negative++;
  }

  if (positive > 0 && negative > 0) return 'mixed';
  if (positive > negative) return 'positive';
  if (negative > positive) return 'negative';
  return 'neutral';
}

/**
 * Get a suggested follow-up based on patterns
 */
function getSuggestedFollowUp(patterns: DetectedPattern[], belt: string): string | null {
  // Prioritize certain signals for follow-up
  const prioritySignals = ['motivation_low', 'injury_concern', 'stuck_feeling'];

  for (const signal of prioritySignals) {
    const pattern = patterns.find(p => p.signal === signal);
    if (pattern) {
      const journalPattern = journalPatterns.find(jp => jp.id === pattern.patternId);
      if (journalPattern) {
        return journalPattern.beltContextResponses[belt as keyof typeof journalPattern.beltContextResponses];
      }
    }
  }

  return null;
}

/**
 * Get belt-appropriate response for a pattern
 */
export function getBeltAppropriateResponse(patternId: string, belt: string): string | null {
  const pattern = journalPatterns.find(p => p.id === patternId);
  if (!pattern) return null;

  return (
    pattern.beltContextResponses[belt as keyof typeof pattern.beltContextResponses] ||
    pattern.beltContextResponses.white
  );
}

/**
 * Get all patterns that match a category
 */
export function getPatternsByCategory(category: JournalPattern['category']): JournalPattern[] {
  return journalPatterns.filter(p => p.category === category);
}

/**
 * Quick sentiment check (without full analysis)
 */
export function quickSentimentCheck(text: string): 'positive' | 'neutral' | 'negative' {
  const positivePatterns = [
    /great|awesome|amazing|fantastic|love|fun|breakthrough|clicked|finally got/i,
  ];
  const negativePatterns = [
    /smashed|stuck|plateau|hurt|injured|quit|frustrated|can'?t|helpless/i,
  ];

  let score = 0;
  for (const regex of positivePatterns) {
    if (text.match(regex)) score++;
  }
  for (const regex of negativePatterns) {
    if (text.match(regex)) score--;
  }

  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}
