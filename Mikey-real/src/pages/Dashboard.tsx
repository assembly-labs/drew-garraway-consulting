import { Link } from 'react-router-dom';
import { BookOpen, Brain, Clock, Target, ChevronRight, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProgressRing } from '../components/ProgressRing';

export function Dashboard() {
  const {
    isLoading,
    readinessScore,
    totalQuestions,
    masteredQuestions,
    overallAccuracy,
    totalStudyTime,
    topicStats,
  } = useApp();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const weakTopics = topicStats
    .filter(t => t.attempted > 0 && t.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          PA Real Estate Exam Prep
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          National + State Exam
        </p>
      </div>

      {/* Readiness Score */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              Exam Readiness
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {readinessScore >= 80
                ? 'Great job! You\'re ready!'
                : readinessScore >= 60
                ? 'Getting there, keep studying!'
                : 'Keep practicing to improve'}
            </p>
          </div>
          <ProgressRing progress={readinessScore} size={100} strokeWidth={8}>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {Math.round(readinessScore)}%
            </span>
          </ProgressRing>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-primary-500 mb-2">
            <Target className="w-5 h-5" />
            <span className="text-sm font-medium">Mastered</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {masteredQuestions}/{totalQuestions}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-success-500 mb-2">
            <Brain className="w-5 h-5" />
            <span className="text-sm font-medium">Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {Math.round(overallAccuracy)}%
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm col-span-2">
          <div className="flex items-center gap-2 text-warning-500 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">Study Time</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatTime(totalStudyTime)}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
        Quick Start
      </h3>
      <div className="space-y-3 mb-6">
        <Link
          to="/study/flashcard"
          className="flex items-center justify-between bg-primary-500 hover:bg-primary-600 text-white rounded-xl p-4 transition-colors"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6" />
            <div>
              <p className="font-semibold">Flashcard Study</p>
              <p className="text-sm text-primary-100">Swipe through cards</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5" />
        </Link>

        <Link
          to="/study/quiz"
          className="flex items-center justify-between bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl p-4 transition-colors shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-success-500" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Quiz Mode</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Multiple choice practice</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </Link>

        <Link
          to="/study/exam"
          className="flex items-center justify-between bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl p-4 transition-colors shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-error-500" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Exam Simulation</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Timed practice test</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </Link>
      </div>

      {/* Weak Areas */}
      {weakTopics.length > 0 && (
        <>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            Focus Areas
          </h3>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden mb-6">
            {weakTopics.map((topic, index) => (
              <Link
                key={topic.topic}
                to={`/study/flashcard?topic=${encodeURIComponent(topic.topic)}`}
                className={`flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                  index < weakTopics.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-warning-500" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">
                      {topic.topic}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {topic.category === 'national' ? 'National' : 'PA State'} • {Math.round(topic.accuracy)}% accuracy
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
