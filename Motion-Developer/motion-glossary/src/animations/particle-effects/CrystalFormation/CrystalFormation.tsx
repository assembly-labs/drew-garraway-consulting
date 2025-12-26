import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface CrystalFormationProps {
  /** Number of crystals */
  crystalCount?: number;
  /** Crystal colors */
  colors?: string[];
  /** Growth speed (0-1) */
  speed?: number;
  /** Crystal size range */
  sizeRange?: [number, number];
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Crystal {
  x: number;
  y: number;
  size: number;
  targetSize: number;
  rotation: number;
  facets: number;
  color: string;
  growth: number;
  shimmerPhase: number;
}

/**
 * CrystalFormation
 *
 * Growing crystal formations with faceted surfaces.
 * Creates a mineralogical, fantasy aesthetic.
 */
export const CrystalFormation: React.FC<CrystalFormationProps> = ({
  crystalCount = 8,
  colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b'],
  speed = 0.3,
  sizeRange = [30, 80],
  opacity = 0.8,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const crystalsRef = useRef<Crystal[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initCrystals = useCallback((width: number, height: number) => {
    const crystals: Crystal[] = [];

    for (let i = 0; i < crystalCount; i++) {
      crystals.push({
        x: width * 0.1 + Math.random() * width * 0.8,
        y: height * 0.3 + Math.random() * height * 0.6,
        size: 0,
        targetSize: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
        rotation: Math.random() * Math.PI * 2,
        facets: 5 + Math.floor(Math.random() * 4),
        color: colors[Math.floor(Math.random() * colors.length)],
        growth: 0,
        shimmerPhase: Math.random() * Math.PI * 2,
      });
    }

    crystalsRef.current = crystals;
  }, [crystalCount, colors, sizeRange]);

  const drawCrystal = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    rotation: number,
    facets: number,
    color: string,
    shimmer: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Draw main crystal body
    const height = size * 2;
    const width = size * 0.6;

    // Draw facets
    for (let f = 0; f < facets; f++) {
      const angle = (f / facets) * Math.PI * 2;
      const nextAngle = ((f + 1) / facets) * Math.PI * 2;

      // Base facet
      ctx.beginPath();
      ctx.moveTo(0, -height * 0.4);
      ctx.lineTo(Math.cos(angle) * width, 0);
      ctx.lineTo(Math.cos(nextAngle) * width, 0);
      ctx.closePath();

      const facetGradient = ctx.createLinearGradient(
        0, -height * 0.4,
        Math.cos(angle) * width, 0
      );

      const brightness = 0.5 + Math.sin(angle + shimmer) * 0.3;
      facetGradient.addColorStop(0, '#ffffff');
      facetGradient.addColorStop(0.3, color);
      facetGradient.addColorStop(1, `rgba(0, 0, 0, ${0.3 * (1 - brightness)})`);

      ctx.fillStyle = facetGradient;
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Lower facet
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * width, 0);
      ctx.lineTo(Math.cos(nextAngle) * width, 0);
      ctx.lineTo(0, height * 0.3);
      ctx.closePath();

      const lowerGradient = ctx.createLinearGradient(
        0, 0,
        0, height * 0.3
      );
      lowerGradient.addColorStop(0, color);
      lowerGradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');

      ctx.fillStyle = lowerGradient;
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.stroke();
    }

    // Inner glow
    const innerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, width);
    innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
    innerGlow.addColorStop(0.5, color + '40');
    innerGlow.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(0, 0, width, 0, Math.PI * 2);
    ctx.fillStyle = innerGlow;
    ctx.fill();

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

    crystalsRef.current.forEach((crystal) => {
      if (!prefersReducedMotion) {
        // Growth animation
        if (crystal.size < crystal.targetSize) {
          crystal.growth += speed * 0.02;
          crystal.size = crystal.targetSize * Math.min(crystal.growth, 1);
        } else {
          // Shimmer effect
          crystal.shimmerPhase += 0.02;
        }

        // Subtle rotation
        crystal.rotation += 0.001 * speed;
      }

      if (crystal.size > 0) {
        // Draw glow behind crystal
        const glowGradient = ctx.createRadialGradient(
          crystal.x, crystal.y, 0,
          crystal.x, crystal.y, crystal.size * 2
        );
        glowGradient.addColorStop(0, crystal.color + '40');
        glowGradient.addColorStop(0.5, crystal.color + '20');
        glowGradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(crystal.x, crystal.y, crystal.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.globalAlpha = opacity * 0.5;
        ctx.fill();

        ctx.globalAlpha = opacity;
        drawCrystal(
          ctx,
          crystal.x,
          crystal.y,
          crystal.size,
          crystal.rotation,
          crystal.facets,
          crystal.color,
          crystal.shimmerPhase
        );
      }
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, opacity, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initCrystals(canvas.width, canvas.height);
  }, [initCrystals]);

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

export default CrystalFormation;
