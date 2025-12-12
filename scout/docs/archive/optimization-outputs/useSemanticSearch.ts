import { useMemo, useCallback } from 'react';
import { CatalogItem } from './types';
import { MinimalCatalogItem, CatalogOptimizer } from './catalogOptimizer';

/**
 * Semantic search configuration
 */
interface SearchConfig {
  maxResults?: number;           // Maximum results to return (default: 10)
  boostPopular?: boolean;        // Boost popular items (default: true)
  boostAvailable?: boolean;      // Boost available items (default: true)
  minScore?: number;             // Minimum relevance score (default: 0.1)
  enableFuzzy?: boolean;         // Enable fuzzy matching (default: true)
}

/**
 * Search result with relevance score
 */
interface SearchResult {
  item: CatalogItem;
  score: number;
  matchedFields: string[];
}

/**
 * Hook for intelligent semantic search on catalog
 * Filters 100+ items down to 10-20 most relevant
 */
export function useSemanticSearch(
  catalog: CatalogItem[],
  config: SearchConfig = {}
) {
  // Default configuration
  const {
    maxResults = 10,
    boostPopular = true,
    boostAvailable = true,
    minScore = 0.1,
    enableFuzzy = true
  } = config;

  // Create optimizer and minimal catalog
  const optimizer = useMemo(() => {
    return new CatalogOptimizer(catalog);
  }, [catalog]);

  const minimalCatalog = useMemo(() => {
    return optimizer.getMinimalCatalog();
  }, [optimizer]);

  /**
   * Extract keywords from user query
   */
  const extractKeywords = useCallback((query: string): string[] => {
    // Remove common stop words
    const stopWords = new Set([
      'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
      'can', 'you', 'recommend', 'suggest', 'find', 'show', 'me', 'books',
      'book', 'something', 'anything', 'looking', 'want', 'need', 'like',
      'please', 'thanks', 'help', 'what', 'which', 'that', 'this', 'i'
    ]);

    // Extract and clean keywords
    const keywords = query
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));

    // Add synonyms and related terms
    const expandedKeywords = [...keywords];

    keywords.forEach(keyword => {
      // Genre expansions
      if (keyword === 'mystery') expandedKeywords.push('thriller', 'detective', 'crime');
      if (keyword === 'romance') expandedKeywords.push('love', 'romantic', 'relationship');
      if (keyword === 'scifi' || keyword === 'sci-fi') expandedKeywords.push('science', 'fiction', 'space', 'future');
      if (keyword === 'fantasy') expandedKeywords.push('magic', 'wizard', 'dragon', 'quest');
      if (keyword === 'historical') expandedKeywords.push('history', 'period', 'war');

      // Mood expansions
      if (keyword === 'funny') expandedKeywords.push('humor', 'comedy', 'humorous', 'witty');
      if (keyword === 'scary') expandedKeywords.push('horror', 'thriller', 'suspense', 'dark');
      if (keyword === 'sad') expandedKeywords.push('emotional', 'touching', 'poignant');
      if (keyword === 'uplifting') expandedKeywords.push('inspiring', 'heartwarming', 'positive');

      // Format expansions
      if (keyword === 'audio') expandedKeywords.push('audiobook', 'listening');
      if (keyword === 'digital') expandedKeywords.push('ebook', 'electronic');
      if (keyword === 'physical') expandedKeywords.push('paperback', 'hardcover', 'print');
    });

    return [...new Set(expandedKeywords)];
  }, []);

  /**
   * Calculate fuzzy match score between two strings
   */
  const fuzzyMatch = useCallback((str1: string, str2: string): number => {
    if (!enableFuzzy) {
      return str1.includes(str2) ? 1 : 0;
    }

    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();

    // Exact match
    if (s1 === s2) return 1;

    // Contains match
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;

    // Starts with match
    if (s1.startsWith(s2) || s2.startsWith(s1)) return 0.7;

    // Levenshtein distance-based similarity
    const maxLen = Math.max(s1.length, s2.length);
    if (maxLen === 0) return 1;

    const distance = levenshteinDistance(s1, s2);
    const similarity = 1 - distance / maxLen;

    return similarity > 0.6 ? similarity * 0.5 : 0;
  }, [enableFuzzy]);

  /**
   * Calculate Levenshtein distance
   */
  const levenshteinDistance = (str1: string, str2: string): number => {
    const track = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1,
          track[j - 1][i] + 1,
          track[j - 1][i - 1] + indicator
        );
      }
    }
    return track[str2.length][str1.length];
  };

  /**
   * Score a single item against keywords
   */
  const scoreItem = useCallback(
    (item: MinimalCatalogItem, keywords: string[], fullItem: CatalogItem): SearchResult => {
      let score = 0;
      const matchedFields: string[] = [];

      keywords.forEach(keyword => {
        // Title match (highest weight)
        const titleScore = fuzzyMatch(item.t, keyword);
        if (titleScore > 0) {
          score += titleScore * 3;
          matchedFields.push('title');
        }

        // Creator match (high weight)
        const creatorScore = fuzzyMatch(item.c, keyword);
        if (creatorScore > 0) {
          score += creatorScore * 2;
          matchedFields.push('creator');
        }

        // Subject match (medium weight)
        item.s.forEach(subject => {
          const subjectScore = fuzzyMatch(subject, keyword);
          if (subjectScore > 0) {
            score += subjectScore * 1.5;
            if (!matchedFields.includes('subjects')) {
              matchedFields.push('subjects');
            }
          }
        });

        // Description match (if available, lower weight)
        if (fullItem.description) {
          const descScore = fuzzyMatch(fullItem.description.toLowerCase(), keyword);
          if (descScore > 0) {
            score += descScore * 0.5;
            if (!matchedFields.includes('description')) {
              matchedFields.push('description');
            }
          }
        }
      });

      // Apply boosts
      if (boostPopular && fullItem.popular) {
        score *= 1.2;
      }

      if (boostAvailable && item.av === 1) {
        score *= 1.1;
      }

      // Rating boost (if highly rated)
      if (item.r && item.r >= 4.5) {
        score *= 1.1;
      }

      // Recency boost (for newer items)
      if (item.y && item.y >= 2020) {
        score *= 1.05;
      }

      return {
        item: fullItem,
        score: score / keywords.length, // Normalize by keyword count
        matchedFields
      };
    },
    [fuzzyMatch, boostPopular, boostAvailable]
  );

  /**
   * Main search function
   */
  const search = useCallback(
    (query: string): SearchResult[] => {
      const startTime = performance.now();

      // Extract keywords from query
      const keywords = extractKeywords(query);

      if (keywords.length === 0) {
        // If no keywords, return popular/available items
        return catalog
          .filter(item => item.popular || item.formats.some(f => f.status === 'available'))
          .slice(0, maxResults)
          .map(item => ({
            item,
            score: 0.5,
            matchedFields: ['popular']
          }));
      }

      // Score all items
      const results = minimalCatalog
        .map((minItem, index) => scoreItem(minItem, keywords, catalog[index]))
        .filter(result => result.score >= minScore)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults);

      const endTime = performance.now();
      console.log(`Semantic search completed in ${(endTime - startTime).toFixed(2)}ms`);
      console.log(`Query: "${query}" → Keywords: ${keywords.join(', ')}`);
      console.log(`Results: ${results.length} items (from ${catalog.length} total)`);

      return results;
    },
    [catalog, minimalCatalog, extractKeywords, scoreItem, minScore, maxResults]
  );

  /**
   * Get items by IDs (for retrieving after search)
   */
  const getItemsByIds = useCallback((ids: string[]): CatalogItem[] => {
    return ids
      .map(id => catalog.find(item => item.id === id))
      .filter((item): item is CatalogItem => item !== undefined);
  }, [catalog]);

  /**
   * Search and return optimized items for Claude
   */
  const searchForClaude = useCallback((query: string) => {
    const results = search(query);
    const itemIds = results.map(r => r.item.id);
    const optimizedItems = optimizer.getOptimizedItems(itemIds);

    return {
      items: optimizedItems,
      totalResults: results.length,
      searchTime: 0, // Will be updated in actual search
      tokenSavings: optimizer.calculateSavings(results.length)
    };
  }, [search, optimizer]);

  return {
    search,
    searchForClaude,
    getItemsByIds,
    extractKeywords,
    stats: optimizer.getStats()
  };
}

/**
 * Example usage:
 *
 * const { search, searchForClaude } = useSemanticSearch(catalog);
 *
 * // Get relevant items for a query
 * const results = search("funny mystery books for beach reading");
 *
 * // Get optimized items for Claude
 * const { items, tokenSavings } = searchForClaude("science fiction with strong female lead");
 *
 * console.log(`Sending ${items.length} items to Claude`);
 * console.log(`Token savings: ${tokenSavings.percentage.toFixed(1)}%`);
 */