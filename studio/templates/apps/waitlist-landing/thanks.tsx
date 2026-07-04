'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ThanksProps {
  className?: string;
  emailInputValue?: string;
  onResendEmail?: () => void;
}

const violetGlow = {
  top: 'rgba(139, 92, 246, 0.15)',
  bottom: 'rgba(79, 70, 229, 0.1)',
};

export interface ThanksPropsInterface extends ThanksProps {}

const titleVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, delay: 0.2 }
  },
};

const floatVariants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export default function Thanks({ className, emailInputValue = '', onResendEmail }: ThanksProps) {
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  return (
    <motion.div 
      className={cn(
        'relative min-h-screen flex items-center justify-center overflow-hidden',
        'bg-background text-foreground',
        className
      )}
      style={{
        background: `radial-gradient(120% 120% at 50% 0%, ${violetGlow.top}, 
                          radial-gradient(at 80% 20%, rgba(79, 70, 229, 0.1), transparent),
                          radial-gradient(at 0% 100%, rgba(139, 92, 246, 0.15), transparent))`,
      }}
    >
      {/* Animated background orbs */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        variants={floatVariants}
        animate="animate"
      >
        <motion.div
          className="absolute top-1/4 -left-32 w-64 h-64 bg-violet-500/20 rounded-full blur-[100px]"
          style={{ opacity: 0.5 }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px]"
          style={{ opacity: 0.5 }}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={emailInputValue}
          className="relative z-10 max-w-md mx-4"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <Card className="backdrop-blur-xl bg-background/80 border-border shadow-2xl">
            <motion.div 
              className="absolute inset-0 pointer-events-none rounded-lg"
              style={{ background: 'linear-gradient(135deg, transparent 40%, rgba(79, 70, 229, 0.1) 100%)' }}
            />

            <CardHeader className="pb-6">
              <motion.div 
                variants={titleVariants}
                initial="hidden"
                animate="visible"
                className="text-center mb-4"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Badge variant="secondary" className="rounded-full px-4 py-1.5 bg-violet-500/10 text-violet-600 border-violet-500/20">
                    <span className="animate-pulse">✓</span> Confirmed
                  </Badge>
                </div>
                
                <CardTitle className={cn(
                  'text-3xl font-semibold tracking-tight',
                  'bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-400 bg-clip-text text-transparent'
                )}>
                  You're on the list!
                </CardTitle>

                <CardDescription className={cn(
                  'text-lg mt-2',
                  'bg-gradient-to-r from-violet-300/80 to-purple-300/60 bg-clip-text text-transparent'
                )}>
                  We've sent a confirmation email. Keep an eye on your inbox.
                </CardDescription>
              </motion.div>

              <motion.p 
                variants={subtitleVariants}
                initial="hidden"
                animate="visible"
                className="text-center text-muted-foreground mb-6 leading-relaxed"
              >
                You're in the top tier of our waitlist. We'll notify you when we launch and give you early access.
              </motion.p>

              <motion.div 
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-3"
              >
                {emailInputValue ? (
                  <>
                    <Button 
                      variant="secondary" 
                      onClick={onResendEmail}
                      className="w-full py-6 bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30 text-violet-700 font-medium transition-all duration-300"
                    >
                      <motion.span 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-7-7z"/>
                        </svg>
                        Resend confirmation
                      </motion.span>
                    </Button>

                    <Button 
                      variant="ghost" 
                      className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      Edit email address
                    </Button>
                  </>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center text-sm text-muted-foreground py-2"
                  >
                    Check your inbox for the next steps...
                  </motion.div>
                )}
              </motion.div>

              <motion.p 
                variants={subtitleVariants}
                initial="hidden"
                animate="visible"
                className="text-center text-xs text-muted-foreground/60 mt-4"
              >
                Didn't receive the email?{' '}
                <a href="#" className="underline hover:text-primary transition-colors">
                  Contact support
                </a>
              </motion.p>
            </CardHeader>

            {/* Decorative bottom border */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-violet-500/40 to-transparent"
              style={{ opacity: 0.6 }}
            />
          </Card>

          {/* Floating decorative elements */}
          <motion.div 
            className="absolute -top-8 -right-8 w-12 h-12 bg-violet-500/10 rounded-full blur-xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div 
            className="absolute -bottom-8 -left-8 w-16 h-16 bg-purple-500/10 rounded-full blur-xl"
            animate={{ rotate: -360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Scroll-triggered parallax overlay */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-50"
        style={{ y: y1, opacity: opacity1 }}
      >
        <div className="absolute top-8 left-8 right-8 h-[30vh] bg-gradient-to-b from-background/40 to-transparent backdrop-blur-sm rounded-t-2xl border-t border-border/50" />
      </motion.div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-4 left-0 right-0 text-center"
      >
        <p className={cn(
          'text-xs',
          'bg-gradient-to-r from-violet-500/30 to-purple-500/30 bg-clip-text text-transparent'
        )}>
          © {new Date().getFullYear()} Syntheon. All rights reserved.
        </p>
      </motion.footer>
    </motion.div>
  );
}
