'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Send, X, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FeedbackWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FeedbackData) => Promise<void>;
  progress?: number; // 0-100, for submission progress
  autoOpenDelay?: number; // ms before auto-open
}

export interface FeedbackData {
  rating: number;
  category: string | null;
  text: string;
  tags: string[];
}

const CATEGORIES = [
  'General',
  'Performance',
  'UI/UX',
  'Bugs & Issues',
  'Feature Request',
  'Other',
];

export interface FeedbackWidgetState {
  rating: number;
  text: string;
  category: string | null;
  tags: string[];
  isSubmitting: boolean;
  submitted: boolean;
}

const DEFAULT_STATE: FeedbackWidgetState = {
  rating: 0,
  text: '',
  category: 'General',
  tags: [],
  isSubmitting: false,
  submitted: false,
};

function generateTags(): string[] {
  const adjectives = ['Fast', 'Smooth', 'Clean', 'Responsive', 'Intuitive', 'Powerful'];
  const nouns = ['Design', 'Performance', 'Usability', 'Speed', 'Reliability'];
  return [
    ...new Set(
      Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        return `${adj} ${noun}`;
      })
    ),
  ];
}

function createMockData(): FeedbackData {
  return {
    rating: Math.floor(Math.random() * 5) + 1,
    category: CATEGORIES[Math.floor(Math.random() * (CATEGORIES.length - 1)) + 1],
    text: '',
    tags: generateTags(),
  };
}

export default function FeedbackWidget({
  isOpen = true,
  onClose,
  onSubmit,
  progress = 0,
  autoOpenDelay = 5000,
}: FeedbackWidgetProps) {
  const [state, setState] = useState<FeedbackWidgetState>({ ...DEFAULT_STATE });

  useEffect(() => {
    if (isOpen && !state.submitted) {
      const timer = setTimeout(() => {
        setState((prev) => ({ ...prev, isOpen: true }));
      }, autoOpenDelay);
      return () => clearTimeout(timer);
    } else {
      setState((prev) => ({ ...prev, isOpen: false }));
    }
  }, [isOpen, state.submitted, autoOpenDelay]);

  const handleRatingChange = (rating: number) => {
    setState((prev) => ({ ...prev, rating }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState((prev) => ({ ...prev, text: e.target.value }));
  };

  const handleCategorySelect = (category: string | null) => {
    setState((prev) => ({ ...prev, category }));
  };

  const handleSubmit = async () => {
    if (!state.text.trim() && state.rating === 0) return;

    setState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      await onSubmit({
        rating: state.rating || 3,
        category: state.category || 'General',
        text: state.text,
        tags: generateTags(),
      });
      setState((prev) => ({ ...prev, submitted: true }));
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleClose = () => {
    if (!state.isSubmitting && !state.submitted) {
      onClose();
    } else {
      setState((prev) => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Widget Container */}
          <motion.div
            initial={{ 
              x: '100%',
              opacity: 0,
              rotateY: -20,
            }}
            animate={{ 
              x: 0,
              opacity: 1,
              rotateY: 0,
            }}
            exit={{ 
              x: '100%',
              opacity: 0,
              rotateY: 20,
            }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.4,
            }}
            className="fixed top-6 right-6 w-[min(90vw,420px)] max-w-md z-50"
          >
            <div className={cn('bg-background border border-border rounded-2xl shadow-xl overflow-hidden', 'dark:bg-zinc-900 dark:border-zinc-800')}>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className={cn('w-10 h-10 rounded-full flex items-center justify-center bg-primary/10', 'dark:bg-primary/20')}
                  >
                    <Sparkles className="w-5 h-5 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className={cn('text-lg font-semibold', 'text-foreground dark:text-zinc-100')}>
                      Help Us Improve
                    </h3>
                    <p className={cn('text-sm', 'text-muted-foreground dark:text-zinc-400')}>
                      {state.submitted ? 'Thank you for your feedback!' : 'Share your experience with us'}
                    </p>
                  </div>
                </div>

                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="px-6 py-4">
                {state.submitted ? (
                  /* Success State */
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn('py-8 text-center', 'dark:text-zinc-300')}
                  >
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <h4 className="text-xl font-semibold mb-2">You're all set!</h4>
                    <p className="mb-6">Your feedback has been submitted successfully.</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClose}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Close & Continue
                    </motion.button>
                  </motion.div>
                ) : (
                  /* Active Form */
                  <div className="space-y-5">
                    {/* Rating Section */}
                    <motion.section
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-medium mb-3">
                        How would you rate your experience?
                      </label>
                      <div className={cn('flex gap-2 p-4 rounded-xl border', 'border-border bg-muted/50 dark:bg-zinc-800/50')}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRatingChange(star)}
                            className="relative"
                            aria-label={`Rate ${star} out of 5`}
                          >
                            <Star
                              className={cn(
                                'w-8 h-8 transition-all duration-200',
                                star <= state.rating
                                  ? 'fill-primary text-primary'
                                  : 'text-muted-foreground hover:text-foreground',
                              )}
                            />
                          </motion.button>
                        ))}
                      </div>
                    </motion.section>

                    {/* Category Section */}
                    <motion.section
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <label className="block text-sm font-medium mb-3">
                        What would you like to share?
                      </label>
                      <div className={cn('flex flex-wrap gap-2 p-4 rounded-xl border', 'border-border bg-muted/50 dark:bg-zinc-800/50')}>
                        {CATEGORIES.map((cat) => (
                          <motion.button
                            key={cat}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleCategorySelect(cat)}
                            className={cn(
                              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                              state.category === cat
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-zinc-700/50',
                            )}
                          >
                            {cat}
                          </motion.button>
                        ))}
                      </div>
                    </motion.section>

                    {/* Text Input */}
                    <motion.section
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-medium mb-3">
                        Additional details (optional)
                      </label>
                      <textarea
                        value={state.text}
                        onChange={handleTextChange}
                        placeholder="Tell us more about your experience..."
                        rows={4}
                        disabled={state.isSubmitting || state.submitted}
                        className={cn(
                          'w-full px-4 py-3 rounded-xl border resize-none transition-all focus:outline-none focus:ring-2',
                          'focus:border-primary/50 focus:ring-primary/20',
                          'text-foreground placeholder:text-muted-foreground bg-background dark:bg-zinc-900 dark:border-zinc-700 dark:focus:border-zinc-600',
                        )}
                      />

                      {/* Character counter */}
                      <div className={cn('flex items-center justify-between mt-2 text-xs', 'text-muted-foreground')}>
                        <span>
                          {state.text.length}/500 characters
                        </span>
                        {state.text.length > 400 && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-primary"
                          >
                            Almost there!
                          </motion.span>
                        )}
                      </div>
                    </motion.section>

                    {/* Progress Bar */}
                    {progress > 0 && progress < 100 && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 4 }}
                        className="w-full bg-muted rounded-full overflow-hidden"
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5, ease: 'easeInOut' }}
                          className={cn('h-full bg-primary', 'dark:bg-zinc-600')}
                        />
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={!state.text.trim() && state.rating === 0 || state.isSubmitting}
                      className={cn(
                        'w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2',
                        !state.text.trim() && state.rating === 0
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl',
                      )}
                    >
                      {state.isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          >
                            <Send className="w-5 h-5" />
                          </motion.div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Feedback
                        </>
                      )}
                    </motion.button>

                    {/* Cancel Link */}
                    <div className={cn('text-center text-sm', 'text-muted-foreground')}>
                      <button onClick={handleClose} className="hover:underline">
                        Or close without submitting
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-border flex items-center justify-between text-xs">
                <span className={cn('text-muted-foreground', 'dark:text-zinc-400')}>
                  {state.submitted ? '' : 'Powered by Syntheon'}
                </span>
                <button onClick={handleClose} className="hover:underline">
                  Close
                </button>
              </div>
            </div>
          </motion.div>

          {/* Toast notification */}
          {state.isSubmitting && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-24 right-6 z-[60]"
            >
              <div className={cn('flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg', 'bg-background border border-border dark:bg-zinc-900 dark:border-zinc-800')}>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <AlertCircle className="w-5 h-5 text-primary" />
                </motion.div>
                <span className={cn('text-sm', 'text-muted-foreground dark:text-zinc-300')}>
                  Please wait while we send your feedback...
                </span>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
