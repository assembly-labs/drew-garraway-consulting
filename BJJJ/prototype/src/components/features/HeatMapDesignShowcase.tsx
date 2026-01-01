/**
 * HeatMapDesignShowcase
 *
 * Visual comparison of 6 different heat map design approaches.
 * Delete this file after choosing a design.
 */

import type { BodyRegion } from '../../types/database';

// Sample data for demonstration
const SAMPLE_DATA: Record<BodyRegion, number> = {
  neck: 12,
  shoulders: 8,
  elbows: 15,
  wrists: 3,
  knees: 6,
  ankles: 10,
};

const ALL_REGIONS: BodyRegion[] = ['neck', 'shoulders', 'elbows', 'wrists', 'knees', 'ankles'];

// Calculate intensities (0-1 range)
const total = ALL_REGIONS.reduce((sum, r) => sum + SAMPLE_DATA[r], 0);
const intensities: Record<BodyRegion, number> = {
  neck: SAMPLE_DATA.neck / total,
  shoulders: SAMPLE_DATA.shoulders / total,
  elbows: SAMPLE_DATA.elbows / total,
  wrists: SAMPLE_DATA.wrists / total,
  knees: SAMPLE_DATA.knees / total,
  ankles: SAMPLE_DATA.ankles / total,
};

// Region positions on body
const REGION_POSITIONS: Record<BodyRegion, Array<{ cx: number; cy: number }>> = {
  neck: [{ cx: 100, cy: 60 }],
  shoulders: [{ cx: 58, cy: 85 }, { cx: 142, cy: 85 }],
  elbows: [{ cx: 38, cy: 140 }, { cx: 162, cy: 140 }],
  wrists: [{ cx: 25, cy: 195 }, { cx: 175, cy: 195 }],
  knees: [{ cx: 78, cy: 300 }, { cx: 122, cy: 300 }],
  ankles: [{ cx: 80, cy: 375 }, { cx: 120, cy: 375 }],
};

// Thermal color scale (blue → cyan → green → yellow → orange → red)
function getThermalColor(intensity: number): string {
  if (intensity <= 0.1) return '#3b82f6'; // blue
  if (intensity <= 0.2) return '#06b6d4'; // cyan
  if (intensity <= 0.35) return '#22c55e'; // green
  if (intensity <= 0.5) return '#eab308'; // yellow
  if (intensity <= 0.7) return '#f97316'; // orange
  return '#ef4444'; // red
}

// Base body silhouette component (reused across all designs)
function BodyBase() {
  return (
    <g>
      {/* Head */}
      <ellipse cx="100" cy="30" rx="20" ry="24" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
      {/* Neck */}
      <rect x="92" y="52" width="16" height="16" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
      {/* Torso */}
      <path d="M58 68 L142 68 L138 190 L62 190 Z" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
      {/* Left arm */}
      <path d="M58 68 Q40 90 32 130 Q26 160 20 195 L30 200 Q38 165 44 135 Q52 100 60 80" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
      {/* Right arm */}
      <path d="M142 68 Q160 90 168 130 Q174 160 180 195 L170 200 Q162 165 156 135 Q148 100 140 80" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
      {/* Hips */}
      <path d="M62 190 L68 220 L132 220 L138 190" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
      {/* Left leg */}
      <path d="M68 220 Q72 260 74 300 Q76 340 72 380 L88 382 Q86 340 84 300 Q82 260 80 220" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
      {/* Right leg */}
      <path d="M132 220 Q128 260 126 300 Q124 340 128 380 L112 382 Q114 340 116 300 Q118 260 120 220" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
      {/* Feet */}
      <ellipse cx="80" cy="388" rx="14" ry="8" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
      <ellipse cx="120" cy="388" rx="14" ry="8" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
    </g>
  );
}

// DESIGN 1: Thermal Color Scale
function Design1ThermalColors() {
  return (
    <svg viewBox="0 0 200 400" width="140" height="280">
      <defs>
        <filter id="blur1" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <BodyBase />
      {/* Heat zones with thermal colors */}
      <g filter="url(#blur1)">
        {ALL_REGIONS.map(region =>
          REGION_POSITIONS[region].map((pos, i) => (
            <ellipse
              key={`${region}-${i}`}
              cx={pos.cx}
              cy={pos.cy}
              rx={region === 'neck' ? 20 : 18}
              ry={region === 'knees' || region === 'ankles' ? 22 : 16}
              fill={getThermalColor(intensities[region])}
              opacity={0.8}
            />
          ))
        )}
      </g>
    </svg>
  );
}

// DESIGN 2: Size + Color Combined
function Design2SizeAndColor() {
  const getSize = (intensity: number) => 8 + intensity * 30; // 8-38px radius

  return (
    <svg viewBox="0 0 200 400" width="140" height="280">
      <BodyBase />
      {/* Size varies with intensity */}
      {ALL_REGIONS.map(region =>
        REGION_POSITIONS[region].map((pos, i) => (
          <circle
            key={`${region}-${i}`}
            cx={pos.cx}
            cy={pos.cy}
            r={getSize(intensities[region])}
            fill={getThermalColor(intensities[region])}
            opacity={0.85}
          />
        ))
      )}
    </svg>
  );
}

// DESIGN 3: Filled Body Segments
function Design3FilledSegments() {
  const getSegmentColor = (region: BodyRegion) => getThermalColor(intensities[region]);

  return (
    <svg viewBox="0 0 200 400" width="140" height="280">
      {/* Base gray body */}
      <g opacity="0.3">
        <BodyBase />
      </g>

      {/* Colored segments overlay */}
      <g>
        {/* Neck segment */}
        <rect x="92" y="52" width="16" height="16" fill={getSegmentColor('neck')} opacity="0.9" rx="2" />

        {/* Shoulders - top of torso */}
        <path d="M58 68 L142 68 L140 100 L60 100 Z" fill={getSegmentColor('shoulders')} opacity="0.9" />

        {/* Elbows - mid arms */}
        <ellipse cx="38" cy="140" rx="14" ry="20" fill={getSegmentColor('elbows')} opacity="0.9" />
        <ellipse cx="162" cy="140" rx="14" ry="20" fill={getSegmentColor('elbows')} opacity="0.9" />

        {/* Wrists - lower arms */}
        <ellipse cx="25" cy="195" rx="10" ry="14" fill={getSegmentColor('wrists')} opacity="0.9" />
        <ellipse cx="175" cy="195" rx="10" ry="14" fill={getSegmentColor('wrists')} opacity="0.9" />

        {/* Knees */}
        <ellipse cx="78" cy="300" rx="12" ry="18" fill={getSegmentColor('knees')} opacity="0.9" />
        <ellipse cx="122" cy="300" rx="12" ry="18" fill={getSegmentColor('knees')} opacity="0.9" />

        {/* Ankles */}
        <ellipse cx="80" cy="375" rx="10" ry="14" fill={getSegmentColor('ankles')} opacity="0.9" />
        <ellipse cx="120" cy="375" rx="10" ry="14" fill={getSegmentColor('ankles')} opacity="0.9" />
      </g>

      {/* Body outline */}
      <g fill="none" stroke="#333" strokeWidth="1">
        <ellipse cx="100" cy="30" rx="20" ry="24" />
        <path d="M58 68 L142 68 L138 190 L62 190 Z" />
        <path d="M68 220 Q72 260 74 300 Q76 340 72 380" />
        <path d="M132 220 Q128 260 126 300 Q124 340 128 380" />
      </g>
    </svg>
  );
}

// DESIGN 4: Numeric Labels on Body
function Design4NumericLabels() {
  return (
    <svg viewBox="0 0 200 400" width="140" height="280">
      <BodyBase />
      {/* Number labels at each region */}
      {ALL_REGIONS.map(region => {
        const positions = REGION_POSITIONS[region];
        const value = SAMPLE_DATA[region];
        const color = getThermalColor(intensities[region]);
        // Only show on first position for bilateral regions
        const pos = positions[0];
        const displayX = positions.length > 1 ? 100 : pos.cx; // Center for bilateral
        const displayY = pos.cy;

        return (
          <g key={region}>
            {/* Background circle */}
            <circle
              cx={displayX}
              cy={displayY}
              r="16"
              fill={color}
              opacity="0.9"
            />
            {/* Number */}
            <text
              x={displayX}
              y={displayY + 5}
              textAnchor="middle"
              fill="#000"
              fontSize="14"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// DESIGN 5: Ring Indicators
function Design5RingIndicators() {
  const getRingCount = (intensity: number) => Math.max(1, Math.ceil(intensity * 4)); // 1-4 rings

  return (
    <svg viewBox="0 0 200 400" width="140" height="280">
      <BodyBase />
      {/* Concentric rings */}
      {ALL_REGIONS.map(region =>
        REGION_POSITIONS[region].map((pos, i) => {
          const rings = getRingCount(intensities[region]);
          const color = getThermalColor(intensities[region]);
          return (
            <g key={`${region}-${i}`}>
              {Array.from({ length: rings }).map((_, ringIndex) => (
                <circle
                  key={ringIndex}
                  cx={pos.cx}
                  cy={pos.cy}
                  r={8 + ringIndex * 6}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  opacity={1 - ringIndex * 0.2}
                />
              ))}
              {/* Center dot */}
              <circle cx={pos.cx} cy={pos.cy} r="5" fill={color} />
            </g>
          );
        })
      )}
    </svg>
  );
}

// DESIGN 6: Legend + Brighter Colors
function Design6WithLegend() {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <svg viewBox="0 0 200 400" width="140" height="280">
        <defs>
          <filter id="blur6" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <BodyBase />
        {/* Bright colored zones */}
        <g filter="url(#blur6)">
          {ALL_REGIONS.map(region =>
            REGION_POSITIONS[region].map((pos, i) => (
              <ellipse
                key={`${region}-${i}`}
                cx={pos.cx}
                cy={pos.cy}
                rx={region === 'neck' ? 22 : 20}
                ry={region === 'knees' || region === 'ankles' ? 24 : 18}
                fill={getThermalColor(intensities[region])}
                opacity={0.95}
              />
            ))
          )}
        </g>
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '40px' }}>
        <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px', fontWeight: 600 }}>INTENSITY</div>
        {[
          { label: 'Very High', color: '#ef4444' },
          { label: 'High', color: '#f97316' },
          { label: 'Medium', color: '#eab308' },
          { label: 'Low', color: '#22c55e' },
          { label: 'Very Low', color: '#06b6d4' },
          { label: 'Minimal', color: '#3b82f6' },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: color }} />
            <span style={{ fontSize: '11px', color: '#aaa' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main showcase component
export function HeatMapDesignShowcase() {
  const designs = [
    {
      id: 1,
      name: 'Thermal Color Scale',
      description: 'Blue (cold/low) → Red (hot/high). Familiar heat map metaphor.',
      component: <Design1ThermalColors />,
    },
    {
      id: 2,
      name: 'Size + Color Combined',
      description: 'Bigger circles = higher intensity. Double encoding for clarity.',
      component: <Design2SizeAndColor />,
    },
    {
      id: 3,
      name: 'Filled Body Segments',
      description: 'Actual body parts colored. Anatomically intuitive.',
      component: <Design3FilledSegments />,
    },
    {
      id: 4,
      name: 'Numeric Labels',
      description: 'Exact counts shown on body. Maximum precision.',
      component: <Design4NumericLabels />,
    },
    {
      id: 5,
      name: 'Ring Indicators',
      description: 'More rings = higher intensity. Radar/sonar feel.',
      component: <Design5RingIndicators />,
    },
    {
      id: 6,
      name: 'Legend + Brighter Colors',
      description: 'Current design with color legend and increased saturation.',
      component: <Design6WithLegend />,
    },
  ];

  return (
    <div
      style={{
        padding: '24px',
        background: '#111',
        minHeight: '100vh',
      }}
    >
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#fff',
          marginBottom: '8px',
        }}
      >
        Heat Map Design Options
      </h1>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '32px' }}>
        Sample data: Elbows (15), Neck (12), Ankles (10), Shoulders (8), Knees (6), Wrists (3)
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {designs.map((design) => (
          <div
            key={design.id}
            style={{
              background: '#1a1a1a',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #333',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#fff',
                  margin: 0,
                }}
              >
                {design.id}. {design.name}
              </h2>
              <p
                style={{
                  fontSize: '13px',
                  color: '#888',
                  margin: '4px 0 0',
                }}
              >
                {design.description}
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '20px 0',
              }}
            >
              {design.component}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: '48px',
          padding: '20px',
          background: 'rgba(245, 166, 35, 0.1)',
          border: '1px solid rgba(245, 166, 35, 0.3)',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#F5A623', margin: '0 0 8px' }}>
          Recommendation
        </h3>
        <p style={{ fontSize: '13px', color: '#ccc', margin: 0 }}>
          Combine <strong>Design 2 (Size + Color)</strong> with the thermal scale. This gives double
          encoding: both size AND color communicate intensity, making it instantly readable even
          without a legend.
        </p>
      </div>
    </div>
  );
}

export default HeatMapDesignShowcase;
