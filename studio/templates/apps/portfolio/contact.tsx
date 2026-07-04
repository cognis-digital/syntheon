'use client';

import { useState, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export interface ContactFormProps {
  className?: string;
}

interface FieldState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const INITIAL_STATE: FieldState = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

function ContactForm({ className }: ContactFormProps) {
  const [state, setState] = useState<FieldState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const formRef = useRef<HTMLFormElement>(null);
  const subjectId = useId();
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  const handleReset = () => {
    setState(INITIAL_STATE);
    setStatus('idle');
    formRef.current?.reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    
    // Simulate API call with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Random success/failure for demo
    const success = Math.random() > 0.2;
    
    if (success) {
      setStatus('success');
      handleReset();
    } else {
      setStatus('error');
    }

    setIsSubmitting(false);
  };

  return (
    <Card className={cn(
      'w-full max-w-4xl mx-auto overflow-hidden',
      'bg-background/50 backdrop-blur-xl border-border/60',
      'shadow-[0_8px_32px_rgba(139,92,246,0.15)] dark:shadow-[0_8px_32px_rgba(139,92,246,0.25)]',
      className
    )}>
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <CardTitle className="text-3xl font-bold tracking-tight text-primary">
              Get in Touch
            </CardTitle>
            <CardDescription className="mt-2 text-muted-foreground/80">
              Have a project or question? We'd love to hear from you.
            </CardDescription>
          </motion.div>

          <Badge 
            variant={status === 'success' ? 'default' : status === 'error' ? 'destructive' : 'secondary'}
            className="ml-4 h-10 px-4 py-2 text-sm font-medium"
          >
            {status === 'idle' && 'Ready'}
            {status === 'success' && 'Sent!'}
            {status === 'error' && 'Retry'}
          </Badge>
        </div>

        <Separator className="my-6 bg-gradient-to-r from-transparent via-border/40 to-transparent" />
      </CardHeader>

      <CardContent>
        <form 
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6"
          aria-labelledby={subjectId}
        >
          {/* Animated Form Fields */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-4">
              <Label htmlFor={nameId} className="text-sm font-medium text-muted-foreground/80">
                Name
              </Label>
              <Input
                id={nameId}
                name="name"
                placeholder="Your full name"
                value={state.name}
                onChange={(e) => setState(prev => ({ ...prev, name: e.target.value }))}
                className="h-12 bg-background/50 border-border/40 focus:border-primary/60 transition-all duration-300"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor={emailId} className="text-sm font-medium text-muted-foreground/80">
                Email
              </Label>
              <Input
                id={emailId}
                name="email"
                type="email"
                placeholder="you@example.com"
                value={state.email}
                onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
                className="h-12 bg-background/50 border-border/40 focus:border-primary/60 transition-all duration-300"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor={subjectId} className="text-sm font-medium text-muted-foreground/80">
                Subject
              </Label>
              <Input
                id={subjectId}
                name="subject"
                placeholder="Project inquiry, partnership, etc."
                value={state.subject}
                onChange={(e) => setState(prev => ({ ...prev, subject: e.target.value }))}
                className="h-12 bg-background/50 border-border/40 focus:border-primary/60 transition-all duration-300"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="message" className="text-sm font-medium text-muted-foreground/80">
                Message
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell us about your project..."
                value={state.message}
                onChange={(e) => setState(prev => ({ ...prev, message: e.target.value }))}
                className="min-h-[160px] bg-background/50 border-border/40 focus:border-primary/60 transition-all duration-300 resize-none"
                disabled={isSubmitting}
              />
            </div>
          </motion.div>

          {/* Submit Button with Premium Styling */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Button
              type="submit"
              size="lg"
              className={cn(
                'h-14 px-8 text-lg font-semibold',
                'bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/95',
                'border border-primary/20 shadow-[0_4px_20px_rgba(139,92,246,0.3)]',
                'hover:shadow-[0_8px_30px_rgba(139,92,246,0.5)] hover:-translate-y-0.5 transition-all duration-300',
                'active:scale-[0.98] active:shadow-none',
                isSubmitting && 'opacity-75 cursor-not-allowed'
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%' }}
                  />
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Send Message
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    className="opacity-70"
                  >
                    <path d="M5 12h14m-4-6l8 6-8 6"/>
                  </svg>
                </span>
              )}
            </Button>
          </motion.div>

          {/* Status Messages */}
          <AnimatePresence>
            {(status === 'success' || status === 'error') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 p-4 rounded-lg border"
              >
                {status === 'success' ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </motion.div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      Message sent successfully! We'll get back to you within 24 hours.
                    </p>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M15 9l-6 6M9 9l6 6"/>
                      </svg>
                    </motion.div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      Something went wrong. Please try again or contact us directly at hello@syntheon.com
                    </p>
                  </>
                )}

                {status === 'error' && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleReset}
                    className="ml-auto h-8 px-3 text-xs"
                  >
                    Try Again
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contact Info Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="pt-6 border-t border-border/40"
          >
            <div className="flex items-center justify-between text-sm">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-muted-foreground/70"
              >
                Or reach us at{' '}
                <a 
                  href="mailto:hello@syntheon.com" 
                  className="text-primary hover:text-primary/80 transition-colors underline decoration-transparent hover:decoration-current underline-offset-4"
                >
                  hello@syntheon.com
                </a>
              </motion.div>

              <motion.a
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                href="https://twitter.com/syntheon"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground/70 hover:text-primary transition-colors group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
