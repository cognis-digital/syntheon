'use client';

import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, Globe, ShieldCheck, Users, Sparkles } from 'lucide-react';

interface HeroScreenshotProps {
  screenshots: Array<{
    src: string;
    alt: string;
    caption?: string;
    featured?: boolean;
  }>;
  primaryAction: {
    label: string;
    href: string;
    variant?: 'default' | 'primary';
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  showStats?: boolean;
}

const variants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1],
    },
  }),
};

export interface HeroScreenshotPropsInterface extends HeroScreenshotProps {}

export default function HeroScreenshot({
  screenshots = [
    { src: '/screenshot-1.png', alt: 'Dashboard view', caption: 'Real-time analytics' },
    { src: '/screenshot-2.png', alt: 'Mobile app', caption: 'Seamless mobile experience' },
    { src: '/screenshot-3.png', alt: 'API integration', caption: 'Developer-friendly APIs' },
  ],
  primaryAction = { label: 'Start Free Trial', href: '#pricing', variant: 'primary' },
  secondaryAction,
  showStats = true,
}: HeroScreenshotProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scrollProgress] = useTransform(
    (latest: number) => latest / 1000,
    [0, 1],
    [0, 1]
  );

  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        <div className="absolute -top-[30%] -left-[10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] bg-accent/8 rounded-full blur-[100px]" />
      </motion.div>

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-primary/10 border-border">
                <Sparkles className="w-4 h-4 mr-2 text-accent" />
                v2.0 Now Live — See What's New
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground leading-[1.1]"
            >
              Build faster with{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-300%">
                Syntheon
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg lg:text-xl text-muted-foreground max-w-xl"
            >
              The developer-first platform that combines powerful abstractions with production-ready quality. Ship faster without compromising on polish.
            </motion.p>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" asChild>
                <a href={primaryAction.href} className="group">
                  {primaryAction.label}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>

              {secondaryAction && (
                <Button size="lg" variant="outline" asChild>
                  <a href={secondaryAction.href}>
                    {secondaryAction.label}
                  </a>
                </Button>
              )}
            </motion.div>

            {/* Stats */}
            {showStats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8"
              >
                {[
                  { icon: Zap, label: '5x faster', value: 'Build time' },
                  { icon: Globe, label: '99.9% uptime', value: 'Reliability' },
                  { icon: ShieldCheck, label: 'SOC2 Type II', value: 'Compliance' },
                  { icon: Users, label: '10k+ developers', value: 'Community' },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Right content - Screenshots */}
          <div className="relative">
            {/* Main screenshot container with parallax effect */}
            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="aspect-[4/3] lg:aspect-auto lg:h-[600px] rounded-2xl overflow-hidden bg-card border-border shadow-xl">
                {screenshots.map((screenshot, i) => (
                  <motion.div
                    key={i}
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    className={cn(
                      'absolute inset-0',
                      screenshot.featured ? '' : `z-${screenshots.length - i}`
                    )}
                  >
                    <img
                      src={screenshot.src}
                      alt={screenshot.alt}
                      className="w-full h-full object-cover"
                      loading={screenshot.featured ? 'eager' : 'lazy'}
                    />
                    
                    {/* Caption overlay */}
                    {screenshot.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <p className="text-white text-sm font-medium">{screenshot.caption}</p>
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Featured badge overlay */}
                {screenshots[1]?.featured && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                    className="absolute top-4 right-4"
                  >
                    <Badge variant="secondary" className="bg-accent/90 backdrop-blur-sm">
                      Featured
                    </Badge>
                  </motion.div>
                )}
              </div>

              {/* Decorative elements */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/20 rounded-full blur-3xl"
              />
            </motion.div>

            {/* Floating action card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute -bottom-8 left-8 bg-background/90 backdrop-blur-md border-border rounded-xl p-4 shadow-lg max-w-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Just shipped</p>
                  <p className="text-xs text-muted-foreground">New features available now</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground"
        >
          <span className="text-sm">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>

      {/* Background grid pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
        }}
      />
    </section>
  );
}

// Hook to detect reduced motion preference
function useReducedMotion() {
  const [isReduced, setIsReduced] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  return isReduced;
}
