import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface PrismRefractionProps {
  /** Number of light beams */
  beamCount?: number;
  /** Spectrum colors */
  colors?: string[];
  /** Animation speed (0-1) */
  speed?: number;
  /** Beam spread angle */
  spreadAngle?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Prism position X (0-1) */
  prismX?: number;
  /** Prism position Y (0-1) */
  prismY?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * PrismRefraction
 *
 * Light splitting through a prism creating rainbow spectrum.
 * Creates a Pink Floyd / physics aesthetic.
 */
export const PrismRefraction: React.FC<PrismRefractionProps> = ({
  beamCount: _beamCount = 7,
  colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'],
  speed = 0.3,
  spreadAngle = 45,
  opacity = 0.8,
  prismX = 0.5,
  prismY = 0.5,
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
    const centerX = width * prismX;
    const centerY = height * prismY;
    const prismSize = Math.min(width, height) * 0.15;

    if (!prefersReducedMotion) {
      timeRef.current += 0.016;
    }

    ctx.clearRect(0, 0, width, height);

    const inputAngle = Math.PI + Math.sin(timeRef.current * speed) * 0.2;
    const spreadRad = (spreadAngle * Math.PI) / 180;

    // Draw incoming white light beam
    const incomingLength = Math.max(width, height);
    const inX = centerX + Math.cos(inputAngle) * incomingLength;
    const inY = centerY + Math.sin(inputAngle) * incomingLength;

    // Incoming beam glow
    for (let g = 3; g >= 0; g--) {
      ctx.beginPath();
      ctx.moveTo(inX, inY);
      ctx.lineTo(centerX, centerY);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4 + g * 4;
      ctx.globalAlpha = opacity * 0.1 / (g + 1);
      ctx.stroke();
    }

    // Main incoming beam
    ctx.beginPath();
    ctx.moveTo(inX, inY);
    ctx.lineTo(centerX, centerY);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.globalAlpha = opacity;
    ctx.stroke();

    // Draw refracted spectrum beams
    const baseOutputAngle = 0;

    colors.forEach((color, i) => {
      const angleOffset = ((i / (colors.length - 1)) - 0.5) * spreadRad;
      const outputAngle = baseOutputAngle + angleOffset + Math.sin(timeRef.current * speed * 2 + i) * 0.05;

      const outLength = Math.max(width, height);
      const outX = centerX + Math.cos(outputAngle) * outLength;
      const outY = centerY + Math.sin(outputAngle) * outLength;

      // Beam glow
      for (let g = 2; g >= 0; g--) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(outX, outY);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3 + g * 3;
        ctx.globalAlpha = opacity * 0.15 / (g + 1);
        ctx.stroke();
      }

      // Main refracted beam
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(outX, outY);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.globalAlpha = opacity * 0.9;
      ctx.stroke();

      // Bright core
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(outX, outY);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.globalAlpha = opacity * 0.5;
      ctx.stroke();
    });

    // Draw prism
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(Math.PI / 6);

    // Prism shadow/glow
    ctx.beginPath();
    ctx.moveTo(0, -prismSize);
    ctx.lineTo(prismSize * 0.866, prismSize * 0.5);
    ctx.lineTo(-prismSize * 0.866, prismSize * 0.5);
    ctx.closePath();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.globalAlpha = 1;
    ctx.fill();

    // Prism edges
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Glass effect gradient
    const glassGradient = ctx.createLinearGradient(
      -prismSize, 0, prismSize, 0
    );
    glassGradient.addColorStop(0, 'rgba(200, 200, 255, 0.2)');
    glassGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    glassGradient.addColorStop(1, 'rgba(200, 200, 255, 0.2)');

    ctx.fillStyle = glassGradient;
    ctx.globalAlpha = opacity * 0.5;
    ctx.fill();

    // Highlight
    ctx.beginPath();
    ctx.moveTo(-prismSize * 0.3, -prismSize * 0.5);
    ctx.lineTo(-prismSize * 0.1, -prismSize * 0.3);
    ctx.lineTo(-prismSize * 0.4, prismSize * 0.1);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.globalAlpha = opacity;
    ctx.stroke();

    ctx.restore();

    // Sparkle effects at prism center
    const sparkleCount = 5;
    for (let s = 0; s < sparkleCount; s++) {
      const sparklePhase = timeRef.current * 3 + s * (Math.PI * 2 / sparkleCount);
      const sparkleX = centerX + Math.cos(sparklePhase) * 5;
      const sparkleY = centerY + Math.sin(sparklePhase) * 5;
      const sparkleSize = 2 + Math.sin(sparklePhase * 2) * 1;

      ctx.beginPath();
      ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = opacity * (0.5 + Math.sin(sparklePhase) * 0.5);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [colors, speed, spreadAngle, opacity, prismX, prismY, prefersReducedMotion]);

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

export default PrismRefraction;
