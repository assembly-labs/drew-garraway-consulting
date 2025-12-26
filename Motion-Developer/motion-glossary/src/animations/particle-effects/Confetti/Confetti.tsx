import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface ConfettiProps {
  /** Number of confetti pieces */
  particleCount?: number;
  /** Array of colors */
  colors?: string[];
  /** Fall speed (0-1) */
  speed?: number;
  /** Spin speed (0-1) */
  spin?: number;
  /** Sway amount (0-1) */
  sway?: number;
  /** Particle size range [min, max] in pixels */
  sizeRange?: [number, number];
  /** Shapes to use */
  shapes?: ('square' | 'rectangle' | 'circle')[];
  /** Base opacity (0-1) */
  opacity?: number;
  /** Continuous mode (particles reset to top) */
  continuous?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface ConfettiPiece {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  shape: 'square' | 'rectangle' | 'circle';
  rotation: number;
  rotationSpeed: number;
  speedY: number;
  speedX: number;
  swayOffset: number;
  swaySpeed: number;
  opacity: number;
}

/**
 * Confetti
 *
 * Colorful falling confetti particles with rotation and sway.
 * Can be subtle for ambient backgrounds or vibrant for celebrations.
 */
export const Confetti: React.FC<ConfettiProps> = ({
  particleCount = 50,
  colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'],
  speed = 0.5,
  spin = 0.5,
  sway = 0.5,
  sizeRange = [5, 12],
  shapes = ['square', 'rectangle', 'circle'],
  opacity = 0.8,
  continuous = true,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ConfettiPiece[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  // Initialize particles
  const initParticles = useCallback((width: number, height: number) => {
    const particles: ConfettiPiece[] = [];
    for (let i = 0; i < particleCount; i++) {
      const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      particles.push({
        x: Math.random() * width,
        y: continuous ? Math.random() * height * 2 - height : -Math.random() * height,
        width: shape === 'rectangle' ? size * 0.4 : size,
        height: shape === 'rectangle' ? size : size,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * spin * 0.2,
        speedY: (0.5 + Math.random() * 0.5) * speed * 2,
        speedX: (Math.random() - 0.5) * speed,
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: (0.5 + Math.random() * 0.5) * 2,
        opacity: opacity * (0.7 + Math.random() * 0.3),
      });
    }
    particlesRef.current = particles;
  }, [particleCount, colors, speed, spin, sway, sizeRange, shapes, opacity, continuous]);

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
      timeRef.current += 0.016;
    }

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    particlesRef.current.forEach((piece) => {
      if (!prefersReducedMotion) {
        // Fall
        piece.y += piece.speedY;

        // Horizontal drift + sway
        const swayAmount = Math.sin(timeRef.current * piece.swaySpeed + piece.swayOffset) * sway * 2;
        piece.x += piece.speedX + swayAmount * 0.5;

        // Spin
        piece.rotation += piece.rotationSpeed;

        // Reset when off bottom (continuous mode)
        if (piece.y > height + piece.height && continuous) {
          piece.y = -piece.height;
          piece.x = Math.random() * width;
        }
      }

      // Draw
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.globalAlpha = piece.opacity;
      ctx.fillStyle = piece.color;

      switch (piece.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, piece.width / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'square':
        case 'rectangle':
        default:
          ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
          break;
      }

      ctx.restore();
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [sway, continuous, prefersReducedMotion]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    initParticles(canvas.width, canvas.height);
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
      initParticles(canvas.width, canvas.height);
    }
  }, [particleCount, colors, speed, spin, sizeRange, shapes, opacity, continuous, initParticles]);

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

export default Confetti;

export const confettiCode = `import { useRef, useEffect } from 'react';

const Confetti = ({
  particleCount = 50,
  colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'],
  speed = 0.5,
  spin = 0.5,
  sway = 0.5,
  opacity = 0.8,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let time = 0;

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 5 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * spin * 0.2,
      speedY: (0.5 + Math.random() * 0.5) * speed * 2,
      swayOffset: Math.random() * Math.PI * 2,
    }));

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.y += p.speedY;
        p.x += Math.sin(time * 2 + p.swayOffset) * sway;
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height + p.size) {
          p.y = -p.size;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} />;
};`;
