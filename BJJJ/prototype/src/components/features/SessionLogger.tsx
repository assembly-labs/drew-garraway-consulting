/**
 * SessionLogger Component
 * Unified entry point for logging training sessions
 * Supports both voice and text input modes with easy switching
 */

import { useState, useCallback } from 'react';
import { VoiceLogger } from './VoiceLogger';
import { TextLogger } from './TextLogger';
import { useUserProfile } from '../../context/UserProfileContext';

interface SessionLoggerProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export function SessionLogger({ onComplete, onCancel }: SessionLoggerProps) {
  const { profile } = useUserProfile();

  // Default to user's preference, fallback to voice
  const [mode, setMode] = useState<'voice' | 'text'>(() => {
    return profile.loggingPreference === 'type' ? 'text' : 'voice';
  });

  const handleSwitchToVoice = useCallback(() => {
    setMode('voice');
  }, []);

  const handleSwitchToText = useCallback(() => {
    setMode('text');
  }, []);

  if (mode === 'text') {
    return (
      <TextLogger
        onComplete={onComplete}
        onCancel={onCancel}
        onSwitchToVoice={handleSwitchToVoice}
      />
    );
  }

  return (
    <VoiceLoggerWithTextToggle
      onComplete={onComplete}
      onCancel={onCancel}
      onSwitchToText={handleSwitchToText}
    />
  );
}

/**
 * VoiceLogger wrapper that adds a "Type Instead" option
 */
function VoiceLoggerWithTextToggle({
  onComplete,
  onCancel,
  onSwitchToText,
}: {
  onComplete?: () => void;
  onCancel?: () => void;
  onSwitchToText: () => void;
}) {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <VoiceLogger onComplete={onComplete} onCancel={onCancel} />

      {/* Type toggle - positioned at bottom of idle screen */}
      <div style={{
        position: 'fixed',
        bottom: 'max(var(--space-xl), env(safe-area-inset-bottom))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
      }}>
        <button
          onClick={onSwitchToText}
          style={{
            background: 'var(--color-gray-800)',
            border: '1px solid var(--color-gray-600)',
            color: 'var(--color-gray-300)',
            cursor: 'pointer',
            padding: 'var(--space-sm) var(--space-lg)',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            transition: 'all 0.2s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
          Type instead
        </button>
      </div>
    </div>
  );
}

export default SessionLogger;
