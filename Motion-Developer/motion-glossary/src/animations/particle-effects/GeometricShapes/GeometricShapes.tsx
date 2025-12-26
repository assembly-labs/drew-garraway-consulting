import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface GeometricShapesProps {
  /** Number of shapes */
  shapeCount?: number;
  /** Types of shapes to include */
  shapes?: ('triangle' | 'square' | 'pentagon' | 'hexagon' | 'circle' | 'ring')[];
  /** Size range [min, max] in pixels */
  sizeRange?: [number, number];
  /** Array of colors */
  colors?: string[];
  /** Movement speed (0-1) */
  speed?: number;
  /** Rotation speed (0-1) */
  rotationSpeed?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Line width for shapes */
  lineWidth?: number;
  /** Fill shapes instead of stroke */
  filled?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Shape {
  x: number;
  y: number;
  size: number;
  type: 'triangle' | 'square' | 'pentagon' | 'hexagon' | 'circle' | 'ring';
  color: string;
  rotation: number;
  rotationSpeed: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

/**
 * GeometricShapes
 *
 * Floating geometric shapes with rotation and subtle movement.
 * Creates a modern, abstract, tech-inspired background effect.
 */
export const GeometricShapes: React.FC<GeometricShapesProps> = ({
  shapeCount = 15,
  shapes = ['triangle', 'square', 'hexagon', 'circle'],
  sizeRange = [20, 60],
  colors = ['#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#10b981'],
  speed = 0.2,
  rotationSpeed = 0.3,
  opacity = 0.3,
  lineWidth = 2,
  filled = false,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  // Draw a polygon
  const drawPolygon = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    sides: number,
    rotation: number
  ) => {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2 + rotation - Math.PI / 2;
      const px = x + Math.cos(angle) * size;
      const py = y + Math.sin(angle) * size;
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
  }, []);

  // Initialize shapes
  const initShapes = useCallback((width: number, height: number) => {
    const shapeList: Shape[] = [];
    for (let i = 0; i < shapeCount; i++) {
      shapeList.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
        type: shapes[Math.floor(Math.random() * shapes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * rotationSpeed * 0.02,
        speedX: (Math.random() - 0.5) * speed * 0.5,
        speedY: (Math.random() - 0.5) * speed * 0.5,
        opacity: opacity * (0.5 + Math.random() * 0.5),
      });
    }
    shapesRef.current = shapeList;
  }, [shapeCount, shapes, sizeRange, colors, speed, rotationSpeed, opacity]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Update and draw shapes
    shapesRef.current.forEach((shape) => {
      if (!prefersReducedMotion) {
        // Move
        shape.x += shape.speedX;
        shape.y += shape.speedY;

        // Rotate
        shape.rotation += shape.rotationSpeed;

        // Wrap around
        const padding = shape.size;
        if (shape.x < -padding) shape.x = width + padding;
        if (shape.x > width + padding) shape.x = -padding;
        if (shape.y < -padding) shape.y = height + padding;
        if (shape.y > height + padding) shape.y = -padding;
      }

      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      ctx.globalAlpha = shape.opacity;
      ctx.lineWidth = lineWidth;

      if (filled) {
        ctx.fillStyle = shape.color;
      } else {
        ctx.strokeStyle = shape.color;
      }

      // Draw shape based on type
      switch (shape.type) {
        case 'triangle':
          drawPolygon(ctx, 0, 0, shape.size, 3, 0);
          break;
        case 'square':
          drawPolygon(ctx, 0, 0, shape.size, 4, Math.PI / 4);
          break;
        case 'pentagon':
          drawPolygon(ctx, 0, 0, shape.size, 5, 0);
          break;
        case 'hexagon':
          drawPolygon(ctx, 0, 0, shape.size, 6, 0);
          break;
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, shape.size, 0, Math.PI * 2);
          break;
        case 'ring':
          ctx.beginPath();
          ctx.arc(0, 0, shape.size, 0, Math.PI * 2);
          ctx.moveTo(shape.size * 0.6, 0);
          ctx.arc(0, 0, shape.size * 0.6, 0, Math.PI * 2, true);
          break;
      }

      if (filled) {
        ctx.fill();
      } else {
        ctx.stroke();
      }

      ctx.restore();
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [lineWidth, filled, drawPolygon, prefersReducedMotion]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    initShapes(canvas.width, canvas.height);
  }, [initShapes]);

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
      initShapes(canvas.width, canvas.height);
    }
  }, [shapeCount, shapes, sizeRange, colors, speed, rotationSpeed, opacity, initShapes]);

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

export default GeometricShapes;

export const geometricShapesCode = `import { useRef, useEffect } from 'react';

const GeometricShapes = ({
  shapeCount = 15,
  shapes = ['triangle', 'square', 'hexagon', 'circle'],
  colors = ['#8b5cf6', '#6366f1', '#3b82f6'],
  speed = 0.2,
  rotationSpeed = 0.3,
  opacity = 0.3,
  lineWidth = 2,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawPolygon = (x, y, size, sides) => {
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
        const px = x + Math.cos(angle) * size;
        const py = y + Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const shapeList = Array.from({ length: shapeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 20 + Math.random() * 40,
      type: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * rotationSpeed * 0.02,
      speedX: (Math.random() - 0.5) * speed * 0.5,
      speedY: (Math.random() - 0.5) * speed * 0.5,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      shapeList.forEach(shape => {
        shape.x += shape.speedX;
        shape.y += shape.speedY;
        shape.rotation += shape.rotationSpeed;

        // Wrap around
        if (shape.x < -shape.size) shape.x = canvas.width + shape.size;
        if (shape.x > canvas.width + shape.size) shape.x = -shape.size;
        if (shape.y < -shape.size) shape.y = canvas.height + shape.size;
        if (shape.y > canvas.height + shape.size) shape.y = -shape.size;

        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = lineWidth;
        ctx.globalAlpha = opacity;

        switch (shape.type) {
          case 'triangle': drawPolygon(0, 0, shape.size, 3); break;
          case 'square': drawPolygon(0, 0, shape.size, 4); break;
          case 'hexagon': drawPolygon(0, 0, shape.size, 6); break;
          case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, shape.size, 0, Math.PI * 2);
            break;
        }
        ctx.stroke();
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} />;
};`;
