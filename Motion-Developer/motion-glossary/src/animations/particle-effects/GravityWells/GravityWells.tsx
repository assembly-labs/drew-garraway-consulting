import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface GravityWellsProps {
  /** Number of gravity wells */
  wellCount?: number;
  /** Number of particles */
  particleCount?: number;
  /** Particle colors */
  colors?: string[];
  /** Gravity strength (0-1) */
  gravityStrength?: number;
  /** Animation speed (0-1) */
  speed?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface GravityWell {
  x: number;
  y: number;
  mass: number;
  color: string;
}

interface GravityParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

/**
 * GravityWells
 *
 * N-body gravity simulation with particles orbiting wells.
 * Creates a physics-based cosmic aesthetic.
 */
export const GravityWells: React.FC<GravityWellsProps> = ({
  wellCount = 3,
  particleCount = 150,
  colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981'],
  gravityStrength = 0.5,
  speed = 0.5,
  opacity = 0.8,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wellsRef = useRef<GravityWell[]>([]);
  const particlesRef = useRef<GravityParticle[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initSimulation = useCallback((width: number, height: number) => {
    const wells: GravityWell[] = [];
    const particles: GravityParticle[] = [];

    // Create gravity wells
    for (let i = 0; i < wellCount; i++) {
      wells.push({
        x: width * 0.2 + Math.random() * width * 0.6,
        y: height * 0.2 + Math.random() * height * 0.6,
        mass: 500 + Math.random() * 1000,
        color: colors[i % colors.length],
      });
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * Math.max(width, height) * 0.4;
      const well = wells[Math.floor(Math.random() * wells.length)];

      particles.push({
        x: well.x + Math.cos(angle) * distance,
        y: well.y + Math.sin(angle) * distance,
        vx: Math.sin(angle) * 2 * (Math.random() > 0.5 ? 1 : -1),
        vy: -Math.cos(angle) * 2 * (Math.random() > 0.5 ? 1 : -1),
        size: 1 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    wellsRef.current = wells;
    particlesRef.current = particles;
  }, [wellCount, particleCount, colors]);

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

    // Draw gravity wells
    wellsRef.current.forEach((well) => {
      const gradient = ctx.createRadialGradient(
        well.x, well.y, 0,
        well.x, well.y, well.mass * 0.1
      );
      gradient.addColorStop(0, well.color);
      gradient.addColorStop(0.3, well.color + '80');
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(well.x, well.y, well.mass * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.globalAlpha = opacity * 0.5;
      ctx.fill();

      // Well core
      ctx.beginPath();
      ctx.arc(well.x, well.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = opacity;
      ctx.fill();
    });

    // Update and draw particles
    particlesRef.current.forEach((particle) => {
      if (!prefersReducedMotion) {
        // Calculate gravitational force from all wells
        wellsRef.current.forEach((well) => {
          const dx = well.x - particle.x;
          const dy = well.y - particle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = 30;

          if (dist > minDist) {
            const force = (well.mass * gravityStrength) / (dist * dist);
            particle.vx += (dx / dist) * force * speed * 0.1;
            particle.vy += (dy / dist) * force * speed * 0.1;
          }
        });

        // Limit velocity
        const maxVel = 8;
        const vel = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (vel > maxVel) {
          particle.vx = (particle.vx / vel) * maxVel;
          particle.vy = (particle.vy / vel) * maxVel;
        }

        particle.x += particle.vx * speed;
        particle.y += particle.vy * speed;

        // Wrap around edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;
      }

      // Draw particle trail
      const trailLength = 5;
      for (let t = 0; t < trailLength; t++) {
        const tx = particle.x - particle.vx * t * 2;
        const ty = particle.y - particle.vy * t * 2;
        const trailOpacity = opacity * (1 - t / trailLength) * 0.3;

        ctx.beginPath();
        ctx.arc(tx, ty, particle.size * (1 - t / trailLength * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = trailOpacity;
        ctx.fill();
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = opacity;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [gravityStrength, speed, opacity, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initSimulation(canvas.width, canvas.height);
  }, [initSimulation]);

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

export default GravityWells;
