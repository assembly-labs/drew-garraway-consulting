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

// Heat zone positions (center points for targeting overlays)
// Mapped to 160x300 viewport matching the silhouette proportions
const HEAT_ZONES = {
  // Neck/throat area - chokes target here (moved higher)
  neck: { cx: 80, cy: 48, rx: 20, ry: 14 },
  // Left arm - elbow/forearm area for armbars, kimuras
  leftArm: { cx: 38, cy: 138, rx: 24, ry: 45 },
  // Right arm - mirror of left
  rightArm: { cx: 122, cy: 138, rx: 24, ry: 45 },
  // Left leg - knee/ankle area for leg locks
  leftLeg: { cx: 68, cy: 240, rx: 20, ry: 50 },
  // Right leg - mirror of left
  rightLeg: { cx: 92, cy: 240, rx: 20, ry: 50 },
};

// Targeting bracket component - Terminator HUD style with dynamic weight
function TargetingBracket({
  cx,
  cy,
  size,
  color,
  intensity,
}: {
  cx: number;
  cy: number;
  size: number;
  color: string;
  intensity: number;
}) {
  // Scale visual weight based on intensity
  const scaledSize = size * (0.85 + intensity * 0.3);
  const strokeWeight = 1.5 + intensity * 1.5; // 1.5px to 3px based on intensity
  const bracketLength = scaledSize * 0.4;
  const offset = scaledSize / 2;
  const opacity = 0.5 + intensity * 0.5;
  const glowOpacity = 0.2 + intensity * 0.6;

  // High intensity threshold for extra elements
  const isHighIntensity = intensity > 0.4;
  const isCritical = intensity > 0.6;

  return (
    <g>
      {/* Outer pulse ring - only for high intensity */}
      {isHighIntensity && (
        <circle
          cx={cx}
          cy={cy}
          r={scaledSize * 0.75}
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          opacity={glowOpacity * 0.4}
          strokeDasharray="2 4"
        />
      )}

      {/* Outer glow ring */}
      <circle
        cx={cx}
        cy={cy}
        r={scaledSize * 0.6}
        fill="none"
        stroke={color}
        strokeWidth={strokeWeight * 0.5}
        opacity={glowOpacity * 0.5}
        filter="url(#targetGlow)"
      />

      {/* Corner brackets - top left */}
      <path
        d={`M ${cx - offset} ${cy - offset + bracketLength} L ${cx - offset} ${cy - offset} L ${cx - offset + bracketLength} ${cy - offset}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWeight}
        strokeLinecap="square"
        opacity={opacity}
      />

      {/* Corner brackets - top right */}
      <path
        d={`M ${cx + offset - bracketLength} ${cy - offset} L ${cx + offset} ${cy - offset} L ${cx + offset} ${cy - offset + bracketLength}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWeight}
        strokeLinecap="square"
        opacity={opacity}
      />

      {/* Corner brackets - bottom left */}
      <path
        d={`M ${cx - offset} ${cy + offset - bracketLength} L ${cx - offset} ${cy + offset} L ${cx - offset + bracketLength} ${cy + offset}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWeight}
        strokeLinecap="square"
        opacity={opacity}
      />

      {/* Corner brackets - bottom right */}
      <path
        d={`M ${cx + offset - bracketLength} ${cy + offset} L ${cx + offset} ${cy + offset} L ${cx + offset} ${cy + offset - bracketLength}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWeight}
        strokeLinecap="square"
        opacity={opacity}
      />

      {/* Edge tick marks for critical zones */}
      {isCritical && (
        <>
          <line x1={cx} y1={cy - offset - 4} x2={cx} y2={cy - offset - 8} stroke={color} strokeWidth="1.5" opacity={opacity} />
          <line x1={cx} y1={cy + offset + 4} x2={cx} y2={cy + offset + 8} stroke={color} strokeWidth="1.5" opacity={opacity} />
          <line x1={cx - offset - 4} y1={cy} x2={cx - offset - 8} y2={cy} stroke={color} strokeWidth="1.5" opacity={opacity} />
          <line x1={cx + offset + 4} y1={cy} x2={cx + offset + 8} y2={cy} stroke={color} strokeWidth="1.5" opacity={opacity} />
        </>
      )}

      {/* Center crosshair - horizontal */}
      <line
        x1={cx - scaledSize * 0.18}
        y1={cy}
        x2={cx + scaledSize * 0.18}
        y2={cy}
        stroke={color}
        strokeWidth={strokeWeight * 0.6}
        opacity={opacity * 0.9}
      />

      {/* Center crosshair - vertical */}
      <line
        x1={cx}
        y1={cy - scaledSize * 0.18}
        x2={cx}
        y2={cy + scaledSize * 0.18}
        stroke={color}
        strokeWidth={strokeWeight * 0.6}
        opacity={opacity * 0.9}
      />

      {/* Inner targeting ring - dashed */}
      <circle
        cx={cx}
        cy={cy}
        r={scaledSize * 0.28}
        fill={color}
        fillOpacity={intensity * 0.2}
        stroke={color}
        strokeWidth={strokeWeight * 0.5}
        strokeDasharray={isHighIntensity ? "3 2" : "2 3"}
        opacity={opacity}
      />

      {/* Center dot for high intensity */}
      {isHighIntensity && (
        <circle
          cx={cx}
          cy={cy}
          r={2 + intensity * 2}
          fill={color}
          opacity={opacity}
        />
      )}
    </g>
  );
}

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
  const heatColor = isGiven ? '#22c55e' : '#ef4444';

  return (
    <div
      style={{
        position: 'relative',
        width: 160,
        height: 300,
      }}
    >
      {/* Gold accent glow background */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '140px',
          height: '280px',
          background: 'radial-gradient(ellipse at center, rgba(245, 166, 35, 0.15) 0%, rgba(245, 166, 35, 0.08) 40%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      {/* Body silhouette image with gold accent glow */}
      <img
        src="/human-body-silo.png"
        alt="Body silhouette"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 12px rgba(245, 166, 35, 0.25)) drop-shadow(0 0 4px rgba(245, 166, 35, 0.4)) brightness(1.05)',
          zIndex: 1,
        }}
      />

      {/* Tactical targeting overlay - Terminator HUD style */}
      <svg
        width="160"
        height="300"
        viewBox="0 0 160 300"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        <defs>
          {/* Glow filter for targeting elements */}
          <filter id="targetGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Neck targeting bracket */}
        {neckIntensity > 0 && (
          <TargetingBracket
            cx={HEAT_ZONES.neck.cx}
            cy={HEAT_ZONES.neck.cy}
            size={36}
            color={heatColor}
            intensity={neckIntensity}
          />
        )}

        {/* Left arm targeting bracket */}
        {armsIntensity > 0 && (
          <TargetingBracket
            cx={HEAT_ZONES.leftArm.cx}
            cy={HEAT_ZONES.leftArm.cy}
            size={44}
            color={heatColor}
            intensity={armsIntensity}
          />
        )}

        {/* Right arm targeting bracket */}
        {armsIntensity > 0 && (
          <TargetingBracket
            cx={HEAT_ZONES.rightArm.cx}
            cy={HEAT_ZONES.rightArm.cy}
            size={44}
            color={heatColor}
            intensity={armsIntensity}
          />
        )}

        {/* Left leg targeting bracket */}
        {legsIntensity > 0 && (
          <TargetingBracket
            cx={HEAT_ZONES.leftLeg.cx}
            cy={HEAT_ZONES.leftLeg.cy}
            size={40}
            color={heatColor}
            intensity={legsIntensity}
          />
        )}

        {/* Right leg targeting bracket */}
        {legsIntensity > 0 && (
          <TargetingBracket
            cx={HEAT_ZONES.rightLeg.cx}
            cy={HEAT_ZONES.rightLeg.cy}
            size={40}
            color={heatColor}
            intensity={legsIntensity}
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
