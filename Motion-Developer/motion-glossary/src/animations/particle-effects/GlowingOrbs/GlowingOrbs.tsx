import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface GlowingOrbsProps {
  /** Number of orbs */
  orbCount?: number;
  /** Minimum orb size in pixels */
  minSize?: number;
  /** Maximum orb size in pixels */
  maxSize?: number;
  /** Array of colors for orbs */
  colors?: string[];
  /** Movement speed (0-1) */
  speed?: number;
  /** Glow intensity (0-1) */
  glowIntensity?: number;
  /** Pulse speed (0-1) */
  pulseSpeed?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Blur amount in pixels */
  blur?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Orb {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  pulseOffset: number;
  pulseSpeed: number;
}

/**
 * GlowingOrbs
 *
 * Soft, ethereal glowing spheres that float and pulse gently.
 * Perfect for creating dreamy, ambient background effects.
 */
export const GlowingOrbs: React.FC<GlowingOrbsProps> = ({
  orbCount = 8,
  minSize = 50,
  maxSize = 150,
  colors = ['#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#10b981'],
  speed = 0.2,
  glowIntensity = 0.6,
  pulseSpeed = 0.3,
  opacity = 0.4,
  blur = 40,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbsRef = useRef<Orb[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  // Initialize orbs
  const initOrbs = useCallback((width: number, height: number) => {
    const orbs: Orb[] = [];
    for (let i = 0; i < orbCount; i++) {
      orbs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: minSize + Math.random() * (maxSize - minSize),
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * speed,
        speedY: (Math.random() - 0.5) * speed,
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: (0.5 + Math.random() * 0.5) * pulseSpeed,
      });
    }
    orbsRef.current = orbs;
  }, [orbCount, minSize, maxSize, colors, speed, pulseSpeed]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Update time
    if (!prefersReducedMotion) {
      timeRef.current += 0.016;
    }

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw orbs
    orbsRef.current.forEach((orb) => {
      // Update position (skip if reduced motion)
      if (!prefersReducedMotion) {
        orb.x += orb.speedX;
        orb.y += orb.speedY;

        // Wrap around edges with padding
        const padding = orb.size;
        if (orb.x < -padding) orb.x = width + padding;
        if (orb.x > width + padding) orb.x = -padding;
        if (orb.y < -padding) orb.y = height + padding;
        if (orb.y > height + padding) orb.y = -padding;
      }

      // Calculate pulse
      let currentSize = orb.size;
      let currentOpacity = opacity;
      if (!prefersReducedMotion) {
        const pulse = Math.sin(timeRef.current * orb.pulseSpeed + orb.pulseOffset);
        currentSize = orb.size * (0.9 + pulse * 0.1);
        currentOpacity = opacity * (0.7 + pulse * 0.3);
      }

      // Create radial gradient for glow effect
      const gradient = ctx.createRadialGradient(
        orb.x, orb.y, 0,
        orb.x, orb.y, currentSize
      );

      // Parse color and add transparency
      const baseColor = orb.color;
      gradient.addColorStop(0, `${baseColor}${Math.round(currentOpacity * glowIntensity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(0.4, `${baseColor}${Math.round(currentOpacity * glowIntensity * 0.5 * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `${baseColor}00`);

      ctx.beginPath();
      ctx.arc(orb.x, orb.y, currentSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [opacity, glowIntensity, prefersReducedMotion]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    initOrbs(canvas.width, canvas.height);
  }, [initOrbs]);

  // Setup
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

  // Re-init when props change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      initOrbs(canvas.width, canvas.height);
    }
  }, [orbCount, minSize, maxSize, colors, speed, pulseSpeed, initOrbs]);

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
        filter: `blur(${blur}px)`,
        ...style,
      }}
    />
  );
};

export default GlowingOrbs;

export const glowingOrbsCode = `import { useRef, useEffect } from 'react';

const GlowingOrbs = ({
  orbCount = 8,
  colors = ['#8b5cf6', '#6366f1', '#3b82f6'],
  speed = 0.2,
  opacity = 0.4,
  blur = 40,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let time = 0;

    // Initialize orbs
    const orbs = Array.from({ length: orbCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 50 + Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * speed,
      speedY: (Math.random() - 0.5) * speed,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      orbs.forEach(orb => {
        orb.x += orb.speedX;
        orb.y += orb.speedY;

        // Wrap around
        if (orb.x < -orb.size) orb.x = canvas.width + orb.size;
        if (orb.x > canvas.width + orb.size) orb.x = -orb.size;
        if (orb.y < -orb.size) orb.y = canvas.height + orb.size;
        if (orb.y > canvas.height + orb.size) orb.y = -orb.size;

        const pulse = Math.sin(time + orb.pulseOffset);
        const size = orb.size * (0.9 + pulse * 0.1);

        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0, orb.x, orb.y, size
        );
        gradient.addColorStop(0, orb.color + '66');
        gradient.addColorStop(1, orb.color + '00');

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ filter: \`blur(\${blur}px)\` }}
    />
  );
};`;
