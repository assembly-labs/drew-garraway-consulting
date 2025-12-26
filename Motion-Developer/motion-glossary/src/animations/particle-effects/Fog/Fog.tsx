import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface FogProps {
  /** Number of fog layers */
  layerCount?: number;
  /** Fog color */
  color?: string;
  /** Drift speed (0-1) */
  speed?: number;
  /** Fog density (0-1) */
  density?: number;
  /** Vertical position (0-1, 0=top, 1=bottom) */
  verticalPosition?: number;
  /** Fog height as ratio of screen */
  height?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface FogLayer {
  x: number;
  width: number;
  height: number;
  speed: number;
  opacity: number;
  phase: number;
}

/**
 * Fog
 *
 * Atmospheric ground fog effect with rolling movement.
 * Creates a mysterious, moody atmosphere.
 */
export const Fog: React.FC<FogProps> = ({
  layerCount = 6,
  color = '#f8fafc',
  speed = 0.15,
  density = 0.6,
  verticalPosition = 0.7,
  height = 0.4,
  opacity = 0.5,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layersRef = useRef<FogLayer[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initLayers = useCallback((width: number, canvasHeight: number) => {
    const layers: FogLayer[] = [];

    for (let i = 0; i < layerCount; i++) {
      const layerWidth = width * (1.5 + Math.random());

      layers.push({
        x: Math.random() * width - layerWidth * 0.25,
        width: layerWidth,
        height: canvasHeight * height * (0.6 + Math.random() * 0.6) * density,
        speed: (0.5 + Math.random() * 1) * (i % 2 === 0 ? 1 : -0.5),
        opacity: (0.3 + Math.random() * 0.4) * density,
        phase: Math.random() * Math.PI * 2,
      });
    }

    layersRef.current = layers;
  }, [layerCount, height, density]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const canvasHeight = canvas.height;
    const fogY = canvasHeight * verticalPosition;

    if (!prefersReducedMotion) {
      timeRef.current += 0.016;
    }

    ctx.clearRect(0, 0, width, canvasHeight);

    // Sort layers by opacity for proper blending
    const sortedLayers = [...layersRef.current].sort((a, b) => a.opacity - b.opacity);

    sortedLayers.forEach((layer) => {
      if (!prefersReducedMotion) {
        layer.x += layer.speed * speed;
        layer.phase += 0.01;

        // Wrap around
        if (layer.x > width) layer.x = -layer.width;
        if (layer.x < -layer.width) layer.x = width;
      }

      const waveOffset = Math.sin(layer.phase) * 20;

      // Draw fog cloud
      const gradient = ctx.createRadialGradient(
        layer.x + layer.width / 2,
        fogY + waveOffset,
        0,
        layer.x + layer.width / 2,
        fogY + waveOffset,
        layer.width / 2
      );

      gradient.addColorStop(0, color);
      gradient.addColorStop(0.3, color);
      gradient.addColorStop(0.7, `${color}80`);
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.ellipse(
        layer.x + layer.width / 2,
        fogY + waveOffset,
        layer.width / 2,
        layer.height / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = gradient;
      ctx.globalAlpha = opacity * layer.opacity;
      ctx.fill();

      // Add wispy details
      for (let w = 0; w < 3; w++) {
        const wispX = layer.x + Math.random() * layer.width;
        const wispY = fogY + waveOffset + (Math.random() - 0.5) * layer.height * 0.5;
        const wispWidth = layer.width * 0.3 * Math.random();
        const wispHeight = layer.height * 0.4 * Math.random();

        const wispGradient = ctx.createRadialGradient(
          wispX, wispY, 0,
          wispX, wispY, wispWidth / 2
        );
        wispGradient.addColorStop(0, `${color}40`);
        wispGradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.ellipse(wispX, wispY, wispWidth / 2, wispHeight / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = wispGradient;
        ctx.globalAlpha = opacity * layer.opacity * 0.5;
        ctx.fill();
      }
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, verticalPosition, opacity, color, prefersReducedMotion]);

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

export default Fog;
