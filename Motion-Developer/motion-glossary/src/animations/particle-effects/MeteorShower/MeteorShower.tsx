import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface MeteorShowerProps {
  /** Number of meteors */
  meteorCount?: number;
  /** Minimum meteor length */
  minLength?: number;
  /** Maximum meteor length */
  maxLength?: number;
  /** Meteor colors */
  colors?: string[];
  /** Fall speed (0-1) */
  speed?: number;
  /** Angle of meteor fall in degrees */
  angle?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Show meteor glow */
  showGlow?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  thickness: number;
  color: string;
  glowColor: string;
  delay: number;
  active: boolean;
}

/**
 * MeteorShower
 *
 * Streaking meteors falling across the screen with glowing trails.
 * Perfect for space themes or dramatic backgrounds.
 */
export const MeteorShower: React.FC<MeteorShowerProps> = ({
  meteorCount = 15,
  minLength = 50,
  maxLength = 150,
  colors = ['#ffffff', '#fef3c7', '#bfdbfe'],
  speed = 0.5,
  angle = 45,
  opacity = 0.8,
  showGlow = true,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const meteorsRef = useRef<Meteor[]>([]);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const angleRad = (angle * Math.PI) / 180;

  const initMeteors = useCallback((width: number, height: number) => {
    const meteors: Meteor[] = [];

    for (let i = 0; i < meteorCount; i++) {
      const baseColor = colors[Math.floor(Math.random() * colors.length)];
      meteors.push({
        x: Math.random() * width * 1.5 - width * 0.25,
        y: -Math.random() * height,
        length: minLength + Math.random() * (maxLength - minLength),
        speed: 8 + Math.random() * 12,
        thickness: 1 + Math.random() * 2,
        color: baseColor,
        glowColor: baseColor,
        delay: Math.random() * 5000,
        active: false,
      });
    }

    meteorsRef.current = meteors;
  }, [meteorCount, minLength, maxLength, colors]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const now = Date.now();

    meteorsRef.current.forEach((meteor, _index) => {
      if (!meteor.active && now % 10000 > meteor.delay) {
        meteor.active = true;
      }

      if (!meteor.active) return;

      if (!prefersReducedMotion) {
        meteor.x += Math.cos(angleRad) * meteor.speed * speed;
        meteor.y += Math.sin(angleRad) * meteor.speed * speed;
      }

      // Reset meteor when off screen
      if (meteor.y > height + meteor.length || meteor.x > width + meteor.length) {
        meteor.x = Math.random() * width * 1.5 - width * 0.5;
        meteor.y = -meteor.length - Math.random() * height * 0.5;
        meteor.delay = Math.random() * 3000;
        meteor.active = false;
        return;
      }

      // Draw meteor trail
      const endX = meteor.x - Math.cos(angleRad) * meteor.length;
      const endY = meteor.y - Math.sin(angleRad) * meteor.length;

      // Glow effect
      if (showGlow) {
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = meteor.glowColor;
        ctx.lineWidth = meteor.thickness * 4;
        ctx.lineCap = 'round';
        ctx.globalAlpha = opacity * 0.2;
        ctx.filter = 'blur(4px)';
        ctx.stroke();
        ctx.filter = 'none';
      }

      // Main trail with gradient
      const gradient = ctx.createLinearGradient(meteor.x, meteor.y, endX, endY);
      gradient.addColorStop(0, meteor.color);
      gradient.addColorStop(0.3, meteor.color);
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.moveTo(meteor.x, meteor.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = meteor.thickness;
      ctx.lineCap = 'round';
      ctx.globalAlpha = opacity;
      ctx.stroke();

      // Bright head
      ctx.beginPath();
      ctx.arc(meteor.x, meteor.y, meteor.thickness * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = opacity;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, opacity, showGlow, angleRad, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initMeteors(canvas.width, canvas.height);
  }, [initMeteors]);

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

export default MeteorShower;
