/**
 * BodyHeatMap Component
 *
 * Clean visualization showing where you attack and where you get caught.
 * Uses a filled silhouette with heat zones overlaid.
 */

import { useState, useMemo } from 'react';
import type { BodyRegion } from '../../types/database';

interface BodyHeatMapProps {
  data: {
    given: Record<BodyRegion, number>;
    received: Record<BodyRegion, number>;
  };
  techniqueBreakdown?: {
    given: Array<{ technique: string; count: number }>;
    received: Array<{ technique: string; count: number }>;
  };
}

// All body regions for iteration
const ALL_REGIONS: BodyRegion[] = ['neck', 'shoulders', 'elbows', 'wrists', 'knees', 'ankles'];

// Region display labels
const REGION_LABELS: Record<BodyRegion, string> = {
  neck: 'Neck',
  shoulders: 'Shoulders',
  elbows: 'Elbows',
  wrists: 'Wrists',
  knees: 'Knees',
  ankles: 'Ankles',
};

// Technique mapping for region
const REGION_TECHNIQUES: Record<BodyRegion, string[]> = {
  neck: ['rnc', 'rear naked', 'guillotine', 'triangle', 'darce', 'anaconda', 'ezekiel', 'collar choke', 'bow and arrow', 'arm triangle'],
  shoulders: ['kimura', 'americana', 'tarikoplata', 'baratoplata', 'monoplata'],
  elbows: ['armbar', 'omoplata', 'bicep slicer'],
  wrists: ['wristlock', 'wrist lock', 'gooseneck'],
  knees: ['kneebar', 'calf slicer', 'texas cloverleaf', 'electric chair', 'banana split', 'twister'],
  ankles: ['heel hook', 'ankle lock', 'toe hold', 'achilles lock', 'estima lock'],
};

/**
 * Clean silhouette human figure with heat zones
 */
function HumanSilhouette({
  intensities,
  isGiven,
  selectedRegion,
  onRegionClick,
}: {
  intensities: Record<BodyRegion, number>;
  isGiven: boolean;
  selectedRegion: BodyRegion | null;
  onRegionClick: (region: BodyRegion) => void;
}) {
  const heatColor = isGiven ? '34, 197, 94' : '239, 68, 68';
  const accentColor = isGiven ? '#22c55e' : '#ef4444';

  return (
    <svg
      viewBox="0 0 200 400"
      width="140"
      height="280"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Radial gradients for heat zones */}
        {ALL_REGIONS.map((region) => (
          <radialGradient key={region} id={`heat-${region}-${isGiven ? 'g' : 'r'}`} cx="50%" cy="50%" r="50%">
            <stop
              offset="0%"
              stopColor={`rgb(${heatColor})`}
              stopOpacity={Math.min(0.9, intensities[region] * 1.2 + 0.3)}
            />
            <stop
              offset="50%"
              stopColor={`rgb(${heatColor})`}
              stopOpacity={Math.min(0.5, intensities[region] * 0.6)}
            />
            <stop offset="100%" stopColor={`rgb(${heatColor})`} stopOpacity="0" />
          </radialGradient>
        ))}

        {/* Soft blur for heat zones */}
        <filter id="heatBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* ============================================
          SILHOUETTE - Filled human shape
          ============================================ */}
      <g>
        {/* Head */}
        <ellipse
          cx="100"
          cy="30"
          rx="20"
          ry="24"
          fill="#1a1a1a"
          stroke="#333"
          strokeWidth="1"
        />

        {/* Neck */}
        <rect
          x="92"
          y="52"
          width="16"
          height="16"
          fill="#1a1a1a"
          stroke="#333"
          strokeWidth="1"
        />

        {/* Torso */}
        <path
          d="M58 68 L142 68 L138 190 L62 190 Z"
          fill="#1a1a1a"
          stroke="#333"
          strokeWidth="1"
        />

        {/* Left arm */}
        <path
          d="M58 68 Q40 90 32 130 Q26 160 20 195 L30 200 Q38 165 44 135 Q52 100 60 80"
          fill="#1a1a1a"
          stroke="#333"
          strokeWidth="1"
        />

        {/* Right arm */}
        <path
          d="M142 68 Q160 90 168 130 Q174 160 180 195 L170 200 Q162 165 156 135 Q148 100 140 80"
          fill="#1a1a1a"
          stroke="#333"
          strokeWidth="1"
        />

        {/* Hips/pelvis */}
        <path
          d="M62 190 L68 220 L132 220 L138 190"
          fill="#1a1a1a"
          stroke="#333"
          strokeWidth="1"
        />

        {/* Left leg */}
        <path
          d="M68 220 Q72 260 74 300 Q76 340 72 380 L88 382 Q86 340 84 300 Q82 260 80 220"
          fill="#1a1a1a"
          stroke="#333"
          strokeWidth="1"
        />

        {/* Right leg */}
        <path
          d="M132 220 Q128 260 126 300 Q124 340 128 380 L112 382 Q114 340 116 300 Q118 260 120 220"
          fill="#1a1a1a"
          stroke="#333"
          strokeWidth="1"
        />

        {/* Left foot */}
        <ellipse cx="80" cy="388" rx="14" ry="8" fill="#1a1a1a" stroke="#333" strokeWidth="1" />

        {/* Right foot */}
        <ellipse cx="120" cy="388" rx="14" ry="8" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
      </g>

      {/* ============================================
          HEAT ZONES - Glowing regions
          ============================================ */}
      <g filter="url(#heatBlur)">
        {/* Neck heat */}
        {intensities.neck > 0 && (
          <ellipse
            cx="100"
            cy="60"
            rx="18"
            ry="14"
            fill={`url(#heat-neck-${isGiven ? 'g' : 'r'})`}
          />
        )}

        {/* Shoulders heat (bilateral) */}
        {intensities.shoulders > 0 && (
          <>
            <ellipse cx="58" cy="85" rx="20" ry="16" fill={`url(#heat-shoulders-${isGiven ? 'g' : 'r'})`} />
            <ellipse cx="142" cy="85" rx="20" ry="16" fill={`url(#heat-shoulders-${isGiven ? 'g' : 'r'})`} />
          </>
        )}

        {/* Elbows heat (bilateral) */}
        {intensities.elbows > 0 && (
          <>
            <ellipse cx="38" cy="140" rx="16" ry="20" fill={`url(#heat-elbows-${isGiven ? 'g' : 'r'})`} />
            <ellipse cx="162" cy="140" rx="16" ry="20" fill={`url(#heat-elbows-${isGiven ? 'g' : 'r'})`} />
          </>
        )}

        {/* Wrists heat (bilateral) */}
        {intensities.wrists > 0 && (
          <>
            <ellipse cx="25" cy="195" rx="12" ry="14" fill={`url(#heat-wrists-${isGiven ? 'g' : 'r'})`} />
            <ellipse cx="175" cy="195" rx="12" ry="14" fill={`url(#heat-wrists-${isGiven ? 'g' : 'r'})`} />
          </>
        )}

        {/* Knees heat (bilateral) */}
        {intensities.knees > 0 && (
          <>
            <ellipse cx="78" cy="300" rx="16" ry="22" fill={`url(#heat-knees-${isGiven ? 'g' : 'r'})`} />
            <ellipse cx="122" cy="300" rx="16" ry="22" fill={`url(#heat-knees-${isGiven ? 'g' : 'r'})`} />
          </>
        )}

        {/* Ankles heat (bilateral) */}
        {intensities.ankles > 0 && (
          <>
            <ellipse cx="80" cy="375" rx="12" ry="16" fill={`url(#heat-ankles-${isGiven ? 'g' : 'r'})`} />
            <ellipse cx="120" cy="375" rx="12" ry="16" fill={`url(#heat-ankles-${isGiven ? 'g' : 'r'})`} />
          </>
        )}
      </g>

      {/* ============================================
          CLICKABLE ZONES - Invisible hit areas
          ============================================ */}
      <g style={{ cursor: 'pointer' }}>
        <ellipse cx="100" cy="60" rx="24" ry="20" fill="transparent" onClick={() => onRegionClick('neck')} />
        <ellipse cx="58" cy="85" rx="26" ry="22" fill="transparent" onClick={() => onRegionClick('shoulders')} />
        <ellipse cx="142" cy="85" rx="26" ry="22" fill="transparent" onClick={() => onRegionClick('shoulders')} />
        <ellipse cx="38" cy="140" rx="22" ry="26" fill="transparent" onClick={() => onRegionClick('elbows')} />
        <ellipse cx="162" cy="140" rx="22" ry="26" fill="transparent" onClick={() => onRegionClick('elbows')} />
        <ellipse cx="25" cy="195" rx="18" ry="20" fill="transparent" onClick={() => onRegionClick('wrists')} />
        <ellipse cx="175" cy="195" rx="18" ry="20" fill="transparent" onClick={() => onRegionClick('wrists')} />
        <ellipse cx="78" cy="300" rx="22" ry="28" fill="transparent" onClick={() => onRegionClick('knees')} />
        <ellipse cx="122" cy="300" rx="22" ry="28" fill="transparent" onClick={() => onRegionClick('knees')} />
        <ellipse cx="80" cy="375" rx="18" ry="22" fill="transparent" onClick={() => onRegionClick('ankles')} />
        <ellipse cx="120" cy="375" rx="18" ry="22" fill="transparent" onClick={() => onRegionClick('ankles')} />
      </g>

      {/* ============================================
          SELECTION HIGHLIGHT
          ============================================ */}
      {selectedRegion && (
        <g>
          {(() => {
            const zones: Record<BodyRegion, Array<{ cx: number; cy: number; rx: number; ry: number }>> = {
              neck: [{ cx: 100, cy: 60, rx: 20, ry: 16 }],
              shoulders: [{ cx: 58, cy: 85, rx: 22, ry: 18 }, { cx: 142, cy: 85, rx: 22, ry: 18 }],
              elbows: [{ cx: 38, cy: 140, rx: 18, ry: 22 }, { cx: 162, cy: 140, rx: 18, ry: 22 }],
              wrists: [{ cx: 25, cy: 195, rx: 14, ry: 16 }, { cx: 175, cy: 195, rx: 14, ry: 16 }],
              knees: [{ cx: 78, cy: 300, rx: 18, ry: 24 }, { cx: 122, cy: 300, rx: 18, ry: 24 }],
              ankles: [{ cx: 80, cy: 375, rx: 14, ry: 18 }, { cx: 120, cy: 375, rx: 14, ry: 18 }],
            };

            return zones[selectedRegion].map((zone, i) => (
              <ellipse
                key={i}
                cx={zone.cx}
                cy={zone.cy}
                rx={zone.rx}
                ry={zone.ry}
                fill="none"
                stroke={accentColor}
                strokeWidth="2"
                opacity="0.9"
              />
            ));
          })()}
        </g>
      )}
    </svg>
  );
}

export function BodyHeatMap({ data, techniqueBreakdown }: BodyHeatMapProps) {
  const [view, setView] = useState<'given' | 'received'>('given');
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion | null>(null);

  const currentData = view === 'given' ? data.given : data.received;
  const total = ALL_REGIONS.reduce((sum, region) => sum + currentData[region], 0);

  // Calculate intensities (0-1 range)
  const intensities = useMemo(() => {
    const result: Record<BodyRegion, number> = {
      neck: 0, shoulders: 0, elbows: 0, wrists: 0, knees: 0, ankles: 0,
    };
    if (total === 0) return result;
    for (const region of ALL_REGIONS) {
      result[region] = currentData[region] / total;
    }
    return result;
  }, [currentData, total]);

  // Find the top region
  const topRegion = useMemo(() => {
    if (total === 0) return null;
    let maxRegion: BodyRegion = 'neck';
    let maxCount = 0;
    for (const region of ALL_REGIONS) {
      if (currentData[region] > maxCount) {
        maxCount = currentData[region];
        maxRegion = region;
      }
    }
    return maxCount > 0 ? maxRegion : null;
  }, [currentData, total]);

  // Get techniques for a region
  const getRegionTechniques = (region: BodyRegion): Array<{ technique: string; count: number }> => {
    if (!techniqueBreakdown) return [];
    const breakdown = view === 'given' ? techniqueBreakdown.given : techniqueBreakdown.received;

    return breakdown.filter(t =>
      REGION_TECHNIQUES[region].some(r => t.technique.toLowerCase().includes(r))
    ).slice(0, 3);
  };

  const handleRegionClick = (region: BodyRegion) => {
    setSelectedRegion(selectedRegion === region ? null : region);
  };

  const accentColor = view === 'given' ? 'var(--color-positive)' : 'var(--color-negative)';

  return (
    <div
      style={{
        background: 'var(--color-gray-900)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        border: '1px solid var(--color-gray-800)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              color: 'var(--color-white)',
              margin: 0,
            }}
          >
            Body Map
          </h3>
          <p
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-400)',
              margin: '4px 0 0',
            }}
          >
            {view === 'given' ? 'Where you submit opponents' : 'Where you get caught'}
          </p>
        </div>

        {/* Toggle */}
        <div
          style={{
            display: 'flex',
            background: 'var(--color-gray-800)',
            borderRadius: 'var(--radius-full)',
            padding: '2px',
          }}
        >
          <button
            onClick={() => { setView('given'); setSelectedRegion(null); }}
            style={{
              padding: '6px 12px',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              border: 'none',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: view === 'given' ? 'var(--color-positive)' : 'transparent',
              color: view === 'given' ? 'var(--color-black)' : 'var(--color-gray-400)',
            }}
          >
            Attack
          </button>
          <button
            onClick={() => { setView('received'); setSelectedRegion(null); }}
            style={{
              padding: '6px 12px',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              border: 'none',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: view === 'received' ? 'var(--color-negative)' : 'transparent',
              color: view === 'received' ? 'var(--color-white)' : 'var(--color-gray-400)',
            }}
          >
            Defense
          </button>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'flex-start',
        }}
      >
        {/* Silhouette */}
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'center',
            padding: '10px 0',
          }}
        >
          <HumanSilhouette
            intensities={intensities}
            isGiven={view === 'given'}
            selectedRegion={selectedRegion}
            onRegionClick={handleRegionClick}
          />
        </div>

        {/* Stats panel */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Region list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {ALL_REGIONS.map((region) => {
              const count = currentData[region];
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              const isSelected = selectedRegion === region;
              const isTop = topRegion === region;

              return (
                <button
                  key={region}
                  onClick={() => handleRegionClick(region)}
                  style={{
                    padding: '10px 12px',
                    background: isSelected
                      ? (view === 'given' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)')
                      : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected
                      ? `1px solid ${accentColor}`
                      : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {isTop && (
                        <div
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: accentColor,
                          }}
                        />
                      )}
                      <span
                        style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: isTop ? 600 : 500,
                          color: isTop ? 'var(--color-white)' : 'var(--color-gray-300)',
                        }}
                      >
                        {REGION_LABELS[region]}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: 'var(--text-base)',
                          fontWeight: 600,
                          color: accentColor,
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {count}
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--color-gray-500)',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{
                      height: '3px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '2px',
                      marginTop: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: accentColor,
                        borderRadius: '2px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Technique breakdown (when selected) */}
          {selectedRegion && techniqueBreakdown && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: 'var(--radius-md)',
                border: `1px solid var(--color-gray-800)`,
              }}
            >
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-gray-500)',
                  marginBottom: '8px',
                  fontWeight: 500,
                }}
              >
                {REGION_LABELS[selectedRegion]} Techniques
              </div>
              {getRegionTechniques(selectedRegion).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {getRegionTechniques(selectedRegion).map((t) => (
                    <div
                      key={t.technique}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 'var(--text-sm)',
                      }}
                    >
                      <span style={{ color: 'var(--color-gray-200)' }}>{t.technique}</span>
                      <span
                        style={{
                          color: accentColor,
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                        }}
                      >
                        {t.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
                  No techniques logged
                </div>
              )}
            </div>
          )}

          {/* Total */}
          <div
            style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid var(--color-gray-800)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-gray-500)',
                fontWeight: 500,
              }}
            >
              Total
            </span>
            <span
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 700,
                color: accentColor,
                fontFamily: 'var(--font-mono)',
              }}
            >
              {total}
            </span>
          </div>
        </div>
      </div>

      {/* Hint */}
      <div
        style={{
          marginTop: '16px',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-gray-600)',
          textAlign: 'center',
        }}
      >
        Tap a region to see technique details
      </div>
    </div>
  );
}

export default BodyHeatMap;
