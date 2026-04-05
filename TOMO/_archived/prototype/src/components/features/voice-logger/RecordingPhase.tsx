/**
 * RecordingPhase - Voice capture with prompts
 *
 * Full-screen recording interface with:
 * - Rotating prompt hints to guide the user
 * - Audio waveform visualization
 * - Recording timer
 * - Done button
 */

import { useState, useEffect } from 'react';
import type { RecordingPhaseProps } from './types';

function AudioWaveform() {
  const [bars, setBars] = useState<number[]>(Array(12).fill(20));

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => 15 + Math.random() * 35));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      height: 50,
    }}>
      {bars.map((height, i) => (
        <div
          key={i}
          style={{
            width: 4,
            height: `${height}px`,
            backgroundColor: 'var(--color-gold)',
            borderRadius: 2,
            transition: 'height 0.1s ease',
          }}
        />
      ))}
    </div>
  );
}

export function RecordingPhase({ recordingTime, formatTime, onStop, onCancel, prompts }: RecordingPhaseProps) {
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHintIndex((prev) => (prev + 1) % prompts.length);
      setAnimationKey((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [prompts.length]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-black)',
      zIndex: 100,
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-lg)',
        paddingTop: 'max(var(--space-lg), env(safe-area-inset-top))',
        flexShrink: 0,
      }}>
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-gray-400)',
            cursor: 'pointer',
            padding: '12px',
            borderRadius: 'var(--radius-full)',
            minWidth: '48px',
            minHeight: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Recording indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'var(--color-negative)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            letterSpacing: '0.05em',
            color: 'var(--color-gray-400)',
          }}>
            {formatTime(recordingTime)}
          </span>
        </div>

        <div style={{ width: 48 }} />
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-xl)',
        paddingBottom: '160px',
      }}>
        <div style={{
          minHeight: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 340,
        }}>
          <h2
            key={animationKey}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(28px, 8vw, 36px)',
              fontWeight: 700,
              lineHeight: 1.2,
              textAlign: 'center',
              color: 'var(--color-white)',
              margin: 0,
              animation: 'fadeSlideIn 0.4s ease-out',
            }}
          >
            {prompts[currentHintIndex]}
          </h2>
        </div>

        <div style={{ marginTop: 'var(--space-xl)' }}>
          <AudioWaveform />
        </div>
      </div>

      {/* Done button */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 'var(--space-xl)',
        paddingBottom: 'max(var(--space-xl), env(safe-area-inset-bottom))',
        background: 'linear-gradient(to top, var(--color-black) 60%, transparent)',
      }}>
        <button
          onClick={onStop}
          style={{
            width: '100%',
            padding: '20px',
            backgroundColor: 'var(--color-white)',
            color: 'var(--color-black)',
            border: 'none',
            borderRadius: '12px',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(255,255,255,0.15)',
          }}
        >
          Done
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
        }
        @keyframes fadeSlideIn {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
