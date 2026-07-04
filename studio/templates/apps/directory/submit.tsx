'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export interface SubmitFormProps {
  className?: string;
  onSuccess?: (data: FormData) => void | Promise<void>;
  onError?: (error: unknown) => void;
}

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    },
  },
  card: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
    },
  },
  field: {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.3, 
        delay: i * 0.08,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }),
  },
};

const CATEGORY_OPTIONS = [
  'Software & SaaS',
  'Mobile Apps', 
  'Hardware / IoT',
  'Design Tools',
  'Marketing Platforms',
  'Developer Tools',
  'AI / Machine Learning',
  'Other',
];

export function SubmitForm({ className, onSuccess, onError }: SubmitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({
    name: '',
    email: '',
    website: '',
    description: '',
    category: CATEGORY_OPTIONS[0],
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 0.5], [0, -20]);
  const y2 = useTransform(scrollYProgress, [0, 0.5], [-20, 0]);

  useEffect(() => {
    if (onSuccess) {
      onSuccess(formData);
    }
  }, [formData, onSuccess]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) {
            resolve({});
          } else {
            reject(new Error('Network error'));
          }
        }, 1500);
      });

      setSuccessMessage('Submission received!');
      setFormData({ name: '', email: '', website: '', description: '', category: CATEGORY_OPTIONS[0] });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn('relative min-h-screen bg-background overflow-hidden', className)}
      initial="hidden"
      animate="visible"
      variants={ANIMATION_VARIANTS.container}
    >
      {/* Animated gradient background */}
      <motion.div
        style={{ y: y1 }}
        className="absolute inset-0 pointer-events-none z-0"
      >
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] bg-secondary/10 rounded-full blur-[100px]" />
      </motion.div>

      {/* Floating decorative elements */}
      <motion.div
        style={{ y: y2 }}
        className="absolute inset-0 pointer-events-none z-0"
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              scale: 0,
              rotate: Math.random() * 360,
            }}
            animate={{ 
              opacity: [0, 0.15, 0], 
              scale: [0, 1, 0],
              rotate: i % 2 === 0 ? 0 : 180,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
            className="absolute rounded-full bg-primary/5"
            style={{
              width: 40 + i * 15,
              height: 40 + i * 15,
              left: `${10 + i * 12}%`,
              top: `${10 + (i % 3) * 18}%`,
            }}
          />
        ))}
      </motion.div>

      {/* Main content */}
      <motion.main
        className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20"
        variants={ANIMATION_VARIANTS.card}
      >
        <Card className="w-full max-w-3xl shadow-xl border-border/50 backdrop-blur-sm bg-background/95">
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm">
                  <span className="animate-pulse">●</span> Live
                </Badge>
                <Separator orientation="vertical" className="h-4 bg-border/50" />
                <p className="text-muted-foreground text-sm">Directory Submission Portal</p>
              </div>

              <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight">
                Submit Your Project
              </CardTitle>
              <CardDescription className="max-w-xl mt-2">
                Share your work with our community. Fill out the form below and we'll review your submission within 48 hours.
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6 p-6 md:p-8">
            {/* Animated field container */}
            <AnimatePresence initial={false}>
              {submitError && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-md bg-destructive/15 border border-destructive/25 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-destructive font-medium">{submitError}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSubmitError(null)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </Button>
                  </div>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-md bg-green-500/10 border border-green-500/25 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-green-500 font-medium">{successMessage}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSuccessMessage(null)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </Button>
                  </div>
                </motion.div>
              )}

              <AnimatePresence initial={false}>
                {successMessage && (
                  <motion.div
                    key="fade-out-success"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  >
                    <Button 
                      variant="secondary"
                      className="w-full sm:w-auto"
                      onClick={() => setSuccessMessage(null)}
                    >
                      Submit Another Project
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name field */}
                <motion.div variants={ANIMATION_VARIANTS.field} initial="hidden" animate="visible" index={0}>
                  <Label htmlFor="name" className="text-sm font-medium mb-2">
                    Full Name <span className="text-muted-foreground/60">(required)</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    autoComplete="name"
                    required
                    className="h-12 border-border focus-visible:ring-primary/50 transition-shadow"
                  />
                </motion.div>

                {/* Email field */}
                <motion.div variants={ANIMATION_VARIANTS.field} initial="hidden" animate="visible" index={1}>
                  <Label htmlFor="email" className="text-sm font-medium mb-2">
                    Email Address <span className="text-muted-foreground/60">(required)</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                    required
                    className="h-12 border-border focus-visible:ring-primary/50 transition-shadow"
                  />
                </motion.div>

                {/* Website field */}
                <motion.div variants={ANIMATION_VARIANTS.field} initial="hidden" animate="visible" index={2}>
                  <Label htmlFor="website" className="text-sm font-medium mb-2">
                    Website URL <span className="text-muted-foreground/60">(optional)</span>
                  </Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="https://your-project.com"
                    value={formData.website}
                    onChange={handleInputChange}
                    autoComplete="organization-url"
                    className="h-12 border-border focus-visible:ring-primary/50 transition-shadow"
                  />
                </motion.div>

                {/* Category field */}
                <motion.div variants={ANIMATION_VARIANTS.field} initial="hidden" animate="visible" index={3}>
                  <Label htmlFor="category" className="text-sm font-medium mb-2">
                    Primary Category
                  </Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="h-12 w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-shadow appearance-none cursor-pointer"
                  >
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </motion.div>

                {/* Description field */}
                <motion.div variants={ANIMATION_VARIANTS.field} initial="hidden" animate="visible" index={4}>
                  <Label htmlFor="description" className="text-sm font-medium mb-2">
                    Project Description <span className="text-muted-foreground/60">(required)</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Tell us about your project, its features, and what makes it unique..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    required
                    className="min-h-[120px] resize-none border-border focus-visible:ring-primary/50 transition-shadow"
                  />
                </motion.div>

                {/* Additional info */}
                <motion.div variants={ANIMATION_VARIANTS.field} initial="hidden" animate="visible" index={5}>
                  <Label className="text-sm font-medium mb-3">
                    Additional Information
                  </Label>
                  <div className="space-y-2">
                    {['Website demo link', 'GitHub repository', 'Live preview URL'].map((label, i) => (
                      <Input
                        key={i}
                        name={`additional_${i}`}
                        placeholder={label}
                        value=""
                        onChange={() => {}}
                        className="h-10 border-border/50 text-sm"
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Submit button */}
                <motion.div variants={ANIMATION_VARIANTS.field} initial="hidden" animate="visible" index={6}>
                  <Button 
                    size="lg"
                    className="w-full h-14 text-lg font-medium bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 hover:shadow-primary/30"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full"
                        />
                        <span>Submitting...</span>
                      </span>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <path d="M5 12h14"/>
                          <path d="m12 5 7.07 7.07a2 2 0 0 1-2.83 2.83L12 14.9l-6.93 6.93a2 2 0 0 1-2.83-2.83L12 5"/>
                        </svg>
                        Submit Application
                      </>
                    )}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground mt-4">
                    By submitting, you agree to our{' '}
                    <a href="#" className="underline hover:text-primary transition-colors">submission guidelines</a>.
                  </p>
                </motion.div>
              </div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Footer info */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="absolute bottom-6 left-0 right-0 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Need help?{' '}
            <a href="#" className="underline hover:text-primary transition-colors">Contact support</a>
          </p>
        </motion.footer>
      </motion.main>

      {/* Custom cursor effect (optional, subtle) */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{ 
          filter: 'blur(40px)',
          opacity: 0.15,
          mixBlendMode: 'overlay',
        }}
        animate={{
          background: `radial-gradient(circle at ${window.scrollY + window.innerHeight / 2}px 50%, rgba(139, 92, 246, 0.15), transparent)`,
        }}
      />
    </motion.div>
  );
}

export default SubmitForm;
