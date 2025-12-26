import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface PollenDriftProps {
  /** Number of pollen particles */
  particleCount?: number;
  /** Pollen color */
  color?: string;
  /** Drift speed (0-1) */
  speed?: number;
  /** Size range */
  sizeRange?: [number, number];
  /** Vertical drift range (0-1) */
  verticalDrift?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Show glow effect */
  showGlow?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface PollenParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  phase: number;
  phaseSpeed: number;
  glowSize: number;
}

/**
 * PollenDrift
 *
 * Gentle floating pollen particles drifting in the air.
 * Creates a warm, sunlit atmosphere.
 */
export const PollenDrift: React.FC<PollenDriftProps> = ({
  particleCount = 60,
  color = '#fef08a',
  speed = 0.2,
  sizeRange = [1, 3],
  verticalDrift = 0.3,
  opacity = 0.7,
  showGlow = true,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<PollenParticle[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initParticles = useCallback((width: number, height: number) => {
    const particles: PollenParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * verticalDrift,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.5 + Math.random() * 1.5,
        glowSize: 3 + Math.random() * 4,
      });
    }

    particlesRef.current = particles;
  }, [particleCount, sizeRange, verticalDrift]);

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

    particlesRef.current.forEach((particle) => {
      if (!prefersReducedMotion) {
        particle.phase += particle.phaseSpeed * 0.016;

        const waveX = Math.sin(particle.phase) * 0.5;
        const waveY = Math.cos(particle.phase * 0.7) * 0.3;

        particle.x += (particle.speedX + waveX) * speed;
        particle.y += (particle.speedY + waveY) * speed * verticalDrift;

        // Wrap around
        if (particle.x > width + particle.size) particle.x = -particle.size;
        if (particle.x < -particle.size) particle.x = width + particle.size;
        if (particle.y > height + particle.size) particle.y = -particle.size;
        if (particle.y < -particle.size) particle.y = height + particle.size;
      }

      const pulseOpacity = 0.7 + Math.sin(particle.phase * 2) * 0.3;

      // Draw glow
      if (showGlow) {
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.glowSize
        );
        glowGradient.addColorStop(0, color);
        glowGradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.glowSize, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.globalAlpha = opacity * pulseOpacity * 0.3;
        ctx.fill();
      }

      // Draw pollen particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity * pulseOpacity;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, verticalDrift, opacity, color, showGlow, prefersReducedMotion]);

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

export default PollenDrift;
