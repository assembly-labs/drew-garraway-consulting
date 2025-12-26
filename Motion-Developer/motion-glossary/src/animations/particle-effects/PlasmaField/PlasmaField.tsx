import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface PlasmaFieldProps {
  /** Plasma colors */
  colors?: string[];
  /** Animation speed (0-1) */
  speed?: number;
  /** Plasma intensity (0-1) */
  intensity?: number;
  /** Scale of plasma pattern */
  scale?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Resolution (lower = faster, pixelated) */
  resolution?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * PlasmaField
 *
 * Classic plasma effect with swirling colors.
 * Creates a psychedelic, retro demo-scene aesthetic.
 */
export const PlasmaField: React.FC<PlasmaFieldProps> = ({
  colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'],
  speed = 0.3,
  intensity = 0.7,
  scale = 1,
  opacity = 0.8,
  resolution = 4,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : { r: 0, g: 0, b: 0 };
  };

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

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    const rgbColors = colors.map(hexToRgb);
    const t = timeRef.current;

    for (let y = 0; y < height; y += resolution) {
      for (let x = 0; x < width; x += resolution) {
        // Plasma calculation
        const px = x * scale * 0.02;
        const py = y * scale * 0.02;

        const v1 = Math.sin(px + t);
        const v2 = Math.sin(py + t * 0.5);
        const v3 = Math.sin((px + py + t) * 0.5);
        const v4 = Math.sin(Math.sqrt(px * px + py * py) + t * 0.7);

        const value = (v1 + v2 + v3 + v4) * intensity;

        // Map to color palette
        const colorIndex = ((value + 4) / 8) * (colors.length - 1);
        const colorIdx1 = Math.floor(colorIndex) % colors.length;
        const colorIdx2 = (colorIdx1 + 1) % colors.length;
        const blend = colorIndex - Math.floor(colorIndex);

        const c1 = rgbColors[colorIdx1];
        const c2 = rgbColors[colorIdx2];

        const r = Math.floor(c1.r + (c2.r - c1.r) * blend);
        const g = Math.floor(c1.g + (c2.g - c1.g) * blend);
        const b = Math.floor(c1.b + (c2.b - c1.b) * blend);

        // Fill block
        for (let dy = 0; dy < resolution && y + dy < height; dy++) {
          for (let dx = 0; dx < resolution && x + dx < width; dx++) {
            const i = ((y + dy) * width + (x + dx)) * 4;
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
            data[i + 3] = Math.floor(255 * opacity);
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    animationRef.current = requestAnimationFrame(animate);
  }, [colors, speed, intensity, scale, opacity, resolution, prefersReducedMotion]);

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

export default PlasmaField;
