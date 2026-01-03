/**
 * SessionLogger Component
 *
 * Unified entry point for logging training sessions.
 * Uses voice-first approach with memory-jogging core fields.
 *
 * Flow:
 * 1. Entry screen with core fields (type, duration, sparring) + RECORD button
 * 2. Voice recording captures session details
 * 3. AI extracts structured data
 * 4. Review screen shows filled form for editing
 * 5. Save
 *
 * Data Collection Philosophy:
 * - Tier 1 (Core): Training type, duration, sparring Y/N - captured via quick taps
 * - Tier 2 (Details): Techniques, submissions, notes - captured via voice
 * - User reviews and edits before saving
 *
 * See: Data Requirements Analysis, Voice Logging Conversation Design
 */

import { useState, useCallback } from 'react';
import { VoiceFirstLogger } from './VoiceFirstLogger';
import { ManualLogger } from './ManualLogger';

interface SessionLoggerProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export function SessionLogger({ onComplete, onCancel }: SessionLoggerProps) {
  const [useManualEntry, setUseManualEntry] = useState(false);

  // Handle "type instead" request
  const handleTypeInstead = useCallback(() => {
    setUseManualEntry(true);
  }, []);

  // Handle switching back to voice
  const handleBackToVoice = useCallback(() => {
    setUseManualEntry(false);
  }, []);

  // Manual entry mode (fallback)
  if (useManualEntry) {
    return (
      <ManualLogger
        onComplete={onComplete}
        onCancel={onCancel}
        onVoiceAssist={handleBackToVoice}
      />
    );
  }

  // Default: Voice-first logger
  return (
    <VoiceFirstLogger
      onComplete={onComplete}
      onCancel={onCancel}
      onTypeInstead={handleTypeInstead}
    />
  );
}

export default SessionLogger;
