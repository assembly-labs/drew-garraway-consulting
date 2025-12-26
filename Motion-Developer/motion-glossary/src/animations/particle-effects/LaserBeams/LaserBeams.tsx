import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface LaserBeamsProps {
  /** Number of laser beams */
  beamCount?: number;
  /** Laser colors */
  colors?: string[];
  /** Sweep speed (0-1) */
  speed?: number;
  /** Beam width */
  beamWidth?: number;
  /** Glow intensity (0-1) */
  glowIntensity?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Beam pattern */
  pattern?: 'crossing' | 'parallel' | 'radial';
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface LaserBeam {
  startX: number;
  startY: number;
  angle: number;
  color: string;
  phase: number;
  speed: number;
}

/**
 * LaserBeams
 *
 * Sweeping laser beam effects.
 * Creates a concert/club lighting aesthetic.
 */
export const LaserBeams: React.FC<LaserBeamsProps> = ({
  beamCount = 6,
  colors = ['#ef4444', '#22c55e', '#3b82f6', '#eab308'],
  speed = 0.4,
  beamWidth = 3,
  glowIntensity = 0.7,
  opacity = 0.8,
  pattern = 'crossing',
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<LaserBeam[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initBeams = useCallback((width: number, height: number) => {
    const beams: LaserBeam[] = [];

    for (let i = 0; i < beamCount; i++) {
      let startX: number, startY: number, baseAngle: number;

      switch (pattern) {
        case 'parallel':
          startX = (i / beamCount) * width;
          startY = 0;
          baseAngle = Math.PI / 2;
          break;
        case 'radial':
          startX = width / 2;
          startY = height / 2;
          baseAngle = (i / beamCount) * Math.PI * 2;
          break;
        case 'crossing':
        default:
          startX = i % 2 === 0 ? 0 : width;
          startY = ((i / 2) / Math.ceil(beamCount / 2)) * height * 0.3;
          baseAngle = i % 2 === 0 ? Math.PI / 4 : Math.PI * 3 / 4;
      }

      beams.push({
        startX,
        startY,
        angle: baseAngle,
        color: colors[i % colors.length],
        phase: (i / beamCount) * Math.PI * 2,
        speed: 0.8 + Math.random() * 0.4,
      });
    }

    beamsRef.current = beams;
  }, [beamCount, colors, pattern]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const maxLength = Math.sqrt(width * width + height * height);

    if (!prefersReducedMotion) {
      timeRef.current += 0.016;
    }

    ctx.clearRect(0, 0, width, height);

    beamsRef.current.forEach((beam) => {
      // Calculate sweep angle
      const sweepRange = pattern === 'radial' ? 0.3 : 0.8;
      const currentAngle = beam.angle + Math.sin(timeRef.current * beam.speed * speed + beam.phase) * sweepRange;

      const endX = beam.startX + Math.cos(currentAngle) * maxLength;
      const endY = beam.startY + Math.sin(currentAngle) * maxLength;

      // Intensity pulse
      const pulse = 0.7 + Math.sin(timeRef.current * 3 + beam.phase) * 0.3;

      // Draw glow layers
      for (let g = 3; g >= 0; g--) {
        const glowWidth = beamWidth * (1 + g * 2);

        ctx.beginPath();
        ctx.moveTo(beam.startX, beam.startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = beam.color;
        ctx.lineWidth = glowWidth;
        ctx.lineCap = 'round';
        ctx.globalAlpha = opacity * glowIntensity * pulse * (0.1 / (g + 1));
        ctx.stroke();
      }

      // Main beam
      ctx.beginPath();
      ctx.moveTo(beam.startX, beam.startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = beam.color;
      ctx.lineWidth = beamWidth;
      ctx.lineCap = 'round';
      ctx.globalAlpha = opacity * pulse;
      ctx.stroke();

      // Bright core
      ctx.beginPath();
      ctx.moveTo(beam.startX, beam.startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = beamWidth * 0.3;
      ctx.lineCap = 'round';
      ctx.globalAlpha = opacity * pulse * 0.8;
      ctx.stroke();

      // Source point glow
      const sourceGlow = ctx.createRadialGradient(
        beam.startX, beam.startY, 0,
        beam.startX, beam.startY, 30
      );
      sourceGlow.addColorStop(0, '#ffffff');
      sourceGlow.addColorStop(0.3, beam.color);
      sourceGlow.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(beam.startX, beam.startY, 30, 0, Math.PI * 2);
      ctx.fillStyle = sourceGlow;
      ctx.globalAlpha = opacity * pulse;
      ctx.fill();

      // Particle dust in beam path
      if (!prefersReducedMotion) {
        for (let p = 0; p < 10; p++) {
          const t = Math.random();
          const px = beam.startX + (endX - beam.startX) * t;
          const py = beam.startY + (endY - beam.startY) * t;
          const pSize = 1 + Math.random() * 2;

          // Add some perpendicular offset for dust
          const perpX = Math.cos(currentAngle + Math.PI / 2) * (Math.random() - 0.5) * 10;
          const perpY = Math.sin(currentAngle + Math.PI / 2) * (Math.random() - 0.5) * 10;

          ctx.beginPath();
          ctx.arc(px + perpX, py + perpY, pSize, 0, Math.PI * 2);
          ctx.fillStyle = beam.color;
          ctx.globalAlpha = opacity * 0.5 * Math.random();
          ctx.fill();
        }
      }
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, beamWidth, glowIntensity, opacity, pattern, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initBeams(canvas.width, canvas.height);
  }, [initBeams]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleResize, animate]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};

export default LaserBeams;
