import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface AuroraProps {
  /** Number of aurora bands */
  bandCount?: number;
  /** Array of colors for the aurora */
  colors?: string[];
  /** Wave speed (0-1) */
  speed?: number;
  /** Wave amplitude (0-1) */
  amplitude?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Vertical position (0-1, 0 = top, 1 = bottom) */
  verticalPosition?: number;
  /** Height of the aurora as percentage (0-1) */
  height?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Band {
  offset: number;
  amplitude: number;
  frequency: number;
  speed: number;
  color: string;
  opacity: number;
}

/**
 * Aurora
 *
 * Beautiful northern lights wave effect with flowing colors.
 * Creates a magical, ethereal atmosphere reminiscent of the aurora borealis.
 */
export const Aurora: React.FC<AuroraProps> = ({
  bandCount = 5,
  colors = ['#22c55e', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6'],
  speed = 0.3,
  amplitude = 0.5,
  opacity = 0.3,
  verticalPosition = 0.3,
  height = 0.4,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bandsRef = useRef<Band[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  // Initialize bands
  const initBands = useCallback(() => {
    const bands: Band[] = [];
    for (let i = 0; i < bandCount; i++) {
      bands.push({
        offset: (i / bandCount) * Math.PI * 2,
        amplitude: amplitude * (0.5 + Math.random() * 0.5),
        frequency: 0.5 + Math.random() * 1,
        speed: speed * (0.7 + Math.random() * 0.6),
        color: colors[i % colors.length],
        opacity: opacity * (0.6 + Math.random() * 0.4),
      });
    }
    bandsRef.current = bands;
  }, [bandCount, colors, speed, amplitude, opacity]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const canvasHeight = canvas.height;

    // Update time
    if (!prefersReducedMotion) {
      timeRef.current += 0.008;
    }

    // Clear canvas
    ctx.clearRect(0, 0, width, canvasHeight);

    const baseY = canvasHeight * verticalPosition;
    const auroraHeight = canvasHeight * height;

    // Draw bands
    bandsRef.current.forEach((band, index) => {
      ctx.beginPath();

      const layerOffset = (index / bandsRef.current.length) * auroraHeight * 0.3;

      // Create wave path
      for (let x = 0; x <= width; x += 2) {
        const normalizedX = x / width;

        // Multiple sine waves for organic movement
        const wave1 = Math.sin(normalizedX * band.frequency * Math.PI * 2 + timeRef.current * band.speed + band.offset);
        const wave2 = Math.sin(normalizedX * band.frequency * 1.5 * Math.PI * 2 + timeRef.current * band.speed * 0.7 + band.offset * 2);
        const wave3 = Math.sin(normalizedX * band.frequency * 0.5 * Math.PI * 2 + timeRef.current * band.speed * 1.3);

        const combinedWave = (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2) * band.amplitude * auroraHeight * 0.5;

        const y = baseY + layerOffset + combinedWave;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      // Complete the shape for gradient fill
      ctx.lineTo(width, canvasHeight);
      ctx.lineTo(0, canvasHeight);
      ctx.closePath();

      // Create gradient
      const gradient = ctx.createLinearGradient(0, baseY - auroraHeight * 0.5, 0, baseY + auroraHeight);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.3, band.color + Math.round(band.opacity * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(0.5, band.color + Math.round(band.opacity * 0.6 * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.fill();
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [verticalPosition, height, prefersReducedMotion]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  }, []);

  // Setup
  useEffect(() => {
    initBands();
    handleResize();
    window.addEventListener('resize', handleResize);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initBands, handleResize, animate]);

  // Re-init when props change
  useEffect(() => {
    initBands();
  }, [bandCount, colors, speed, amplitude, opacity, initBands]);

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

export default Aurora;

export const auroraCode = `import { useRef, useEffect } from 'react';

const Aurora = ({
  bandCount = 5,
  colors = ['#22c55e', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6'],
  speed = 0.3,
  amplitude = 0.5,
  opacity = 0.3,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let time = 0;

    const bands = Array.from({ length: bandCount }, (_, i) => ({
      offset: (i / bandCount) * Math.PI * 2,
      amplitude: amplitude * (0.5 + Math.random() * 0.5),
      frequency: 0.5 + Math.random() * 1,
      speed: speed * (0.7 + Math.random() * 0.6),
      color: colors[i % colors.length],
    }));

    const animate = () => {
      time += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const baseY = canvas.height * 0.3;

      bands.forEach((band, index) => {
        ctx.beginPath();

        for (let x = 0; x <= canvas.width; x += 2) {
          const wave = Math.sin((x / canvas.width) * band.frequency * Math.PI * 2 + time * band.speed + band.offset);
          const y = baseY + (index * 20) + wave * band.amplitude * 100;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, baseY - 100, 0, baseY + 200);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, band.color + '4d');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} />;
};`;
