import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface MagneticFieldProps {
  /** Number of field lines */
  lineCount?: number;
  /** Field line color */
  color?: string;
  /** Animation speed (0-1) */
  speed?: number;
  /** Field strength (0-1) */
  strength?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Number of poles */
  poleCount?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Pole {
  x: number;
  y: number;
  polarity: number;
}

interface FieldParticle {
  x: number;
  y: number;
  age: number;
}

/**
 * MagneticField
 *
 * Magnetic field line visualization with flowing particles.
 * Creates a scientific, electromagnetic aesthetic.
 */
export const MagneticField: React.FC<MagneticFieldProps> = ({
  lineCount = 100,
  color = '#06b6d4',
  speed = 0.4,
  strength = 0.6,
  opacity = 0.7,
  poleCount = 2,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const polesRef = useRef<Pole[]>([]);
  const particlesRef = useRef<FieldParticle[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initField = useCallback((width: number, height: number) => {
    const poles: Pole[] = [];
    const particles: FieldParticle[] = [];

    // Create poles
    for (let i = 0; i < poleCount; i++) {
      poles.push({
        x: width * (0.3 + (i / (poleCount - 1 || 1)) * 0.4),
        y: height * 0.5,
        polarity: i % 2 === 0 ? 1 : -1,
      });
    }

    // Create field particles
    for (let i = 0; i < lineCount; i++) {
      const pole = poles[Math.floor(Math.random() * poles.length)];
      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 30;

      particles.push({
        x: pole.x + Math.cos(angle) * distance,
        y: pole.y + Math.sin(angle) * distance,
        age: Math.random() * 100,
      });
    }

    polesRef.current = poles;
    particlesRef.current = particles;
  }, [poleCount, lineCount]);

  const getFieldDirection = (x: number, y: number, poles: Pole[]): { fx: number; fy: number } => {
    let fx = 0;
    let fy = 0;

    poles.forEach((pole) => {
      const dx = x - pole.x;
      const dy = y - pole.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = 20;

      if (dist > minDist) {
        const force = (pole.polarity * strength * 500) / (dist * dist);
        fx += (dx / dist) * force;
        fy += (dy / dist) * force;
      }
    });

    const mag = Math.sqrt(fx * fx + fy * fy);
    if (mag > 0) {
      fx /= mag;
      fy /= mag;
    }

    return { fx, fy };
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

    // Draw poles
    polesRef.current.forEach((pole) => {
      const gradient = ctx.createRadialGradient(
        pole.x, pole.y, 0,
        pole.x, pole.y, 40
      );

      if (pole.polarity > 0) {
        gradient.addColorStop(0, '#ef4444');
        gradient.addColorStop(0.5, '#ef444480');
        gradient.addColorStop(1, 'transparent');
      } else {
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(0.5, '#3b82f680');
        gradient.addColorStop(1, 'transparent');
      }

      ctx.beginPath();
      ctx.arc(pole.x, pole.y, 40, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.globalAlpha = opacity;
      ctx.fill();

      // Pole symbol
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = opacity;
      ctx.fillText(pole.polarity > 0 ? 'N' : 'S', pole.x, pole.y);
    });

    // Draw and update field particles
    particlesRef.current.forEach((particle) => {
      if (!prefersReducedMotion) {
        const { fx, fy } = getFieldDirection(particle.x, particle.y, polesRef.current);

        particle.x += fx * speed * 3;
        particle.y += fy * speed * 3;
        particle.age++;

        // Reset if out of bounds or too old
        if (
          particle.x < 0 || particle.x > width ||
          particle.y < 0 || particle.y > height ||
          particle.age > 200
        ) {
          const pole = polesRef.current[Math.floor(Math.random() * polesRef.current.length)];
          const angle = Math.random() * Math.PI * 2;
          const distance = 20 + Math.random() * 30;

          particle.x = pole.x + Math.cos(angle) * distance;
          particle.y = pole.y + Math.sin(angle) * distance;
          particle.age = 0;
        }
      }

      const fadeIn = Math.min(particle.age / 20, 1);
      const fadeOut = Math.max(0, 1 - (particle.age - 150) / 50);
      const currentOpacity = opacity * Math.min(fadeIn, fadeOut);

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = currentOpacity;
      ctx.fill();
    });

    // Draw field lines (static reference)
    const gridStep = 40;
    for (let x = 0; x < width; x += gridStep) {
      for (let y = 0; y < height; y += gridStep) {
        const { fx, fy } = getFieldDirection(x, y, polesRef.current);

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + fx * 15, y + fy * 15);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = opacity * 0.2;
        ctx.stroke();

        // Arrow head
        const arrowAngle = Math.atan2(fy, fx);
        ctx.beginPath();
        ctx.moveTo(x + fx * 15, y + fy * 15);
        ctx.lineTo(
          x + fx * 15 - Math.cos(arrowAngle - 0.5) * 5,
          y + fy * 15 - Math.sin(arrowAngle - 0.5) * 5
        );
        ctx.lineTo(
          x + fx * 15 - Math.cos(arrowAngle + 0.5) * 5,
          y + fy * 15 - Math.sin(arrowAngle + 0.5) * 5
        );
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity * 0.2;
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, strength, color, opacity, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initField(canvas.width, canvas.height);
  }, [initField]);

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

export default MagneticField;
