import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface DataStreamProps {
  /** Number of data streams */
  streamCount?: number;
  /** Stream colors */
  colors?: string[];
  /** Flow speed (0-1) */
  speed?: number;
  /** Particle density per stream */
  density?: number;
  /** Stream direction (horizontal, vertical, diagonal) */
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  /** Base opacity (0-1) */
  opacity?: number;
  /** Show connection lines */
  showConnections?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface DataParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  streamIndex: number;
  brightness: number;
}

/**
 * DataStream
 *
 * Flowing data visualization with connected particles.
 * Creates a tech/data center aesthetic.
 */
export const DataStream: React.FC<DataStreamProps> = ({
  streamCount = 10,
  colors = ['#3b82f6', '#06b6d4', '#10b981', '#8b5cf6'],
  speed = 0.5,
  density = 15,
  direction = 'diagonal',
  opacity = 0.8,
  showConnections = true,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<DataParticle[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initParticles = useCallback((width: number, height: number) => {
    const particles: DataParticle[] = [];

    for (let s = 0; s < streamCount; s++) {
      const streamColor = colors[s % colors.length];
      const streamY = direction === 'horizontal' ? (s / streamCount) * height : 0;
      const streamX = direction === 'vertical' ? (s / streamCount) * width : 0;

      for (let p = 0; p < density; p++) {
        let x: number, y: number;

        if (direction === 'horizontal') {
          x = Math.random() * width;
          y = streamY + (Math.random() - 0.5) * 30;
        } else if (direction === 'vertical') {
          x = streamX + (Math.random() - 0.5) * 30;
          y = Math.random() * height;
        } else {
          const diagonalPos = Math.random();
          x = diagonalPos * width + (s / streamCount) * 100 - 50;
          y = diagonalPos * height;
        }

        particles.push({
          x,
          y,
          size: 2 + Math.random() * 4,
          color: streamColor,
          speed: 2 + Math.random() * 3,
          streamIndex: s,
          brightness: 0.5 + Math.random() * 0.5,
        });
      }
    }

    particlesRef.current = particles;
  }, [streamCount, colors, density, direction]);

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

    // Draw connections between nearby particles
    if (showConnections) {
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          if (p1.streamIndex !== p2.streamIndex) return;

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p1.color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = opacity * (1 - dist / 80) * 0.3;
            ctx.stroke();
          }
        });
      });
    }

    // Update and draw particles
    particlesRef.current.forEach((particle) => {
      if (!prefersReducedMotion) {
        if (direction === 'horizontal') {
          particle.x += particle.speed * speed;
          if (particle.x > width + particle.size) {
            particle.x = -particle.size;
          }
        } else if (direction === 'vertical') {
          particle.y += particle.speed * speed;
          if (particle.y > height + particle.size) {
            particle.y = -particle.size;
          }
        } else {
          particle.x += particle.speed * speed * 0.7;
          particle.y += particle.speed * speed * 0.7;
          if (particle.x > width + particle.size || particle.y > height + particle.size) {
            particle.x = -particle.size;
            particle.y = -particle.size;
          }
        }
      }

      const pulse = 0.7 + Math.sin(timeRef.current * 3 + particle.streamIndex) * 0.3;
      const currentOpacity = opacity * particle.brightness * pulse;

      // Draw glow
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 3
      );
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(0.3, particle.color);
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.globalAlpha = currentOpacity * 0.3;
      ctx.fill();

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = currentOpacity;
      ctx.fill();

      // Draw bright center
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = currentOpacity;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, direction, opacity, showConnections, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initParticles(canvas.width, canvas.height);
  }, [initParticles]);

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

export default DataStream;
