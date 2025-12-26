import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface DnaHelixProps {
  /** Number of base pairs */
  basePairCount?: number;
  /** Helix colors */
  colors?: [string, string];
  /** Base pair colors */
  basePairColors?: string[];
  /** Rotation speed (0-1) */
  speed?: number;
  /** Helix radius */
  radius?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * DnaHelix
 *
 * Rotating DNA double helix structure.
 * Creates a scientific, biological aesthetic.
 */
export const DnaHelix: React.FC<DnaHelixProps> = ({
  basePairCount = 20,
  colors = ['#3b82f6', '#ef4444'],
  basePairColors = ['#22c55e', '#eab308', '#8b5cf6', '#ec4899'],
  speed = 0.3,
  radius = 60,
  opacity = 0.9,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;

    if (!prefersReducedMotion) {
      timeRef.current += 0.016 * speed;
    }

    ctx.clearRect(0, 0, width, height);

    const verticalSpacing = height / basePairCount;
    const rotation = timeRef.current * 2;

    // Draw base pairs and backbones
    const backbone1Points: { x: number; y: number; z: number }[] = [];
    const backbone2Points: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < basePairCount; i++) {
      const y = i * verticalSpacing + verticalSpacing / 2;
      const angle = rotation + (i / basePairCount) * Math.PI * 4;

      const x1 = centerX + Math.cos(angle) * radius;
      const x2 = centerX + Math.cos(angle + Math.PI) * radius;
      const z1 = Math.sin(angle);
      const z2 = Math.sin(angle + Math.PI);

      backbone1Points.push({ x: x1, y, z: z1 });
      backbone2Points.push({ x: x2, y, z: z2 });
    }

    // Sort by z-depth for proper rendering
    interface RenderItem {
      type: 'backbone1' | 'backbone2' | 'basepair';
      index: number;
      z: number;
    }

    const renderOrder: RenderItem[] = [];

    backbone1Points.forEach((p, i) => renderOrder.push({ type: 'backbone1', index: i, z: p.z }));
    backbone2Points.forEach((p, i) => renderOrder.push({ type: 'backbone2', index: i, z: p.z }));
    backbone1Points.forEach((p, i) => renderOrder.push({ type: 'basepair', index: i, z: (p.z + backbone2Points[i].z) / 2 }));

    renderOrder.sort((a, b) => a.z - b.z);

    // Draw elements in z-order
    renderOrder.forEach((item) => {
      const i = item.index;

      if (item.type === 'basepair') {
        const p1 = backbone1Points[i];
        const p2 = backbone2Points[i];

        // Draw base pair connection
        const basePairColor = basePairColors[i % basePairColors.length];

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = basePairColor;
        ctx.lineWidth = 3;
        ctx.globalAlpha = opacity * (0.5 + ((p1.z + p2.z) / 2 + 1) * 0.25);
        ctx.stroke();

        // Base pair nodes
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        ctx.beginPath();
        ctx.arc(midX - 10, midY, 4, 0, Math.PI * 2);
        ctx.fillStyle = basePairColors[i % basePairColors.length];
        ctx.globalAlpha = opacity;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(midX + 10, midY, 4, 0, Math.PI * 2);
        ctx.fillStyle = basePairColors[(i + 1) % basePairColors.length];
        ctx.fill();
      }

      if (item.type === 'backbone1' && i < backbone1Points.length - 1) {
        const p1 = backbone1Points[i];
        const p2 = backbone1Points[i + 1];

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = colors[0];
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.globalAlpha = opacity * (0.5 + (p1.z + 1) * 0.25);
        ctx.stroke();

        // Glow
        ctx.strokeStyle = colors[0];
        ctx.lineWidth = 8;
        ctx.globalAlpha = opacity * 0.2 * (0.5 + (p1.z + 1) * 0.25);
        ctx.stroke();
      }

      if (item.type === 'backbone2' && i < backbone2Points.length - 1) {
        const p1 = backbone2Points[i];
        const p2 = backbone2Points[i + 1];

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = colors[1];
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.globalAlpha = opacity * (0.5 + (p1.z + 1) * 0.25);
        ctx.stroke();

        // Glow
        ctx.strokeStyle = colors[1];
        ctx.lineWidth = 8;
        ctx.globalAlpha = opacity * 0.2 * (0.5 + (p1.z + 1) * 0.25);
        ctx.stroke();
      }
    });

    // Draw backbone nodes
    backbone1Points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = colors[0];
      ctx.globalAlpha = opacity * (0.5 + (p.z + 1) * 0.25);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = opacity * 0.5 * (0.5 + (p.z + 1) * 0.25);
      ctx.fill();
    });

    backbone2Points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = colors[1];
      ctx.globalAlpha = opacity * (0.5 + (p.z + 1) * 0.25);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = opacity * 0.5 * (0.5 + (p.z + 1) * 0.25);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [basePairCount, colors, basePairColors, speed, radius, opacity, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  }, []);

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

export default DnaHelix;
