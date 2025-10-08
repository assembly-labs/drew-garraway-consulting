import { useState, useCallback, useMemo } from 'react';
import { HistoryItem } from '../types';
import { mockHistory } from '../data/mockHistory';
import { useToast } from './useToast';

export const useReadingHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>(mockHistory);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFormat, setFilterFormat] = useState<string>('all');
  const [filterRating, setFilterRating] = useState<string>('all');
  const toast = useToast();

  // Group history by year
  const groupedHistory = useMemo(() => {
    // Filter items based on search and filters
    let filtered = history;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.book.title.toLowerCase().includes(query) ||
        item.book.author.toLowerCase().includes(query)
      );
    }

    // Apply format filter
    if (filterFormat !== 'all') {
      filtered = filtered.filter(item => item.format === filterFormat);
    }

    // Apply rating filter
    if (filterRating !== 'all') {
      const rating = parseInt(filterRating);
      filtered = filtered.filter(item => item.user_rating === rating);
    }

    // Group by year
    const grouped: Record<string, HistoryItem[]> = {};

    filtered.forEach(item => {
      const year = new Date(item.returned_date).getFullYear().toString();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(item);
    });

    // Sort years in descending order
    const sortedYears = Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a));
    const result: Record<string, HistoryItem[]> = {};

    sortedYears.forEach(year => {
      // Sort items within each year by return date (most recent first)
      result[year] = grouped[year].sort((a, b) =>
        new Date(b.returned_date).getTime() - new Date(a.returned_date).getTime()
      );
    });

    return result;
  }, [history, searchQuery, filterFormat, filterRating]);

  // Update rating
  const updateRating = useCallback(async (itemId: string, rating: number) => {
    setHistory(prevHistory =>
      prevHistory.map(item =>
        item.id === itemId ? { ...item, user_rating: rating } : item
      )
    );
    toast.success('Rating updated');
  }, [toast]);

  // Read again (place hold)
  const readAgain = useCallback(async (book: HistoryItem['book']) => {
    // Simulate placing hold
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(`Hold placed on "${book.title}"`);
    setIsLoading(false);
  }, [toast]);

  // Delete single item
  const deleteItem = useCallback(async (itemId: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== itemId));
    toast.info('Item removed from history');
  }, [toast]);

  // Delete all history
  const deleteAllHistory = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setHistory([]);
    toast.warning('All reading history deleted');
    setIsLoading(false);
  }, [toast]);

  // Get unique formats for filter
  const formats = useMemo(() => {
    const uniqueFormats = new Set(mockHistory.map(item => item.format));
    return Array.from(uniqueFormats);
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalBooks = history.length;
    const booksThisYear = history.filter(
      item => new Date(item.returned_date).getFullYear() === new Date().getFullYear()
    ).length;
    const averageRating = history.filter(item => item.user_rating > 0).reduce(
      (sum, item) => sum + item.user_rating, 0
    ) / history.filter(item => item.user_rating > 0).length || 0;

    return {
      totalBooks,
      booksThisYear,
      averageRating: averageRating.toFixed(1)
    };
  }, [history]);

  return {
    groupedHistory,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterFormat,
    setFilterFormat,
    filterRating,
    setFilterRating,
    updateRating,
    readAgain,
    deleteItem,
    deleteAllHistory,
    formats,
    stats,
    totalCount: history.length
  };
};