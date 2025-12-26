import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface InkBleedProps {
  /** Number of ink drops */
  dropCount?: number;
  /** Ink colors */
  colors?: string[];
  /** Spread speed (0-1) */
  speed?: number;
  /** Maximum spread size */
  maxSize?: number;
  /** Drop frequency (0-1) */
  frequency?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface InkDrop {
  x: number;
  y: number;
  size: number;
  maxSize: number;
  color: string;
  tentacles: { angle: number; length: number; speed: number; wobble: number }[];
  age: number;
  fadeStart: number;
}

/**
 * InkBleed
 *
 * Ink drops spreading and bleeding across the surface.
 * Creates an artistic, watercolor aesthetic.
 */
export const InkBleed: React.FC<InkBleedProps> = ({
  dropCount = 8,
  colors = ['#1e1b4b', '#312e81', '#4338ca', '#6366f1'],
  speed = 0.4,
  maxSize = 150,
  frequency = 0.3,
  opacity = 0.6,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<InkDrop[]>([]);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const createDrop = useCallback((x: number, y: number): InkDrop => {
    const tentacles = [];
    const tentacleCount = 6 + Math.floor(Math.random() * 6);

    for (let i = 0; i < tentacleCount; i++) {
      tentacles.push({
        angle: (i / tentacleCount) * Math.PI * 2 + Math.random() * 0.5,
        length: 0.5 + Math.random() * 0.5,
        speed: 0.8 + Math.random() * 0.4,
        wobble: Math.random() * Math.PI * 2,
      });
    }

    return {
      x,
      y,
      size: 0,
      maxSize: maxSize * (0.5 + Math.random() * 0.5),
      color: colors[Math.floor(Math.random() * colors.length)],
      tentacles,
      age: 0,
      fadeStart: 0.7 + Math.random() * 0.2,
    };
  }, [colors, maxSize]);

  const initDrops = useCallback((width: number, height: number) => {
    const drops: InkDrop[] = [];

    for (let i = 0; i < dropCount; i++) {
      drops.push(createDrop(
        Math.random() * width,
        Math.random() * height
      ));
    }

    dropsRef.current = drops;
  }, [dropCount, createDrop]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Semi-transparent clear for layering effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
    ctx.fillRect(0, 0, width, height);

    // Spawn new drops
    if (!prefersReducedMotion && Math.random() < frequency * 0.02) {
      if (dropsRef.current.length < dropCount * 2) {
        dropsRef.current.push(createDrop(
          Math.random() * width,
          Math.random() * height
        ));
      }
    }

    // Update and draw drops
    dropsRef.current = dropsRef.current.filter((drop) => {
      if (!prefersReducedMotion) {
        drop.size += (drop.maxSize - drop.size) * 0.02 * speed;
        drop.age += 0.005 * speed;

        drop.tentacles.forEach((t) => {
          t.wobble += 0.02;
        });
      }

      const fadeProgress = Math.max(0, (drop.age - drop.fadeStart) / (1 - drop.fadeStart));
      const currentOpacity = opacity * (1 - fadeProgress);

      if (currentOpacity <= 0.01) return false;

      // Draw main ink blob
      ctx.beginPath();

      drop.tentacles.forEach((tentacle, i) => {
        const wobbleOffset = Math.sin(tentacle.wobble) * 0.1;
        const angle = tentacle.angle + wobbleOffset;
        const length = drop.size * tentacle.length * tentacle.speed;

        const x = drop.x + Math.cos(angle) * length;
        const y = drop.y + Math.sin(angle) * length;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          // Use bezier curves for organic shape
          const prevTentacle = drop.tentacles[i - 1];
          const prevAngle = prevTentacle.angle + Math.sin(prevTentacle.wobble) * 0.1;
          const prevLength = drop.size * prevTentacle.length * prevTentacle.speed;
          const prevX = drop.x + Math.cos(prevAngle) * prevLength;
          const prevY = drop.y + Math.sin(prevAngle) * prevLength;

          const cpX = (prevX + x) / 2 + (Math.random() - 0.5) * 10;
          const cpY = (prevY + y) / 2 + (Math.random() - 0.5) * 10;

          ctx.quadraticCurveTo(cpX, cpY, x, y);
        }
      });

      ctx.closePath();

      // Fill with gradient
      const gradient = ctx.createRadialGradient(
        drop.x, drop.y, 0,
        drop.x, drop.y, drop.size
      );
      gradient.addColorStop(0, drop.color);
      gradient.addColorStop(0.6, drop.color + 'cc');
      gradient.addColorStop(1, drop.color + '00');

      ctx.fillStyle = gradient;
      ctx.globalAlpha = currentOpacity;
      ctx.fill();

      // Add darker center
      ctx.beginPath();
      ctx.arc(drop.x, drop.y, drop.size * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = drop.color;
      ctx.globalAlpha = currentOpacity * 0.5;
      ctx.fill();

      // Add water-like edge effects
      ctx.beginPath();
      drop.tentacles.forEach((tentacle) => {
        const wobbleOffset = Math.sin(tentacle.wobble + Math.PI) * 0.15;
        const angle = tentacle.angle + wobbleOffset;
        const length = drop.size * tentacle.length * tentacle.speed * 1.1;

        const x = drop.x + Math.cos(angle) * length;
        const y = drop.y + Math.sin(angle) * length;

        ctx.beginPath();
        ctx.arc(x, y, 2 + Math.random() * 3, 0, Math.PI * 2);
        ctx.fillStyle = drop.color;
        ctx.globalAlpha = currentOpacity * 0.3;
        ctx.fill();
      });

      return true;
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, frequency, dropCount, opacity, createDrop, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    // Clear to white
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    initDrops(canvas.width, canvas.height);
  }, [initDrops]);

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

export default InkBleed;
