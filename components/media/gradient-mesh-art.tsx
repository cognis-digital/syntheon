'use client';

import { motion, useScroll, useTransform, LayoutGroup } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

export interface GradientMeshArtProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  intensity?: number; // 0-1, controls animation speed and depth
  colors?: [string, string]; // default to violet palette
  interactive?: boolean; // enable hover effects
  blur?: number; // SVG filter blur amount (default: 24)
}

const DEFAULT_COLORS = ['#8b5cf6', '#a78bfa']; // violet-500 to violet-400
const DEFAULT_INTENSITY = 1.0;

function createMeshSVG(blur: number, intensity: number): string {
  const scale = 2 + (intensity - 1) * 3;
  return `
    <defs>
      <filter id="mesh-filter-${blur}">
        <feTurbulence 
          type="fractalNoise" 
          baseFrequency="${0.02 / intensity}" 
          numOctaves="4" 
          result="noise"
          seed="${intensity * 1000}"
        />
        <feDisplacementMap 
          in="SourceGraphic" 
          in2="noise" 
          scale="${scale}" 
          xChannelSelector="R" 
          yChannelSelector="G" 
          result="displaced"
        />
        <feColorMatrix type="matrix" order="4" result="colormatrix">
          <seMatrix values="0.2 0 0 0 0 0 0.3 0 0 0 0 0.5 0 0 0 1 0"/>
        </feColorMatrix>
      </filter>
    </defs>
  `;
}

export function GradientMeshArt({
  className,
  size = 'md',
  intensity = DEFAULT_INTENSITY,
  colors = DEFAULT_COLORS,
  interactive = true,
  blur = 24,
}: GradientMeshArtProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const sizeClasses: Record<string, string> = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
    xl: 'h-48 w-48',
    full: 'h-full w-full min-h-[200px] min-w-[200px]',
  };

  const baseSize = sizeClasses[size];

  return (
    <LayoutGroup>
      <motion.div
        ref={containerRef}
        className={cn(
          'relative overflow-hidden rounded-xl bg-background',
          baseSize,
          interactive && 'cursor-pointer transition-colors duration-300 hover:scale-[1.02]',
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* SVG Filter Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {createMeshSVG(blur, intensity)}
          
          <motion.g
            filter={`url(#mesh-filter-${blur})`}
            initial={{ opacity: 0.4 }}
            animate={{ 
              opacity: isHovered ? 0.7 : 0.4,
              scale: [1, 1 + (intensity - 1) * 0.2]
            }}
            transition={{
              duration: 3 / intensity,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <rect width="100%" height="100%" fill={colors[0]} />
          </motion.g>

          {/* Secondary Layer with Offset */}
          <motion.g
            filter={`url(#mesh-filter-${blur})`}
            initial={{ opacity: 0.2, x: -50, y: -50 }}
            animate={{ 
              opacity: isHovered ? 0.4 : 0.2,
              x: [0, 30],
              y: [0, 30]
            }}
            transition={{
              duration: 6 / intensity,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <rect width="100%" height="100%" fill={colors[1]} opacity={0.3} />
          </motion.g>

          {/* Tertiary Layer - Subtle Texture */}
          <motion.g
            filter={`url(#mesh-filter-${blur})`}
            initial={{ opacity: 0.1 }}
            animate={{ 
              opacity: isHovered ? 0.2 : 0.1,
              scale: [1, 1 + (intensity - 1) * 0.3]
            }}
            transition={{
              duration: 4 / intensity,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <rect width="100%" height="100%" fill={colors[0]} opacity={0.2} />
          </motion.g>
        </svg>

        {/* Content Layer - Optional Text/Icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {interactive && (
            <span className="text-xs text-primary/50 font-medium tracking-wider uppercase">
              Interactive Mesh
            </span>
          )}
        </div>

        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-transparent via-background to-transparent"
          style={{
            background: `radial-gradient(60% 60% at 50% 50%, rgba(${colors[0].replace('#', '255,').split(',').map(n => n * 1).join(',')}, ${intensity}) 0%, transparent 70%)`,
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4 / intensity, repeat: Infinity }}
        />
      </motion.div>

      {/* Decorative Border Glow */}
      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0"
        style={{
          background: `linear-gradient(45deg, ${colors[0]}, ${colors[1]})`,
          filter: 'blur(8px)',
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4 / intensity, repeat: Infinity }}
      />
    </LayoutGroup>
  );
}

export default GradientMeshArt;
