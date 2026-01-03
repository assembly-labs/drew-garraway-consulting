/**
 * EditSheet Component
 * Reusable bottom sheet modal for section-based editing
 *
 * UX Philosophy:
 * - Focused editing: One section at a time
 * - Easy dismissal: Swipe or tap outside
 * - Clear actions: Done/Cancel always visible
 * - Smooth animations: 60fps transitions
 */

import { useEffect, useRef, type ReactNode } from 'react';

interface EditSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onDone?: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  showDoneButton?: boolean;
  doneButtonText?: string;
  height?: 'auto' | 'half' | 'full';
  accentColor?: string;
}

export function EditSheet({
  isOpen,
  onClose,
  onDone,
  title,
  subtitle,
  children,
  showDoneButton = true,
  doneButtonText = 'Done',
  height = 'auto',
  accentColor = 'var(--color-accent)',
}: EditSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Height values
  const heightValues = {
    auto: 'auto',
    half: '50vh',
    full: '85vh',
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      onClick={(e) => {
        if (e.target === backdropRef.current) {
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        animation: 'overlay-fade-in var(--duration-fast, 0.15s) ease-out forwards',
      }}
    >
      <div
        ref={sheetRef}
        style={{
          width: '100%',
          maxWidth: '500px',
          maxHeight: heightValues[height],
          minHeight: height === 'auto' ? undefined : heightValues[height],
          backgroundColor: 'var(--color-primary)',
          borderTopLeftRadius: 'var(--radius-xl)',
          borderTopRightRadius: 'var(--radius-xl)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'sheet-slide-up var(--duration-normal, 0.25s) var(--ease-spring, cubic-bezier(0.34, 1.56, 0.64, 1)) forwards',
          overflow: 'hidden',
        }}
      >
        {/* Handle bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 'var(--space-sm)',
          paddingBottom: 'var(--space-xs)',
        }}>
          <div style={{
            width: 36,
            height: 4,
            backgroundColor: 'var(--color-gray-600)',
            borderRadius: 'var(--radius-full)',
          }} />
        </div>

        {/* Header */}
        <div style={{
          padding: 'var(--space-md) var(--space-lg)',
          borderBottom: '1px solid var(--color-gray-800)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              color: 'var(--color-white)',
              marginBottom: subtitle ? 'var(--space-xs)' : 0,
            }}>
              {title}
            </h3>
            {subtitle && (
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-gray-400)',
              }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              padding: 'var(--space-sm)',
              cursor: 'pointer',
              color: 'var(--color-gray-400)',
              borderRadius: 'var(--radius-md)',
              transition: 'color 0.2s, background-color 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = 'var(--color-white)';
              e.currentTarget.style.backgroundColor = 'var(--color-gray-800)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = 'var(--color-gray-400)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Accent line */}
        <div style={{
          height: 2,
          backgroundColor: accentColor,
        }} />

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--space-lg)',
        }}>
          {children}
        </div>

        {/* Footer with Done button */}
        {showDoneButton && (
          <div style={{
            padding: 'var(--space-md) var(--space-lg)',
            paddingBottom: 'max(var(--space-lg), env(safe-area-inset-bottom))',
            borderTop: '1px solid var(--color-gray-800)',
          }}>
            <button
              onClick={onDone || onClose}
              style={{
                width: '100%',
                padding: 'var(--space-md)',
                backgroundColor: accentColor,
                color: 'var(--color-primary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-base)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-wide)',
                cursor: 'pointer',
                transition: 'transform 0.1s, opacity 0.2s',
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {doneButtonText}
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

export default EditSheet;
