'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface HeroWaitlistProps {
  title?: string;
  subtitle?: string;
  emailInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  buttonLabel?: string;
  showCounter?: boolean;
  count?: number;
  variant?: 'default' | 'minimal' | 'bold';
}

export interface HeroWaitlistPropsInterface extends HeroWaitlistProps {
  title: string;
  subtitle: string;
}

export default function HeroWaitlist({
  title = "Join the Waitlist",
  subtitle = "Be among the first to experience Syntheon",
  emailInputProps,
  buttonLabel = "Get Early Access",
  showCounter = false,
  count = 1247,
  variant = 'default',
}: HeroWaitlistProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef.current,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.5], [1, 0.7]);
  const scale1 = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, var(--bg-background) 0%, var(--bg-muted) 100%)",
      }}
    >
      <AnimatePresence>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 rounded-full bg-primary/5 blur-[120px]"
            initial={{ 
              x: Math.random() * 800 - 400,
              y: Math.random() * 800 - 400,
              scale: 0.3 + Math.random() * 0.7,
              opacity: 0,
            }}
            animate={{ 
              x: [Math.random() * 800 - 400, Math.random() * 800 - 200],
              y: [Math.random() * 800 - 400, Math.random() * 800 - 200],
              scale: [0.3 + Math.random() * 0.7, 1, 0.5 + Math.random()],
              opacity: [0, 0.15, 0.1],
            }}
            transition={{ 
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </AnimatePresence>

      <motion.div
        className="relative z-10 container max-w-3xl px-6 py-24"
        initial={{ opacity: 0, y: 40 }}
        animate={{ 
          opacity: opacity1,
          y: y1,
          scale: scale1,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-primary/10 border border-border"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 260, damping: 20 }}
          >
            <span className="text-sm text-primary-foreground font-medium">
              {showCounter ? `${count.toLocaleString()} people waiting` : ''}
            </span>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0, ease: "easeInOut" }}
            >
              <SparkleIcon className="w-4 h-4 text-primary" />
            </motion.div>
          </motion.div>

          <h1 className={cn(
            "text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6",
            variant === 'bold' && "text-6xl md:text-8xl lg:text-9xl",
            variant === 'minimal' && "text-4xl md:text-6xl lg:text-7xl",
          )}>
            <span className="bg-gradient-to-br from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>

          <motion.p
            className={cn(
              "text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto",
              variant === 'bold' && "text-base md:text-lg lg:text-xl",
              variant === 'minimal' && "text-md md:text-lg",
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {subtitle}
          </motion.p>

          <motion.div
            className={cn(
              "mt-8 flex items-center justify-center gap-3",
              variant === 'bold' && "flex-col sm:flex-row",
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Input
              type="email"
              placeholder="Enter your email address"
              className={cn(
                "h-14 px-6 rounded-xl border-border bg-background/80 backdrop-blur-sm shadow-lg",
                variant === 'bold' && "text-lg",
              )}
              {...emailInputProps}
            />

            <Button
              size="lg"
              className={cn(
                "h-14 px-8 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
                variant === 'bold' && "text-lg",
              )}
            >
              {buttonLabel}
              <motion.div
                className="ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRightIcon className="w-5 h-5" />
              </motion.div>
            </Button>
          </motion.div>

          <motion.p
            className={cn(
              "mt-6 text-sm text-muted-foreground",
              variant === 'bold' && "text-xs",
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            By joining, you agree to our Terms of Service and Privacy Policy.
          </motion.p>
        </motion.div>

        <motion.div
          className="relative h-px bg-gradient-to-r from-transparent via-border/50 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
        />

        <motion.div
          className="mt-6 flex justify-center gap-4 text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.1 }}>
            <TwitterIcon className="w-5 h-5" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }}>
            <GitHubIcon className="w-5 h-5" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }}>
            <DiscordIcon className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <CursorGlow />
      </motion.div>

      <motion.div
        className="absolute bottom-6 left-6 right-6 flex justify-center items-center gap-2 text-xs text-muted-foreground"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.4 }}
      >
        <motion.div
          className="w-2 h-2 rounded-full bg-primary"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0, ease: "easeInOut" }}
        />
        <span>Scroll to discover</span>
      </motion.div>
    </motion.div>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3l2.5 5L22 10l-5 2.5L19 20l-2.5-5L12 17l-4.5 2.5L7 20l2.5-7.5L2 10l7.5-2.5z" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14m-7-5l7 7-7 7" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M18.244 2.756c-4.984 0-9.169 2.653-11.353 6.962a10.03 10.03 0 011.526-1.456c.71-.572 1.582-.97 2.526-1.188C9.34 6.104 12.317 6.067 14.91 6.9a10.02 10.02 0 01-1.685 1.39c-.745.56-1.475 1.265-2.02 2.118A9.96 9.96 0 0112.06 12a10.03 10.03 0 01-.66 1.45c.57.82 1.26 1.54 2.06 2.118a9.96 9.96 0 01-1.55 1.39c.69.86 1.54 1.57 2.48 2.118C12.34 20.65 15.5 21.25 18.244 21.25a10.03 10.03 0 01-2.97-.45c3.926-1.954 6.57-5.96 6.57-10.844 0-1.28-.23-2.506-.64-3.636a9.97 9.97 0 012.03 1.1c-.63 2.43-2.26 4.44-4.58 5.56a9.97 9.97 0 01-1.03-1.64c2.14-.96 3.86-2.6 4.94-4.65a10.02 10.02 0 011.1 1.47c-.96 2.8-3.08 4.95-5.86 5.64a10.03 10.03 0 01-.46-2.16z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.316 3.435 9.75 8.265 11.425.615.105.825-.255.825-.57v-1.035C6.87 21.225 6 19.875 6 18.225c0-.84.255-1.515.72-2.025C5.22 15.435 4 13.485 4 11.25c0-2.985 2.025-5.46 4.71-6.375a4.14 4.14 0 011.305-.72c.42-.765 1.08-1.395 1.92-1.395s1.5 0.63 1.92 1.395a4.125 4.125 0 011.305.72c2.685.915 4.71 3.39 4.71 6.375 0 2.235-1.225 4.185-3.285 5.925.765.48 1.395 1.365 1.395 2.775v2.025c0 .315.195.675.81.57C20.565 21.75 24 17.31 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19.5 17c-1.8-.6-3.5-.6-5.5 0-1.8-.6-3.5-.6-5.5 0-2 .6-3.7.6-5.5 0-1.8-.6-3.5-.6-5.5 0C1.9 16.4 2 18 2 18s1.6 1.4 4 1.4c2.4 0 4-1.4 4-1.4s1.6 1.4 4 1.4c2.4 0 4-1.4 4-1.4s1.6 1.4 4 1.4c2.4 0 4-1.4 4-1.4s-.1-1.6-3.5-2z" />
    </svg>
  );
}

function CursorGlow() {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center opacity-40"
      initial={{ scale: 1.5, opacity: 0 }}
