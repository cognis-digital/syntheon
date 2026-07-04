'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface UseCaseItemProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  delay?: number;
}

export interface UseCaseGridProps {
  items: UseCaseItemProps[];
  className?: string;
  onExploreClick?: () => void;
  highlightCount?: number;
}

const useCaseData = [
  {
    title: 'AI App Builder',
    description: 'Generate production-ready React apps from natural language prompts. Full stack, styled with Tailwind.',
    icon: <span className="text-violet-400">⚡</span>,
    delay: 100,
  },
  {
    title: 'Smart Component Library',
    description: 'Auto-generate shadcn/ui components from your design tokens. Consistent theming across projects.',
    icon: <span className="text-violet-400">🎨</span>,
    delay: 200,
  },
  {
    title: 'API Integration Studio',
    description: 'Connect to any REST/GraphQL API. Auto-generate typed clients with error handling baked in.',
    icon: <span className="text-violet-400">🔌</span>,
    delay: 300,
  },
  {
    title: 'State Management Wizard',
    description: 'Generate Zustand/Redux slices from your feature tree. Type-safe state flows out of the box.',
    icon: <span className="text-violet-400">📦</span>,
    delay: 400,
  },
  {
    title: 'Form Generator',
    description: 'Create accessible forms with Zod validation. Auto-generate submit handlers and error handling.',
    icon: <span className="text-violet-400">📝</span>,
    delay: 500,
  },
  {
    title: 'Dashboard Templates',
    description: 'Pre-built analytics layouts with Recharts integration. Export as React components instantly.',
    icon: <span className="text-violet-400">📊</span>,
    delay: 600,
  },
];

function UseCaseCard({ item }: { item: UseCaseItemProps }) {
  const ref = useInView(null, { once: true, margin: '100px' });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1],
        delay: item.delay / 1000,
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group"
    >
      <Card className={cn(
        'h-full bg-background/50 border-border hover:border-violet-400/60',
        'transition-colors duration-300 group-hover:bg-background',
        'backdrop-blur-sm'
      )}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center text-lg',
                'bg-primary/10 border border-violet-400/20'
              )}
            >
              {item.icon || <span className="text-violet-400">✨</span>}
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <CardTitle className={cn(
                'text-lg font-semibold text-primary mb-2',
                'group-hover:text-violet-300 transition-colors'
              )}>
                {item.title}
              </CardTitle>
              
              <p className="text-muted-foreground/80 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function UseCaseGrid({ 
  items = useCaseData, 
  className,
  onExploreClick,
  highlightCount = 3
}: UseCaseGridProps) {
  const containerRef = useInView(null, { once: true });
  
  return (
    <section className={cn(
      'relative py-24 overflow-hidden',
      'bg-gradient-to-b from-background via-primary/5 to-background'
    )}>
      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-500/10 rounded-full blur-[128px]" />
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 -right-32 w-[30rem] h-[30rem] bg-violet-600/5 rounded-full blur-[128px]" 
        />
      </motion.div>

      <div ref={containerRef} className="relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-16"
        >
          <Badge 
            variant="secondary" 
            className={cn(
              'mb-4 px-4 py-2 text-sm',
              'bg-violet-500/10 border-violet-400/30'
            )}
          >
            Features & Capabilities
          </Badge>

          <h2 className={cn(
            'text-4xl md:text-5xl font-bold text-primary mb-6',
            'bg-gradient-to-r from-violet-100 via-white to-violet-100 dark:from-violet-300/80 dark:via-white dark:to-violet-300/80'
          )}>
            Build Anything, Faster
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Everything you need to ship production-ready AI applications. 
            From concept to deployment in record time.
          </p>
        </motion.div>

        {/* Grid */}
        <div className={cn(
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto',
          className
        )}>
          {items.map((item, index) => (
            <UseCaseCard key={index} item={{ ...item }} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Button 
            size="lg" 
            variant="default"
            onClick={onExploreClick}
            className={cn(
              'px-8 py-6 text-lg',
              'bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500',
              'border border-violet-400/30 shadow-lg shadow-violet-500/25'
            )}
          >
            Start Building Free
          </Button>

          <p className="text-muted-foreground mt-4 text-sm">
            No credit card required · 14-day free trial
          </p>
        </motion.div>
      </div>
    </section>
  );
}
