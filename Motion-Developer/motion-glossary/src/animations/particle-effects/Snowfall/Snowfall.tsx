import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface SnowfallProps {
  /** Number of snowflakes */
  snowflakeCount?: number;
  /** Minimum snowflake size in pixels */
  minSize?: number;
  /** Maximum snowflake size in pixels */
  maxSize?: number;
  /** Snowflake color */
  color?: string;
  /** Fall speed (0-1) */
  speed?: number;
  /** Wind effect (-1 to 1, negative = left, positive = right) */
  wind?: number;
  /** Sway amount (0-1) */
  sway?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Snowflake {
  x: number;
  y: number;
  size: number;
  speedY: number;
  swayOffset: number;
  swaySpeed: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

/**
 * Snowfall
 *
 * Gentle falling snowflakes with natural sway and wind effects.
 * Perfect for winter themes or creating a calm, peaceful atmosphere.
 */
export const Snowfall: React.FC<SnowfallProps> = ({
  snowflakeCount = 100,
  minSize = 2,
  maxSize = 6,
  color = '#ffffff',
  speed = 0.5,
  wind = 0,
  sway = 0.5,
  opacity = 0.8,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowflakesRef = useRef<Snowflake[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  // Initialize snowflakes
  const initSnowflakes = useCallback((width: number, height: number) => {
    const snowflakes: Snowflake[] = [];
    for (let i = 0; i < snowflakeCount; i++) {
      const size = minSize + Math.random() * (maxSize - minSize);
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height * 2 - height, // Start above and within view
        size,
        speedY: (0.3 + Math.random() * 0.7) * speed * (size / maxSize), // Bigger = faster
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: (0.5 + Math.random() * 0.5) * 1.5,
        opacity: opacity * (0.5 + Math.random() * 0.5),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }
    snowflakesRef.current = snowflakes;
  }, [snowflakeCount, minSize, maxSize, speed, opacity]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Update time
    if (!prefersReducedMotion) {
      timeRef.current += 0.016;
    }

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Update and draw snowflakes
    snowflakesRef.current.forEach((flake) => {
      if (!prefersReducedMotion) {
        // Apply gravity
        flake.y += flake.speedY;

        // Apply wind
        flake.x += wind * 0.5;

        // Apply sway
        const swayAmount = Math.sin(timeRef.current * flake.swaySpeed + flake.swayOffset) * sway * 2;
        flake.x += swayAmount * 0.1;

        // Rotate
        flake.rotation += flake.rotationSpeed;

        // Reset when off bottom or sides
        if (flake.y > height + flake.size) {
          flake.y = -flake.size;
          flake.x = Math.random() * width;
        }
        if (flake.x < -flake.size) flake.x = width + flake.size;
        if (flake.x > width + flake.size) flake.x = -flake.size;
      }

      // Draw snowflake
      ctx.save();
      ctx.translate(flake.x, flake.y);
      ctx.rotate(flake.rotation);
      ctx.globalAlpha = flake.opacity;
      ctx.fillStyle = color;

      // Simple circle for small flakes, star shape for larger
      if (flake.size < 4) {
        ctx.beginPath();
        ctx.arc(0, 0, flake.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Draw 6-pointed star
        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -flake.size);
          ctx.strokeStyle = color;
          ctx.lineWidth = flake.size * 0.2;
          ctx.lineCap = 'round';
          ctx.stroke();
          ctx.rotate(Math.PI / 3);
        }
        // Center dot
        ctx.beginPath();
        ctx.arc(0, 0, flake.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [color, wind, sway, prefersReducedMotion]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    initSnowflakes(canvas.width, canvas.height);
  }, [initSnowflakes]);

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
      initSnowflakes(canvas.width, canvas.height);
    }
  }, [snowflakeCount, minSize, maxSize, speed, opacity, initSnowflakes]);

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

export default Snowfall;

export const snowfallCode = `import { useRef, useEffect } from 'react';

const Snowfall = ({
  snowflakeCount = 100,
  color = '#ffffff',
  speed = 0.5,
  wind = 0,
  sway = 0.5,
  opacity = 0.8,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let time = 0;

    const snowflakes = Array.from({ length: snowflakeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 2 + Math.random() * 4,
      speedY: (0.3 + Math.random() * 0.7) * speed,
      swayOffset: Math.random() * Math.PI * 2,
    }));

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      snowflakes.forEach(flake => {
        flake.y += flake.speedY;
        flake.x += wind * 0.5;
        flake.x += Math.sin(time * 1.5 + flake.swayOffset) * sway * 0.2;

        if (flake.y > canvas.height) {
          flake.y = -flake.size;
          flake.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} />;
};`;
