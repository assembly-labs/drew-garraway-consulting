import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface MatrixRainProps {
  /** Number of columns */
  columnCount?: number;
  /** Character set to use */
  characters?: string;
  /** Primary color */
  color?: string;
  /** Highlight color for leading characters */
  highlightColor?: string;
  /** Fall speed (0-1) */
  speed?: number;
  /** Font size in pixels */
  fontSize?: number;
  /** Fade trail length (0-1) */
  fadeLength?: number;
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
  characters: string[];
  length: number;
}

/**
 * MatrixRain
 *
 * Falling characters like the iconic Matrix movie effect.
 * Creates a techy, cyberpunk aesthetic with customizable characters.
 */
export const MatrixRain: React.FC<MatrixRainProps> = ({
  columnCount = 0, // 0 = auto-calculate based on width
  characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  color = '#22c55e',
  highlightColor = '#ffffff',
  speed = 0.5,
  fontSize = 14,
  fadeLength = 0.6,
  opacity = 0.8,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnsRef = useRef<Column[]>([]);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  // Get random character
  const getRandomChar = useCallback(() => {
    return characters[Math.floor(Math.random() * characters.length)];
  }, [characters]);

  // Initialize columns
  const initColumns = useCallback((width: number, height: number) => {
    const cols: Column[] = [];
    const numColumns = columnCount || Math.floor(width / fontSize);
    const maxLength = Math.floor(height / fontSize);

    for (let i = 0; i < numColumns; i++) {
      const length = Math.floor(5 + Math.random() * (maxLength * fadeLength));
      const chars = Array.from({ length }, () => getRandomChar());

      cols.push({
        x: i * fontSize + fontSize / 2,
        y: Math.random() * height * -1, // Start above canvas
        speed: (0.5 + Math.random() * 0.5) * speed * fontSize * 0.5,
        characters: chars,
        length,
      });
    }

    columnsRef.current = cols;
  }, [columnCount, fontSize, speed, fadeLength, getRandomChar]);

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Calculate delta time for consistent animation
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    // Semi-transparent black overlay for fade effect
    ctx.fillStyle = `rgba(0, 0, 0, 0.05)`;
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${fontSize}px monospace`;
    ctx.textAlign = 'center';

    columnsRef.current.forEach((column) => {
      if (!prefersReducedMotion) {
        // Move column down
        column.y += column.speed * (deltaTime / 16);

        // Occasionally change a random character
        if (Math.random() < 0.02) {
          const idx = Math.floor(Math.random() * column.characters.length);
          column.characters[idx] = getRandomChar();
        }

        // Reset when fully off screen
        if (column.y - column.length * fontSize > height) {
          column.y = Math.random() * height * -0.5;
          column.length = Math.floor(5 + Math.random() * (height / fontSize * fadeLength));
          column.characters = Array.from({ length: column.length }, () => getRandomChar());
        }
      }

      // Draw characters
      column.characters.forEach((char, idx) => {
        const charY = column.y - idx * fontSize;

        // Skip if off screen
        if (charY < -fontSize || charY > height + fontSize) return;

        // Calculate opacity based on position in trail
        const progress = idx / column.length;
        const charOpacity = (1 - progress) * opacity;

        if (idx === 0) {
          // Leading character is brightest
          ctx.fillStyle = highlightColor;
          ctx.globalAlpha = opacity;
        } else {
          ctx.fillStyle = color;
          ctx.globalAlpha = charOpacity;
        }

        ctx.fillText(char, column.x, charY);
      });
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [fontSize, color, highlightColor, opacity, fadeLength, getRandomChar, prefersReducedMotion]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    // Fill with black initially
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    initColumns(canvas.width, canvas.height);
  }, [initColumns]);

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
      initColumns(canvas.width, canvas.height);
    }
  }, [columnCount, characters, fontSize, speed, fadeLength, initColumns]);

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
        backgroundColor: 'black',
        ...style,
      }}
    />
  );
};

export default MatrixRain;

export const matrixRainCode = `import { useRef, useEffect } from 'react';

const MatrixRain = ({
  characters = 'アイウエオカキクケコ0123456789ABCDEF',
  color = '#22c55e',
  highlightColor = '#ffffff',
  speed = 0.5,
  fontSize = 14,
  opacity = 0.8,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const getRandomChar = () =>
      characters[Math.floor(Math.random() * characters.length)];

    const columns = [];
    const numColumns = Math.floor(canvas.width / fontSize);

    for (let i = 0; i < numColumns; i++) {
      const length = 5 + Math.floor(Math.random() * 20);
      columns.push({
        x: i * fontSize + fontSize / 2,
        y: Math.random() * canvas.height * -1,
        speed: (0.5 + Math.random() * 0.5) * speed * fontSize * 0.5,
        characters: Array.from({ length }, getRandomChar),
      });
    }

    const animate = () => {
      // Fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = \`\${fontSize}px monospace\`;
      ctx.textAlign = 'center';

      columns.forEach(col => {
        col.y += col.speed;

        if (col.y > canvas.height + col.characters.length * fontSize) {
          col.y = Math.random() * canvas.height * -0.5;
        }

        col.characters.forEach((char, idx) => {
          const y = col.y - idx * fontSize;
          if (y < -fontSize || y > canvas.height + fontSize) return;

          ctx.fillStyle = idx === 0 ? highlightColor : color;
          ctx.globalAlpha = (1 - idx / col.characters.length) * opacity;
          ctx.fillText(char, col.x, y);
        });
      });

      requestAnimationFrame(animate);
    };

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    animate();
  }, []);

  return <canvas ref={canvasRef} style={{ backgroundColor: 'black' }} />;
};`;
