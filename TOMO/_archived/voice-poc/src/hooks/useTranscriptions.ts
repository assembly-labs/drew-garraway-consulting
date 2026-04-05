import { useState, useCallback, useEffect, useRef } from 'react';
import type { Transcription } from '../types';

const STORAGE_KEY = 'tomo_voice_transcriptions';
const MAX_HISTORY = 50;

function loadFromStorage(): Transcription[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Transcription[];
    }
  } catch {
    console.error('Failed to load transcriptions from storage');
  }
  return [];
}

export function useTranscriptions() {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>(loadFromStorage);
  const isInitialMount = useRef(true);

  // Save to localStorage whenever transcriptions change (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transcriptions));
    } catch {
      console.error('Failed to save transcriptions to storage');
    }
  }, [transcriptions]);

  const addTranscription = useCallback((text: string, duration: number) => {
    const newTranscription: Transcription = {
      id: crypto.randomUUID(),
      text,
      timestamp: Date.now(),
      duration,
      copied: false,
    };

    setTranscriptions(prev => {
      const updated = [newTranscription, ...prev];
      // Keep only the most recent entries
      return updated.slice(0, MAX_HISTORY);
    });

    return newTranscription.id;
  }, []);

  const markAsCopied = useCallback((id: string) => {
    setTranscriptions(prev =>
      prev.map(t => (t.id === id ? { ...t, copied: true } : t))
    );
  }, []);

  const deleteTranscription = useCallback((id: string) => {
    setTranscriptions(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setTranscriptions([]);
  }, []);

  return {
    transcriptions,
    addTranscription,
    markAsCopied,
    deleteTranscription,
    clearAll,
  };
}
