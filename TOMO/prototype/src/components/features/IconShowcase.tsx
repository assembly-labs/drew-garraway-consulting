/**
 * Icon Showcase - Browse all 95 icons
 * Temporary dev page for icon library exploration
 */

import { useState } from 'react';
import { Icons } from '../ui/Icons';

// Get all icon names from the Icons object
const iconNames = Object.keys(Icons) as (keyof typeof Icons)[];

// Group icons by category
const iconCategories = {
  'Navigation': ['Home', 'Journal', 'Progress', 'Library', 'Profile', 'Menu', 'Search', 'Settings', 'Back', 'Close'],
  'Chevrons & Arrows': ['ChevronRight', 'ChevronLeft', 'ChevronDown', 'ChevronUp', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
  'Session Logging': ['Mic', 'MicOff', 'Keyboard', 'Play', 'Pause', 'Stop', 'Timer', 'Hourglass', 'Calendar', 'Clock'],
  'BJJ Training': ['Gi', 'NoGi', 'Sparring', 'MapPin', 'Dumbbell', 'Belt'],
  'Technique Categories': ['Hand', 'Shield', 'Sweep', 'Pass', 'Escape', 'Takedown'],
  'Progress & Achievements': ['Trophy', 'Medal', 'Flame', 'Target', 'Crown', 'Flag', 'Award', 'TrendUp', 'TrendDown', 'BarChart', 'Activity'],
  'Status & Feedback': ['Check', 'CheckCircle', 'XCircle', 'AlertCircle', 'Warning', 'Info', 'HelpCircle', 'Star', 'StarFilled', 'Heart', 'HeartFilled', 'Bookmark', 'BookmarkFilled', 'ThumbsUp', 'ThumbsDown'],
  'Actions': ['Plus', 'Minus', 'Edit', 'Trash', 'Copy', 'Refresh', 'RotateCcw', 'RotateCw', 'Filter', 'Sort', 'MoreHorizontal', 'MoreVertical', 'Expand', 'Minimize', 'Link', 'ExternalLink', 'Share', 'Download', 'Upload'],
  'Media & Content': ['Video', 'Camera', 'Image', 'Message', 'Zap'],
  'Body & Recovery': ['User', 'Users', 'Bandage', 'Moon', 'Sun'],
  'App State': ['Loader', 'Cloud', 'Wifi', 'WifiOff', 'Lock', 'Unlock', 'Eye', 'EyeOff', 'Bell', 'BellOff'],
  'Utility': ['Hundred', 'Grid', 'List', 'Logout', 'Sliders', 'ToggleLeft', 'ToggleRight', 'Volume', 'VolumeOff', 'Save', 'Send'],
} as const;

interface IconShowcaseProps {
  onBack?: () => void;
}

export function IconShowcase({ onBack }: IconShowcaseProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSize, setSelectedSize] = useState(24);
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  const handleCopyImport = (iconName: string) => {
    navigator.clipboard.writeText(`import { Icon${iconName} } from '@/components/ui/Icons';`);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  const filteredCategories = Object.entries(iconCategories).map(([category, icons]) => ({
    category,
    icons: icons.filter(name =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(({ icons }) => icons.length > 0);

  const totalVisible = filteredCategories.reduce((sum, { icons }) => sum + icons.length, 0);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-black)',
      color: 'var(--color-white)',
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--color-black)',
        borderBottom: '1px solid var(--color-gray-800)',
        padding: 'var(--space-lg)',
        zIndex: 10,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-md)',
        }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-white)',
                cursor: 'pointer',
                padding: 'var(--space-sm)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Icons.Back size={24} />
            </button>
          )}
          <div>
            <h1 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 800,
              margin: 0,
            }}>
              Icon Library
            </h1>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-gray-400)',
              margin: 0,
            }}>
              {totalVisible} of {iconNames.length} icons
            </p>
          </div>
        </div>

        {/* Search */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-sm)',
          alignItems: 'center',
        }}>
          <div style={{
            flex: 1,
            position: 'relative',
          }}>
            <Icons.Search
              size={18}
              color="var(--color-gray-500)"
              className=""
            />
            <input
              type="text"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                backgroundColor: 'var(--color-gray-900)',
                border: '1px solid var(--color-gray-800)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-white)',
                fontSize: 'var(--text-base)',
              }}
            />
            <div style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}>
              <Icons.Search size={18} color="var(--color-gray-500)" />
            </div>
          </div>

          {/* Size selector */}
          <div style={{
            display: 'flex',
            gap: '4px',
            backgroundColor: 'var(--color-gray-900)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
          }}>
            {[20, 24, 32, 40].map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: selectedSize === size ? 'var(--color-gold)' : 'transparent',
                  color: selectedSize === size ? 'var(--color-black)' : 'var(--color-gray-400)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Icon Grid by Category */}
      <div style={{ padding: 'var(--space-lg)' }}>
        {filteredCategories.map(({ category, icons }) => (
          <div key={category} style={{ marginBottom: 'var(--space-2xl)' }}>
            <h2 style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-widest)',
              color: 'var(--color-gold)',
              marginBottom: 'var(--space-md)',
              fontFamily: 'var(--font-mono)',
            }}>
              {category}
              <span style={{ color: 'var(--color-gray-600)', marginLeft: '8px' }}>
                ({icons.length})
              </span>
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap: '8px',
            }}>
              {icons.map(name => {
                const IconComponent = Icons[name as keyof typeof Icons];
                const isCopied = copiedIcon === name;

                return (
                  <button
                    key={name}
                    onClick={() => handleCopyImport(name)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: 'var(--space-md)',
                      backgroundColor: isCopied ? 'var(--color-positive-dim)' : 'var(--color-gray-900)',
                      border: `1px solid ${isCopied ? 'var(--color-positive)' : 'var(--color-gray-800)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      minHeight: '90px',
                    }}
                    title={`Click to copy import for ${name}`}
                  >
                    <IconComponent
                      size={selectedSize}
                      color={isCopied ? 'var(--color-positive)' : 'var(--color-white)'}
                    />
                    <span style={{
                      fontSize: '10px',
                      color: isCopied ? 'var(--color-positive)' : 'var(--color-gray-400)',
                      textAlign: 'center',
                      fontFamily: 'var(--font-mono)',
                      wordBreak: 'break-word',
                    }}>
                      {isCopied ? 'Copied!' : name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-3xl)',
            color: 'var(--color-gray-500)',
          }}>
            <Icons.Search size={48} color="var(--color-gray-700)" />
            <p style={{ marginTop: 'var(--space-md)' }}>
              No icons found for "{searchTerm}"
            </p>
          </div>
        )}
      </div>

      {/* Usage hint */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 'var(--space-md) var(--space-lg)',
        backgroundColor: 'var(--color-gray-900)',
        borderTop: '1px solid var(--color-gray-800)',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-gray-500)',
          margin: 0,
        }}>
          Click any icon to copy its import statement
        </p>
      </div>
    </div>
  );
}

export default IconShowcase;
