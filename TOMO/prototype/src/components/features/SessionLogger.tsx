/**
 * SessionLogger Component
 *
 * Unified entry point for logging training sessions.
 * Uses manual-first approach with voice assist option.
 *
 * Flow:
 * 1. ManualLogger form with "Tell me" button for voice assist
 * 2. Voice input fills form fields automatically
 * 3. User completes any missing required fields
 * 4. Review & Save
 *
 * Data Collection Philosophy:
 * Only collect data users will reliably provide (exhausted post-training).
 * See: Data Science Audit (Dec 2024)
 */

import { useState, useCallback } from 'react';
import { ManualLogger } from './ManualLogger';
import { VoiceLogger } from './VoiceLogger';

interface SessionLoggerProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export function SessionLogger({ onComplete, onCancel }: SessionLoggerProps) {
  const [showVoiceAssist, setShowVoiceAssist] = useState(false);

  // Handle voice assist request
  const handleVoiceAssist = useCallback(() => {
    setShowVoiceAssist(true);
  }, []);

  // Handle voice assist completion (would fill form in production)
  const handleVoiceComplete = useCallback(() => {
    // In production, this would extract data from voice and fill the form
    setShowVoiceAssist(false);
  }, []);

  // If voice assist is active, show VoiceLogger overlay
  if (showVoiceAssist) {
    return (
      <VoiceLogger
        onComplete={handleVoiceComplete}
        onCancel={() => setShowVoiceAssist(false)}
      />
    );
  }

  // Default: Manual-first form with voice assist option
  return (
    <ManualLogger
      onComplete={onComplete}
      onCancel={onCancel}
      onVoiceAssist={handleVoiceAssist}
    />
  );
}

export default SessionLogger;
