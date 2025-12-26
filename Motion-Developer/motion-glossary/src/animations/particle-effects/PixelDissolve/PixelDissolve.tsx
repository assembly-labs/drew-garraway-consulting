import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface PixelDissolveProps {
  /** Pixel size */
  pixelSize?: number;
  /** Pixel colors */
  colors?: string[];
  /** Animation speed (0-1) */
  speed?: number;
  /** Dissolution pattern */
  pattern?: 'random' | 'wave' | 'spiral';
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Pixel {
  x: number;
  y: number;
  size: number;
  color: string;
  phase: number;
  delay: number;
  maxOpacity: number;
}

/**
 * PixelDissolve
 *
 * Pixelated dissolution/materialization effect.
 * Creates a digital transformation aesthetic.
 */
export const PixelDissolve: React.FC<PixelDissolveProps> = ({
  pixelSize = 8,
  colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7'],
  speed = 0.3,
  pattern = 'random',
  opacity = 0.7,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initPixels = useCallback((width: number, height: number) => {
    const pixels: Pixel[] = [];
    const cols = Math.ceil(width / pixelSize);
    const rows = Math.ceil(height / pixelSize);
    const centerX = cols / 2;
    const centerY = rows / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (Math.random() > 0.7) {
          let delay: number;

          switch (pattern) {
            case 'wave':
              delay = (col / cols) * 5;
              break;
            case 'spiral':
              const dx = col - centerX;
              const dy = row - centerY;
              delay = Math.sqrt(dx * dx + dy * dy) * 0.1;
              break;
            default:
              delay = Math.random() * 5;
          }

          pixels.push({
            x: col * pixelSize,
            y: row * pixelSize,
            size: pixelSize,
            color: colors[Math.floor(Math.random() * colors.length)],
            phase: Math.random() * Math.PI * 2,
            delay,
            maxOpacity: 0.3 + Math.random() * 0.7,
          });
        }
      }
    }

    pixelsRef.current = pixels;
  }, [pixelSize, colors, pattern]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    if (!prefersReducedMotion) {
      timeRef.current += 0.016 * speed;
    }

    ctx.clearRect(0, 0, width, height);

    pixelsRef.current.forEach((pixel) => {
      const cycleTime = timeRef.current - pixel.delay;
      const cycle = cycleTime % 8;
      let currentOpacity: number;

      if (cycle < 0) {
        currentOpacity = 0;
      } else if (cycle < 2) {
        // Fade in
        currentOpacity = (cycle / 2) * pixel.maxOpacity;
      } else if (cycle < 6) {
        // Stay visible with subtle pulse
        const pulse = Math.sin(pixel.phase + timeRef.current * 3) * 0.2 + 0.8;
        currentOpacity = pixel.maxOpacity * pulse;
      } else {
        // Fade out
        currentOpacity = ((8 - cycle) / 2) * pixel.maxOpacity;
      }

      if (currentOpacity <= 0) return;

      // Draw pixel with slight variation in size
      const sizeVariation = Math.sin(pixel.phase + timeRef.current * 2) * 0.1 + 1;
      const drawSize = pixel.size * sizeVariation;
      const offset = (pixel.size - drawSize) / 2;

      ctx.fillStyle = pixel.color;
      ctx.globalAlpha = opacity * currentOpacity;
      ctx.fillRect(pixel.x + offset, pixel.y + offset, drawSize - 1, drawSize - 1);

      // Subtle glow
      ctx.fillStyle = pixel.color;
      ctx.globalAlpha = opacity * currentOpacity * 0.3;
      ctx.fillRect(pixel.x + offset - 1, pixel.y + offset - 1, drawSize + 1, drawSize + 1);
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

    initPixels(canvas.width, canvas.height);
  }, [initPixels]);

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

export default PixelDissolve;
