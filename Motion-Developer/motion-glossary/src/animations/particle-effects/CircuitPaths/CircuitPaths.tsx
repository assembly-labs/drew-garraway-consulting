import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface CircuitPathsProps {
  /** Number of circuit paths */
  pathCount?: number;
  /** Circuit color */
  color?: string;
  /** Pulse color */
  pulseColor?: string;
  /** Animation speed (0-1) */
  speed?: number;
  /** Node size */
  nodeSize?: number;
  /** Line width */
  lineWidth?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface CircuitNode {
  x: number;
  y: number;
  connections: number[];
}

interface Pulse {
  pathIndex: number;
  progress: number;
  speed: number;
  reverse: boolean;
}

/**
 * CircuitPaths
 *
 * Animated circuit board traces with traveling pulses.
 * Creates a high-tech electronics aesthetic.
 */
export const CircuitPaths: React.FC<CircuitPathsProps> = ({
  pathCount = 15,
  color = '#10b981',
  pulseColor = '#34d399',
  speed = 0.4,
  nodeSize = 4,
  lineWidth = 2,
  opacity = 0.7,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<CircuitNode[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initCircuit = useCallback((width: number, height: number) => {
    const nodes: CircuitNode[] = [];
    const gridSize = 60;
    const cols = Math.floor(width / gridSize);
    const rows = Math.floor(height / gridSize);

    // Create grid of nodes
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (Math.random() > 0.6) {
          nodes.push({
            x: col * gridSize + gridSize / 2 + (Math.random() - 0.5) * 20,
            y: row * gridSize + gridSize / 2 + (Math.random() - 0.5) * 20,
            connections: [],
          });
        }
      }
    }

    // Create connections (only horizontal and vertical)
    nodes.forEach((node, i) => {
      nodes.forEach((other, j) => {
        if (i >= j) return;
        if (node.connections.length >= 3) return;

        const dx = Math.abs(other.x - node.x);
        const dy = Math.abs(other.y - node.y);

        // Only connect if mostly horizontal or vertical
        if ((dx < gridSize * 1.5 && dy < 20) || (dy < gridSize * 1.5 && dx < 20)) {
          if (Math.random() > 0.5) {
            node.connections.push(j);
          }
        }
      });
    });

    nodesRef.current = nodes;

    // Initialize pulses
    const pulses: Pulse[] = [];
    for (let i = 0; i < pathCount; i++) {
      const nodeIndex = Math.floor(Math.random() * nodes.length);
      const node = nodes[nodeIndex];
      if (node && node.connections.length > 0) {
        pulses.push({
          pathIndex: nodeIndex,
          progress: 0,
          speed: 0.5 + Math.random() * 1,
          reverse: Math.random() > 0.5,
        });
      }
    }
    pulsesRef.current = pulses;
  }, [pathCount]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const nodes = nodesRef.current;

    ctx.clearRect(0, 0, width, height);

    // Draw connections
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = opacity * 0.5;

    nodes.forEach((node) => {
      node.connections.forEach((connectionIndex) => {
        const other = nodes[connectionIndex];
        if (!other) return;

        ctx.beginPath();

        // Draw L-shaped path
        const midX = other.x;
        const midY = node.y;

        ctx.moveTo(node.x, node.y);
        ctx.lineTo(midX, midY);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      });
    });

    // Draw nodes
    nodes.forEach((node) => {
      // Outer glow
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize * 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity * 0.2;
      ctx.fill();

      // Node
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.fill();

      // Center dot
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = opacity * 0.8;
      ctx.fill();
    });

    // Update and draw pulses
    if (!prefersReducedMotion) {
      pulsesRef.current.forEach((pulse) => {
        pulse.progress += pulse.speed * speed * 0.02;

        if (pulse.progress >= 1) {
          pulse.progress = 0;
          const currentNode = nodes[pulse.pathIndex];
          if (currentNode && currentNode.connections.length > 0) {
            const nextConnection = currentNode.connections[
              Math.floor(Math.random() * currentNode.connections.length)
            ];
            pulse.pathIndex = nextConnection;
          }
        }
      });
    }

    // Draw pulses
    pulsesRef.current.forEach((pulse) => {
      const node = nodes[pulse.pathIndex];
      if (!node || node.connections.length === 0) return;

      const targetIndex = node.connections[0];
      const target = nodes[targetIndex];
      if (!target) return;

      // Calculate pulse position on L-path
      const t = pulse.progress;
      let px: number, py: number;

      if (t < 0.5) {
        // First segment
        const segT = t * 2;
        px = node.x + (target.x - node.x) * segT;
        py = node.y;
      } else {
        // Second segment
        const segT = (t - 0.5) * 2;
        px = target.x;
        py = node.y + (target.y - node.y) * segT;
      }

      // Draw pulse glow
      const gradient = ctx.createRadialGradient(px, py, 0, px, py, 15);
      gradient.addColorStop(0, pulseColor);
      gradient.addColorStop(0.5, pulseColor + '80');
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(px, py, 15, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.globalAlpha = opacity;
      ctx.fill();

      // Draw pulse core
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 1;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [color, pulseColor, speed, nodeSize, lineWidth, opacity, prefersReducedMotion]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initCircuit(canvas.width, canvas.height);
  }, [initCircuit]);

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

export default CircuitPaths;
