import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface NeonGridProps {
  /** Grid cell size */
  cellSize?: number;
  /** Grid line color */
  lineColor?: string;
  /** Glow color */
  glowColor?: string;
  /** Animation speed (0-1) */
  speed?: number;
  /** Perspective tilt (0-1) */
  perspective?: number;
  /** Horizon position (0-1) */
  horizon?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Show pulse effect */
  showPulse?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * NeonGrid
 *
 * Retro-futuristic Tron-style perspective grid.
 * Creates a synthwave/vaporwave aesthetic.
 */
export const NeonGrid: React.FC<NeonGridProps> = ({
  cellSize = 50,
  lineColor = '#ff00ff',
  glowColor = '#00ffff',
  speed = 0.3,
  perspective = 0.7,
  horizon = 0.4,
  opacity = 0.8,
  showPulse = true,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offsetRef = useRef(0);
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
    const horizonY = height * horizon;
    const gridHeight = height - horizonY;

    if (!prefersReducedMotion) {
      offsetRef.current += speed * 2;
      timeRef.current += 0.016;
      if (offsetRef.current >= cellSize) offsetRef.current = 0;
    }

    ctx.clearRect(0, 0, width, height);

    // Draw gradient sky
    const skyGradient = ctx.createLinearGradient(0, 0, 0, horizonY);
    skyGradient.addColorStop(0, 'transparent');
    skyGradient.addColorStop(0.7, 'rgba(139, 92, 246, 0.1)');
    skyGradient.addColorStop(1, 'rgba(236, 72, 153, 0.2)');

    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, horizonY);

    // Horizon glow
    const horizonGlow = ctx.createLinearGradient(0, horizonY - 20, 0, horizonY + 40);
    horizonGlow.addColorStop(0, 'transparent');
    horizonGlow.addColorStop(0.5, glowColor + '40');
    horizonGlow.addColorStop(1, 'transparent');

    ctx.fillStyle = horizonGlow;
    ctx.fillRect(0, horizonY - 20, width, 60);

    // Draw horizontal lines with perspective
    const lineCount = 20;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;

    for (let i = 0; i <= lineCount; i++) {
      const progress = (i / lineCount);

      // Offset for scrolling effect
      const lineProgress = (i + offsetRef.current / cellSize) / lineCount;
      const adjustedY = horizonY + gridHeight * Math.pow(lineProgress, perspective * 2);

      if (adjustedY > horizonY && adjustedY < height) {
        const lineOpacity = opacity * (1 - Math.pow(1 - progress, 2));

        // Glow layer
        ctx.beginPath();
        ctx.moveTo(0, adjustedY);
        ctx.lineTo(width, adjustedY);
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 3;
        ctx.globalAlpha = lineOpacity * 0.3;
        ctx.stroke();

        // Main line
        ctx.beginPath();
        ctx.moveTo(0, adjustedY);
        ctx.lineTo(width, adjustedY);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;
        ctx.globalAlpha = lineOpacity;
        ctx.stroke();
      }
    }

    // Draw vertical lines with perspective
    const verticalCount = Math.ceil(width / cellSize) + 2;
    const vanishX = width / 2;

    for (let i = -verticalCount / 2; i <= verticalCount / 2; i++) {
      const baseX = vanishX + i * cellSize;

      // Calculate perspective for vertical lines
      const topX = vanishX + i * 5;
      const bottomX = baseX;

      ctx.beginPath();
      ctx.moveTo(topX, horizonY);
      ctx.lineTo(bottomX, height);

      // Fade lines towards edges
      const edgeFade = 1 - Math.abs(i / (verticalCount / 2)) * 0.5;

      // Glow layer
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = opacity * 0.2 * edgeFade;
      ctx.stroke();

      // Main line
      ctx.beginPath();
      ctx.moveTo(topX, horizonY);
      ctx.lineTo(bottomX, height);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = opacity * edgeFade;
      ctx.stroke();
    }

    // Pulse effect on grid
    if (showPulse && !prefersReducedMotion) {
      const pulseY = horizonY + ((timeRef.current * 100 * speed) % gridHeight);
      const pulseWidth = 50;

      const pulseGradient = ctx.createLinearGradient(0, pulseY - pulseWidth, 0, pulseY + pulseWidth);
      pulseGradient.addColorStop(0, 'transparent');
      pulseGradient.addColorStop(0.5, glowColor + '60');
      pulseGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = pulseGradient;
      ctx.globalAlpha = opacity * 0.5;
      ctx.fillRect(0, pulseY - pulseWidth, width, pulseWidth * 2);
    }

    // Horizon line
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(width, horizonY);
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 2;
    ctx.globalAlpha = opacity;
    ctx.stroke();

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [cellSize, lineColor, glowColor, speed, perspective, horizon, opacity, showPulse, prefersReducedMotion]);

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

export default NeonGrid;
