'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface WaveDividerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'violet' | 'primary' | 'muted';
  orientation?: 'horizontal' | 'vertical';
  animateOnScroll?: boolean;
  children?: React.ReactNode;
}

export interface WaveDividerSize {
  sm: { height: 80; gap: 12; amplitude: 30 };
  md: { height: 160; gap: 24; amplitude: 50 };
  lg: { height: 240; gap: 36; amplitude: 70 };
  xl: { height: 320; gap: 48; amplitude: 90 };
}

const SIZE_CONFIGS: Record<string, WaveDividerSize> = {
  sm: { height: 80, gap: 12, amplitude: 30 },
  md: { height: 160, gap: 24, amplitude: 50 },
  lg: { height: 240, gap: 36, amplitude: 70 },
  xl: { height: 320, gap: 48, amplitude: 90 },
};

const getThemeClasses = (color: WaveDividerProps['color']) => {
  const map: Record<string, string> = {
    violet: 'bg-violet-500/10 border-violet-500/20',
    primary: 'bg-primary border-primary/30',
    muted: 'bg-muted border-border/40',
  };
  return map[color] || map.violet;
};

const getGradient = (color: WaveDividerProps['color']) => {
  const gradients: Record<string, string> = {
    violet: 'from-violet-500 via-purple-600 to-indigo-700',
    primary: 'from-primary via-secondary/80 to-accent',
    muted: 'from-slate-400 via-slate-500 to-slate-600',
  };
  return gradients[color] || gradients.violet;
};

const getStrokeColor = (color: WaveDividerProps['color']) => {
  const map: Record<string, string> = {
    violet: 'stroke-violet-400/80',
    primary: 'stroke-primary-foreground/60',
    muted: 'stroke-slate-400/50',
  };
  return map[color] || map.violet;
};

const getFill = (color: WaveDividerProps['color']) => {
  const map: Record<string, string> = {
    violet: 'fill-violet-500/10',
    primary: 'fill-primary/20',
    muted: 'fill-muted/30',
  };
  return map[color] || map.violet;
};

const getShadow = (color: WaveDividerProps['color']) => {
  const shadows: Record<string, string> = {
    violet: 'drop-shadow-[0_8px_24px_rgba(139,92,246,0.25)]',
    primary: 'drop-shadow-[0_8px_24px_rgba(var(--primary),0.25)]',
    muted: 'drop-shadow-[0_8px_24px_rgba(0,0,0,0.15)]',
  };
  return shadows[color] || shadows.violet;
};

const getBorder = (color: WaveDividerProps['color']) => {
  const map: Record<string, string> = {
    violet: 'border-violet-400/30',
    primary: 'border-primary/40',
    muted: 'border-slate-500/25',
  };
  return map[color] || map.violet;
};

const getPathData = (sizeConfig: WaveDividerSize, offset: number) => {
  const { height, amplitude } = sizeConfig;
  const width = 1400;
  const centerY = height / 2;
  
  // Create a more organic, multi-layered wave path
  const points: [number, number][] = [];
  for (let x = 0; x <= width; x += 2) {
    const t = x / width;
    // Combine multiple sine waves for richer texture
    const y = centerY + 
      Math.sin(t * Math.PI * 4) * amplitude * 0.8 +
      Math.sin(t * Math.PI * 3.5) * amplitude * 0.4 +
      Math.sin(t * Math.PI * 2.7) * amplitude * 0.2;
    points.push([x, y]);
  }

  // Add offset for layering effect
  const offsetPoints: [number, number][] = [];
  for (let x = 0; x <= width; x += 2) {
    const t = x / width;
    const y = centerY + 
      Math.sin(t * Math.PI * 4.3) * amplitude * 0.7 +
      Math.sin(t * Math.PI * 3.8) * amplitude * 0.35 +
      Math.sin(t * Math.PI * 2.9) * amplitude * 0.15;
    offsetPoints.push([x, y]);
  }

  return { points, offsetPoints };
};

const getLayerOffset = (layerIndex: number, totalLayers: number): number => {
  // Stagger layers for depth effect
  const stagger = 30 * layerIndex;
  return stagger;
};

export function WaveDivider({
  className,
  size = 'md',
  color = 'violet',
  orientation = 'horizontal',
  animateOnScroll = true,
  children,
}: WaveDividerProps) {
  const config = SIZE_CONFIGS[size];
  const themeClasses = getThemeClasses(color);
  const gradient = getGradient(color);
  const strokeColor = getStrokeColor(color);
  const fill = getFill(color);
  const shadow = getShadow(color);
  const border = getBorder(color);

  const { scrollYProgress } = useScroll();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: '0px 0px 150px 0px' });

  // Calculate staggered animation delays for layers
  const totalLayers = 3;
  const layerOffsets: number[] = [];
  
  React.useEffect(() => {
    layerOffsets.fill(0);
    if (animateOnScroll && isInView) {
      const duration = 1.2;
      const delayPerLayer = 0.15;
      
      for (let i = 0; i < totalLayers; i++) {
        layerOffsets[i] = i * delayPerLayer;
      }
    }
  }, [animateOnScroll, isInView]);

  // Generate paths with offsets for layering
  const { points: mainPoints, offsetPoints: layer1Points } = getPathData(config, 0);
  const { points: layer2Points, offsetPoints: layer3Points } = getPathData(
    config, 
    getLayerOffset(1, totalLayers)
  );

  // Create SVG paths from points
  const createPath = (points: [number, number][]) => {
    if (!points.length) return '';
    return `M ${points.map(p => `${p[0]},${p[1]}`).join(' L ')}`;
  };

  const mainPath = createPath(mainPoints);
  const layer1Path = createPath(layer1Points);
  const layer2Path = createPath(layer2Points);
  const layer3Path = createPath(layer3Points);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden',
        orientation === 'horizontal' ? '' : 'flex flex-col',
        themeClasses,
        shadow,
        border,
        className
      )}
      style={{
        width: orientation === 'vertical' ? 80 : undefined,
        height: orientation === 'vertical' ? 1400 : config.height,
      }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r"
        style={{
          backgroundSize: '200% 200%',
          backgroundImage: `linear-gradient(to right, 
            var(--tw-gradient-from),
            var(--tw-gradient-through),
            var(--tw-gradient-to)
          )`,
          '--tw-gradient-from': '#8b5cf6',
          '--tw-gradient-through': '#a78bfa',
          '--tw-gradient-to': '#7c3aed',
        }}
        animate={{
          backgroundPosition: [
            '0% 50%',
            orientation === 'horizontal' ? '100% 50%' : '50% 100%',
            '0% 50%',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Main wave layer */}
      <motion.div
        className="absolute inset-0"
        initial={{ y: -50 }}
        animate={animateOnScroll && isInView ? { y: 0 } : {}}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          transformOrigin: 'top center',
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${config.height} ${orientation === 'horizontal' ? config.height : 1400}`}
          preserveAspectRatio={orientation === 'horizontal' ? 'meet' : 'slice'}
        >
          <defs>
            {/* Gradient fill for depth */}
            <linearGradient id={`wave-gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.3" />
            </linearGradient>
            
            {/* Glow effect */}
            <filter id={`glow-${color}`}>
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Layer 1 - Back */}
          <motion.path
            d={mainPath}
            fill={`url(#wave-gradient-${color})`}
            stroke="none"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 0.4, y: 0 }}
            transition={{ delay: layerOffsets[0], duration: 1, ease: 'easeOut' }}
          />

          {/* Layer 2 - Middle */}
          <motion.path
            d={layer1Path}
            fill={`url(#wave-gradient-${color})`}
            stroke="none"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 0.5, y: 0 }}
            transition={{ delay: layerOffsets[1], duration: 1, ease: 'easeOut' }}
          />

          {/* Layer 3 - Front */}
          <motion.path
            d={layer2Path}
            fill={`url(#wave-gradient-${color})`}
            stroke="none"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ delay: layerOffsets[2], duration: 1, ease: 'easeOut' }}
          />

          {/* Highlight edge */}
          <motion.path
            d={layer3Path}
            fill="none"
            stroke={`url(#wave-gradient-${color})`}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ delay: layerOffsets[3] || 0.4, duration: 1, ease: 'easeOut' }}
          />

          {/* Subtle inner glow */}
          <motion.path
            d={mainPath}
            fill="none"
            stroke={`url(#wave-gradient-${color})`}
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(`#glow-${color}`)"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 0.25, y: 0 }}
            transition={{ delay: layerOffsets[4] || 0.6, duration: 1, ease: 'easeOut' }}
          />
        </svg>
      </motion.div>

      {/* Floating particles/accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 4,
              height: 4,
              backgroundColor: `rgba(139, 92, 246, ${0.15 + i * 0.05})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + i * 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Content container */}
      <div className="relative z-10 flex items-center justify-center h-full">
        {children ? (
          children
        ) : (
          <span className={cn(
            'text-sm font-medium tracking-wide',
            orientation === 'horizontal' 
              ? 'px-8 py-3 bg-background/95 backdrop-blur-sm rounded-full border border-border/50' 
              : 'py-4 px-6 bg-background/95 backdrop-blur-sm rounded-lg border border-border/50',
          )}>
            <span className={cn(
              'inline-block transition-colors duration-300',
              orientation === 'horizontal' ? '' : 'text-center',
            )}>
              {orientation === 'horizontal' 
                ? `Wave Divider — ${size.toUpperCase()}` 
                : 'Scroll'}
            </span>
          </span>
        )}
      </div>

      {/* Scroll indicator for vertical orientation */}
      {orientation === 'vertical' && (
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center gap-2">
            <motion.div
              className="w-6 h-6 border-2 border-violet-400/50 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}

      {/* Accessibility info */}
      <svg role="img" aria-label="Wave divider decorative element" className="sr-only">
        <rect width={config.height} height={config.height} fill="none" />
      </svg>
    </motion.div>
  );
}
