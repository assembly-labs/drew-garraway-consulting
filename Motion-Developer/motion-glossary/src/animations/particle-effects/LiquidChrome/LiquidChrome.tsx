import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface LiquidChromeProps {
  /** Number of chrome blobs */
  blobCount?: number;
  /** Base color (affects reflection) */
  baseColor?: string;
  /** Highlight color */
  highlightColor?: string;
  /** Animation speed (0-1) */
  speed?: number;
  /** Blob size range */
  sizeRange?: [number, number];
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface ChromeBlob {
  x: number;
  y: number;
  size: number;
  phase: number;
  phaseSpeed: number;
  vx: number;
  vy: number;
  reflectionAngle: number;
}

/**
 * LiquidChrome
 *
 * Metallic liquid chrome effect with reflections.
 * Creates a Y2K / futuristic metal aesthetic.
 */
export const LiquidChrome: React.FC<LiquidChromeProps> = ({
  blobCount = 5,
  baseColor = '#94a3b8',
  highlightColor = '#f8fafc',
  speed = 0.3,
  sizeRange = [60, 120],
  opacity = 0.9,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<ChromeBlob[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initBlobs = useCallback((width: number, height: number) => {
    const blobs: ChromeBlob[] = [];

    for (let i = 0; i < blobCount; i++) {
      blobs.push({
        x: width * 0.2 + Math.random() * width * 0.6,
        y: height * 0.2 + Math.random() * height * 0.6,
        size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.3 + Math.random() * 0.7,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        reflectionAngle: Math.random() * Math.PI * 2,
      });
    }

    blobsRef.current = blobs;
  }, [blobCount, sizeRange]);

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

    blobsRef.current.forEach((blob) => {
      if (!prefersReducedMotion) {
        blob.phase += blob.phaseSpeed * speed * 0.02;
        blob.x += blob.vx * speed;
        blob.y += blob.vy * speed;
        blob.reflectionAngle += 0.01 * speed;

        // Bounce off edges
        if (blob.x < blob.size || blob.x > width - blob.size) blob.vx *= -1;
        if (blob.y < blob.size || blob.y > height - blob.size) blob.vy *= -1;
      }

      // Draw organic blob shape
      ctx.save();
      ctx.translate(blob.x, blob.y);

      // Create morphing blob path
      ctx.beginPath();
      const points = 8;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const morphOffset = Math.sin(blob.phase + i * 0.8) * 0.2;
        const radius = blob.size * (1 + morphOffset);

        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;

        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          const prevAngle = ((i - 1) / points) * Math.PI * 2;
          const prevMorphOffset = Math.sin(blob.phase + (i - 1) * 0.8) * 0.2;
          const prevRadius = blob.size * (1 + prevMorphOffset);

          const cpAngle = (angle + prevAngle) / 2;
          const cpRadius = (radius + prevRadius) / 2 * 1.1;
          const cpx = Math.cos(cpAngle) * cpRadius;
          const cpy = Math.sin(cpAngle) * cpRadius;

          ctx.quadraticCurveTo(cpx, cpy, px, py);
        }
      }
      ctx.closePath();

      // Chrome gradient
      const gradient = ctx.createRadialGradient(
        -blob.size * 0.3, -blob.size * 0.3, 0,
        0, 0, blob.size * 1.2
      );

      // Simulate metallic reflection
      gradient.addColorStop(0, highlightColor);
      gradient.addColorStop(0.2, baseColor);
      gradient.addColorStop(0.5, '#64748b');
      gradient.addColorStop(0.7, '#334155');
      gradient.addColorStop(0.85, '#475569');
      gradient.addColorStop(1, '#1e293b');

      ctx.fillStyle = gradient;
      ctx.globalAlpha = opacity;
      ctx.fill();

      // Add reflection highlight
      ctx.beginPath();
      ctx.ellipse(
        -blob.size * 0.25,
        -blob.size * 0.25,
        blob.size * 0.3,
        blob.size * 0.15,
        -Math.PI / 4,
        0,
        Math.PI * 2
      );

      const highlightGradient = ctx.createRadialGradient(
        -blob.size * 0.25, -blob.size * 0.25, 0,
        -blob.size * 0.25, -blob.size * 0.25, blob.size * 0.3
      );
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
      highlightGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = highlightGradient;
      ctx.globalAlpha = opacity * 0.8;
      ctx.fill();

      // Secondary reflection
      ctx.beginPath();
      ctx.ellipse(
        blob.size * 0.2,
        blob.size * 0.3,
        blob.size * 0.15,
        blob.size * 0.08,
        Math.PI / 6,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.globalAlpha = opacity * 0.5;
      ctx.fill();

      // Edge highlight
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const morphOffset = Math.sin(blob.phase + i * 0.8) * 0.2;
        const radius = blob.size * (1 + morphOffset) * 0.98;

        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;

        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.globalAlpha = opacity * 0.5;
      ctx.stroke();

      ctx.restore();
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, baseColor, highlightColor, opacity, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initBlobs(canvas.width, canvas.height);
  }, [initBlobs]);

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

export default LiquidChrome;
