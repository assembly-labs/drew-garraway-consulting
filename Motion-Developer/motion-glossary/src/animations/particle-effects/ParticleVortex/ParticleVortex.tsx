import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface ParticleVortexProps {
  /** Number of particles */
  particleCount?: number;
  /** Vortex colors */
  colors?: string[];
  /** Rotation speed (0-1) */
  speed?: number;
  /** Inward pull strength (0-1) */
  pullStrength?: number;
  /** Vortex size ratio (0-1) */
  sizeRatio?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface VortexParticle {
  angle: number;
  distance: number;
  size: number;
  color: string;
  speed: number;
  inwardSpeed: number;
}

/**
 * ParticleVortex
 *
 * Spiral vortex of particles being pulled inward.
 * Creates a hypnotic, swirling effect.
 */
export const ParticleVortex: React.FC<ParticleVortexProps> = ({
  particleCount = 200,
  colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981'],
  speed = 0.5,
  pullStrength = 0.3,
  sizeRatio = 0.4,
  opacity = 0.8,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<VortexParticle[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initParticles = useCallback((width: number, height: number) => {
    const particles: VortexParticle[] = [];
    const maxRadius = Math.min(width, height) * sizeRatio;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * maxRadius,
        size: 1 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 0.5 + Math.random() * 1.5,
        inwardSpeed: 0.2 + Math.random() * 0.5,
      });
    }

    particlesRef.current = particles;
  }, [particleCount, colors, sizeRatio]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * sizeRatio;

    if (!prefersReducedMotion) {
      timeRef.current += 0.016;
    }

    ctx.clearRect(0, 0, width, height);

    // Draw center glow
    const centerGlow = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, maxRadius * 0.3
    );
    centerGlow.addColorStop(0, colors[0]);
    centerGlow.addColorStop(0.5, colors[0] + '40');
    centerGlow.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = centerGlow;
    ctx.globalAlpha = opacity * 0.5;
    ctx.fill();

    // Update and draw particles
    particlesRef.current.forEach((particle) => {
      if (!prefersReducedMotion) {
        // Rotate around center
        particle.angle += (particle.speed / particle.distance) * speed * 0.5;

        // Pull inward
        particle.distance -= particle.inwardSpeed * pullStrength;

        // Reset when reaching center
        if (particle.distance < 10) {
          particle.distance = maxRadius;
          particle.angle = Math.random() * Math.PI * 2;
        }
      }

      const x = centerX + Math.cos(particle.angle) * particle.distance;
      const y = centerY + Math.sin(particle.angle) * particle.distance;

      // Draw trail
      const trailLength = 8;
      for (let t = 0; t < trailLength; t++) {
        const trailAngle = particle.angle - (t * 0.03 * particle.speed / particle.distance);
        const trailDistance = particle.distance + t * particle.inwardSpeed * 5;
        const tx = centerX + Math.cos(trailAngle) * trailDistance;
        const ty = centerY + Math.sin(trailAngle) * trailDistance;

        const trailOpacity = opacity * (1 - t / trailLength) * 0.3;
        const trailSize = particle.size * (1 - t / trailLength * 0.5);

        ctx.beginPath();
        ctx.arc(tx, ty, trailSize, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = trailOpacity;
        ctx.fill();
      }

      // Draw main particle
      ctx.beginPath();
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = opacity;
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(x, y, particle.size * 2, 0, Math.PI * 2);
      ctx.globalAlpha = opacity * 0.3;
      ctx.fill();
    });

    // Draw center core
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = opacity;
    ctx.fill();

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, pullStrength, sizeRatio, colors, opacity, prefersReducedMotion]);

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

export default ParticleVortex;
