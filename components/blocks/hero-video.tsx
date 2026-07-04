'use client';

import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, Zap, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

export interface HeroVideoProps {
  title: string;
  subtitle?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  stats?: Array<{ label: string; value: string | number }>;
  showStats?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  posterImage?: string;
}

interface HeroVideoContentProps extends Omit<HeroVideoProps, 'title' | 'subtitle'> {
  title: string;
  subtitle: string;
}

const defaultStats = [
  { label: 'Users', value: '10K+' },
  { label: 'Projects', value: '5K+' },
];

export function HeroVideoContent({
  title,
  subtitle,
  primaryCtaLabel = 'Start Building',
  secondaryCtaLabel = 'Watch Demo',
  onPrimaryClick,
  onSecondaryClick,
  stats = defaultStats,
  showStats = true,
  autoPlay = false,
  muted = true,
  posterImage,
}: HeroVideoContentProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = React.useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden bg-background"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background Video Layer */}
      <div
        className={cn(
          'absolute inset-0 z-0',
          posterImage ? 'bg-[url(/placeholder-hero.jpg)] bg-cover bg-center' : ''
        )}
      >
        {posterImage && (
          <motion.img
            src={posterImage}
            alt=""
            className="w-full h-full object-cover"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
        )}

        <AnimatePresence>
          {autoPlay && (
            <motion.video
              src="/placeholder-hero.mp4"
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay={true}
              loop={true}
              muted={muted}
              playsInline={true}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>

        {/* Gradient Overlay - Deep violet tones */}
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-violet-950/80 via-violet-900/60 to-background" />
      </div>

      {/* Content Layer */}
      <motion.div
        style={{ y: y1, opacity: opacity1 }}
        className="relative z-20 w-full max-w-7xl px-4 py-20 text-center"
      >
        {/* Title Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          className="mb-8"
        >
          <Badge variant="secondary" className="mb-4 inline-flex items-center gap-2 px-3 py-1 text-sm">
            <Sparkles className="h-4 w-4 text-violet-300" />
            <span>AI-Powered Platform</span>
          </Badge>

          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button
            size="lg"
            onClick={onPrimaryClick}
            className="h-12 px-8 bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30 transition-all duration-300 hover:scale-105"
          >
            {primaryCtaLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={onSecondaryClick}
            className="h-12 px-8 border-border hover:bg-muted/50 transition-all duration-300 hover:scale-105"
          >
            {secondaryCtaLabel}
            <Play className="ml-2 h-4 w-4 text-violet-600" />
          </Button>
        </motion.div>

        {/* Stats Section */}
        {showStats && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5, ease: 'easeOut' }}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4 text-violet-400" />
                <div className="text-left">
                  <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"
        />

        {/* Floating Particles/Effects */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5, ease: 'easeOut' }}
          className="absolute bottom-8 right-8 md:right-12 z-30"
        >
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 p-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="h-8 w-8 flex items-center justify-center rounded-full bg-violet-600/20 text-violet-300">
                <Zap className="h-4 w-4" />
              </Badge>
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Live Preview</div>
                <div className="text-sm font-medium text-white">Currently Online</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Bottom Glow Effect */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1, ease: 'easeOut' }}
          className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 w-[60%] h-4 bg-violet-500/30 blur-3xl rounded-full"
        />
      </motion.div>

      {/* Hover Overlay Effect */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0 z-50 pointer-events-none bg-gradient-to-t from-violet-950/40 via-transparent to-transparent"
          />
        )}
      </AnimatePresence>

      {/* Reduced Motion Preference */}
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          .hero-video-animate {
            animation-duration: 0.3s !important;
            transition-duration: 0.2s !important;
          }
        }
      `}</style>
    </motion.div>
  );
}

// Default export for convenience
export default HeroVideoContent;
