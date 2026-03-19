import React, { useRef, useEffect, useCallback } from "react";

// =============================================================================
//  NebulaParticles — Interactive particle field with depth parallax
//  Smaller/dimmer particles are "further back" and respond more slowly
//  Symbolism: the user affects the agents
// =============================================================================

const PARTICLE_DENSITY = 0.00018;
const MOUSE_RADIUS = 200;
const RETURN_SPEED = 0.012;
const DAMPING = 0.97;
const REPULSION_STRENGTH = 0.6;

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  depth: number; // 0=far 1=mid 2=near
  isAccent: boolean;
}

interface NebulaParticlesProps {
  className?: string;
}

function useParticleCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  mouseRef: React.RefObject<{ x: number; y: number; active: boolean }>
) {
  const particlesRef = useRef<Particle[]>([]);

  const initParticles = useCallback((w: number, h: number) => {
    const count = Math.floor(w * h * PARTICLE_DENSITY);
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      // Weight distribution: more far particles, fewer near
      const r = Math.random();
      const depth = r < 0.5 ? 0 : r < 0.8 ? 1 : 2;
      const sizeByDepth =
        depth === 0
          ? 0.4 + Math.random() * 0.4
          : depth === 1
            ? 0.8 + Math.random() * 0.8
            : 1.5 + Math.random() * 1.2;
      particles.push({
        x,
        y,
        originX: x,
        originY: y,
        vx: 0,
        vy: 0,
        size: sizeByDepth,
        depth,
        isAccent: Math.random() > 0.92,
      });
    }
    particles.sort((a, b) => a.depth - b.depth);
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const handleResize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(width, height);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);
    handleResize();
    return () => ro.disconnect();
  }, [canvasRef, containerRef, initParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const depthScale = [0.15, 0.45, 1.0];
    const baseOpacity = [0.12, 0.28, 0.5];

    let raf: number;
    const animate = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) { raf = requestAnimationFrame(animate); return; }
      const { width, height } = container.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Forces
      for (const p of particles) {
        const s = depthScale[p.depth];
        if (mouse && mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const effectiveRadius = MOUSE_RADIUS * (0.4 + s * 0.6);
          if (dist < effectiveRadius && dist > 0.01) {
            const force =
              ((effectiveRadius - dist) / effectiveRadius) *
              REPULSION_STRENGTH *
              s;
            p.vx -= (dx / dist) * force * 2;
            p.vy -= (dy / dist) * force * 2;
          }
        }
        p.vx += (p.originX - p.x) * RETURN_SPEED * s;
        p.vy += (p.originY - p.y) * RETURN_SPEED * s;
      }

      // Collisions (near layer only)
      const near = particles.filter((p) => p.depth === 2);
      for (let i = 0; i < near.length; i++) {
        for (let j = i + 1; j < near.length; j++) {
          const a = near[i];
          const b = near[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distSq = dx * dx + dy * dy;
          const minDist = a.size + b.size;
          if (distSq < minDist * minDist) {
            const dist = Math.sqrt(distSq);
            if (dist < 0.01) continue;
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;
            a.x -= nx * overlap * 0.5;
            a.y -= ny * overlap * 0.5;
            b.x += nx * overlap * 0.5;
            b.y += ny * overlap * 0.5;
            const dvx = a.vx - b.vx;
            const dvy = a.vy - b.vy;
            const vn = dvx * nx + dvy * ny;
            if (vn > 0) {
              const imp =
                (-(1 + 0.85) * vn) / (1 / a.size + 1 / b.size);
              a.vx += (imp * nx) / a.size;
              a.vy += (imp * ny) / a.size;
              b.vx -= (imp * nx) / b.size;
              b.vy -= (imp * ny) / b.size;
            }
          }
        }
      }

      // Integrate + draw
      for (const p of particles) {
        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx;
        p.y += p.vy;

        const vel = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const opacity = Math.min(baseOpacity[p.depth] + vel * 0.12, 1);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.isAccent
          ? `rgba(120, 170, 255, ${opacity})`
          : `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [canvasRef, containerRef, mouseRef]);
}

export const NebulaParticles: React.FC<NebulaParticlesProps> = ({
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useParticleCanvas(canvasRef, containerRef, mouseRef);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  return (
    <div
      ref={containerRef}
      style={{ position: "absolute", inset: 0 }}
      className={`overflow-hidden cursor-crosshair ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseRef.current.active = false; }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      />
    </div>
  );
};

export default NebulaParticles;
