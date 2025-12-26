import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface KaleidoscopeProps {
  /** Number of mirror segments */
  segments?: number;
  /** Pattern colors */
  colors?: string[];
  /** Rotation speed (0-1) */
  speed?: number;
  /** Pattern complexity */
  complexity?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface PatternElement {
  distance: number;
  angle: number;
  size: number;
  color: string;
  type: 'circle' | 'triangle' | 'diamond';
  rotationOffset: number;
}

/**
 * Kaleidoscope
 *
 * Rotating kaleidoscope pattern with geometric shapes.
 * Creates a mesmerizing, psychedelic aesthetic.
 */
export const Kaleidoscope: React.FC<KaleidoscopeProps> = ({
  segments = 8,
  colors = ['#ec4899', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#eab308'],
  speed = 0.3,
  complexity = 5,
  opacity = 0.8,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elementsRef = useRef<PatternElement[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initElements = useCallback((maxRadius: number) => {
    const elements: PatternElement[] = [];
    const types: ('circle' | 'triangle' | 'diamond')[] = ['circle', 'triangle', 'diamond'];

    for (let i = 0; i < complexity * 10; i++) {
      elements.push({
        distance: Math.random() * maxRadius * 0.8,
        angle: Math.random() * (Math.PI * 2) / segments,
        size: 5 + Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: types[Math.floor(Math.random() * types.length)],
        rotationOffset: Math.random() * Math.PI * 2,
      });
    }

    elementsRef.current = elements;
  }, [segments, colors, complexity]);

  const drawShape = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    type: 'circle' | 'triangle' | 'diamond',
    rotation: number,
    color: string
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    ctx.beginPath();

    switch (type) {
      case 'circle':
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        break;
      case 'triangle':
        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.866, size * 0.5);
        ctx.lineTo(-size * 0.866, size * 0.5);
        ctx.closePath();
        break;
      case 'diamond':
        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.7, 0);
        ctx.lineTo(0, size);
        ctx.lineTo(-size * 0.7, 0);
        ctx.closePath();
        break;
    }

    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();
  };

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2;

    if (!prefersReducedMotion) {
      timeRef.current += 0.016;
    }

    ctx.clearRect(0, 0, width, height);

    const baseRotation = timeRef.current * speed;
    const segmentAngle = (Math.PI * 2) / segments;

    // Draw all segments
    for (let seg = 0; seg < segments; seg++) {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(seg * segmentAngle + baseRotation);

      // Clip to segment
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, maxRadius, -segmentAngle / 2, segmentAngle / 2);
      ctx.closePath();
      ctx.clip();

      // Draw elements within segment
      elementsRef.current.forEach((element) => {
        const mirrorMod = seg % 2 === 0 ? 1 : -1;
        const elementAngle = element.angle * mirrorMod;

        const x = Math.cos(elementAngle) * element.distance;
        const y = Math.sin(elementAngle) * element.distance;

        const elementRotation = timeRef.current * 0.5 + element.rotationOffset;
        const pulse = 0.8 + Math.sin(timeRef.current * 2 + element.distance * 0.01) * 0.2;

        ctx.globalAlpha = opacity * pulse;

        drawShape(
          ctx,
          x,
          y,
          element.size * pulse,
          element.type,
          elementRotation,
          element.color
        );

        // Glow effect
        ctx.globalAlpha = opacity * 0.3 * pulse;
        drawShape(
          ctx,
          x,
          y,
          element.size * 1.5 * pulse,
          element.type,
          elementRotation,
          element.color
        );
      });

      ctx.restore();
    }

    // Center decoration
    const centerGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, 30
    );
    centerGradient.addColorStop(0, '#ffffff');
    centerGradient.addColorStop(0.5, colors[0]);
    centerGradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = centerGradient;
    ctx.globalAlpha = opacity;
    ctx.fill();

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [segments, speed, opacity, colors, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const maxRadius = Math.min(canvas.width, canvas.height) / 2;
    initElements(maxRadius);
  }, [initElements]);

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

export default Kaleidoscope;
