import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface DigitalPortalProps {
  /** Number of portal rings */
  ringCount?: number;
  /** Portal colors */
  colors?: string[];
  /** Rotation speed (0-1) */
  speed?: number;
  /** Portal size ratio (0-1) */
  sizeRatio?: number;
  /** Particle density */
  particleDensity?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface PortalParticle {
  angle: number;
  radius: number;
  size: number;
  speed: number;
  color: string;
  depth: number;
}

/**
 * DigitalPortal
 *
 * Swirling digital vortex portal effect.
 * Creates a sci-fi dimensional gateway aesthetic.
 */
export const DigitalPortal: React.FC<DigitalPortalProps> = ({
  ringCount = 8,
  colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef'],
  speed = 0.4,
  sizeRatio = 0.35,
  particleDensity = 100,
  opacity = 0.8,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<PortalParticle[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initParticles = useCallback((width: number, height: number) => {
    const particles: PortalParticle[] = [];
    const maxRadius = Math.min(width, height) * sizeRatio;

    for (let i = 0; i < particleDensity; i++) {
      const depth = Math.random();
      const radiusRange = maxRadius * (0.3 + depth * 0.7);

      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: radiusRange,
        size: 1 + Math.random() * 3 * (1 - depth),
        speed: 0.5 + Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        depth,
      });
    }

    particlesRef.current = particles;
  }, [sizeRatio, particleDensity, colors]);

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

    // Draw portal rings
    for (let r = 0; r < ringCount; r++) {
      const ringRadius = maxRadius * ((r + 1) / ringCount);
      const ringOpacity = opacity * (1 - r / ringCount) * 0.3;
      const ringRotation = timeRef.current * speed * (r % 2 === 0 ? 1 : -1);

      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = colors[r % colors.length];
      ctx.lineWidth = 2;
      ctx.globalAlpha = ringOpacity;
      ctx.stroke();

      // Ring glow
      const glowGradient = ctx.createRadialGradient(
        centerX, centerY, ringRadius - 10,
        centerX, centerY, ringRadius + 10
      );
      glowGradient.addColorStop(0, 'transparent');
      glowGradient.addColorStop(0.5, colors[r % colors.length] + '40');
      glowGradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = glowGradient;
      ctx.lineWidth = 20;
      ctx.globalAlpha = ringOpacity;
      ctx.stroke();

      // Draw segments on ring
      const segmentCount = 8 + r * 2;
      for (let s = 0; s < segmentCount; s++) {
        const segAngle = (s / segmentCount) * Math.PI * 2 + ringRotation;
        const segX = centerX + Math.cos(segAngle) * ringRadius;
        const segY = centerY + Math.sin(segAngle) * ringRadius;

        ctx.beginPath();
        ctx.arc(segX, segY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = ringOpacity * 2;
        ctx.fill();
      }
    }

    // Draw center vortex
    const vortexGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, maxRadius * 0.4
    );
    vortexGradient.addColorStop(0, colors[0]);
    vortexGradient.addColorStop(0.3, colors[1] || colors[0]);
    vortexGradient.addColorStop(0.6, colors[2] || colors[0] + '80');
    vortexGradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = vortexGradient;
    ctx.globalAlpha = opacity * 0.5;
    ctx.fill();

    // Update and draw particles
    particlesRef.current.forEach((particle) => {
      if (!prefersReducedMotion) {
        particle.angle += particle.speed * speed * 0.02 * (1 + particle.depth);
        particle.radius -= 0.2 * speed;

        if (particle.radius < maxRadius * 0.1) {
          particle.radius = maxRadius;
          particle.angle = Math.random() * Math.PI * 2;
        }
      }

      const x = centerX + Math.cos(particle.angle) * particle.radius;
      const y = centerY + Math.sin(particle.angle) * particle.radius;

      // Particle trail
      const trailLength = 5;
      for (let t = 0; t < trailLength; t++) {
        const trailAngle = particle.angle - t * 0.05 * particle.speed;
        const trailRadius = particle.radius + t * 2;
        const tx = centerX + Math.cos(trailAngle) * trailRadius;
        const ty = centerY + Math.sin(trailAngle) * trailRadius;
        const trailOpacity = opacity * (1 - t / trailLength) * 0.3;

        ctx.beginPath();
        ctx.arc(tx, ty, particle.size * (1 - t / trailLength), 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = trailOpacity;
        ctx.fill();
      }

      // Main particle
      ctx.beginPath();
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = opacity * (1 - particle.depth * 0.5);
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(x, y, particle.size * 2, 0, Math.PI * 2);
      ctx.globalAlpha = opacity * 0.3;
      ctx.fill();
    });

    // Center bright point
    const centerGlow = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, 30
    );
    centerGlow.addColorStop(0, '#ffffff');
    centerGlow.addColorStop(0.3, colors[0]);
    centerGlow.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = centerGlow;
    ctx.globalAlpha = opacity;
    ctx.fill();

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [ringCount, colors, speed, sizeRatio, opacity, prefersReducedMotion]);

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

export default DigitalPortal;
