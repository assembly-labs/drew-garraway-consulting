import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface QuantumParticlesProps {
  /** Number of particles */
  particleCount?: number;
  /** Particle colors */
  colors?: string[];
  /** Animation speed (0-1) */
  speed?: number;
  /** Uncertainty (affects jitter) */
  uncertainty?: number;
  /** Entanglement probability (0-1) */
  entanglement?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface QuantumState {
  x: number;
  y: number;
  probabilityCloud: { dx: number; dy: number; intensity: number }[];
  phase: number;
  spin: number;
  color: string;
  entangledWith: number | null;
}

/**
 * QuantumParticles
 *
 * Quantum-inspired particles with probability clouds and entanglement.
 * Creates a scientific, mysterious aesthetic.
 */
export const QuantumParticles: React.FC<QuantumParticlesProps> = ({
  particleCount = 20,
  colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#10b981'],
  speed = 0.3,
  uncertainty = 0.6,
  entanglement = 0.3,
  opacity = 0.8,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statesRef = useRef<QuantumState[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initStates = useCallback((width: number, height: number) => {
    const states: QuantumState[] = [];

    for (let i = 0; i < particleCount; i++) {
      const probabilityCloud = [];
      const cloudPoints = 8;

      for (let c = 0; c < cloudPoints; c++) {
        probabilityCloud.push({
          dx: (Math.random() - 0.5) * 60 * uncertainty,
          dy: (Math.random() - 0.5) * 60 * uncertainty,
          intensity: Math.random(),
        });
      }

      states.push({
        x: Math.random() * width,
        y: Math.random() * height,
        probabilityCloud,
        phase: Math.random() * Math.PI * 2,
        spin: Math.random() > 0.5 ? 1 : -1,
        color: colors[Math.floor(Math.random() * colors.length)],
        entangledWith: null,
      });
    }

    // Create entangled pairs
    for (let i = 0; i < states.length; i++) {
      if (Math.random() < entanglement && states[i].entangledWith === null) {
        const partner = Math.floor(Math.random() * states.length);
        if (partner !== i && states[partner].entangledWith === null) {
          states[i].entangledWith = partner;
          states[partner].entangledWith = i;
          states[partner].spin = -states[i].spin;
        }
      }
    }

    statesRef.current = states;
  }, [particleCount, colors, uncertainty, entanglement]);

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

    // Draw entanglement connections
    statesRef.current.forEach((state, i) => {
      if (state.entangledWith !== null && state.entangledWith > i) {
        const partner = statesRef.current[state.entangledWith];

        ctx.beginPath();
        ctx.moveTo(state.x, state.y);
        ctx.lineTo(partner.x, partner.y);

        const gradient = ctx.createLinearGradient(state.x, state.y, partner.x, partner.y);
        gradient.addColorStop(0, state.color);
        gradient.addColorStop(0.5, '#ffffff40');
        gradient.addColorStop(1, partner.color);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.globalAlpha = opacity * 0.3;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    // Update and draw particles
    statesRef.current.forEach((state) => {
      if (!prefersReducedMotion) {
        state.phase += speed * 0.05 * state.spin;

        // Quantum tunneling - random position jumps
        if (Math.random() < 0.001 * uncertainty) {
          state.x = Math.random() * width;
          state.y = Math.random() * height;
        }

        // Normal movement with uncertainty
        state.x += (Math.random() - 0.5) * uncertainty * 2;
        state.y += (Math.random() - 0.5) * uncertainty * 2;

        // Update probability cloud
        state.probabilityCloud.forEach((cloud) => {
          cloud.dx += (Math.random() - 0.5) * 2;
          cloud.dy += (Math.random() - 0.5) * 2;
          cloud.dx *= 0.95;
          cloud.dy *= 0.95;
          cloud.intensity = 0.3 + Math.sin(timeRef.current * 2 + cloud.dx) * 0.7 * 0.5 + 0.5;
        });

        // Wrap
        if (state.x < 0) state.x = width;
        if (state.x > width) state.x = 0;
        if (state.y < 0) state.y = height;
        if (state.y > height) state.y = 0;
      }

      // Draw probability cloud
      state.probabilityCloud.forEach((cloud) => {
        const cloudX = state.x + cloud.dx;
        const cloudY = state.y + cloud.dy;

        const gradient = ctx.createRadialGradient(
          cloudX, cloudY, 0,
          cloudX, cloudY, 20
        );
        gradient.addColorStop(0, state.color);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(cloudX, cloudY, 20, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = opacity * cloud.intensity * 0.3;
        ctx.fill();
      });

      // Draw main particle
      const pulse = Math.sin(state.phase * 3) * 0.3 + 0.7;

      ctx.beginPath();
      ctx.arc(state.x, state.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = state.color;
      ctx.globalAlpha = opacity;
      ctx.fill();

      // Glow
      const glowGradient = ctx.createRadialGradient(
        state.x, state.y, 0,
        state.x, state.y, 20
      );
      glowGradient.addColorStop(0, state.color);
      glowGradient.addColorStop(0.5, state.color + '40');
      glowGradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(state.x, state.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.globalAlpha = opacity * pulse;
      ctx.fill();

      // Spin indicator
      const spinAngle = state.phase;
      ctx.beginPath();
      ctx.arc(state.x, state.y, 10, spinAngle, spinAngle + Math.PI);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.globalAlpha = opacity * 0.5;
      ctx.stroke();
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, uncertainty, opacity, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initStates(canvas.width, canvas.height);
  }, [initStates]);

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

export default QuantumParticles;
