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

// Heat zone positions (center points for radial gradients)
// Mapped to 160x300 viewport matching the silhouette proportions
const HEAT_ZONES = {
  // Neck/throat area - chokes target here
  neck: { cx: 80, cy: 62, rx: 16, ry: 12 },
  // Left arm - elbow/forearm area for armbars, kimuras
  leftArm: { cx: 38, cy: 138, rx: 20, ry: 40 },
  // Right arm - mirror of left
  rightArm: { cx: 122, cy: 138, rx: 20, ry: 40 },
  // Left leg - knee/ankle area for leg locks
  leftLeg: { cx: 68, cy: 240, rx: 16, ry: 45 },
  // Right leg - mirror of left
  rightLeg: { cx: 92, cy: 240, rx: 16, ry: 45 },
};

// Human body silhouette with PNG image and radial gradient heat overlays
function BodySilhouette({
  neckIntensity,
  armsIntensity,
  legsIntensity,
  isGiven,
  onRegionClick,
}: {
  neckIntensity: number;
  armsIntensity: number;
  legsIntensity: number;
  isGiven: boolean;
  onRegionClick?: (region: BodyRegion) => void;
}) {
  const handleClick = (region: BodyRegion) => {
    onRegionClick?.(region);
  };

  // Get heat color based on mode (green for given, red for received)
  const getHeatRgb = () => isGiven ? '34, 197, 94' : '239, 68, 68';
  const heatRgb = getHeatRgb();

  return (
    <div
      style={{
        position: 'relative',
        width: 160,
        height: 300,
      }}
    >
      {/* PNG silhouette with subtle glow outline */}
      <img
        src="/human-body-silo.png"
        alt="Body silhouette"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.25)) drop-shadow(0 0 2px rgba(255, 255, 255, 0.4))',
        }}
      />

      {/* Heat map overlay with radial gradients */}
      <svg
        width="160"
        height="300"
        viewBox="0 0 160 300"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }}
      >
        <defs>
          {/* Radial gradient for neck */}
          <radialGradient id="neckHeat" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={`rgb(${heatRgb})`} stopOpacity={neckIntensity * 0.9} />
            <stop offset="40%" stopColor={`rgb(${heatRgb})`} stopOpacity={neckIntensity * 0.5} />
            <stop offset="100%" stopColor={`rgb(${heatRgb})`} stopOpacity="0" />
          </radialGradient>

          {/* Radial gradient for arms */}
          <radialGradient id="armsHeat" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={`rgb(${heatRgb})`} stopOpacity={armsIntensity * 0.85} />
            <stop offset="35%" stopColor={`rgb(${heatRgb})`} stopOpacity={armsIntensity * 0.45} />
            <stop offset="100%" stopColor={`rgb(${heatRgb})`} stopOpacity="0" />
          </radialGradient>

          {/* Radial gradient for legs */}
          <radialGradient id="legsHeat" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={`rgb(${heatRgb})`} stopOpacity={legsIntensity * 0.85} />
            <stop offset="35%" stopColor={`rgb(${heatRgb})`} stopOpacity={legsIntensity * 0.45} />
            <stop offset="100%" stopColor={`rgb(${heatRgb})`} stopOpacity="0" />
          </radialGradient>

          {/* Blur filter for softer glow */}
          <filter id="heatBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>

        {/* Neck heat zone */}
        {neckIntensity > 0 && (
          <ellipse
            cx={HEAT_ZONES.neck.cx}
            cy={HEAT_ZONES.neck.cy}
            rx={HEAT_ZONES.neck.rx}
            ry={HEAT_ZONES.neck.ry}
            fill="url(#neckHeat)"
            filter="url(#heatBlur)"
          />
        )}

        {/* Left arm heat zone */}
        {armsIntensity > 0 && (
          <ellipse
            cx={HEAT_ZONES.leftArm.cx}
            cy={HEAT_ZONES.leftArm.cy}
            rx={HEAT_ZONES.leftArm.rx}
            ry={HEAT_ZONES.leftArm.ry}
            fill="url(#armsHeat)"
            filter="url(#heatBlur)"
          />
        )}

        {/* Right arm heat zone */}
        {armsIntensity > 0 && (
          <ellipse
            cx={HEAT_ZONES.rightArm.cx}
            cy={HEAT_ZONES.rightArm.cy}
            rx={HEAT_ZONES.rightArm.rx}
            ry={HEAT_ZONES.rightArm.ry}
            fill="url(#armsHeat)"
            filter="url(#heatBlur)"
          />
        )}

        {/* Left leg heat zone */}
        {legsIntensity > 0 && (
          <ellipse
            cx={HEAT_ZONES.leftLeg.cx}
            cy={HEAT_ZONES.leftLeg.cy}
            rx={HEAT_ZONES.leftLeg.rx}
            ry={HEAT_ZONES.leftLeg.ry}
            fill="url(#legsHeat)"
            filter="url(#heatBlur)"
          />
        )}

        {/* Right leg heat zone */}
        {legsIntensity > 0 && (
          <ellipse
            cx={HEAT_ZONES.rightLeg.cx}
            cy={HEAT_ZONES.rightLeg.cy}
            rx={HEAT_ZONES.rightLeg.rx}
            ry={HEAT_ZONES.rightLeg.ry}
            fill="url(#legsHeat)"
            filter="url(#heatBlur)"
          />
        )}
      </svg>

      {/* Invisible clickable regions for interaction */}
      <svg
        width="160"
        height="300"
        viewBox="0 0 160 300"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      >
        {/* Neck click area */}
        <ellipse
          cx={HEAT_ZONES.neck.cx}
          cy={HEAT_ZONES.neck.cy}
          rx={HEAT_ZONES.neck.rx + 5}
          ry={HEAT_ZONES.neck.ry + 5}
          fill="transparent"
          onClick={() => handleClick('neck')}
          style={{ cursor: onRegionClick ? 'pointer' : 'default', pointerEvents: 'auto' }}
        />

        {/* Left arm click area */}
        <ellipse
          cx={HEAT_ZONES.leftArm.cx}
          cy={HEAT_ZONES.leftArm.cy}
          rx={HEAT_ZONES.leftArm.rx + 5}
          ry={HEAT_ZONES.leftArm.ry + 5}
          fill="transparent"
          onClick={() => handleClick('arms')}
          style={{ cursor: onRegionClick ? 'pointer' : 'default', pointerEvents: 'auto' }}
        />

        {/* Right arm click area */}
        <ellipse
          cx={HEAT_ZONES.rightArm.cx}
          cy={HEAT_ZONES.rightArm.cy}
          rx={HEAT_ZONES.rightArm.rx + 5}
          ry={HEAT_ZONES.rightArm.ry + 5}
          fill="transparent"
          onClick={() => handleClick('arms')}
          style={{ cursor: onRegionClick ? 'pointer' : 'default', pointerEvents: 'auto' }}
        />

        {/* Left leg click area */}
        <ellipse
          cx={HEAT_ZONES.leftLeg.cx}
          cy={HEAT_ZONES.leftLeg.cy}
          rx={HEAT_ZONES.leftLeg.rx + 5}
          ry={HEAT_ZONES.leftLeg.ry + 5}
          fill="transparent"
          onClick={() => handleClick('legs')}
          style={{ cursor: onRegionClick ? 'pointer' : 'default', pointerEvents: 'auto' }}
        />

        {/* Right leg click area */}
        <ellipse
          cx={HEAT_ZONES.rightLeg.cx}
          cy={HEAT_ZONES.rightLeg.cy}
          rx={HEAT_ZONES.rightLeg.rx + 5}
          ry={HEAT_ZONES.rightLeg.ry + 5}
          fill="transparent"
          onClick={() => handleClick('legs')}
          style={{ cursor: onRegionClick ? 'pointer' : 'default', pointerEvents: 'auto' }}
        />
      </svg>
    </div>
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
            neckIntensity={getIntensity('neck')}
            armsIntensity={getIntensity('arms')}
            legsIntensity={getIntensity('legs')}
            isGiven={view === 'given'}
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
