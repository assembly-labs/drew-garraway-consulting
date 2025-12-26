import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface HologramScanProps {
  /** Scan line color */
  color?: string;
  /** Secondary color */
  secondaryColor?: string;
  /** Scan speed (0-1) */
  speed?: number;
  /** Line spacing */
  lineSpacing?: number;
  /** Scan line thickness */
  lineThickness?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Scan direction */
  direction?: 'horizontal' | 'vertical';
  /** Show interference pattern */
  showInterference?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * HologramScan
 *
 * Futuristic holographic scanning line effect.
 * Creates a sci-fi display aesthetic.
 */
export const HologramScan: React.FC<HologramScanProps> = ({
  color = '#00ffff',
  secondaryColor = '#ff00ff',
  speed = 0.4,
  lineSpacing = 4,
  lineThickness = 1,
  opacity = 0.6,
  direction = 'horizontal',
  showInterference = true,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanPositionRef = useRef(0);
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
    const maxPos = direction === 'horizontal' ? height : width;

    if (!prefersReducedMotion) {
      scanPositionRef.current += speed * 3;
      timeRef.current += 0.016;
      if (scanPositionRef.current > maxPos + 100) {
        scanPositionRef.current = -100;
      }
    }

    ctx.clearRect(0, 0, width, height);

    // Draw scan lines (static)
    const lineCount = direction === 'horizontal'
      ? Math.floor(height / lineSpacing)
      : Math.floor(width / lineSpacing);

    for (let i = 0; i < lineCount; i++) {
      const pos = i * lineSpacing;
      const wave = showInterference ? Math.sin(i * 0.1 + timeRef.current * 2) * 0.3 : 0;

      ctx.beginPath();
      if (direction === 'horizontal') {
        ctx.moveTo(0, pos);
        ctx.lineTo(width, pos);
      } else {
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, height);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = lineThickness;
      ctx.globalAlpha = opacity * 0.15 * (0.7 + wave);
      ctx.stroke();
    }

    // Draw main scan line
    const scanPos = scanPositionRef.current;
    const scanWidth = 60;

    // Scan line gradient
    const gradient = direction === 'horizontal'
      ? ctx.createLinearGradient(0, scanPos - scanWidth, 0, scanPos + scanWidth)
      : ctx.createLinearGradient(scanPos - scanWidth, 0, scanPos + scanWidth, 0);

    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.3, color + '40');
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(0.7, color + '40');
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.globalAlpha = opacity;

    if (direction === 'horizontal') {
      ctx.fillRect(0, scanPos - scanWidth, width, scanWidth * 2);
    } else {
      ctx.fillRect(scanPos - scanWidth, 0, scanWidth * 2, height);
    }

    // Bright scan line
    ctx.beginPath();
    if (direction === 'horizontal') {
      ctx.moveTo(0, scanPos);
      ctx.lineTo(width, scanPos);
    } else {
      ctx.moveTo(scanPos, 0);
      ctx.lineTo(scanPos, height);
    }
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.globalAlpha = opacity;
    ctx.stroke();

    // Secondary color scan (offset)
    const secondaryScanPos = scanPos - 20;

    ctx.beginPath();
    if (direction === 'horizontal') {
      ctx.moveTo(0, secondaryScanPos);
      ctx.lineTo(width, secondaryScanPos);
    } else {
      ctx.moveTo(secondaryScanPos, 0);
      ctx.lineTo(secondaryScanPos, height);
    }
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = opacity * 0.5;
    ctx.stroke();

    // Interference pattern
    if (showInterference && !prefersReducedMotion) {
      for (let i = 0; i < 10; i++) {
        const interferencePos = (scanPos + i * 8) % maxPos;
        const interferenceOpacity = opacity * 0.3 * (1 - i / 10);

        ctx.beginPath();
        if (direction === 'horizontal') {
          ctx.moveTo(0, interferencePos);
          ctx.lineTo(width, interferencePos);
        } else {
          ctx.moveTo(interferencePos, 0);
          ctx.lineTo(interferencePos, height);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = interferenceOpacity;
        ctx.stroke();
      }
    }

    // Random glitch artifacts
    if (!prefersReducedMotion && Math.random() > 0.95) {
      const glitchY = Math.random() * height;
      const glitchWidth = 50 + Math.random() * 100;

      ctx.fillStyle = color;
      ctx.globalAlpha = opacity * 0.5;
      ctx.fillRect(
        Math.random() * width,
        glitchY,
        glitchWidth,
        2 + Math.random() * 5
      );
    }

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [color, secondaryColor, speed, lineSpacing, lineThickness, opacity, direction, showInterference, prefersReducedMotion]);

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

export default HologramScan;
