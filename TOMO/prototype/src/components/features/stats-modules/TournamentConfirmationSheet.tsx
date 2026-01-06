/**
 * TournamentConfirmationSheet - Confirmation modal for Tournament Readiness
 *
 * Shows before revealing tournament readiness data to ensure user
 * is intentionally preparing for competition. Provides context about
 * what they'll see.
 */

import { useState } from 'react';
import { Icons } from '../../ui/Icons';

interface TournamentConfirmationSheetProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  beltLevel: string;
}

export function TournamentConfirmationSheet({
  isOpen,
  onConfirm,
  onCancel,
  beltLevel,
}: TournamentConfirmationSheetProps) {
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onCancel();
    }, 200);
  };

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onConfirm();
    }, 200);
  };

  // Belt-specific encouragement
  const getBeltEncouragement = () => {
    switch (beltLevel) {
      case 'white':
        return "Competing as a white belt is a brave choice. Win or learn—there's no losing.";
      case 'blue':
        return "Blue belt competition is where you test your fundamentals under pressure.";
      case 'purple':
        return "Purple belt divisions are competitive. Your experience is your advantage.";
      case 'brown':
        return "At brown belt, you know your game. Trust your preparation.";
      case 'black':
        return "The journey continues. Every competition is a chance to refine your art.";
      default:
        return "Competition reveals what training alone cannot.";
    }
  };

  return (
    <div
      style={{
        ...styles.overlay,
        opacity: isClosing ? 0 : 1,
      }}
      onClick={handleCancel}
    >
      <div
        style={{
          ...styles.sheet,
          transform: isClosing ? 'translateY(100%)' : 'translateY(0)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={styles.handleContainer}>
          <div style={styles.handle} />
        </div>

        {/* Header Icon */}
        <div style={styles.iconContainer}>
          <Icons.Target size={32} color="var(--color-gold)" />
        </div>

        {/* Title */}
        <h2 style={styles.title}>Preparing for Competition?</h2>

        {/* Description */}
        <p style={styles.description}>
          This analysis is designed for practitioners actively preparing for a tournament.
          It will show you:
        </p>

        {/* What you'll see list */}
        <ul style={styles.featureList}>
          <li style={styles.featureItem}>
            <Icons.CheckCircle size={16} color="var(--color-positive)" />
            <span>Your readiness score based on training volume</span>
          </li>
          <li style={styles.featureItem}>
            <Icons.CheckCircle size={16} color="var(--color-positive)" />
            <span>Comparison to recommended competition prep</span>
          </li>
          <li style={styles.featureItem}>
            <Icons.CheckCircle size={16} color="var(--color-positive)" />
            <span>Personalized coaching and action items</span>
          </li>
          <li style={styles.featureItem}>
            <Icons.CheckCircle size={16} color="var(--color-positive)" />
            <span>Training benchmarks for your belt level</span>
          </li>
        </ul>

        {/* Encouragement */}
        <div style={styles.encouragementBox}>
          <p style={styles.encouragementText}>
            {getBeltEncouragement()}
          </p>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button style={styles.confirmButton} onClick={handleConfirm}>
            Yes, I'm Preparing for a Tournament
          </button>
          <button style={styles.cancelButton} onClick={handleCancel}>
            Not Right Now
          </button>
        </div>

        {/* Disclaimer */}
        <p style={styles.disclaimer}>
          You can always access this later from the Stats page.
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 1000,
    transition: 'opacity 0.2s ease',
  },
  sheet: {
    width: '100%',
    maxWidth: '500px',
    background: 'var(--color-gray-900)',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    padding: '16px 24px 32px',
    transition: 'transform 0.3s ease',
  },
  handleContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  handle: {
    width: '40px',
    height: '4px',
    background: 'var(--color-gray-700)',
    borderRadius: '2px',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-xl)',
    fontWeight: 700,
    color: 'var(--color-white)',
    textAlign: 'center',
    margin: '0 0 12px 0',
  },
  description: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-400)',
    textAlign: 'center',
    margin: '0 0 20px 0',
    lineHeight: 1.5,
  },
  featureList: {
    listStyle: 'none',
    margin: '0 0 20px 0',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-300)',
  },
  encouragementBox: {
    background: 'var(--color-gray-800)',
    borderLeft: '3px solid var(--color-gold)',
    padding: '12px 16px',
    marginBottom: '24px',
  },
  encouragementText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    fontStyle: 'italic',
    color: 'var(--color-gray-300)',
    margin: 0,
    lineHeight: 1.5,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  confirmButton: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    color: 'var(--color-black)',
    background: 'var(--color-gold)',
    border: 'none',
    padding: '16px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    minHeight: '56px',
  },
  cancelButton: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    color: 'var(--color-gray-400)',
    background: 'transparent',
    border: '1px solid var(--color-gray-700)',
    padding: '16px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    minHeight: '56px',
  },
  disclaimer: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-600)',
    textAlign: 'center',
    margin: '16px 0 0 0',
  },
};

export default TournamentConfirmationSheet;
