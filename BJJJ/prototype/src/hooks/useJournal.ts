import { useState, useEffect } from 'react';
import type { JournalData, JournalEntry, UserProfile } from '../types/journal';

const STORAGE_KEY = 'ally-data';

const defaultData: JournalData = {
  profile: null,
  entries: {},
};

export function useJournal() {
  const [data, setData] = useState<JournalData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultData;
    } catch {
      return defaultData;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateProfile = (profile: UserProfile) => {
    setData((prev) => ({ ...prev, profile }));
  };

  const addEntry = (entry: JournalEntry) => {
    setData((prev) => ({
      ...prev,
      entries: { ...prev.entries, [entry.date]: entry },
    }));
  };

  const updateEntry = (date: string, updates: Partial<JournalEntry>) => {
    setData((prev) => {
      const existing = prev.entries[date];
      if (!existing) return prev;
      return {
        ...prev,
        entries: {
          ...prev.entries,
          [date]: { ...existing, ...updates },
        },
      };
    });
  };

  const deleteEntry = (date: string) => {
    setData((prev) => {
      const { [date]: _, ...rest } = prev.entries;
      return { ...prev, entries: rest };
    });
  };

  const getEntry = (date: string): JournalEntry | undefined => {
    return data.entries[date];
  };

  const getEntriesForMonth = (year: number, month: number): JournalEntry[] => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    return Object.entries(data.entries)
      .filter(([date]) => date.startsWith(prefix))
      .map(([, entry]) => entry);
  };

  return {
    data,
    profile: data.profile,
    entries: data.entries,
    updateProfile,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntry,
    getEntriesForMonth,
  };
}
