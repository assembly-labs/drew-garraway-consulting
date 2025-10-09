import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

export default function RateLimitWarning({ minutesRemaining, count }) {
  return (
    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={24} />
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-900 mb-1">
            Generation Limit Reached
          </h3>
          <p className="text-sm text-yellow-800 mb-3">
            You've used {count} regenerations in the last 10 minutes. This helps us conserve tokens and keep costs low!
          </p>
          <div className="flex items-center gap-2 text-yellow-900 font-medium">
            <Clock size={18} />
            <span>Next available in: {minutesRemaining} minute{minutesRemaining !== 1 ? 's' : ''}</span>
          </div>
          <p className="text-xs text-yellow-700 mt-2">
            💡 Tip: You can still edit your current draft or start over with a new prompt
          </p>
        </div>
      </div>
    </div>
  );
}
