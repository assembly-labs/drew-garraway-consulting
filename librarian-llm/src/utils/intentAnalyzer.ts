import { CatalogItem } from '../types';

export interface PatronIntent {
  primary: 'learn' | 'create' | 'explore' | 'solve' | 'enjoy' | 'research';
  secondary: string[];
  confidence: number;
  suggestedMaterials: string[];
  journeyStage: 'beginner' | 'intermediate' | 'advanced' | 'exploring';
}

export interface IntentContext {
  patterns: string[];
  materials: string[];
  boost: Record<string, number>;
}

// Intent patterns for understanding what the patron really wants
export const INTENT_PATTERNS: Record<string, IntentContext> = {
  learning: {
    patterns: ['how to', 'learn', 'understand', 'basics of', 'introduction to', 'tutorial', 'teach me', 'guide to', 'explain'],
    materials: ['book', 'dvd', 'equipment', 'online_resource', 'kit'],
    boost: { instructional: 10, beginner_friendly: 8, tutorial: 12 }
  },
  problem_solving: {
    patterns: ['fix', 'solve', 'repair', 'troubleshoot', 'broken', 'not working', 'help with', 'issue with', 'problem'],
    materials: ['thing', 'equipment', 'book', 'dvd', 'tools'],
    boost: { practical: 15, tools: 12, how_to: 10 }
  },
  entertainment: {
    patterns: ['fun', 'enjoy', 'watch', 'play', 'relax', 'weekend', 'bored', 'leisure', 'pass time'],
    materials: ['dvd', 'game', 'comic', 'book', 'puzzle'],
    boost: { popular: 5, highly_rated: 8, entertainment: 10 }
  },
  research: {
    patterns: ['research', 'study', 'academic', 'thesis', 'deep dive', 'comprehensive', 'analysis', 'investigate', 'scholarly'],
    materials: ['book', 'academic_journal', 'database', 'documentary', 'reference'],
    boost: { authoritative: 10, recent: 5, academic: 12 }
  },
  creative: {
    patterns: ['make', 'build', 'create', 'design', 'craft', 'diy', 'project', 'art', 'write'],
    materials: ['thing', 'equipment', 'book', 'kit', 'supplies'],
    boost: { hands_on: 15, project_based: 10, creative: 12 }
  },
  exploration: {
    patterns: ['interested in', 'curious about', 'what about', 'tell me about', 'explore', 'discover', 'find out'],
    materials: ['book', 'dvd', 'documentary', 'equipment', 'kit'],
    boost: { introductory: 8, comprehensive: 6, variety: 10 }
  }
};

/**
 * Analyzes a query to determine patron intent
 */
export function analyzeIntent(query: string): PatronIntent {
  const queryLower = query.toLowerCase();
  const scores: Record<string, number> = {};
  const detectedIntents: string[] = [];

  // Score each intent category
  Object.entries(INTENT_PATTERNS).forEach(([intent, context]) => {
    let score = 0;

    // Check for pattern matches
    context.patterns.forEach(pattern => {
      if (queryLower.includes(pattern)) {
        score += 10;
        if (!detectedIntents.includes(intent)) {
          detectedIntents.push(intent);
        }
      }
    });

    scores[intent] = score;
  });

  // Determine primary intent
  const sortedIntents = Object.entries(scores)
    .sort(([, a], [, b]) => b - a);

  const primaryIntent = sortedIntents[0]?.[0] || 'exploration';
  const confidence = Math.min((sortedIntents[0]?.[1] || 0) / 10, 1);

  // Determine journey stage based on query complexity
  let journeyStage: PatronIntent['journeyStage'] = 'exploring';
  if (queryLower.includes('beginner') || queryLower.includes('start') || queryLower.includes('basics')) {
    journeyStage = 'beginner';
  } else if (queryLower.includes('advanced') || queryLower.includes('expert') || queryLower.includes('professional')) {
    journeyStage = 'advanced';
  } else if (queryLower.includes('improve') || queryLower.includes('better') || queryLower.includes('next')) {
    journeyStage = 'intermediate';
  }

  // Map primary intent to patron intent type
  const intentMap: Record<string, PatronIntent['primary']> = {
    'learning': 'learn',
    'problem_solving': 'solve',
    'entertainment': 'enjoy',
    'research': 'research',
    'creative': 'create',
    'exploration': 'explore'
  };

  // Get suggested materials for this intent
  const suggestedMaterials = INTENT_PATTERNS[primaryIntent]?.materials || ['book', 'dvd', 'equipment'];

  return {
    primary: intentMap[primaryIntent] || 'explore',
    secondary: detectedIntents.filter(i => i !== primaryIntent),
    confidence,
    suggestedMaterials,
    journeyStage
  };
}

/**
 * Gets context-aware boost scores for a catalog item based on intent
 */
export function getIntentBoost(item: CatalogItem, intent: PatronIntent): number {
  let boost = 0;

  // Find the intent pattern
  const intentKey = Object.keys(INTENT_PATTERNS).find(key => {
    const mapped = key.replace('_', '');
    return intent.primary === 'learn' ? mapped === 'learning' :
           intent.primary === 'solve' ? mapped === 'problemsolving' :
           intent.primary === 'enjoy' ? mapped === 'entertainment' :
           intent.primary === 'research' ? mapped === 'research' :
           intent.primary === 'create' ? mapped === 'creative' :
           mapped === 'exploration';
  }) || 'exploration';

  const intentContext = INTENT_PATTERNS[intentKey];

  // Boost based on material type match
  if (intentContext.materials.includes(item.itemType)) {
    boost += 5;
  }

  // Apply specific boosts from intent context
  const description = item.description.toLowerCase();
  Object.entries(intentContext.boost).forEach(([keyword, value]) => {
    if (description.includes(keyword)) {
      boost += value;
    }
  });

  // Boost based on journey stage
  if (intent.journeyStage === 'beginner') {
    if (description.includes('beginner') || description.includes('introduction') || description.includes('basics')) {
      boost += 8;
    }
  } else if (intent.journeyStage === 'advanced') {
    if (description.includes('advanced') || description.includes('professional') || description.includes('expert')) {
      boost += 8;
    }
  }

  return boost;
}

/**
 * Detects if the query is asking about available material types
 */
export function detectMaterialTypeQuery(query: string): boolean {
  const materialQueries = [
    'what can i borrow',
    'besides books',
    'other than books',
    'what else',
    'what materials',
    'what types',
    'available to borrow'
  ];

  const queryLower = query.toLowerCase();
  return materialQueries.some(pattern => queryLower.includes(pattern));
}