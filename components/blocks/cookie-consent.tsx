'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Settings2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface CookieConsentProps {
  title?: string;
  description?: string;
  acceptAllText?: string;
  customSettingsText?: string;
  autoOpenDelay?: number;
}

const defaultTitle = 'Syntheon AI Privacy';
const defaultDescription = `We use cookies and local storage to remember your preferences, track usage for analytics, and personalize your experience with our AI app builder. By continuing, you agree to our Cookie Policy.`;
const defaultAcceptText = 'Accept All';
const defaultSettingsText = 'Customize';

export function CookieConsent({
  title = defaultTitle,
  description = defaultDescription,
  acceptAllText = defaultAcceptText,
  customSettingsText = defaultSettingsText,
  autoOpenDelay = 2000,
}: CookieConsentProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  // Respect reduced motion preference
  const reducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />

            {/* Main card */}
            <motion.div
              initial={reducedMotion ? { y: 100, opacity: 0 } : { y: 120, opacity: 0 }}
              animate={reducedMotion ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
              exit={{ y: 120, opacity: 0 }}
              transition={{ type: reducedMotion ? 'linear' : 'spring', duration: 0.4 }}
              className="relative w-full max-w-lg mx-4 rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-2xl"
            >
              {/* Header with gradient accent */}
              <div 
                className={cn(
                  'h-1.5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600',
                  reducedMotion ? '' : 'animate-pulse'
                )}
              />

              {/* Content */}
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon with subtle animation */}
                  <motion.div
                    initial={{ scale: 0.8, rotate: -10 }}
                    animate={reducedMotion ? { scale: 1, rotate: 0 } : { scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className="flex-shrink-0"
                  >
                    <div 
                      className={cn(
                        'h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-violet-500/20 to-purple-500/20 border',
                        reducedMotion ? '' : 'border-violet-500/30'
                      )}
                    >
                      <ShieldCheck 
                        className={cn(
                          'h-6 w-6 text-violet-400',
                          reducedMotion ? '' : 'animate-[spin_8s_linear_infinite]'
                        )}
                      />
                    </div>
                  </motion.div>

                  {/* Text content */}
                  <div className="flex-1">
                    <h2 className={cn(
                      'text-lg font-semibold text-foreground mb-2',
                      reducedMotion ? '' : 'animate-in fade-in slide-in-from-left-4 duration-300'
                    )}>
                      {title}
                    </h2>

                    <p 
                      className={cn(
                        'text-muted-foreground leading-relaxed',
                        reducedMotion ? '' : 'animate-in fade-in slide-in-from-left-8 duration-500 delay-100'
                      )}
                    >
                      {description}
                    </p>

                    {/* Animated decorative element */}
                    {!reducedMotion && (
                      <motion.div
                        animate={{ 
                          rotate: 360,
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        className="absolute -right-4 -bottom-4 h-8 w-8 opacity-20"
                      >
                        <Sparkles className="h-full w-full text-violet-500 fill-current" />
                      </motion.div>
                    )}
                  </div>

                  {/* Close button */}
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'h-8 w-8 rounded-full hover:bg-muted/50',
                      reducedMotion ? '' : 'hover:rotate-90 transition-transform'
                    )}
                    aria-label="Dismiss cookie consent dialog"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>

                {/* Action buttons */}
                <div 
                  className={cn(
                    'mt-6 flex items-center justify-end gap-3',
                    reducedMotion ? '' : 'animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200'
                  )}
                >
                  {customSettingsText && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'gap-2 border-violet-500/30 text-muted-foreground hover:text-foreground',
                        reducedMotion ? '' : 'hover:scale-105 transition-transform'
                      )}
                    >
                      <Settings2 className="h-4 w-4" />
                      {customSettingsText}
                    </Button>
                  )}

                  <Button 
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-primary-foreground hover:from-violet-700 hover:to-purple-700',
                      reducedMotion ? '' : 'hover:scale-105 transition-transform shadow-lg shadow-violet-500/25'
                    )}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    {acceptAllText}
                  </Button>
                </div>

                {/* Footer info */}
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.2 }}
                  className={cn(
                    'mt-4 text-xs text-muted-foreground flex items-center gap-1',
                    reducedMotion ? '' : 'animate-in fade-in slide-in-from-bottom-2'
                  )}
                >
                  <Badge variant="secondary" className="h-5 px-2 py-0.5">
                    v{typeof window !== 'undefined' 
                      ? (window.navigator.product === 'ReactNative' ? 1 : 2) 
                      : 2}
                  </Badge>
                  Last updated: {new Date().toLocaleDateString()}
                </motion.p>
              </CardContent>

              {/* Bottom gradient fade */}
              <div className="h-1.5 bg-gradient-to-t from-background to-transparent" />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook for automatic opening with reduced motion awareness
export function useCookieConsent(autoOpen = true, delay = autoOpenDelay) {
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoOpen && !visible) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [autoOpen, visible, delay]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <CookieConsent 
      autoOpenDelay={delay}
      title="Syntheon AI Privacy"
      description="We use cookies and local storage to remember your preferences, track usage for analytics, and personalize your experience with our AI app builder. By continuing, you agree to our Cookie Policy."
    />
  );
}
