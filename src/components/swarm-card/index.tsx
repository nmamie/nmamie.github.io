import React, { useEffect, useRef, useState } from 'react';
import { PiSelectionAll } from 'react-icons/pi';
import { HiOutlineSparkles, HiOutlineExternalLink } from 'react-icons/hi';
import { skeleton } from '../../utils';

interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Target {
  x: number;
  y: number;
  radius: number;
}

const SwarmCard = ({ loading }: { loading: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Simulation parameters
  const [cohesion, setCohesion] = useState<number>(1.0);
  const [alignment, setAlignment] = useState<number>(1.0);
  const [separation, setSeparation] = useState<number>(1.5);
  const [maxSpeed, setMaxSpeed] = useState<number>(3.0);

  const [targets, setTargets] = useState<Target[]>([]);

  // Keep state refs for animation loop
  const stateRef = useRef({
    cohesion,
    alignment,
    separation,
    maxSpeed,
    targets,
  });

  useEffect(() => {
    stateRef.current = {
      cohesion,
      alignment,
      separation,
      maxSpeed,
      targets,
    };
  }, [cohesion, alignment, separation, maxSpeed, targets]);

  useEffect(() => {
    if (loading || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = 240;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize Boids
    const numBoids = 45;
    const boids: Boid[] = [];
    for (let i = 0; i < numBoids; i++) {
      boids.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
      });
    }

    let animationFrameId: number;

    const distance = (b1: Boid, b2: Boid) => {
      return Math.sqrt((b1.x - b2.x) ** 2 + (b1.y - b2.y) ** 2);
    };

    const updateSimulation = () => {
      const { cohesion: coh, alignment: alg, separation: sep, maxSpeed: speedLimit, targets: targetList } = stateRef.current;

      const visualRange = 40;
      const protectedRange = 12;

      for (let i = 0; i < boids.length; i++) {
        const boid = boids[i];

        let closeDx = 0;
        let closeDy = 0;
        let avgVx = 0;
        let avgVy = 0;
        let avgX = 0;
        let avgY = 0;
        let neighbors = 0;

        for (let j = 0; j < boids.length; j++) {
          if (i === j) continue;
          const other = boids[j];
          const dist = distance(boid, other);

          if (dist < visualRange) {
            if (dist < protectedRange) {
              closeDx += boid.x - other.x;
              closeDy += boid.y - other.y;
            }

            avgVx += other.vx;
            avgVy += other.vy;
            avgX += other.x;
            avgY += other.y;
            neighbors++;
          }
        }

        // Apply rules
        // 1. Separation
        boid.vx += closeDx * 0.05 * sep;
        boid.vy += closeDy * 0.05 * sep;

        if (neighbors > 0) {
          avgVx /= neighbors;
          avgVy /= neighbors;
          avgX /= neighbors;
          avgY /= neighbors;

          // 2. Alignment
          boid.vx += (avgVx - boid.vx) * 0.05 * alg;
          boid.vy += (avgVy - boid.vy) * 0.05 * alg;

          // 3. Cohesion
          boid.vx += (avgX - boid.x) * 0.0005 * coh;
          boid.vy += (avgY - boid.y) * 0.0005 * coh;
        }

        // Steer towards target attractors (food)
        if (targetList.length > 0) {
          let closestTarget = targetList[0];
          let minDist = Math.sqrt((boid.x - closestTarget.x) ** 2 + (boid.y - closestTarget.y) ** 2);

          for (let k = 1; k < targetList.length; k++) {
            const d = Math.sqrt((boid.x - targetList[k].x) ** 2 + (boid.y - targetList[k].y) ** 2);
            if (d < minDist) {
              minDist = d;
              closestTarget = targetList[k];
            }
          }

          const targetDx = closestTarget.x - boid.x;
          const targetDy = closestTarget.y - boid.y;
          boid.vx += targetDx * 0.005;
          boid.vy += targetDy * 0.005;

          // Check if target is consumed
          if (minDist < 10) {
            setTargets((prev) => prev.filter((t) => t !== closestTarget));
          }
        }

        // Speed limit
        const speed = Math.sqrt(boid.vx ** 2 + boid.vy ** 2);
        if (speed > speedLimit) {
          boid.vx = (boid.vx / speed) * speedLimit;
          boid.vy = (boid.vy / speed) * speedLimit;
        }

        // Update positions
        boid.x += boid.vx;
        boid.y += boid.vy;

        // Screen wrapping with margins
        const margin = 10;
        if (boid.x < -margin) boid.x = canvas.width + margin;
        if (boid.x > canvas.width + margin) boid.x = -margin;
        if (boid.y < -margin) boid.y = canvas.height + margin;
        if (boid.y > canvas.height + margin) boid.y = -margin;
      }
    };

    const drawSimulation = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw targets
      const currentTargets = stateRef.current.targets;
      for (const t of currentTargets) {
        ctx.beginPath();
        ctx.arc(t.x, t.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Pulsing glow
        ctx.beginPath();
        ctx.arc(t.x, t.y, 12, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw boids
      for (const boid of boids) {
        const angle = Math.atan2(boid.vy, boid.vx);
        ctx.save();
        ctx.translate(boid.x, boid.y);
        ctx.rotate(angle);

        // Draw bird/agent triangle
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(-6, -4);
        ctx.lineTo(-4, 0);
        ctx.lineTo(-6, 4);
        ctx.closePath();

        // Style
        ctx.fillStyle = 'rgba(99, 102, 241, 0.85)';
        ctx.fill();

        ctx.restore();
      }
    };

    const loop = () => {
      updateSimulation();
      drawSimulation();
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [loading]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add target attractor
    setTargets((prev) => [...prev, { x, y, radius: 8 }]);
  };

  return (
    <div id="swarm-playground" className="col-span-1 lg:col-span-2 scroll-mt-28">
      <div className="card bg-base-200 shadow-xl border border-base-300">
        <div className="card-body p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center space-x-3">
              {loading ? (
                skeleton({
                  widthCls: 'w-12',
                  heightCls: 'h-12',
                  className: 'rounded-xl',
                })
              ) : (
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl text-primary shrink-0">
                  <PiSelectionAll className="text-2xl" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-bold text-base-content truncate">
                  {loading
                    ? skeleton({ widthCls: 'w-48', heightCls: 'h-8' })
                    : 'Swarm Intelligence Sandbox'}
                </h2>
                <div className="text-base-content/60 text-xs sm:text-sm mt-0.5 truncate">
                  {loading
                    ? skeleton({ widthCls: 'w-32', heightCls: 'h-4' })
                    : 'Emergent collective behavior • Click inside to drop attraction targets'}
                </div>
              </div>
            </div>

            <a
              href="https://link.springer.com/chapter/10.1007/978-981-95-0982-9_20"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-xs sm:btn-sm rounded-lg font-medium gap-1.5 shrink-0 border-base-content/20 hover:bg-base-300"
            >
              <HiOutlineSparkles className="text-primary text-sm" />
              <span>Society of HiveMind Paper</span>
              <HiOutlineExternalLink className="text-xs" />
            </a>
          </div>

          <div className="p-3 bg-base-100 rounded-xl border border-base-300 text-xs text-base-content/75 leading-relaxed mb-4">
            <span className="font-semibold text-primary">Research Context: </span>
            In our work on <em>The Society of HiveMind (ICSI 2025)</em>, we explore how swarms of foundation models optimize collective reasoning through decentralized local feedback loops. This sandbox demonstrates the underlying classical flocking dynamics (separation, alignment, cohesion) that inspire collective AI architectures.
          </div>

          {loading ? (
            skeleton({ widthCls: 'w-full', heightCls: 'h-60', shape: 'rounded-xl' })
          ) : (
            <div className="flex flex-col gap-5">
              <div
                ref={containerRef}
                className="relative bg-base-100 rounded-xl border border-base-300 overflow-hidden cursor-crosshair h-[240px] shadow-inner"
              >
                <div className="absolute top-2 right-2 z-10 pointer-events-none">
                  <span className="badge badge-sm bg-base-200/80 backdrop-blur-sm text-[10px] border border-base-300">
                    Click to attract swarm
                  </span>
                </div>
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="absolute inset-0 w-full h-full block"
                />
              </div>

              {/* Sliders for Simulation Controls */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs p-3 bg-base-100 rounded-xl border border-base-300">
                <div className="flex flex-col gap-1">
                  <span className="opacity-70 font-semibold flex justify-between">
                    <span>Separation</span>
                    <span className="font-mono">{separation.toFixed(1)}</span>
                  </span>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={separation}
                    onChange={(e) => setSeparation(parseFloat(e.target.value))}
                    className="range range-primary range-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="opacity-70 font-semibold flex justify-between">
                    <span>Alignment</span>
                    <span className="font-mono">{alignment.toFixed(1)}</span>
                  </span>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={alignment}
                    onChange={(e) => setAlignment(parseFloat(e.target.value))}
                    className="range range-primary range-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="opacity-70 font-semibold flex justify-between">
                    <span>Cohesion</span>
                    <span className="font-mono">{cohesion.toFixed(1)}</span>
                  </span>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={cohesion}
                    onChange={(e) => setCohesion(parseFloat(e.target.value))}
                    className="range range-primary range-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="opacity-70 font-semibold flex justify-between">
                    <span>Flock Speed</span>
                    <span className="font-mono">{maxSpeed.toFixed(1)}</span>
                  </span>
                  <input
                    type="range"
                    min="1.0"
                    max="8.0"
                    step="0.5"
                    value={maxSpeed}
                    onChange={(e) => setMaxSpeed(parseFloat(e.target.value))}
                    className="range range-primary range-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwarmCard;
