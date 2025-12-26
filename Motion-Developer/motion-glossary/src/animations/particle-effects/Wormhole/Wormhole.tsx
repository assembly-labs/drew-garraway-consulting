import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface WormholeProps {
  /** Number of tunnel rings */
  ringCount?: number;
  /** Particles per ring */
  particlesPerRing?: number;
  /** Tunnel colors */
  colors?: string[];
  /** Travel speed (0-1) */
  speed?: number;
  /** Tunnel depth effect (0-1) */
  depth?: number;
  /** Rotation speed (0-1) */
  rotationSpeed?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface TunnelRing {
  z: number;
  rotation: number;
  particles: { angle: number; size: number }[];
}

/**
 * Wormhole
 *
 * A mesmerizing tunnel/vortex effect simulating traveling through a wormhole.
 * Creates an immersive depth illusion.
 */
export const Wormhole: React.FC<WormholeProps> = ({
  ringCount = 20,
  particlesPerRing = 24,
  colors = ['#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#ec4899'],
  speed = 0.4,
  depth = 0.8,
  rotationSpeed = 0.2,
  opacity = 0.8,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringsRef = useRef<TunnelRing[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initRings = useCallback(() => {
    const rings: TunnelRing[] = [];

    for (let i = 0; i < ringCount; i++) {
      const particles = [];
      for (let p = 0; p < particlesPerRing; p++) {
        particles.push({
          angle: (p / particlesPerRing) * Math.PI * 2,
          size: 2 + Math.random() * 3,
        });
      }

      rings.push({
        z: i / ringCount,
        rotation: Math.random() * Math.PI * 2,
        particles,
      });
    }

    ringsRef.current = rings;
  }, [ringCount, particlesPerRing]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.45;

    if (!prefersReducedMotion) {
      timeRef.current += 0.016;
    }

    ctx.clearRect(0, 0, width, height);

    // Sort rings by z for proper depth rendering
    const sortedRings = [...ringsRef.current].sort((a, b) => b.z - a.z);

    sortedRings.forEach((ring) => {
      if (!prefersReducedMotion) {
        ring.z -= speed * 0.02;
        ring.rotation += rotationSpeed * 0.02;

        if (ring.z <= 0) {
          ring.z = 1;
        }
      }

      const perspective = Math.pow(ring.z, depth);
      const radius = maxRadius * perspective;
      const ringOpacity = opacity * (1 - perspective * 0.5);

      // Color based on depth
      const colorIndex = Math.floor((1 - ring.z) * colors.length);
      const color = colors[Math.min(colorIndex, colors.length - 1)];

      // Draw ring glow
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2 * (1 - perspective) + 1;
      ctx.globalAlpha = ringOpacity * 0.3;
      ctx.stroke();

      // Draw particles on ring
      ring.particles.forEach((particle) => {
        const particleAngle = particle.angle + ring.rotation;
        const x = centerX + Math.cos(particleAngle) * radius;
        const y = centerY + Math.sin(particleAngle) * radius;
        const size = particle.size * (1 - perspective * 0.5);

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = ringOpacity;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.globalAlpha = ringOpacity * 0.3;
        ctx.fill();
      });
    });

    // Draw center glow
    const centerGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, maxRadius * 0.3
    );
    centerGradient.addColorStop(0, '#ffffff');
    centerGradient.addColorStop(0.3, colors[colors.length - 1]);
    centerGradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = centerGradient;
    ctx.globalAlpha = opacity * 0.5;
    ctx.fill();

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, depth, rotationSpeed, opacity, colors, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initRings();
  }, [initRings]);

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

export default Wormhole;
