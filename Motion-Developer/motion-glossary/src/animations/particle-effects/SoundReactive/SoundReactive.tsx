import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface SoundReactiveProps {
  /** Number of frequency bars */
  barCount?: number;
  /** Bar colors */
  colors?: string[];
  /** Animation speed (0-1) */
  speed?: number;
  /** Reactive intensity (0-1) */
  intensity?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Bar style */
  style_type?: 'bars' | 'circular' | 'wave';
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface FrequencyBar {
  value: number;
  targetValue: number;
  velocity: number;
}

/**
 * SoundReactive
 *
 * Simulated audio visualization / equalizer effect.
 * Creates a music/audio reactive aesthetic.
 */
export const SoundReactive: React.FC<SoundReactiveProps> = ({
  barCount = 32,
  colors = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'],
  speed = 0.5,
  intensity = 0.7,
  opacity = 0.9,
  style_type = 'bars',
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barsRef = useRef<FrequencyBar[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initBars = useCallback(() => {
    const bars: FrequencyBar[] = [];

    for (let i = 0; i < barCount; i++) {
      bars.push({
        value: 0,
        targetValue: 0,
        velocity: 0,
      });
    }

    barsRef.current = bars;
  }, [barCount]);

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

    // Simulate audio frequencies
    barsRef.current.forEach((bar, i) => {
      if (!prefersReducedMotion) {
        // Generate pseudo-random "audio" data
        const baseFreq = Math.sin(timeRef.current * (1 + i * 0.1) * speed * 5);
        const harmonics = Math.sin(timeRef.current * (2 + i * 0.2) * speed * 3) * 0.5;
        const noise = Math.random() * 0.3;

        const rawValue = (baseFreq + harmonics + noise) * intensity;
        bar.targetValue = Math.max(0, Math.min(1, (rawValue + 1) / 2));

        // Smooth animation
        const spring = 0.15;
        const damping = 0.7;

        const force = (bar.targetValue - bar.value) * spring;
        bar.velocity += force;
        bar.velocity *= damping;
        bar.value += bar.velocity;
      }
    });

    if (style_type === 'bars') {
      const barWidth = width / barCount;
      const gap = 2;

      barsRef.current.forEach((bar, i) => {
        const barHeight = bar.value * height * 0.8;
        const x = i * barWidth;
        const y = height - barHeight;

        const colorIndex = Math.floor((bar.value * colors.length));
        const color = colors[Math.min(colorIndex, colors.length - 1)];

        // Glow effect
        const gradient = ctx.createLinearGradient(x, height, x, y);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, color);
        gradient.addColorStop(1, '#ffffff');

        ctx.fillStyle = gradient;
        ctx.globalAlpha = opacity;
        ctx.fillRect(x + gap / 2, y, barWidth - gap, barHeight);

        // Reflection
        const reflectionGradient = ctx.createLinearGradient(x, height, x, height + barHeight * 0.3);
        reflectionGradient.addColorStop(0, color);
        reflectionGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = reflectionGradient;
        ctx.globalAlpha = opacity * 0.3;
        ctx.fillRect(x + gap / 2, height, barWidth - gap, barHeight * 0.3);
      });
    } else if (style_type === 'circular') {
      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) * 0.2;

      barsRef.current.forEach((bar, i) => {
        const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
        const barLength = bar.value * baseRadius;

        const innerX = centerX + Math.cos(angle) * baseRadius;
        const innerY = centerY + Math.sin(angle) * baseRadius;
        const outerX = centerX + Math.cos(angle) * (baseRadius + barLength);
        const outerY = centerY + Math.sin(angle) * (baseRadius + barLength);

        const colorIndex = Math.floor((bar.value * colors.length));
        const color = colors[Math.min(colorIndex, colors.length - 1)];

        ctx.beginPath();
        ctx.moveTo(innerX, innerY);
        ctx.lineTo(outerX, outerY);
        ctx.strokeStyle = color;
        ctx.lineWidth = (Math.PI * 2 * baseRadius) / barCount - 2;
        ctx.lineCap = 'round';
        ctx.globalAlpha = opacity;
        ctx.stroke();

        // Glow
        ctx.lineWidth = (Math.PI * 2 * baseRadius) / barCount + 4;
        ctx.globalAlpha = opacity * 0.3;
        ctx.stroke();
      });

      // Center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 0.9, 0, Math.PI * 2);
      ctx.fillStyle = colors[0] + '40';
      ctx.globalAlpha = opacity;
      ctx.fill();
    } else if (style_type === 'wave') {
      const centerY = height / 2;

      // Draw wave
      ctx.beginPath();
      ctx.moveTo(0, centerY);

      barsRef.current.forEach((bar, i) => {
        const x = (i / (barCount - 1)) * width;
        const y = centerY + bar.value * height * 0.4 * (i % 2 === 0 ? 1 : -1);
        ctx.lineTo(x, y);
      });

      const gradient = ctx.createLinearGradient(0, centerY - height * 0.4, 0, centerY + height * 0.4);
      colors.forEach((color, i) => {
        gradient.addColorStop(i / (colors.length - 1), color);
      });

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = opacity;
      ctx.stroke();

      // Glow
      ctx.lineWidth = 10;
      ctx.globalAlpha = opacity * 0.3;
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [barCount, colors, speed, intensity, opacity, style_type, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initBars();
  }, [initBars]);

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

export default SoundReactive;
