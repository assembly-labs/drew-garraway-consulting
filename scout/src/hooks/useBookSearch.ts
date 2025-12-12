import { useMemo } from 'react';
import { CatalogItem } from '../types';
import { semanticSearch } from '../utils/semanticSearch';

interface SearchOptions {
  query: string;
  catalog: CatalogItem[];
}

export function useBookSearch({ query, catalog }: SearchOptions): CatalogItem[] {
  const searchResults = useMemo(() => {
    // Use the semantic search utility for intelligent matching
    return semanticSearch(query, catalog);
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
    // Use semantic search for smarter recommendations
    return semanticSearch(context, catalog, limit);
  }, [catalog, context, limit]);
}