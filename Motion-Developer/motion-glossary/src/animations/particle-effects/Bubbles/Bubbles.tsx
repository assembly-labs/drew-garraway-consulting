import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface BubblesProps {
  /** Number of bubbles */
  bubbleCount?: number;
  /** Minimum bubble size in pixels */
  minSize?: number;
  /** Maximum bubble size in pixels */
  maxSize?: number;
  /** Bubble color */
  color?: string;
  /** Rise speed (0-1) */
  speed?: number;
  /** Wobble amount (0-1) */
  wobble?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Show highlight on bubbles */
  showHighlight?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Bubble {
  x: number;
  y: number;
  size: number;
  speedY: number;
  wobbleOffset: number;
  wobbleSpeed: number;
  opacity: number;
}

/**
 * Bubbles
 *
 * Gentle rising bubbles like underwater or champagne.
 * Subtle, soothing background effect with natural wobble motion.
 */
export const Bubbles: React.FC<BubblesProps> = ({
  bubbleCount = 30,
  minSize = 4,
  maxSize = 20,
  color = '#ffffff',
  speed = 0.5,
  wobble = 0.5,
  opacity = 0.3,
  showHighlight = true,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  // Initialize bubbles
  const initBubbles = useCallback((width: number, height: number) => {
    const bubbles: Bubble[] = [];
    for (let i = 0; i < bubbleCount; i++) {
      const size = minSize + Math.random() * (maxSize - minSize);
      bubbles.push({
        x: Math.random() * width,
        y: height + Math.random() * height, // Start below or within view
        size,
        speedY: (0.5 + Math.random() * 0.5) * speed * (1 - size / maxSize * 0.5), // Smaller = faster
        wobbleOffset: Math.random() * Math.PI * 2,
        wobbleSpeed: (0.5 + Math.random() * 0.5) * 2,
        opacity: opacity * (0.5 + Math.random() * 0.5),
      });
    }
    bubblesRef.current = bubbles;
  }, [bubbleCount, minSize, maxSize, speed, opacity]);

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

    // Update and draw bubbles
    bubblesRef.current.forEach((bubble) => {
      // Update position (skip if reduced motion)
      if (!prefersReducedMotion) {
        bubble.y -= bubble.speedY;

        // Apply wobble
        const wobbleAmount = Math.sin(timeRef.current * bubble.wobbleSpeed + bubble.wobbleOffset) * wobble * 2;
        const drawX = bubble.x + wobbleAmount;

        // Reset when off top
        if (bubble.y < -bubble.size * 2) {
          bubble.y = height + bubble.size;
          bubble.x = Math.random() * width;
        }

        // Draw bubble
        ctx.beginPath();
        ctx.arc(drawX, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = bubble.opacity;
        ctx.stroke();

        // Inner subtle fill
        ctx.beginPath();
        ctx.arc(drawX, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = bubble.opacity * 0.1;
        ctx.fill();

        // Highlight
        if (showHighlight && bubble.size > 6) {
          ctx.beginPath();
          ctx.arc(
            drawX - bubble.size * 0.3,
            bubble.y - bubble.size * 0.3,
            bubble.size * 0.2,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = color;
          ctx.globalAlpha = bubble.opacity * 0.6;
          ctx.fill();
        }
      } else {
        // Static render for reduced motion
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = bubble.opacity;
        ctx.stroke();
      }
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [color, wobble, showHighlight, prefersReducedMotion]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    initBubbles(canvas.width, canvas.height);
  }, [initBubbles]);

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
      initBubbles(canvas.width, canvas.height);
    }
  }, [bubbleCount, minSize, maxSize, speed, opacity, initBubbles]);

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

export default Bubbles;

export const bubblesCode = `import { useRef, useEffect } from 'react';

const Bubbles = ({
  bubbleCount = 30,
  minSize = 4,
  maxSize = 20,
  color = '#ffffff',
  speed = 0.5,
  wobble = 0.5,
  opacity = 0.3,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let time = 0;

    const bubbles = Array.from({ length: bubbleCount }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * canvas.height,
      size: minSize + Math.random() * (maxSize - minSize),
      speedY: (0.5 + Math.random() * 0.5) * speed,
      wobbleOffset: Math.random() * Math.PI * 2,
    }));

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubbles.forEach(bubble => {
        bubble.y -= bubble.speedY;
        if (bubble.y < -bubble.size) {
          bubble.y = canvas.height + bubble.size;
          bubble.x = Math.random() * canvas.width;
        }

        const wobbleX = Math.sin(time * 2 + bubble.wobbleOffset) * wobble * 2;

        ctx.beginPath();
        ctx.arc(bubble.x + wobbleX, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity;
        ctx.stroke();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} />;
};`;
