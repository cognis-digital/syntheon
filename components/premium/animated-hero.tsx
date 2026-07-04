'use client';

import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface AnimatedHeroProps {
  headline: string;
  subheadline?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  features?: Array<{ icon: React.ReactNode; title: string; description: string }>;
  animationDuration?: number;
}

const variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6 * i,
      delay: 0.2 * i,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const floatVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: (i: number) => ({
    y: -20 + i * 30,
    opacity: 1,
    transition: {
      duration: 4,
      repeat: Infinity,
      delay: 1.5 + i * 0.8,
      ease: 'easeInOut',
    },
  }),
};

export default function AnimatedHero({
  headline,
  subheadline = '',
  primaryCta,
  secondaryCta,
  features,
  animationDuration = 0.6,
}: AnimatedHeroProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scrollY] = useScroll();

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/10" />
      
      {/* Animated background elements */}
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/20 blur-[120px]"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ 
          scale: [1, 1.3], 
          opacity: [0.2, 0.4, 0.2],
          rotate: 360 
        }}
        transition={{ duration: animationDuration * 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/20 blur-[150px]"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ 
          scale: [1.5, 1], 
          opacity: [0.3, 0.15, 0.3],
          rotate: -45
        }}
        transition={{ duration: animationDuration * 7 + 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content container */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: animationDuration * 2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex flex-col items-start gap-8">
            {/* Badge */}
            {subheadline && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: animationDuration * 2, delay: 0.6 }}
              >
                <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                  {subheadline}
                </Badge>
              </motion.div>
            )}

            {/* Headline */}
            <h1 className={cn(
              "text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight",
              "bg-gradient-to-r from-primary via-primary/90 to-primary/60 bg-clip-text text-transparent"
            )}>
              {headline}
            </h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: animationDuration * 2, delay: 0.8 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed"
            >
              {subheadline}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: animationDuration * 2, delay: 1 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Button asChild size="lg">
                <a href={primaryCta.href}>{primaryCta.label}</a>
              </Button>

              {secondaryCta && (
                <Button variant="outline" asChild size="lg">
                  <a href={secondaryCta.href}>{secondaryCta.label}</a>
                </Button>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Feature highlights */}
        {features && features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: animationDuration * 2, delay: 1.2 }}
            className="mt-24 grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: animationDuration * 2, delay: 1.4 + i * 0.1 }}
              >
                <Card className="p-6 border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      "bg-primary/10 text-primary"
                    )}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Parallax floating elements */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2"
        style={{ x: useTransform(scrollY, (y) => y * 0.15) }}
        variants={floatVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-64 h-64 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        className="absolute left-0 bottom-1/4"
        style={{ x: useTransform(scrollY, (y) => -y * 0.15) }}
        variants={floatVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-48 h-48 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl" />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: animationDuration * 2, delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2"
      >
        <span className="text-sm text-muted-foreground">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
