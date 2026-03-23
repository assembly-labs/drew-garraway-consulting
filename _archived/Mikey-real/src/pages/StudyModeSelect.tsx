import { Link } from 'react-router-dom';
import { BookOpen, Brain, Clock, Zap, ChevronRight, Calculator } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NATIONAL_TOPICS, PA_STATE_TOPICS } from '../lib/types';

export function StudyModeSelect() {
  const { topicStats } = useApp();

  const getTopicAccuracy = (topicName: string) => {
    const stats = topicStats.find(t => t.topic === topicName);
    return stats?.accuracy ?? 0;
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Study Mode
      </h1>

      {/* Study Modes */}
      <div className="space-y-3 mb-8">
        <Link
          to="/study/flashcard"
          className="flex items-center justify-between bg-primary-500 hover:bg-primary-600 text-white rounded-xl p-4 transition-colors"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6" />
            <div>
              <p className="font-semibold">Flashcards</p>
              <p className="text-sm text-primary-100">Swipe to study</p>
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
              <p className="text-sm text-slate-500 dark:text-slate-400">Multiple choice</p>
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
              <p className="text-sm text-slate-500 dark:text-slate-400">Timed practice</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </Link>

        <Link
          to="/study/weak"
          className="flex items-center justify-between bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl p-4 transition-colors shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-warning-500" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Weak Areas</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Focus on trouble spots</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </Link>

        <Link
          to="/study/flashcard?topic=Real%20Estate%20Math"
          className="flex items-center justify-between bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl p-4 transition-colors shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Calculator className="w-6 h-6 text-primary-500" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Math Drills</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Practice calculations</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </Link>
      </div>

      {/* National Topics */}
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
        National Exam Topics
      </h2>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden mb-6">
        {NATIONAL_TOPICS.map((topic, index) => (
          <Link
            key={topic.name}
            to={`/study/flashcard?topic=${encodeURIComponent(topic.name)}&category=national`}
            className={`flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
              index < NATIONAL_TOPICS.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''
            }`}
          >
            <div className="flex-1">
              <p className="font-medium text-slate-900 dark:text-white text-sm">
                {topic.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {topic.weight}% of exam
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${
                getTopicAccuracy(topic.name) >= 70
                  ? 'text-success-500'
                  : getTopicAccuracy(topic.name) > 0
                  ? 'text-warning-500'
                  : 'text-slate-400'
              }`}>
                {getTopicAccuracy(topic.name) > 0 ? `${Math.round(getTopicAccuracy(topic.name))}%` : '—'}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </Link>
        ))}
      </div>

      {/* PA State Topics */}
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
        PA State Topics
      </h2>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        {PA_STATE_TOPICS.map((topic, index) => (
          <Link
            key={topic.name}
            to={`/study/flashcard?topic=${encodeURIComponent(topic.name)}&category=pa-state`}
            className={`flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
              index < PA_STATE_TOPICS.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''
            }`}
          >
            <div className="flex-1">
              <p className="font-medium text-slate-900 dark:text-white text-sm">
                {topic.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {topic.weight}% of exam
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${
                getTopicAccuracy(topic.name) >= 70
                  ? 'text-success-500'
                  : getTopicAccuracy(topic.name) > 0
                  ? 'text-warning-500'
                  : 'text-slate-400'
              }`}>
                {getTopicAccuracy(topic.name) > 0 ? `${Math.round(getTopicAccuracy(topic.name))}%` : '—'}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
