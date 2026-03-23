import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, ChevronRight, RotateCcw, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getWeakQuestions, updateProgress, startSession, updateSession, endSession } from '../lib/db';
import type { Question } from '../lib/types';

export function WeakAreas() {
  const navigate = useNavigate();
  const { refreshStats } = useApp();

  const [weakQuestions, setWeakQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStats, setSessionStats] = useState({ attempted: 0, correct: 0 });
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    loadWeakQuestions();
  }, []);

  const loadWeakQuestions = async () => {
    setIsLoading(true);
    try {
      const questions = await getWeakQuestions(20);
      setWeakQuestions(questions);
    } catch (error) {
      console.error('Failed to load weak questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startStudy = async () => {
    const id = await startSession('weak-areas');
    setSessionId(id);
    setIsStarted(true);
  };

  const handleSelectAnswer = async (optionIndex: number) => {
    if (showResult) return;

    const currentQuestion = weakQuestions[currentIndex];
    setSelectedAnswer(optionIndex);
    setShowResult(true);

    const isCorrect = optionIndex === currentQuestion.correctOption;

    if (navigator.vibrate) {
      navigator.vibrate(isCorrect ? [50] : [50, 50, 50]);
    }

    await updateProgress(currentQuestion.id, isCorrect);

    const newStats = {
      attempted: sessionStats.attempted + 1,
      correct: sessionStats.correct + (isCorrect ? 1 : 0),
    };
    setSessionStats(newStats);
    if (sessionId) {
      await updateSession(sessionId, newStats.attempted, newStats.correct);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    if (currentIndex < weakQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleExit = async () => {
    if (sessionId) {
      await endSession(sessionId);
      await refreshStats();
    }
    navigate('/study');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  // No weak questions
  if (weakQuestions.length === 0 && !isStarted) {
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
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success-500/10 flex items-center justify-center">
            <Check className="w-10 h-10 text-success-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Great Job!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            You don't have any weak areas right now. Keep studying to identify areas that need more practice.
          </p>
          <button
            onClick={() => navigate('/study/flashcard')}
            className="bg-primary-500 hover:bg-primary-600 text-white rounded-xl py-3 px-6 font-medium transition-colors"
          >
            Continue Studying
          </button>
        </div>
      </div>
    );
  }

  // Start screen
  if (!isStarted) {
    return (
      <div className="p-4 max-w-lg mx-auto">
        <button
          onClick={() => navigate('/study')}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-warning-500/10 flex items-center justify-center">
            <Zap className="w-6 h-6 text-warning-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Weak Areas
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Focus on questions you've missed
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
          <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            {weakQuestions.length}
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            questions need review
          </p>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          These are questions you've answered incorrectly or haven't mastered yet.
          Focusing on weak areas helps you improve faster and retain information better.
        </p>

        <button
          onClick={startStudy}
          className="w-full flex items-center justify-center gap-2 bg-warning-500 hover:bg-warning-600 text-white rounded-xl py-3 px-4 font-medium transition-colors"
        >
          <Zap className="w-5 h-5" />
          Start Review
        </button>
      </div>
    );
  }

  // Session complete
  if (currentIndex >= weakQuestions.length || (showResult && currentIndex === weakQuestions.length - 1)) {
    const accuracy = sessionStats.attempted > 0
      ? Math.round((sessionStats.correct / sessionStats.attempted) * 100)
      : 0;

    return (
      <div className="p-4 max-w-lg mx-auto">
        <div className="text-center py-12">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
            accuracy >= 70 ? 'bg-success-500/10' : 'bg-warning-500/10'
          }`}>
            {accuracy >= 70 ? (
              <Check className="w-10 h-10 text-success-500" />
            ) : (
              <RotateCcw className="w-10 h-10 text-warning-500" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Review Complete!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {accuracy >= 70 ? 'Great improvement!' : 'Keep practicing these topics'}
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
              onClick={async () => {
                await loadWeakQuestions();
                setCurrentIndex(0);
                setSessionStats({ attempted: 0, correct: 0 });
                setSelectedAnswer(null);
                setShowResult(false);
                setIsStarted(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-warning-500 hover:bg-warning-600 text-white rounded-xl py-3 px-4 font-medium transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Review More
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

  const currentQuestion = weakQuestions[currentIndex];
  const progress = ((currentIndex + 1) / weakQuestions.length) * 100;

  return (
    <div className="p-4 max-w-lg mx-auto min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={handleExit} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <ArrowLeft className="w-5 h-5" />
          Exit
        </button>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {currentIndex + 1} / {weakQuestions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-warning-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Topic badge */}
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-warning-500" />
        <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {currentQuestion.topic}
        </span>
      </div>

      {/* Question */}
      <div className="flex-1">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm mb-4">
          <p className="text-lg text-slate-900 dark:text-white leading-relaxed">
            {currentQuestion.question}
          </p>
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctOption;
            const showCorrect = showResult && isCorrect;
            const showWrong = showResult && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  showCorrect
                    ? 'border-success-500 bg-success-500/10'
                    : showWrong
                    ? 'border-error-500 bg-error-500/10'
                    : isSelected
                    ? 'border-warning-500 bg-warning-500/10'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
                    showCorrect
                      ? 'bg-success-500 text-white'
                      : showWrong
                      ? 'bg-error-500 text-white'
                      : isSelected
                      ? 'bg-warning-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-sm text-slate-700 dark:text-slate-200">
                    {option}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div className="bg-warning-50 dark:bg-warning-900/20 rounded-xl p-4 mt-4">
            <p className="text-sm font-medium text-warning-700 dark:text-warning-300 mb-1">
              Explanation
            </p>
            <p className="text-sm text-warning-600 dark:text-warning-200">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Next button */}
      {showResult && (
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 bg-warning-500 hover:bg-warning-600 text-white rounded-xl py-3 px-4 font-medium transition-colors mt-4"
        >
          {currentIndex < weakQuestions.length - 1 ? 'Next Question' : 'See Results'}
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Session stats */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <span className="text-success-500">{sessionStats.correct} correct</span>
        <span className="text-error-500">{sessionStats.attempted - sessionStats.correct} wrong</span>
      </div>
    </div>
  );
}
