import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface WaveParticlesProps {
  /** Number of particles per wave */
  particleCount?: number;
  /** Number of wave layers */
  waveCount?: number;
  /** Particle size in pixels */
  particleSize?: number;
  /** Array of colors for waves */
  colors?: string[];
  /** Wave speed (0-1) */
  speed?: number;
  /** Wave amplitude (0-1) */
  amplitude?: number;
  /** Wave frequency */
  frequency?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Vertical position (0-1) */
  verticalPosition?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface WaveParticle {
  baseX: number;
  waveIndex: number;
  size: number;
  opacity: number;
  offset: number;
}

/**
 * WaveParticles
 *
 * Particles flowing in beautiful sine wave patterns.
 * Creates a soothing, rhythmic background effect.
 */
export const WaveParticles: React.FC<WaveParticlesProps> = ({
  particleCount = 50,
  waveCount = 3,
  particleSize = 3,
  colors = ['#8b5cf6', '#6366f1', '#3b82f6'],
  speed = 0.5,
  amplitude = 0.3,
  frequency = 2,
  opacity = 0.6,
  verticalPosition = 0.5,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<WaveParticle[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  // Initialize particles
  const initParticles = useCallback((width: number) => {
    const particles: WaveParticle[] = [];
    for (let wave = 0; wave < waveCount; wave++) {
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          baseX: (i / particleCount) * width,
          waveIndex: wave,
          size: particleSize * (0.5 + Math.random() * 0.5),
          opacity: opacity * (0.6 + Math.random() * 0.4),
          offset: Math.random() * Math.PI * 2,
        });
      }
    }
    particlesRef.current = particles;
  }, [particleCount, waveCount, particleSize, opacity]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Update time
    if (!prefersReducedMotion) {
      timeRef.current += 0.016 * speed;
    }

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const baseY = height * verticalPosition;
    const waveHeight = height * amplitude;
    const waveSpacing = waveHeight * 0.8;

    // Draw connecting lines between particles (optional, creates wave lines)
    for (let wave = 0; wave < waveCount; wave++) {
      ctx.beginPath();
      ctx.strokeStyle = colors[wave % colors.length];
      ctx.lineWidth = 1;
      ctx.globalAlpha = opacity * 0.3;

      for (let x = 0; x <= width; x += 5) {
        const normalizedX = x / width;
        const waveOffset = wave * waveSpacing - ((waveCount - 1) * waveSpacing) / 2;

        const y =
          baseY +
          waveOffset +
          Math.sin(normalizedX * frequency * Math.PI * 2 + timeRef.current * 2 + wave * 0.5) *
            waveHeight *
            0.5;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    // Draw particles
    particlesRef.current.forEach((particle) => {
      const waveOffset =
        particle.waveIndex * waveSpacing - ((waveCount - 1) * waveSpacing) / 2;

      // Calculate x position with time offset for movement
      let x = particle.baseX + timeRef.current * 50;
      x = x % width; // Wrap around
      if (x < 0) x += width;

      const normalizedX = x / width;

      // Calculate y position based on wave
      const y =
        baseY +
        waveOffset +
        Math.sin(
          normalizedX * frequency * Math.PI * 2 +
            timeRef.current * 2 +
            particle.waveIndex * 0.5 +
            particle.offset
        ) *
          waveHeight *
          0.5;

      // Draw particle
      ctx.beginPath();
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = colors[particle.waveIndex % colors.length];
      ctx.globalAlpha = particle.opacity;
      ctx.fill();

      // Add glow effect
      ctx.beginPath();
      ctx.arc(x, y, particle.size * 2, 0, Math.PI * 2);
      ctx.globalAlpha = particle.opacity * 0.3;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [colors, waveCount, speed, amplitude, frequency, opacity, verticalPosition, prefersReducedMotion]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    initParticles(canvas.width);
  }, [initParticles]);

  // Setup
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

  // Re-init when props change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      initParticles(canvas.width);
    }
  }, [particleCount, waveCount, particleSize, opacity, initParticles]);

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

export default WaveParticles;

export const waveParticlesCode = `import { useRef, useEffect } from 'react';

const WaveParticles = ({
  particleCount = 50,
  waveCount = 3,
  colors = ['#8b5cf6', '#6366f1', '#3b82f6'],
  speed = 0.5,
  amplitude = 0.3,
  frequency = 2,
  opacity = 0.6,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let time = 0;

    const particles = [];
    for (let wave = 0; wave < waveCount; wave++) {
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          baseX: (i / particleCount) * canvas.width,
          waveIndex: wave,
          size: 2 + Math.random() * 2,
        });
      }
    }

    const animate = () => {
      time += 0.016 * speed;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const baseY = canvas.height * 0.5;
      const waveHeight = canvas.height * amplitude;

      particles.forEach(p => {
        let x = p.baseX + time * 50;
        x = x % canvas.width;

        const y = baseY +
          (p.waveIndex - waveCount / 2) * 40 +
          Math.sin((x / canvas.width) * frequency * Math.PI * 2 + time * 2) * waveHeight * 0.5;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = colors[p.waveIndex % colors.length];
        ctx.globalAlpha = opacity;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} />;
};`;
