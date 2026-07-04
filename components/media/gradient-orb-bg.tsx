'use client';

import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import { type ReactNode } from 'react';

export interface GradientOrbBgProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  intensity?: number; // 0-1, controls opacity/blur
  hueShift?: number; // -180 to 180 for color variation
  rotationSpeed?: number; // 0-10 for spin rate
  parallax?: boolean;
  children?: ReactNode;
}

const SIZE_MAP: Record<string, { w: string; h: string }> = {
  sm: { w: '48', h: '48' },
  md: { w: '64', h: '64' },
  lg: { w: '96', h: '96' },
  xl: { w: '128', h: '128' },
  full: { w: 'full', h: 'full' },
};

const DEFAULTS = {
  size: 'md',
  intensity: 0.7,
  hueShift: 45,
  rotationSpeed: 3,
  parallax: true,
};

export function GradientOrbBg({
  className,
  size = DEFAULTS.size,
  intensity = DEFAULTS.intensity,
  hueShift = DEFAULTS.hueShift,
  rotationSpeed = DEFAULTS.rotationSpeed,
  parallax = DEFAULTS.parallax,
  children,
}: GradientOrbBgProps) {
  const reducedMotion = useReducedMotion();

  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;
  const w = sizeConfig.w === 'full' ? '100%' : `${sizeConfig.w}rem`;
  const h = sizeConfig.h === 'full' ? '100%' : `${sizeConfig.h}rem`;

  // Violet palette - HSL to RGB approximations for inline SVG
  const violetBase = { r: 139, g: 92, b: 246 };
  const violetDark = { r: 117, g: 80, b: 225 };
  const violetLight = { r: 175, g: 130, b: 255 };

  // Create gradient stops with hue shift applied
  const hslBase = `hsla(${260 + hueShift}, 80%, 60%, ${intensity})`;
  const hslDark = `hsla(${275 + hueShift}, 90%, 40%, ${intensity * 0.6})`;
  const hslLight = `hsla(${245 + hueShift}, 70%, 70%, ${intensity * 0.3})`;

  // Animation variants - tasteful, not overwhelming
  const baseMotion: { [key: string]: any } = reducedMotion
    ? {}
    : {
        rotate: {
          duration: 20 + rotationSpeed * 15,
          repeat: Infinity,
          ease: 'linear',
        },
      };

  const staggerDelay = (i: number) => `${i * 0.1}s`;

  return (
    <motion.div
      className={cn(
        'fixed inset-0 overflow-hidden pointer-events-none z-[-1]',
        className,
      )}
      style={{
        '--orb-size': w,
        '--orb-height': h,
        '--hue-shift': hueShift,
        '--intensity': intensity,
      } as React.CSSProperties}
    >
      {/* Base gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            circle at 50% -20%,
            ${hslBase},
            transparent 40%
          ), radial-gradient(
            circle at 100% 80%,
            ${hslDark},
            transparent 30%
          )`,
        }}
      />

      {/* Animated orbs - layered for depth */}
      {[2, 3, 4].map((layer) => (
        <motion.div
          key={layer}
          className="absolute"
          style={{
            left: `${(layer * 17) % 100}%`,
            top: `${(layer * 13) % 100}%`,
            width: w,
            height: h,
            opacity: intensity * (1 - layer * 0.2),
          }}
          animate={{
            rotate: {
              duration: 30 + layer * 25,
              repeat: Infinity,
              ease: 'linear',
            },
            x: [0, 2, -2, 0],
            y: [0, -1.5, 1.5, 0],
          }}
          transition={{
            duration: 8 + layer * 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Inner glow orb */}
          <motion.div
            className="absolute inset-4"
            style={{
              background: `radial-gradient(
                circle at center,
                ${hslLight},
                transparent 60%
              )`,
              filter: 'blur(2rem)',
            }}
            animate={baseMotion.rotate}
          />

          {/* Secondary orb with offset */}
          <motion.div
            className="absolute inset-8"
            style={{
              background: `radial-gradient(
                circle at 30% 70%,
                ${hslDark},
                transparent 50%
              )`,
              filter: 'blur(1.5rem)',
            }}
            animate={baseMotion.rotate}
          />

          {/* Tertiary subtle orb */}
          <motion.div
            className="absolute inset-12"
            style={{
              background: `radial-gradient(
                circle at 70% 30%,
                ${hslBase},
                transparent 45%
              )`,
              filter: 'blur(1rem)',
            }}
            animate={baseMotion.rotate}
          />
        </motion.div>
      ))}

      {/* Static decorative gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            135deg,
            transparent 25%,
            ${hslLight} 50%,
            transparent 75%
          )`,
          opacity: intensity * 0.4,
        }}
      />

      {/* Content children */}
      {children && (
        <div className="relative z-10 h-full w-full">
          {children}
        </div>
      )}
    </motion.div>
  );
}
