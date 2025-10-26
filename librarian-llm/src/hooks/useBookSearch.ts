import { useMemo } from 'react';
import { CatalogItem } from '../types';

interface SearchOptions {
  query: string;
  catalog: CatalogItem[];
}

export function useBookSearch({ query, catalog }: SearchOptions): CatalogItem[] {
  const searchResults = useMemo(() => {
    if (!query || !catalog) return [];

    const searchTerms = query.toLowerCase().split(' ').filter(Boolean);

    return catalog.filter(item => {
      // Create searchable text from all relevant fields
      const searchableFields = [
        item.title,
        item.description,
        'author' in item ? item.author : '',
        'director' in item ? item.director : '',
        'developer' in item ? item.developer : '',
        'narrator' in item ? item.narrator : '',
        'subjects' in item && item.subjects && Array.isArray(item.subjects) ? item.subjects.join(' ') : '',
        'genres' in item && item.genres && Array.isArray(item.genres) ? item.genres.join(' ') : '',
        'category' in item ? item.category : '',
        'series' in item ? item.series : '',
        'publisher' in item ? item.publisher : '',
        item.itemType
      ].join(' ').toLowerCase();

      // Check if all search terms appear in the searchable fields
      return searchTerms.every(term => searchableFields.includes(term));
    });
  }, [query, catalog]);

  return searchResults;
}

// Hook for getting recommendations based on context
export function useBookRecommendations(
  catalog: CatalogItem[],
  context: string,
  limit: number = 5
): CatalogItem[] {
  return useMemo(() => {
    if (!catalog || !context) return [];

    // Simple keyword-based recommendation
    // In production, this would use more sophisticated ML/AI
    const keywords = context.toLowerCase().split(' ').filter(Boolean);

    const scored = catalog.map(item => {
      let score = 0;
      const itemText = [
        item.title,
        item.description,
        'subjects' in item && item.subjects && Array.isArray(item.subjects) ? item.subjects.join(' ') : '',
        'genres' in item && item.genres && Array.isArray(item.genres) ? item.genres.join(' ') : ''
      ].join(' ').toLowerCase();

      keywords.forEach(keyword => {
        if (itemText.includes(keyword)) {
          score += 1;
        }
      });

      // Boost popular items slightly
      if (item.popular) {
        score += 0.5;
      }

      // Boost highly rated items
      if (item.rating && item.rating >= 4) {
        score += 0.3;
      }

      return { item, score };
    });

    // Sort by score and return top results
    return scored
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ item }) => item);
  }, [catalog, context, limit]);
}