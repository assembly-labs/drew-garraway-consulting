import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface GrowingVinesProps {
  /** Number of vines */
  vineCount?: number;
  /** Vine colors */
  colors?: string[];
  /** Growth speed (0-1) */
  speed?: number;
  /** Maximum vine length */
  maxLength?: number;
  /** Branch probability (0-1) */
  branchProbability?: number;
  /** Show leaves */
  showLeaves?: boolean;
  /** Leaf color */
  leafColor?: string;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface VineSegment {
  x: number;
  y: number;
  angle: number;
  length: number;
  thickness: number;
  color: string;
  growth: number;
  maxGrowth: number;
  children: VineSegment[];
  hasLeaf: boolean;
}

/**
 * GrowingVines
 *
 * Animated vines that grow and branch across the screen.
 * Creates an organic, natural feel.
 */
export const GrowingVines: React.FC<GrowingVinesProps> = ({
  vineCount = 5,
  colors = ['#166534', '#15803d', '#16a34a', '#22c55e'],
  speed = 0.4,
  maxLength = 200,
  branchProbability = 0.3,
  showLeaves = true,
  leafColor = '#22c55e',
  opacity = 0.8,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vinesRef = useRef<VineSegment[]>([]);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const createVine = (x: number, y: number, angle: number, thickness: number, depth: number): VineSegment => {
    return {
      x,
      y,
      angle: angle + (Math.random() - 0.5) * 0.5,
      length: 10 + Math.random() * 20,
      thickness,
      color: colors[Math.floor(Math.random() * colors.length)],
      growth: 0,
      maxGrowth: maxLength * (0.5 + Math.random() * 0.5) * Math.pow(0.7, depth),
      children: [],
      hasLeaf: showLeaves && Math.random() > 0.5,
    };
  };

  const initVines = useCallback((width: number, height: number) => {
    const vines: VineSegment[] = [];

    for (let i = 0; i < vineCount; i++) {
      const startX = Math.random() * width;
      const startY = height + 20;
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.5;

      vines.push(createVine(startX, startY, angle, 4, 0));
    }

    vinesRef.current = vines;
  }, [vineCount, maxLength, colors, showLeaves]);

  const growVine = (vine: VineSegment, depth: number) => {
    if (vine.growth < vine.maxGrowth) {
      vine.growth += speed * 2;

      // Create branches
      if (vine.children.length === 0 && vine.growth > vine.maxGrowth * 0.3) {
        if (Math.random() < branchProbability && depth < 4) {
          const branchAngle = vine.angle + (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.5);
          vine.children.push(createVine(
            vine.x + Math.cos(vine.angle) * vine.growth,
            vine.y + Math.sin(vine.angle) * vine.growth,
            branchAngle,
            vine.thickness * 0.7,
            depth + 1
          ));
        }
      }
    }

    vine.children.forEach((child) => growVine(child, depth + 1));
  };

  const drawVine = (ctx: CanvasRenderingContext2D, vine: VineSegment, depth: number) => {
    const segments = Math.floor(vine.growth / 10);

    ctx.beginPath();
    ctx.moveTo(vine.x, vine.y);

    let currentX = vine.x;
    let currentY = vine.y;
    let currentAngle = vine.angle;

    for (let i = 0; i < segments; i++) {
      currentAngle += Math.sin(i * 0.5) * 0.1;
      currentX += Math.cos(currentAngle) * 10;
      currentY += Math.sin(currentAngle) * 10;
      ctx.lineTo(currentX, currentY);
    }

    ctx.strokeStyle = vine.color;
    ctx.lineWidth = vine.thickness * (1 - depth * 0.15);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = opacity;
    ctx.stroke();

    // Draw leaf at end
    if (vine.hasLeaf && vine.growth > vine.maxGrowth * 0.8) {
      const leafX = currentX;
      const leafY = currentY;
      const leafSize = 8 + Math.random() * 6;

      ctx.save();
      ctx.translate(leafX, leafY);
      ctx.rotate(currentAngle + Math.PI / 4);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        leafSize * 0.5, -leafSize * 0.3,
        leafSize, -leafSize * 0.2,
        leafSize, 0
      );
      ctx.bezierCurveTo(
        leafSize, leafSize * 0.2,
        leafSize * 0.5, leafSize * 0.3,
        0, 0
      );

      ctx.fillStyle = leafColor;
      ctx.globalAlpha = opacity * 0.9;
      ctx.fill();

      // Leaf vein
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(leafSize * 0.8, 0);
      ctx.strokeStyle = '#166534';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.restore();
    }

    // Draw curly tendrils
    if (depth < 2 && vine.growth > vine.maxGrowth * 0.5 && Math.random() > 0.7) {
      ctx.beginPath();
      const tendrilStart = 0.3 + Math.random() * 0.4;
      const tx = vine.x + Math.cos(vine.angle) * vine.growth * tendrilStart;
      const ty = vine.y + Math.sin(vine.angle) * vine.growth * tendrilStart;

      ctx.moveTo(tx, ty);
      for (let t = 0; t < 3; t++) {
        const spiralAngle = t * Math.PI * 0.8;
        const spiralRadius = 5 - t * 1.5;
        ctx.lineTo(
          tx + Math.cos(spiralAngle) * spiralRadius,
          ty + Math.sin(spiralAngle) * spiralRadius - t * 3
        );
      }
      ctx.strokeStyle = vine.color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = opacity * 0.6;
      ctx.stroke();
    }

    vine.children.forEach((child) => drawVine(ctx, child, depth + 1));
  };

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!prefersReducedMotion) {
      vinesRef.current.forEach((vine) => growVine(vine, 0));
    }

    vinesRef.current.forEach((vine) => drawVine(ctx, vine, 0));

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, branchProbability, opacity, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initVines(canvas.width, canvas.height);
  }, [initVines]);

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

export default GrowingVines;
