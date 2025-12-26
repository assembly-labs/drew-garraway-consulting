import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface RisingEmbersProps {
  /** Number of embers */
  emberCount?: number;
  /** Maximum ember size in pixels */
  maxSize?: number;
  /** Array of ember colors (gradient from hot to cool) */
  colors?: string[];
  /** Rise speed (0-1) */
  speed?: number;
  /** Sway amount (0-1) */
  sway?: number;
  /** Fade speed as embers rise (0-1) */
  fadeSpeed?: number;
  /** Glow intensity (0-1) */
  glowIntensity?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Ember {
  x: number;
  y: number;
  size: number;
  color: string;
  speedY: number;
  swayOffset: number;
  swaySpeed: number;
  life: number;
  maxLife: number;
  flickerOffset: number;
  flickerSpeed: number;
}

/**
 * RisingEmbers
 *
 * Glowing ember particles that rise and fade like sparks from a fire.
 * Creates a warm, cozy atmosphere or dramatic fire effect.
 */
export const RisingEmbers: React.FC<RisingEmbersProps> = ({
  emberCount = 40,
  maxSize = 4,
  colors = ['#fef08a', '#fbbf24', '#f97316', '#ef4444', '#dc2626'],
  speed = 0.5,
  sway = 0.5,
  fadeSpeed = 0.5,
  glowIntensity = 0.7,
  opacity = 0.9,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const embersRef = useRef<Ember[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  // Create new ember
  const createEmber = useCallback((width: number, height: number): Ember => {
    const colorIndex = Math.floor(Math.random() * colors.length);
    return {
      x: Math.random() * width,
      y: height + Math.random() * 50,
      size: Math.random() * maxSize + 1,
      color: colors[colorIndex],
      speedY: (0.5 + Math.random() * 0.5) * speed * 2,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: (0.5 + Math.random() * 0.5) * 3,
      life: 1,
      maxLife: 0.5 + Math.random() * 0.5,
      flickerOffset: Math.random() * Math.PI * 2,
      flickerSpeed: 5 + Math.random() * 10,
    };
  }, [colors, maxSize, speed]);

  // Initialize embers
  const initEmbers = useCallback((width: number, height: number) => {
    const embers: Ember[] = [];
    for (let i = 0; i < emberCount; i++) {
      const ember = createEmber(width, height);
      // Spread initial embers throughout the canvas
      ember.y = Math.random() * height;
      ember.life = Math.random();
      embers.push(ember);
    }
    embersRef.current = embers;
  }, [emberCount, createEmber]);

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

    // Update and draw embers
    embersRef.current.forEach((ember, index) => {
      if (!prefersReducedMotion) {
        // Rise
        ember.y -= ember.speedY;

        // Sway
        const swayAmount = Math.sin(timeRef.current * ember.swaySpeed + ember.swayOffset) * sway * 20;
        ember.x += swayAmount * 0.05;

        // Fade out based on height
        const heightProgress = 1 - ember.y / height;
        ember.life = Math.max(0, ember.maxLife - heightProgress * fadeSpeed);

        // Reset when off top or faded
        if (ember.y < -ember.size * 4 || ember.life <= 0) {
          embersRef.current[index] = createEmber(width, height);
          return;
        }
      }

      // Calculate flicker
      let currentOpacity = opacity * ember.life;
      if (!prefersReducedMotion) {
        const flicker = Math.sin(timeRef.current * ember.flickerSpeed + ember.flickerOffset);
        currentOpacity *= 0.7 + flicker * 0.3;
      }

      // Draw glow
      if (glowIntensity > 0) {
        const glowRadius = ember.size * 4;
        const gradient = ctx.createRadialGradient(
          ember.x, ember.y, 0,
          ember.x, ember.y, glowRadius
        );
        gradient.addColorStop(0, ember.color);
        gradient.addColorStop(0.3, ember.color + Math.round(0.5 * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(ember.x, ember.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = currentOpacity * glowIntensity;
        ctx.fill();
      }

      // Draw core
      ctx.beginPath();
      ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = currentOpacity;
      ctx.fill();

      // Draw colored part
      ctx.beginPath();
      ctx.arc(ember.x, ember.y, ember.size * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = ember.color;
      ctx.globalAlpha = currentOpacity * 0.8;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [opacity, sway, fadeSpeed, glowIntensity, createEmber, prefersReducedMotion]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    initEmbers(canvas.width, canvas.height);
  }, [initEmbers]);

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
      initEmbers(canvas.width, canvas.height);
    }
  }, [emberCount, maxSize, colors, speed, initEmbers]);

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

export default RisingEmbers;

export const risingEmbersCode = `import { useRef, useEffect } from 'react';

const RisingEmbers = ({
  emberCount = 40,
  colors = ['#fef08a', '#fbbf24', '#f97316', '#ef4444'],
  speed = 0.5,
  sway = 0.5,
  opacity = 0.9,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let time = 0;

    const createEmber = () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 50,
      size: Math.random() * 4 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: (0.5 + Math.random() * 0.5) * speed * 2,
      swayOffset: Math.random() * Math.PI * 2,
      life: 1,
    });

    const embers = Array.from({ length: emberCount }, createEmber);

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      embers.forEach((ember, i) => {
        ember.y -= ember.speedY;
        ember.x += Math.sin(time * 3 + ember.swayOffset) * sway;
        ember.life = Math.max(0, 1 - (1 - ember.y / canvas.height) * 0.5);

        if (ember.y < -10 || ember.life <= 0) {
          embers[i] = createEmber();
          return;
        }

        // Glow
        const gradient = ctx.createRadialGradient(
          ember.x, ember.y, 0, ember.x, ember.y, ember.size * 4
        );
        gradient.addColorStop(0, ember.color);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = opacity * ember.life * 0.5;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = opacity * ember.life;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} />;
};`;
