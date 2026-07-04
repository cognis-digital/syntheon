'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Download, ArrowRight, Zap, ShieldCheck, Globe, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DownloadCTAProps {
  variant?: 'hero' | 'compact' | 'split';
  primaryColor?: 'violet' | 'indigo' | 'purple';
  showBentoGrid?: boolean;
}

const variants = {
  violet: {
    bg: 'from-violet-600/25 via-fuchsia-700/10 to-indigo-900/20',
    gradient: 'bg-gradient-to-br from-violet-600/40 via-purple-800/30 to-indigo-900/40',
    glow: 'shadow-[0_0_100px_-20px_rgba(139,92,246,0.5)]',
  },
  indigo: {
    bg: 'from-indigo-600/25 via-blue-700/10 to-violet-900/20',
    gradient: 'bg-gradient-to-br from-indigo-600/40 via-purple-800/30 to-blue-900/40',
    glow: 'shadow-[0_0_100px_-20px_rgba(79,70,229,0.5)]',
  },
  purple: {
    bg: 'from-purple-600/25 via-fuchsia-700/10 to-pink-900/20',
    gradient: 'bg-gradient-to-br from-purple-600/40 via-fuchsia-800/30 to-pink-900/40',
    glow: 'shadow-[0_0_100px_-20px_rgba(168,85,247,0.5)]',
  },
};

export interface DownloadCTAProps {
  variant?: 'hero' | 'compact' | 'split';
  primaryColor?: 'violet' | 'indigo' | 'purple';
  showBentoGrid?: boolean;
}

const defaultOptions: Required<DownloadCTAProps> = {
  variant: 'hero',
  primaryColor: 'violet',
  showBentoGrid: true,
};

export function DownloadCTA({
  variant = defaultOptions.variant,
  primaryColor = defaultOptions.primaryColor,
  showBentoGrid = defaultOptions.showBentoGrid,
}: DownloadCTAProps) {
  const options = { ...defaultOptions, ...{ variant, primaryColor, showBentoGrid } };

  const bgVariants = variants[primaryColor].bg;
  const gradientClass = variants[primaryColor].gradient;
  const glowClass = variants[primaryColor].glow;

  return (
    <section className={cn('relative overflow-hidden py-24 md:py-32', gradientClass)}>
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-background/80" />
      
      <motion.div 
        className="absolute -inset-[10%] opacity-50 blur-3xl"
        initial={{ x: '-20%', y: '-20%' }}
        animate={{ x: '20%', y: '20%' }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className={cn('w-[50%] h-[50%] rounded-full bg-gradient-to-br from-primary/30 to-transparent', glowClass)} />
      </motion.div>

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <Badge variant="secondary" className={cn('mb-6 px-3 py-1 text-sm', 'bg-primary/25 border-primary/40')}>
              <Sparkles className="w-3 h-3 mr-2 inline-block" />
              v2.0 Now Available
            </Badge>

            <h1 className={cn('text-4xl md:text-6xl font-bold tracking-tight mb-6', 'text-foreground')}>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Build faster with
              </motion.span>
              <br />
              <motion.span
                className={cn('text-primary', 'bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Syntheon
              </motion.span>
            </h1>

            <p className={cn('text-lg md:text-xl mb-8 max-w-xl', 'text-muted-foreground')}>
              The developer platform designed for teams that demand performance, security, and an experience worth paying for.
            </p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Button 
                size="lg" 
                className={cn('h-12 px-8 text-lg', 'bg-primary hover:bg-primary/90', 'text-primary-foreground')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-5 h-5 mr-2" />
                Download Now
              </Button>

              <Button 
                variant="outline" 
                size="lg" 
                className={cn('h-12 px-8 text-lg border-2', 'border-border hover:bg-muted/50')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="w-5 h-5 mr-2" />
                Live Demo
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex items-center gap-6 mt-8 pt-8 border-t border-border/40"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className={cn('w-5 h-5', 'text-primary')} />
                <span className={cn('text-sm font-medium', 'text-muted-foreground')}>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className={cn('w-5 h-5', 'text-primary')} />
                <span className={cn('text-sm font-medium', 'text-muted-foreground')}>99.9% Uptime</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right content - Bento grid */}
          {showBentoGrid && (
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Decorative background elements */}
              <motion.div 
                className={cn('absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl', 'bg-primary/20')}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity }}
              />

              {/* Bento grid */}
              <div className="grid grid-cols-2 gap-4">
                <Card className={cn('p-6 border-0', 'bg-background/50 backdrop-blur-sm')}>
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="flex flex-col h-full justify-between"
                  >
                    <div>
                      <h3 className={cn('text-lg font-semibold mb-2', 'text-foreground')}>
                        Lightning Fast
                      </h3>
                      <p className={cn('text-sm', 'text-muted-foreground')}>
                        Optimized for speed. Your users will thank you.
                      </p>
                    </div>
                    <motion.div 
                      initial={{ y: 0 }}
                      animate={{ y: -8 }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1, ease: "easeInOut" }}
                      className="flex items-center gap-1 mt-4"
                    >
                      <ArrowRight className={cn('w-5 h-5', 'text-primary')} />
                      <span className={cn('text-sm font-medium', 'text-muted-foreground')}>20% faster</span>
                    </motion.div>
                  </motion.div>
                </Card>

                <Card className={cn('p-6 border-0', 'bg-background/50 backdrop-blur-sm')}>
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                    className="flex flex-col h-full justify-between"
                  >
                    <div>
                      <h3 className={cn('text-lg font-semibold mb-2', 'text-foreground')}>
                        Type-Safe by Default
                      </h3>
                      <p className={cn('text-sm', 'text-muted-foreground')}>
                        Full TypeScript coverage. No runtime surprises.
                      </p>
                    </div>
                    <motion.div 
                      initial={{ x: 0 }}
                      animate={{ x: [0, -4, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1.5, ease: "easeInOut" }}
                      className="flex items-center gap-1 mt-4"
                    >
                      <Sparkles className={cn('w-5 h-5', 'text-primary')} />
                      <span className={cn('text-sm font-medium', 'text-muted-foreground')}>Zero errors</span>
                    </motion.div>
                  </motion.div>
                </Card>

                <Card className={cn('p-6 border-0 col-span-2', 'bg-background/50 backdrop-blur-sm')}>
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                    className="flex flex-col h-full"
                  >
                    <div>
                      <h3 className={cn('text-lg font-semibold mb-2', 'text-foreground')}>
                        Production Ready
                      </h3>
                      <p className={cn('text-sm', 'text-muted-foreground')}>
                        Deploy with confidence. Monitor, scale, and iterate faster than ever before.
                      </p>
                    </div>
                    <motion.div 
                      initial={{ y: 0 }}
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 4, repeat: Infinity, delay: 2, ease: "easeInOut" }}
                      className="flex items-center gap-1 mt-4"
                    >
                      <ShieldCheck className={cn('w-5 h-5', 'text-primary')} />
                      <span className={cn('text-sm font-medium', 'text-muted-foreground')}>SOC 2 Compliant</span>
                    </motion.div>
                  </motion.div>
                </Card>
              </div>

              {/* Floating CTA card */}
              <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9, type: "spring" }}
                className={cn(
                  'absolute -bottom-8 left-6 right-6 md:left-auto md:right-12',
                  'p-4 rounded-xl border shadow-lg'
                )}
              >
                <Card className="bg-background/90 backdrop-blur-md border-border">
                  <CardContent className="flex items-center justify-between p-3">
                    <div>
                      <h4 className={cn('text-sm font-medium', 'text-foreground')}>Ready to get started?</h4>
                      <p className={cn('text-xs', 'text-muted-foreground')}>Join 10,000+ developers</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className={cn('h-9 px-3 text-sm border-2', 'border-border')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Not showing bento grid - alternative compact layout */}
          {!showBentoGrid && (
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Abstract decorative shapes */}
              <motion.div 
                className={cn('absolute -top-32 -right-48 w-64 h-64 rounded-full blur-3xl', 'bg-primary/15')}
                animate={{ scale: [1, 1.1, 0.9] }}
                transition={{ duration: 10, repeat: Infinity }}
              />

              {/* Compact CTA card */}
              <Card className={cn('relative p-8 border-0', 'bg-background/50 backdrop-blur-sm')}>
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="flex flex-col items-center text-center"
                >
                  <motion.div 
                    initial={{ y: -20, rotate: -5 }}
                    animate={{ y: 0, rotate: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className={cn('w-16 h-16 rounded-full flex items-center justify-center mb-4', 'bg-primary/20')}
                  >
                    <Download className={cn('w-8 h-8', 'text-primary')} />
                  </motion.div>

                  <h3 className={cn('text-xl font-semibold mb-2', 'text-foreground')}>
                    Start Your Free Trial
                  </h3>

                  <p className={cn('text-sm mb-6 max-w-xs', 'text-muted-foreground')}>
                    No credit card required. 14-day free trial. Cancel anytime.
                  </p>

                  <div className="flex flex-col gap-2 w-full">
                    <Button 
                      size="lg" 
                      className={cn('h-12 px-6 text-base', 'bg-primary hover:bg-primary/90', 'text-primary-foreground')}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Free
                    </Button>

                    <p className={cn('text-xs text-center', 'text-muted-foreground')}>
                      Already have an account?{' '}
                      <a href="#" className={cn('text-primary hover:underline', 'font-medium')} tabIndex={-1}>
                        Sign in
                      </a>
                    </p>
                  </div>
                </motion.div>
              </Card>

              {/* Floating elements */}
              {[0, 1].map((i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ x: i * 30 - 60, y: i * 20 - 40 }}
                  animate={{ 
                    y: [i * 20 - 40, i * 20 - 50, i * 20 - 40],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className={cn('w-12 h-12 rounded-full border', 'border-primary/30 bg-background')}>
                    <Download className={cn('w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2', 'text-primary')} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

            {/* Compact variant */}
            {variant === 'compact' && (
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                {/* Abstract decorative shapes */}
                <motion.div 
                  className={cn('absolute -top-32 -right-48 w-64 h-64 rounded-full blur-3xl', 'bg-primary/15')}
                  animate={{ scale: [1, 1.1, 0.9] }}
                  transition={{ duration: 10, repeat: Infinity }}
                />

                {/* Compact CTA card */}
                <Card className={cn('relative p-8 border-0', 'bg-background/50 backdrop-blur-sm')}>
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="flex flex-col items-center text-center"
                  >
                    <motion.div 
                      initial={{ y: -20, rotate: -5 }}
                      animate={{ y: 0, rotate: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className={cn('w-16 h-16 rounded-full flex items-center justify-center mb-4', 'bg-primary/20')}
                    >
                      <Download className={cn('w-8 h-8', 'text-primary')} />
                    </motion.div>

                    <h3 className={cn('text-xl font-semibold mb-2', 'text-foreground')}>
                      Start Your Free Trial
                    </h3>

                    <p className={cn('text-sm mb-6 max-w-xs', 'text-muted-foreground')}>
                      No credit card required. 14-day free trial. Cancel anytime.
                    </p>

                    <div className="flex flex-col gap-2 w-full">
                      <Button 
                        size="lg" 
                        className={cn('h-12 px-6 text-base', 'bg-primary hover:bg-primary/90', 'text-primary-foreground')}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download Free
                      </Button>

                      <p className={cn('text-xs text-center', 'text-muted-foreground')}>
