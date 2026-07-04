'use client';

import { cn } from '@/lib/utils';
import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle2, ArrowUpRight, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface StepProps {
  number: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  delay?: number;
}

export interface StepsVerticalProps {
  steps: Array<{
    number: string;
    title: string;
    description: string;
    icon?: React.ReactNode;
    delay?: number;
  }>;
  className?: string;
  variant?: 'default' | 'minimal';
}

export function StepsVertical({
  steps,
  className,
  variant = 'default',
}: StepsVerticalProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [bounds] = useInView(containerRef, { once: true, margin: '100px' });

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative py-24 overflow-hidden',
        variant === 'minimal' ? 'py-16' : '',
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[128px]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[128px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={bounds ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 max-w-4xl mx-auto px-6"
      >
        <div className="flex flex-col gap-12">
          {steps.map((step, index) => (
            <StepItem key={index} step={step} index={index} />
          ))}
        </div>

        {/* CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={bounds ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: steps.length * 0.1, ease: 'easeOut' }}
          className="mt-16 flex items-center justify-between gap-4"
        >
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              Ready to get started?
            </h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Join thousands of satisfied customers building their next big idea.
            </p>
          </div>
          <Button size="lg" variant="primary">
            Start Free Trial
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Floating decorative elements */}
      <AnimatePresence>
        {bounds && (
          <>
            <motion.div
              initial={{ x: -100, y: 50, opacity: 0 }}
              animate={{ x: -30, y: 20, opacity: 1 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-8 top-1/4 z-0"
            >
              <Sparkles className="h-6 w-6 text-primary/30 rotate-[-15deg]" />
            </motion.div>
            <motion.div
              initial={{ x: 100, y: -50, opacity: 0 }}
              animate={{ x: 20, y: -20, opacity: 1 }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute right-8 top-1/3 z-0"
            >
              <Sparkles className="h-5 w-5 text-primary/20 rotate-[45deg]" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepItem({ step, index }: { step: StepProps; index: number }) {
  const [bounds] = useInView(
    React.useRef<HTMLDivElement>(null),
    { once: true, margin: '50px' }
  );

  return (
    <motion.div
      ref={React.useRef<HTMLDivElement>(null)}
      initial={{ opacity: 0, x: -24 }}
      animate={bounds ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="relative pl-8"
    >
      {/* Connecting line */}
      <motion.div
        initial={{ height: 2 }}
        animate={bounds ? { height: 36 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.1, ease: 'easeOut' }}
        className="absolute left-4 top-8 w-0.5 bg-border"
      />

      {/* Step content */}
      <Card
        variant={variant === 'minimal' ? 'none' : 'default'}
        className={cn(
          'relative overflow-hidden group cursor-pointer',
          variant === 'minimal' ? '' : 'hover:border-primary/50 transition-colors duration-300'
        )}
      >
        <CardContent className="p-6">
          {/* Number badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={bounds ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.2, ease: 'easeOut' }}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10"
          >
            <div
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full border-4',
                variant === 'minimal' ? '' : 'border-background',
                index % 2 === 0 ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'
              )}
            >
              <span className="text-sm font-semibold">{step.number}</span>
            </div>
          </motion.div>

          {/* Icon */}
          {step.icon && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={bounds ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 + 0.3, ease: 'easeOut' }}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10"
            >
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full border-4',
                  variant === 'minimal' ? '' : 'border-background',
                  index % 2 !== 0 ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'
                )}
              >
                {step.icon}
              </div>
            </motion.div>
          )}

          {/* Content */}
          <div className="relative z-10">
            <h3 className={cn(
              'text-lg font-semibold mb-2',
              variant === 'minimal' ? '' : 'text-primary'
            )}>
              {step.title}
            </h3>
            <p className={cn(
              'text-muted-foreground leading-relaxed',
              variant === 'minimal' ? 'text-sm' : ''
            )}>
              {step.description}
            </p>

            {/* Hover effect */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={bounds && !variant.includes('minimal') ? { opacity: 1 } : {}}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-lg -z-10"
            />
          </div>

          {/* Checkmark indicator */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={bounds ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.5, ease: 'easeOut' }}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10"
          >
            <CheckCircle2 className={cn(
              'h-6 w-6',
              index % 2 === 0 ? 'text-primary' : 'text-muted-foreground'
            )} />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Animated marquee for additional visual interest
function FeatureMarquee() {
  const [bounds] = useInView(React.useRef<HTMLDivElement>(null), { once: true, margin: '100px' });

  return (
    <div className="relative overflow-hidden py-8">
      <motion.div
        initial={{ x: -50 }}
        animate={bounds ? { x: [0, 20] } : {}}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="flex gap-8"
      >
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -20 }}
            animate={bounds ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
            className="flex items-center gap-3"
          >
            <div className="h-2 w-2 rounded-full bg-primary/40" />
            <span className="text-sm text-muted-foreground">
              {['Fast', 'Secure', 'Scalable', 'Reliable'][i]}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// Counter animation for stats
function StatCounter({ value, label }: { value: number; label: string }) {
  const [bounds] = useInView(React.useRef<HTMLDivElement>(null), { once: true, margin: '50px' });

  return (
    <motion.div
      ref={React.useRef<HTMLDivElement>(null)}
      initial={{ opacity: 0, y: 24 }}
      animate={bounds ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={bounds ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
      >
        {value.toLocaleString()}+
      </motion.div>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );
}

// Stats section that can be included in the main component
function StatsSection() {
  const [bounds] = useInView(React.useRef<HTMLDivElement>(null), { once: true, margin: '50px' });

  return (
    <motion.div
      ref={React.useRef<HTMLDivElement>(null)}
      initial={{ opacity: 0, y: 24 }}
      animate={bounds ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
      className="grid grid-cols-2 gap-8 py-6"
    >
      <StatCounter value={15000} label="Active Users" />
      <StatCounter value={98} label="Satisfaction %" />
    </motion.div>
  );
}

// Export individual parts for composable use
export { StepItem, StatsSection };
