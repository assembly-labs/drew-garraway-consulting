import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface SolarFlareProps {
  /** Number of flare particles */
  particleCount?: number;
  /** Flare colors */
  colors?: string[];
  /** Eruption frequency (0-1) */
  frequency?: number;
  /** Flare intensity (0-1) */
  intensity?: number;
  /** Sun size ratio (0-1) */
  sunSize?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface FlareParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  gravity: number;
}

/**
 * SolarFlare
 *
 * Dramatic solar surface eruption effect with plasma ejections.
 * Creates an energetic, fiery atmosphere.
 */
export const SolarFlare: React.FC<SolarFlareProps> = ({
  particleCount = 100,
  colors = ['#fef08a', '#fbbf24', '#f97316', '#ef4444', '#dc2626'],
  frequency = 0.5,
  intensity = 0.7,
  sunSize = 0.3,
  opacity = 0.9,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<FlareParticle[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const createFlareParticle = useCallback((centerX: number, centerY: number, sunRadius: number): FlareParticle => {
    const angle = Math.random() * Math.PI - Math.PI / 2; // Upper hemisphere
    const speed = 2 + Math.random() * 6 * intensity;

    return {
      x: centerX + Math.cos(angle) * sunRadius,
      y: centerY + Math.sin(angle) * sunRadius,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      maxLife: 60 + Math.random() * 60,
      gravity: 0.02 + Math.random() * 0.03,
    };
  }, [colors, intensity]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height * 0.7;
    const sunRadius = Math.min(width, height) * sunSize;

    if (!prefersReducedMotion) {
      timeRef.current += 0.016;
    }

    ctx.clearRect(0, 0, width, height);

    // Spawn new particles
    if (!prefersReducedMotion && Math.random() < frequency * 0.3) {
      for (let i = 0; i < 3; i++) {
        if (particlesRef.current.length < particleCount) {
          particlesRef.current.push(createFlareParticle(centerX, centerY, sunRadius));
        }
      }
    }

    // Draw corona glow
    const coronaGradient = ctx.createRadialGradient(
      centerX, centerY, sunRadius * 0.8,
      centerX, centerY, sunRadius * 2
    );
    coronaGradient.addColorStop(0, 'rgba(255, 200, 100, 0.4)');
    coronaGradient.addColorStop(0.3, 'rgba(255, 150, 50, 0.2)');
    coronaGradient.addColorStop(0.6, 'rgba(255, 100, 50, 0.1)');
    coronaGradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(centerX, centerY, sunRadius * 2, 0, Math.PI * 2);
    ctx.fillStyle = coronaGradient;
    ctx.globalAlpha = opacity;
    ctx.fill();

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      if (!prefersReducedMotion) {
        particle.vy += particle.gravity;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life += 1;
      }

      if (particle.life > particle.maxLife) return false;

      const lifeRatio = 1 - particle.life / particle.maxLife;
      const currentOpacity = opacity * lifeRatio;
      const currentSize = particle.size * lifeRatio;

      // Draw particle trail
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = currentOpacity;
      ctx.fill();

      // Glow effect
      const glowGradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, currentSize * 3
      );
      glowGradient.addColorStop(0, particle.color);
      glowGradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, currentSize * 3, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.globalAlpha = currentOpacity * 0.5;
      ctx.fill();

      return true;
    });

    // Draw sun surface
    const sunGradient = ctx.createRadialGradient(
      centerX - sunRadius * 0.3, centerY - sunRadius * 0.3, 0,
      centerX, centerY, sunRadius
    );
    sunGradient.addColorStop(0, '#fffbeb');
    sunGradient.addColorStop(0.3, '#fef08a');
    sunGradient.addColorStop(0.6, '#fbbf24');
    sunGradient.addColorStop(0.8, '#f97316');
    sunGradient.addColorStop(1, '#ef4444');

    ctx.beginPath();
    ctx.arc(centerX, centerY, sunRadius, 0, Math.PI * 2);
    ctx.fillStyle = sunGradient;
    ctx.globalAlpha = 1;
    ctx.fill();

    // Surface texture
    for (let i = 0; i < 20; i++) {
      const spotAngle = Math.random() * Math.PI * 2;
      const spotDist = Math.random() * sunRadius * 0.8;
      const spotX = centerX + Math.cos(spotAngle) * spotDist;
      const spotY = centerY + Math.sin(spotAngle) * spotDist;
      const spotSize = 5 + Math.random() * 15;

      ctx.beginPath();
      ctx.arc(spotX, spotY, spotSize, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200, 100, 50, 0.3)';
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [sunSize, frequency, opacity, particleCount, createFlareParticle, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    particlesRef.current = [];
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

export default SolarFlare;
