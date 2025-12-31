/**
 * BodyHeatMap Component
 *
 * Visualizes submission attack patterns on a human body silhouette.
 * Shows heat intensity by granular body region:
 * - neck: chokes/strangles
 * - shoulders: shoulder locks (kimura, americana)
 * - elbows: armbars, omoplata
 * - wrists: wristlocks
 * - knees: kneebars, calf slicers
 * - ankles: ankle locks, heel hooks, toe holds
 *
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
  neck: { cx: 80, cy: 38, rx: 18, ry: 14 },

  // Shoulders - kimura, americana target here (bilateral)
  leftShoulder: { cx: 48, cy: 62, rx: 16, ry: 14 },
  rightShoulder: { cx: 112, cy: 62, rx: 16, ry: 14 },

  // Elbows - armbars target here (bilateral)
  leftElbow: { cx: 32, cy: 115, rx: 14, ry: 18 },
  rightElbow: { cx: 128, cy: 115, rx: 14, ry: 18 },

  // Wrists - wristlocks target here (bilateral)
  leftWrist: { cx: 22, cy: 168, rx: 12, ry: 14 },
  rightWrist: { cx: 138, cy: 168, rx: 12, ry: 14 },

  // Knees - kneebars, calf slicers target here (bilateral)
  leftKnee: { cx: 62, cy: 200, rx: 14, ry: 18 },
  rightKnee: { cx: 98, cy: 200, rx: 14, ry: 18 },

  // Ankles - heel hooks, ankle locks, toe holds target here (bilateral)
  leftAnkle: { cx: 58, cy: 272, rx: 12, ry: 16 },
  rightAnkle: { cx: 102, cy: 272, rx: 12, ry: 16 },
};

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

// Human body silhouette with PNG image and radial gradient heat overlays
function BodySilhouette({
  neckIntensity,
  shouldersIntensity,
  elbowsIntensity,
  wristsIntensity,
  kneesIntensity,
  anklesIntensity,
  isGiven,
  onRegionClick,
}: {
  neckIntensity: number;
  shouldersIntensity: number;
  elbowsIntensity: number;
  wristsIntensity: number;
  kneesIntensity: number;
  anklesIntensity: number;
  isGiven: boolean;
  onRegionClick?: (region: BodyRegion) => void;
}) {
  const handleClick = (region: BodyRegion) => {
    onRegionClick?.(region);
  };

  // Get heat color RGB based on mode (green for given, red for received)
  const heatRgb = isGiven ? '34, 197, 94' : '239, 68, 68';

  // Generate gradient stops based on intensity
  const getGradientStops = (intensity: number) => ({
    inner: Math.min(1, intensity * 1.5 + 0.3),
    mid: Math.min(0.7, intensity * 0.8 + 0.15),
  });

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
          background: 'radial-gradient(ellipse at center, rgba(245, 166, 35, 0.12) 0%, rgba(245, 166, 35, 0.06) 40%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      {/* Body silhouette image with gold accent glow */}
      <img
        src="/human-body-silhouette.png"
        alt="Body silhouette"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 10px rgba(245, 166, 35, 0.2)) drop-shadow(0 0 3px rgba(245, 166, 35, 0.35)) brightness(1.05)',
          zIndex: 1,
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
          zIndex: 2,
        }}
      >
        <defs>
          {/* Radial gradient for neck */}
          <radialGradient id="neckHeat" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={`rgb(${heatRgb})`} stopOpacity={getGradientStops(neckIntensity).inner} />
            <stop offset="50%" stopColor={`rgb(${heatRgb})`} stopOpacity={getGradientStops(neckIntensity).mid} />
            <stop offset="100%" stopColor={`rgb(${heatRgb})`} stopOpacity="0" />
          </radialGradient>

          {/* Radial gradient for shoulders */}
          <radialGradient id="shouldersHeat" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={`rgb(${heatRgb})`} stopOpacity={getGradientStops(shouldersIntensity).inner} />
            <stop offset="50%" stopColor={`rgb(${heatRgb})`} stopOpacity={getGradientStops(shouldersIntensity).mid} />
            <stop offset="100%" stopColor={`rgb(${heatRgb})`} stopOpacity="0" />
          </radialGradient>

          {/* Radial gradient for elbows */}
          <radialGradient id="elbowsHeat" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={`rgb(${heatRgb})`} stopOpacity={getGradientStops(elbowsIntensity).inner} />
            <stop offset="50%" stopColor={`rgb(${heatRgb})`} stopOpacity={getGradientStops(elbowsIntensity).mid} />
            <stop offset="100%" stopColor={`rgb(${heatRgb})`} stopOpacity="0" />
          </radialGradient>

          {/* Radial gradient for wrists */}
          <radialGradient id="wristsHeat" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={`rgb(${heatRgb})`} stopOpacity={getGradientStops(wristsIntensity).inner} />
            <stop offset="50%" stopColor={`rgb(${heatRgb})`} stopOpacity={getGradientStops(wristsIntensity).mid} />
            <stop offset="100%" stopColor={`rgb(${heatRgb})`} stopOpacity="0" />
          </radialGradient>

          {/* Radial gradient for knees */}
          <radialGradient id="kneesHeat" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={`rgb(${heatRgb})`} stopOpacity={getGradientStops(kneesIntensity).inner} />
            <stop offset="50%" stopColor={`rgb(${heatRgb})`} stopOpacity={getGradientStops(kneesIntensity).mid} />
            <stop offset="100%" stopColor={`rgb(${heatRgb})`} stopOpacity="0" />
          </radialGradient>

          {/* Radial gradient for ankles */}
          <radialGradient id="anklesHeat" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={`rgb(${heatRgb})`} stopOpacity={getGradientStops(anklesIntensity).inner} />
            <stop offset="50%" stopColor={`rgb(${heatRgb})`} stopOpacity={getGradientStops(anklesIntensity).mid} />
            <stop offset="100%" stopColor={`rgb(${heatRgb})`} stopOpacity="0" />
          </radialGradient>

          {/* Blur filter for softer glow */}
          <filter id="heatBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
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

        {/* Shoulder heat zones (bilateral) */}
        {shouldersIntensity > 0 && (
          <>
            <ellipse
              cx={HEAT_ZONES.leftShoulder.cx}
              cy={HEAT_ZONES.leftShoulder.cy}
              rx={HEAT_ZONES.leftShoulder.rx}
              ry={HEAT_ZONES.leftShoulder.ry}
              fill="url(#shouldersHeat)"
              filter="url(#heatBlur)"
            />
            <ellipse
              cx={HEAT_ZONES.rightShoulder.cx}
              cy={HEAT_ZONES.rightShoulder.cy}
              rx={HEAT_ZONES.rightShoulder.rx}
              ry={HEAT_ZONES.rightShoulder.ry}
              fill="url(#shouldersHeat)"
              filter="url(#heatBlur)"
            />
          </>
        )}

        {/* Elbow heat zones (bilateral) */}
        {elbowsIntensity > 0 && (
          <>
            <ellipse
              cx={HEAT_ZONES.leftElbow.cx}
              cy={HEAT_ZONES.leftElbow.cy}
              rx={HEAT_ZONES.leftElbow.rx}
              ry={HEAT_ZONES.leftElbow.ry}
              fill="url(#elbowsHeat)"
              filter="url(#heatBlur)"
            />
            <ellipse
              cx={HEAT_ZONES.rightElbow.cx}
              cy={HEAT_ZONES.rightElbow.cy}
              rx={HEAT_ZONES.rightElbow.rx}
              ry={HEAT_ZONES.rightElbow.ry}
              fill="url(#elbowsHeat)"
              filter="url(#heatBlur)"
            />
          </>
        )}

        {/* Wrist heat zones (bilateral) */}
        {wristsIntensity > 0 && (
          <>
            <ellipse
              cx={HEAT_ZONES.leftWrist.cx}
              cy={HEAT_ZONES.leftWrist.cy}
              rx={HEAT_ZONES.leftWrist.rx}
              ry={HEAT_ZONES.leftWrist.ry}
              fill="url(#wristsHeat)"
              filter="url(#heatBlur)"
            />
            <ellipse
              cx={HEAT_ZONES.rightWrist.cx}
              cy={HEAT_ZONES.rightWrist.cy}
              rx={HEAT_ZONES.rightWrist.rx}
              ry={HEAT_ZONES.rightWrist.ry}
              fill="url(#wristsHeat)"
              filter="url(#heatBlur)"
            />
          </>
        )}

        {/* Knee heat zones (bilateral) */}
        {kneesIntensity > 0 && (
          <>
            <ellipse
              cx={HEAT_ZONES.leftKnee.cx}
              cy={HEAT_ZONES.leftKnee.cy}
              rx={HEAT_ZONES.leftKnee.rx}
              ry={HEAT_ZONES.leftKnee.ry}
              fill="url(#kneesHeat)"
              filter="url(#heatBlur)"
            />
            <ellipse
              cx={HEAT_ZONES.rightKnee.cx}
              cy={HEAT_ZONES.rightKnee.cy}
              rx={HEAT_ZONES.rightKnee.rx}
              ry={HEAT_ZONES.rightKnee.ry}
              fill="url(#kneesHeat)"
              filter="url(#heatBlur)"
            />
          </>
        )}

        {/* Ankle heat zones (bilateral) */}
        {anklesIntensity > 0 && (
          <>
            <ellipse
              cx={HEAT_ZONES.leftAnkle.cx}
              cy={HEAT_ZONES.leftAnkle.cy}
              rx={HEAT_ZONES.leftAnkle.rx}
              ry={HEAT_ZONES.leftAnkle.ry}
              fill="url(#anklesHeat)"
              filter="url(#heatBlur)"
            />
            <ellipse
              cx={HEAT_ZONES.rightAnkle.cx}
              cy={HEAT_ZONES.rightAnkle.cy}
              rx={HEAT_ZONES.rightAnkle.rx}
              ry={HEAT_ZONES.rightAnkle.ry}
              fill="url(#anklesHeat)"
              filter="url(#heatBlur)"
            />
          </>
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

        {/* Shoulder click areas */}
        <ellipse
          cx={HEAT_ZONES.leftShoulder.cx}
          cy={HEAT_ZONES.leftShoulder.cy}
          rx={HEAT_ZONES.leftShoulder.rx + 5}
          ry={HEAT_ZONES.leftShoulder.ry + 5}
          fill="transparent"
          onClick={() => handleClick('shoulders')}
          style={{ cursor: onRegionClick ? 'pointer' : 'default', pointerEvents: 'auto' }}
        />
        <ellipse
          cx={HEAT_ZONES.rightShoulder.cx}
          cy={HEAT_ZONES.rightShoulder.cy}
          rx={HEAT_ZONES.rightShoulder.rx + 5}
          ry={HEAT_ZONES.rightShoulder.ry + 5}
          fill="transparent"
          onClick={() => handleClick('shoulders')}
          style={{ cursor: onRegionClick ? 'pointer' : 'default', pointerEvents: 'auto' }}
        />

        {/* Elbow click areas */}
        <ellipse
          cx={HEAT_ZONES.leftElbow.cx}
          cy={HEAT_ZONES.leftElbow.cy}
          rx={HEAT_ZONES.leftElbow.rx + 5}
          ry={HEAT_ZONES.leftElbow.ry + 5}
          fill="transparent"
          onClick={() => handleClick('elbows')}
          style={{ cursor: onRegionClick ? 'pointer' : 'default', pointerEvents: 'auto' }}
        />
        <ellipse
          cx={HEAT_ZONES.rightElbow.cx}
          cy={HEAT_ZONES.rightElbow.cy}
          rx={HEAT_ZONES.rightElbow.rx + 5}
          ry={HEAT_ZONES.rightElbow.ry + 5}
          fill="transparent"
          onClick={() => handleClick('elbows')}
          style={{ cursor: onRegionClick ? 'pointer' : 'default', pointerEvents: 'auto' }}
        />

        {/* Wrist click areas */}
        <ellipse
          cx={HEAT_ZONES.leftWrist.cx}
          cy={HEAT_ZONES.leftWrist.cy}
          rx={HEAT_ZONES.leftWrist.rx + 5}
          ry={HEAT_ZONES.leftWrist.ry + 5}
          fill="transparent"
          onClick={() => handleClick('wrists')}
          style={{ cursor: onRegionClick ? 'pointer' : 'default', pointerEvents: 'auto' }}
        />
        <ellipse
          cx={HEAT_ZONES.rightWrist.cx}
          cy={HEAT_ZONES.rightWrist.cy}
          rx={HEAT_ZONES.rightWrist.rx + 5}
          ry={HEAT_ZONES.rightWrist.ry + 5}
          fill="transparent"
          onClick={() => handleClick('wrists')}
          style={{ cursor: onRegionClick ? 'pointer' : 'default', pointerEvents: 'auto' }}
        />

        {/* Knee click areas */}
        <ellipse
          cx={HEAT_ZONES.leftKnee.cx}
          cy={HEAT_ZONES.leftKnee.cy}
          rx={HEAT_ZONES.leftKnee.rx + 5}
          ry={HEAT_ZONES.leftKnee.ry + 5}
          fill="transparent"
          onClick={() => handleClick('knees')}
          style={{ cursor: onRegionClick ? 'pointer' : 'default', pointerEvents: 'auto' }}
        />
        <ellipse
          cx={HEAT_ZONES.rightKnee.cx}
          cy={HEAT_ZONES.rightKnee.cy}
          rx={HEAT_ZONES.rightKnee.rx + 5}
          ry={HEAT_ZONES.rightKnee.ry + 5}
          fill="transparent"
          onClick={() => handleClick('knees')}
          style={{ cursor: onRegionClick ? 'pointer' : 'default', pointerEvents: 'auto' }}
        />

        {/* Ankle click areas */}
        <ellipse
          cx={HEAT_ZONES.leftAnkle.cx}
          cy={HEAT_ZONES.leftAnkle.cy}
          rx={HEAT_ZONES.leftAnkle.rx + 5}
          ry={HEAT_ZONES.leftAnkle.ry + 5}
          fill="transparent"
          onClick={() => handleClick('ankles')}
          style={{ cursor: onRegionClick ? 'pointer' : 'default', pointerEvents: 'auto' }}
        />
        <ellipse
          cx={HEAT_ZONES.rightAnkle.cx}
          cy={HEAT_ZONES.rightAnkle.cy}
          rx={HEAT_ZONES.rightAnkle.rx + 5}
          ry={HEAT_ZONES.rightAnkle.ry + 5}
          fill="transparent"
          onClick={() => handleClick('ankles')}
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
  const total = ALL_REGIONS.reduce((sum, region) => sum + currentData[region], 0);

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
      shoulders: ['kimura', 'americana', 'tarikoplata', 'baratoplata', 'monoplata'],
      elbows: ['armbar', 'omoplata', 'bicep slicer'],
      wrists: ['wristlock', 'wrist lock', 'gooseneck'],
      knees: ['kneebar', 'calf slicer', 'texas cloverleaf', 'electric chair', 'banana split', 'twister'],
      ankles: ['heel hook', 'ankle lock', 'toe hold', 'achilles lock', 'estima lock'],
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
            shouldersIntensity={getIntensity('shoulders')}
            elbowsIntensity={getIntensity('elbows')}
            wristsIntensity={getIntensity('wrists')}
            kneesIntensity={getIntensity('knees')}
            anklesIntensity={getIntensity('ankles')}
            isGiven={view === 'given'}
            onRegionClick={setSelectedRegion}
          />
        </div>

        {/* Stats breakdown */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Region stats - 2 column grid for 6 regions */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
            }}
          >
            {ALL_REGIONS.map((region) => {
              const count = currentData[region];
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              const isSelected = selectedRegion === region;

              return (
                <div
                  key={region}
                  onClick={() => setSelectedRegion(isSelected ? null : region)}
                  style={{
                    padding: '10px',
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
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        color: 'var(--color-white)',
                      }}
                    >
                      {REGION_LABELS[region]}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span
                        style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 700,
                          color: view === 'given' ? 'var(--color-positive)' : 'var(--color-negative)',
                        }}
                      >
                        {count}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
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
                      height: 3,
                      background: 'var(--color-gray-700)',
                      borderRadius: 2,
                      marginTop: '6px',
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
                </div>
              );
            })}
          </div>

          {/* Expanded technique breakdown for selected region */}
          {selectedRegion && techniqueBreakdown && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                background: 'var(--color-gray-800)',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${view === 'given' ? 'var(--color-positive)' : 'var(--color-negative)'}`,
              }}
            >
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-gray-500)',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                {REGION_LABELS[selectedRegion]} - Top techniques
              </div>
              {getRegionTechniques(selectedRegion).length > 0 ? (
                getRegionTechniques(selectedRegion).map((t) => (
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

          {/* Total */}
          <div
            style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid var(--color-gray-700)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-gray-400)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Total {view === 'given' ? 'given' : 'received'}
            </span>
            <span
              style={{
                fontSize: 'var(--text-lg)',
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
