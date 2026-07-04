'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MultiStepWizardProps {
  steps: Array<{
    id: string;
    title: string;
    description?: string;
    render: (data: WizardData) => React.ReactNode;
    validate?: (data: WizardData, stepIndex: number) => Record<string, string> | undefined;
  }>;
  initialStep?: number;
  onSubmit: (data: WizardData) => Promise<void> | void;
  onCancel?: () => void;
  className?: string;
}

export interface WizardData {
  [key: string]: unknown;
}

interface StepState {
  data: Record<string, unknown>;
  errors: Record<string, string>;
  touched: boolean;
}

const ANIMATION_CONFIG = {
  duration: 0.35,
  ease: 'easeInOut',
  staggerChildren: 120,
};

export default function MultiStepWizard({
  steps,
  initialStep = 0,
  onSubmit,
  onCancel,
  className,
}: MultiStepWizardProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [data, setData] = useState<WizardData>({});
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const totalSteps = steps.length;

  const updateData = useCallback((key: string, value: unknown) => {
    setData(prev => ({ ...prev, [key]: value }));
  }, []);

  const validateStep = useCallback((): Record<string, string> | undefined => {
    const errors: Record<string, string> = {};
    
    steps[currentStep].validate?.(data, currentStep).forEach((err, field) => {
      if (err) errors[field] = err;
    });

    return Object.keys(errors).length > 0 ? errors : undefined;
  }, [currentStep, data, steps]);

  const handleNext = useCallback(async () => {
    const errors = validateStep();
    if (errors && Object.keys(errors).length > 0) {
      // Auto-scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      setTimeout(() => {
        document.querySelector(`[data-error="${firstErrorField}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      await onSubmit(data as WizardData);
      setCompleted(true);
    }
  }, [currentStep, validateStep, totalSteps, onSubmit, data]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setData({});
    setCompleted(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    await handleNext();
  }, [handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (completed) return;
      
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrev();
          break;
        case 'Enter':
          if (!loading && !completed) {
            handleSubmit();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, loading, completed, handleNext, handlePrev, handleSubmit]);

  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: ANIMATION_CONFIG.duration,
        ease: 'easeOut',
        delay: currentStep * 0.1,
      },
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: ANIMATION_CONFIG.duration,
        ease: 'easeInOut',
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: ANIMATION_CONFIG.duration,
        ease: 'easeIn',
      },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={cn(
        'w-full max-w-2xl mx-auto bg-background/95 backdrop-blur-xl rounded-3xl border border-border/60 shadow-2xl',
        'shadow-violet-500/10 dark:shadow-violet-900/20',
        className,
      )}
    >
      {/* Progress Header */}
      <div className="px-8 py-6 border-b border-border/40">
        <div className="flex items-center justify-between mb-4">
          <h2 className={cn(
            'text-xl font-semibold tracking-tight',
            'text-primary dark:text-primary-foreground',
          )}>
            {steps[currentStep]?.title}
          </h2>
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-3">
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <div className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
                  currentStep === totalSteps - 1 
                    ? 'bg-primary/10 text-primary dark:text-primary-foreground' 
                    : 'bg-muted/60 text-muted-foreground border border-border/40',
                )}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Step {currentStep + 1} of {totalSteps}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </h2>

        {/* Progress Bar */}
        <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: `${((currentStep + 1) / totalSteps) * 100}%`,
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className={cn(
              'absolute inset-y-0 left-0 rounded-full',
              'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500',
              'shadow-lg shadow-violet-500/40',
            )}
          />
        </div>

        {/* Step Dots */}
        <div className="flex justify-between mt-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0.5, scale: 0.8 }}
              animate={{ 
                opacity: index <= currentStep ? 1 : 0.5,
                scale: index === currentStep ? 1.2 : 0.8,
              }}
              transition={{ duration: 0.3 }}
              className={cn(
                'w-2 h-2 rounded-full border-2',
                index <= currentStep 
                  ? 'bg-primary border-transparent' 
                  : 'bg-muted/50 border-border/40',
              )}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-8">
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentStep}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ 
              ...ANIMATION_CONFIG,
              staggerChildren: 50,
            }}
            className="h-full flex flex-col gap-6"
          >
            <motion.div
              variants={stepVariants.enter}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: ANIMATION_CONFIG.duration / 2 }}
            >
              {steps[currentStep].render(data)}
            </motion.div>

            {/* Error Summary */}
            <AnimatePresence>
              {(validateStep() || data).some((_, i) => 
                steps[currentStep]?.validate?.(data, currentStep)?.[Object.keys(steps[currentStep]?.validate?.(data, currentStep)!)[0]]
              )) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-destructive/10 border border-destructive/30 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-destructive mb-1">Please fix the following errors:</p>
                      <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                        {validateStep()?.map((err, i) => (
                          <li key={i} data-error={Object.keys(validateStep()!)[i]}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="mt-8 pt-6 border-t border-border/40 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0 || loading}
            className={cn(
              'flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all',
              'hover:bg-muted/60 active:scale-[0.98]',
              currentStep === 0 || loading 
                ? 'text-muted-foreground cursor-not-allowed' 
                : 'text-primary dark:text-primary-foreground hover:bg-violet-500/10 border border-border/40',
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-3">
            {currentStep === totalSteps - 1 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading || completed}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold',
                  'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600',
                  'text-primary-foreground shadow-lg shadow-violet-500/40',
                  'hover:shadow-xl hover:shadow-violet-500/50 active:scale-[0.98]',
                  'transition-all duration-200',
                  loading || completed ? 'opacity-70 cursor-not-allowed' : '',
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : completed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete!</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    <span>Finish</span>
                  </>
                )}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold",
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}

            {onCancel && (
              <button
                onClick={handleReset}
                disabled={loading || completed}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-muted-foreground hover:text-primary dark:hover:text-primary-foreground transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="px-8 py-4 border-t border-border/40 bg-muted/30"
      >
        <p className={cn(
          'text-xs text-center',
          'text-muted-foreground dark:text-muted-foreground/60',
        )}>
          {currentStep === 0 
            ? `Welcome. This will take about ${(totalSteps * 45) / 60} minute.`
            : currentStep === totalSteps - 1
              ? 'Review your information before submitting.'
              : '',
        )}
      </motion.div>
    </motion.div>
  );
}

// Preset step templates for quick implementation
export const WizardStepTemplates = {
  // Text input with validation
  textInput: (props: {
    label: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password';
    required?: boolean;
    helperText?: string;
  }) => {
    const [value, setValue] = useState('');

    return (
      <div className="space-y-2">
        <label htmlFor={props.label} className="text-sm font-medium text-primary dark:text-primary-foreground">
          {props.label}
          {props.required && <span className="ml-1">*</span>}
        </label>
        
        <input
          id={props.label}
          type={props.type || 'text'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={props.placeholder}
          required={props.required}
          className={cn(
            'w-full px-4 py-3 rounded-xl border bg-background/50',
            'border-border focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20',
            'transition-all duration-200 outline-none',
          )}
        />

        {props.helperText && (
          <p className="text-xs text-muted-foreground">{props.helperText}</p>
        )}
      </div>
    );
  },

  // Select dropdown
  select: (props: {
    label: string;
    options: Array<{ value: string; label: string }>;
    required?: boolean;
  }) => {
    const [value, setValue] = useState('');

    return (
      <div className="space-y-2">
        <label htmlFor={props.label} className="text-sm font-medium text-primary dark:text-primary-foreground">
          {props.label}
          {props.required && <span className="ml-1">*</span>}
        </label>

        <select
          id={props.label}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required={props.required}
          className={cn(
            'w-full px-4 py-3 rounded-xl border bg-background/50',
            'border-border focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20',
            'transition-all duration-200 outline-none appearance-none cursor-pointer',
          )}
        >
          <option value="">Select an option</option>
          {props.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  },

  // Checkbox with label
  checkbox: (props: {
    label: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    required?: boolean;
  }) => {
    const [checked, setChecked] = useState(props.checked || false);

    return (
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id={props.label}
          checked={checked}
          onChange={(e) => props.onChange?.(e.target.checked)}
          required={props.required}
          className="w-5 h-5 rounded border-2 border-border/40 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 cursor-pointer"
        />
        <label htmlFor={props.label} className="text-sm text-primary dark:text-primary-foreground">
          {props.label}
          {props.required && <span className="ml-1">*</span>}
        </label>
      </div>
    );
  },

  // File upload with drag-drop
  fileUpload: (props: {
    label?: string;
    accept?: string;
    multiple?: boolean;
  }) => {
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-primary dark:text-primary-foreground">
          {props.label || 'Upload File'}
        </label>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files[0]) {
              setFile(e.dataTransfer.files[0]);
            }
          }}
          className={cn(
            'relative w-full h-32 border-2 border-dashed rounded-xl',
            dragActive 
              ? 'border-violet-500 bg-violet-500/10' 
              : 'border-border/40 hover:border-violet-500/60',
          )}
        >
          <input
            type="file"
            accept={props.accept}
            multiple={props.multiple}
            onChange={(e) => {
              if (e.target.files[0]) {
                setFile(e.target.files[0]);
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className={cn(
            'flex flex-col items-center justify-center gap-2',
            dragActive ? 'text-violet-500' : 'text-muted-foreground',
          )}>
