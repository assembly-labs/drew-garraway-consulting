/**
 * BodyHeatMap Component
 *
 * Visualizes submission attack patterns on a human body silhouette.
 * Shows heat intensity by body region (neck, arms, legs).
 * Toggle between "attacks given" and "attacks received" views.
 */

import { useState } from 'react';
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

// Calculate color intensity based on percentage (0-1)
function getHeatColor(intensity: number, isGiven: boolean): string {
  if (intensity === 0) return 'var(--color-gray-800)';

  // Given = green tones, Received = red tones
  if (isGiven) {
    const alpha = Math.min(0.15 + intensity * 0.6, 0.75);
    return `rgba(34, 197, 94, ${alpha})`;
  } else {
    const alpha = Math.min(0.15 + intensity * 0.6, 0.75);
    return `rgba(239, 68, 68, ${alpha})`;
  }
}

// Human body silhouette SVG with three selectable regions
function BodySilhouette({
  neckColor,
  armsColor,
  legsColor,
  onRegionClick,
}: {
  neckColor: string;
  armsColor: string;
  legsColor: string;
  onRegionClick?: (region: BodyRegion) => void;
}) {
  const handleClick = (region: BodyRegion) => {
    onRegionClick?.(region);
  };

  return (
    <svg
      width="200"
      height="300"
      viewBox="0 0 200 300"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Head outline */}
      <ellipse
        cx="100"
        cy="35"
        rx="25"
        ry="30"
        fill="var(--color-gray-800)"
        stroke="var(--color-gray-600)"
      />

      {/* Neck region - clickable */}
      <g
        onClick={() => handleClick('neck')}
        style={{ cursor: onRegionClick ? 'pointer' : 'default' }}
      >
        <rect
          x="88"
          y="60"
          width="24"
          height="25"
          fill={neckColor}
          stroke="var(--color-gray-600)"
          rx="4"
        />
        {/* Neck label indicator */}
        <circle cx="100" cy="72" r="3" fill="var(--color-gray-500)" />
      </g>

      {/* Torso - not a submission target */}
      <path
        d="M70 85 L130 85 L135 180 L65 180 Z"
        fill="var(--color-gray-800)"
        stroke="var(--color-gray-600)"
      />

      {/* Left arm region - clickable */}
      <g
        onClick={() => handleClick('arms')}
        style={{ cursor: onRegionClick ? 'pointer' : 'default' }}
      >
        <path
          d="M70 85 L40 95 L25 160 L35 165 L55 110 L65 115 L65 180"
          fill={armsColor}
          stroke="var(--color-gray-600)"
        />
      </g>

      {/* Right arm region - clickable */}
      <g
        onClick={() => handleClick('arms')}
        style={{ cursor: onRegionClick ? 'pointer' : 'default' }}
      >
        <path
          d="M130 85 L160 95 L175 160 L165 165 L145 110 L135 115 L135 180"
          fill={armsColor}
          stroke="var(--color-gray-600)"
        />
      </g>

      {/* Left leg region - clickable */}
      <g
        onClick={() => handleClick('legs')}
        style={{ cursor: onRegionClick ? 'pointer' : 'default' }}
      >
        <path
          d="M65 180 L70 280 L90 280 L95 180"
          fill={legsColor}
          stroke="var(--color-gray-600)"
        />
      </g>

      {/* Right leg region - clickable */}
      <g
        onClick={() => handleClick('legs')}
        style={{ cursor: onRegionClick ? 'pointer' : 'default' }}
      >
        <path
          d="M105 180 L110 280 L130 280 L135 180"
          fill={legsColor}
          stroke="var(--color-gray-600)"
        />
      </g>

      {/* Region labels */}
      <text x="100" y="72" textAnchor="middle" fill="var(--color-white)" fontSize="10" fontWeight="600">
        NECK
      </text>
      <text x="30" y="130" textAnchor="middle" fill="var(--color-white)" fontSize="10" fontWeight="600">
        ARMS
      </text>
      <text x="100" y="240" textAnchor="middle" fill="var(--color-white)" fontSize="10" fontWeight="600">
        LEGS
      </text>
    </svg>
  );
}

export function BodyHeatMap({ data, techniqueBreakdown }: BodyHeatMapProps) {
  const [view, setView] = useState<'given' | 'received'>('given');
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion | null>(null);

  const currentData = view === 'given' ? data.given : data.received;
  const total = currentData.neck + currentData.arms + currentData.legs;

  // Calculate percentages for heat intensity
  const getIntensity = (region: BodyRegion): number => {
    if (total === 0) return 0;
    return currentData[region] / total;
  };

  // Get top techniques for selected region
  const getRegionTechniques = (region: BodyRegion): Array<{ technique: string; count: number }> => {
    if (!techniqueBreakdown) return [];
    const breakdown = view === 'given' ? techniqueBreakdown.given : techniqueBreakdown.received;

    // Filter techniques by body region mapping
    const regionTechniques: Record<BodyRegion, string[]> = {
      neck: ['rnc', 'rear naked', 'guillotine', 'triangle', 'darce', 'anaconda', 'ezekiel', 'collar choke', 'bow and arrow', 'arm triangle'],
      arms: ['armbar', 'kimura', 'americana', 'omoplata', 'wristlock'],
      legs: ['heel hook', 'kneebar', 'toe hold', 'ankle lock', 'calf slicer'],
    };

    return breakdown.filter(t =>
      regionTechniques[region].some(r => t.technique.toLowerCase().includes(r))
    ).slice(0, 3);
  };

  return (
    <div
      style={{
        background: 'var(--color-gray-900)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        border: '1px solid var(--color-gray-800)',
      }}
    >
      {/* Header with toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'var(--color-white)',
              margin: 0,
            }}
          >
            Attack Profile
          </h3>
          <p
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-400)',
              margin: '4px 0 0',
            }}
          >
            {view === 'given' ? 'Where you attack' : 'Where you get caught'}
          </p>
        </div>

        {/* Toggle */}
        <div
          style={{
            display: 'flex',
            background: 'var(--color-gray-800)',
            borderRadius: 'var(--radius-full)',
            padding: '4px',
          }}
        >
          <button
            onClick={() => setView('given')}
            style={{
              padding: '8px 16px',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: view === 'given' ? 'var(--color-positive)' : 'transparent',
              color: view === 'given' ? 'var(--color-black)' : 'var(--color-gray-400)',
            }}
          >
            Given
          </button>
          <button
            onClick={() => setView('received')}
            style={{
              padding: '8px 16px',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: view === 'received' ? 'var(--color-negative)' : 'transparent',
              color: view === 'received' ? 'var(--color-white)' : 'var(--color-gray-400)',
            }}
          >
            Received
          </button>
        </div>
      </div>

      {/* Body visualization and stats */}
      <div
        style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'flex-start',
        }}
      >
        {/* Body silhouette */}
        <div style={{ flexShrink: 0 }}>
          <BodySilhouette
            neckColor={getHeatColor(getIntensity('neck'), view === 'given')}
            armsColor={getHeatColor(getIntensity('arms'), view === 'given')}
            legsColor={getHeatColor(getIntensity('legs'), view === 'given')}
            onRegionClick={setSelectedRegion}
          />
        </div>

        {/* Stats breakdown */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Region stats */}
          {(['neck', 'arms', 'legs'] as BodyRegion[]).map((region) => {
            const count = currentData[region];
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            const isSelected = selectedRegion === region;

            return (
              <div
                key={region}
                onClick={() => setSelectedRegion(isSelected ? null : region)}
                style={{
                  padding: '12px',
                  marginBottom: '8px',
                  background: isSelected
                    ? (view === 'given' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)')
                    : 'var(--color-gray-800)',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected
                    ? `1px solid ${view === 'given' ? 'var(--color-positive)' : 'var(--color-negative)'}`
                    : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'var(--color-white)',
                      textTransform: 'capitalize',
                    }}
                  >
                    {region}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: 'var(--text-lg)',
                        fontWeight: 700,
                        color: view === 'given' ? 'var(--color-positive)' : 'var(--color-negative)',
                      }}
                    >
                      {count}
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-gray-500)',
                      }}
                    >
                      ({percentage}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    height: 4,
                    background: 'var(--color-gray-700)',
                    borderRadius: 2,
                    marginTop: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${percentage}%`,
                      background: view === 'given' ? 'var(--color-positive)' : 'var(--color-negative)',
                      borderRadius: 2,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>

                {/* Expanded technique breakdown */}
                {isSelected && techniqueBreakdown && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--color-gray-700)' }}>
                    <div
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-gray-500)',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      Top techniques
                    </div>
                    {getRegionTechniques(region).length > 0 ? (
                      getRegionTechniques(region).map((t) => (
                        <div
                          key={t.technique}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--color-gray-300)',
                            marginBottom: '4px',
                          }}
                        >
                          <span style={{ textTransform: 'capitalize' }}>{t.technique}</span>
                          <span style={{ color: 'var(--color-gray-500)' }}>{t.count}</span>
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
                        No data yet
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Total */}
          <div
            style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid var(--color-gray-700)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-gray-400)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Total {view === 'given' ? 'given' : 'received'}
            </span>
            <span
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 700,
                color: view === 'given' ? 'var(--color-positive)' : 'var(--color-negative)',
              }}
            >
              {total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BodyHeatMap;
