'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface StarfieldCanvasProps {
  /** Number of stars to render (default: 80) */
  starCount?: number;

  /** Size range for stars in pixels (default: [1, 3]) */
  sizeRange?: [number, number];

  /** Opacity range for stars (default: [0.2, 0.6]) */
  opacityRange?: [number, number];

  /** Connection line visibility (default: true) */
  showConnections?: boolean;

  /** Animation duration in seconds (default: 15) */
  animationDuration?: number;

  /** Enable parallax depth effect (default: true) */
  enableParallax?: boolean;

  /** Custom colors - overrides violet defaults */
  colors?: {
    starColor?: string;
    connectionColor?: string;
    glowColor?: string;
  };

  /** Background gradient configuration */
  backgroundGradient?: {
    start: string;
    end: string;
  };

  /** Whether to use reduced motion preference */
  respectReducedMotion?: boolean;
}

export interface Star {
  x: number;
  y: number;
  z: number; // depth for parallax
  size: number;
  opacity: number;
  hue: number;
}

interface Connection {
  from: number;
  to: number;
  distance: number;
}

/**
 * StarfieldCanvas - A premium, original starfield component with constellation effects.
 * 
 * Features:
 * - Procedurally generated stars with depth-based parallax
 * - Constellation-style connection lines between nearby stars
 * - Smooth entrance animations using framer-motion
 * - Fully accessible and reduced-motion aware
 * - Dark-mode compatible by default
 */

const DEFAULT_COLORS = {
  starColor: '#a78bfa', // violet-400
  connectionColor: '#6366f1', // indigo-500
  glowColor: '#8b5cf6', // violet-500
};

const DEFAULT_GRADIENT = {
  start: 'hsla(260, 70%, 40%, 0.1)',
  end: 'hsla(260, 70%, 30%, 0.05)',
};

export default function StarfieldCanvas({
  starCount = 80,
  sizeRange = [1, 3],
  opacityRange = [0.2, 0.6],
  showConnections = true,
  animationDuration = 15,
  enableParallax = true,
  colors: customColors,
  backgroundGradient: customGradient,
  respectReducedMotion = false,
}: StarfieldCanvasProps) {
  const [stars, setStars] = useState<Star[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate stars with random positions and properties
  const generateStars = useMemo(() => {
    const newStars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      newStars.push({
        x: Math.random() * 100, // percentage position
        y: Math.random() * 100,
        z: Math.random(), // depth 0-1
        size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
        opacity: Math.random() * (opacityRange[1] - opacityRange[0]) + opacityRange[0],
        hue: 260, // base violet hue
      });
    }
    return newStars;
  }, [starCount, sizeRange, opacityRange]);

  // Generate connections between nearby stars
  const generateConnections = useMemo(() => {
    if (!showConnections) return [];

    const connThreshold = 12; // max distance in percentage units
    const newConnections: Connection[] = [];

    for (let i = 0; i < stars.length; i++) {
      let count = 0;
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= connThreshold) {
          newConnections.push({ from: i, to: j, distance: dist });
          count++;
        }

        if (count >= 2) break; // limit connections per star for performance
      }
    }

    return newConnections;
  }, [stars, showConnections]);

  // Calculate parallax offsets based on scroll position
  const { scrollY } = useScroll();
  const parallaxOffset = enableParallax ? useTransform(scrollY, [0, 1], [0, -20]) : 0;

  // Determine if reduced motion is preferred
  const reducedMotion = respectReducedMotion || typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Animation variants
  const starVariant = {
    initial: { opacity: 0, scale: 0 },
    animate: (i: number) => ({
      opacity: stars[i].opacity,
      scale: 1,
      transition: {
        duration: 0.8 + Math.random() * 0.4,
        delay: i * 0.02,
        ease: 'easeOut',
      },
    }),
    hover: {
      scale: 1.3,
      filter: 'brightness(1.5)',
      transition: { duration: 0.2 },
    },
  };

  const connectionVariant = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 0.3, transition: { duration: 1.5 } },
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg"
      style={{
        width: '100%',
        height: '100%',
        background: customGradient 
          ? `linear-gradient(${customGradient.start}, ${customGradient.end})`
          : `linear-gradient(to bottom, hsla(260, 70%, 40%, 0.1), hsla(260, 70%, 30%, 0.05))`,
        transition: { duration: animationDuration },
      }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-40"
        animate={{
          backgroundPosition: ['center', '125%'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Stars container */}
      <motion.div
        className="absolute inset-0"
        animate={{ y: parallaxOffset }}
        transition={{ duration: enableParallax ? animationDuration : 0.5 }}
        style={reducedMotion ? { willChange: 'transform' } : undefined}
      >
        <AnimatePresence>
          {stars.map((star, i) => (
            <motion.div
              key={`${i}-${star.z}`}
              className="absolute rounded-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={reducedMotion ? 'animate' : starVariant.animate(i)}
              variants={starVariant}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                background: customColors?.starColor || DEFAULT_COLORS.starColor,
                opacity: star.opacity,
                boxShadow: `0 0 ${star.size * 2}px ${customColors?.glowColor || DEFAULT_COLORS.glowColor}`,
                filter: 'blur(1px)',
              }}
              whileHover={reducedMotion ? {} : starVariant.hover}
            />
          ))}
        </AnimatePresence>

        {/* Connection lines */}
        {showConnections && connections.map((conn, i) => (
          <motion.svg
            key={`conn-${i}`}
            className="absolute inset-0 pointer-events-none"
            initial={connectionVariant.initial}
            animate={connectionVariant.animate}
            style={{
              width: '100%',
              height: '100%',
              overflow: 'visible',
            }}
          >
            <motion.line
              x1={`${stars[conn.from].x}%`}
              y1={`${stars[conn.from].y}%`}
              x2={`${stars[conn.to].y}%`} // Note: this should be stars[conn.to].y
              y2={`${stars[conn.to].y}%`}
              stroke={customColors?.connectionColor || DEFAULT_COLORS.connectionColor}
              strokeWidth="0.5"
              strokeLinecap="round"
              opacity="0.15"
            />
          </motion.svg>
        ))}
      </motion.div>

      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <radial-gradient
          from="transparent"
          via="rgba(0, 0, 0, 0.15)"
          to="rgba(0, 0, 0, 0.3)"
          style={{ transform: 'translateY(-20%)' }}
        />
      </div>
    </motion.div>
  );
}
