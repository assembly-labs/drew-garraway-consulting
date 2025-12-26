import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface SpaceFogProps {
  /** Number of fog layers */
  layerCount?: number;
  /** Fog colors */
  colors?: string[];
  /** Drift speed (0-1) */
  speed?: number;
  /** Fog density (0-1) */
  density?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Turbulence amount (0-1) */
  turbulence?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface FogLayer {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  speed: number;
  phase: number;
  amplitude: number;
}

/**
 * SpaceFog
 *
 * Rolling cosmic fog clouds that drift across the screen.
 * Creates an atmospheric, mysterious space environment.
 */
export const SpaceFog: React.FC<SpaceFogProps> = ({
  layerCount = 8,
  colors = ['#1e1b4b', '#312e81', '#3730a3', '#4338ca', '#4f46e5'],
  speed = 0.2,
  density = 0.6,
  opacity = 0.4,
  turbulence = 0.5,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layersRef = useRef<FogLayer[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initLayers = useCallback((width: number, height: number) => {
    const layers: FogLayer[] = [];

    for (let i = 0; i < layerCount; i++) {
      const layerWidth = width * (0.5 + Math.random() * 0.5) * density;
      const layerHeight = height * (0.3 + Math.random() * 0.4) * density;

      layers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        width: layerWidth,
        height: layerHeight,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 0.2 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        amplitude: 20 + Math.random() * 40 * turbulence,
      });
    }

    layersRef.current = layers;
  }, [layerCount, colors, density, turbulence]);

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

    layersRef.current.forEach((layer, index) => {
      if (!prefersReducedMotion) {
        layer.x += layer.speed * speed;
        layer.y = layer.y + Math.sin(timeRef.current + layer.phase) * 0.2 * turbulence;

        if (layer.x > width + layer.width / 2) {
          layer.x = -layer.width / 2;
          layer.y = Math.random() * height;
        }
      }

      const waveY = Math.sin(timeRef.current * layer.speed + layer.phase) * layer.amplitude;

      // Draw fog cloud with multiple overlapping ellipses
      const cloudParts = 5;
      for (let p = 0; p < cloudParts; p++) {
        const offsetX = (p - cloudParts / 2) * (layer.width / cloudParts) * 0.5;
        const offsetY = Math.sin(p * 1.5) * layer.height * 0.2 + waveY;
        const partWidth = layer.width * (0.6 + Math.random() * 0.2);
        const partHeight = layer.height * (0.6 + Math.random() * 0.2);

        const gradient = ctx.createRadialGradient(
          layer.x + offsetX,
          layer.y + offsetY,
          0,
          layer.x + offsetX,
          layer.y + offsetY,
          Math.max(partWidth, partHeight) / 2
        );

        gradient.addColorStop(0, layer.color);
        gradient.addColorStop(0.5, layer.color);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.ellipse(
          layer.x + offsetX,
          layer.y + offsetY,
          partWidth / 2,
          partHeight / 2,
          0,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = gradient;
        ctx.globalAlpha = opacity * (0.3 + (index / layerCount) * 0.4);
        ctx.fill();
      }
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, opacity, turbulence, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initLayers(canvas.width, canvas.height);
  }, [initLayers]);

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

export default SpaceFog;
