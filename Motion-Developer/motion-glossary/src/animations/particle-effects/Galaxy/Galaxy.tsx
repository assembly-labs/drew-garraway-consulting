import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface GalaxyProps {
  /** Number of stars in the galaxy */
  starCount?: number;
  /** Number of spiral arms */
  arms?: number;
  /** Maximum star size in pixels */
  maxStarSize?: number;
  /** Array of colors for stars */
  colors?: string[];
  /** Rotation speed (0-1) */
  speed?: number;
  /** Spiral tightness (higher = tighter) */
  spiralTightness?: number;
  /** Core glow intensity (0-1) */
  coreGlow?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface GalaxyStar {
  angle: number;
  distance: number;
  size: number;
  color: string;
  twinkleOffset: number;
  twinkleSpeed: number;
  armIndex: number;
  scatter: number;
}

/**
 * Galaxy
 *
 * A mesmerizing spiral galaxy effect with twinkling stars.
 * Perfect for space-themed backgrounds or creating a sense of wonder.
 */
export const Galaxy: React.FC<GalaxyProps> = ({
  starCount = 500,
  arms = 2,
  maxStarSize = 2,
  colors = ['#ffffff', '#fef3c7', '#bfdbfe', '#c4b5fd'],
  speed = 0.1,
  spiralTightness = 0.5,
  coreGlow = 0.5,
  opacity = 0.8,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<GalaxyStar[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  // Initialize stars
  const initStars = useCallback((radius: number) => {
    const stars: GalaxyStar[] = [];

    for (let i = 0; i < starCount; i++) {
      const armIndex = Math.floor(Math.random() * arms);
      const baseAngle = (armIndex / arms) * Math.PI * 2;

      // Distance from center with logarithmic distribution
      const distance = Math.pow(Math.random(), 0.5) * radius;

      // Spiral angle increases with distance
      const spiralAngle = baseAngle + distance * spiralTightness * 0.01;

      // Scatter perpendicular to spiral
      const scatter = (Math.random() - 0.5) * (distance * 0.15 + 10);

      // Stars closer to center are smaller on average
      const distanceRatio = distance / radius;
      const size = Math.random() * maxStarSize * (0.3 + distanceRatio * 0.7);

      stars.push({
        angle: spiralAngle,
        distance,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        twinkleOffset: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.5 + Math.random() * 2,
        armIndex,
        scatter,
      });
    }

    starsRef.current = stars;
  }, [starCount, arms, maxStarSize, colors, spiralTightness]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Update time
    if (!prefersReducedMotion) {
      timeRef.current += 0.016 * speed;
    }

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw core glow
    if (coreGlow > 0) {
      const coreRadius = Math.min(width, height) * 0.15;
      const coreGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, coreRadius
      );
      coreGradient.addColorStop(0, `rgba(255, 255, 255, ${coreGlow * 0.3})`);
      coreGradient.addColorStop(0.2, `rgba(255, 250, 230, ${coreGlow * 0.2})`);
      coreGradient.addColorStop(0.5, `rgba(200, 180, 255, ${coreGlow * 0.1})`);
      coreGradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();
    }

    // Draw stars
    starsRef.current.forEach((star) => {
      // Current angle with rotation
      const currentAngle = star.angle + timeRef.current;

      // Calculate position
      const x = centerX + Math.cos(currentAngle) * star.distance + Math.cos(currentAngle + Math.PI / 2) * star.scatter;
      const y = centerY + Math.sin(currentAngle) * star.distance + Math.sin(currentAngle + Math.PI / 2) * star.scatter;

      // Skip if outside canvas
      if (x < -star.size || x > width + star.size || y < -star.size || y > height + star.size) {
        return;
      }

      // Calculate twinkle
      let currentOpacity = opacity;
      if (!prefersReducedMotion) {
        const twinkle = Math.sin(timeRef.current * star.twinkleSpeed + star.twinkleOffset);
        currentOpacity = opacity * (0.5 + twinkle * 0.5);
      }

      // Draw star
      ctx.beginPath();
      ctx.arc(x, y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = currentOpacity;
      ctx.fill();

      // Add subtle glow for larger stars
      if (star.size > 1) {
        ctx.beginPath();
        ctx.arc(x, y, star.size * 2, 0, Math.PI * 2);
        ctx.globalAlpha = currentOpacity * 0.3;
        ctx.fill();
      }
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, coreGlow, opacity, prefersReducedMotion]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const radius = Math.min(canvas.width, canvas.height) * 0.45;
    initStars(radius);
  }, [initStars]);

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
      const radius = Math.min(canvas.width, canvas.height) * 0.45;
      initStars(radius);
    }
  }, [starCount, arms, maxStarSize, colors, spiralTightness, initStars]);

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

export default Galaxy;

export const galaxyCode = `import { useRef, useEffect } from 'react';

const Galaxy = ({
  starCount = 500,
  arms = 2,
  colors = ['#ffffff', '#fef3c7', '#bfdbfe'],
  speed = 0.1,
  spiralTightness = 0.5,
  opacity = 0.8,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let time = 0;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.45;

    const stars = Array.from({ length: starCount }, () => {
      const armIndex = Math.floor(Math.random() * arms);
      const distance = Math.pow(Math.random(), 0.5) * radius;
      const baseAngle = (armIndex / arms) * Math.PI * 2;

      return {
        angle: baseAngle + distance * spiralTightness * 0.01,
        distance,
        size: Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        twinkleOffset: Math.random() * Math.PI * 2,
      };
    });

    const animate = () => {
      time += 0.016 * speed;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        const angle = star.angle + time;
        const x = centerX + Math.cos(angle) * star.distance;
        const y = centerY + Math.sin(angle) * star.distance;

        const twinkle = Math.sin(time * 2 + star.twinkleOffset) * 0.5 + 0.5;

        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = opacity * twinkle;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} />;
};`;
