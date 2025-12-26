import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface OrbitingMoonsProps {
  /** Number of orbiting objects */
  moonCount?: number;
  /** Moon size range */
  sizeRange?: [number, number];
  /** Moon colors */
  colors?: string[];
  /** Orbit speed (0-1) */
  speed?: number;
  /** Show orbit trails */
  showTrails?: boolean;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Show central body */
  showCenter?: boolean;
  /** Center body color */
  centerColor?: string;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Moon {
  angle: number;
  distance: number;
  size: number;
  color: string;
  speed: number;
  tilt: number;
  phase: number;
}

/**
 * OrbitingMoons
 *
 * Objects orbiting in 3D space around a central point.
 * Creates a planetary system effect.
 */
export const OrbitingMoons: React.FC<OrbitingMoonsProps> = ({
  moonCount = 5,
  sizeRange = [8, 20],
  colors = ['#94a3b8', '#cbd5e1', '#e2e8f0', '#64748b', '#475569'],
  speed = 0.3,
  showTrails = true,
  opacity = 0.9,
  showCenter = true,
  centerColor = '#fbbf24',
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const moonsRef = useRef<Moon[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initMoons = useCallback((width: number, height: number) => {
    const moons: Moon[] = [];
    const maxRadius = Math.min(width, height) * 0.4;

    for (let i = 0; i < moonCount; i++) {
      const distance = maxRadius * 0.3 + (i / moonCount) * maxRadius * 0.7;

      moons.push({
        angle: Math.random() * Math.PI * 2,
        distance,
        size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
        color: colors[i % colors.length],
        speed: 0.5 + Math.random() * 1,
        tilt: Math.random() * 0.4 - 0.2,
        phase: Math.random() * Math.PI * 2,
      });
    }

    moonsRef.current = moons;
  }, [moonCount, sizeRange, colors]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    if (!prefersReducedMotion) {
      timeRef.current += 0.016;
    }

    ctx.clearRect(0, 0, width, height);

    // Draw orbit trails
    if (showTrails) {
      moonsRef.current.forEach((moon) => {
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY,
          moon.distance,
          moon.distance * (0.3 + Math.abs(moon.tilt) * 0.7),
          moon.tilt,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = moon.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = opacity * 0.2;
        ctx.stroke();
      });
    }

    // Sort moons by z-depth for proper rendering
    const sortedMoons = [...moonsRef.current].map((moon) => {
      const currentAngle = moon.angle + (prefersReducedMotion ? 0 : timeRef.current * moon.speed * speed);
      const z = Math.sin(currentAngle) * moon.distance * moon.tilt;
      return { moon, currentAngle, z };
    }).sort((a, b) => a.z - b.z);

    // Draw moons behind center
    sortedMoons.filter(m => m.z < 0).forEach(({ moon, currentAngle }) => {
      drawMoon(ctx, centerX, centerY, moon, currentAngle, opacity * 0.7);
    });

    // Draw central body
    if (showCenter) {
      const centerSize = Math.min(width, height) * 0.08;

      // Glow
      const glowGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, centerSize * 2
      );
      glowGradient.addColorStop(0, centerColor);
      glowGradient.addColorStop(0.3, centerColor);
      glowGradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(centerX, centerY, centerSize * 2, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.globalAlpha = opacity * 0.5;
      ctx.fill();

      // Body
      const bodyGradient = ctx.createRadialGradient(
        centerX - centerSize * 0.3, centerY - centerSize * 0.3, 0,
        centerX, centerY, centerSize
      );
      bodyGradient.addColorStop(0, '#ffffff');
      bodyGradient.addColorStop(0.3, centerColor);
      bodyGradient.addColorStop(1, '#92400e');

      ctx.beginPath();
      ctx.arc(centerX, centerY, centerSize, 0, Math.PI * 2);
      ctx.fillStyle = bodyGradient;
      ctx.globalAlpha = 1;
      ctx.fill();
    }

    // Draw moons in front of center
    sortedMoons.filter(m => m.z >= 0).forEach(({ moon, currentAngle }) => {
      drawMoon(ctx, centerX, centerY, moon, currentAngle, opacity);
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, showTrails, opacity, showCenter, centerColor, prefersReducedMotion]);

  const drawMoon = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    moon: Moon,
    currentAngle: number,
    currentOpacity: number
  ) => {
    const x = centerX + Math.cos(currentAngle) * moon.distance;
    const y = centerY + Math.sin(currentAngle) * moon.distance * (0.3 + Math.abs(moon.tilt) * 0.7);

    // Moon shadow (dark side)
    const moonGradient = ctx.createRadialGradient(
      x - moon.size * 0.3, y - moon.size * 0.3, 0,
      x, y, moon.size
    );
    moonGradient.addColorStop(0, '#ffffff');
    moonGradient.addColorStop(0.3, moon.color);
    moonGradient.addColorStop(1, '#1e293b');

    ctx.beginPath();
    ctx.arc(x, y, moon.size, 0, Math.PI * 2);
    ctx.fillStyle = moonGradient;
    ctx.globalAlpha = currentOpacity;
    ctx.fill();

    // Surface detail
    for (let i = 0; i < 3; i++) {
      const craterX = x + (Math.random() - 0.5) * moon.size * 1.2;
      const craterY = y + (Math.random() - 0.5) * moon.size * 1.2;
      const craterSize = moon.size * 0.15 * Math.random();

      ctx.beginPath();
      ctx.arc(craterX, craterY, craterSize, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.globalAlpha = currentOpacity * 0.5;
      ctx.fill();
    }
  };

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initMoons(canvas.width, canvas.height);
  }, [initMoons]);

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

export default OrbitingMoons;
