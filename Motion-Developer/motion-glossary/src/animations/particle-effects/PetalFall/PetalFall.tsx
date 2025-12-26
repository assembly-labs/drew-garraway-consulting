import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface PetalFallProps {
  /** Number of petals */
  petalCount?: number;
  /** Petal colors */
  colors?: string[];
  /** Fall speed (0-1) */
  speed?: number;
  /** Wind effect (0-1) */
  wind?: number;
  /** Rotation speed (0-1) */
  rotationSpeed?: number;
  /** Petal size range */
  sizeRange?: [number, number];
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  fallSpeed: number;
  swayPhase: number;
  swayAmplitude: number;
  flutter: number;
}

/**
 * PetalFall
 *
 * Beautiful falling flower petals with realistic flutter motion.
 * Perfect for romantic or spring-themed designs.
 */
export const PetalFall: React.FC<PetalFallProps> = ({
  petalCount = 40,
  colors = ['#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899'],
  speed = 0.4,
  wind = 0.3,
  rotationSpeed = 0.5,
  sizeRange = [8, 16],
  opacity = 0.8,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initPetals = useCallback((width: number, height: number) => {
    const petals: Petal[] = [];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        fallSpeed: 0.5 + Math.random() * 1,
        swayPhase: Math.random() * Math.PI * 2,
        swayAmplitude: 20 + Math.random() * 40,
        flutter: Math.random() * 0.5 + 0.5,
      });
    }

    petalsRef.current = petals;
  }, [petalCount, colors, sizeRange]);

  const drawPetal = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    rotation: number,
    color: string,
    petalOpacity: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Draw petal shape
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.bezierCurveTo(
      size * 0.8, -size * 0.8,
      size * 0.8, size * 0.5,
      0, size
    );
    ctx.bezierCurveTo(
      -size * 0.8, size * 0.5,
      -size * 0.8, -size * 0.8,
      0, -size
    );

    const gradient = ctx.createLinearGradient(0, -size, 0, size);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, '#ffffff');

    ctx.fillStyle = gradient;
    ctx.globalAlpha = petalOpacity;
    ctx.fill();

    // Add subtle vein
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.8);
    ctx.quadraticCurveTo(0, 0, 0, size * 0.8);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.restore();
  };

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    if (!prefersReducedMotion) {
      timeRef.current += 0.016;
    }

    ctx.clearRect(0, 0, width, height);

    petalsRef.current.forEach((petal) => {
      if (!prefersReducedMotion) {
        // Update position
        petal.y += petal.fallSpeed * speed * 2;
        petal.x += Math.sin(timeRef.current + petal.swayPhase) * petal.swayAmplitude * 0.02;
        petal.x += wind * petal.flutter;
        petal.rotation += petal.rotationSpeed * rotationSpeed;

        // Reset when off screen
        if (petal.y > height + petal.size) {
          petal.y = -petal.size * 2;
          petal.x = Math.random() * width;
        }
        if (petal.x > width + petal.size) petal.x = -petal.size;
        if (petal.x < -petal.size) petal.x = width + petal.size;
      }

      const flutter3D = Math.sin(timeRef.current * 3 + petal.swayPhase) * 0.3 + 0.7;
      drawPetal(ctx, petal.x, petal.y, petal.size * flutter3D, petal.rotation, petal.color, opacity);
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, wind, rotationSpeed, opacity, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initPetals(canvas.width, canvas.height);
  }, [initPetals]);

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

export default PetalFall;
