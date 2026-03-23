import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Check, X, ChevronLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSwipe } from '../hooks/useSwipe';
import { updateProgress, startSession, updateSession, endSession } from '../lib/db';
import type { Question } from '../lib/types';

export function Flashcard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { questions, refreshStats } = useApp();

  const topic = searchParams.get('topic');
  const category = searchParams.get('category');

  const [studyQuestions, setStudyQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStats, setSessionStats] = useState({ attempted: 0, correct: 0 });
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    // Filter questions based on params
    let filtered = [...questions];
    if (category) {
      filtered = filtered.filter(q => q.category === category);
    }
    if (topic) {
      filtered = filtered.filter(q => q.topic === topic);
    }
    // Shuffle questions
    filtered.sort(() => Math.random() - 0.5);
    setStudyQuestions(filtered);

    // Start session
    startSession('flashcard', category || undefined).then(id => {
      setSessionId(id);
    });

    return () => {
      if (sessionId) {
        endSession(sessionId);
        refreshStats();
      }
    };
  }, [questions, topic, category]);

  const currentQuestion = studyQuestions[currentIndex];

  const handleAnswer = useCallback(async (isCorrect: boolean) => {
    if (!currentQuestion) return;

    // Animate swipe
    setSwipeDirection(isCorrect ? 'right' : 'left');

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(isCorrect ? [50] : [50, 50, 50]);
    }

    // Update progress
    await updateProgress(currentQuestion.id, isCorrect);

    // Update session stats
    const newStats = {
      attempted: sessionStats.attempted + 1,
      correct: sessionStats.correct + (isCorrect ? 1 : 0),
    };
    setSessionStats(newStats);
    if (sessionId) {
      await updateSession(sessionId, newStats.attempted, newStats.correct);
    }

    // Move to next card after animation
    setTimeout(() => {
      setSwipeDirection(null);
      setIsFlipped(false);
      if (currentIndex < studyQuestions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    }, 300);
  }, [currentQuestion, currentIndex, studyQuestions.length, sessionId, sessionStats]);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const { handlers, deltaX, isSwiping } = useSwipe({
    onSwipeLeft: () => {
      if (isFlipped) handleAnswer(false);
    },
    onSwipeRight: () => {
      if (isFlipped) handleAnswer(true);
    },
    onSwipeUp: handleFlip,
    onTap: handleFlip,
  });

  const handleExit = async () => {
    if (sessionId) {
      await endSession(sessionId);
      await refreshStats();
    }
    navigate('/study');
  };

  if (studyQuestions.length === 0) {
    return (
      <div className="p-4 max-w-lg mx-auto">
        <button
          onClick={() => navigate('/study')}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">
            No questions found for this selection.
          </p>
        </div>
      </div>
    );
  }

  if (currentIndex >= studyQuestions.length) {
    // Session complete
    const accuracy = sessionStats.attempted > 0
      ? Math.round((sessionStats.correct / sessionStats.attempted) * 100)
      : 0;

    return (
      <div className="p-4 max-w-lg mx-auto">
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success-500/10 flex items-center justify-center">
            <Check className="w-10 h-10 text-success-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Session Complete!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            You reviewed {sessionStats.attempted} cards
          </p>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-bold text-success-500">{sessionStats.correct}</p>
                <p className="text-sm text-slate-500">Correct</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-error-500">{sessionStats.attempted - sessionStats.correct}</p>
                <p className="text-sm text-slate-500">Incorrect</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-4xl font-bold text-slate-900 dark:text-white">{accuracy}%</p>
              <p className="text-sm text-slate-500">Accuracy</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setSessionStats({ attempted: 0, correct: 0 });
                setStudyQuestions(prev => [...prev].sort(() => Math.random() - 0.5));
              }}
              className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl py-3 px-4 font-medium transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Study Again
            </button>
            <button
              onClick={handleExit}
              className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl py-3 px-4 font-medium transition-colors"
            >
              Back to Study Modes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / studyQuestions.length) * 100;

  return (
    <div className="p-4 max-w-lg mx-auto min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleExit}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400"
        >
          <ArrowLeft className="w-5 h-5" />
          Exit
        </button>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {currentIndex + 1} / {studyQuestions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-primary-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Topic badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs px-2 py-1 rounded-full ${
          currentQuestion.category === 'national'
            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
            : 'bg-warning-500/10 text-warning-600 dark:text-warning-400'
        }`}>
          {currentQuestion.category === 'national' ? 'National' : 'PA State'}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {currentQuestion.topic}
        </span>
      </div>

      {/* Flashcard */}
      <div className="flex-1 flex items-center justify-center">
        <div
          {...handlers}
          className="flip-card w-full max-w-sm aspect-[3/4] cursor-pointer select-none"
          style={{
            touchAction: 'none',
            transform: isSwiping
              ? `translateX(${deltaX}px) rotate(${deltaX * 0.05}deg)`
              : swipeDirection === 'left'
              ? 'translateX(-200%) rotate(-30deg)'
              : swipeDirection === 'right'
              ? 'translateX(200%) rotate(30deg)'
              : 'none',
            transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
            opacity: swipeDirection ? 0 : 1,
          }}
        >
          <div className={`flip-card-inner w-full h-full ${isFlipped ? 'flipped' : ''}`}>
            {/* Front - Question */}
            <div className="flip-card-front absolute inset-0 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 flex flex-col">
              <div className="flex-1 flex items-center justify-center">
                <p className="text-lg text-center text-slate-900 dark:text-white leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>
              <p className="text-center text-sm text-slate-400 mt-4">
                Tap to reveal answer
              </p>
            </div>

            {/* Back - Answer */}
            <div className="flip-card-back absolute inset-0 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 flex flex-col overflow-y-auto">
              <div className="flex-1 flex flex-col justify-start pt-2">
                <p className="text-xl font-semibold text-center text-primary-600 dark:text-primary-400 mb-3">
                  {currentQuestion.answer}
                </p>
                <p className="text-sm text-center text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {currentQuestion.explanation}
                </p>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-700/50">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1 uppercase tracking-wide">Remember It Like This</p>
                  <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
                    {currentQuestion.memoryHook}
                  </p>
                </div>
              </div>
              <p className="text-center text-sm text-slate-400 mt-3 flex-shrink-0">
                Swipe right = correct, left = wrong
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Button controls (alternative to swipe) */}
      {isFlipped && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => handleAnswer(false)}
            className="w-16 h-16 rounded-full bg-error-500/10 text-error-500 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            onClick={goBack}
            disabled={currentIndex === 0}
            className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center disabled:opacity-30"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="w-16 h-16 rounded-full bg-success-500/10 text-success-500 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          >
            <Check className="w-8 h-8" />
          </button>
        </div>
      )}

      {/* Session stats */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <span className="text-success-500">{sessionStats.correct} correct</span>
        <span className="text-error-500">{sessionStats.attempted - sessionStats.correct} wrong</span>
      </div>
    </div>
  );
}
