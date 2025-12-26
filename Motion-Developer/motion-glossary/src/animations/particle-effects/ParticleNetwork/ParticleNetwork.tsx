import React, { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface ParticleNetworkProps {
  /** Number of nodes */
  nodeCount?: number;
  /** Node size in pixels */
  nodeSize?: number;
  /** Node color */
  nodeColor?: string;
  /** Connection line color */
  lineColor?: string;
  /** Maximum connection distance in pixels */
  connectionDistance?: number;
  /** Movement speed (0-1) */
  speed?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Mouse attraction strength (0 = none, 1 = strong) */
  mouseAttraction?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

/**
 * ParticleNetwork
 *
 * Connected constellation of nodes with lines between nearby points.
 * Creates a dynamic, web-like network effect with mouse interaction.
 */
export const ParticleNetwork: React.FC<ParticleNetworkProps> = ({
  nodeCount = 40,
  nodeSize = 3,
  nodeColor = '#8b5cf6',
  lineColor = '#8b5cf6',
  connectionDistance = 150,
  speed = 0.3,
  opacity = 0.6,
  mouseAttraction = 0.5,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  // Initialize nodes
  const initNodes = useCallback((width: number, height: number) => {
    const nodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed * 2,
        vy: (Math.random() - 0.5) * speed * 2,
        size: nodeSize * (0.5 + Math.random() * 0.5),
      });
    }
    nodesRef.current = nodes;
  }, [nodeCount, nodeSize, speed]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const nodes = nodesRef.current;

    // Update node positions (skip if reduced motion)
    if (!prefersReducedMotion) {
      nodes.forEach((node) => {
        // Mouse attraction
        if (mouseAttraction > 0 && mouseRef.current.active) {
          const dx = mouseRef.current.x - node.x;
          const dy = mouseRef.current.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 200;

          if (dist < maxDist && dist > 0) {
            const force = ((maxDist - dist) / maxDist) * mouseAttraction * 0.02;
            node.vx += (dx / dist) * force;
            node.vy += (dy / dist) * force;
          }
        }

        // Apply velocity with damping
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.99;
        node.vy *= 0.99;

        // Keep minimum speed
        const currentSpeed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (currentSpeed < speed * 0.5) {
          const angle = Math.random() * Math.PI * 2;
          node.vx += Math.cos(angle) * speed * 0.1;
          node.vy += Math.sin(angle) * speed * 0.1;
        }

        // Bounce off edges
        if (node.x < 0 || node.x > width) {
          node.vx *= -1;
          node.x = Math.max(0, Math.min(width, node.x));
        }
        if (node.y < 0 || node.y > height) {
          node.vy *= -1;
          node.y = Math.max(0, Math.min(height, node.y));
        }
      });
    }

    // Draw connections
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const lineOpacity = (1 - dist / connectionDistance) * opacity * 0.5;
          ctx.globalAlpha = lineOpacity;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      // Draw connection to mouse if nearby
      if (mouseRef.current.active && mouseAttraction > 0) {
        const dx = nodes[i].x - mouseRef.current.x;
        const dy = nodes[i].y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance * 1.5) {
          const lineOpacity = (1 - dist / (connectionDistance * 1.5)) * opacity * 0.8;
          ctx.globalAlpha = lineOpacity;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    ctx.fillStyle = nodeColor;
    nodes.forEach((node) => {
      ctx.globalAlpha = opacity;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw mouse node if active
    if (mouseRef.current.active && mouseAttraction > 0) {
      ctx.globalAlpha = opacity;
      ctx.beginPath();
      ctx.arc(mouseRef.current.x, mouseRef.current.y, nodeSize * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [nodeColor, lineColor, connectionDistance, opacity, speed, mouseAttraction, prefersReducedMotion]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    initNodes(canvas.width, canvas.height);
  }, [initNodes]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000, active: false };
  }, []);

  // Setup
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleResize, handleMouseMove, handleMouseLeave, animate]);

  // Re-init when props change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      initNodes(canvas.width, canvas.height);
    }
  }, [nodeCount, nodeSize, speed, initNodes]);

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
        pointerEvents: mouseAttraction > 0 ? 'auto' : 'none',
        ...style,
      }}
    />
  );
};

export default ParticleNetwork;

export const particleNetworkCode = `import { useRef, useEffect } from 'react';

const ParticleNetwork = ({
  nodeCount = 40,
  nodeColor = '#8b5cf6',
  lineColor = '#8b5cf6',
  connectionDistance = 150,
  speed = 0.3,
  opacity = 0.6,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Initialize nodes
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed * 2,
      vy: (Math.random() - 0.5) * speed * 2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update positions
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      });

      // Draw connections
      ctx.strokeStyle = lineColor;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.globalAlpha = (1 - dist / connectionDistance) * opacity;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      ctx.fillStyle = nodeColor;
      ctx.globalAlpha = opacity;
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} />;
};`;

export const particleNetworkCssCode = `/* CSS cannot create connected particle networks.
   Use the JavaScript/Canvas implementation.

   The line-drawing between nodes requires
   dynamic calculation that CSS cannot provide. */

.network-container {
  position: relative;
  overflow: hidden;
  background: #0a0a0a;
}

/* You could fake a static version with SVG */
.network-node {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #8b5cf6;
  border-radius: 50%;
}

/* Lines would need to be SVG <line> elements */`;
