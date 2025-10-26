import { CatalogItem } from '../types';

// Expanded semantic keyword mappings for comprehensive search
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
 * Calculates a relevance score for a catalog item based on search terms
 */
export function calculateRelevanceScore(
  item: CatalogItem,
  originalTerms: string[],
  expandedTerms: string[]
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

  // Boost for popular items (small boost)
  if (item.popular) score += 1;

  // Boost for highly rated items (small boost)
  if (item.rating && item.rating >= 4.0) score += 1;

  return score;
}

/**
 * Performs a semantic search on the catalog
 */
export function semanticSearch(
  query: string,
  catalog: CatalogItem[],
  limit?: number
): CatalogItem[] {
  if (!query || !catalog || catalog.length === 0) {
    return [];
  }

  const originalTerms = query.toLowerCase().split(' ').filter(Boolean);
  const expandedTerms = getSemanticTerms(query);

  // Score all items
  const scoredItems = catalog.map(item => ({
    item,
    score: calculateRelevanceScore(item, originalTerms, expandedTerms)
  }));

  // Filter items with score > 0 and sort by score
  const results = scoredItems
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);

  return limit ? results.slice(0, limit) : results;
}