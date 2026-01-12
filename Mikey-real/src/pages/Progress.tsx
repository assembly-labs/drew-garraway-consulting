import { useApp } from '../context/AppContext';
import { ProgressRing } from '../components/ProgressRing';
import { Target, TrendingUp, Clock, Award } from 'lucide-react';

export function Progress() {
  const {
    readinessScore,
    totalQuestions,
    masteredQuestions,
    overallAccuracy,
    totalStudyTime,
    topicStats,
    recentSessions,
  } = useApp();

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const nationalStats = topicStats.filter(t => t.category === 'national');
  const stateStats = topicStats.filter(t => t.category === 'pa-state');

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Your Progress
      </h1>

      {/* Readiness Score */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              Exam Readiness
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {readinessScore >= 80
                ? 'You\'re ready to take the exam!'
                : readinessScore >= 60
                ? 'Getting there, keep going!'
                : 'Keep studying to improve'}
            </p>
          </div>
          <ProgressRing progress={readinessScore} size={100} strokeWidth={8}>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {Math.round(readinessScore)}%
            </span>
          </ProgressRing>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-primary-500 mb-2">
            <Target className="w-5 h-5" />
            <span className="text-sm font-medium">Mastered</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {masteredQuestions}
          </p>
          <p className="text-xs text-slate-500">of {totalQuestions} questions</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-success-500 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {Math.round(overallAccuracy)}%
          </p>
          <p className="text-xs text-slate-500">overall correct</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-warning-500 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">Study Time</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatTime(totalStudyTime)}
          </p>
          <p className="text-xs text-slate-500">total time</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-error-500 mb-2">
            <Award className="w-5 h-5" />
            <span className="text-sm font-medium">Sessions</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {recentSessions.length}
          </p>
          <p className="text-xs text-slate-500">study sessions</p>
        </div>
      </div>

      {/* National Topics */}
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
        National Exam Topics
      </h2>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden mb-6">
        {nationalStats.length > 0 ? (
          nationalStats.map((topic, index) => (
            <div
              key={topic.topic}
              className={`p-4 ${
                index < nationalStats.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-900 dark:text-white truncate pr-4">
                  {topic.topic}
                </span>
                <span className={`text-sm font-semibold ${
                  topic.accuracy >= 70
                    ? 'text-success-500'
                    : topic.accuracy > 0
                    ? 'text-warning-500'
                    : 'text-slate-400'
                }`}>
                  {topic.attempted > 0 ? `${Math.round(topic.accuracy)}%` : '—'}
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    topic.accuracy >= 70 ? 'bg-success-500' : topic.accuracy > 0 ? 'bg-warning-500' : 'bg-slate-300'
                  }`}
                  style={{ width: `${Math.max(topic.accuracy, 0)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-slate-500">
                <span>{topic.attempted} attempted</span>
                <span>{topic.mastered} mastered</span>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-center text-slate-500">
            Start studying to see progress!
          </p>
        )}
      </div>

      {/* PA State Topics */}
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
        PA State Topics
      </h2>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden mb-6">
        {stateStats.length > 0 ? (
          stateStats.map((topic, index) => (
            <div
              key={topic.topic}
              className={`p-4 ${
                index < stateStats.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-900 dark:text-white truncate pr-4">
                  {topic.topic}
                </span>
                <span className={`text-sm font-semibold ${
                  topic.accuracy >= 70
                    ? 'text-success-500'
                    : topic.accuracy > 0
                    ? 'text-warning-500'
                    : 'text-slate-400'
                }`}>
                  {topic.attempted > 0 ? `${Math.round(topic.accuracy)}%` : '—'}
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    topic.accuracy >= 70 ? 'bg-success-500' : topic.accuracy > 0 ? 'bg-warning-500' : 'bg-slate-300'
                  }`}
                  style={{ width: `${Math.max(topic.accuracy, 0)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-slate-500">
                <span>{topic.attempted} attempted</span>
                <span>{topic.mastered} mastered</span>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-center text-slate-500">
            Start studying to see progress!
          </p>
        )}
      </div>

      {/* Recent Sessions */}
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
        Recent Sessions
      </h2>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        {recentSessions.length > 0 ? (
          recentSessions.slice(0, 5).map((session, index) => {
            const accuracy = session.questionsAttempted > 0
              ? Math.round((session.correctAnswers / session.questionsAttempted) * 100)
              : 0;
            const duration = session.endTime
              ? formatTime(session.endTime - session.startTime)
              : 'In progress';

            return (
              <div
                key={session.id}
                className={`p-4 ${
                  index < Math.min(recentSessions.length, 5) - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                      {session.mode} Mode
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(session.startTime)} • {duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      accuracy >= 70 ? 'text-success-500' : accuracy > 0 ? 'text-warning-500' : 'text-slate-400'
                    }`}>
                      {accuracy}%
                    </p>
                    <p className="text-xs text-slate-500">
                      {session.correctAnswers}/{session.questionsAttempted}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="p-4 text-center text-slate-500">
            No sessions yet. Start studying!
          </p>
        )}
      </div>
    </div>
  );
}
