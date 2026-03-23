import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, ChevronRight, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { updateProgress, startSession, updateSession, endSession } from '../lib/db';
import type { Question } from '../lib/types';

export function Quiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { questions, refreshStats } = useApp();

  const topic = searchParams.get('topic');
  const category = searchParams.get('category');

  const [studyQuestions, setStudyQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStats, setSessionStats] = useState({ attempted: 0, correct: 0 });

  useEffect(() => {
    let filtered = [...questions];
    if (category) {
      filtered = filtered.filter(q => q.category === category);
    }
    if (topic) {
      filtered = filtered.filter(q => q.topic === topic);
    }
    filtered.sort(() => Math.random() - 0.5);
    setStudyQuestions(filtered.slice(0, 20)); // 20 questions per quiz

    startSession('quiz', category || undefined).then(id => {
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

  const handleSelectAnswer = async (optionIndex: number) => {
    if (showResult) return;

    setSelectedAnswer(optionIndex);
    setShowResult(true);

    const isCorrect = optionIndex === currentQuestion.correctOption;

    // Haptic feedback
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
    if (currentIndex < studyQuestions.length - 1) {
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

  // Quiz complete
  if (currentIndex >= studyQuestions.length || (showResult && currentIndex === studyQuestions.length - 1 && selectedAnswer !== null)) {
    const isComplete = currentIndex >= studyQuestions.length || (currentIndex === studyQuestions.length - 1 && showResult);

    if (isComplete && currentIndex === studyQuestions.length - 1 && showResult) {
      // Show last question result, then show completion on next click
      return (
        <div className="p-4 max-w-lg mx-auto min-h-screen flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handleExit} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <ArrowLeft className="w-5 h-5" />
              Exit
            </button>
            <span className="text-sm text-slate-500">{currentIndex + 1} / {studyQuestions.length}</span>
          </div>

          <div className="flex-1">
            <QuestionCard
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              showResult={showResult}
              onSelect={handleSelectAnswer}
            />
          </div>

          <button
            onClick={() => setCurrentIndex(studyQuestions.length)}
            className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl py-3 px-4 font-medium transition-colors mt-4"
          >
            See Results
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      );
    }

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
            Quiz Complete!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {accuracy >= 70 ? 'Great job!' : 'Keep practicing!'}
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
                setSelectedAnswer(null);
                setShowResult(false);
                setStudyQuestions(prev => [...prev].sort(() => Math.random() - 0.5));
              }}
              className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl py-3 px-4 font-medium transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
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
        <button onClick={handleExit} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
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

      {/* Question */}
      <div className="flex-1">
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          showResult={showResult}
          onSelect={handleSelectAnswer}
        />
      </div>

      {/* Next button */}
      {showResult && (
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl py-3 px-4 font-medium transition-colors mt-4"
        >
          Next Question
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

function QuestionCard({
  question,
  selectedAnswer,
  showResult,
  onSelect,
}: {
  question: Question;
  selectedAnswer: number | null;
  showResult: boolean;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
        <p className="text-lg text-slate-900 dark:text-white leading-relaxed">
          {question.question}
        </p>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctOption;
          const showCorrect = showResult && isCorrect;
          const showWrong = showResult && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => onSelect(index)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                showCorrect
                  ? 'border-success-500 bg-success-500/10'
                  : showWrong
                  ? 'border-error-500 bg-error-500/10'
                  : isSelected
                  ? 'border-primary-500 bg-primary-500/10'
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
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {showCorrect ? <Check className="w-4 h-4" /> : showWrong ? <X className="w-4 h-4" /> : String.fromCharCode(65 + index)}
                </span>
                <span className={`text-sm ${
                  showCorrect
                    ? 'text-success-700 dark:text-success-300 font-medium'
                    : showWrong
                    ? 'text-error-700 dark:text-error-300'
                    : 'text-slate-700 dark:text-slate-200'
                }`}>
                  {option}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showResult && (
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 mt-4">
          <p className="text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
            Explanation
          </p>
          <p className="text-sm text-primary-600 dark:text-primary-200">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
