import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface BinaryRainProps {
  /** Column density */
  columnCount?: number;
  /** Primary color */
  color?: string;
  /** Highlight color */
  highlightColor?: string;
  /** Fall speed (0-1) */
  speed?: number;
  /** Font size */
  fontSize?: number;
  /** Trail fade length */
  trailLength?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Column {
  x: number;
  y: number;
  speed: number;
  length: number;
  chars: string[];
}

/**
 * BinaryRain
 *
 * Binary 0s and 1s falling like digital rain.
 * Creates a classic hacker/code aesthetic.
 */
export const BinaryRain: React.FC<BinaryRainProps> = ({
  columnCount = 40,
  color = '#00ff41',
  highlightColor = '#ffffff',
  speed = 0.5,
  fontSize = 14,
  trailLength = 20,
  opacity = 0.8,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnsRef = useRef<Column[]>([]);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initColumns = useCallback((width: number, height: number) => {
    const columns: Column[] = [];
    const spacing = width / columnCount;

    for (let i = 0; i < columnCount; i++) {
      const chars: string[] = [];
      const length = 10 + Math.floor(Math.random() * trailLength);

      for (let j = 0; j < length; j++) {
        chars.push(Math.random() > 0.5 ? '1' : '0');
      }

      columns.push({
        x: i * spacing + spacing / 2,
        y: Math.random() * height - height,
        speed: 2 + Math.random() * 4,
        length,
        chars,
      });
    }

    columnsRef.current = columns;
  }, [columnCount, trailLength]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Semi-transparent clear for trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${fontSize}px monospace`;
    ctx.textAlign = 'center';

    columnsRef.current.forEach((column) => {
      if (!prefersReducedMotion) {
        column.y += column.speed * speed;

        // Randomly change characters
        if (Math.random() > 0.95) {
          const randomIndex = Math.floor(Math.random() * column.chars.length);
          column.chars[randomIndex] = Math.random() > 0.5 ? '1' : '0';
        }

        // Reset when off screen
        if (column.y - column.length * fontSize > height) {
          column.y = -column.length * fontSize;
          column.speed = 2 + Math.random() * 4;
        }
      }

      // Draw characters
      column.chars.forEach((char, i) => {
        const charY = column.y - i * fontSize;

        if (charY < -fontSize || charY > height + fontSize) return;

        const fadeRatio = 1 - i / column.chars.length;
        const currentOpacity = opacity * fadeRatio;

        if (i === 0) {
          // Leading character (brightest)
          ctx.fillStyle = highlightColor;
          ctx.globalAlpha = opacity;

          // Glow effect
          ctx.shadowColor = highlightColor;
          ctx.shadowBlur = 10;
        } else if (i < 3) {
          // Near-leading characters
          ctx.fillStyle = highlightColor;
          ctx.globalAlpha = currentOpacity * 0.8;
          ctx.shadowBlur = 5;
        } else {
          // Trail characters
          ctx.fillStyle = color;
          ctx.globalAlpha = currentOpacity;
          ctx.shadowBlur = 0;
        }

        ctx.fillText(char, column.x, charY);
      });

      ctx.shadowBlur = 0;
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, fontSize, color, highlightColor, opacity, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    // Clear canvas to black
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    initColumns(canvas.width, canvas.height);
  }, [initColumns]);

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
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        ...style,
      }}
    />
  );
};

export default BinaryRain;
