import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface RippleFieldProps {
  /** Number of ripple sources */
  sourceCount?: number;
  /** Ripple color */
  color?: string;
  /** Animation speed (0-1) */
  speed?: number;
  /** Ripple decay rate (0-1) */
  decay?: number;
  /** Maximum ripples per source */
  maxRipples?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface RippleSource {
  x: number;
  y: number;
  phase: number;
  frequency: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

/**
 * RippleField
 *
 * Interference pattern of expanding ripples.
 * Creates a water/wave interference aesthetic.
 */
export const RippleField: React.FC<RippleFieldProps> = ({
  sourceCount = 3,
  color = '#06b6d4',
  speed = 0.4,
  decay = 0.5,
  maxRipples = 8,
  opacity = 0.7,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourcesRef = useRef<RippleSource[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initSources = useCallback((width: number, height: number) => {
    const sources: RippleSource[] = [];

    for (let i = 0; i < sourceCount; i++) {
      sources.push({
        x: width * (0.2 + (i / (sourceCount - 1 || 1)) * 0.6),
        y: height * 0.5,
        phase: Math.random() * Math.PI * 2,
        frequency: 0.5 + Math.random() * 0.5,
      });
    }

    sourcesRef.current = sources;
    ripplesRef.current = [];
  }, [sourceCount]);

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

    // Generate new ripples from sources
    if (!prefersReducedMotion) {
      sourcesRef.current.forEach((source) => {
        source.phase += source.frequency * speed * 0.1;

        if (Math.sin(source.phase) > 0.95) {
          const existingRipples = ripplesRef.current.filter(
            (r) => Math.abs(r.x - source.x) < 10 && Math.abs(r.y - source.y) < 10
          );

          if (existingRipples.length < maxRipples) {
            ripplesRef.current.push({
              x: source.x,
              y: source.y,
              radius: 0,
              maxRadius: Math.max(width, height) * 0.8,
              opacity: 1,
            });
          }
        }
      });
    }

    // Draw sources
    sourcesRef.current.forEach((source) => {
      const pulse = 0.5 + Math.sin(source.phase * 3) * 0.5;

      const gradient = ctx.createRadialGradient(
        source.x, source.y, 0,
        source.x, source.y, 20
      );
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.3, color);
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(source.x, source.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.globalAlpha = opacity * (0.5 + pulse * 0.5);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(source.x, source.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = opacity;
      ctx.fill();
    });

    // Update and draw ripples
    ripplesRef.current = ripplesRef.current.filter((ripple) => {
      if (!prefersReducedMotion) {
        ripple.radius += 2 * speed;
        ripple.opacity -= 0.005 * decay;
      }

      if (ripple.opacity <= 0 || ripple.radius > ripple.maxRadius) return false;

      // Draw ripple
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = opacity * ripple.opacity;
      ctx.stroke();

      // Inner glow
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.globalAlpha = opacity * ripple.opacity * 0.5;
      ctx.stroke();

      return true;
    });

    // Draw interference pattern (simplified)
    if (ripplesRef.current.length > 1) {
      const resolution = 20;

      for (let x = 0; x < width; x += resolution) {
        for (let y = 0; y < height; y += resolution) {
          let totalWave = 0;

          ripplesRef.current.forEach((ripple) => {
            const dx = x - ripple.x;
            const dy = y - ripple.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < ripple.radius + 50 && dist > ripple.radius - 50) {
              const wave = Math.sin((dist - ripple.radius) * 0.2) * ripple.opacity;
              totalWave += wave;
            }
          });

          if (Math.abs(totalWave) > 0.5) {
            const intensity = Math.min(1, Math.abs(totalWave));

            ctx.beginPath();
            ctx.arc(x, y, 3 * intensity, 0, Math.PI * 2);
            ctx.fillStyle = totalWave > 0 ? color : '#ffffff';
            ctx.globalAlpha = opacity * 0.3 * intensity;
            ctx.fill();
          }
        }
      }
    }

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, decay, maxRipples, color, opacity, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initSources(canvas.width, canvas.height);
  }, [initSources]);

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

export default RippleField;
