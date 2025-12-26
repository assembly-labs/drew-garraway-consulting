import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface FluidMorphProps {
  /** Number of blob shapes */
  blobCount?: number;
  /** Blob colors */
  colors?: string[];
  /** Morph speed (0-1) */
  speed?: number;
  /** Blob size range */
  sizeRange?: [number, number];
  /** Blur amount */
  blur?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Blob {
  x: number;
  y: number;
  baseRadius: number;
  color: string;
  phase: number;
  phaseSpeed: number;
  vx: number;
  vy: number;
  points: { angle: number; radiusOffset: number; speed: number }[];
}

/**
 * FluidMorph
 *
 * Organic morphing blob shapes with fluid movement.
 * Creates a lava lamp / liquid aesthetic.
 */
export const FluidMorph: React.FC<FluidMorphProps> = ({
  blobCount = 5,
  colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981'],
  speed = 0.3,
  sizeRange = [80, 150],
  blur = 40,
  opacity = 0.6,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<Blob[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initBlobs = useCallback((width: number, height: number) => {
    const blobs: Blob[] = [];

    for (let i = 0; i < blobCount; i++) {
      const points = [];
      const pointCount = 8;

      for (let p = 0; p < pointCount; p++) {
        points.push({
          angle: (p / pointCount) * Math.PI * 2,
          radiusOffset: Math.random() * 0.3 - 0.15,
          speed: 0.5 + Math.random() * 1.5,
        });
      }

      blobs.push({
        x: width * 0.2 + Math.random() * width * 0.6,
        y: height * 0.2 + Math.random() * height * 0.6,
        baseRadius: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
        color: colors[i % colors.length],
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.3 + Math.random() * 0.7,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        points,
      });
    }

    blobsRef.current = blobs;
  }, [blobCount, colors, sizeRange]);

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

    // Apply blur filter
    if (blur > 0) {
      ctx.filter = `blur(${blur}px)`;
    }

    blobsRef.current.forEach((blob) => {
      if (!prefersReducedMotion) {
        // Move blob
        blob.x += blob.vx * speed;
        blob.y += blob.vy * speed;

        // Bounce off edges
        if (blob.x < blob.baseRadius || blob.x > width - blob.baseRadius) {
          blob.vx *= -1;
        }
        if (blob.y < blob.baseRadius || blob.y > height - blob.baseRadius) {
          blob.vy *= -1;
        }

        blob.phase += blob.phaseSpeed * 0.02 * speed;
      }

      // Draw morphing blob
      ctx.beginPath();

      const points = blob.points.map((point) => {
        const morphOffset = Math.sin(timeRef.current * point.speed + blob.phase + point.angle) * 0.2;
        const radius = blob.baseRadius * (1 + point.radiusOffset + morphOffset);

        return {
          x: blob.x + Math.cos(point.angle) * radius,
          y: blob.y + Math.sin(point.angle) * radius,
        };
      });

      // Draw smooth curve through points
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 0; i < points.length; i++) {
        const next = points[(i + 1) % points.length];
        const nextNext = points[(i + 2) % points.length];

        const nextMidX = (next.x + nextNext.x) / 2;
        const nextMidY = (next.y + nextNext.y) / 2;

        ctx.quadraticCurveTo(next.x, next.y, nextMidX, nextMidY);
      }

      ctx.closePath();

      // Fill with gradient
      const gradient = ctx.createRadialGradient(
        blob.x - blob.baseRadius * 0.3,
        blob.y - blob.baseRadius * 0.3,
        0,
        blob.x,
        blob.y,
        blob.baseRadius * 1.5
      );
      gradient.addColorStop(0, blob.color);
      gradient.addColorStop(0.5, blob.color);
      gradient.addColorStop(1, blob.color + '00');

      ctx.fillStyle = gradient;
      ctx.globalAlpha = opacity;
      ctx.fill();
    });

    ctx.filter = 'none';
    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, blur, opacity, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initBlobs(canvas.width, canvas.height);
  }, [initBlobs]);

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

export default FluidMorph;
