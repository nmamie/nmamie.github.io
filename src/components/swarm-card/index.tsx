import React, { useEffect, useRef, useState } from 'react';
import { PiSelectionAll } from 'react-icons/pi';
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
          // Find closest target
          let closestTarget = targetList[0];
          let minDist = Math.sqrt((boid.x - closestTarget.x) ** 2 + (boid.y - closestTarget.y) ** 2);

          for (let k = 1; k < targetList.length; k++) {
            const d = Math.sqrt((boid.x - targetList[k].x) ** 2 + (boid.y - targetList[k].y) ** 2);
            if (d < minDist) {
              minDist = d;
              closestTarget = targetList[k];
            }
          }

          // Steer force
          boid.vx += (closestTarget.x - boid.x) * 0.0015;
          boid.vy += (closestTarget.y - boid.y) * 0.0015;

          // Consume food if extremely close
          if (minDist < 15) {
            setTargets((prev) => prev.filter((t) => t !== closestTarget));
          }
        }

        // Keep within walls
        const margin = 20;
        const turnFactor = 0.2;
        if (boid.x < margin) boid.vx += turnFactor;
        if (boid.x > canvas.width - margin) boid.vx -= turnFactor;
        if (boid.y < margin) boid.vy += turnFactor;
        if (boid.y > canvas.height - margin) boid.vy -= turnFactor;

        // Speed limit
        const speed = Math.sqrt(boid.vx ** 2 + boid.vy ** 2);
        if (speed > speedLimit) {
          boid.vx = (boid.vx / speed) * speedLimit;
          boid.vy = (boid.vy / speed) * speedLimit;
        }

        // Update positions
        boid.x += boid.vx;
        boid.y += boid.vy;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Resolve theme colors dynamically
      const primaryColor = getComputedStyle(canvas).getPropertyValue('--p');
      const resolvedColor = primaryColor ? `oklch(${primaryColor})` : '#3b82f6';
      
      // Draw targets
      const currentTargets = stateRef.current.targets;
      ctx.lineWidth = 1.5;
      currentTargets.forEach((target) => {
        ctx.strokeStyle = resolvedColor;
        ctx.beginPath();
        // Pulsing radius
        const pulse = target.radius + Math.sin(Date.now() / 150) * 2;
        ctx.arc(target.x, target.y, pulse, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.fillStyle = resolvedColor;
        ctx.beginPath();
        ctx.arc(target.x, target.y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });

      // Draw Boids (triangles pointing in velocity direction)
      ctx.fillStyle = resolvedColor;
      boids.forEach((boid) => {
        const angle = Math.atan2(boid.vy, boid.vx);
        ctx.save();
        ctx.translate(boid.x, boid.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(-4, -4);
        ctx.lineTo(-4, 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
    };

    const loop = () => {
      updateSimulation();
      draw();
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
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
    <div className="col-span-1 lg:col-span-2">
      <div className="card bg-base-200 shadow-xl border border-base-300">
        <div className="card-body p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              {loading ? (
                skeleton({
                  widthCls: 'w-12',
                  heightCls: 'h-12',
                  className: 'rounded-xl',
                })
              ) : (
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl text-primary">
                  <PiSelectionAll className="text-2xl" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-bold text-base-content truncate">
                  {loading
                    ? skeleton({ widthCls: 'w-48', heightCls: 'h-8' })
                    : 'Swarm Intelligence Playground'}
                </h2>
                <div className="text-base-content/60 text-xs sm:text-sm mt-1 truncate">
                  {loading
                    ? skeleton({ widthCls: 'w-32', heightCls: 'h-4' })
                    : 'Interactive simulation of Boids flocking behavior. Click to drop food!'}
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            skeleton({ widthCls: 'w-full', heightCls: 'h-60', shape: 'rounded-xl' })
          ) : (
            <div className="flex flex-col gap-6">
              <div
                ref={containerRef}
                className="relative bg-base-100 rounded-xl border border-base-300 overflow-hidden cursor-crosshair h-[240px]"
              >
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="absolute inset-0 w-full h-full block"
                />
              </div>

              {/* Sliders for Simulation Controls */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="flex flex-col gap-1">
                  <span className="opacity-70 font-semibold flex justify-between">
                    <span>Separation</span>
                    <span>{separation.toFixed(1)}</span>
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
                    <span>{alignment.toFixed(1)}</span>
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
                    <span>{cohesion.toFixed(1)}</span>
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
                    <span>{maxSpeed.toFixed(1)}</span>
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
