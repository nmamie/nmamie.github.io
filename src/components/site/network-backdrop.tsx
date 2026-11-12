import { useEffect, useRef } from 'react';

/**
 * Drifting graph of nodes and edges behind the intro: a nod to graph learning and
 * agent swarms. Nodes near the pointer light up and link to it. Colors come from
 * the active daisyUI theme, so it follows light/dark automatically. Static frame
 * when the visitor prefers reduced motion.
 */
const NetworkBackdrop = ({ theme }: { theme: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const css = getComputedStyle(document.documentElement);
    const colors = [
      '--color-primary',
      '--color-secondary',
      '--color-accent',
    ].map((v) => css.getPropertyValue(v).trim() || '#0f6e74');
    const lineColor =
      css.getPropertyValue('--color-base-content').trim() || '#1f2328';
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pointer = { x: -9999, y: -9999 };
    type Node = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      c: string;
    };
    let nodes: Node[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, (w * h) / 9000));
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 1.4 + Math.random() * 2.2,
        c: colors[i % 3],
      }));
    };

    const LINK = 120;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.globalAlpha = (1 - d / LINK) * 0.18;
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const dp = Math.hypot(a.x - pointer.x, a.y - pointer.y);
        if (dp < 160) {
          ctx.globalAlpha = (1 - dp / 160) * 0.6;
          ctx.strokeStyle = a.c;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
        ctx.globalAlpha = dp < 160 ? 0.95 : 0.55;
        ctx.fillStyle = a.c;
        ctx.beginPath();
        ctx.arc(a.x, a.y, dp < 160 ? a.r + 1 : a.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    const step = () => {
      nodes.forEach((n) => {
        // gentle pull towards the pointer, like a swarm following a target
        const dx = pointer.x - n.x;
        const dy = pointer.y - n.y;
        const d = Math.hypot(dx, dy);
        if (d < 160 && d > 1) {
          n.vx += (dx / d) * 0.015;
          n.vy += (dy / d) * 0.015;
        }
        n.vx = Math.max(-0.6, Math.min(0.6, n.vx * 0.995));
        n.vy = Math.max(-0.6, Math.min(0.6, n.vy * 0.995));
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });
      draw();
      raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = pointer.y = -9999;
    };

    resize();
    if (reduced) draw();
    else raf = requestAnimationFrame(step);

    // pause when scrolled out of view
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting && !reduced) raf = requestAnimationFrame(step);
    });
    io.observe(canvas);

    const host = canvas.parentElement!;
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        maskImage:
          'radial-gradient(ellipse at 70% 40%, black 30%, transparent 80%)',
        WebkitMaskImage:
          'radial-gradient(ellipse at 70% 40%, black 30%, transparent 80%)',
      }}
    />
  );
};

export default NetworkBackdrop;
