import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface LeavesProps {
  /** Number of leaves */
  leafCount?: number;
  /** Leaf colors (autumn palette) */
  colors?: string[];
  /** Fall speed (0-1) */
  speed?: number;
  /** Wind strength (0-1) */
  wind?: number;
  /** Tumble intensity (0-1) */
  tumble?: number;
  /** Leaf size range */
  sizeRange?: [number, number];
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Leaf {
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  fallSpeed: number;
  swayPhase: number;
  swayAmplitude: number;
  tumblePhase: number;
  leafType: number;
}

/**
 * Leaves
 *
 * Falling autumn leaves with realistic tumbling motion.
 * Creates a warm, seasonal atmosphere.
 */
export const Leaves: React.FC<LeavesProps> = ({
  leafCount = 30,
  colors = ['#dc2626', '#ea580c', '#d97706', '#ca8a04', '#84cc16'],
  speed = 0.3,
  wind = 0.4,
  tumble = 0.6,
  sizeRange = [15, 30],
  opacity = 0.9,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const leavesRef = useRef<Leaf[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initLeaves = useCallback((width: number, height: number) => {
    const leaves: Leaf[] = [];

    for (let i = 0; i < leafCount; i++) {
      leaves.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        fallSpeed: 0.8 + Math.random() * 0.8,
        swayPhase: Math.random() * Math.PI * 2,
        swayAmplitude: 30 + Math.random() * 50,
        tumblePhase: Math.random() * Math.PI * 2,
        leafType: Math.floor(Math.random() * 3),
      });
    }

    leavesRef.current = leaves;
  }, [leafCount, colors, sizeRange]);

  const drawLeaf = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    rotation: number,
    color: string,
    leafType: number,
    tumbleScale: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(tumbleScale, 1);

    ctx.beginPath();

    if (leafType === 0) {
      // Maple-style leaf
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(size * 0.5, -size * 0.3, size * 0.8, -size * 0.5);
      ctx.quadraticCurveTo(size * 0.6, 0, size * 0.7, size * 0.3);
      ctx.quadraticCurveTo(size * 0.3, size * 0.2, 0, size);
      ctx.quadraticCurveTo(-size * 0.3, size * 0.2, -size * 0.7, size * 0.3);
      ctx.quadraticCurveTo(-size * 0.6, 0, -size * 0.8, -size * 0.5);
      ctx.quadraticCurveTo(-size * 0.5, -size * 0.3, 0, -size);
    } else if (leafType === 1) {
      // Oak-style leaf
      ctx.moveTo(0, -size);
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI;
        const r = size * (0.6 + Math.sin(i * 2) * 0.3);
        ctx.lineTo(Math.sin(angle) * r, -Math.cos(angle) * size + i * size * 0.4);
      }
      ctx.lineTo(0, size);
      for (let i = 4; i >= 0; i--) {
        const angle = (i / 5) * Math.PI;
        const r = size * (0.6 + Math.sin(i * 2) * 0.3);
        ctx.lineTo(-Math.sin(angle) * r, -Math.cos(angle) * size + i * size * 0.4);
      }
    } else {
      // Simple oval leaf
      ctx.ellipse(0, 0, size * 0.4, size, 0, 0, Math.PI * 2);
    }

    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, -size, 0, size);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, '#92400e');

    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw stem/vein
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.8);
    ctx.lineTo(0, size);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1;
    ctx.stroke();

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

    leavesRef.current.forEach((leaf) => {
      if (!prefersReducedMotion) {
        leaf.y += leaf.fallSpeed * speed * 2;
        leaf.x += Math.sin(timeRef.current + leaf.swayPhase) * leaf.swayAmplitude * 0.02;
        leaf.x += wind * 0.5;
        leaf.rotation += leaf.rotationSpeed * tumble;
        leaf.tumblePhase += 0.03 * tumble;

        if (leaf.y > height + leaf.size) {
          leaf.y = -leaf.size * 2;
          leaf.x = Math.random() * width;
        }
        if (leaf.x > width + leaf.size) leaf.x = -leaf.size;
        if (leaf.x < -leaf.size) leaf.x = width + leaf.size;
      }

      const tumbleScale = 0.3 + Math.abs(Math.cos(leaf.tumblePhase)) * 0.7;
      ctx.globalAlpha = opacity;
      drawLeaf(ctx, leaf.x, leaf.y, leaf.size, leaf.rotation, leaf.color, leaf.leafType, tumbleScale);
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, wind, tumble, opacity, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initLeaves(canvas.width, canvas.height);
  }, [initLeaves]);

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

export default Leaves;
