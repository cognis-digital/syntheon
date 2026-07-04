'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, HelpCircle, CheckCircle2, Zap, Sparkles, ArrowRight, Minimize2 } from 'lucide-react';

export interface OnboardingTourProps {
  steps: Array<{
    id: string;
    title: string;
    description: string;
    highlightSelector: string | null; // CSS selector to highlight in DOM
    icon?: React.ReactNode;
    duration?: number; // ms before auto-advance
  }>;

  startDelay?: number; // Delay before starting tour (ms)
  autoAdvance?: boolean; // Auto-advance between steps
  showProgress?: boolean; // Show progress indicator
  showCloseButton?: boolean; // Show close button
  overlayBackground?: string; // Background color for overlay
  highlightBorderRadius?: 'none' | 'sm' | 'md' | 'lg';
  highlightShadow?: string;
  highlightGlowColor?: string;
  onClose: () => void;
  onStepChange?: (stepIndex: number) => void;
}

export interface OnboardingTourState {
  isOpen: boolean;
  currentStep: number;
  totalSteps: number;
  isComplete: boolean;
  userSkipped: boolean;
}

const DEFAULT_HIGHLIGHT_SHADOW = '0 4px 12px rgba(99, 102, 241, 0.3)';
const DEFAULT_GLOW_COLOR = '#8b5cf6'; // violet-500
const DEFAULT_OVERLAY_BG = 'rgba(17, 24, 39, 0.6)';

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  steps,
  startDelay = 1500,
  autoAdvance = true,
  showProgress = true,
  showCloseButton = true,
  overlayBackground = DEFAULT_OVERLAY_BG,
  highlightBorderRadius = 'lg',
  highlightShadow = DEFAULT_HIGHLIGHT_SHADOW,
  highlightGlowColor = DEFAULT_GLOW_COLOR,
  onClose,
  onStepChange,
}) => {
  const [state, setState] = useState<OnboardingTourState>({
    isOpen: false,
    currentStep: -1,
    totalSteps: steps.length,
    isComplete: false,
    userSkipped: false,
  });

  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const tourRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize highlighted element when step changes
  useEffect(() => {
    if (state.currentStep >= 0 && state.currentStep < steps.length) {
      const step = steps[state.currentStep];
      setHighlightedElement(step.highlightSelector || null);
    } else {
      setHighlightedElement(null);
    }

    // Reset timer when step changes
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (autoAdvance && state.currentStep < steps.length - 1) {
      const nextDelay = steps[state.currentStep + 1]?.duration || 3000;
      timerRef.current = setTimeout(() => {
        setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
        onStepChange?.(state.currentStep + 1);
      }, nextDelay);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state.currentStep, steps, autoAdvance, onStepChange]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!state.isOpen || state.isComplete) return;

      switch (e.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.isOpen, state.isComplete]);

  // Handle click outside to close
  const handleClickOutside = (e: React.MouseEvent) => {
    if (!state.isOpen || !tourRef.current) return;

    if (tourRef.current.contains(e.target as Node)) {
      return;
    }

    handleClose();
  };

  const handleNext = useCallback(() => {
    if (state.currentStep < steps.length - 1) {
      setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
      onStepChange?.(state.currentStep + 1);
    } else {
      handleClose();
    }
  }, [state.currentStep, steps.length, onStepChange]);

  const handlePrev = useCallback(() => {
    if (state.currentStep > 0) {
      setState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));
      onStepChange?.(state.currentStep - 1);
    }
  }, [state.currentStep, onStepChange]);

  const handleClose = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState((prev) => ({ ...prev, isOpen: false, isComplete: true }));
    onClose();
  }, [onClose]);

  const handleSkip = () => {
    setState((prev) => ({ ...prev, userSkipped: true, isComplete: true }));
    handleClose();
  };

  const handleStepClick = (index: number) => {
    if (!state.isOpen || state.isComplete) return;
    setState((prev) => ({ ...prev, currentStep: index }));
    onStepChange?.(index);
  };

  // Calculate progress for circular indicator
  const getProgressPercentage = () => {
    if (state.totalSteps === 0) return 0;
    return ((state.currentStep + 1) / state.totalSteps) * 100;
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { 
      opacity: 1, 
      backdropFilter: 'blur(8px)',
      transition: { duration: 0.2 }
    },
    exit: { opacity: 0, backdropFilter: 'blur(0px)' }
  };

  const highlightVariants = {
    hidden: { scale: 1, opacity: 0 },
    visible: (custom: number) => ({
      scale: 1 + custom * 0.05,
      opacity: 1,
      transition: { 
        duration: 0.3,
        ease: 'easeOut',
        delay: custom * 0.1
      }
    }),
    exit: { scale: 1, opacity: 0, transition: { duration: 0.2 } }
  };

  const tooltipVariants = {
    hidden: { 
      y: -12,
      opacity: 0,
      x: '-50%',
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    },
    visible: {
      y: 0,
      opacity: 1,
      x: '-50%',
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 24,
        delay: 0.1
      }
    },
    exit: { y: -12, opacity: 0, transition: { duration: 0.15 } }
  };

  // Determine highlight element position for tooltip
  const getHighlightPosition = () => {
    if (!highlightedElement || !document.body) return null;

    try {
      const el = document.querySelector(highlightedElement);
      if (!el) return null;

      const rect = el.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate position relative to viewport center
      const centerX = viewportWidth / 2;
      const centerY = viewportHeight / 2;

      // Determine which side of the screen is closer for tooltip placement
      const leftDist = rect.left - 40;
      const rightDist = viewportWidth - (rect.right + 40);
      
      if (leftDist < rightDist) {
        return { x: 32, y: centerY }; // Left side
      } else {
        return { x: viewportWidth - 64, y: centerY }; // Right side
      }
    } catch {
      return null;
    }
  };

  const position = getHighlightPosition();

  if (!state.isOpen || state.isComplete) {
    return null;
  }

  const progressPercentage = getProgressPercentage();

  return (
    <AnimatePresence>
      <motion.div
        ref={tourRef}
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ 
          background: overlayBackground,
          backdropFilter: 'blur(8px)',
          cursor: state.userSkipped ? 'default' : 'pointer',
        }}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={handleClickOutside}
      >
        {/* Progress Ring */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ 
            background: 'conic-gradient(
              var(--color-primary, #8b5cf6) 0% calc(var(--progress, 0%) + 2%),
              rgba(17, 24, 39, 0.6) calc(var(--progress, 0%) + 2%) 100%
            )',
          }}
        >
          <div className="absolute inset-0 rounded-full bg-background/80" />
        </motion.div>

        {/* Main Tour Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -24 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative max-w-md mx-4 bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/20 overflow-hidden"
        >
          {/* Header with progress */}
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {steps[state.currentStep]?.icon && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 24 }}
                  className="p-2 rounded-xl bg-primary/10"
                >
                  {steps[state.currentStep].icon}
                </motion.div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {steps[state.currentStep]?.title || 'Welcome'}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Step {state.currentStep + 1} of {state.totalSteps}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Progress dots */}
              {showProgress && (
                <div className="flex gap-1.5">
                  {Array.from({ length: Math.min(3, state.totalSteps) }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.8 }}
                      animate={{ 
                        scale: i === state.currentStep ? 1 : 0.8,
                        opacity: i <= state.currentStep ? 1 : 0.4,
                      }}
                      transition={{ duration: 0.2 }}
                      className="w-2 h-2 rounded-full bg-border"
                      style={{
                        background: i === state.currentStep 
                          ? 'var(--color-primary, #8b5cf6)' 
                          : i < state.currentStep 
                            ? '#8b5cf6' 
                            : undefined,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Close button */}
              {showCloseButton && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="p-2 rounded-xl hover:bg-muted/50 transition-colors"
                  aria-label="Close tour"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              )}

              {/* Next button */}
              {state.currentStep < steps.length - 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>Next</span>
                </motion.button>
              )}

              {/* Skip button */}
              {state.currentStep === steps.length - 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSkip}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finish</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={state.currentStep}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <p className="text-foreground/80 leading-relaxed">
                  {steps[state.currentStep]?.description || 
                   `Discover what makes Syntheon different.`}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Quick actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/20">
              <button
                onClick={handlePrev}
                disabled={state.currentStep === 0}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                  state.currentStep === 0 
                    ? 'text-muted-foreground opacity-50' 
                    : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              {/* Step navigator dots */}
              {state.totalSteps <= 6 && (
                <div className="flex gap-1.5">
                  {Array.from({ length: Math.min(3, state.totalSteps) }).map((_, i) => (
                    <motion.button
                      key={i}
                      initial={{ scale: 0.8 }}
                      animate={{ 
                        scale: i <= state.currentStep ? 1 : 0.8,
                        opacity: i <= state.currentStep ? 1 : 0.4,
                      }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleStepClick(i)}
                      className="w-2 h-2 rounded-full bg-border hover:bg-primary/50 transition-colors"
                    />
                  ))}
                </div>
              )}

              <button
                onClick={handleNext}
                disabled={!state.currentStep || state.currentStep >= steps.length - 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                  !state.currentStep || state.currentStep >= steps.length - 1
                    ? 'text-muted-foreground opacity-50'
                    : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Highlight overlay */}
          {highlightedElement && position && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1.2,
                  x: position.x - 32,
                  y: position.y - 64,
                }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                className="absolute pointer-events-none"
                style={{ 
                  width: 64,
                  height: 64,
                  borderRadius: highlightBorderRadius === 'none' ? '0' : undefined,
                  boxShadow: highlightShadow,
                  border: `3px solid ${highlightGlowColor}`,
                  background: 'rgba(17, 24, 39, 0.8)',
                }}
              >
                {/* Pulsing glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ 
                    background: `radial-gradient(circle at center, ${highlightGlowColor}, transparent)`,
                  }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Arrow indicator */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px]"
                  style={{ 
                    borderColorLeft: 'transparent',
                    borderColorRight: 'transparent',
                    borderColorTop: highlightGlowColor,
                  }}
                />

                {/* Tooltip */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={tooltipVariants}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-background shadow-lg border border-border/20 min-w-[160px]"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground truncate max-w-[180px]">
                      {steps[state.currentStep]?.title || 'Feature highlight'}
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Secondary glow layer for depth */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute pointer-events-none"
                style={{ 
                  width: 160,
                  height: 160,
                  borderRadius: '50%',
                  background: `radial-gradient(circle at center, ${highlightGlowColor}33, transparent)`,
                  filter: 'blur(24px)',
                }}
              />
            </>
          )}

          {/* Close overlay (click outside card to close) */}
          <motion.button
            initial={{ opacity: 0 }}
