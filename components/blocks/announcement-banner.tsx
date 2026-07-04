'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Zap, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { cva, type VariantProps } from 'class-variance-authority';

const bannerVariants = {
  hidden: {
    opacity: 0,
    y: -12,
    scale: 0.98,
    rotateX: -5,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.4,
      ease: [0.23, 1, 0.32, 1],
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.97,
    transition: { duration: 0.2 },
  },
};

const iconVariants = {
  hidden: { opacity: 0, x: -16, rotateX: -15 },
  visible: {
    opacity: 1,
    x: 0,
    rotateX: 0,
    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
  },
};

interface AnnouncementBannerProps extends VariantProps<typeof bannerVariants> {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  icon?: 'sparkles' | 'zap';
  dismissible?: boolean;
  autoDismiss?: number;
}

export const announcementBannerVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
  },
};

export interface AnnouncementBannerProps extends VariantProps<typeof announcementBannerVariants> {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  icon?: 'sparkles' | 'zap';
  dismissible?: boolean;
  autoDismiss?: number;
}

export const AnnouncementBanner = ({
  title = 'Syntheon AI Builder is now live',
  description = 'Experience the next generation of intelligent app development. Build faster, smarter, and with zero boilerplate.',
  ctaText = 'Get Started Free →',
  ctaUrl = '#',
  icon = 'sparkles',
  dismissible = true,
  autoDismiss = 15000,
}: AnnouncementBannerProps) => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  const IconComponent = icon === 'sparkles' ? Sparkles : Zap;

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={title}
        variants={announcementBannerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed top-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur-xl border-b border-border/40 shadow-sm"
      >
        <div className="flex items-center justify-between px-6 py-3">
          <motion.div
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-2.5"
          >
            <IconComponent className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {title}
            </span>
          </motion.div>

          <div className="flex items-center gap-3 ml-auto">
            {dismissible && (
              <button
                onClick={() => setIsVisible(false)}
                aria-label="Dismiss announcement"
                className={cn(
                  'p-1.5 rounded-full hover:bg-muted/50 transition-colors',
                  buttonVariants({ variant: 'ghost', size: 'icon' })
                )}
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}

            {ctaUrl && (
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                  buttonVariants({ variant: 'ghost', size: 'sm' })
                )}
              >
                <span className="text-sm font-medium text-primary">
                  {ctaText}
                </span>
                <ChevronRight className="w-3 h-3" />
              </a>
            )}

            {autoDismiss && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-muted-foreground ml-2"
              >
                Dismisses in {Math.ceil(autoDismiss / 1000)}s
              </motion.div>
            )}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {description && (
            <motion.div
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              className="px-6 py-3 border-t border-border/40 bg-background/50 backdrop-blur-sm"
            >
              <p className="text-xs text-muted-foreground leading-relaxed">
                {description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence initial={false}>
        {autoDismiss && (
          <motion.div
            key="timer"
            variants={{
              hidden: { opacity: 0, y: -8 },
              visible: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 8 },
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[99]">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-xs text-muted-foreground bg-background/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/40 shadow-lg"
              >
                <span className="inline-block w-2 h-2 mr-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="rounded-full bg-primary"
                  />
                </span>
                Closing in {Math.ceil(autoDismiss / 1000)}s...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default AnnouncementBanner;
