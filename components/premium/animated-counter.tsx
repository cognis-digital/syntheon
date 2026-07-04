'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

export interface AnimatedCounterProps {
  /** Starting value - defaults to 0 */
  start?: number | string;
  
  /** Current display value (updates automatically if live) */
  value?: number | string;
  
  /** Whether the counter is interactive with +/- controls */
  interactive?: boolean;
  
  /** Minimum/maximum values for interactive mode */
  min?: number;
  max?: number;
  
  /** Step increment/decrement amount (default: 1) */
  step?: number;
  
  /** Display format - 'number', 'currency', 'percent', or custom formatter */
  format?: 'number' | 'currency' | 'percent' | ((n: number) => string);
  
  /** Currency code for currency formatting (default: USD) */
  currencyCode?: string;
  
  /** Prefix text to display before the value */
  prefix?: React.ReactNode;
  
  /** Suffix text to display after the value */
  suffix?: React.ReactNode;
  
  /** Animation duration in milliseconds - tasteful defaults apply */
  animateDuration?: number;
  
  /** Whether to show +/- controls (interactive mode) */
  showControls?: boolean;
  
  /** Custom control button styles */
  controlStyle?: 'minimal' | 'filled' | 'outline';
}

interface AnimatedCounterRef {
  increment: () => void;
  decrement: () => void;
  set: (value: number | string) => void;
  reset: () => void;
}

export const AnimatedCounter = forwardRef<AnimatedCounterRef, AnimatedCounterProps>(
  (
    props,
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState<number | string>(0);
    const [isLive, setIsLive] = useState(false);
    
    const {
      start = 0,
      value: externalValue,
      interactive = false,
      min = -Infinity,
      max = Infinity,
      step = 1,
      format = 'number',
      currencyCode = 'USD',
      prefix,
      suffix,
      animateDuration = 300,
      showControls = true,
      controlStyle = 'minimal',
    } = props;

    const isReducedMotion = useReducedMotion();
    const displayRef = useRef<HTMLDivElement>(null);
    
    // Initialize with start value or external value if provided
    useEffect(() => {
      let finalValue: number | string = start;
      
      if (externalValue !== undefined) {
        finalValue = externalValue;
      } else if (typeof start === 'string') {
        finalValue = parseFloat(start);
        if (isNaN(finalValue)) {
          finalValue = 0;
        }
      }
      
      setDisplayValue(finalValue);
    }, [start, externalValue]);

    // Update when external value changes in live mode
    useEffect(() => {
      if (externalValue !== undefined) {
        let parsed: number | string = externalValue;
        
        if (typeof externalValue === 'string') {
          const num = parseFloat(externalValue);
          parsed = isNaN(num) ? 0 : num;
        }
        
        setDisplayValue(parsed);
      }
    }, [externalValue]);

    // Format the display value
    const formatValue = useCallback((val: number | string): string => {
      if (typeof val === 'string') return val;
      
      if (format === 'currency') {
        try {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
          }).format(val);
        } catch {
          return `$${val.toFixed(2)}`;
        }
      }
      
      if (format === 'percent') {
        return `${(val * 100).toFixed(1)}%`;
      }
      
      // Default: number formatting with locale-aware decimals
      try {
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        }).format(val);
      } catch {
        return val.toString();
      }
    }, [format, currencyCode]);

    // Animation variants for smooth transitions
    const containerVariants = {
      hidden: { opacity: 0, y: 12 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.4, ease: 'easeOut' }
      },
    };

    const digitVariants = {
      hidden: { 
        opacity: 0, 
        scale: 0.8,
        rotateX: -15,
        filter: 'blur(4px)'
      },
      visible: { 
        opacity: 1, 
        scale: 1,
        rotateX: 0,
        filter: 'blur(0)',
        transition: { duration: 0.3, ease: 'easeOut' }
      },
    };

    // Create staggered digit animation
    const createDigitAnimation = (digitIndex: number) => ({
      ...digitVariants,
      transition: {
        delay: digitIndex * 0.05,
        duration: isReducedMotion ? 0.1 : 0.3,
        ease: 'easeOut',
      },
    });

    // Split number into digits for animation effect
    const getDigits = (val: string): string[] => {
      if (!/^-?\d+(\.\d+)?$/.test(val)) return [val];
      
      const parts = val.split('.');
      const integerPart = Math.abs(parseInt(parts[0]));
      const decimalStr = parts.length > 1 ? '.' + parts.slice(1).join('') : '';
      
      if (integerPart === 0) {
        return ['0'] + (decimalStr || '');
      }
      
      const digits = [...String(integerPart).split('').map((_, i) => i)];
      if (decimalStr) {
        digits.push(decimalStr);
      }
      
      return digits;
    };

    // Handle interactive controls
    const handleIncrement = useCallback(() => {
      let next: number = typeof displayValue === 'number' 
        ? Math.min(max, displayValue + step) 
        : parseFloat((parseFloat(displayValue as string) + step).toFixed(6));
      
      setDisplayValue(next);
    }, [displayValue, max, step]);

    const handleDecrement = useCallback(() => {
      let next: number = typeof displayValue === 'number'
        ? Math.max(min, displayValue - step)
        : parseFloat((parseFloat(displayValue as string) - step).toFixed(6));
      
      setDisplayValue(next);
    }, [displayValue, min, step]);

    const handleSet = useCallback((newVal: number | string) => {
      let parsed: number = typeof newVal === 'number' ? newVal : parseFloat(newVal as string);
      
      if (isNaN(parsed)) parsed = 0;
      
      setDisplayValue(Math.max(min, Math.min(max, parsed)));
    }, [min, max]);

    const handleReset = useCallback(() => {
      let resetValue: number | string = start;
      
      if (typeof start === 'string') {
        resetValue = parseFloat(start);
        if (isNaN(resetValue)) resetValue = 0;
      }
      
      setDisplayValue(resetValue);
    }, [start]);

    // Expose methods to ref
    useEffect(() => {
      if (ref && typeof ref === 'object') {
        Object.assign(ref, { increment: handleIncrement, decrement: handleDecrement, set: handleSet, reset: handleReset });
      }
    }, [handleIncrement, handleDecrement, handleSet, handleReset]);

    // Build digit animation structure
    const digits = getDigits(formatValue(displayValue));
    
    return (
      <motion.div
        ref={displayRef}
        className="relative inline-flex items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        layout
      >
        {/* Prefix */}
        {prefix && (
          <span className="text-muted-foreground mr-1 whitespace-nowrap">
            {prefix}
          </span>
        )}

        {/* Animated Value Display */}
        <div className="relative flex items-baseline gap-[2px]">
          {digits.map((digit, i) => (
            <motion.span
              key={`${i}-${typeof displayValue === 'number' ? displayValue : digit}`}
              className={cn(
                "inline-block leading-none",
                typeof displayValue === 'string' && !/^\d/.test(digit) 
                  ? "text-muted-foreground" 
                  : "text-foreground"
              )}
              style={{
                fontSize: 'inherit',
                fontWeight: 'inherit',
                fontFamily: 'inherit',
              }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {digit}
            </motion.span>
          ))}

          {/* Suffix */}
          {suffix && (
            <span className="text-muted-foreground ml-1 whitespace-nowrap">
              {suffix}
            </span>
          )}
        </div>

        {/* Interactive Controls */}
        {interactive && showControls && (
          <motion.div
            className={cn(
              "absolute -top-2 -right-2 flex items-center gap-1 p-1 rounded-full bg-background/90 backdrop-blur-sm shadow-lg border border-border",
              controlStyle === 'filled' ? "bg-primary text-primary-foreground" : "",
              controlStyle === 'outline' ? "border-2 border-primary text-primary" : ""
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.button
              onClick={handleDecrement}
              disabled={typeof displayValue === 'number' && displayValue <= min}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background/50 transition-colors disabled:opacity-40"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 4L5 7L8 10V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>

            <span className={cn(
              "text-xs px-2 font-medium",
              controlStyle === 'filled' ? "text-primary-foreground" : "",
              controlStyle === 'outline' ? "text-primary" : ""
            )}>
              {typeof displayValue === 'number' 
                ? (max - min).toFixed(0) || 100
                : ''}
            </span>

            <motion.button
              onClick={handleIncrement}
              disabled={typeof displayValue === 'number' && displayValue >= max}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background/50 transition-colors disabled:opacity-40"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4 8L7 5L4 2V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </motion.div>
        )}

        {/* Live Indicator */}
        {isLive && (
          <motion.span
            className={cn(
              "absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs",
              controlStyle === 'filled' ? "text-primary" : ""
            )}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="inline-flex items-center gap-1">
              <motion.span
                className="w-1 h-1 rounded-full bg-primary"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              Live
            </span>
          </motion.span>
        )}
      </motion.div>
    );
  }
);

AnimatedCounter.displayName = 'AnimatedCounter';

export default AnimatedCounter;
