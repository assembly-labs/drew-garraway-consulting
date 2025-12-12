import { CatalogItem } from '../types';
import { PatronIntent, getIntentBoost } from './intentAnalyzer';

// Comprehensive semantic keyword mappings for intelligent search
export const SEMANTIC_KEYWORDS: Record<string, string[]> = {
  // Philadelphia and American History
  'philadelphia': ['philadelphia', '1776', 'founding fathers', 'benjamin franklin', 'ben franklin', 'constitution', 'continental congress', 'independence hall', 'revolutionary war', 'colonial america', 'yellow fever', 'liberty bell', 'declaration of independence', 'constitutional convention'],
  'philly': ['philadelphia', '1776', 'founding fathers', 'benjamin franklin'],

  // Historical Events
  'revolutionary war': ['revolutionary', 'revolution', '1776', 'independence', 'founding fathers', 'george washington', 'continental army', 'colonial', 'lexington', 'concord', 'british', 'patriots'],
  'american revolution': ['revolutionary', 'revolution', '1776', 'independence', 'founding fathers', 'george washington', 'colonial'],
  'civil war': ['civil war', 'lincoln', 'union', 'confederate', 'gettysburg', 'slavery', 'reconstruction'],

  // Historical Figures
  'founding fathers': ['founding fathers', 'benjamin franklin', 'george washington', 'john adams', 'thomas jefferson', 'alexander hamilton', 'james madison', 'constitution', '1776'],
  'ben franklin': ['benjamin franklin', 'franklin', 'founding fathers', 'philadelphia', 'autobiography', 'poor richard'],
  'benjamin franklin': ['benjamin franklin', 'franklin', 'founding fathers', 'philadelphia', 'autobiography', 'poor richard', 'electricity', 'inventor'],
  'george washington': ['george washington', 'washington', 'founding fathers', 'revolutionary war', 'continental army', 'president', 'mount vernon'],
  'thomas jefferson': ['thomas jefferson', 'jefferson', 'founding fathers', 'declaration of independence', 'monticello', 'president'],
  'john adams': ['john adams', 'adams', 'founding fathers', 'president', 'abigail adams', 'massachusetts'],

  // Documents and Places
  'constitution': ['constitution', 'constitutional convention', 'philadelphia', 'founding fathers', 'miracle at philadelphia', 'we the people'],
  'declaration of independence': ['declaration of independence', 'independence', '1776', 'thomas jefferson', 'philadelphia'],
  'independence': ['independence', 'revolutionary war', '1776', 'declaration of independence', 'freedom', 'liberty'],

  // Time Periods
  '1776': ['1776', 'revolutionary war', 'independence', 'founding fathers', 'david mccullough', 'declaration'],
  'colonial': ['colonial', 'colonial america', '13 colonies', 'british', 'revolutionary war', 'founding fathers'],
  '18th century': ['18th century', '1700s', 'colonial', 'revolutionary war', 'enlightenment', 'founding fathers'],

  // General American History
  'american history': ['american history', 'united states', 'founding fathers', '1776', 'revolution', 'civil war', 'constitution', 'independence', 'colonial', 'presidents'],
  'us history': ['american history', 'united states', 'founding fathers', '1776', 'revolution', 'civil war', 'constitution'],
  'early america': ['colonial america', 'founding fathers', 'revolutionary war', '1776', 'constitution', '13 colonies'],

  // Life Skills & Practical Knowledge
  'home improvement': ['diy', 'repair', 'tools', 'renovation', 'painting', 'plumbing', 'electrical', 'carpentry', 'maintenance', 'fixing'],
  'diy': ['do it yourself', 'home improvement', 'crafts', 'maker', 'build', 'repair', 'tools', 'projects'],
  'cooking': ['recipes', 'cuisine', 'baking', 'nutrition', 'meal prep', 'kitchen', 'culinary', 'chef', 'food'],
  'parenting': ['child development', 'education', 'activities', 'pregnancy', 'teens', 'family', 'raising kids', 'childcare'],
  'health': ['fitness', 'mental health', 'wellness', 'medical', 'nutrition', 'exercise', 'mindfulness', 'therapy', 'self-care'],
  'mental health': ['anxiety', 'depression', 'stress', 'therapy', 'mindfulness', 'wellness', 'self-help', 'psychology'],
  'stress': ['anxiety', 'mental health', 'relaxation', 'mindfulness', 'meditation', 'self-care', 'wellness'],

  // Learning & Professional Development
  'language learning': ['spanish', 'french', 'mandarin', 'esl', 'linguistics', 'conversation', 'bilingual', 'foreign language'],
  'spanish': ['español', 'language learning', 'latin', 'hispanic', 'mexico', 'conversation'],
  'programming': ['coding', 'python', 'javascript', 'web development', 'software', 'apps', 'computer science', 'developer'],
  'python': ['programming', 'coding', 'data science', 'machine learning', 'software', 'development'],
  'professional': ['career', 'business', 'leadership', 'productivity', 'interview', 'resume', 'management', 'skills'],
  'financial': ['investing', 'budgeting', 'retirement', 'taxes', 'personal finance', 'economics', 'money', 'wealth'],
  'investing': ['stocks', 'bonds', 'financial', 'money', 'wealth', 'retirement', 'portfolio', 'market'],

  // Hobbies & Interests
  'gardening': ['plants', 'vegetables', 'landscaping', 'organic', 'flowers', 'herbs', 'garden', 'growing'],
  'crafts': ['knitting', 'sewing', 'quilting', 'jewelry', 'scrapbooking', 'art', 'diy', 'handmade', 'creative'],
  'music': ['instruments', 'theory', 'composition', 'genres', 'performance', 'piano', 'guitar', 'singing'],
  'guitar': ['music', 'instrument', 'acoustic', 'electric', 'lessons', 'chords', 'tabs'],
  'photography': ['camera', 'editing', 'composition', 'lighting', 'digital', 'film', 'photos', 'pictures'],
  'art': ['painting', 'drawing', 'sculpture', 'creative', 'artist', 'gallery', 'techniques', 'visual arts'],

  // Technology & Innovation
  'technology': ['computers', 'internet', 'software', 'hardware', 'digital', 'tech', 'innovation', 'gadgets'],
  'internet of things': ['iot', 'smart home', 'arduino', 'raspberry pi', 'sensors', 'automation', 'connected devices', 'technology', 'programming', 'smart devices'],
  'iot': ['internet of things', 'smart devices', 'sensors', 'automation', 'connected', 'arduino', 'raspberry pi'],
  'ai': ['artificial intelligence', 'machine learning', 'neural networks', 'deep learning', 'data science', 'automation'],
  'machine learning': ['ai', 'artificial intelligence', 'data science', 'neural networks', 'algorithms', 'python'],
  'maker': ['3d printing', 'arduino', 'raspberry pi', 'robotics', 'electronics', 'circuits', 'diy', 'projects'],
  '3d printing': ['maker', 'additive manufacturing', 'cad', 'design', 'prototyping', 'modeling'],
  'arduino': ['maker', 'electronics', 'programming', 'iot', 'microcontroller', 'projects', 'robotics'],
  'raspberry pi': ['maker', 'electronics', 'programming', 'iot', 'computer', 'projects', 'linux'],
  'robotics': ['robots', 'automation', 'programming', 'arduino', 'maker', 'engineering', 'ai'],

  // Academic & Research Topics
  'science': ['physics', 'chemistry', 'biology', 'astronomy', 'geology', 'environmental', 'research', 'stem'],
  'stem': ['science', 'technology', 'engineering', 'mathematics', 'robotics', 'coding', 'research'],
  'physics': ['science', 'quantum', 'mechanics', 'einstein', 'newton', 'energy', 'forces'],
  'chemistry': ['science', 'elements', 'reactions', 'molecules', 'lab', 'experiments'],
  'biology': ['science', 'life', 'genetics', 'evolution', 'ecology', 'anatomy', 'cells'],
  'climate change': ['environment', 'global warming', 'sustainability', 'carbon', 'renewable energy', 'conservation'],
  'environment': ['climate', 'nature', 'conservation', 'ecology', 'sustainability', 'green'],
  'history': ['ancient', 'modern', 'world war', 'civilizations', 'archaeology', 'historical', 'past'],
  'philosophy': ['ethics', 'logic', 'metaphysics', 'existentialism', 'political', 'thinking', 'wisdom'],

  // Entertainment & Recreation
  'gaming': ['video games', 'board games', 'rpg', 'strategy', 'puzzles', 'card games', 'play'],
  'board games': ['tabletop', 'family games', 'strategy', 'party games', 'gaming', 'fun'],
  'video games': ['gaming', 'playstation', 'xbox', 'nintendo', 'pc games', 'console'],
  'movies': ['cinema', 'film', 'documentary', 'classic', 'foreign', 'indie', 'watch', 'dvd'],
  'documentary': ['non-fiction', 'educational', 'history', 'nature', 'science', 'real', 'factual'],
  'literature': ['fiction', 'poetry', 'classics', 'contemporary', 'book club', 'novels', 'reading'],
  'mystery': ['detective', 'crime', 'thriller', 'suspense', 'whodunit', 'investigation'],
  'fantasy': ['magic', 'dragons', 'epic', 'adventure', 'tolkien', 'wizards', 'quest'],
  'science fiction': ['sci-fi', 'space', 'future', 'technology', 'dystopian', 'aliens', 'time travel'],

  // Activities & Experiences
  'activities': ['things to do', 'fun', 'entertainment', 'hobbies', 'recreation', 'leisure', 'events'],
  'rainy day': ['indoor', 'activities', 'games', 'crafts', 'movies', 'puzzles', 'reading', 'fun'],
  'weekend': ['leisure', 'fun', 'activities', 'relaxation', 'hobbies', 'entertainment', 'projects'],
  'kids activities': ['children', 'family', 'fun', 'educational', 'games', 'crafts', 'entertainment'],
  'bored': ['entertainment', 'activities', 'fun', 'hobbies', 'games', 'something to do', 'leisure'],

  // Problem Solving
  'fix': ['repair', 'troubleshoot', 'maintenance', 'broken', 'diy', 'tools', 'solution'],
  'repair': ['fix', 'maintenance', 'tools', 'diy', 'broken', 'restore', 'mend'],
  'broken': ['repair', 'fix', 'troubleshoot', 'replace', 'maintenance', 'problem'],
  'bike': ['bicycle', 'cycling', 'repair', 'maintenance', 'riding', 'transportation'],
  'car': ['automobile', 'vehicle', 'repair', 'maintenance', 'driving', 'transportation'],
  'toilet': ['plumbing', 'bathroom', 'repair', 'maintenance', 'home improvement'],
  'plumbing': ['pipes', 'water', 'drain', 'toilet', 'sink', 'repair', 'maintenance'],
};

/**
 * Expands search terms using semantic mappings
 */
export function getSemanticTerms(query: string): string[] {
  const terms = query.toLowerCase().split(' ').filter(Boolean);
  const expandedTerms = new Set<string>();

  terms.forEach(term => {
    // Add original term
    expandedTerms.add(term);

    // Find all semantic matches
    Object.entries(SEMANTIC_KEYWORDS).forEach(([key, values]) => {
      const keyLower = key.toLowerCase();

      // Check if the search term matches a key
      if (keyLower.includes(term) || term.includes(keyLower)) {
        values.forEach(v => expandedTerms.add(v.toLowerCase()));
      }

      // Check if the search term matches any values
      values.forEach(value => {
        const valueLower = value.toLowerCase();
        if (valueLower.includes(term) || term.includes(valueLower)) {
          expandedTerms.add(keyLower);
          // Add all related terms
          values.forEach(v => expandedTerms.add(v.toLowerCase()));
        }
      });
    });
  });

  return Array.from(expandedTerms);
}

/**
 * Boosts score based on material type matching query intent
 */
export function boostByMaterialType(item: CatalogItem, query: string): number {
  const queryLower = query.toLowerCase();

  // Tech/IoT queries prefer equipment and things
  if (queryLower.includes('internet of things') || queryLower.includes('iot') ||
      queryLower.includes('arduino') || queryLower.includes('raspberry pi')) {
    if (item.itemType === 'thing' || item.itemType === 'equipment') {
      return 15;
    }
  }

  // Movie/watch queries prefer DVDs
  if (queryLower.includes('watch') || queryLower.includes('movie') || queryLower.includes('film')) {
    if (item.itemType === 'dvd') return 10;
  }

  // Gaming queries prefer games
  if (queryLower.includes('game') || queryLower.includes('play')) {
    if (item.itemType === 'game') return 12;
  }

  // Repair/fix queries prefer equipment and tools
  if (queryLower.includes('fix') || queryLower.includes('repair') || queryLower.includes('broken')) {
    if (item.itemType === 'thing' || item.itemType === 'equipment') return 10;
  }

  // Learning queries can use various formats
  if (queryLower.includes('learn') || queryLower.includes('how to')) {
    if (item.itemType === 'dvd') return 5; // Visual learning
    if (item.itemType === 'equipment' || item.itemType === 'thing') return 3; // Hands-on learning
  }

  return 0;
}

/**
 * Calculates a relevance score for a catalog item based on search terms and intent
 */
export function calculateRelevanceScore(
  item: CatalogItem,
  originalTerms: string[],
  expandedTerms: string[],
  intent?: PatronIntent
): number {
  let score = 0;

  // Title matching (highest weight)
  const titleLower = item.title.toLowerCase();
  originalTerms.forEach(term => {
    if (titleLower === term) score += 20; // Exact title match
    else if (titleLower.includes(term)) score += 10; // Title contains term
  });

  // Author/creator matching
  const creator = (
    'author' in item && item.author ? item.author :
    'director' in item && item.director ? item.director :
    'developer' in item && item.developer ? item.developer : ''
  ).toLowerCase();

  originalTerms.forEach(term => {
    if (creator.includes(term)) score += 8;
  });

  // Subject matching (high weight for exact matches)
  if ('subjects' in item && item.subjects && Array.isArray(item.subjects)) {
    item.subjects.forEach((subject: string) => {
      const subjectLower = subject.toLowerCase();
      originalTerms.forEach(term => {
        if (subjectLower === term) score += 12; // Exact subject match
        else if (subjectLower.includes(term)) score += 6; // Subject contains term
      });
      expandedTerms.forEach(term => {
        if (subjectLower === term) score += 4; // Expanded term exact match
        else if (subjectLower.includes(term)) score += 2; // Expanded term partial match
      });
    });
  }

  // Description matching
  const descLower = item.description.toLowerCase();
  originalTerms.forEach(term => {
    const termCount = (descLower.match(new RegExp(term, 'gi')) || []).length;
    score += termCount * 3; // 3 points per occurrence in description
  });

  expandedTerms.forEach(term => {
    if (descLower.includes(term) && !originalTerms.includes(term)) {
      score += 1; // 1 point for expanded terms in description
    }
  });

  // Material type boost
  const materialBoost = boostByMaterialType(item, originalTerms.join(' '));
  score += materialBoost;

  // Intent-based boosting
  if (intent) {
    score += getIntentBoost(item, intent);
  }

  // Boost for popular items (small boost)
  if (item.popular) score += 1;

  // Boost for highly rated items (small boost)
  if (item.rating && item.rating >= 4.0) score += 1;

  return score;
}

/**
 * Performs a semantic search on the catalog with intent awareness
 */
export function semanticSearch(
  query: string,
  catalog: CatalogItem[],
  limit?: number,
  intent?: PatronIntent
): CatalogItem[] {
  if (!query || !catalog || catalog.length === 0) {
    return [];
  }

  const originalTerms = query.toLowerCase().split(' ').filter(Boolean);
  const expandedTerms = getSemanticTerms(query);

  // Score all items
  const scoredItems = catalog.map(item => ({
    item,
    score: calculateRelevanceScore(item, originalTerms, expandedTerms, intent)
  }));

  // Filter items with score > 0 and sort by score
  const results = scoredItems
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);

  return limit ? results.slice(0, limit) : results;
}