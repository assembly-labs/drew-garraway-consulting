import { useState, useCallback, useMemo } from 'react';
import type { FilterState } from '../types';

const initialFilters: FilterState = {
  collection: 'all',
  tags: [],
  colors: [],
  orientation: 'all',
};

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const setCollection = useCallback((collection: FilterState['collection']) => {
    setFilters((prev) => ({ ...prev, collection }));
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  }, []);

  const toggleColor = useCallback((color: string) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  }, []);

  const setOrientation = useCallback((orientation: FilterState['orientation']) => {
    setFilters((prev) => ({ ...prev, orientation }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.collection !== 'all') count++;
    if (filters.orientation !== 'all') count++;
    count += filters.tags.length;
    count += filters.colors.length;
    return count;
  }, [filters]);

  return {
    filters,
    setCollection,
    toggleTag,
    toggleColor,
    setOrientation,
    clearFilters,
    activeFilterCount,
  };
}
