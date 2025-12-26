import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface DandelionProps {
  /** Number of seeds */
  seedCount?: number;
  /** Seed color */
  color?: string;
  /** Float speed (0-1) */
  speed?: number;
  /** Wind effect (0-1) */
  wind?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Seed size */
  seedSize?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface DandelionSeed {
  x: number;
  y: number;
  rotation: number;
  rotationSpeed: number;
  speedX: number;
  speedY: number;
  phase: number;
  phaseSpeed: number;
  size: number;
}

/**
 * Dandelion
 *
 * Floating dandelion seeds drifting gently in the wind.
 * Creates a peaceful, whimsical atmosphere.
 */
export const Dandelion: React.FC<DandelionProps> = ({
  seedCount = 25,
  color = '#ffffff',
  speed = 0.2,
  wind = 0.3,
  opacity = 0.8,
  seedSize = 12,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const seedsRef = useRef<DandelionSeed[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initSeeds = useCallback((width: number, height: number) => {
    const seeds: DandelionSeed[] = [];

    for (let i = 0; i < seedCount; i++) {
      seeds.push({
        x: Math.random() * width,
        y: Math.random() * height,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        speedX: (Math.random() - 0.3) * 0.5,
        speedY: -0.2 - Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.5 + Math.random() * 1,
        size: seedSize * (0.8 + Math.random() * 0.4),
      });
    }

    seedsRef.current = seeds;
  }, [seedCount, seedSize]);

  const drawSeed = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    rotation: number,
    currentOpacity: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Draw parachute (pappus)
    const bristleCount = 12;
    for (let i = 0; i < bristleCount; i++) {
      const angle = (i / bristleCount) * Math.PI * 2;
      const length = size * 0.8;

      ctx.beginPath();
      ctx.moveTo(0, 0);

      const endX = Math.cos(angle) * length;
      const endY = Math.sin(angle) * length - size * 0.3;

      ctx.lineTo(endX, endY);
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = currentOpacity * 0.8;
      ctx.stroke();

      // Feathery ends
      for (let f = 0; f < 3; f++) {
        const featherAngle = angle + (f - 1) * 0.3;
        const featherLength = size * 0.2;

        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX + Math.cos(featherAngle) * featherLength,
          endY + Math.sin(featherAngle) * featherLength - featherLength * 0.5
        );
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.3;
        ctx.globalAlpha = currentOpacity * 0.5;
        ctx.stroke();
      }
    }

    // Draw center
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = currentOpacity;
    ctx.fill();

    // Draw seed body
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, size * 0.4);
    ctx.lineTo(size * 0.05, size * 0.5);
    ctx.lineTo(0, size * 0.45);
    ctx.lineTo(-size * 0.05, size * 0.5);
    ctx.lineTo(0, size * 0.4);
    ctx.fillStyle = '#a3a3a3';
    ctx.globalAlpha = currentOpacity;
    ctx.fill();

    ctx.restore();
  };

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    if (!prefersReducedMotion) {
      timeRef.current += 0.016;
    }

    ctx.clearRect(0, 0, width, height);

    seedsRef.current.forEach((seed) => {
      if (!prefersReducedMotion) {
        seed.phase += seed.phaseSpeed * 0.016;

        const waveX = Math.sin(seed.phase) * 0.8 * wind;
        const waveY = Math.cos(seed.phase * 0.7) * 0.3;

        seed.x += (seed.speedX + waveX + wind * 0.5) * speed;
        seed.y += (seed.speedY + waveY) * speed;
        seed.rotation += seed.rotationSpeed;

        // Wrap around
        if (seed.x > width + seed.size) seed.x = -seed.size;
        if (seed.x < -seed.size) seed.x = width + seed.size;
        if (seed.y < -seed.size) seed.y = height + seed.size;
        if (seed.y > height + seed.size) seed.y = -seed.size;
      }

      drawSeed(ctx, seed.x, seed.y, seed.size, seed.rotation, opacity);
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, wind, opacity, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initSeeds(canvas.width, canvas.height);
  }, [initSeeds]);

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

export default Dandelion;
