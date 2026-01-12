import Dexie, { type EntityTable } from 'dexie';
import type { Question, UserProgress, StudySession } from './types';

const db = new Dexie('PAReExamDB') as Dexie & {
  questions: EntityTable<Question, 'id'>;
  progress: EntityTable<UserProgress, 'id'>;
  sessions: EntityTable<StudySession, 'id'>;
};

db.version(1).stores({
  questions: 'id, category, topic, difficulty, weight',
  progress: 'id, questionId, lastReviewed, nextReviewDate, correctStreak',
  sessions: 'id, startTime, mode, category',
});

export { db };

// Helper functions
export async function getQuestionProgress(questionId: string): Promise<UserProgress | undefined> {
  return db.progress.where('questionId').equals(questionId).first();
}

export async function updateProgress(
  questionId: string,
  isCorrect: boolean,
  confidence: number = 3
): Promise<void> {
  const existing = await getQuestionProgress(questionId);
  const now = Date.now();

  if (existing) {
    const newStreak = isCorrect ? existing.correctStreak + 1 : 0;
    const newIncorrect = isCorrect ? existing.incorrectCount : existing.incorrectCount + 1;

    // Spaced repetition: calculate next review date
    // Base interval multiplied by streak (capped at 30 days)
    const baseInterval = 24 * 60 * 60 * 1000; // 1 day in ms
    const multiplier = Math.min(Math.pow(2, newStreak), 30);
    const nextReview = now + (baseInterval * multiplier);

    await db.progress.update(existing.id, {
      lastReviewed: now,
      correctStreak: newStreak,
      incorrectCount: newIncorrect,
      totalAttempts: existing.totalAttempts + 1,
      confidence,
      nextReviewDate: nextReview,
    });
  } else {
    const nextReview = isCorrect
      ? now + (24 * 60 * 60 * 1000) // 1 day if correct
      : now + (4 * 60 * 60 * 1000); // 4 hours if wrong

    await db.progress.add({
      id: `prog_${questionId}`,
      questionId,
      lastReviewed: now,
      correctStreak: isCorrect ? 1 : 0,
      incorrectCount: isCorrect ? 0 : 1,
      totalAttempts: 1,
      confidence,
      nextReviewDate: nextReview,
    });
  }
}

export async function getQuestionsForReview(
  category?: string,
  topic?: string,
  limit: number = 20
): Promise<Question[]> {
  const now = Date.now();

  // Get all progress records due for review
  const dueProgress = await db.progress
    .where('nextReviewDate')
    .belowOrEqual(now)
    .toArray();

  const dueQuestionIds = new Set(dueProgress.map(p => p.questionId));

  // Get questions
  let query = db.questions.toCollection();

  if (category) {
    query = db.questions.where('category').equals(category);
  }

  let questions = await query.toArray();

  if (topic) {
    questions = questions.filter(q => q.topic === topic);
  }

  // Prioritize questions due for review and those never attempted
  const allProgress = await db.progress.toArray();
  const attemptedIds = new Set(allProgress.map(p => p.questionId));

  // Sort: never attempted first, then due for review, then by weight
  questions.sort((a, b) => {
    const aAttempted = attemptedIds.has(a.id);
    const bAttempted = attemptedIds.has(b.id);
    const aDue = dueQuestionIds.has(a.id);
    const bDue = dueQuestionIds.has(b.id);

    // Never attempted gets highest priority
    if (!aAttempted && bAttempted) return -1;
    if (aAttempted && !bAttempted) return 1;

    // Due for review gets next priority
    if (aDue && !bDue) return -1;
    if (!aDue && bDue) return 1;

    // Then sort by weight (higher weight = more likely to appear on exam)
    return b.weight - a.weight;
  });

  return questions.slice(0, limit);
}

export async function getWeakQuestions(limit: number = 20): Promise<Question[]> {
  // Get questions with low accuracy (incorrectCount > correctStreak)
  const progressRecords = await db.progress.toArray();

  const weakQuestionIds = progressRecords
    .filter(p => p.incorrectCount > 0 && p.correctStreak < 2)
    .sort((a, b) => b.incorrectCount - a.incorrectCount)
    .map(p => p.questionId);

  const questions = await db.questions.bulkGet(weakQuestionIds);
  return questions.filter((q): q is Question => q !== undefined).slice(0, limit);
}

export async function getTopicStats(): Promise<Map<string, {
  attempted: number;
  correct: number;
  total: number;
  mastered: number;
}>> {
  const questions = await db.questions.toArray();
  const progress = await db.progress.toArray();

  const progressMap = new Map(progress.map(p => [p.questionId, p]));
  const stats = new Map<string, { attempted: number; correct: number; total: number; mastered: number }>();

  for (const q of questions) {
    const key = `${q.category}:${q.topic}`;
    if (!stats.has(key)) {
      stats.set(key, { attempted: 0, correct: 0, total: 0, mastered: 0 });
    }

    const s = stats.get(key)!;
    s.total++;

    const prog = progressMap.get(q.id);
    if (prog) {
      s.attempted++;
      if (prog.correctStreak > 0) {
        s.correct += prog.correctStreak;
      }
      if (prog.correctStreak >= 3) {
        s.mastered++;
      }
    }
  }

  return stats;
}

export async function startSession(mode: string, category?: string): Promise<string> {
  const id = `session_${Date.now()}`;
  await db.sessions.add({
    id,
    startTime: Date.now(),
    mode: mode as StudySession['mode'],
    questionsAttempted: 0,
    correctAnswers: 0,
    category: category as StudySession['category'],
  });
  return id;
}

export async function updateSession(
  sessionId: string,
  questionsAttempted: number,
  correctAnswers: number
): Promise<void> {
  await db.sessions.update(sessionId, {
    questionsAttempted,
    correctAnswers,
  });
}

export async function endSession(sessionId: string): Promise<void> {
  await db.sessions.update(sessionId, {
    endTime: Date.now(),
  });
}

export async function getRecentSessions(limit: number = 10): Promise<StudySession[]> {
  return db.sessions
    .orderBy('startTime')
    .reverse()
    .limit(limit)
    .toArray();
}

export async function getTotalStudyTime(): Promise<number> {
  const sessions = await db.sessions.toArray();
  return sessions.reduce((total, s) => {
    if (s.endTime) {
      return total + (s.endTime - s.startTime);
    }
    return total;
  }, 0);
}

export async function resetAllProgress(): Promise<void> {
  await db.progress.clear();
  await db.sessions.clear();
}
