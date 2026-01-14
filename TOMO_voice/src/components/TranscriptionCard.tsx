import { useState, useCallback } from 'react';
import type { Transcription } from '../types';
import { CopyIcon, CheckIcon } from './Icons';

interface TranscriptionCardProps {
  transcription: Transcription;
  isNew?: boolean;
  onCopy: (id: string) => void;
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 10) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function TranscriptionCard({
  transcription,
  isNew = false,
  onCopy,
}: TranscriptionCardProps) {
  const [justCopied, setJustCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(transcription.text);
      setJustCopied(true);
      onCopy(transcription.id);

      // Reset after animation
      setTimeout(() => {
        setJustCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [transcription.text, transcription.id, onCopy]);

  const showCopied = justCopied || transcription.copied;

  return (
    <article
      className={`transcription-card${isNew ? ' transcription-card--new' : ''}`}
    >
      <p className="transcription-text">{transcription.text}</p>

      <footer className="transcription-footer">
        <time className="transcription-time">
          {formatRelativeTime(transcription.timestamp)}
        </time>

        <button
          className={`copy-btn${showCopied ? ' copy-btn--copied' : ''}`}
          onClick={handleCopy}
          aria-label={showCopied ? 'Copied' : 'Copy to clipboard'}
        >
          {justCopied ? (
            <CheckIcon className="copy-btn-icon animate-check" />
          ) : (
            <CopyIcon className="copy-btn-icon" />
          )}
          {showCopied ? 'Copied' : 'Copy'}
        </button>
      </footer>
    </article>
  );
}
