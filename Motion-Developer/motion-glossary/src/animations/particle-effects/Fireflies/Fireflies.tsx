import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface FirefliesProps {
  /** Number of fireflies */
  fireflyCount?: number;
  /** Firefly glow size in pixels */
  glowSize?: number;
  /** Primary color */
  color?: string;
  /** Movement speed (0-1) */
  speed?: number;
  /** Blink frequency (0-1) */
  blinkSpeed?: number;
  /** Glow intensity (0-1) */
  glowIntensity?: number;
  /** Trail length (0-1) */
  trailLength?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Firefly {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  phase: number;
  blinkSpeed: number;
  brightness: number;
  targetX: number;
  targetY: number;
  trail: { x: number; y: number; alpha: number }[];
}

/**
 * Fireflies
 *
 * Magical glowing fireflies that drift and blink randomly.
 * Creates a warm, enchanted forest atmosphere.
 */
export const Fireflies: React.FC<FirefliesProps> = ({
  fireflyCount = 20,
  glowSize = 8,
  color = '#fef08a',
  speed = 0.3,
  blinkSpeed = 0.5,
  glowIntensity = 0.8,
  trailLength = 0.3,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firefliesRef = useRef<Firefly[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  // Initialize fireflies
  const initFireflies = useCallback((width: number, height: number) => {
    const fireflies: Firefly[] = [];
    for (let i = 0; i < fireflyCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      fireflies.push({
        x,
        y,
        size: glowSize * (0.5 + Math.random() * 0.5),
        speedX: 0,
        speedY: 0,
        phase: Math.random() * Math.PI * 2,
        blinkSpeed: (0.5 + Math.random() * 0.5) * blinkSpeed * 3,
        brightness: Math.random(),
        targetX: x + (Math.random() - 0.5) * 100,
        targetY: y + (Math.random() - 0.5) * 100,
        trail: [],
      });
    }
    firefliesRef.current = fireflies;
  }, [fireflyCount, glowSize, blinkSpeed]);

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

    // Update and draw fireflies
    firefliesRef.current.forEach((fly) => {
      if (!prefersReducedMotion) {
        // Move toward target with easing
        const dx = fly.targetX - fly.x;
        const dy = fly.targetY - fly.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        fly.speedX += (dx * 0.001) * speed;
        fly.speedY += (dy * 0.001) * speed;

        // Apply damping
        fly.speedX *= 0.98;
        fly.speedY *= 0.98;

        fly.x += fly.speedX;
        fly.y += fly.speedY;

        // Update trail
        if (trailLength > 0) {
          fly.trail.unshift({ x: fly.x, y: fly.y, alpha: 1 });
          const maxTrailLength = Math.floor(trailLength * 20);
          if (fly.trail.length > maxTrailLength) {
            fly.trail.pop();
          }
          fly.trail.forEach((point, i) => {
            point.alpha = 1 - (i / maxTrailLength);
          });
        }

        // Pick new target occasionally or when close
        if (dist < 10 || Math.random() < 0.005) {
          fly.targetX = fly.x + (Math.random() - 0.5) * 150;
          fly.targetY = fly.y + (Math.random() - 0.5) * 150;

          // Keep in bounds
          fly.targetX = Math.max(50, Math.min(width - 50, fly.targetX));
          fly.targetY = Math.max(50, Math.min(height - 50, fly.targetY));
        }

        // Update brightness with random blink pattern
        const blink = Math.sin(timeRef.current * fly.blinkSpeed + fly.phase);
        const randomFlicker = Math.random() > 0.98 ? 0.5 : 0;
        fly.brightness = Math.max(0, blink * 0.5 + 0.5 - randomFlicker);

        // Keep in bounds
        if (fly.x < 0) fly.x = 0;
        if (fly.x > width) fly.x = width;
        if (fly.y < 0) fly.y = 0;
        if (fly.y > height) fly.y = height;
      }

      // Draw trail
      if (trailLength > 0) {
        fly.trail.forEach((point, i) => {
          if (i === 0) return;
          const trailAlpha = point.alpha * fly.brightness * glowIntensity * 0.3;
          ctx.beginPath();
          ctx.arc(point.x, point.y, fly.size * 0.5 * point.alpha, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = trailAlpha;
          ctx.fill();
        });
      }

      // Draw outer glow
      const gradient = ctx.createRadialGradient(
        fly.x, fly.y, 0,
        fly.x, fly.y, fly.size * 3
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.3, color);
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(fly.x, fly.y, fly.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.globalAlpha = fly.brightness * glowIntensity * 0.4;
      ctx.fill();

      // Draw core
      ctx.beginPath();
      ctx.arc(fly.x, fly.y, fly.size * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = fly.brightness * glowIntensity;
      ctx.fill();

      // Draw main glow
      ctx.beginPath();
      ctx.arc(fly.x, fly.y, fly.size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = fly.brightness * glowIntensity * 0.8;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [color, speed, glowIntensity, trailLength, prefersReducedMotion]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    initFireflies(canvas.width, canvas.height);
  }, [initFireflies]);

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
      initFireflies(canvas.width, canvas.height);
    }
  }, [fireflyCount, glowSize, blinkSpeed, initFireflies]);

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

export default Fireflies;

export const firefliesCode = `import { useRef, useEffect } from 'react';

const Fireflies = ({
  fireflyCount = 20,
  glowSize = 8,
  color = '#fef08a',
  speed = 0.3,
  blinkSpeed = 0.5,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let time = 0;

    const fireflies = Array.from({ length: fireflyCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      targetX: Math.random() * canvas.width,
      targetY: Math.random() * canvas.height,
      phase: Math.random() * Math.PI * 2,
      size: glowSize * (0.5 + Math.random() * 0.5),
    }));

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      fireflies.forEach(fly => {
        // Move toward target
        fly.x += (fly.targetX - fly.x) * 0.01 * speed;
        fly.y += (fly.targetY - fly.y) * 0.01 * speed;

        // Pick new target occasionally
        if (Math.random() < 0.005) {
          fly.targetX = Math.random() * canvas.width;
          fly.targetY = Math.random() * canvas.height;
        }

        const brightness = Math.sin(time * blinkSpeed * 3 + fly.phase) * 0.5 + 0.5;

        // Draw glow
        const gradient = ctx.createRadialGradient(
          fly.x, fly.y, 0, fly.x, fly.y, fly.size * 3
        );
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(fly.x, fly.y, fly.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = brightness * 0.6;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} />;
};`;
