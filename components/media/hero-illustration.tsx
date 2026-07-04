'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HeroIllustrationProps {
  className?: string;
  accentColor?: 'violet' | 'purple' | 'indigo';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showControls?: boolean;
}

const SIZE_MAP: Record<string, number> = {
  sm: 320,
  md: 480,
  lg: 640,
  xl: 800,
};

export interface HeroIllustrationPropsInterface extends HeroIllustrationProps {}

export default function HeroIllustration({
  className,
  accentColor = 'violet',
  size = 'md',
  showControls = false,
}: HeroIllustrationProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const baseSize = SIZE_MAP[size];
  const scale = useTransform(
    scrollY,
    [0, 500],
    [1, 0.95]
  );

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-2xl bg-background',
        size === 'sm' ? 'h-[320px]' :
          size === 'md' ? 'h-[480px]' :
            size === 'lg' ? 'h-[640px]' : 'h-[800px]',
        className
      )}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-background via-muted/50 to-background"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Layer 1 - Floating orbs */}
      <LayerOrbs color={accentColor} size={baseSize * 0.4} />

      {/* Layer 2 - Abstract shapes */}
      <LayerShapes accentColor={accentColor} scale={scale} />

      {/* Layer 3 - Technical grid overlay */}
      <LayerGrid opacity={0.15} />

      {/* Layer 4 - Interactive elements */}
      {showControls && (
        <LayerControls accentColor={accentColor} size={baseSize} />
      )}

      {/* Content placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative z-10 text-center px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Hero Illustration
          </h2>
          <p className="text-sm text-muted-foreground">
            Scroll to see parallax effects
          </p>
        </motion.div>
      </div>

      {/* Reduced motion indicator */}
      <AnimatePresence>
        {!useReducedMotion.current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-2 right-2 z-50"
          >
            <Badge variant="outline" size="sm">
              Motion Active
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Layer 1: Floating orbs with smooth hover effects
function LayerOrbs({ color, size }: { color: string; size: number }) {
  const colors = {
    violet: ['#8b5cf6', '#7c3aed'],
    purple: ['#a855f7', '#9333ea'],
    indigo: ['#6366f1', '#4f46e5'],
  };

  const gradient = colors[color as keyof typeof colors] || colors.violet;

  return (
    <>
      <motion.div
        className="absolute top-8 left-8 w-20 h-20 rounded-full"
        style={{ background: `radial-gradient(circle at 30% 30%, ${gradient[0]}, transparent)` }}
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute bottom-8 right-8 w-24 h-24 rounded-full"
        style={{ background: `radial-gradient(circle at 30% 30%, ${gradient[1]}, transparent)` }}
        animate={{ y: [5, -5, 5] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full"
        style={{ background: `radial-gradient(circle at 30% 30%, ${gradient[0]}, transparent)` }}
        animate={{ y: [-5, 5, -5], x: [3, -3, 3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute top-1/4 right-1/3 w-28 h-28 rounded-full"
        style={{ background: `radial-gradient(circle at 30% 30%, ${gradient[1]}, transparent)` }}
        animate={{ y: [-15, 15, -15] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}

// Layer 2: Abstract geometric shapes
function LayerShapes({ accentColor, scale }: { accentColor: string; scale: number }) {
  const colors = {
    violet: '#8b5cf6',
    purple: '#a855f7',
    indigo: '#6366f1',
  };

  const baseColor = colors[accentColor as keyof typeof colors] || colors.violet;

  return (
    <>
      <motion.div
        className="absolute top-20 right-8 w-12 h-12"
        style={{
          background: `conic-gradient(from -45deg, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="absolute bottom-24 left-8 w-16 h-16"
        style={{
          background: `conic-gradient(from -90deg, ${baseColor}, transparent)`,
          borderRadius: '50%',
        }}
        animate={{ scale: [1, 1.05, 1], rotate: [0, 180] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="absolute top-36 left-20 w-8 h-8"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute bottom-16 right-24 w-10 h-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute top-28 right-16 w-6 h-6"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute bottom-32 left-28 w-14 h-14"
        style={{
          background: `conic-gradient(from -135deg, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
        animate={{ scale: [1, 1.08, 1], rotate: [0, 270] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="absolute top-44 left-36 w-10 h-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
        animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute bottom-20 right-36 w-12 h-12"
        style={{
          background: `conic-gradient(from -45deg, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute top-56 right-8 w-8 h-8"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
        animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute bottom-44 left-12 w-16 h-16"
        style={{
          background: `conic-gradient(from -90deg, ${baseColor}, transparent)`,
          borderRadius: '50%',
        }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 200] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="absolute top-68 left-48 w-12 h-12"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.45, 0.75, 0.45] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute bottom-60 right-12 w-10 h-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.38, 0.68, 0.38] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute top-84 right-28 w-14 h-14"
        style={{
          background: `conic-gradient(from -135deg, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
        animate={{ scale: [1, 1.06, 1], rotate: [0, 240] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="absolute bottom-72 left-32 w-10 h-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
        animate={{ scale: [1, 1.28, 1], opacity: [0.42, 0.72, 0.42] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute top-96 left-16 w-8 h-8"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
        animate={{ scale: [1, 1.32, 1], opacity: [0.36, 0.66, 0.36] }}
        transition={{ duration: 2.9, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute bottom-84 right-48 w-12 h-12"
        style={{
          background: `conic-gradient(from -45deg, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
        animate={{ scale: [1, 1.12, 1], rotate: [0, 260] }}
        transition={{ duration: 27, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="absolute top-108 right-4 w-16 h-16"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
        animate={{ scale: [1, 1.38, 1], opacity: [0.48, 0.78, 0.48] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute bottom-96 left-8 w-10 h-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
        animate={{ scale: [1, 1.42, 1], opacity: [0.39, 0.69, 0.39] }}
        transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute top-124 left-36 w-14 h-14"
        style={{
          background: `conic-gradient(from -90deg, ${baseColor}, transparent)`,
          borderRadius: '50%',
        }}
        animate={{ scale: [1, 1.08, 1], rotate: [0, 230] }}
        transition={{ duration: 29, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="absolute bottom-108 right-24 w-12 h-12"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
        animate={{ scale: [1, 1.34, 1], opacity: [0.44, 0.74, 0.44] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute top-140 right-20 w-8 h-8"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
        animate={{ scale: [1, 1.36, 1], opacity: [0.37, 0.67, 0.37] }}
        transition={{ duration: 2.85, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute bottom-124 left-44 w-16 h-16"
        style={{
          background: `conic-gradient(from -135deg, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
        animate={{ scale: [1, 1.07, 1], rotate: [0, 245] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="absolute top-160 left-28 w-10 h-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
        animate={{ scale: [1, 1.26, 1], opacity: [0.43, 0.73, 0.43] }}
        transition={{ duration: 3.55, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute bottom-140 right-8 w-12 h-12"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
        animate={{ scale: [1, 1.44, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3.25, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute top-180 right-36 w-14 h-14"
        style={{
          background: `conic-gradient(from -45deg, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
        animate={{ scale: [1, 1.09, 1], rotate: [0, 235] }}
        transition={{ duration: 31, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="absolute bottom-160 left-20 w-10 h-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${baseColor}, transparent)`,
          borderRadius: '9999px',
        }}
