'use client';

import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface StatsInlineProps {
  stats: Array<{
    label: string;
    value: string | number;
    description?: string;
    icon?: React.ReactNode;
    href?: string;
    target?: '_self' | '_blank';
    variant?: 'default' | 'primary' | 'outline';
  }>;
  title?: string;
  subtitle?: string;
  className?: string;
}

export interface StatsInlineVariants {
  container: {
    hidden: { opacity: number };
    visible: { opacity: number; transition: { duration: number, ease: string, delayChildren: number, staggerChildren: number } };
  };
  item: {
    hidden: { opacity: number; y: number; scale: number };
    visible: { opacity: number; y: number; scale: number; transition: { type: string, duration: number, ease: string } };
  };
};

const variants = {
  container: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.8, 
        ease: 'easeOut', 
        delayChildren: 0.2, 
        staggerChildren: 0.15 
      } 
    },
  },
  item: {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { type: 'spring', duration: 0.6, stiffness: 200, damping: 20 } 
    },
  },
};

export default function StatsInline({ 
  stats = [], 
  title, 
  subtitle, 
  className 
}: StatsInlineProps) {
  const ref = useInView<HTMLDivElement>({ once: true, margin: '-100px' });
  
  return (
    <motion.section
      ref={ref}
      variants={variants.container}
      initial="hidden"
      animate="visible"
      className={cn(
        'relative py-24 px-6 md:px-12 lg:px-20 overflow-hidden',
        'bg-gradient-to-b from-background via-muted/50 to-background',
        className
      )}
    >
      {/* Animated background elements */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      >
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
        <div className="absolute top-32 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px]" />
      </motion.div>

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {title && (
          <motion.h2 
            variants={variants.item}
            className="text-center text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
          >
            {title}
          </motion.h2>
        )}

        {subtitle && (
          <motion.p 
            variants={variants.item}
            className="text-center text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto mb-16 leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Stats grid */}
        <div 
          className={cn(
            'grid gap-8 md:gap-12',
            stats.length === 1 ? 'grid-cols-1' : 
            stats.length <= 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'
          )}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={variants.item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group"
            >
              <Card 
                className={cn(
                  'h-full p-6 md:p-8 transition-all duration-300',
                  'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10',
                  'border-border bg-card/50 backdrop-blur-sm'
                )}
              >
                <CardContent className="pt-0">
                  {/* Icon wrapper */}
                  {stat.icon && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.15, type: 'spring', stiffness: 300 }}
                      className={cn(
                        'mb-4 w-12 h-12 rounded-xl flex items-center justify-center',
                        stat.variant === 'primary' ? 'bg-primary text-primary-foreground' : 
                        stat.variant === 'outline' ? 'border border-border bg-background/50' : 
                        'bg-muted text-foreground'
                      )}
                    >
                      {stat.icon}
                    </motion.div>
                  )}

                  {/* Value */}
                  <div className="mb-3">
                    <AnimatePresence mode='wait'>
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.15 + 0.2 }}
                        className={cn(
                          'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
                          stat.variant === 'primary' ? 'text-primary' : 
                          stat.variant === 'outline' ? 'text-foreground' : 
                          'text-foreground'
                        )}
                      >
                        {stat.value}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  {/* Label */}
                  <h3 className="text-lg font-semibold mb-1">
                    {stat.label}
                  </h3>

                  {/* Description */}
                  {stat.description && (
                    <p 
                      className={cn(
                        'text-sm text-muted-foreground',
                        stat.variant === 'primary' ? 'text-primary/70' : ''
                      )}
                    >
                      {stat.description}
                    </p>
                  )}

                  {/* Action */}
                  {stat.href && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15 + 0.35 }}
                    >
                      <Button 
                        variant={stat.variant} 
                        size="sm" 
                        className={cn(
                          'mt-4 w-full group-hover:bg-primary/90',
                          stat.variant === 'primary' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 
                          stat.variant === 'outline' ? 'border border-border bg-background/50 hover:border-primary/50' : 
                          ''
                        )}
                        asChild
                      >
                        <a href={stat.href} target={stat.target}>
                          {stat.label.includes('→') || stat.label.includes('Learn more') ? (
                            <>View Details</>
                          ) : (
                            <>Learn More →</>
                          )}
                        </a>
                      </Button>
                    </motion.div>
                  )}

                  {/* Progress bar for growth stats */}
                  {typeof stat.value === 'number' && !isNaN(stat.value) && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: '4px' }}
                      transition={{ delay: index * 0.15 + 0.4, duration: 0.8 }}
                      className={cn(
                        'mt-6 w-full h-1 rounded-full overflow-hidden',
                        stat.variant === 'primary' ? 'bg-primary/20' : ''
                      )}
                    >
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, Math.max(5, (stat.value / 100) * 100))}%` }}
                        transition={{ delay: index * 0.15 + 0.45, duration: 1.2 }}
                        className={cn(
                          'h-full rounded-full',
                          stat.variant === 'primary' ? 'bg-primary' : 
                          stat.variant === 'outline' ? 'bg-foreground/30' : 
                          'bg-muted'
                        )}
                      />
                    </motion.div>
                  )}

                  {/* Trend indicator */}
                  {stat.description?.includes('↑') || stat.description?.includes('↓') ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.15 + 0.5, type: 'spring', stiffness: 400 }}
                      className={cn(
                        'mt-3 inline-flex items-center gap-1 text-sm font-medium',
                        stat.description.includes('↑') ? 'text-green-500' : 
                        stat.description.includes('↓') ? 'text-red-500' : ''
                      )}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {stat.description.includes('↑') || stat.description.includes('↓') ? (
                          <motion.path 
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.6, delay: index * 0.15 + 0.55 }}
                            d="M7 17l9.2-9.2L17 13" 
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        ) : null}
                      </svg>
                    </motion.div>
                  ) : null}

                  {/* Hover gradient effect */}
                  <motion.div 
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1, scale: 1.02 }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Empty state */}
          {stats.length === 0 && (
            <motion.div 
              variants={variants.item}
              className="col-span-full py-16 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-muted-foreground">No statistics to display</p>
            </motion.div>
          )}
        </div>

        {/* CTA section */}
        {stats.length > 0 && (
          <motion.div 
            variants={variants.item}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stats.length * 0.15 + 0.6, duration: 0.6 }}
            className="mt-16 md:mt-24 text-center"
          >
            <Button 
              variant="primary" 
              size="lg" 
              className={cn(
                'px-8 py-6 text-lg font-semibold',
                'bg-primary hover:bg-primary/90 transition-all duration-300',
                'group-hover:scale-[1.02] group-active:scale-[0.98]'
              )}
            >
              <span className="relative z-10">Get Started</span>
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: stats.length * 0.15 + 0.7, duration: 0.4 }}
                className="absolute right-4 z-20"
              >
                <svg className="w-5 h-5 text-primary-foreground group-hover:text-background transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.span>
            </Button>

            {/* Decorative elements */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block">
              <motion.div 
                initial={{ y: 0 }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-8 h-8 rounded-full border-2 border-primary/30 flex items-center justify-center"
              >
                <div className="w-4 h-4 rounded-full bg-primary/50" />
              </motion.div>
            </div>

            <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
              <motion.div 
                initial={{ y: 0 }}
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                className="w-8 h-8 rounded-full border-2 border-primary/30 flex items-center justify-center"
              >
                <div className="w-4 h-4 rounded-full bg-primary/50" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: stats.length * 0.15 + 0.8, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <motion.div 
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-muted-foreground/60"
        >
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Reduced motion preference */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .stats-inline-animate {
            transition-duration: 0.2s !important;
            animation-duration: 0.5s !important;
            scroll-behavior: auto !important;
          }
          
          .stats-inline-stagger {
            transition-duration: 0.3s !important;
            animation-duration: 0.8s !important;
          }
        }
      `}</style>
    </motion.section>
  );
}

// Helper to create a gradient border effect for hover states
function getHoverBorderClass(variant: StatsInlineProps['stats'][number]['variant'] = 'default'): string {
  const base = 'border-border';
  
  switch (variant) {
    case 'primary': return 'hover:border-primary/50';
    case 'outline': return 'hover:border-foreground/30';
    default: return base;
  }
}

// Helper to create a gradient text effect for values
function getGradientTextClass(value: string | number, variant: StatsInlineProps['stats'][number]['variant'] = 'default'): string {
  if (typeof value === 'string' && !isNaN(Number(value))) {
    return 'bg-gradient-to-r from-foreground via-foreground/80 to-muted bg-clip-text text-transparent';
  }
  return '';
}

// Helper to create a pulsing glow effect for primary variant stats
function getGlowEffect(variant: StatsInlineProps['stats'][number]['variant'] = 'default'): string {
  if (variant === 'primary') {
    return `before:absolute before:-inset-1 before:bg-primary/5 before:rounded-xl before:blur opacity-0 group-hover:before:opacity-30 transition-opacity duration-300 pointer-events-none`;
  }
  return '';
}

// Helper to create a floating particle effect for the background
function getParticleEffect(): React.ReactNode {
  const particles = Array.from({ length: 8 }).map((_, i) => (
    <motion.div
      key={i}
      initial={{ 
        x: Math.random() * 100, 
        y: Math.random() * 100,
        scale: 0.5 + Math.random() * 0.5,
        opacity: 0.3 + Math.random() * 0.2
      }}
      animate={{ 
        x: [Math.random() * 100, Math.random() * 100],
        y: [Math.random() * 100, Math.random() * 100],
        scale: [0.5 + Math.random() * 0.5, 0.8 + Math.random() * 0.2, 0.5 + Math.random() * 0.5]
      }}
      transition={{ 
        duration: 20 + Math.random() * 30,
        repeat: Infinity,
        ease: 'linear',
        delay: i * 2
      }}
      className="absolute w-1 h-1 rounded-full bg-primary/10 pointer-events-none"
    />
  ));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 1 }}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {particles}
    </motion.div>
  );
}

// Export the particle effect as a named export for reuse
export const ParticleBackground = getParticleEffect;
