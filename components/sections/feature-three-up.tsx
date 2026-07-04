'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FeatureItem {
  title: string;
  description: string;
  visual?: React.ReactNode | string;
  icon?: React.ReactNode;
}

export interface FeatureThreeUpProps {
  features: FeatureItem[];
  showCallToAction?: boolean;
  ctaText?: string;
  ctaUrl?: string;
  className?: string;
}

const defaultFeatures: FeatureItem[] = [
  {
    title: 'Lightning Fast',
    description: 'Built on Next.js 15 with edge caching and optimized rendering for instant load times.',
  },
  {
    title: 'Type-Safe by Default',
    description: 'Full TypeScript support with strict typing from the ground up. No runtime surprises.',
  },
  {
    title: 'Premium Design System',
    description: 'Shadcn/ui components with custom violet tokens and polished micro-interactions.',
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.2,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  }),
};

const itemHover = {
  scale: 1.02,
  rotateX: -5,
  transition: { duration: 0.4, ease: 'easeOut' },
} as const;

export default function FeatureThreeUp({
  features = defaultFeatures,
  showCallToAction = true,
  ctaText = 'Get Started',
  ctaUrl = '#',
  className,
}: FeatureThreeUpProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = React.useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <motion.section
      ref={containerRef}
      className={cn(
        'relative py-24 md:py-32 overflow-hidden',
        'bg-gradient-to-b from-background via-muted/50 to-background',
        className,
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0.95 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-48 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-[128px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 -right-48 w-80 h-80 bg-primary/5 rounded-full blur-[96px]"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          custom={0}
          className="text-center mb-12 md:mb-16"
        >
          <Badge variant="secondary" className="mb-4 px-3 py-1.5 text-sm">
            Features
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Built for Excellence
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            Three pillars that define our approach to premium web experiences.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              variant={containerVariants.visible(index)}
              hover={itemHover}
            />
          ))}
        </div>

        {/* CTA */}
        {showCallToAction && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            custom={2.5}
            className="mt-16 md:mt-24 text-center"
          >
            <Button asChild size="lg" variant="primary">
              <a href={ctaUrl}>{ctaText}</a>
            </Button>
          </motion.div>
        )}

        {/* Bottom decorative element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-32">
          <motion.div
            className="w-full h-full bg-gradient-to-t from-primary/5 to-transparent blur-[64px]"
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 10 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <span className="text-sm text-muted-foreground">Scroll to explore</span>
        <motion.div
          animate={{ rotate: [0, 90] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M7 13l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

function FeatureCard({ feature, variant, hover }: { feature: FeatureItem; variant: any; hover: any }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      variants={variant}
      initial="hidden"
      animate="visible"
      whileHover={{ ...hover }}
      className="group relative p-6 md:p-8 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-colors duration-300"
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-20 blur-lg"
        animate={{ scale: [1, 1.05], opacity: [0.3, 0.4] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {feature.visual && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-5 p-3 rounded-lg bg-muted/50 text-primary inline-block"
          >
            <div className="text-xl">{feature.visual}</div>
          </motion.div>
        )}

        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
          {feature.title}
        </h3>

        <p className="text-muted-foreground leading-relaxed flex-grow">
          {feature.description}
        </p>

        {/* Decorative element */}
        <motion.div
          className="mt-4 flex items-center gap-2"
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">Verified</span>
        </motion.div>
      </div>

      {/* Corner accent */}
      <motion.div
        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary/20"
        animate={{ scale: [1, 1.3], opacity: [0.5, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}

// Reduced motion preference detection
const useReducedMotion = () => {
  const [isReduced, setIsReduced] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsReduced(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      );
    }
  }, []);

  return isReduced;
};

// Apply reduced motion to the container
const ReducedMotionWrapper = ({ children }: { children: React.ReactNode }) => {
  const isReduced = useReducedMotion();

  if (isReduced) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};
