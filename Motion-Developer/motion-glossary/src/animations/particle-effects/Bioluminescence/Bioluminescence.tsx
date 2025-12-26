import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface BioluminescenceProps {
  /** Number of glowing organisms */
  organismCount?: number;
  /** Glow colors */
  colors?: string[];
  /** Movement speed (0-1) */
  speed?: number;
  /** Pulse frequency (0-1) */
  pulseFrequency?: number;
  /** Glow intensity (0-1) */
  glowIntensity?: number;
  /** Size range */
  sizeRange?: [number, number];
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Organism {
  x: number;
  y: number;
  size: number;
  color: string;
  phase: number;
  phaseSpeed: number;
  vx: number;
  vy: number;
  glowRadius: number;
  pulseOffset: number;
}

/**
 * Bioluminescence
 *
 * Deep-sea bioluminescent organisms with pulsing glow effects.
 * Creates an ethereal underwater atmosphere.
 */
export const Bioluminescence: React.FC<BioluminescenceProps> = ({
  organismCount = 40,
  colors = ['#06b6d4', '#22d3ee', '#67e8f9', '#0ea5e9', '#38bdf8'],
  speed = 0.15,
  pulseFrequency = 0.5,
  glowIntensity = 0.8,
  sizeRange = [2, 6],
  opacity = 0.9,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const organismsRef = useRef<Organism[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initOrganisms = useCallback((width: number, height: number) => {
    const organisms: Organism[] = [];

    for (let i = 0; i < organismCount; i++) {
      const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
      organisms.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.5 + Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        glowRadius: size * (4 + Math.random() * 4),
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    organismsRef.current = organisms;
  }, [organismCount, colors, sizeRange]);

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

    organismsRef.current.forEach((org) => {
      if (!prefersReducedMotion) {
        // Organic wandering movement
        org.phase += org.phaseSpeed * 0.016;
        org.vx += (Math.random() - 0.5) * 0.02;
        org.vy += (Math.random() - 0.5) * 0.02;
        org.vx *= 0.99;
        org.vy *= 0.99;

        org.x += org.vx * speed * 10;
        org.y += org.vy * speed * 10;

        // Wrap around
        if (org.x < -org.glowRadius) org.x = width + org.glowRadius;
        if (org.x > width + org.glowRadius) org.x = -org.glowRadius;
        if (org.y < -org.glowRadius) org.y = height + org.glowRadius;
        if (org.y > height + org.glowRadius) org.y = -org.glowRadius;
      }

      // Calculate pulse
      const pulse = 0.3 + Math.sin(timeRef.current * pulseFrequency * 5 + org.pulseOffset) * 0.7;
      const currentGlow = org.glowRadius * (0.8 + pulse * 0.4);
      const currentOpacity = opacity * pulse;

      // Draw outer glow
      const gradient = ctx.createRadialGradient(
        org.x, org.y, 0,
        org.x, org.y, currentGlow
      );
      gradient.addColorStop(0, org.color);
      gradient.addColorStop(0.2, org.color);
      gradient.addColorStop(0.5, `${org.color}80`);
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(org.x, org.y, currentGlow, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.globalAlpha = currentOpacity * glowIntensity;
      ctx.fill();

      // Draw bright core
      ctx.beginPath();
      ctx.arc(org.x, org.y, org.size * pulse, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = currentOpacity;
      ctx.fill();

      // Draw organism body
      ctx.beginPath();
      ctx.arc(org.x, org.y, org.size * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = org.color;
      ctx.globalAlpha = currentOpacity * 0.8;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, pulseFrequency, glowIntensity, opacity, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initOrganisms(canvas.width, canvas.height);
  }, [initOrganisms]);

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

export default Bioluminescence;
