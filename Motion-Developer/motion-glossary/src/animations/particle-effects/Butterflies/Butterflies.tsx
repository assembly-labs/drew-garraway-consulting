import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface ButterfliesProps {
  /** Number of butterflies */
  butterflyCount?: number;
  /** Wing colors */
  colors?: string[];
  /** Flight speed (0-1) */
  speed?: number;
  /** Wing flap speed (0-1) */
  flapSpeed?: number;
  /** Size range */
  sizeRange?: [number, number];
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Butterfly {
  x: number;
  y: number;
  size: number;
  primaryColor: string;
  secondaryColor: string;
  rotation: number;
  flapPhase: number;
  flapSpeed: number;
  targetX: number;
  targetY: number;
  speed: number;
  wobble: number;
}

/**
 * Butterflies
 *
 * Graceful butterflies with realistic wing flapping motion.
 * Creates a whimsical garden atmosphere.
 */
export const Butterflies: React.FC<ButterfliesProps> = ({
  butterflyCount = 12,
  colors = ['#f472b6', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24'],
  speed = 0.3,
  flapSpeed = 0.8,
  sizeRange = [15, 30],
  opacity = 0.9,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const butterfliesRef = useRef<Butterfly[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initButterflies = useCallback((width: number, height: number) => {
    const butterflies: Butterfly[] = [];

    for (let i = 0; i < butterflyCount; i++) {
      const colorIndex = Math.floor(Math.random() * colors.length);
      butterflies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
        primaryColor: colors[colorIndex],
        secondaryColor: colors[(colorIndex + 1) % colors.length],
        rotation: Math.random() * Math.PI * 2,
        flapPhase: Math.random() * Math.PI * 2,
        flapSpeed: 8 + Math.random() * 6,
        targetX: Math.random() * width,
        targetY: Math.random() * height,
        speed: 0.5 + Math.random() * 1.5,
        wobble: Math.random() * Math.PI * 2,
      });
    }

    butterfliesRef.current = butterflies;
  }, [butterflyCount, colors, sizeRange]);

  const drawButterfly = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    rotation: number,
    flapAngle: number,
    primaryColor: string,
    secondaryColor: string,
    currentOpacity: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    const wingScale = Math.cos(flapAngle);

    // Draw wings
    [-1, 1].forEach((side) => {
      ctx.save();
      ctx.scale(side * wingScale, 1);

      // Upper wing
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        size * 0.8, -size * 0.6,
        size * 1.2, -size * 0.3,
        size * 0.9, size * 0.2
      );
      ctx.bezierCurveTo(
        size * 0.5, size * 0.1,
        size * 0.2, 0,
        0, 0
      );

      const upperGradient = ctx.createRadialGradient(
        size * 0.4, -size * 0.2, 0,
        size * 0.4, -size * 0.2, size
      );
      upperGradient.addColorStop(0, primaryColor);
      upperGradient.addColorStop(0.5, primaryColor);
      upperGradient.addColorStop(1, secondaryColor);

      ctx.fillStyle = upperGradient;
      ctx.globalAlpha = currentOpacity;
      ctx.fill();

      // Wing pattern
      ctx.beginPath();
      ctx.arc(size * 0.5, -size * 0.15, size * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = currentOpacity * 0.5;
      ctx.fill();

      // Lower wing
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        size * 0.6, size * 0.3,
        size * 0.8, size * 0.8,
        size * 0.4, size * 0.9
      );
      ctx.bezierCurveTo(
        size * 0.2, size * 0.6,
        0, size * 0.3,
        0, 0
      );

      ctx.fillStyle = secondaryColor;
      ctx.globalAlpha = currentOpacity * 0.9;
      ctx.fill();

      ctx.restore();
    });

    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.08, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#1f2937';
    ctx.globalAlpha = currentOpacity;
    ctx.fill();

    // Antennae
    [-1, 1].forEach((side) => {
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.35);
      ctx.quadraticCurveTo(
        side * size * 0.15, -size * 0.5,
        side * size * 0.1, -size * 0.6
      );
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 1;
      ctx.globalAlpha = currentOpacity;
      ctx.stroke();

      // Antenna tips
      ctx.beginPath();
      ctx.arc(side * size * 0.1, -size * 0.6, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  };

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

    butterfliesRef.current.forEach((butterfly) => {
      if (!prefersReducedMotion) {
        butterfly.flapPhase += butterfly.flapSpeed * flapSpeed * 0.1;
        butterfly.wobble += 0.02;

        // Move towards target
        const dx = butterfly.targetX - butterfly.x;
        const dy = butterfly.targetY - butterfly.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 50) {
          butterfly.targetX = Math.random() * width;
          butterfly.targetY = Math.random() * height;
        }

        butterfly.rotation = Math.atan2(dy, dx);
        butterfly.x += (dx / dist) * butterfly.speed * speed;
        butterfly.y += (dy / dist) * butterfly.speed * speed;
        butterfly.y += Math.sin(butterfly.wobble) * 0.5;
      }

      drawButterfly(
        ctx,
        butterfly.x,
        butterfly.y,
        butterfly.size,
        butterfly.rotation,
        butterfly.flapPhase,
        butterfly.primaryColor,
        butterfly.secondaryColor,
        opacity
      );
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, flapSpeed, opacity, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initButterflies(canvas.width, canvas.height);
  }, [initButterflies]);

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

export default Butterflies;
