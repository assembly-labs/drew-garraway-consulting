import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface TimeWarpProps {
  /** Number of time particles */
  particleCount?: number;
  /** Particle colors */
  colors?: string[];
  /** Warp speed (0-1) */
  speed?: number;
  /** Distortion intensity (0-1) */
  distortion?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface TimeParticle {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  timeOffset: number;
}

/**
 * TimeWarp
 *
 * Time distortion / hyperspace effect.
 * Creates a sci-fi time travel aesthetic.
 */
export const TimeWarp: React.FC<TimeWarpProps> = ({
  particleCount = 200,
  colors = ['#ffffff', '#bfdbfe', '#c4b5fd', '#fbcfe8'],
  speed = 0.5,
  distortion = 0.7,
  opacity = 0.9,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<TimeParticle[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initParticles = useCallback(() => {
    const particles: TimeParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
        z: Math.random(),
        size: 1 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        timeOffset: Math.random() * Math.PI * 2,
      });
    }

    particlesRef.current = particles;
  }, [particleCount, colors]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    if (!prefersReducedMotion) {
      timeRef.current += 0.016 * speed;
    }

    ctx.clearRect(0, 0, width, height);

    // Time vortex center
    const vortexGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, Math.min(width, height) * 0.1
    );
    vortexGradient.addColorStop(0, '#ffffff');
    vortexGradient.addColorStop(0.3, colors[0] + '80');
    vortexGradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.min(width, height) * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = vortexGradient;
    ctx.globalAlpha = opacity * 0.5;
    ctx.fill();

    // Update and draw particles
    particlesRef.current.forEach((particle) => {
      if (!prefersReducedMotion) {
        particle.z -= 0.02 * speed;

        if (particle.z <= 0) {
          particle.z = 1;
          particle.x = (Math.random() - 0.5) * 2;
          particle.y = (Math.random() - 0.5) * 2;
        }
      }

      const perspective = 1 / particle.z;
      const timeDistort = Math.sin(timeRef.current * 3 + particle.timeOffset) * distortion * 0.1;

      const screenX = centerX + particle.x * perspective * width * 0.5 * (1 + timeDistort);
      const screenY = centerY + particle.y * perspective * height * 0.5 * (1 + timeDistort);

      if (screenX < 0 || screenX > width || screenY < 0 || screenY > height) return;

      const size = particle.size * perspective * 3;

      // Calculate trail end position
      const trailX = centerX + particle.x * (1 / (particle.z + 0.1)) * width * 0.5;
      const trailY = centerY + particle.y * (1 / (particle.z + 0.1)) * height * 0.5;

      // Draw trail
      const gradient = ctx.createLinearGradient(screenX, screenY, trailX, trailY);
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.moveTo(screenX, screenY);
      ctx.lineTo(trailX, trailY);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = size * 0.5;
      ctx.lineCap = 'round';
      ctx.globalAlpha = opacity * (1 - particle.z);
      ctx.stroke();

      // Draw particle head
      ctx.beginPath();
      ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = opacity * (1 - particle.z);
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(screenX, screenY, size * 2, 0, Math.PI * 2);
      ctx.globalAlpha = opacity * 0.3 * (1 - particle.z);
      ctx.fill();
    });

    // Time ring effects
    for (let r = 0; r < 3; r++) {
      const ringProgress = ((timeRef.current * 0.5 + r * 0.33) % 1);
      const ringRadius = ringProgress * Math.min(width, height) * 0.4;
      const ringOpacity = (1 - ringProgress) * 0.5;

      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = colors[r % colors.length];
      ctx.lineWidth = 2;
      ctx.globalAlpha = opacity * ringOpacity;
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, distortion, colors, opacity, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initParticles();
  }, [initParticles]);

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

export default TimeWarp;
