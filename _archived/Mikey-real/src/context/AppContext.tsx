import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Question, UserProgress, StudySession, TopicStats, Category } from '../lib/types';
import { db, getTopicStats, getRecentSessions, getTotalStudyTime } from '../lib/db';
import { loadQuestionsToDb } from '../data/questions';

interface AppState {
  isLoading: boolean;
  questions: Question[];
  progress: Map<string, UserProgress>;
  topicStats: TopicStats[];
  recentSessions: StudySession[];
  totalStudyTime: number;
  totalQuestions: number;
  masteredQuestions: number;
  overallAccuracy: number;
  readinessScore: number;
}

interface AppContextType extends AppState {
  refreshStats: () => Promise<void>;
  getQuestionsByCategory: (category: Category) => Question[];
  getQuestionsByTopic: (topic: string) => Question[];
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    isLoading: true,
    questions: [],
    progress: new Map(),
    topicStats: [],
    recentSessions: [],
    totalStudyTime: 0,
    totalQuestions: 0,
    masteredQuestions: 0,
    overallAccuracy: 0,
    readinessScore: 0,
  });

  useEffect(() => {
    initializeApp();
  }, []);

  async function initializeApp() {
    try {
      // Load questions to IndexedDB
      await loadQuestionsToDb();

      // Fetch all data
      const [questions, progressRecords, topicStatsMap, recentSessions, totalStudyTime] = await Promise.all([
        db.questions.toArray(),
        db.progress.toArray(),
        getTopicStats(),
        getRecentSessions(),
        getTotalStudyTime(),
      ]);

      const progress = new Map(progressRecords.map(p => [p.questionId, p]));

      // Calculate stats
      const masteredQuestions = progressRecords.filter(p => p.correctStreak >= 3).length;
      const totalAttempts = progressRecords.reduce((sum, p) => sum + p.totalAttempts, 0);
      const totalCorrect = progressRecords.reduce((sum, p) => sum + (p.correctStreak > 0 ? 1 : 0), 0);
      const overallAccuracy = totalAttempts > 0 ? (totalCorrect / progressRecords.length) * 100 : 0;

      // Calculate readiness score (weighted by exam importance)
      const topicStats: TopicStats[] = [];
      topicStatsMap.forEach((stats, key) => {
        const [category, topic] = key.split(':') as [Category, string];
        const accuracy = stats.attempted > 0 ? (stats.correct / stats.attempted) * 100 : 0;
        topicStats.push({
          topic,
          category,
          ...stats,
          accuracy,
          weight: questions.find(q => q.topic === topic)?.weight || 10,
        });
      });

      // Readiness = weighted average of topic accuracies
      let weightedSum = 0;
      let totalWeight = 0;
      topicStats.forEach(ts => {
        if (ts.attempted > 0) {
          weightedSum += ts.accuracy * ts.weight;
          totalWeight += ts.weight;
        }
      });
      const readinessScore = totalWeight > 0 ? weightedSum / totalWeight : 0;

      setState(prev => ({
        ...prev,
        isLoading: false,
        questions,
        progress,
        topicStats,
        recentSessions,
        totalStudyTime,
        totalQuestions: questions.length,
        masteredQuestions,
        overallAccuracy,
        readinessScore,
      }));
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }

  async function refreshStats() {
    const [progressRecords, topicStatsMap, recentSessions, totalStudyTime] = await Promise.all([
      db.progress.toArray(),
      getTopicStats(),
      getRecentSessions(),
      getTotalStudyTime(),
    ]);

    const progress = new Map(progressRecords.map(p => [p.questionId, p]));
    const masteredQuestions = progressRecords.filter(p => p.correctStreak >= 3).length;
    const totalCorrect = progressRecords.reduce((sum, p) => sum + (p.correctStreak > 0 ? 1 : 0), 0);
    const overallAccuracy = progressRecords.length > 0 ? (totalCorrect / progressRecords.length) * 100 : 0;

    const topicStats: TopicStats[] = [];
    topicStatsMap.forEach((stats, key) => {
      const [category, topic] = key.split(':') as [Category, string];
      const accuracy = stats.attempted > 0 ? (stats.correct / stats.attempted) * 100 : 0;
      topicStats.push({
        topic,
        category,
        ...stats,
        accuracy,
        weight: state.questions.find(q => q.topic === topic)?.weight || 10,
      });
    });

    let weightedSum = 0;
    let totalWeight = 0;
    topicStats.forEach(ts => {
      if (ts.attempted > 0) {
        weightedSum += ts.accuracy * ts.weight;
        totalWeight += ts.weight;
      }
    });
    const readinessScore = totalWeight > 0 ? weightedSum / totalWeight : 0;

    setState(prev => ({
      ...prev,
      progress,
      topicStats,
      recentSessions,
      totalStudyTime,
      masteredQuestions,
      overallAccuracy,
      readinessScore,
    }));
  }

  function getQuestionsByCategory(category: Category): Question[] {
    return state.questions.filter(q => q.category === category);
  }

  function getQuestionsByTopic(topic: string): Question[] {
    return state.questions.filter(q => q.topic === topic);
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        refreshStats,
        getQuestionsByCategory,
        getQuestionsByTopic,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
