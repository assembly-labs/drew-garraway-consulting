import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface PulsarProps {
  /** Number of beam particles */
  particleCount?: number;
  /** Beam colors */
  colors?: string[];
  /** Rotation speed (0-1) */
  speed?: number;
  /** Beam width in degrees */
  beamWidth?: number;
  /** Pulse frequency (0-1) */
  pulseFrequency?: number;
  /** Core size */
  coreSize?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Number of beams */
  beamCount?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * Pulsar
 *
 * A rotating pulsar effect with sweeping energy beams.
 * Creates a dramatic sci-fi lighthouse effect.
 */
export const Pulsar: React.FC<PulsarProps> = ({
  particleCount = 50,
  colors = ['#06b6d4', '#3b82f6', '#8b5cf6'],
  speed = 0.3,
  beamWidth = 30,
  pulseFrequency = 0.5,
  coreSize = 15,
  opacity = 0.8,
  beamCount = 2,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.max(width, height);

    if (!prefersReducedMotion) {
      timeRef.current += 0.016 * speed;
    }

    ctx.clearRect(0, 0, width, height);

    const beamWidthRad = (beamWidth * Math.PI) / 180;
    const pulse = 0.5 + Math.sin(timeRef.current * pulseFrequency * 10) * 0.5;

    // Draw beams
    for (let b = 0; b < beamCount; b++) {
      const baseAngle = timeRef.current + (b * Math.PI * 2) / beamCount;

      // Main beam gradient
      for (let i = 0; i < 10; i++) {
        const beamOpacity = opacity * pulse * (1 - i / 10) * 0.3;
        const currentWidth = beamWidthRad * (1 + i * 0.1);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, maxRadius, baseAngle - currentWidth / 2, baseAngle + currentWidth / 2);
        ctx.closePath();

        const gradient = ctx.createRadialGradient(
          centerX, centerY, coreSize,
          centerX, centerY, maxRadius * 0.8
        );
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(0.3, colors[1] || colors[0]);
        gradient.addColorStop(0.6, colors[2] || colors[0]);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.globalAlpha = beamOpacity;
        ctx.fill();
      }

      // Beam particles
      for (let p = 0; p < particleCount; p++) {
        const particleAngle = baseAngle + (Math.random() - 0.5) * beamWidthRad * 0.8;
        const distance = coreSize + Math.random() * (maxRadius - coreSize);
        const size = 1 + Math.random() * 2;

        const x = centerX + Math.cos(particleAngle) * distance;
        const y = centerY + Math.sin(particleAngle) * distance;

        if (x >= 0 && x <= width && y >= 0 && y <= height) {
          const particleOpacity = opacity * pulse * (1 - distance / maxRadius);

          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
          ctx.globalAlpha = particleOpacity;
          ctx.fill();
        }
      }
    }

    // Draw core glow
    const coreGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, coreSize * 3
    );
    coreGradient.addColorStop(0, '#ffffff');
    coreGradient.addColorStop(0.2, colors[0]);
    coreGradient.addColorStop(0.5, colors[1] || colors[0]);
    coreGradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(centerX, centerY, coreSize * 3, 0, Math.PI * 2);
    ctx.fillStyle = coreGradient;
    ctx.globalAlpha = opacity * (0.5 + pulse * 0.5);
    ctx.fill();

    // Draw solid core
    ctx.beginPath();
    ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 1;
    ctx.fill();

    animationRef.current = requestAnimationFrame(animate);
  }, [speed, beamWidth, pulseFrequency, coreSize, opacity, beamCount, colors, particleCount, prefersReducedMotion]);

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

export default Pulsar;
