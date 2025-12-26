import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface NebulaProps {
  /** Number of nebula clouds */
  cloudCount?: number;
  /** Array of colors for the nebula */
  colors?: string[];
  /** Movement speed (0-1) */
  speed?: number;
  /** Cloud density (0-1) */
  density?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Blur amount in pixels */
  blur?: number;
  /** Animation complexity (0-1) */
  complexity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Cloud {
  x: number;
  y: number;
  radius: number;
  color: string;
  speedX: number;
  speedY: number;
  pulseOffset: number;
  pulseSpeed: number;
  opacity: number;
}

/**
 * Nebula
 *
 * Colorful, cloud-like cosmic nebula effect with shifting colors.
 * Creates a dreamy, otherworldly atmosphere perfect for hero sections.
 */
export const Nebula: React.FC<NebulaProps> = ({
  cloudCount = 6,
  colors = ['#8b5cf6', '#ec4899', '#3b82f6', '#06b6d4', '#10b981'],
  speed = 0.2,
  density = 0.6,
  opacity = 0.4,
  blur = 60,
  complexity = 0.5,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cloudsRef = useRef<Cloud[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  // Initialize clouds
  const initClouds = useCallback((width: number, height: number) => {
    const clouds: Cloud[] = [];
    const baseRadius = Math.min(width, height) * density * 0.4;

    for (let i = 0; i < cloudCount; i++) {
      clouds.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: baseRadius * (0.5 + Math.random() * 0.5),
        color: colors[i % colors.length],
        speedX: (Math.random() - 0.5) * speed * 0.5,
        speedY: (Math.random() - 0.5) * speed * 0.5,
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: (0.3 + Math.random() * 0.4) * complexity,
        opacity: opacity * (0.6 + Math.random() * 0.4),
      });
    }

    cloudsRef.current = clouds;
  }, [cloudCount, colors, speed, density, opacity, complexity]);

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

    // Draw clouds
    cloudsRef.current.forEach((cloud) => {
      if (!prefersReducedMotion) {
        // Move cloud
        cloud.x += cloud.speedX;
        cloud.y += cloud.speedY;

        // Wrap around with padding
        const padding = cloud.radius;
        if (cloud.x < -padding) cloud.x = width + padding;
        if (cloud.x > width + padding) cloud.x = -padding;
        if (cloud.y < -padding) cloud.y = height + padding;
        if (cloud.y > height + padding) cloud.y = -padding;
      }

      // Calculate pulse
      let currentRadius = cloud.radius;
      let currentOpacity = cloud.opacity;
      if (!prefersReducedMotion) {
        const pulse = Math.sin(timeRef.current * cloud.pulseSpeed + cloud.pulseOffset);
        currentRadius = cloud.radius * (0.9 + pulse * 0.1);
        currentOpacity = cloud.opacity * (0.8 + pulse * 0.2);
      }

      // Create gradient
      const gradient = ctx.createRadialGradient(
        cloud.x, cloud.y, 0,
        cloud.x, cloud.y, currentRadius
      );

      // Parse color and create gradient stops
      gradient.addColorStop(0, cloud.color + Math.round(currentOpacity * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(0.3, cloud.color + Math.round(currentOpacity * 0.6 * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(0.6, cloud.color + Math.round(currentOpacity * 0.3 * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, cloud.color + '00');

      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [prefersReducedMotion]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    initClouds(canvas.width, canvas.height);
  }, [initClouds]);

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
      initClouds(canvas.width, canvas.height);
    }
  }, [cloudCount, colors, speed, density, opacity, complexity, initClouds]);

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
        filter: `blur(${blur}px)`,
        ...style,
      }}
    />
  );
};

export default Nebula;

export const nebulaCode = `import { useRef, useEffect } from 'react';

const Nebula = ({
  cloudCount = 6,
  colors = ['#8b5cf6', '#ec4899', '#3b82f6', '#06b6d4'],
  speed = 0.2,
  opacity = 0.4,
  blur = 60,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let time = 0;

    const clouds = Array.from({ length: cloudCount }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.min(canvas.width, canvas.height) * 0.2,
      color: colors[i % colors.length],
      speedX: (Math.random() - 0.5) * speed * 0.5,
      speedY: (Math.random() - 0.5) * speed * 0.5,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      clouds.forEach(cloud => {
        cloud.x += cloud.speedX;
        cloud.y += cloud.speedY;

        // Wrap around
        if (cloud.x < -cloud.radius) cloud.x = canvas.width + cloud.radius;
        if (cloud.x > canvas.width + cloud.radius) cloud.x = -cloud.radius;
        if (cloud.y < -cloud.radius) cloud.y = canvas.height + cloud.radius;
        if (cloud.y > canvas.height + cloud.radius) cloud.y = -cloud.radius;

        const pulse = Math.sin(time * 0.5 + cloud.pulseOffset);
        const radius = cloud.radius * (0.9 + pulse * 0.1);

        const gradient = ctx.createRadialGradient(
          cloud.x, cloud.y, 0, cloud.x, cloud.y, radius
        );
        gradient.addColorStop(0, cloud.color + '66');
        gradient.addColorStop(0.5, cloud.color + '33');
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ filter: \`blur(\${blur}px)\` }}
    />
  );
};`;
