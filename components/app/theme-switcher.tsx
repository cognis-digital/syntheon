'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

export interface ThemeSwitcherProps {
  className?: string;
}

const ANIMATION_VARIANTS = {
  idle: { rotate: 0 },
  active: { rotate: 180 },
};

const TRANSITION = {
  duration: 0.3,
  ease: 'easeInOut',
};

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(() => 
    typeof window !== 'undefined' ? 
      localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && 
       window.matchMedia('(prefers-color-scheme: dark)').matches) :
      false
  );

  const isReducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    if (mounted) {
      document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  }, [isDark, mounted]);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className={cn(
        'fixed top-4 right-4 z-50',
        isReducedMotion ? '' : 'cursor-pointer select-none touch-manipulation',
        className
      )}
      onClick={!isReducedMotion && !mounted ? toggleTheme : undefined}
    >
      <Button
        variant="outline"
        size="icon"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        role="switch"
        aria-checked={isDark}
        className={cn(
          'h-10 w-10 rounded-full border-border bg-background',
          isReducedMotion 
            ? '' 
            : 'hover:bg-muted/80 active:scale-95 focus-visible:ring-2 focus-visible:ring-ring'
        )}
      >
        <motion.div
          className="relative flex h-full w-full items-center justify-center"
          initial={ANIMATION_VARIANTS.idle}
          animate={isDark ? ANIMATION_VARIANTS.active : ANIMATION_VARIANTS.idle}
          transition={{ ...TRANSITION, duration: 0.4 }}
        >
          <Sun 
            className={cn(
              'absolute h-5 w-5',
              isDark ? 'text-primary-foreground' : 'text-foreground'
            )} 
            aria-hidden="true"
          />
          <Moon 
            className={cn(
              'absolute h-5 w-5',
              isDark ? 'text-background' : 'text-foreground'
            )} 
            aria-hidden="true"
          />
        </motion.div>
      </Button>
    </motion.div>
  );
}

export default ThemeSwitcher;
