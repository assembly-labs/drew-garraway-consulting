import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface FloatingParticlesProps {
  /** Number of particles */
  particleCount?: number;
  /** Base particle size in pixels */
  particleSize?: number;
  /** Particle color */
  color?: string;
  /** Movement speed (0-1) */
  speed?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Mouse interaction strength (0 = none, 1 = strong) */
  mouseInfluence?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

/**
 * FloatingParticles
 *
 * Gentle drifting particles like dust motes in sunlight.
 * Subtle, ambient background effect with mouse interactivity.
 */
export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  particleCount = 50,
  particleSize = 3,
  color = '#ffffff',
  speed = 0.3,
  opacity = 0.5,
  mouseInfluence = 0.3,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  // Initialize particles
  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: particleSize * (0.5 + Math.random() * 0.5),
        speedX: (Math.random() - 0.5) * speed,
        speedY: (Math.random() - 0.5) * speed,
        opacity: opacity * (0.5 + Math.random() * 0.5),
      });
    }
    particlesRef.current = particles;
  }, [particleCount, particleSize, speed, opacity]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    particlesRef.current.forEach((particle) => {
      // Mouse influence
      if (mouseInfluence > 0) {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 150;

        if (dist < maxDist) {
          const force = (1 - dist / maxDist) * mouseInfluence * 0.5;
          particle.x -= (dx / dist) * force;
          particle.y -= (dy / dist) * force;
        }
      }

      // Move particle (skip if reduced motion)
      if (!prefersReducedMotion) {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = particle.opacity;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [color, mouseInfluence, prefersReducedMotion]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    initParticles(canvas.width, canvas.height);
  }, [initParticles]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
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
      initParticles(canvas.width, canvas.height);
    }
  }, [particleCount, particleSize, speed, opacity, initParticles]);

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
        pointerEvents: mouseInfluence > 0 ? 'auto' : 'none',
        ...style,
      }}
    />
  );
};

export default FloatingParticles;

export const floatingParticlesCode = `import { useRef, useEffect } from 'react';

const FloatingParticles = ({
  particleCount = 50,
  color = '#ffffff',
  speed = 0.3,
  opacity = 0.5,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Initialize particles
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speedX: (Math.random() - 0.5) * speed,
      speedY: (Math.random() - 0.5) * speed,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
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

export const floatingParticlesCssCode = `/* CSS cannot create true particle systems.
   Use the JavaScript/Canvas implementation.

   For a CSS-only approximation, you could use
   multiple animated pseudo-elements, but this
   doesn't scale well beyond 10-20 particles. */

.particle-container {
  position: relative;
  overflow: hidden;
}

/* Example single particle */
.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: float 10s infinite ease-in-out;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(20px, -30px); }
  50% { transform: translate(-10px, 20px); }
  75% { transform: translate(30px, 10px); }
}`;
