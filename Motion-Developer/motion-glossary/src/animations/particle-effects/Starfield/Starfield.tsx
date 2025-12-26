import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface StarfieldProps {
  /** Number of stars */
  starCount?: number;
  /** Maximum star size in pixels */
  maxStarSize?: number;
  /** Star color */
  color?: string;
  /** Twinkle speed (0-1) */
  twinkleSpeed?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Parallax effect on mouse move (0 = none, 1 = strong) */
  parallaxStrength?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkleOffset: number;
  twinkleSpeed: number;
  layer: number; // 1-3 for parallax depth
}

/**
 * Starfield
 *
 * Twinkling points of light like a night sky.
 * Subtle parallax movement on mouse interaction.
 */
export const Starfield: React.FC<StarfieldProps> = ({
  starCount = 100,
  maxStarSize = 3,
  color = '#ffffff',
  twinkleSpeed = 0.5,
  opacity = 0.8,
  parallaxStrength = 0.3,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5 }); // Normalized 0-1
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  // Initialize stars
  const initStars = useCallback((width: number, height: number) => {
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      const layer = Math.ceil(Math.random() * 3); // 1, 2, or 3
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * maxStarSize * (layer / 3), // Distant stars smaller
        baseOpacity: opacity * (0.4 + Math.random() * 0.6),
        twinkleOffset: Math.random() * Math.PI * 2,
        twinkleSpeed: (0.5 + Math.random() * 0.5) * twinkleSpeed,
        layer,
      });
    }
    starsRef.current = stars;
  }, [starCount, maxStarSize, opacity, twinkleSpeed]);

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
      timeRef.current += 0.016; // ~60fps
    }

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate parallax offset based on mouse position
    const parallaxX = (mouseRef.current.x - 0.5) * parallaxStrength * 50;
    const parallaxY = (mouseRef.current.y - 0.5) * parallaxStrength * 50;

    // Draw stars
    starsRef.current.forEach((star) => {
      // Calculate twinkle
      let currentOpacity = star.baseOpacity;
      if (!prefersReducedMotion) {
        const twinkle = Math.sin(timeRef.current * star.twinkleSpeed * 3 + star.twinkleOffset);
        currentOpacity = star.baseOpacity * (0.5 + twinkle * 0.5);
      }

      // Calculate parallax position based on layer
      const layerMultiplier = star.layer / 3;
      let drawX = star.x;
      let drawY = star.y;

      if (!prefersReducedMotion) {
        drawX = star.x + parallaxX * layerMultiplier;
        drawY = star.y + parallaxY * layerMultiplier;
      }

      // Wrap around edges
      if (drawX < 0) drawX += width;
      if (drawX > width) drawX -= width;
      if (drawY < 0) drawY += height;
      if (drawY > height) drawY -= height;

      // Draw star with glow effect
      ctx.beginPath();
      ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = currentOpacity;
      ctx.fill();

      // Add subtle glow for larger stars
      if (star.size > 1.5) {
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = currentOpacity * 0.2;
        ctx.fill();
      }
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [color, parallaxStrength, prefersReducedMotion]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    initStars(canvas.width, canvas.height);
  }, [initStars]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: 0.5, y: 0.5 };
  }, []);

  // Setup
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleResize, handleMouseMove, handleMouseLeave, animate]);

  // Re-init when props change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      initStars(canvas.width, canvas.height);
    }
  }, [starCount, maxStarSize, opacity, twinkleSpeed, initStars]);

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
        pointerEvents: parallaxStrength > 0 ? 'auto' : 'none',
        ...style,
      }}
    />
  );
};

export default Starfield;

export const starfieldCode = `import { useRef, useEffect } from 'react';

const Starfield = ({
  starCount = 100,
  color = '#ffffff',
  twinkleSpeed = 0.5,
  opacity = 0.8,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let time = 0;

    // Initialize stars
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        const twinkle = Math.sin(time * twinkleSpeed * 3 + star.twinkleOffset);
        const currentOpacity = opacity * (0.5 + twinkle * 0.5);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = currentOpacity;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} />;
};`;

export const starfieldCssCode = `/* CSS cannot create true star twinkling effects.
   Use the JavaScript/Canvas implementation.

   For a CSS-only approximation, you could use
   multiple positioned elements with animations,
   but this is limited and performance-heavy. */

.starfield {
  position: relative;
  overflow: hidden;
  background: #0a0a0a;
}

/* Example single star */
.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: twinkle 2s infinite ease-in-out;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}`;
