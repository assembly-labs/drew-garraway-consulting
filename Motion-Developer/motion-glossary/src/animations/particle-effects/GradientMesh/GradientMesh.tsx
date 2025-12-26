import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface GradientMeshProps {
  /** Grid size */
  gridSize?: number;
  /** Mesh colors */
  colors?: string[];
  /** Animation speed (0-1) */
  speed?: number;
  /** Morph intensity (0-1) */
  morphIntensity?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface MeshPoint {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  color: string;
  phase: number;
  phaseSpeed: number;
}

/**
 * GradientMesh
 *
 * Animated mesh gradient with flowing color transitions.
 * Creates a modern, dynamic gradient aesthetic.
 */
export const GradientMesh: React.FC<GradientMeshProps> = ({
  gridSize = 4,
  colors = ['#ec4899', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981'],
  speed = 0.3,
  morphIntensity = 0.5,
  opacity = 0.8,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<MeshPoint[][]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initPoints = useCallback((width: number, height: number) => {
    const points: MeshPoint[][] = [];
    const cellWidth = width / (gridSize - 1);
    const cellHeight = height / (gridSize - 1);

    for (let row = 0; row < gridSize; row++) {
      points[row] = [];
      for (let col = 0; col < gridSize; col++) {
        const colorIndex = (row + col) % colors.length;
        points[row][col] = {
          baseX: col * cellWidth,
          baseY: row * cellHeight,
          x: col * cellWidth,
          y: row * cellHeight,
          color: colors[colorIndex],
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: 0.5 + Math.random() * 1,
        };
      }
    }

    pointsRef.current = points;
  }, [gridSize, colors]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const points = pointsRef.current;

    if (!prefersReducedMotion) {
      timeRef.current += 0.016;
    }

    ctx.clearRect(0, 0, width, height);

    // Update point positions
    if (!prefersReducedMotion) {
      points.forEach((row) => {
        row.forEach((point) => {
          point.phase += point.phaseSpeed * speed * 0.02;

          const offsetX = Math.sin(point.phase) * 50 * morphIntensity;
          const offsetY = Math.cos(point.phase * 1.3) * 50 * morphIntensity;

          point.x = point.baseX + offsetX;
          point.y = point.baseY + offsetY;
        });
      });
    }

    // Draw mesh cells
    for (let row = 0; row < gridSize - 1; row++) {
      for (let col = 0; col < gridSize - 1; col++) {
        const tl = points[row][col];
        const tr = points[row][col + 1];
        const bl = points[row + 1][col];
        const br = points[row + 1][col + 1];

        // Create gradient for cell
        const centerX = (tl.x + tr.x + bl.x + br.x) / 4;
        const centerY = (tl.y + tr.y + bl.y + br.y) / 4;

        // Draw cell with gradient fill
        ctx.beginPath();
        ctx.moveTo(tl.x, tl.y);
        ctx.lineTo(tr.x, tr.y);
        ctx.lineTo(br.x, br.y);
        ctx.lineTo(bl.x, bl.y);
        ctx.closePath();

        // Create multi-point gradient effect
        const gradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, Math.max(width, height) / gridSize
        );

        gradient.addColorStop(0, tl.color);
        gradient.addColorStop(0.5, tr.color);
        gradient.addColorStop(1, br.color);

        ctx.fillStyle = gradient;
        ctx.globalAlpha = opacity;
        ctx.fill();
      }
    }

    // Draw mesh points (optional visual guide)
    points.forEach((row) => {
      row.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = opacity * 0.3;
        ctx.fill();
      });
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [gridSize, speed, morphIntensity, opacity, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initPoints(canvas.width, canvas.height);
  }, [initPoints]);

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

export default GradientMesh;
