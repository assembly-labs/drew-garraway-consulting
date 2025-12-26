import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface SmokeWispsProps {
  /** Number of smoke wisps */
  wispCount?: number;
  /** Smoke color */
  color?: string;
  /** Rise speed (0-1) */
  speed?: number;
  /** Curl intensity (0-1) */
  curlIntensity?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Wisp size range */
  sizeRange?: [number, number];
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Wisp {
  x: number;
  y: number;
  size: number;
  curlPhase: number;
  curlSpeed: number;
  riseSpeed: number;
  segments: { x: number; y: number }[];
  age: number;
  maxAge: number;
}

/**
 * SmokeWisps
 *
 * Curling smoke tendrils rising and dissipating.
 * Creates a mysterious, atmospheric aesthetic.
 */
export const SmokeWisps: React.FC<SmokeWispsProps> = ({
  wispCount = 8,
  color = '#94a3b8',
  speed = 0.3,
  curlIntensity = 0.6,
  opacity = 0.5,
  sizeRange = [30, 60],
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wispsRef = useRef<Wisp[]>([]);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const createWisp = useCallback((x: number, y: number): Wisp => {
    return {
      x,
      y,
      size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
      curlPhase: Math.random() * Math.PI * 2,
      curlSpeed: 0.5 + Math.random() * 1,
      riseSpeed: 0.5 + Math.random() * 1,
      segments: [{ x, y }],
      age: 0,
      maxAge: 200 + Math.random() * 100,
    };
  }, [sizeRange]);

  const initWisps = useCallback((width: number, height: number) => {
    const wisps: Wisp[] = [];

    for (let i = 0; i < wispCount; i++) {
      wisps.push(createWisp(
        width * 0.2 + Math.random() * width * 0.6,
        height + Math.random() * 50
      ));
    }

    wispsRef.current = wisps;
  }, [wispCount, createWisp]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Update and draw wisps
    wispsRef.current = wispsRef.current.map((wisp) => {
      if (!prefersReducedMotion) {
        wisp.age++;
        wisp.curlPhase += wisp.curlSpeed * 0.02;

        // Calculate new position
        const curlX = Math.sin(wisp.curlPhase) * curlIntensity * 30;
        const riseY = -wisp.riseSpeed * speed * 2;

        const lastSegment = wisp.segments[wisp.segments.length - 1];
        const newX = lastSegment.x + curlX * 0.1;
        const newY = lastSegment.y + riseY;

        wisp.segments.push({ x: newX, y: newY });

        // Limit segment count
        if (wisp.segments.length > 50) {
          wisp.segments.shift();
        }
      }

      // Calculate opacity based on age
      const ageRatio = wisp.age / wisp.maxAge;
      const fadeOpacity = ageRatio < 0.1
        ? ageRatio / 0.1
        : ageRatio > 0.7
          ? (1 - ageRatio) / 0.3
          : 1;

      // Draw wisp as connected segments with varying thickness
      if (wisp.segments.length > 1) {
        wisp.segments.forEach((segment, i) => {
          if (i === 0) return;

          const segmentProgress = i / wisp.segments.length;
          const segmentSize = wisp.size * (1 - segmentProgress * 0.5);
          const segmentOpacity = opacity * fadeOpacity * (1 - segmentProgress * 0.7);

          // Draw smoke puff
          const gradient = ctx.createRadialGradient(
            segment.x, segment.y, 0,
            segment.x, segment.y, segmentSize
          );
          gradient.addColorStop(0, color);
          gradient.addColorStop(0.5, color + '80');
          gradient.addColorStop(1, 'transparent');

          ctx.beginPath();
          ctx.arc(segment.x, segment.y, segmentSize, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.globalAlpha = segmentOpacity;
          ctx.fill();
        });
      }

      // Reset wisp if too old or off screen
      if (wisp.age > wisp.maxAge || wisp.segments[wisp.segments.length - 1].y < -wisp.size) {
        return createWisp(
          width * 0.2 + Math.random() * width * 0.6,
          height + 20
        );
      }

      return wisp;
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, curlIntensity, opacity, color, createWisp, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initWisps(canvas.width, canvas.height);
  }, [initWisps]);

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

export default SmokeWisps;
