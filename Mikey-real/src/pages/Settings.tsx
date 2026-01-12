import { useState } from 'react';
import { Trash2, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { resetAllProgress } from '../lib/db';

export function Settings() {
  const { refreshStats } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await resetAllProgress();
      await refreshStats();
      setShowResetConfirm(false);
    } catch (error) {
      console.error('Failed to reset progress:', error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Settings
      </h1>

      {/* Data */}
      <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
        Data
      </h2>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden mb-6">
        <button
          onClick={() => setShowResetConfirm(true)}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-error-500" />
            <div className="text-left">
              <p className="font-medium text-slate-900 dark:text-white">
                Reset Progress
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Clear all study data
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* About */}
      <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
        About
      </h2>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">PA</span>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                PA Real Estate Exam Prep
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Version 1.0.0
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            A comprehensive study tool for the Pennsylvania Real Estate License Exam, covering both National and State portions with spaced repetition learning.
          </p>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-700 p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Offline Ready
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                This app works completely offline. All your progress is saved locally on your device.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Exam Info */}
      <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
        PA Exam Information
      </h2>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 space-y-4">
        <div>
          <p className="font-medium text-slate-900 dark:text-white mb-1">
            National Portion
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            80 questions • 120 minutes • 75% to pass
          </p>
        </div>
        <div>
          <p className="font-medium text-slate-900 dark:text-white mb-1">
            State Portion
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            40 questions • 60 minutes • 75% to pass
          </p>
        </div>
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-400">
            Must pass both portions to receive license. Scores are valid for 1 year.
          </p>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 text-error-500 mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Reset All Progress?</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              This will delete all your study progress, session history, and statistics. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                disabled={isResetting}
                className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl py-2 font-medium transition-colors hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="flex-1 bg-error-500 hover:bg-error-600 text-white rounded-xl py-2 font-medium transition-colors disabled:opacity-50"
              >
                {isResetting ? 'Resetting...' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
