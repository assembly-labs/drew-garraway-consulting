/**
 * BodyHeatMap Component - "TARGETING HUD" Design
 *
 * Fully vector-based attack profile visualization.
 * No external images - everything is SVG paths in a unified coordinate system.
 *
 * Design concept: Military targeting HUD meets fighting game UI
 * - Anatomical vector figure with integrated heat zones
 * - Targeting reticle on "deadliest" region
 * - Connected data callouts
 * - Subtle scanning animation
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

// Zone center points for targeting reticle and labels (in 200x400 viewBox)
const ZONE_CENTERS: Record<BodyRegion, { x: number; y: number }> = {
  neck: { x: 100, y: 58 },
  shoulders: { x: 100, y: 88 },
  elbows: { x: 100, y: 148 },
  wrists: { x: 100, y: 195 },
  knees: { x: 100, y: 290 },
  ankles: { x: 100, y: 365 },
};

/**
 * Inline SVG Human Figure with integrated heat zones
 * ViewBox: 200 x 400 - taller aspect ratio for full body
 */
function HumanFigureSVG({
  intensities,
  isGiven,
  topRegion,
  selectedRegion,
  onRegionClick,
}: {
  intensities: Record<BodyRegion, number>;
  isGiven: boolean;
  topRegion: BodyRegion | null;
  selectedRegion: BodyRegion | null;
  onRegionClick: (region: BodyRegion) => void;
}) {
  const heatColor = isGiven ? '34, 197, 94' : '239, 68, 68';
  const accentColor = isGiven ? '#22c55e' : '#ef4444';

  // Generate unique gradient IDs
  const gradientId = (region: string) => `heat-${region}-${isGiven ? 'g' : 'r'}`;

  return (
    <svg
      viewBox="0 0 200 400"
      width="180"
      height="360"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Glow filter for body outline */}
        <filter id="bodyGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Heat blur filter */}
        <filter id="heatBlur" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="8" />
        </filter>

        {/* Targeting reticle rotation animation */}
        <animateTransform
          id="reticleRotate"
          attributeName="transform"
          type="rotate"
          from="0"
          to="360"
          dur="8s"
          repeatCount="indefinite"
        />

        {/* Radial gradients for each heat zone */}
        {ALL_REGIONS.map((region) => (
          <radialGradient key={region} id={gradientId(region)} cx="50%" cy="50%" r="50%">
            <stop
              offset="0%"
              stopColor={`rgb(${heatColor})`}
              stopOpacity={Math.min(1, intensities[region] * 1.5 + 0.4)}
            />
            <stop
              offset="40%"
              stopColor={`rgb(${heatColor})`}
              stopOpacity={Math.min(0.6, intensities[region] * 0.8 + 0.1)}
            />
            <stop offset="100%" stopColor={`rgb(${heatColor})`} stopOpacity="0" />
          </radialGradient>
        ))}

        {/* Pulse animation for active zones */}
        <animate
          id="pulseOpacity"
          attributeName="opacity"
          values="0.6;1;0.6"
          dur="2s"
          repeatCount="indefinite"
        />
      </defs>

      {/* Background grid for HUD effect */}
      <g opacity="0.08">
        {[...Array(20)].map((_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={i * 20}
            x2="200"
            y2={i * 20}
            stroke="#F5A623"
            strokeWidth="0.5"
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <line
            key={`v${i}`}
            x1={i * 20}
            y1="0"
            x2={i * 20}
            y2="400"
            stroke="#F5A623"
            strokeWidth="0.5"
          />
        ))}
      </g>

      {/* Scanning line animation */}
      <line
        x1="20"
        x2="180"
        y1="0"
        y2="0"
        stroke={accentColor}
        strokeWidth="1"
        opacity="0.4"
      >
        <animate
          attributeName="y1"
          values="0;400;0"
          dur="4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="y2"
          values="0;400;0"
          dur="4s"
          repeatCount="indefinite"
        />
      </line>

      {/* ============================================
          HEAT ZONES - Rendered behind the figure
          ============================================ */}
      <g filter="url(#heatBlur)">
        {/* Neck heat zone */}
        {intensities.neck > 0 && (
          <ellipse
            cx={ZONE_CENTERS.neck.x}
            cy={ZONE_CENTERS.neck.y}
            rx="20"
            ry="16"
            fill={`url(#${gradientId('neck')})`}
          />
        )}

        {/* Shoulders heat zones (bilateral) */}
        {intensities.shoulders > 0 && (
          <>
            <ellipse cx="60" cy="88" rx="22" ry="18" fill={`url(#${gradientId('shoulders')})`} />
            <ellipse cx="140" cy="88" rx="22" ry="18" fill={`url(#${gradientId('shoulders')})`} />
          </>
        )}

        {/* Elbows heat zones (bilateral) */}
        {intensities.elbows > 0 && (
          <>
            <ellipse cx="38" cy="148" rx="18" ry="22" fill={`url(#${gradientId('elbows')})`} />
            <ellipse cx="162" cy="148" rx="18" ry="22" fill={`url(#${gradientId('elbows')})`} />
          </>
        )}

        {/* Wrists heat zones (bilateral) */}
        {intensities.wrists > 0 && (
          <>
            <ellipse cx="28" cy="195" rx="14" ry="16" fill={`url(#${gradientId('wrists')})`} />
            <ellipse cx="172" cy="195" rx="14" ry="16" fill={`url(#${gradientId('wrists')})`} />
          </>
        )}

        {/* Knees heat zones (bilateral) */}
        {intensities.knees > 0 && (
          <>
            <ellipse cx="78" cy="290" rx="18" ry="24" fill={`url(#${gradientId('knees')})`} />
            <ellipse cx="122" cy="290" rx="18" ry="24" fill={`url(#${gradientId('knees')})`} />
          </>
        )}

        {/* Ankles heat zones (bilateral) */}
        {intensities.ankles > 0 && (
          <>
            <ellipse cx="72" cy="365" rx="14" ry="18" fill={`url(#${gradientId('ankles')})`} />
            <ellipse cx="128" cy="365" rx="14" ry="18" fill={`url(#${gradientId('ankles')})`} />
          </>
        )}
      </g>

      {/* ============================================
          HUMAN FIGURE - Vector silhouette
          Clean, geometric, proportionally accurate
          ============================================ */}
      <g filter="url(#bodyGlow)">
        {/* Head */}
        <ellipse
          cx="100"
          cy="28"
          rx="18"
          ry="22"
          fill="none"
          stroke="#F5A623"
          strokeWidth="1.5"
          opacity="0.9"
        />

        {/* Neck */}
        <rect
          x="94"
          y="48"
          width="12"
          height="18"
          fill="none"
          stroke="#F5A623"
          strokeWidth="1.5"
          opacity="0.9"
        />

        {/* Torso (trapezoid shape) */}
        <path
          d="M60 68 L140 68 L135 180 L65 180 Z"
          fill="none"
          stroke="#F5A623"
          strokeWidth="1.5"
          opacity="0.9"
        />

        {/* Left arm */}
        <path
          d="M60 70 L45 90 L35 130 L28 175 L22 200"
          fill="none"
          stroke="#F5A623"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Right arm */}
        <path
          d="M140 70 L155 90 L165 130 L172 175 L178 200"
          fill="none"
          stroke="#F5A623"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Hips */}
        <path
          d="M65 180 L68 210 L132 210 L135 180"
          fill="none"
          stroke="#F5A623"
          strokeWidth="1.5"
          opacity="0.9"
        />

        {/* Left leg */}
        <path
          d="M80 210 L75 260 L72 320 L68 380"
          fill="none"
          stroke="#F5A623"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Right leg */}
        <path
          d="M120 210 L125 260 L128 320 L132 380"
          fill="none"
          stroke="#F5A623"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Left foot */}
        <path
          d="M68 380 L58 382 L55 388"
          fill="none"
          stroke="#F5A623"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Right foot */}
        <path
          d="M132 380 L142 382 L145 388"
          fill="none"
          stroke="#F5A623"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.9"
        />
      </g>

      {/* ============================================
          CLICKABLE ZONES - Invisible hit areas
          ============================================ */}
      <g style={{ cursor: 'pointer' }}>
        {/* Neck zone */}
        <ellipse
          cx={ZONE_CENTERS.neck.x}
          cy={ZONE_CENTERS.neck.y}
          rx="24"
          ry="20"
          fill="transparent"
          onClick={() => onRegionClick('neck')}
        />

        {/* Shoulders zones */}
        <ellipse cx="60" cy="88" rx="26" ry="22" fill="transparent" onClick={() => onRegionClick('shoulders')} />
        <ellipse cx="140" cy="88" rx="26" ry="22" fill="transparent" onClick={() => onRegionClick('shoulders')} />

        {/* Elbows zones */}
        <ellipse cx="38" cy="148" rx="22" ry="26" fill="transparent" onClick={() => onRegionClick('elbows')} />
        <ellipse cx="162" cy="148" rx="22" ry="26" fill="transparent" onClick={() => onRegionClick('elbows')} />

        {/* Wrists zones */}
        <ellipse cx="28" cy="195" rx="18" ry="20" fill="transparent" onClick={() => onRegionClick('wrists')} />
        <ellipse cx="172" cy="195" rx="18" ry="20" fill="transparent" onClick={() => onRegionClick('wrists')} />

        {/* Knees zones */}
        <ellipse cx="78" cy="290" rx="22" ry="28" fill="transparent" onClick={() => onRegionClick('knees')} />
        <ellipse cx="122" cy="290" rx="22" ry="28" fill="transparent" onClick={() => onRegionClick('knees')} />

        {/* Ankles zones */}
        <ellipse cx="72" cy="365" rx="18" ry="22" fill="transparent" onClick={() => onRegionClick('ankles')} />
        <ellipse cx="128" cy="365" rx="18" ry="22" fill="transparent" onClick={() => onRegionClick('ankles')} />
      </g>

      {/* ============================================
          TARGETING RETICLE - On top region
          ============================================ */}
      {topRegion && (
        <g>
          {/* Get position for reticle based on top region */}
          {(() => {
            // For bilateral regions, pick a side
            const positions: Record<BodyRegion, { x: number; y: number }> = {
              neck: { x: 100, y: 58 },
              shoulders: { x: 140, y: 88 },
              elbows: { x: 162, y: 148 },
              wrists: { x: 172, y: 195 },
              knees: { x: 122, y: 290 },
              ankles: { x: 128, y: 365 },
            };
            const pos = positions[topRegion];

            return (
              <g transform={`translate(${pos.x}, ${pos.y})`}>
                {/* Outer rotating ring */}
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0"
                    to="360"
                    dur="8s"
                    repeatCount="indefinite"
                  />
                  <circle
                    r="28"
                    fill="none"
                    stroke={accentColor}
                    strokeWidth="1"
                    strokeDasharray="8 4"
                    opacity="0.8"
                  />
                </g>

                {/* Inner targeting circle */}
                <circle
                  r="18"
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1.5"
                  opacity="0.9"
                >
                  <animate
                    attributeName="r"
                    values="16;20;16"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Crosshairs */}
                <line x1="-24" y1="0" x2="-8" y2="0" stroke={accentColor} strokeWidth="1.5" />
                <line x1="8" y1="0" x2="24" y2="0" stroke={accentColor} strokeWidth="1.5" />
                <line x1="0" y1="-24" x2="0" y2="-8" stroke={accentColor} strokeWidth="1.5" />
                <line x1="0" y1="8" x2="0" y2="24" stroke={accentColor} strokeWidth="1.5" />

                {/* Corner brackets */}
                <path d="M-22,-22 L-22,-16 M-22,-22 L-16,-22" stroke={accentColor} strokeWidth="1" fill="none" />
                <path d="M22,-22 L22,-16 M22,-22 L16,-22" stroke={accentColor} strokeWidth="1" fill="none" />
                <path d="M-22,22 L-22,16 M-22,22 L-16,22" stroke={accentColor} strokeWidth="1" fill="none" />
                <path d="M22,22 L22,16 M22,22 L16,22" stroke={accentColor} strokeWidth="1" fill="none" />

                {/* Center dot */}
                <circle r="3" fill={accentColor}>
                  <animate
                    attributeName="opacity"
                    values="1;0.5;1"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })()}
        </g>
      )}

      {/* ============================================
          SELECTION INDICATOR - Highlight selected region
          ============================================ */}
      {selectedRegion && (
        <g>
          {(() => {
            const zones: Record<BodyRegion, Array<{ cx: number; cy: number; rx: number; ry: number }>> = {
              neck: [{ cx: 100, cy: 58, rx: 22, ry: 18 }],
              shoulders: [{ cx: 60, cy: 88, rx: 24, ry: 20 }, { cx: 140, cy: 88, rx: 24, ry: 20 }],
              elbows: [{ cx: 38, cy: 148, rx: 20, ry: 24 }, { cx: 162, cy: 148, rx: 20, ry: 24 }],
              wrists: [{ cx: 28, cy: 195, rx: 16, ry: 18 }, { cx: 172, cy: 195, rx: 16, ry: 18 }],
              knees: [{ cx: 78, cy: 290, rx: 20, ry: 26 }, { cx: 122, cy: 290, rx: 20, ry: 26 }],
              ankles: [{ cx: 72, cy: 365, rx: 16, ry: 20 }, { cx: 128, cy: 365, rx: 16, ry: 20 }],
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
                strokeDasharray="4 2"
                opacity="0.8"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="0;12"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </ellipse>
            ));
          })()}
        </g>
      )}

      {/* HUD corner decorations */}
      <g stroke="#F5A623" strokeWidth="1" opacity="0.4" fill="none">
        <path d="M10,10 L10,30 M10,10 L30,10" />
        <path d="M190,10 L190,30 M190,10 L170,10" />
        <path d="M10,390 L10,370 M10,390 L30,390" />
        <path d="M190,390 L190,370 M190,390 L170,390" />
      </g>
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

  // Find the top region (for targeting reticle)
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

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, var(--color-gray-900) 0%, #0a0a0a 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        border: '1px solid var(--color-gray-800)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow background */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '30%',
          transform: 'translate(-50%, -50%)',
          width: '300px',
          height: '400px',
          background: view === 'given'
            ? 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.08) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header with toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '20px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              color: 'var(--color-gold)',
              marginBottom: '4px',
              opacity: 0.8,
            }}
          >
            Targeting System
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
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
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 'var(--radius-full)',
            padding: '3px',
            border: '1px solid var(--color-gray-800)',
          }}
        >
          <button
            onClick={() => { setView('given'); setSelectedRegion(null); }}
            style={{
              padding: '8px 14px',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: view === 'given' ? 'var(--color-positive)' : 'transparent',
              color: view === 'given' ? 'var(--color-black)' : 'var(--color-gray-500)',
            }}
          >
            Given
          </button>
          <button
            onClick={() => { setView('received'); setSelectedRegion(null); }}
            style={{
              padding: '8px 14px',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: view === 'received' ? 'var(--color-negative)' : 'transparent',
              color: view === 'received' ? 'var(--color-white)' : 'var(--color-gray-500)',
            }}
          >
            Received
          </button>
        </div>
      </div>

      {/* Main content: Figure + Stats */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Human figure visualization */}
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <HumanFigureSVG
            intensities={intensities}
            isGiven={view === 'given'}
            topRegion={topRegion}
            selectedRegion={selectedRegion}
            onRegionClick={handleRegionClick}
          />
        </div>

        {/* Stats panel */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Region breakdown - vertical list for better mobile experience */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {ALL_REGIONS.map((region) => {
              const count = currentData[region];
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              const isSelected = selectedRegion === region;
              const isTop = topRegion === region;

              return (
                <div
                  key={region}
                  onClick={() => handleRegionClick(region)}
                  style={{
                    padding: '10px 12px',
                    background: isSelected
                      ? (view === 'given' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)')
                      : 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected
                      ? `1px solid ${view === 'given' ? 'var(--color-positive)' : 'var(--color-negative)'}`
                      : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                  }}
                >
                  {/* Top indicator */}
                  {isTop && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '-8px',
                        transform: 'translateY(-50%)',
                        width: '4px',
                        height: '20px',
                        background: view === 'given' ? 'var(--color-positive)' : 'var(--color-negative)',
                        borderRadius: '2px',
                      }}
                    />
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 600,
                          color: isTop ? 'var(--color-white)' : 'var(--color-gray-300)',
                        }}
                      >
                        {REGION_LABELS[region]}
                      </span>
                      {isTop && (
                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: view === 'given' ? 'var(--color-positive)' : 'var(--color-negative)',
                            background: view === 'given' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          {view === 'given' ? 'Deadliest' : 'Vulnerable'}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: 'var(--text-lg)',
                          fontWeight: 700,
                          color: view === 'given' ? 'var(--color-positive)' : 'var(--color-negative)',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {count}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
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
                      height: 3,
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      marginTop: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: view === 'given'
                          ? 'linear-gradient(90deg, var(--color-positive), rgba(34, 197, 94, 0.6))'
                          : 'linear-gradient(90deg, var(--color-negative), rgba(239, 68, 68, 0.6))',
                        borderRadius: 2,
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expanded technique breakdown */}
          {selectedRegion && techniqueBreakdown && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${view === 'given' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              }}
            >
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--color-gray-500)',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {REGION_LABELS[selectedRegion]} Techniques
              </div>
              {getRegionTechniques(selectedRegion).length > 0 ? (
                getRegionTechniques(selectedRegion).map((t, i) => (
                  <div
                    key={t.technique}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-gray-200)',
                      padding: '4px 0',
                      borderBottom: i < getRegionTechniques(selectedRegion).length - 1
                        ? '1px solid rgba(255, 255, 255, 0.05)'
                        : 'none',
                    }}
                  >
                    <span style={{ textTransform: 'capitalize' }}>{t.technique}</span>
                    <span
                      style={{
                        color: view === 'given' ? 'var(--color-positive)' : 'var(--color-negative)',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                      }}
                    >
                      {t.count}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', fontStyle: 'italic' }}>
                  No technique data
                </div>
              )}
            </div>
          )}

          {/* Total summary */}
          <div
            style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                color: 'var(--color-gray-500)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Total {view === 'given' ? 'Attacks' : 'Caught'}
            </span>
            <span
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 700,
                color: view === 'given' ? 'var(--color-positive)' : 'var(--color-negative)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {total}
            </span>
          </div>
        </div>
      </div>

      {/* Status bar at bottom */}
      <div
        style={{
          marginTop: '20px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: view === 'given' ? 'var(--color-positive)' : 'var(--color-negative)',
              animation: 'pulse 2s infinite',
            }}
          />
          <span
            style={{
              fontSize: '10px',
              color: 'var(--color-gray-500)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {view === 'given' ? 'Offense Mode' : 'Defense Mode'}
          </span>
        </div>
        <span
          style={{
            fontSize: '10px',
            color: 'var(--color-gray-600)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          Tap zones to explore
        </span>
      </div>
    </div>
  );
}

export default BodyHeatMap;
