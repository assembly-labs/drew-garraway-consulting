import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface GlitchProps {
  /** Glitch frequency (0-1) */
  frequency?: number;
  /** Glitch intensity (0-1) */
  intensity?: number;
  /** Primary color */
  primaryColor?: string;
  /** Secondary color (chromatic aberration) */
  secondaryColor?: string;
  /** Tertiary color */
  tertiaryColor?: string;
  /** Line count */
  lineCount?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface GlitchBlock {
  x: number;
  y: number;
  width: number;
  height: number;
  offsetX: number;
  opacity: number;
  life: number;
  color: string;
}

/**
 * Glitch
 *
 * Digital glitch effect with chromatic aberration and scan lines.
 * Creates a cyberpunk, corrupted data aesthetic.
 */
export const Glitch: React.FC<GlitchProps> = ({
  frequency = 0.5,
  intensity = 0.6,
  primaryColor = '#00ff41',
  secondaryColor = '#ff0040',
  tertiaryColor = '#00d4ff',
  lineCount = 100,
  opacity = 0.7,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blocksRef = useRef<GlitchBlock[]>([]);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Scan lines
    ctx.globalAlpha = opacity * 0.1;
    for (let i = 0; i < lineCount; i++) {
      const y = (i / lineCount) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.strokeStyle = i % 2 === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    if (!prefersReducedMotion) {
      // Random glitch blocks
      if (Math.random() < frequency * 0.3) {
        const colors = [primaryColor, secondaryColor, tertiaryColor];
        const blockCount = Math.floor(Math.random() * 5 * intensity) + 1;

        for (let i = 0; i < blockCount; i++) {
          blocksRef.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            width: 20 + Math.random() * 200 * intensity,
            height: 2 + Math.random() * 30 * intensity,
            offsetX: (Math.random() - 0.5) * 50 * intensity,
            opacity: 0.3 + Math.random() * 0.7,
            life: 2 + Math.random() * 8,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }
      }

      // Update and draw glitch blocks
      blocksRef.current = blocksRef.current.filter((block) => {
        block.life -= 1;
        return block.life > 0;
      });
    }

    // Draw active glitch blocks
    blocksRef.current.forEach((block) => {
      // Main block
      ctx.fillStyle = block.color;
      ctx.globalAlpha = opacity * block.opacity * (block.life / 10);
      ctx.fillRect(block.x + block.offsetX, block.y, block.width, block.height);

      // Chromatic aberration
      ctx.fillStyle = secondaryColor;
      ctx.globalAlpha = opacity * block.opacity * 0.5 * (block.life / 10);
      ctx.fillRect(block.x + block.offsetX - 3, block.y, block.width, block.height);

      ctx.fillStyle = tertiaryColor;
      ctx.globalAlpha = opacity * block.opacity * 0.5 * (block.life / 10);
      ctx.fillRect(block.x + block.offsetX + 3, block.y, block.width, block.height);
    });

    // Random noise pixels
    if (!prefersReducedMotion && Math.random() < frequency * 0.5) {
      const noiseCount = Math.floor(50 * intensity);
      for (let i = 0; i < noiseCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = 1 + Math.random() * 3;

        ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : primaryColor;
        ctx.globalAlpha = opacity * Math.random() * 0.8;
        ctx.fillRect(x, y, size, size);
      }
    }

    // Horizontal displacement lines
    if (!prefersReducedMotion && Math.random() < frequency * 0.2) {
      const lineY = Math.random() * height;
      const lineHeight = 2 + Math.random() * 10;
      const displacement = (Math.random() - 0.5) * 30 * intensity;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, lineY, width, lineHeight);
      ctx.clip();

      // Simulate horizontal shift
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = opacity * 0.3;
      ctx.fillRect(displacement, lineY, width, lineHeight);

      ctx.restore();
    }

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [frequency, intensity, primaryColor, secondaryColor, tertiaryColor, lineCount, opacity, prefersReducedMotion]);

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

export default Glitch;
