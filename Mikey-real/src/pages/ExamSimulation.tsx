import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, AlertTriangle, Check, X, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { updateProgress, startSession, updateSession, endSession } from '../lib/db';
import { EXAM_CONFIGS, type ExamConfig, type Question } from '../lib/types';

type ExamAnswer = {
  questionId: string;
  selectedOption: number | null;
  flagged: boolean;
};

export function ExamSimulation() {
  const navigate = useNavigate();
  const { questions, refreshStats } = useApp();

  const [selectedConfig, setSelectedConfig] = useState<ExamConfig | null>(null);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Map<string, ExamAnswer>>(new Map());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer effect
  useEffect(() => {
    if (isStarted && !isSubmitted && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          // Show warning at 5 minutes
          if (prev === 300) {
            setShowWarning(true);
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, isSubmitted]);

  const startExam = useCallback(async (config: ExamConfig) => {
    setSelectedConfig(config);

    // Select questions based on config
    let filtered: Question[] = [];
    if (config.category === 'both') {
      const national = questions.filter(q => q.category === 'national');
      const state = questions.filter(q => q.category === 'pa-state');
      // 80 national, 40 state
      const shuffledNational = [...national].sort(() => Math.random() - 0.5).slice(0, 80);
      const shuffledState = [...state].sort(() => Math.random() - 0.5).slice(0, 40);
      filtered = [...shuffledNational, ...shuffledState];
    } else {
      filtered = questions
        .filter(q => q.category === config.category)
        .sort(() => Math.random() - 0.5)
        .slice(0, config.questionCount);
    }

    setExamQuestions(filtered);
    setTimeRemaining(config.timeMinutes * 60);

    // Initialize answers
    const initialAnswers = new Map<string, ExamAnswer>();
    filtered.forEach(q => {
      initialAnswers.set(q.id, { questionId: q.id, selectedOption: null, flagged: false });
    });
    setAnswers(initialAnswers);

    // Start session
    const id = await startSession('exam', config.category === 'both' ? undefined : config.category);
    setSessionId(id);
    setIsStarted(true);
  }, [questions]);

  const handleSelectAnswer = (optionIndex: number) => {
    const question = examQuestions[currentIndex];
    setAnswers(prev => {
      const newAnswers = new Map(prev);
      const existing = newAnswers.get(question.id);
      newAnswers.set(question.id, {
        ...existing!,
        selectedOption: optionIndex,
      });
      return newAnswers;
    });
  };

  const toggleFlag = () => {
    const question = examQuestions[currentIndex];
    setAnswers(prev => {
      const newAnswers = new Map(prev);
      const existing = newAnswers.get(question.id);
      newAnswers.set(question.id, {
        ...existing!,
        flagged: !existing!.flagged,
      });
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSubmitted(true);

    // Calculate results and update progress
    let correct = 0;
    for (const question of examQuestions) {
      const answer = answers.get(question.id);
      const isCorrect = answer?.selectedOption === question.correctOption;
      if (isCorrect) correct++;
      await updateProgress(question.id, isCorrect);
    }

    if (sessionId) {
      await updateSession(sessionId, examQuestions.length, correct);
      await endSession(sessionId);
    }
    await refreshStats();
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Exam selection screen
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

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Exam Simulation
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Practice under timed conditions
        </p>

        <div className="space-y-4">
          {EXAM_CONFIGS.map(config => (
            <button
              key={config.name}
              onClick={() => startExam(config)}
              className="w-full text-left bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {config.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {config.questionCount} questions • {config.timeMinutes} minutes
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 mt-1" />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 p-4 bg-warning-500/10 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-warning-700 dark:text-warning-300">
                Exam Tips
              </p>
              <ul className="text-sm text-warning-600 dark:text-warning-400 mt-1 space-y-1">
                <li>• Find a quiet place with no distractions</li>
                <li>• Have a calculator ready for math questions</li>
                <li>• Flag questions to review later</li>
                <li>• Don't spend too long on any single question</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (isSubmitted) {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    examQuestions.forEach(q => {
      const answer = answers.get(q.id);
      if (answer?.selectedOption === null) {
        unanswered++;
      } else if (answer?.selectedOption === q.correctOption) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const score = Math.round((correct / examQuestions.length) * 100);
    const passed = score >= 75; // PA requires 75% to pass

    return (
      <div className="p-4 max-w-lg mx-auto">
        <div className="text-center py-8">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            passed ? 'bg-success-500/10' : 'bg-error-500/10'
          }`}>
            {passed ? (
              <Check className="w-12 h-12 text-success-500" />
            ) : (
              <X className="w-12 h-12 text-error-500" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {passed ? 'You Passed!' : 'Keep Practicing'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {selectedConfig?.name} • {passed ? 'Score: 75%+ required' : 'Need 75% to pass'}
          </p>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6">
            <p className={`text-5xl font-bold mb-2 ${passed ? 'text-success-500' : 'text-error-500'}`}>
              {score}%
            </p>
            <p className="text-sm text-slate-500">Final Score</p>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div>
                <p className="text-2xl font-bold text-success-500">{correct}</p>
                <p className="text-xs text-slate-500">Correct</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-error-500">{incorrect}</p>
                <p className="text-xs text-slate-500">Incorrect</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-400">{unanswered}</p>
                <p className="text-xs text-slate-500">Skipped</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setIsStarted(false);
                setSelectedConfig(null);
                setExamQuestions([]);
                setAnswers(new Map());
                setCurrentIndex(0);
              }}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white rounded-xl py-3 px-4 font-medium transition-colors"
            >
              Take Another Exam
            </button>
            <button
              onClick={() => navigate('/study')}
              className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl py-3 px-4 font-medium transition-colors"
            >
              Back to Study Modes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = examQuestions[currentIndex];
  const currentAnswer = answers.get(currentQuestion.id);
  const answeredCount = Array.from(answers.values()).filter(a => a.selectedOption !== null).length;
  const flaggedCount = Array.from(answers.values()).filter(a => a.flagged).length;

  return (
    <div className="p-4 max-w-lg mx-auto min-h-screen flex flex-col">
      {/* Warning modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 text-warning-500 mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">5 Minutes Remaining!</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              You have 5 minutes left. Consider reviewing your flagged questions.
            </p>
            <button
              onClick={() => setShowWarning(false)}
              className="w-full bg-primary-500 text-white rounded-xl py-2 font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${timeRemaining < 300 ? 'text-error-500' : 'text-slate-500'}`} />
          <span className={`font-mono font-medium ${timeRemaining < 300 ? 'text-error-500' : 'text-slate-700 dark:text-slate-200'}`}>
            {formatTime(timeRemaining)}
          </span>
        </div>
        <span className="text-sm text-slate-500">
          {answeredCount}/{examQuestions.length} answered
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-primary-500 transition-all duration-300"
          style={{ width: `${(answeredCount / examQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            currentQuestion.category === 'national'
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
              : 'bg-warning-500/10 text-warning-600 dark:text-warning-400'
          }`}>
            {currentQuestion.category === 'national' ? 'National' : 'PA State'}
          </span>
          <span className="text-sm text-slate-500">Q{currentIndex + 1}</span>
        </div>
        <button
          onClick={toggleFlag}
          className={`p-2 rounded-lg transition-colors ${
            currentAnswer?.flagged
              ? 'bg-warning-500/10 text-warning-500'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Flag className="w-5 h-5" fill={currentAnswer?.flagged ? 'currentColor' : 'none'} />
        </button>
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
            const isSelected = currentAnswer?.selectedOption === index;

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
                    isSelected
                      ? 'bg-primary-500 text-white'
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
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 gap-3">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Prev
        </button>

        {currentIndex === examQuestions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="flex-1 bg-success-500 hover:bg-success-600 text-white rounded-xl py-2 font-medium transition-colors"
          >
            Submit Exam
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex(prev => Math.min(examQuestions.length - 1, prev + 1))}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white transition-colors"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Question navigator */}
      <div className="mt-4 flex flex-wrap gap-1 justify-center">
        {examQuestions.map((q, i) => {
          const answer = answers.get(q.id);
          const isAnswered = answer?.selectedOption !== null;
          const isFlagged = answer?.flagged;
          const isCurrent = i === currentIndex;

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className={`w-8 h-8 text-xs rounded-md font-medium transition-colors ${
                isCurrent
                  ? 'bg-primary-500 text-white'
                  : isFlagged
                  ? 'bg-warning-500/20 text-warning-600 dark:text-warning-400'
                  : isAnswered
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {flaggedCount > 0 && (
        <p className="text-center text-sm text-warning-500 mt-2">
          {flaggedCount} question{flaggedCount > 1 ? 's' : ''} flagged for review
        </p>
      )}
    </div>
  );
}
