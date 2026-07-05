'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef, FormEvent } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle2 } from 'lucide-react';

export interface ContactFormSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  emailPlaceholder?: string;
  subjectPlaceholder?: string;
  messagePlaceholder?: string;
  submitLabel?: string;
  accentColor?: 'violet' | 'indigo' | 'purple';
}

export default function ContactFormSection({
  title = 'Get in Touch',
  subtitle = 'We\'d love to hear from you',
  description = 'Fill out the form below and our team will get back to you within 24 hours.',
  emailPlaceholder = 'your@email.com',
  subjectPlaceholder = 'Subject...',
  messagePlaceholder = 'Your message...',
  submitLabel = 'Send Message',
  accentColor = 'violet'
}: ContactFormSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut'
      }
    })
  };

  const handleScroll = () => {
    if (containerRef.current) {
      containerRef.current.style.transform = `translateY(${y1}px)`;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Reset after showing success state
    setTimeout(() => {
      setIsSuccess(false);
    }, 5000);
  };

  const getAccentStyles = () => ({
    violet: 'from-violet-600 to-purple-700',
    indigo: 'from-indigo-600 to-blue-700',
    purple: 'from-purple-600 to-pink-700'
  }[accentColor]);

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-[80vh] flex items-center justify-center px-4 py-20 overflow-hidden"
      style={{ transform: 'translateY(50px)' }}
      onScroll={handleScroll}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/10" />
      
      {/* Floating gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"
      />
      
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/3 rounded-full blur-[100px]"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 max-w-4xl w-full mx-auto"
      >
        <Card className={cn(
          "backdrop-blur-xl bg-background/75 border-border/60 shadow-2xl",
          "shadow-primary/10 dark:shadow-primary/20"
        )}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-8 md:p-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <Badge 
                variant="secondary" 
                className={cn(
                  "px-4 py-2 text-sm font-medium",
                  getAccentStyles() + "-500/80"
                )}
              >
                {title}
              </Badge>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              {subtitle}
            </h1>

            <p className="text-muted-foreground text-lg max-w-xl mb-8">
              {description}
            </p>

            {/* Contact Info */}
            <div className="grid grid-cols-3 gap-6 py-6 border-y border-border/40">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <Mail className="h-6 w-6 mb-3 text-primary" />
                <span className="text-sm font-medium">hello@syntheon.com</span>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <MapPin className="h-6 w-6 mb-3 text-primary" />
                <span className="text-sm font-medium">San Francisco, CA</span>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <Phone className="h-6 w-6 mb-3 text-primary" />
                <span className="text-sm font-medium">+1 (555) 123-4567</span>
              </motion.div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="space-y-3"
                >
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Your name" 
                    required
                    autoComplete="name"
                    className={cn(
                      "transition-all duration-200",
                      "focus-visible:ring-primary/50 focus-visible:ring-2",
                      "focus-visible:shadow-primary/10"
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  className="space-y-3"
                >
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder={emailPlaceholder}
                    required
                    autoComplete="email"
                    className={cn(
                      "transition-all duration-200",
                      "focus-visible:ring-primary/50 focus-visible:ring-2",
                      "focus-visible:shadow-primary/10"
                    )}
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="space-y-3"
              >
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  placeholder={subjectPlaceholder}
                  required
                  autoComplete="off"
                  className={cn(
                    "transition-all duration-200",
                    "focus-visible:ring-primary/50 focus-visible:ring-2",
                    "focus-visible:shadow-primary/10"
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="space-y-3"
              >
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder={messagePlaceholder}
                  required
                  rows={4}
                  autoComplete="off"
                  className={cn(
                    "transition-all duration-200 min-h-[120px]",
                    "focus-visible:ring-primary/50 focus-visible:ring-2",
                    "focus-visible:shadow-primary/10 resize-none"
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-center justify-between"
              >
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isSubmitting}
                  className={cn(
                    "h-12 px-8 text-base font-medium",
                    getAccentStyles() + "-500 hover:from-primary/70 hover:to-secondary/70",
                    "transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg",
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {submitLabel}
                    </>
                  )}
                </Button>

                {/* Success State */}
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/20"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Message sent successfully!</span>
                  </motion.div>
                )}
              </motion.div>
            </form>
          </motion.div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-border/30 bg-muted/25 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Need urgent help? Call us at +1 (555) 123-4567
            </p>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">Online now</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-6 left-6 right-6 flex justify-center"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>© 2024 Syntheon</span>
          <span>•</span>
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-2 text-muted-foreground/60"
        >
          <span className="text-xs">Scroll to explore</span>
          <svg width="12" height="18" viewBox="0 0 12 18" fill="currentColor">
            <path d="M6 17L0 9l6-7v14z" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
