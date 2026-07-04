'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface HeroGradientProps {
  title: string;
  subtitle?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  primaryHref?: string;
  secondaryHref?: string;
  badgeLabel?: string;
}

export const HeroGradient = ({
  title,
  subtitle,
  primaryCtaText = 'Get Started',
  secondaryCtaText = 'Watch Demo',
  primaryHref = '#',
  secondaryHref = '#',
  badgeLabel = 'New Release'
}: HeroGradientProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const isInView = useInView(containerRef, { once: true, margin: '-50% 0px -25% 0px' });

  React.useEffect(() => {
    if (isInView) setInView(true);
  }, [isInView]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-slate-950 to-black" />

        {/* Animated gradient orbs */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-[40rem] h-[40rem] rounded-full blur-[120px] ${
              i % 2 === 0 ? 'bg-violet-500/30' : 'bg-fuchsia-500/20'
            }`}
            initial={{ x: i * 60, y: i * 40, scale: 0.8 }}
            animate={inView ? {
              x: [i * 60 + 30, i * 60 - 50, i * 60 + 30],
              y: [i * 40 + 20, i * 40 - 30, i * 40 + 20],
              scale: [0.8, 1.1, 0.9]
            } : { x: i * 60, y: i * 40, scale: 0.8 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`, backgroundSize: '6rem 6rem' }}
        />
      </motion.div>

      {/* Content container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-2 bg-violet-500/10 border-violet-500/20 text-violet-300">
              {badgeLabel}
            </Badge>
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <Button 
              size="lg" 
              variant="default" 
              className={cn(
                "h-14 px-8 text-lg font-medium bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500",
                inView && "shadow-lg shadow-violet-500/25"
              )}
            >
              {primaryCtaText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            {secondaryHref && (
              <Button 
                size="lg" 
                variant="outline" 
                className={cn(
                  "h-14 px-8 text-lg font-medium border-border hover:bg-muted/50",
                  inView && "border-violet-500/30 text-violet-300 hover:text-white"
                )}
              >
                {secondaryCtaText}
              </Button>
            )}
          </div>

          {/* Floating feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
            className="mt-24 grid grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: Sparkles, label: 'Premium Design', desc: 'Award-winning aesthetics' },
              { icon: Zap, label: 'Lightning Fast', desc: 'Optimized performance' },
              { icon: ShieldCheck, label: 'Secure by Default', desc: 'Enterprise-grade protection' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm"
              >
                <feature.icon className="h-6 w-6 mb-4 text-violet-400" />
                <h3 className="font-semibold mb-1">{feature.label}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <span className="text-sm">Scroll to explore</span>
            <div className="w-5 h-0.5 bg-current rounded-full" />
          </motion.div>
        </motion.div>
      </div>

      {/* Parallax floating elements */}
      {inView && (
        <>
          <motion.div
            className="absolute top-24 left-8 w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 blur-xl"
            animate={{ y: -40, rotate: 10 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-24 right-8 w-20 h-20 rounded-full bg-gradient-to-br from-fuchsia-500/30 to-violet-500/30 blur-xl"
            animate={{ y: 40, rotate: -10 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}
    </section>
  );
};

export default HeroGradient;
