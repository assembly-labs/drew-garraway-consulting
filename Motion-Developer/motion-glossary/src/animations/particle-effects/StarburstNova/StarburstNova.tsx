import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface StarburstNovaProps {
  /** Number of burst rays */
  rayCount?: number;
  /** Particles per ray */
  particlesPerRay?: number;
  /** Nova colors */
  colors?: string[];
  /** Expansion speed (0-1) */
  speed?: number;
  /** Burst frequency (0-1) */
  frequency?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface NovaParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  rayIndex: number;
}

interface NovaBurst {
  x: number;
  y: number;
  particles: NovaParticle[];
  age: number;
}

/**
 * StarburstNova
 *
 * Expanding starburst explosions that periodically burst across the screen.
 * Creates dramatic cosmic explosion effects.
 */
export const StarburstNova: React.FC<StarburstNovaProps> = ({
  rayCount = 12,
  particlesPerRay = 8,
  colors = ['#ffffff', '#fef3c7', '#bfdbfe', '#c4b5fd', '#fbcfe8'],
  speed = 0.5,
  frequency = 0.3,
  opacity = 0.9,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const burstsRef = useRef<NovaBurst[]>([]);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const createBurst = useCallback((x: number, y: number): NovaBurst => {
    const particles: NovaParticle[] = [];

    for (let ray = 0; ray < rayCount; ray++) {
      const baseAngle = (ray / rayCount) * Math.PI * 2;

      for (let p = 0; p < particlesPerRay; p++) {
        const angle = baseAngle + (Math.random() - 0.5) * 0.3;
        const baseSpeed = 3 + Math.random() * 5;
        const speedMultiplier = 1 - (p / particlesPerRay) * 0.5;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * baseSpeed * speedMultiplier,
          vy: Math.sin(angle) * baseSpeed * speedMultiplier,
          size: 2 + Math.random() * 4 - p * 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 0,
          maxLife: 80 + Math.random() * 40,
          rayIndex: ray,
        });
      }
    }

    return { x, y, particles, age: 0 };
  }, [rayCount, particlesPerRay, colors]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Spawn new bursts
    if (!prefersReducedMotion && Math.random() < frequency * 0.02) {
      const x = width * 0.2 + Math.random() * width * 0.6;
      const y = height * 0.2 + Math.random() * height * 0.6;
      burstsRef.current.push(createBurst(x, y));
    }

    // Update and draw bursts
    burstsRef.current = burstsRef.current.filter((burst) => {
      burst.age++;

      // Draw burst center glow
      const burstLife = Math.min(burst.age / 20, 1);
      const fadeOut = Math.max(0, 1 - burst.age / 100);

      if (fadeOut > 0) {
        const centerGlow = ctx.createRadialGradient(
          burst.x, burst.y, 0,
          burst.x, burst.y, 50 * burstLife
        );
        centerGlow.addColorStop(0, `rgba(255, 255, 255, ${opacity * fadeOut})`);
        centerGlow.addColorStop(0.3, `rgba(255, 250, 220, ${opacity * fadeOut * 0.5})`);
        centerGlow.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(burst.x, burst.y, 50 * burstLife, 0, Math.PI * 2);
        ctx.fillStyle = centerGlow;
        ctx.fill();
      }

      // Update and draw particles
      let activeParticles = 0;
      burst.particles.forEach((particle) => {
        if (!prefersReducedMotion) {
          particle.x += particle.vx * speed;
          particle.y += particle.vy * speed;
          particle.vx *= 0.98;
          particle.vy *= 0.98;
          particle.life++;
        }

        if (particle.life >= particle.maxLife) return;
        activeParticles++;

        const lifeRatio = 1 - particle.life / particle.maxLife;
        const currentOpacity = opacity * lifeRatio;
        const currentSize = particle.size * (0.5 + lifeRatio * 0.5);

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = currentOpacity;
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize * 2.5, 0, Math.PI * 2);
        ctx.globalAlpha = currentOpacity * 0.3;
        ctx.fill();

        // Trail
        const trailX = particle.x - particle.vx * 3;
        const trailY = particle.y - particle.vy * 3;

        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(trailX, trailY);
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = currentSize * 0.5;
        ctx.globalAlpha = currentOpacity * 0.5;
        ctx.stroke();
      });

      return activeParticles > 0;
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, frequency, opacity, createBurst, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  }, []);

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

export default StarburstNova;
