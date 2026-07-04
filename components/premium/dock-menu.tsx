'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface DockMenuItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  tooltip?: string;
  badge?: React.ReactNode;
}

interface DockMenuProps {
  items: DockMenuItemProps[];
  activeItemIndex?: number;
  onActiveChange?: (index: number | null) => void;
  className?: string;
}

export function DockMenu({
  items,
  activeItemIndex = -1,
  onActiveChange,
  className,
}: DockMenuProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  // Gate motion for accessibility
  const isReducedMotion = useReducedMotion();

  // Spring physics tuned for premium feel - snappy but smooth
  const springConfig = { damping: 18, stiffness: 300 };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.div
        ref={containerRef}
        className={cn(
          'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
          'flex items-center gap-3 px-4 py-3 rounded-full',
          'bg-background/80 backdrop-blur-xl border border-border/50',
          'shadow-2xl shadow-violet-900/20',
          className,
        )}
        style={{
          boxShadow: isReducedMotion ? undefined : '0 20px 60px -10px rgba(139, 92, 246, 0.25), 0 0 80px -20px rgba(139, 92, 246, 0.1)',
        }}
      >
        {/* Animated gradient border glow */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{
            background: isReducedMotion ? undefined : ['rgba(139, 92, 246, 0.3)', 'rgba(139, 92, 246, 0.15)', 'rgba(139, 92, 246, 0.3)'],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Items container with staggered entrance */}
        <motion.div
          className="relative flex items-center gap-2"
          initial={isReducedMotion ? false : { opacity: 0, y: 40 }}
          animate={isReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Background blur orb - decorative */}
          <motion.div
            className="absolute -inset-4 rounded-full bg-violet-500/20 blur-3xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {items.map((item, index) => (
            <DockItem
              key={index}
              item={item}
              isActive={activeItemIndex === index || hoveredIndex === index}
              isHovered={hoveredIndex === index}
              onActiveChange={onActiveChange}
              springConfig={springConfig}
              isReducedMotion={isReducedMotion}
            />
          ))}

          {/* Active indicator glow */}
          <AnimatePresence>
            {activeItemIndex >= 0 && (
              <motion.div
                className="absolute -inset-1 rounded-full bg-violet-500/20 blur-xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tooltip overlay */}
        <Tooltip>
          <TooltipTrigger asChild />
          {hoveredIndex !== null && items[hoveredIndex]?.tooltip && (
            <TooltipContent className="bg-background/95 backdrop-blur text-foreground border-border">
              <p>{items[hoveredIndex].tooltip}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </motion.div>
    </TooltipProvider>
  );
}

function DockItem({
  item,
  isActive,
  isHovered,
  onActiveChange,
  springConfig,
  isReducedMotion,
}: {
  item: DockMenuItemProps;
  isActive: boolean;
  isHovered: boolean;
  onActiveChange?: (index: number | null) => void;
  springConfig: Parameters<typeof motion.div>[1]['spring'];
  isReducedMotion: boolean;
}) {
  const [isPressed, setIsPressed] = React.useState(false);

  return (
    <motion.div
      className="relative group"
      onMouseEnter={() => setHoveredIndex(item.index)}
      onMouseLeave={() => setHoveredIndex(null)}
      onClick={(e) => {
        e.preventDefault();
        onActiveChange?.(item.index);
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 150);
      }}
    >
      <motion.div
        className={cn(
          'relative flex items-center justify-center',
          'w-12 h-12 rounded-xl cursor-pointer transition-colors',
          isActive || isHovered ? 'bg-violet-600' : 'hover:bg-violet-500/40',
          'text-background shadow-lg hover:shadow-xl',
        )}
        style={{
          boxShadow: isReducedMotion
            ? undefined
            : isActive
              ? '0 8px 24px -6px rgba(139, 92, 246, 0.5), 0 0 30px -10px rgba(139, 92, 246, 0.3)'
              : '0 4px 12px -4px rgba(0, 0, 0, 0.2)',
        }}
        whileHover={isReducedMotion ? {} : { scale: 1.15, rotateY: isPressed ? -10 : 0 }}
        whileTap={isReducedMotion ? {} : { scale: 0.95 }}
        initial={isReducedMotion ? false : { opacity: 0, y: 24 }}
        animate={isReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Icon */}
        <motion.div
          className="flex items-center justify-center w-full h-full"
          initial={isReducedMotion ? false : { scale: 0 }}
          animate={isReducedMotion ? { scale: 1 } : { scale: 1 }}
          transition={{ type: 'spring', ...springConfig, duration: 0.4 }}
        >
          <span className="text-lg">{item.icon}</span>
        </motion.div>

        {/* Active glow ring */}
        <AnimatePresence>
          {(isActive || isHovered) && (
            <motion.div
              className="absolute -inset-1 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: isActive ? 1.2 : 1, opacity: 0.6 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="absolute inset-0 rounded-full bg-violet-500/40 blur-md" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip trigger */}
        <Tooltip>
          <TooltipTrigger asChild />
          <TooltipContent className="bg-background/95 backdrop-blur text-foreground border-border">
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>

        {/* Badge - positioned absolutely */}
        {item.badge && (
          <motion.div
            className={cn(
              'absolute -top-1 -right-1 z-10',
              isActive || isHovered ? 'translate-x-0 translate-y-0' : '-translate-x-2 -translate-y-2',
            )}
            initial={{ scale: 0, rotate: -45 }}
            animate={isReducedMotion ? { scale: 1, rotate: 0 } : { scale: 1, rotate: 0 }}
            transition={{ type: 'spring', ...springConfig, duration: 0.3 }}
          >
            <Badge variant="destructive" className="h-4 w-4 rounded-full p-0 text-xs">
              {item.badge}
            </Badge>
          </motion.div>
        )}

        {/* Subtle shine effect on hover */}
        {(isActive || isHovered) && (
          <motion.div
            className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// Custom hook for reduced motion preference
function useReducedMotion() {
  const [isReduced, setIsReduced] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReduced(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsReduced(e.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      // Fallback for older browsers
      window.addEventListener('message', (e: MessageEvent) => {
        if (e.data === 'reduced-motion' && e.origin === window.location.origin) {
          setIsReduced(true);
        }
      });
    }

    return () => mediaQuery.removeEventListener?.('change', handler);
  }, []);

  return isReduced;
}
