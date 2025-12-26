import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface PlanetaryRingsProps {
  /** Number of ring particles */
  particleCount?: number;
  /** Number of rings */
  ringCount?: number;
  /** Inner ring radius ratio (0-1) */
  innerRadius?: number;
  /** Outer ring radius ratio (0-1) */
  outerRadius?: number;
  /** Ring colors */
  colors?: string[];
  /** Rotation speed (0-1) */
  speed?: number;
  /** Ring tilt angle in degrees */
  tilt?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Show planet */
  showPlanet?: boolean;
  /** Planet color */
  planetColor?: string;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface RingParticle {
  angle: number;
  distance: number;
  size: number;
  color: string;
  speed: number;
  ringIndex: number;
}

/**
 * PlanetaryRings
 *
 * Saturn-like planetary rings with orbiting particles.
 * Creates a beautiful 3D perspective effect.
 */
export const PlanetaryRings: React.FC<PlanetaryRingsProps> = ({
  particleCount = 300,
  ringCount = 5,
  innerRadius = 0.25,
  outerRadius = 0.45,
  colors = ['#d4a574', '#c9a067', '#b8935a', '#a7864d', '#967940'],
  speed = 0.2,
  tilt = 70,
  opacity = 0.8,
  showPlanet = true,
  planetColor = '#e8d5b7',
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<RingParticle[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const tiltRad = (tilt * Math.PI) / 180;

  const initParticles = useCallback((width: number, height: number) => {
    const particles: RingParticle[] = [];
    const baseRadius = Math.min(width, height) / 2;
    const inner = baseRadius * innerRadius;
    const outer = baseRadius * outerRadius;

    for (let i = 0; i < particleCount; i++) {
      const ringIndex = Math.floor(Math.random() * ringCount);
      const ringWidth = (outer - inner) / ringCount;
      const ringCenter = inner + ringWidth * (ringIndex + 0.5);
      const distance = ringCenter + (Math.random() - 0.5) * ringWidth * 0.8;

      particles.push({
        angle: Math.random() * Math.PI * 2,
        distance,
        size: 0.5 + Math.random() * 2,
        color: colors[ringIndex % colors.length],
        speed: 0.8 + Math.random() * 0.4,
        ringIndex,
      });
    }

    particlesRef.current = particles;
  }, [particleCount, ringCount, innerRadius, outerRadius, colors]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) / 2;

    if (!prefersReducedMotion) {
      timeRef.current += 0.016 * speed;
    }

    ctx.clearRect(0, 0, width, height);

    // Sort particles by y position for proper depth
    const sortedParticles = [...particlesRef.current].sort((a, b) => {
      const aY = Math.sin(a.angle + timeRef.current * a.speed) * a.distance * Math.sin(tiltRad);
      const bY = Math.sin(b.angle + timeRef.current * b.speed) * b.distance * Math.sin(tiltRad);
      return aY - bY;
    });

    // Draw back particles
    sortedParticles.forEach((particle) => {
      const currentAngle = particle.angle + (prefersReducedMotion ? 0 : timeRef.current * particle.speed);
      const y3d = Math.sin(currentAngle) * particle.distance * Math.sin(tiltRad);

      if (y3d < 0) {
        const x = centerX + Math.cos(currentAngle) * particle.distance;
        const y = centerY + y3d;

        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = opacity * 0.6;
        ctx.fill();
      }
    });

    // Draw planet
    if (showPlanet) {
      const planetRadius = baseRadius * innerRadius * 0.85;
      const planetGradient = ctx.createRadialGradient(
        centerX - planetRadius * 0.3,
        centerY - planetRadius * 0.3,
        0,
        centerX,
        centerY,
        planetRadius
      );
      planetGradient.addColorStop(0, planetColor);
      planetGradient.addColorStop(0.7, planetColor);
      planetGradient.addColorStop(1, '#8b7355');

      ctx.beginPath();
      ctx.arc(centerX, centerY, planetRadius, 0, Math.PI * 2);
      ctx.fillStyle = planetGradient;
      ctx.globalAlpha = 1;
      ctx.fill();

      // Planet shadow
      ctx.beginPath();
      ctx.arc(centerX + planetRadius * 0.1, centerY, planetRadius * 1.02, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fill();
    }

    // Draw front particles
    sortedParticles.forEach((particle) => {
      const currentAngle = particle.angle + (prefersReducedMotion ? 0 : timeRef.current * particle.speed);
      const y3d = Math.sin(currentAngle) * particle.distance * Math.sin(tiltRad);

      if (y3d >= 0) {
        const x = centerX + Math.cos(currentAngle) * particle.distance;
        const y = centerY + y3d;

        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = opacity;
        ctx.fill();
      }
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, tilt, tiltRad, opacity, showPlanet, planetColor, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initParticles(canvas.width, canvas.height);
  }, [initParticles]);

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

export default PlanetaryRings;
