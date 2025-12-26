import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface NoiseFieldProps {
  /** Number of particles */
  particleCount?: number;
  /** Particle colors */
  colors?: string[];
  /** Flow speed (0-1) */
  speed?: number;
  /** Noise scale (affects pattern size) */
  noiseScale?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Show flow lines */
  showLines?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface FlowParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  history: { x: number; y: number }[];
  maxHistory: number;
}

/**
 * NoiseField
 *
 * Perlin-like noise flow field with particles following the flow.
 * Creates an organic, fluid motion pattern.
 */
export const NoiseField: React.FC<NoiseFieldProps> = ({
  particleCount = 300,
  colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
  speed = 0.4,
  noiseScale = 0.005,
  opacity = 0.6,
  showLines = true,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<FlowParticle[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  // Simple noise function (simplex-like approximation)
  const noise = useCallback((x: number, y: number, t: number) => {
    const sin1 = Math.sin(x * 0.01 + t);
    const sin2 = Math.sin(y * 0.01 + t * 0.5);
    const sin3 = Math.sin((x + y) * 0.01 + t * 0.3);
    const sin4 = Math.sin(Math.sqrt(x * x + y * y) * 0.01 + t * 0.7);

    return (sin1 + sin2 + sin3 + sin4) / 4;
  }, []);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: FlowParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        history: [],
        maxHistory: showLines ? 20 : 0,
      });
    }

    particlesRef.current = particles;
  }, [particleCount, colors, showLines]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    if (!prefersReducedMotion) {
      timeRef.current += 0.016 * speed;
    }

    ctx.clearRect(0, 0, width, height);

    particlesRef.current.forEach((particle) => {
      if (!prefersReducedMotion) {
        // Calculate flow direction from noise
        const angle = noise(
          particle.x * noiseScale * 100,
          particle.y * noiseScale * 100,
          timeRef.current
        ) * Math.PI * 4;

        // Move particle along flow
        const vx = Math.cos(angle) * 2 * speed;
        const vy = Math.sin(angle) * 2 * speed;

        // Store history for trails
        if (showLines && particle.history.length < particle.maxHistory) {
          particle.history.push({ x: particle.x, y: particle.y });
        } else if (showLines) {
          particle.history.shift();
          particle.history.push({ x: particle.x, y: particle.y });
        }

        particle.x += vx;
        particle.y += vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;
      }

      // Draw trail
      if (showLines && particle.history.length > 1) {
        ctx.beginPath();
        ctx.moveTo(particle.history[0].x, particle.history[0].y);

        for (let i = 1; i < particle.history.length; i++) {
          ctx.lineTo(particle.history[i].x, particle.history[i].y);
        }
        ctx.lineTo(particle.x, particle.y);

        ctx.strokeStyle = particle.color;
        ctx.lineWidth = particle.size * 0.5;
        ctx.lineCap = 'round';
        ctx.globalAlpha = opacity * 0.3;
        ctx.stroke();
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
  }, [speed, noiseScale, opacity, showLines, noise, prefersReducedMotion]);

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

export default NoiseField;
