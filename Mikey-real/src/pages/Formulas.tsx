import { Calculator, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { MATH_FORMULAS } from '../lib/types';

export function Formulas() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyFormula = (formula: string, index: number) => {
    navigator.clipboard.writeText(formula);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-primary-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Math Formulas
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Quick reference for exam calculations
          </p>
        </div>
      </div>

      {/* Formulas List */}
      <div className="space-y-4">
        {MATH_FORMULAS.map((item, index) => (
          <div
            key={item.name}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {item.name}
                </h3>
                <button
                  onClick={() => copyFormula(item.formula, index)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  title="Copy formula"
                >
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-success-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
              <p className="text-primary-600 dark:text-primary-400 font-mono text-sm bg-primary-50 dark:bg-primary-900/20 rounded-lg px-3 py-2 mb-3">
                {item.formula}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Example:</span>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {item.example}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="mt-8 bg-warning-500/10 rounded-xl p-4">
        <h3 className="font-semibold text-warning-700 dark:text-warning-300 mb-3">
          Quick Tips
        </h3>
        <ul className="space-y-2 text-sm text-warning-600 dark:text-warning-400">
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>Always convert percentages to decimals (6% = 0.06)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>For prorations, determine if item is paid in advance or arrears</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>Remember: 1 acre = 43,560 square feet</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>Use 365 days for daily proration unless told otherwise</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>Commission splits: Total × Broker % × Agent %</span>
          </li>
        </ul>
      </div>

      {/* Common Conversions */}
      <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
          Common Conversions
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Area</p>
            <p className="text-slate-900 dark:text-white">1 acre = 43,560 sq ft</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Area</p>
            <p className="text-slate-900 dark:text-white">1 sq mile = 640 acres</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Length</p>
            <p className="text-slate-900 dark:text-white">1 mile = 5,280 ft</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Time</p>
            <p className="text-slate-900 dark:text-white">1 year = 365 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}
