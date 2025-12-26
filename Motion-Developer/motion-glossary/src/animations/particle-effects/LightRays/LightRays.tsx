import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface LightRaysProps {
  /** Number of light rays */
  rayCount?: number;
  /** Ray color */
  color?: string;
  /** Animation speed (0-1) */
  speed?: number;
  /** Ray width range */
  widthRange?: [number, number];
  /** Light source position X (0-1) */
  sourceX?: number;
  /** Light source position Y (0-1) */
  sourceY?: number;
  /** Ray spread angle in degrees */
  spread?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface LightRay {
  angle: number;
  width: number;
  length: number;
  opacity: number;
  phase: number;
  phaseSpeed: number;
}

/**
 * LightRays
 *
 * Volumetric god rays / sunbeam effect.
 * Creates a dramatic, ethereal lighting atmosphere.
 */
export const LightRays: React.FC<LightRaysProps> = ({
  rayCount = 8,
  color = '#fef3c7',
  speed = 0.2,
  widthRange = [20, 80],
  sourceX = 0.5,
  sourceY = 0,
  spread = 60,
  opacity = 0.3,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raysRef = useRef<LightRay[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const spreadRad = (spread * Math.PI) / 180;

  const initRays = useCallback(() => {
    const rays: LightRay[] = [];

    for (let i = 0; i < rayCount; i++) {
      const baseAngle = Math.PI / 2; // Pointing down
      const angleOffset = ((i / (rayCount - 1)) - 0.5) * spreadRad;

      rays.push({
        angle: baseAngle + angleOffset,
        width: widthRange[0] + Math.random() * (widthRange[1] - widthRange[0]),
        length: 1.5 + Math.random() * 0.5,
        opacity: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.3 + Math.random() * 0.7,
      });
    }

    raysRef.current = rays;
  }, [rayCount, widthRange, spreadRad]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const originX = width * sourceX;
    const originY = height * sourceY;

    if (!prefersReducedMotion) {
      timeRef.current += 0.016;
    }

    ctx.clearRect(0, 0, width, height);

    // Draw source glow
    const sourceGlow = ctx.createRadialGradient(
      originX, originY, 0,
      originX, originY, 100
    );
    sourceGlow.addColorStop(0, `${color}`);
    sourceGlow.addColorStop(0.3, `${color}80`);
    sourceGlow.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(originX, originY, 100, 0, Math.PI * 2);
    ctx.fillStyle = sourceGlow;
    ctx.globalAlpha = opacity * 0.5;
    ctx.fill();

    // Draw rays
    raysRef.current.forEach((ray) => {
      if (!prefersReducedMotion) {
        ray.phase += ray.phaseSpeed * speed * 0.1;
      }

      const pulse = 0.5 + Math.sin(ray.phase) * 0.5;
      const currentOpacity = opacity * ray.opacity * pulse;
      const rayLength = Math.max(width, height) * ray.length;

      // Calculate ray end points
      const endX1 = originX + Math.cos(ray.angle - ray.width * 0.001) * rayLength;
      const endY1 = originY + Math.sin(ray.angle - ray.width * 0.001) * rayLength;
      const endX2 = originX + Math.cos(ray.angle + ray.width * 0.001) * rayLength;
      const endY2 = originY + Math.sin(ray.angle + ray.width * 0.001) * rayLength;

      // Create gradient for ray
      const gradient = ctx.createLinearGradient(originX, originY, endX1, endY1);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.1, `${color}80`);
      gradient.addColorStop(0.5, `${color}40`);
      gradient.addColorStop(1, 'transparent');

      // Draw ray as a triangle
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(endX1 - ray.width, endY1);
      ctx.lineTo(endX2 + ray.width, endY2);
      ctx.closePath();

      ctx.fillStyle = gradient;
      ctx.globalAlpha = currentOpacity;
      ctx.fill();

      // Add subtle glow to ray
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(endX1 - ray.width * 0.5, endY1);
      ctx.lineTo(endX2 + ray.width * 0.5, endY2);
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.globalAlpha = currentOpacity * 0.3;
      ctx.fill();
    });

    // Dust particles in light
    for (let i = 0; i < 20; i++) {
      const particleAngle = Math.PI / 2 + (Math.random() - 0.5) * spreadRad;
      const particleDist = Math.random() * Math.max(width, height) * 0.8;
      const px = originX + Math.cos(particleAngle) * particleDist;
      const py = originY + Math.sin(particleAngle) * particleDist;
      const particleSize = 1 + Math.random() * 2;

      const particlePulse = Math.sin(timeRef.current * 2 + i) * 0.5 + 0.5;

      ctx.beginPath();
      ctx.arc(px, py, particleSize, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity * 0.5 * particlePulse;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, sourceX, sourceY, spreadRad, opacity, color, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initRays();
  }, [initRays]);

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

export default LightRays;
