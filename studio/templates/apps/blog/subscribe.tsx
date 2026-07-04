'use client';

import { useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ArrowRight, Sparkles, Mail, Lock, Zap, ShieldCheck } from 'lucide-react';

interface SubscribeProps {
  variant?: 'default' | 'premium' | 'minimal';
  showFeatures?: boolean;
}

const variants = {
  default: {
    bg: 'bg-background',
    cardBg: 'bg-card/50 dark:bg-card/80',
    border: 'border-border',
    text: 'text-foreground',
    primaryText: 'text-primary',
    accent: 'accent-violet-400',
  },
  premium: {
    bg: 'bg-background',
    cardBg: 'bg-card dark:bg-card/90',
    border: 'border-border',
    text: 'text-foreground',
    primaryText: 'text-primary',
    accent: 'accent-violet-500',
  },
  minimal: {
    bg: 'bg-background',
    cardBg: 'bg-card/40 dark:bg-card/70',
    border: 'border-border',
    text: 'text-foreground',
    primaryText: 'text-primary',
    accent: 'accent-violet-300',
  },
};

const featureItems = [
  { icon: Zap, label: 'Instant Access' },
  { icon: Lock, label: 'Secure Login' },
  { icon: ShieldCheck, label: 'Premium Support' },
];

export interface SubscribeComponentProps extends SubscribeProps {}

export const SubscribeComponent: React.FC<SubscribeComponentProps> = ({
  variant = 'default',
  showFeatures = true,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollProgress = useScroll({
    scope: { left: 0, right: containerRef.current?.offsetWidth || 640 },
  });
  const progress = useTransform(scrollProgress.scrollX, [0, 1], [0, 1]);

  const isInView = useInView(containerRef, { margin: '20px', once: true });

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'relative min-h-[640px] flex items-center justify-center p-8 overflow-hidden',
        variants[variant].bg,
        variants[variant].text,
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, transparent 40%, rgba(139, 92, 246, 0.1) 50%, transparent 60%)`,
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-violet-400/20"
          initial={{
            x: Math.random() * 640 - 320,
            y: Math.random() * 640 - 320,
            scale: 0.5 + Math.random() * 1.5,
          }}
          animate={{
            y: [null, null, (Math.random() - 0.5) * 80],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Main content */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ y: -50, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: -20, opacity: 0.95 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Card className={cn('backdrop-blur-xl border-0 shadow-2xl', variants[variant].cardBg)}>
          <CardContent className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0.95 }}
                transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
              >
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400/30 to-violet-500/30 flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-violet-400" />
                </div>
              </motion.div>

              <h1 className={cn('text-2xl md:text-3xl font-bold mb-3', variants[variant].primaryText)}>
                Unlock Premium Access
              </h1>

              <p className="text-muted-foreground/80">
                Join thousands of readers who get exclusive content, early access, and more.
              </p>
            </div>

            {/* Form */}
            <motion.form
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 10, opacity: 0.95 }}
              transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
              onSubmit={(e) => {
                e.preventDefault();
                setIsSubmitting(true);
                setTimeout(() => {
                  setSubmitted(true);
                  setIsSubmitting(false);
                }, 1500);
              }}
            >
              <div className="space-y-4">
                <div className="relative group">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting || submitted}
                    className={cn(
                      'h-14 px-4 bg-background/50 border-border focus:border-violet-500/50',
                      variants[variant].border,
                    )}
                  />
                  <AnimatePresence>
                    {submitted && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {submitted ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-muted-foreground/80"
                  >
                    Welcome aboard! Check your inbox for confirmation.
                  </motion.p>
                ) : (
                  <>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !email}
                      className={cn(
                        'h-14 w-full font-semibold bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700',
                        isSubmitting && 'opacity-80 cursor-not-allowed',
                      )}
                    >
                      {isSubmitting ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <ArrowRight className="w-5 h-5 mr-2" />
                          Processing...
                        </motion.span>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2 text-violet-100" />
                          Get Started Free
                        </>
                      )}
                    </Button>

                    {/* Features preview */}
                    {showFeatures && !submitted && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.9, y: 8 }}
                        transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
                        className="grid grid-cols-3 gap-3 pt-6"
                      >
                        {featureItems.map((item) => (
                          <motion.div
                            key={item.label}
                            whileHover={{ scale: 1.05 }}
                            className="flex flex-col items-center text-center p-3 rounded-lg bg-background/40 border-border hover:border-violet-400/50 transition-colors"
                          >
                            <item.icon className="w-6 h-6 mb-2 text-violet-400" />
                            <span className="text-xs text-muted-foreground">{item.label}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </motion.form>

            {/* Trust indicators */}
            {!submitted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0.85 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="flex items-center justify-center gap-2 pt-6 text-xs text-muted-foreground/70"
              >
                <ShieldCheck className="w-3 h-3 text-violet-400" />
                <span>Encrypted & secure</span>
                <Badge variant="outline" className="ml-1">
                  256-bit SSL
                </Badge>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Decorative elements */}
        <motion.div
          className={cn(
            'absolute -bottom-8 left-0 right-0 h-24 bg-gradient-to-t from-background/50 to-transparent',
            variants[variant].bg,
          )}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
        />

        <motion.div
          className={cn(
            'absolute -top-8 left-0 right-0 h-24 bg-gradient-to-b from-background/50 to-transparent',
            variants[variant].bg,
          )}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
        />
      </motion.div>

      {/* Side accent */}
      <motion.div
        className="absolute left-4 top-1/2 -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-violet-500/50 to-transparent"
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : { scaleY: 0.8 }}
        transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
      />

      <motion.div
        className="absolute right-4 top-1/2 -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-violet-500/50 to-transparent"
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : { scaleY: 0.8 }}
        transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
      />
    </motion.div>
  );
};

export default SubscribeComponent;
