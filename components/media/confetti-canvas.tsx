'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export interface ConfettiCanvasProps {
  /** Auto-play confetti on mount */
  autoPlay?: boolean;
  /** Duration of entrance animation in ms */
  entranceDuration?: number;
  /** Number of particles to render */
  particleCount?: number;
  /** Base color for confetti (defaults to violet theme) */
  primaryColor?: string;
  /** Secondary accent color */
  secondaryColor?: string;
  /** Whether to enable hover interactions */
  interactive?: boolean;
  /** Callback when user interacts with canvas */
  onInteract?: () => void;
}

export interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  scale: number;
  type: 'triangle' | 'square' | 'circle';
}

const DEFAULT_CONFIG = {
  autoPlay: true,
  entranceDuration: 400,
  particleCount: 50,
  primaryColor: '#8b5cf6', // violet-500
  secondaryColor: '#d8b4fe', // violet-300
  interactive: true,
};

const createParticle = (id: number): ConfettiParticle => ({
  id,
  x: Math.random() * 100 - 50,
  y: Math.random() * 100 - 50,
  vx: (Math.random() - 0.5) * 2,
  vy: (Math.random() - 0.5) * 2,
  rotation: (Math.random() - 0.5) * 360,
  scale: Math.random() * 0.8 + 0.4,
  type: ['triangle', 'square', 'circle'][Math.floor(Math.random() * 3)] as ConfettiParticle['type'],
});

const Triangle = ({ x, y, rotation, scale }: { x: number; y: number; rotation: number; scale: number }) => (
  <motion.path
    d="M0,-50 L25,25 L-25,25 Z"
    transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}
    fill="#8b5cf6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  />
);

const Square = ({ x, y, rotation, scale }: { x: number; y: number; rotation: number; scale: number }) => (
  <motion.rect
    x={x - 25}
    y={y - 25}
    width={50}
    height={50}
    rx={4}
    transform={`rotate(${rotation})`}
    fill="#d8b4fe"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  />
);

const Circle = ({ x, y, rotation, scale }: { x: number; y: number; rotation: number; scale: number }) => (
  <motion.circle
    cx={x}
    cy={y}
    r={25}
    transform={`rotate(${rotation}, ${x}, ${y})`}
    fill="#a78bfa"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  />
);

const Particle = ({ particle, primaryColor, secondaryColor }: { particle: ConfettiParticle; primaryColor: string; secondaryColor: string }) => {
  const isTriangle = particle.type === 'triangle';
  const isSquare = particle.type === 'square';
  const isCircle = particle.type === 'circle';

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={isInteractive ? { scale: 1.2 } : undefined}
    >
      {(isTriangle && <Triangle x={particle.x * 5} y={particle.y * 5} rotation={particle.rotation} scale={particle.scale} />) ||
       (isSquare && <Square x={particle.x * 5} y={particle.y * 5} rotation={particle.rotation} scale={particle.scale} />) ||
       (isCircle && <Circle x={particle.x * 5} y={particle.y * 5} rotation={particle.rotation} scale={particle.scale} />)}
    </motion.g>
  );
};

export const ConfettiCanvas = ({ autoPlay, entranceDuration, particleCount, primaryColor, secondaryColor, interactive, onInteract }: ConfettiCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (autoPlay) {
      const newParticles: ConfettiParticle[] = [];
      for (let i = 0; i < particleCount; i++) {
        newParticles.push(createParticle(i));
      }
      setParticles(newParticles);
    }
  }, [autoPlay, particleCount]);

  useEffect(() => {
    if (!reducedMotion && isHovered) {
      const interval = setInterval(() => {
        setParticles((prev) => prev.map(p => ({
          ...p,
          x: p.x + p.vx * 0.1,
          y: p.y + p.vy * 0.1,
          rotation: (p.rotation + 2) % 360,
        })));
      }, 50);

      return () => clearInterval(interval);
    }
  }, [reducedMotion, isHovered]);

  const handleCanvasClick = useCallback(() => {
    if (!interactive) return;
    onInteract?.();
    setParticles((prev) => prev.map(p => ({
      ...p,
      x: p.x + (Math.random() - 0.5) * 20,
      y: p.y + (Math.random() - 0.5) * 20,
      rotation: (p.rotation + Math.random() * 720) % 360,
    })));
  }, [interactive, onInteract]);

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-96 overflow-hidden bg-gradient-to-br from-background via-muted to-primary/10 rounded-lg border-border"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCanvasClick}
    >
      <AnimatePresence>
        {particles.map((p, i) => (
          <Particle key={`${i}-${p.id}`} particle={p} primaryColor={primaryColor} secondaryColor={secondaryColor} />
        ))}
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center"
        >
          <h3 className="text-foreground font-semibold text-lg mb-1">Syntheon Confetti</h3>
          <p className="text-muted-foreground text-sm">Interactive celebration canvas</p>
        </motion.div>
      </div>
    </div>
  );
};

export const ConfettiControls = ({ config, onChange }: {
  config: Required<ConfettiCanvasProps>;
  onChange: (updates: Partial<Required<ConfettiCanvasProps>>) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-md border-border rounded-lg p-4 shadow-lg"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-muted-foreground text-xs block mb-1">Particle Count</label>
          <Slider
            value={[config.particleCount]}
            min={10}
            max={200}
            step={10}
            onValueChange={(v) => onChange({ particleCount: v[0] })}
            className="h-2"
          />
        </div>

        <div>
          <label className="text-muted-foreground text-xs block mb-1">Entrance Duration (ms)</label>
          <Slider
            value={[config.entranceDuration]}
            min={100}
            max={2000}
            step={50}
            onValueChange={(v) => onChange({ entranceDuration: v[0] })}
            className="h-2"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-muted-foreground text-xs">Auto Play</label>
          <Switch
            checked={config.autoPlay}
            onCheckedChange={(v) => onChange({ autoPlay: v })}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-muted-foreground text-xs">Interactive</label>
          <Switch
            checked={config.interactive}
            onCheckedChange={(v) => onChange({ interactive: v })}
          />
        </div>
      </div>

      <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => {
        const newParticles = [];
        for (let i = 0; i < config.particleCount; i++) {
          newParticles.push(createParticle(i));
        }
        onChange({ particleCount: newParticles.length });
      }}>
        Reset Particles
      </Button>
    </motion.div>
  );
};

export default ConfettiCanvas;
