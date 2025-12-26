import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface BlackHoleProps {
  /** Number of particles being pulled in */
  particleCount?: number;
  /** Size of the event horizon */
  eventHorizonSize?: number;
  /** Gravitational pull strength (0-1) */
  pullStrength?: number;
  /** Accretion disk colors */
  colors?: string[];
  /** Rotation speed (0-1) */
  speed?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Show gravitational lensing effect */
  showLensing?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface BlackHoleParticle {
  angle: number;
  distance: number;
  speed: number;
  size: number;
  color: string;
  orbitDecay: number;
  trailLength: number;
}

/**
 * BlackHole
 *
 * A mesmerizing black hole effect with particles spiraling into an event horizon.
 * Features accretion disk simulation and gravitational lensing.
 */
export const BlackHole: React.FC<BlackHoleProps> = ({
  particleCount = 150,
  eventHorizonSize = 40,
  pullStrength = 0.5,
  colors = ['#ff6b35', '#f7c59f', '#efa00b', '#d65108', '#591f0a'],
  speed = 0.3,
  opacity = 0.9,
  showLensing = true,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<BlackHoleParticle[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initParticles = useCallback((width: number, height: number) => {
    const particles: BlackHoleParticle[] = [];
    const maxDistance = Math.max(width, height) * 0.6;

    for (let i = 0; i < particleCount; i++) {
      const distance = eventHorizonSize + Math.random() * (maxDistance - eventHorizonSize);
      particles.push({
        angle: Math.random() * Math.PI * 2,
        distance,
        speed: 0.5 + Math.random() * 1.5,
        size: 1 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        orbitDecay: 0.01 + Math.random() * 0.02 * pullStrength,
        trailLength: 5 + Math.random() * 15,
      });
    }

    particlesRef.current = particles;
  }, [particleCount, eventHorizonSize, pullStrength, colors]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDistance = Math.max(width, height) * 0.6;

    if (!prefersReducedMotion) {
      timeRef.current += 0.016 * speed;
    }

    ctx.clearRect(0, 0, width, height);

    // Draw gravitational lensing effect
    if (showLensing) {
      const lensingRadius = eventHorizonSize * 3;
      const lensingGradient = ctx.createRadialGradient(
        centerX, centerY, eventHorizonSize * 0.8,
        centerX, centerY, lensingRadius
      );
      lensingGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      lensingGradient.addColorStop(0.3, 'rgba(100, 50, 150, 0.1)');
      lensingGradient.addColorStop(0.6, 'rgba(50, 100, 200, 0.05)');
      lensingGradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(centerX, centerY, lensingRadius, 0, Math.PI * 2);
      ctx.fillStyle = lensingGradient;
      ctx.fill();
    }

    // Draw particles with trails
    particlesRef.current.forEach((particle) => {
      if (!prefersReducedMotion) {
        particle.angle += (particle.speed / particle.distance) * speed;
        particle.distance -= particle.orbitDecay * speed * 10;

        if (particle.distance <= eventHorizonSize) {
          particle.distance = maxDistance;
          particle.angle = Math.random() * Math.PI * 2;
        }
      }

      // Draw trail
      const trailSteps = Math.floor(particle.trailLength);
      for (let t = 0; t < trailSteps; t++) {
        const trailAngle = particle.angle - (t * 0.05 * particle.speed / particle.distance);
        const trailDistance = particle.distance + t * particle.orbitDecay * 20;
        const x = centerX + Math.cos(trailAngle) * trailDistance;
        const y = centerY + Math.sin(trailAngle) * trailDistance;
        const trailOpacity = opacity * (1 - t / trailSteps) * 0.5;

        ctx.beginPath();
        ctx.arc(x, y, particle.size * (1 - t / trailSteps * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = trailOpacity;
        ctx.fill();
      }

      // Draw main particle
      const x = centerX + Math.cos(particle.angle) * particle.distance;
      const y = centerY + Math.sin(particle.angle) * particle.distance;

      ctx.beginPath();
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = opacity;
      ctx.fill();

      // Glow effect
      ctx.beginPath();
      ctx.arc(x, y, particle.size * 2, 0, Math.PI * 2);
      ctx.globalAlpha = opacity * 0.3;
      ctx.fill();
    });

    // Draw event horizon
    const horizonGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, eventHorizonSize
    );
    horizonGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
    horizonGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.95)');
    horizonGradient.addColorStop(0.85, 'rgba(20, 10, 30, 0.8)');
    horizonGradient.addColorStop(1, 'rgba(50, 20, 70, 0)');

    ctx.beginPath();
    ctx.arc(centerX, centerY, eventHorizonSize, 0, Math.PI * 2);
    ctx.fillStyle = horizonGradient;
    ctx.globalAlpha = 1;
    ctx.fill();

    animationRef.current = requestAnimationFrame(animate);
  }, [speed, eventHorizonSize, opacity, showLensing, prefersReducedMotion]);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      initParticles(canvas.width, canvas.height);
    }
  }, [particleCount, eventHorizonSize, pullStrength, colors, initParticles]);

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

export default BlackHole;
