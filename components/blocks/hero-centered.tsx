'use client';

import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, Layers, ShieldCheck, Sparkles } from 'lucide-react';

interface HeroCenteredProps {
  title: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  badges?: Array<{ label: string; icon?: React.ReactNode }>;
  imageSrc?: string;
  showGradient?: boolean;
}

export interface HeroCenteredPropsInterface extends HeroCenteredProps {
  className?: string;
}

const DEFAULT_PROPS: Omit<HeroCenteredProps, 'className'> = {
  title: 'Build AI Applications Faster',
  subtitle: 'The next-generation platform for teams shipping intelligent products. From prototype to production in days, not months.',
  primaryCtaText: 'Start Building Free',
  primaryCtaUrl: '#pricing',
  secondaryCtaText: 'View Live Demo',
  secondaryCtaUrl: '#demo',
  badges: [
    { label: '10K+ Teams', icon: <Zap className="h-4 w-4" /> },
    { label: '99.9% Uptime', icon: <ShieldCheck className="h-4 w-4" /> },
    { label: 'AI-Powered', icon: <Sparkles className="h-4 w-4" /> },
  ],
  imageSrc: '/images/hero-dashboard.png',
  showGradient: true,
};

export default function HeroCentered({
  title = DEFAULT_PROPS.title,
  subtitle = DEFAULT_PROPS.subtitle,
  primaryCtaText = DEFAULT_PROPS.primaryCtaText,
  primaryCtaUrl = DEFAULT_PROPS.primaryCtaUrl,
  secondaryCtaText = DEFAULT_PROPS.secondaryCtaText,
  secondaryCtaUrl = DEFAULT_PROPS.secondaryCtaUrl,
  badges = DEFAULT_PROPS.badges,
  imageSrc = DEFAULT_PROPS.imageSrc,
  showGradient = DEFAULT_PROPS.showGradient,
  className,
}: HeroCenteredPropsInterface) {
  const ref = React.useRef(null);
  const { scrollY } = useScroll();
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const parallaxY = useTransform(scrollY, [0, 1000], [-20, -80]);

  return (
    <section
      ref={ref}
      className={cn(
        'relative min-h-screen flex items-center justify-center overflow-hidden bg-background',
        showGradient && 'bg-gradient-to-b from-background via-[#1a1625] to-background',
        className
      )}
    >
      {/* Animated Background Mesh */}
      <motion.div
        style={{ y: parallaxY, zIndex: 0 }}
        className="absolute inset-0 opacity-40"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1.5 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute -top-[30%] -left-[10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[100px]" />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 sm:py-32">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badges */}
          {badges && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap justify-center items-center gap-3"
            >
              {badges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="gap-2 px-4 py-1.5 text-sm">
                  {badge.icon}
                  <span>{badge.label}</span>
                </Badge>
              ))}
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-foreground"
          >
            <span className="bg-gradient-to-r from-primary via-purple-300 to-primary bg-[length:200%_auto] animate-shimmer">
              {title}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" asChild className="h-12 px-8 text-base font-medium">
              <a href={primaryCtaUrl} className="group">
                {primaryCtaText}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>

            <Button variant="outline" size="lg" asChild className="h-12 px-8 text-base font-medium">
              <a href={secondaryCtaUrl} className="group">
                {secondaryCtaText}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </motion.div>

          {/* Social Proof / Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold text-primary">4.9/5</span>
              <span>on G2</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <span className="font-semibold text-primary">Featured in</span>
              <span>TechCrunch, Product Hunt</span>
            </div>
          </motion.div>
        </div>

        {/* Hero Image / Dashboard Preview */}
        {imageSrc && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-24 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <motion.div
              style={{ y: parallaxY * 1.5 }}
              initial={{ scale: 0.95, rotateX: 20 }}
              animate={{ scale: 1, rotateX: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="relative rounded-2xl border border-border/30 shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-transparent pointer-events-none" />
              <img src={imageSrc} alt="" className="w-full h-auto object-cover max-h-[60vh]" loading="eager" />

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-background/80 backdrop-blur-md border border-border/50 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Live Preview</p>
                    <p className="text-xs text-muted-foreground">Real-time collaboration enabled</p>
                  </div>
                  <Badge variant="outline" className="gap-1.5">
                    <Layers className="h-3 w-3" /> 24 active users
                  </Badge>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground"
      >
        <span className="text-sm">Scroll to explore</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ArrowRight className="h-4 w-4 rotate-90" />
        </motion.div>
      </motion.div>

      {/* Reduced Motion Support */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>

      <motion.div
        className="pointer-events-none fixed inset-0 z-[99] bg-transparent transition-opacity duration-100"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)',
        }}
      />
    </section>
  );
}

// Hook to check reduced motion preference
export function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  return reduced;
}
