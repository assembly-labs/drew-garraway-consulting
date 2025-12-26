import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface WaveformPulseProps {
  /** Number of wave lines */
  lineCount?: number;
  /** Wave colors */
  colors?: string[];
  /** Animation speed (0-1) */
  speed?: number;
  /** Wave amplitude (0-1) */
  amplitude?: number;
  /** Wave frequency */
  frequency?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Mirror effect */
  mirror?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * WaveformPulse
 *
 * Audio waveform visualization with pulsing animation.
 * Creates a dynamic sound/music aesthetic.
 */
export const WaveformPulse: React.FC<WaveformPulseProps> = ({
  lineCount = 5,
  colors = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'],
  speed = 0.5,
  amplitude = 0.4,
  frequency = 3,
  opacity = 0.8,
  mirror = true,
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
    const centerY = height / 2;
    const maxAmplitude = height * amplitude * 0.4;

    if (!prefersReducedMotion) {
      timeRef.current += 0.016 * speed;
    }

    ctx.clearRect(0, 0, width, height);

    // Center line
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = 1;
    ctx.globalAlpha = opacity * 0.2;
    ctx.stroke();

    // Draw waveforms
    for (let line = 0; line < lineCount; line++) {
      const color = colors[line % colors.length];
      const linePhase = (line / lineCount) * Math.PI * 2;
      const lineAmplitude = maxAmplitude * (1 - line / lineCount * 0.3);

      ctx.beginPath();

      for (let x = 0; x <= width; x += 2) {
        const progress = x / width;

        // Multiple wave frequencies combined
        const wave1 = Math.sin(progress * Math.PI * frequency + timeRef.current * 3 + linePhase);
        const wave2 = Math.sin(progress * Math.PI * frequency * 2 + timeRef.current * 5 + linePhase) * 0.3;
        const wave3 = Math.sin(progress * Math.PI * frequency * 0.5 + timeRef.current * 2 + linePhase) * 0.5;

        // Envelope to taper at edges
        const envelope = Math.sin(progress * Math.PI);

        const y = centerY + (wave1 + wave2 + wave3) * lineAmplitude * envelope;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      // Glow effect
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.globalAlpha = opacity * 0.2;
      ctx.stroke();

      // Main line
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = opacity * (1 - line / lineCount * 0.5);
      ctx.stroke();

      // Mirror effect
      if (mirror) {
        ctx.beginPath();

        for (let x = 0; x <= width; x += 2) {
          const progress = x / width;

          const wave1 = Math.sin(progress * Math.PI * frequency + timeRef.current * 3 + linePhase);
          const wave2 = Math.sin(progress * Math.PI * frequency * 2 + timeRef.current * 5 + linePhase) * 0.3;
          const wave3 = Math.sin(progress * Math.PI * frequency * 0.5 + timeRef.current * 2 + linePhase) * 0.5;

          const envelope = Math.sin(progress * Math.PI);

          const y = centerY - (wave1 + wave2 + wave3) * lineAmplitude * envelope;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = opacity * (1 - line / lineCount * 0.5) * 0.7;
        ctx.stroke();
      }
    }

    // Pulse dots at peaks
    for (let line = 0; line < lineCount; line++) {
      const color = colors[line % colors.length];
      const linePhase = (line / lineCount) * Math.PI * 2;

      for (let i = 0; i < 5; i++) {
        const peakX = width * (0.1 + i * 0.2);
        const progress = peakX / width;

        const wave1 = Math.sin(progress * Math.PI * frequency + timeRef.current * 3 + linePhase);
        const wave2 = Math.sin(progress * Math.PI * frequency * 2 + timeRef.current * 5 + linePhase) * 0.3;
        const wave3 = Math.sin(progress * Math.PI * frequency * 0.5 + timeRef.current * 2 + linePhase) * 0.5;
        const envelope = Math.sin(progress * Math.PI);
        const lineAmplitude = maxAmplitude * (1 - line / lineCount * 0.3);

        const peakY = centerY + (wave1 + wave2 + wave3) * lineAmplitude * envelope;

        const pulse = Math.sin(timeRef.current * 5 + i + linePhase) * 0.5 + 0.5;

        ctx.beginPath();
        ctx.arc(peakX, peakY, 3 + pulse * 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity * pulse;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(peakX, peakY, 8 + pulse * 4, 0, Math.PI * 2);
        ctx.globalAlpha = opacity * pulse * 0.3;
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [lineCount, colors, speed, amplitude, frequency, opacity, mirror, prefersReducedMotion]);

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

export default WaveformPulse;
