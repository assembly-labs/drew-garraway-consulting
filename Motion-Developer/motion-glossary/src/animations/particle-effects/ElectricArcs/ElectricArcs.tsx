import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface ElectricArcsProps {
  /** Number of arc sources */
  sourceCount?: number;
  /** Arc color */
  color?: string;
  /** Glow color */
  glowColor?: string;
  /** Animation speed (0-1) */
  speed?: number;
  /** Arc intensity (0-1) */
  intensity?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface ArcSource {
  x: number;
  y: number;
}

interface Arc {
  source: number;
  target: { x: number; y: number };
  segments: { x: number; y: number }[];
  life: number;
  maxLife: number;
}

/**
 * ElectricArcs
 *
 * Lightning and electrical arc effects.
 * Creates an energetic, powerful aesthetic.
 */
export const ElectricArcs: React.FC<ElectricArcsProps> = ({
  sourceCount = 3,
  color = '#60a5fa',
  glowColor = '#3b82f6',
  speed = 0.5,
  intensity = 0.7,
  opacity = 0.9,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourcesRef = useRef<ArcSource[]>([]);
  const arcsRef = useRef<Arc[]>([]);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initSources = useCallback((width: number, height: number) => {
    const sources: ArcSource[] = [];

    for (let i = 0; i < sourceCount; i++) {
      sources.push({
        x: width * (0.2 + (i / (sourceCount - 1)) * 0.6),
        y: height * 0.2,
      });
    }

    sourcesRef.current = sources;
    arcsRef.current = [];
  }, [sourceCount]);

  const generateArcSegments = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    segments: number
  ): { x: number; y: number }[] => {
    const points: { x: number; y: number }[] = [{ x: startX, y: startY }];

    const dx = endX - startX;
    const dy = endY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const perpX = -dy / length;
    const perpY = dx / length;

    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const baseX = startX + dx * t;
      const baseY = startY + dy * t;

      // Add jagged offset
      const offset = (Math.random() - 0.5) * length * 0.15 * intensity;

      points.push({
        x: baseX + perpX * offset,
        y: baseY + perpY * offset,
      });
    }

    points.push({ x: endX, y: endY });
    return points;
  };

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Generate new arcs
    if (!prefersReducedMotion && Math.random() < intensity * speed * 0.3) {
      const sourceIdx = Math.floor(Math.random() * sourcesRef.current.length);
      const source = sourcesRef.current[sourceIdx];

      // Random target
      const targetX = source.x + (Math.random() - 0.5) * width * 0.6;
      const targetY = source.y + Math.random() * height * 0.7;

      arcsRef.current.push({
        source: sourceIdx,
        target: { x: targetX, y: targetY },
        segments: generateArcSegments(source.x, source.y, targetX, targetY, 10 + Math.floor(Math.random() * 10)),
        life: 0,
        maxLife: 5 + Math.random() * 10,
      });
    }

    // Draw source points
    sourcesRef.current.forEach((source) => {
      const glowGradient = ctx.createRadialGradient(
        source.x, source.y, 0,
        source.x, source.y, 30
      );
      glowGradient.addColorStop(0, '#ffffff');
      glowGradient.addColorStop(0.3, color);
      glowGradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(source.x, source.y, 30, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.globalAlpha = opacity;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(source.x, source.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    });

    // Update and draw arcs
    arcsRef.current = arcsRef.current.filter((arc) => {
      if (!prefersReducedMotion) {
        arc.life++;

        // Regenerate segments for flickering effect
        if (arc.life % 2 === 0) {
          const source = sourcesRef.current[arc.source];
          arc.segments = generateArcSegments(
            source.x, source.y,
            arc.target.x, arc.target.y,
            arc.segments.length
          );
        }
      }

      if (arc.life > arc.maxLife) return false;

      const lifeRatio = 1 - arc.life / arc.maxLife;

      // Draw arc glow
      ctx.beginPath();
      ctx.moveTo(arc.segments[0].x, arc.segments[0].y);
      for (let i = 1; i < arc.segments.length; i++) {
        ctx.lineTo(arc.segments[i].x, arc.segments[i].y);
      }
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = opacity * lifeRatio * 0.3;
      ctx.stroke();

      // Draw main arc
      ctx.beginPath();
      ctx.moveTo(arc.segments[0].x, arc.segments[0].y);
      for (let i = 1; i < arc.segments.length; i++) {
        ctx.lineTo(arc.segments[i].x, arc.segments[i].y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.globalAlpha = opacity * lifeRatio;
      ctx.stroke();

      // Draw bright core
      ctx.beginPath();
      ctx.moveTo(arc.segments[0].x, arc.segments[0].y);
      for (let i = 1; i < arc.segments.length; i++) {
        ctx.lineTo(arc.segments[i].x, arc.segments[i].y);
      }
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.globalAlpha = opacity * lifeRatio;
      ctx.stroke();

      // Draw branch arcs
      if (Math.random() > 0.7 && !prefersReducedMotion) {
        const branchIdx = Math.floor(Math.random() * (arc.segments.length - 2)) + 1;
        const branchStart = arc.segments[branchIdx];
        const branchEnd = {
          x: branchStart.x + (Math.random() - 0.5) * 100,
          y: branchStart.y + Math.random() * 50,
        };

        const branchSegments = generateArcSegments(
          branchStart.x, branchStart.y,
          branchEnd.x, branchEnd.y,
          5
        );

        ctx.beginPath();
        ctx.moveTo(branchSegments[0].x, branchSegments[0].y);
        for (let i = 1; i < branchSegments.length; i++) {
          ctx.lineTo(branchSegments[i].x, branchSegments[i].y);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = opacity * lifeRatio * 0.5;
        ctx.stroke();
      }

      return true;
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, intensity, color, glowColor, opacity, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initSources(canvas.width, canvas.height);
  }, [initSources]);

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

export default ElectricArcs;
