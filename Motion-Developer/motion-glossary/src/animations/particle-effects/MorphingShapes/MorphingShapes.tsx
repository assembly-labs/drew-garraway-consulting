import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface MorphingShapesProps {
  /** Number of shapes */
  shapeCount?: number;
  /** Shape colors */
  colors?: string[];
  /** Morph speed (0-1) */
  speed?: number;
  /** Shape size range */
  sizeRange?: [number, number];
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Shape {
  x: number;
  y: number;
  size: number;
  color: string;
  phase: number;
  morphProgress: number;
  currentType: number;
  targetType: number;
  rotation: number;
  rotationSpeed: number;
}

/**
 * MorphingShapes
 *
 * Shapes that smoothly morph between different forms.
 * Creates a dynamic, transformative aesthetic.
 */
export const MorphingShapes: React.FC<MorphingShapesProps> = ({
  shapeCount = 6,
  colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'],
  speed = 0.3,
  sizeRange = [40, 80],
  opacity = 0.7,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initShapes = useCallback((width: number, height: number) => {
    const shapes: Shape[] = [];

    for (let i = 0; i < shapeCount; i++) {
      shapes.push({
        x: width * 0.15 + Math.random() * width * 0.7,
        y: height * 0.15 + Math.random() * height * 0.7,
        size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
        color: colors[i % colors.length],
        phase: Math.random() * Math.PI * 2,
        morphProgress: 0,
        currentType: Math.floor(Math.random() * 4),
        targetType: Math.floor(Math.random() * 4),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    shapesRef.current = shapes;
  }, [shapeCount, colors, sizeRange]);

  const drawShape = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    type: number,
    progress: number,
    nextType: number
  ) => {
    // Interpolate between current and next shape
    const points1 = getShapePoints(type, size);
    const points2 = getShapePoints(nextType, size);

    ctx.beginPath();

    for (let i = 0; i < points1.length; i++) {
      const p1 = points1[i];
      const p2 = points2[i % points2.length];

      const px = p1.x + (p2.x - p1.x) * progress;
      const py = p1.y + (p2.y - p1.y) * progress;

      if (i === 0) {
        ctx.moveTo(x + px, y + py);
      } else {
        ctx.lineTo(x + px, y + py);
      }
    }

    ctx.closePath();
  };

  const getShapePoints = (type: number, size: number) => {
    const points: { x: number; y: number }[] = [];
    const numPoints = 12;

    switch (type) {
      case 0: // Circle
        for (let i = 0; i < numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2;
          points.push({
            x: Math.cos(angle) * size,
            y: Math.sin(angle) * size,
          });
        }
        break;
      case 1: // Square
        for (let i = 0; i < numPoints; i++) {
          const segment = Math.floor(i / 3);
          const t = (i % 3) / 3;
          switch (segment) {
            case 0:
              points.push({ x: -size + t * size * 2, y: -size });
              break;
            case 1:
              points.push({ x: size, y: -size + t * size * 2 });
              break;
            case 2:
              points.push({ x: size - t * size * 2, y: size });
              break;
            case 3:
              points.push({ x: -size, y: size - t * size * 2 });
              break;
          }
        }
        break;
      case 2: // Triangle
        for (let i = 0; i < numPoints; i++) {
          const segment = Math.floor(i / 4);
          const t = (i % 4) / 4;
          const vertices = [
            { x: 0, y: -size },
            { x: size * 0.866, y: size * 0.5 },
            { x: -size * 0.866, y: size * 0.5 },
          ];
          const start = vertices[segment];
          const end = vertices[(segment + 1) % 3];
          points.push({
            x: start.x + (end.x - start.x) * t,
            y: start.y + (end.y - start.y) * t,
          });
        }
        break;
      case 3: // Star
        for (let i = 0; i < numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
          const radius = i % 2 === 0 ? size : size * 0.5;
          points.push({
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
          });
        }
        break;
    }

    return points;
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

    shapesRef.current.forEach((shape) => {
      if (!prefersReducedMotion) {
        shape.phase += speed * 0.02;
        shape.morphProgress += speed * 0.01;
        shape.rotation += shape.rotationSpeed;

        // Start new morph when complete
        if (shape.morphProgress >= 1) {
          shape.morphProgress = 0;
          shape.currentType = shape.targetType;
          shape.targetType = Math.floor(Math.random() * 4);
        }

        // Gentle floating movement
        shape.x += Math.sin(shape.phase) * 0.3;
        shape.y += Math.cos(shape.phase * 0.7) * 0.3;
      }

      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);

      // Glow effect
      drawShape(ctx, 0, 0, shape.size * 1.1, shape.currentType, shape.morphProgress, shape.targetType);
      ctx.fillStyle = shape.color;
      ctx.globalAlpha = opacity * 0.3;
      ctx.fill();

      // Main shape
      drawShape(ctx, 0, 0, shape.size, shape.currentType, shape.morphProgress, shape.targetType);
      ctx.fillStyle = shape.color;
      ctx.globalAlpha = opacity;
      ctx.fill();

      // Highlight
      drawShape(ctx, 0, 0, shape.size * 0.6, shape.currentType, shape.morphProgress, shape.targetType);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = opacity * 0.2;
      ctx.fill();

      ctx.restore();
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, opacity, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initShapes(canvas.width, canvas.height);
  }, [initShapes]);

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

export default MorphingShapes;
