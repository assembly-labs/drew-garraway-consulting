/**
 * Particle Effect Presets
 *
 * Pre-configured settings for various use cases.
 * Import the preset and spread it into the component props.
 *
 * @example
 * import { FloatingParticles } from './FloatingParticles';
 * import { presets } from './presets';
 *
 * <FloatingParticles {...presets.floatingParticles.subtle} />
 */

import type { FloatingParticlesProps } from './FloatingParticles';
import type { StarfieldProps } from './Starfield';
import type { ParticleNetworkProps } from './ParticleNetwork';
import type { GlowingOrbsProps } from './GlowingOrbs';
import type { BubblesProps } from './Bubbles';
import type { SnowfallProps } from './Snowfall';
import type { FirefliesProps } from './Fireflies';
import type { AuroraProps } from './Aurora';
import type { ConfettiProps } from './Confetti';
import type { WaveParticlesProps } from './WaveParticles';
import type { GalaxyProps } from './Galaxy';
import type { NebulaProps } from './Nebula';
import type { RisingEmbersProps } from './RisingEmbers';
import type { GeometricShapesProps } from './GeometricShapes';
import type { MatrixRainProps } from './MatrixRain';

// Note: New effect presets can be added by importing the Props types
// and creating preset objects following the pattern above.
// The 50 new effects are ready for use with custom props.

// ============================================
// FLOATING PARTICLES PRESETS
// ============================================

export const floatingParticlesPresets = {
  /** Very subtle dust motes - barely visible */
  subtle: {
    particleCount: 30,
    particleSize: 2,
    color: '#ffffff',
    speed: 0.1,
    opacity: 0.2,
    mouseInfluence: 0,
  } satisfies Partial<FloatingParticlesProps>,

  /** Default balanced particles */
  default: {
    particleCount: 50,
    particleSize: 3,
    color: '#ffffff',
    speed: 0.3,
    opacity: 0.5,
    mouseInfluence: 0.3,
  } satisfies Partial<FloatingParticlesProps>,

  /** Dense particle field */
  dense: {
    particleCount: 150,
    particleSize: 2,
    color: '#ffffff',
    speed: 0.2,
    opacity: 0.4,
    mouseInfluence: 0.5,
  } satisfies Partial<FloatingParticlesProps>,

  /** Warm golden particles */
  golden: {
    particleCount: 40,
    particleSize: 3,
    color: '#fbbf24',
    speed: 0.2,
    opacity: 0.4,
    mouseInfluence: 0.3,
  } satisfies Partial<FloatingParticlesProps>,

  /** Cool blue particles */
  ocean: {
    particleCount: 60,
    particleSize: 3,
    color: '#06b6d4',
    speed: 0.25,
    opacity: 0.35,
    mouseInfluence: 0.4,
  } satisfies Partial<FloatingParticlesProps>,
};

// ============================================
// STARFIELD PRESETS
// ============================================

export const starfieldPresets = {
  /** Very subtle stars - minimal distraction */
  subtle: {
    starCount: 50,
    maxStarSize: 2,
    color: '#ffffff',
    twinkleSpeed: 0.2,
    opacity: 0.4,
    parallaxStrength: 0.1,
  } satisfies Partial<StarfieldProps>,

  /** Classic night sky */
  nightSky: {
    starCount: 150,
    maxStarSize: 3,
    color: '#ffffff',
    twinkleSpeed: 0.5,
    opacity: 0.8,
    parallaxStrength: 0.3,
  } satisfies Partial<StarfieldProps>,

  /** Dense starfield for space themes */
  deepSpace: {
    starCount: 300,
    maxStarSize: 2.5,
    color: '#e0e7ff',
    twinkleSpeed: 0.4,
    opacity: 0.9,
    parallaxStrength: 0.5,
  } satisfies Partial<StarfieldProps>,

  /** Warm toned stars */
  warm: {
    starCount: 100,
    maxStarSize: 3,
    color: '#fef3c7',
    twinkleSpeed: 0.3,
    opacity: 0.6,
    parallaxStrength: 0.2,
  } satisfies Partial<StarfieldProps>,
};

// ============================================
// PARTICLE NETWORK PRESETS
// ============================================

export const particleNetworkPresets = {
  /** Minimal, subtle network */
  subtle: {
    nodeCount: 20,
    nodeSize: 2,
    nodeColor: 'rgba(255, 255, 255, 0.5)',
    lineColor: 'rgba(255, 255, 255, 0.3)',
    connectionDistance: 100,
    speed: 0.1,
    opacity: 0.3,
    mouseAttraction: 0.2,
  } satisfies Partial<ParticleNetworkProps>,

  /** Tech/data visualization style */
  tech: {
    nodeCount: 50,
    nodeSize: 3,
    nodeColor: '#3b82f6',
    lineColor: '#3b82f6',
    connectionDistance: 150,
    speed: 0.3,
    opacity: 0.6,
    mouseAttraction: 0.5,
  } satisfies Partial<ParticleNetworkProps>,

  /** Purple neural network */
  neural: {
    nodeCount: 60,
    nodeSize: 3,
    nodeColor: '#8b5cf6',
    lineColor: '#8b5cf6',
    connectionDistance: 120,
    speed: 0.25,
    opacity: 0.5,
    mouseAttraction: 0.6,
  } satisfies Partial<ParticleNetworkProps>,

  /** Dense constellation */
  constellation: {
    nodeCount: 80,
    nodeSize: 2,
    nodeColor: '#ffffff',
    lineColor: '#ffffff',
    connectionDistance: 100,
    speed: 0.15,
    opacity: 0.4,
    mouseAttraction: 0.3,
  } satisfies Partial<ParticleNetworkProps>,
};

// ============================================
// GLOWING ORBS PRESETS
// ============================================

export const glowingOrbsPresets = {
  /** Very subtle ambient glow */
  subtle: {
    orbCount: 4,
    minSize: 80,
    maxSize: 200,
    colors: ['#8b5cf6', '#3b82f6'],
    speed: 0.1,
    glowIntensity: 0.3,
    pulseSpeed: 0.2,
    opacity: 0.2,
    blur: 60,
  } satisfies Partial<GlowingOrbsProps>,

  /** Dreamy purple/pink */
  dreamy: {
    orbCount: 6,
    minSize: 60,
    maxSize: 180,
    colors: ['#8b5cf6', '#ec4899', '#6366f1'],
    speed: 0.15,
    glowIntensity: 0.5,
    pulseSpeed: 0.25,
    opacity: 0.35,
    blur: 50,
  } satisfies Partial<GlowingOrbsProps>,

  /** Ocean/teal vibes */
  ocean: {
    orbCount: 5,
    minSize: 70,
    maxSize: 160,
    colors: ['#06b6d4', '#10b981', '#3b82f6'],
    speed: 0.12,
    glowIntensity: 0.4,
    pulseSpeed: 0.2,
    opacity: 0.3,
    blur: 55,
  } satisfies Partial<GlowingOrbsProps>,

  /** Sunset warmth */
  sunset: {
    orbCount: 5,
    minSize: 80,
    maxSize: 180,
    colors: ['#f97316', '#ef4444', '#fbbf24', '#ec4899'],
    speed: 0.1,
    glowIntensity: 0.45,
    pulseSpeed: 0.2,
    opacity: 0.3,
    blur: 50,
  } satisfies Partial<GlowingOrbsProps>,
};

// ============================================
// BUBBLES PRESETS
// ============================================

export const bubblesPresets = {
  /** Very subtle, slow bubbles */
  subtle: {
    bubbleCount: 15,
    minSize: 3,
    maxSize: 12,
    color: '#ffffff',
    speed: 0.2,
    wobble: 0.3,
    opacity: 0.15,
    showHighlight: false,
  } satisfies Partial<BubblesProps>,

  /** Classic underwater */
  underwater: {
    bubbleCount: 40,
    minSize: 4,
    maxSize: 20,
    color: '#ffffff',
    speed: 0.5,
    wobble: 0.5,
    opacity: 0.3,
    showHighlight: true,
  } satisfies Partial<BubblesProps>,

  /** Champagne celebration */
  champagne: {
    bubbleCount: 60,
    minSize: 2,
    maxSize: 8,
    color: '#fef3c7',
    speed: 0.6,
    wobble: 0.4,
    opacity: 0.4,
    showHighlight: true,
  } satisfies Partial<BubblesProps>,
};

// ============================================
// SNOWFALL PRESETS
// ============================================

export const snowfallPresets = {
  /** Light, gentle snowfall */
  subtle: {
    snowflakeCount: 50,
    minSize: 2,
    maxSize: 4,
    color: '#ffffff',
    speed: 0.3,
    wind: 0,
    sway: 0.3,
    opacity: 0.5,
  } satisfies Partial<SnowfallProps>,

  /** Classic winter snow */
  winter: {
    snowflakeCount: 100,
    minSize: 2,
    maxSize: 6,
    color: '#ffffff',
    speed: 0.5,
    wind: 0.1,
    sway: 0.5,
    opacity: 0.8,
  } satisfies Partial<SnowfallProps>,

  /** Heavy blizzard */
  blizzard: {
    snowflakeCount: 200,
    minSize: 2,
    maxSize: 5,
    color: '#ffffff',
    speed: 0.8,
    wind: 0.4,
    sway: 0.7,
    opacity: 0.9,
  } satisfies Partial<SnowfallProps>,
};

// ============================================
// FIREFLIES PRESETS
// ============================================

export const firefliesPresets = {
  /** Sparse, subtle fireflies */
  subtle: {
    fireflyCount: 10,
    glowSize: 6,
    color: '#fef08a',
    speed: 0.2,
    blinkSpeed: 0.3,
    glowIntensity: 0.5,
    trailLength: 0.1,
  } satisfies Partial<FirefliesProps>,

  /** Summer night */
  summer: {
    fireflyCount: 25,
    glowSize: 8,
    color: '#fef08a',
    speed: 0.3,
    blinkSpeed: 0.5,
    glowIntensity: 0.7,
    trailLength: 0.3,
  } satisfies Partial<FirefliesProps>,

  /** Magical forest */
  magical: {
    fireflyCount: 40,
    glowSize: 10,
    color: '#a5f3fc',
    speed: 0.25,
    blinkSpeed: 0.4,
    glowIntensity: 0.8,
    trailLength: 0.4,
  } satisfies Partial<FirefliesProps>,
};

// ============================================
// AURORA PRESETS
// ============================================

export const auroraPresets = {
  /** Subtle northern lights */
  subtle: {
    bandCount: 3,
    colors: ['#10b981', '#06b6d4', '#3b82f6'],
    speed: 0.2,
    amplitude: 0.3,
    opacity: 0.15,
    verticalPosition: 0.3,
    height: 0.3,
  } satisfies Partial<AuroraProps>,

  /** Classic aurora borealis */
  borealis: {
    bandCount: 5,
    colors: ['#22c55e', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6'],
    speed: 0.3,
    amplitude: 0.5,
    opacity: 0.3,
    verticalPosition: 0.3,
    height: 0.4,
  } satisfies Partial<AuroraProps>,

  /** Vibrant display */
  vibrant: {
    bandCount: 6,
    colors: ['#ec4899', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981'],
    speed: 0.35,
    amplitude: 0.6,
    opacity: 0.4,
    verticalPosition: 0.25,
    height: 0.5,
  } satisfies Partial<AuroraProps>,
};

// ============================================
// CONFETTI PRESETS
// ============================================

export const confettiPresets = {
  /** Very subtle falling shapes */
  subtle: {
    particleCount: 20,
    colors: ['#8b5cf6', '#6366f1', '#3b82f6'],
    speed: 0.2,
    spin: 0.2,
    sway: 0.3,
    sizeRange: [4, 8] as [number, number],
    shapes: ['square', 'circle'] as const,
    opacity: 0.2,
    continuous: true,
  } satisfies Partial<ConfettiProps>,

  /** Gentle celebration */
  celebration: {
    particleCount: 50,
    colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'],
    speed: 0.5,
    spin: 0.5,
    sway: 0.5,
    sizeRange: [5, 12] as [number, number],
    shapes: ['square', 'rectangle', 'circle'] as const,
    opacity: 0.8,
    continuous: true,
  } satisfies Partial<ConfettiProps>,

  /** Party mode */
  party: {
    particleCount: 100,
    colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'],
    speed: 0.7,
    spin: 0.7,
    sway: 0.6,
    sizeRange: [6, 14] as [number, number],
    shapes: ['square', 'rectangle', 'circle'] as const,
    opacity: 0.9,
    continuous: true,
  } satisfies Partial<ConfettiProps>,
};

// ============================================
// WAVE PARTICLES PRESETS
// ============================================

export const waveParticlesPresets = {
  /** Subtle flowing waves */
  subtle: {
    particleCount: 30,
    waveCount: 2,
    particleSize: 2,
    colors: ['#8b5cf6', '#6366f1'],
    speed: 0.3,
    amplitude: 0.2,
    frequency: 1.5,
    opacity: 0.3,
    verticalPosition: 0.5,
  } satisfies Partial<WaveParticlesProps>,

  /** Ocean waves */
  ocean: {
    particleCount: 50,
    waveCount: 3,
    particleSize: 3,
    colors: ['#06b6d4', '#3b82f6', '#10b981'],
    speed: 0.4,
    amplitude: 0.35,
    frequency: 2,
    opacity: 0.5,
    verticalPosition: 0.5,
  } satisfies Partial<WaveParticlesProps>,

  /** Sound waves */
  sound: {
    particleCount: 60,
    waveCount: 4,
    particleSize: 2.5,
    colors: ['#8b5cf6', '#ec4899', '#f97316', '#eab308'],
    speed: 0.6,
    amplitude: 0.4,
    frequency: 3,
    opacity: 0.6,
    verticalPosition: 0.5,
  } satisfies Partial<WaveParticlesProps>,
};

// ============================================
// GALAXY PRESETS
// ============================================

export const galaxyPresets = {
  /** Subtle spiral */
  subtle: {
    starCount: 200,
    arms: 2,
    maxStarSize: 1.5,
    colors: ['#ffffff', '#e0e7ff'],
    speed: 0.05,
    spiralTightness: 0.4,
    coreGlow: 0.3,
    opacity: 0.5,
  } satisfies Partial<GalaxyProps>,

  /** Classic spiral galaxy */
  spiral: {
    starCount: 500,
    arms: 2,
    maxStarSize: 2,
    colors: ['#ffffff', '#fef3c7', '#bfdbfe', '#c4b5fd'],
    speed: 0.1,
    spiralTightness: 0.5,
    coreGlow: 0.5,
    opacity: 0.8,
  } satisfies Partial<GalaxyProps>,

  /** Dense galaxy */
  dense: {
    starCount: 800,
    arms: 3,
    maxStarSize: 2,
    colors: ['#ffffff', '#fef3c7', '#bfdbfe', '#fbcfe8'],
    speed: 0.08,
    spiralTightness: 0.6,
    coreGlow: 0.6,
    opacity: 0.9,
  } satisfies Partial<GalaxyProps>,
};

// ============================================
// NEBULA PRESETS
// ============================================

export const nebulaPresets = {
  /** Subtle cosmic mist */
  subtle: {
    cloudCount: 4,
    colors: ['#8b5cf6', '#3b82f6'],
    speed: 0.1,
    density: 0.4,
    opacity: 0.2,
    blur: 80,
    complexity: 0.3,
  } satisfies Partial<NebulaProps>,

  /** Dreamy nebula */
  dreamy: {
    cloudCount: 6,
    colors: ['#8b5cf6', '#ec4899', '#3b82f6', '#06b6d4'],
    speed: 0.15,
    density: 0.5,
    opacity: 0.35,
    blur: 60,
    complexity: 0.5,
  } satisfies Partial<NebulaProps>,

  /** Vibrant cosmic clouds */
  cosmic: {
    cloudCount: 8,
    colors: ['#8b5cf6', '#ec4899', '#3b82f6', '#06b6d4', '#10b981'],
    speed: 0.2,
    density: 0.6,
    opacity: 0.4,
    blur: 50,
    complexity: 0.6,
  } satisfies Partial<NebulaProps>,
};

// ============================================
// RISING EMBERS PRESETS
// ============================================

export const risingEmbersPresets = {
  /** Subtle warm embers */
  subtle: {
    emberCount: 20,
    maxSize: 3,
    colors: ['#fbbf24', '#f97316'],
    speed: 0.3,
    sway: 0.3,
    fadeSpeed: 0.4,
    glowIntensity: 0.4,
    opacity: 0.5,
  } satisfies Partial<RisingEmbersProps>,

  /** Campfire */
  campfire: {
    emberCount: 40,
    maxSize: 4,
    colors: ['#fef08a', '#fbbf24', '#f97316', '#ef4444'],
    speed: 0.5,
    sway: 0.5,
    fadeSpeed: 0.5,
    glowIntensity: 0.7,
    opacity: 0.9,
  } satisfies Partial<RisingEmbersProps>,

  /** Intense fire */
  inferno: {
    emberCount: 60,
    maxSize: 5,
    colors: ['#fef08a', '#fbbf24', '#f97316', '#ef4444', '#dc2626'],
    speed: 0.7,
    sway: 0.6,
    fadeSpeed: 0.6,
    glowIntensity: 0.8,
    opacity: 1,
  } satisfies Partial<RisingEmbersProps>,
};

// ============================================
// GEOMETRIC SHAPES PRESETS
// ============================================

export const geometricShapesPresets = {
  /** Minimal floating shapes */
  subtle: {
    shapeCount: 8,
    shapes: ['hexagon', 'circle'] as const,
    sizeRange: [20, 40] as [number, number],
    colors: ['#8b5cf6', '#6366f1'],
    speed: 0.1,
    rotationSpeed: 0.2,
    opacity: 0.15,
    lineWidth: 1,
    filled: false,
  } satisfies Partial<GeometricShapesProps>,

  /** Tech aesthetic */
  tech: {
    shapeCount: 15,
    shapes: ['triangle', 'square', 'hexagon'] as const,
    sizeRange: [20, 50] as [number, number],
    colors: ['#3b82f6', '#06b6d4', '#10b981'],
    speed: 0.15,
    rotationSpeed: 0.3,
    opacity: 0.25,
    lineWidth: 2,
    filled: false,
  } satisfies Partial<GeometricShapesProps>,

  /** Modern filled shapes */
  modern: {
    shapeCount: 12,
    shapes: ['triangle', 'square', 'circle', 'hexagon'] as const,
    sizeRange: [30, 60] as [number, number],
    colors: ['#8b5cf6', '#ec4899', '#3b82f6', '#06b6d4'],
    speed: 0.12,
    rotationSpeed: 0.25,
    opacity: 0.2,
    lineWidth: 2,
    filled: true,
  } satisfies Partial<GeometricShapesProps>,
};

// ============================================
// MATRIX RAIN PRESETS
// ============================================

export const matrixRainPresets = {
  /** Subtle code rain */
  subtle: {
    characters: '01',
    color: '#22c55e',
    highlightColor: '#86efac',
    speed: 0.3,
    fontSize: 12,
    fadeLength: 0.4,
    opacity: 0.5,
  } satisfies Partial<MatrixRainProps>,

  /** Classic matrix */
  classic: {
    characters: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789',
    color: '#22c55e',
    highlightColor: '#ffffff',
    speed: 0.5,
    fontSize: 14,
    fadeLength: 0.6,
    opacity: 0.8,
  } satisfies Partial<MatrixRainProps>,

  /** Blue cyber */
  cyber: {
    characters: '0123456789ABCDEF<>{}[]|/\\',
    color: '#3b82f6',
    highlightColor: '#93c5fd',
    speed: 0.6,
    fontSize: 12,
    fadeLength: 0.5,
    opacity: 0.7,
  } satisfies Partial<MatrixRainProps>,
};

// ============================================
// COMBINED PRESETS EXPORT
// ============================================

export const presets = {
  floatingParticles: floatingParticlesPresets,
  starfield: starfieldPresets,
  particleNetwork: particleNetworkPresets,
  glowingOrbs: glowingOrbsPresets,
  bubbles: bubblesPresets,
  snowfall: snowfallPresets,
  fireflies: firefliesPresets,
  aurora: auroraPresets,
  confetti: confettiPresets,
  waveParticles: waveParticlesPresets,
  galaxy: galaxyPresets,
  nebula: nebulaPresets,
  risingEmbers: risingEmbersPresets,
  geometricShapes: geometricShapesPresets,
  matrixRain: matrixRainPresets,
};

export default presets;

