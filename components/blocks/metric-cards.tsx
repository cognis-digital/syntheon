'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, ArrowRight, Sparkles, Zap, Globe, Users, BarChart3, Activity, Cpu, Cloud, Database, Layers } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    amount: number;
    period: string;
    isPositive: boolean;
  };
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface MetricCardsProps {
  metrics: MetricCardProps[];
  title?: string;
  subtitle?: string;
  showTrends?: boolean;
  animate?: boolean;
}

export interface MetricCardComponentProps extends MetricCardsProps {}

const defaultIcons = [
  Sparkles, Zap, Globe, Users, BarChart3, Activity, Cpu, Cloud, Database, Layers
];

const getIconByIndex = (index: number) => {
  const icon = defaultIcons[index % defaultIcons.length];
  return icon;
};

export function MetricCards({ 
  metrics = [], 
  title = 'Key Metrics', 
  subtitle = '',
  showTrends = true,
  animate = true
}: MetricCardComponentProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = React.useState(false);

  React.useEffect(() => {
    if (containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut'
      }
    })
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      rotateX: -10
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  };

  const hoverVariants = {
    initial: {},
    hover: {
      scale: 1.02,
      y: -4,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.15 }
    }
  };

  const getTrendColor = (isPositive: boolean) => isPositive ? 'text-green-400' : 'text-red-400';
  const getTrendBg = (isPositive: boolean) => isPositive ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20';

  if (!metrics.length) {
    return null;
  }

  return (
    <motion.section
      ref={containerRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.6, staggerChildren: 0.05 }
        }
      }}
    >
      <div className="space-y-4">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="space-y-1"
          >
            {title && (
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground/70">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        <div 
          className={cn(
            "grid gap-4",
            "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          )}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={`${metric.title}-${index}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              custom={index}
              whileHover="hover"
              whileTap="tap"
              layout
            >
              <Card 
                className={cn(
                  "relative overflow-hidden border-border bg-card/50 backdrop-blur-sm",
                  "transition-all duration-300 ease-out hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10",
                  "group"
                )}
              >
                <CardContent className="p-5">
                  {/* Icon with subtle gradient background */}
                  <div 
                    className={cn(
                      "mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl",
                      "transition-all duration-300 group-hover:scale-110 group-hover:rotate-6",
                      metric.change ? getTrendBg(metric.change.isPositive) : 'bg-primary/5',
                      "border border-border/40"
                    )}
                  >
                    <metric.icon 
                      className={cn(
                        "h-6 w-6 text-muted-foreground transition-colors",
                        metric.change && metric.change.isPositive ? 'text-green-400' : 
                        metric.change && !metric.change.isPositive ? 'text-red-400' : 'text-primary',
                        "group-hover:scale-110 group-hover:text-white"
                      )}
                    />
                  </div>

                  {/* Title and Value */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground/80 truncate">
                      {metric.title}
                    </h3>
                    
                    <div className="flex items-baseline justify-between gap-4">
                      <span 
                        className={cn(
                          "text-2xl font-bold tracking-tight",
                          metric.change && !showTrends ? 'text-foreground' : 'text-primary',
                          "transition-colors group-hover:text-white"
                        )}
                      >
                        {metric.value}
                      </span>

                      {/* Trend Indicator */}
                      {showTrends && metric.change && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className={cn(
                            "flex items-center gap-1 text-sm",
                            getTrendColor(metric.change.isPositive)
                          )}
                        >
                          {metric.change.isPositive ? (
                            <TrendingUp 
                              className="h-4 w-4"
                              strokeWidth={2.5}
                            />
                          ) : (
                            <TrendingDown 
                              className="h-4 w-4"
                              strokeWidth={2.5}
                            />
                          )}
                          <span className="font-medium">
                            {Math.abs(metric.change.amount)}%
                          </span>
                          <span className="text-muted-foreground/60 ml-1">
                            vs last {metric.change.period}
                          </span>
                        </motion.div>
                      )}
                    </div>

                    {/* Description */}
                    {metric.description && (
                      <p 
                        className={cn(
                          "text-xs text-muted-foreground/60 line-clamp-2",
                          "transition-colors group-hover:text-muted-foreground"
                        )}
                      >
                        {metric.description}
                      </p>
                    )}

                    {/* Progress bar for positive trends */}
                    {showTrends && metric.change && metric.change.isPositive && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                        className="mt-3 h-1 overflow-hidden rounded-full bg-primary/10"
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, Math.max(5, metric.change.amount * 2))}%` }}
                          transition={{ duration: 1.5, delay: 0.4, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary"
                        />
                      </motion.div>
                    )}
                  </div>
                </CardContent>

                {/* Subtle gradient overlay on hover */}
                <motion.div 
                  className={cn(
                    "absolute inset-0 pointer-events-none",
                    "bg-gradient-to-br from-primary/5 via-transparent to-transparent"
                  )}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />

                {/* Corner accent */}
                <motion.div 
                  className={cn(
                    "absolute top-2 right-2 h-8 w-8 rounded-full",
                    "bg-primary/10 border border-border/40"
                  )}
                  initial={{ scale: 0, rotate: -45 }}
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: 0,
                    transition: { duration: 0.3, ease: 'easeOut' }
                  }}
                />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default MetricCards;
