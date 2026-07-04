'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

interface StepItemProps {
  number: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
  delay?: number;
}

export interface StepsHorizontalProps {
  steps: StepItemProps[];
  className?: string;
  containerClassName?: string;
  animationDelay?: number;
  staggerDirection?: 'left' | 'right';
  showIcons?: boolean;
  iconSize?: number;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export interface StepItemProps {
  number: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
  delay?: number;
}

const getBorderRadius = (radius: StepsHorizontalProps['borderRadius']) => {
  const map: Record<string, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };
  return map[radius] ?? 'rounded-lg';
};

const getStaggerDelay = (index: number, total: number, direction: string) => {
  const baseDelay = 0.1;
  if (direction === 'left') {
    return index * baseDelay;
  }
  return (total - 1 - index) * baseDelay;
};

const getStaggerY = (index: number, total: number) => {
  const range = 20;
  if (index < total / 2) {
    return -range + (index % 2 === 0 ? 1 : -1) * (index % 2 === 0 ? 5 : 3);
  }
  return range + (index % 2 === 0 ? 1 : -1) * (index % 2 === 0 ? 5 : 3);
};

const getStaggerX = (index: number, total: number) => {
  const range = 40;
  if (index < total / 2) {
    return -range + (index % 2 === 0 ? 1 : -1) * (index % 2 === 0 ? 5 : 3);
  }
  return range + (index % 2 === 0 ? 1 : -1) * (index % 2 === 0 ? 5 : 3);
};

const getStaggerScale = (index: number, total: number) => {
  const mid = total / 2;
  if (index < mid) {
    return 0.98 + ((mid - index) / mid) * 0.04;
  }
  return 1.04 - ((index - mid) / (total - mid)) * 0.04;
};

export function StepsHorizontal({
  steps,
  className,
  containerClassName,
  animationDelay = 0.25,
  staggerDirection = 'left',
  showIcons = true,
  iconSize = 36,
  borderRadius = 'lg',
}: StepsHorizontalProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);

  const isInView = useInView(containerRef, { once: true, margin: '10% 20%' });

  React.useEffect(() => {
    if (isInView) setInView(true);
  }, [isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: animationDelay,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: (index: number) => ({
      y: getStaggerY(index, steps.length),
      x: getStaggerX(index, steps.length),
      scale: getStaggerScale(index, steps.length),
      rotate: index % 2 === 0 ? -3 : 3,
    }),
    visible: {
      y: 0,
      x: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
        duration: 0.8,
      },
    },
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'clamp(1rem, 4vw, 2rem)',
    gap: 'clamp(0.5rem, 1vw, 1rem)',
    maxWidth: steps.length > 3 ? 'min(90vw, 1600px)' : '100%',
  };

  const itemStyle = {
    flex: '1',
    minWidth: 'min(280px, 45%)',
    padding: 'clamp(1.25rem, 3vw, 2rem)',
    borderRadius: getBorderRadius(borderRadius),
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-border)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'default',
  };

  const hoverStyle = {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px -6px rgba(139, 92, 246, 0.15), 0 8px 16px -4px rgba(139, 92, 246, 0.1)',
    border: '1px solid var(--border-primary)',
  };

  const numberStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: `${iconSize}px`,
    height: `${iconSize}px`,
    borderRadius: getBorderRadius(borderRadius),
    backgroundColor: 'var(--bg-background)',
    border: `2px solid var(--border-border)`,
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    transition: 'all 0.3s ease',
  };

  const hoverNumberStyle = {
    backgroundColor: 'var(--bg-muted)',
    borderColor: 'var(--border-primary)',
    transform: 'scale(1.1) rotate(5deg)',
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn('w-full', containerClassName)}
      style={{ ...containerStyle }}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {steps.map((step, index) => (
        <motion.div
          key={index}
          className={cn('relative group', itemStyle)}
          variants={itemVariants}
          custom={index}
          whileHover={{ ...hoverStyle }}
          style={{ ...itemStyle, ...getStaggerX(index, steps.length) }}
        >
          <motion.div
            className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-background border-2 border-border flex items-center justify-center"
            whileHover={hoverNumberStyle}
          >
            <span
              className={cn(
                'text-sm font-bold',
                index === 0 ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
              )}
            >
              {step.number}
            </span>
          </motion.div>

          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                {showIcons && step.icon ? (
                  <motion.span
                    className={cn(
                      'p-2 rounded-lg bg-muted/50',
                      index === 0 ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                    )}
                    whileHover={{ scale: 1.1, rotate: -3 }}
                  >
                    {step.icon}
                  </motion.span>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                    <span className={cn('text-sm font-bold', index === 0 ? 'text-primary' : 'text-muted-foreground group-hover:text-primary')}>
                      {step.number}
                    </span>
                  </div>
                )}

                <CardTitle className="text-lg font-semibold">
                  {step.title}
                </CardTitle>
              </div>

              <CardDescription className={cn(
                'leading-relaxed',
                index === 0 ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
              )}>
                {step.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex items-center justify-between">
              <div className={cn(
                'w-full h-1 rounded-full bg-muted',
                index === 0 ? 'bg-primary/20' : ''
              )} />

              {index < steps.length - 1 && (
                <motion.div
                  className="flex-1 h-1 rounded-full bg-border"
                  whileHover={{ scale: 1.5, backgroundColor: 'var(--border-primary)' }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, delay: index * 0.3 + 0.2 }}
                    className="h-full rounded-full bg-primary/60"
                  />
                </motion.div>
              )}

              {index === steps.length - 1 && (
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  index === 0 ? 'bg-primary text-background' : 'bg-muted group-hover:bg-primary/20'
                )}>
                  {index === 0 ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span className={cn('text-xs font-bold', index === 0 ? 'text-background' : 'text-muted-foreground group-hover:text-primary')}>
                      {step.number}
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default StepsHorizontal;
