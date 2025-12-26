import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface CosmicDustProps {
  /** Number of dust particles */
  particleCount?: number;
  /** Dust cloud colors */
  colors?: string[];
  /** Drift speed (0-1) */
  speed?: number;
  /** Particle size range */
  sizeRange?: [number, number];
  /** Cloud density (0-1) */
  density?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Blur amount */
  blur?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface DustParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

/**
 * CosmicDust
 *
 * Drifting interstellar dust clouds with subtle color variations.
 * Creates an ethereal space atmosphere.
 */
export const CosmicDust: React.FC<CosmicDustProps> = ({
  particleCount = 100,
  colors = ['#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#ec4899'],
  speed = 0.15,
  sizeRange = [2, 8],
  density = 0.5,
  opacity = 0.4,
  blur = 2,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<DustParticle[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initParticles = useCallback((width: number, height: number) => {
    const particles: DustParticle[] = [];

    for (let i = 0; i < particleCount * density; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: 0.3 + Math.random() * 0.7,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.5 + Math.random() * 1.5,
      });
    }

    particlesRef.current = particles;
  }, [particleCount, colors, sizeRange, density]);

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

    // Apply blur filter for dreamy effect
    if (blur > 0) {
      ctx.filter = `blur(${blur}px)`;
    }

    particlesRef.current.forEach((particle) => {
      if (!prefersReducedMotion) {
        particle.x += particle.vx * speed;
        particle.y += particle.vy * speed;

        // Wrap around edges
        if (particle.x < -particle.size) particle.x = width + particle.size;
        if (particle.x > width + particle.size) particle.x = -particle.size;
        if (particle.y < -particle.size) particle.y = height + particle.size;
        if (particle.y > height + particle.size) particle.y = -particle.size;

        particle.pulse += particle.pulseSpeed * 0.016;
      }

      const pulseOpacity = 0.5 + Math.sin(particle.pulse) * 0.5;
      const currentOpacity = opacity * particle.opacity * pulseOpacity;

      // Draw dust particle with glow
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size
      );
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(0.5, particle.color);
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.globalAlpha = currentOpacity;
      ctx.fill();
    });

    ctx.filter = 'none';
    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, opacity, blur, prefersReducedMotion]);

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

export default CosmicDust;
