import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface RainfallProps {
  /** Number of raindrops */
  dropCount?: number;
  /** Rain color */
  color?: string;
  /** Fall speed (0-1) */
  speed?: number;
  /** Wind angle in degrees */
  windAngle?: number;
  /** Raindrop length range */
  lengthRange?: [number, number];
  /** Base opacity (0-1) */
  opacity?: number;
  /** Rain intensity (0-1) */
  intensity?: number;
  /** Show splash effects */
  showSplash?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Raindrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  thickness: number;
}

interface Splash {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

/**
 * Rainfall
 *
 * Realistic rain effect with optional splash particles.
 * Creates a moody, atmospheric environment.
 */
export const Rainfall: React.FC<RainfallProps> = ({
  dropCount = 150,
  color = '#a5b4c4',
  speed = 0.7,
  windAngle = 5,
  lengthRange = [10, 25],
  opacity = 0.6,
  intensity = 0.7,
  showSplash = true,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<Raindrop[]>([]);
  const splashesRef = useRef<Splash[]>([]);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const windRad = (windAngle * Math.PI) / 180;

  const initDrops = useCallback((width: number, height: number) => {
    const drops: Raindrop[] = [];

    for (let i = 0; i < dropCount * intensity; i++) {
      drops.push({
        x: Math.random() * width * 1.2 - width * 0.1,
        y: Math.random() * height,
        length: lengthRange[0] + Math.random() * (lengthRange[1] - lengthRange[0]),
        speed: 15 + Math.random() * 10,
        thickness: 1 + Math.random() * 1.5,
      });
    }

    dropsRef.current = drops;
    splashesRef.current = [];
  }, [dropCount, intensity, lengthRange]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Update and draw raindrops
    dropsRef.current.forEach((drop) => {
      if (!prefersReducedMotion) {
        drop.y += drop.speed * speed;
        drop.x += Math.tan(windRad) * drop.speed * speed;

        // Reset when off screen
        if (drop.y > height) {
          // Create splash
          if (showSplash && Math.random() > 0.7) {
            splashesRef.current.push({
              x: drop.x,
              y: height,
              radius: 0,
              maxRadius: 5 + Math.random() * 10,
              opacity: opacity,
            });
          }

          drop.y = -drop.length;
          drop.x = Math.random() * width * 1.2 - width * 0.1;
        }
      }

      // Draw raindrop
      const endX = drop.x - Math.tan(windRad) * drop.length;
      const endY = drop.y - drop.length;

      const gradient = ctx.createLinearGradient(drop.x, drop.y, endX, endY);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = drop.thickness;
      ctx.lineCap = 'round';
      ctx.globalAlpha = opacity;
      ctx.stroke();
    });

    // Update and draw splashes
    if (showSplash) {
      splashesRef.current = splashesRef.current.filter((splash) => {
        if (!prefersReducedMotion) {
          splash.radius += 0.8;
          splash.opacity -= 0.03;
        }

        if (splash.opacity <= 0) return false;

        ctx.beginPath();
        ctx.arc(splash.x, splash.y, splash.radius, Math.PI, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = splash.opacity;
        ctx.stroke();

        return true;
      });
    }

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, windRad, opacity, color, showSplash, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initDrops(canvas.width, canvas.height);
  }, [initDrops]);

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

export default Rainfall;
