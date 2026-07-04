'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export interface ContactSplitProps {
  className?: string;
  variant?: 'default' | 'minimal' | 'bold';
  showImage?: boolean;
  imageSrc?: string;
  title: string;
  subtitle: string;
  features?: Array<{ icon: string; text: string }>;
  formFields?: {
    name: string;
    email: string;
    message: string;
    subject?: 'general' | 'sales' | 'support';
  };
}

interface ContactSplitState {
  isHovered: boolean;
  scrollProgress: number;
}

function createVioletToken(name: string, value: string): string {
  const hsl = value.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/)?.slice(1);
  if (!hsl) return `var(--${name})`;
  
  const [hue, sat, light] = hsl;
  const alpha = name === 'border-border' ? ', 0.15)' : ', 0.8)';
  return `hsla(${hue}, ${sat}%, ${light}${alpha})`;
}

const violetTokens: Record<string, string> = {
  'bg-background': createVioletToken('background', '263, 40%, 9%'),
  'text-foreground': createVioletToken('foreground', '263, 85%, 90%'),
  'text-primary': createVioletToken('primary', '263, 100%, 70%'),
  'border-border': createVioletToken('border', '263, 40%, 50%'),
  'bg-muted': createVioletToken('muted', '263, 40%, 18%'),
  'text-muted-foreground': createVioletToken('muted-fg', '263, 70%, 70%'),
  'bg-card': createVioletToken('card', '263, 40%, 25%'),
  'bg-primary': createVioletToken('primary-bg', '263, 100%, 50%'),
};

export const ContactSplit: React.FC<ContactSplitProps> = ({
  className,
  variant = 'default',
  showImage = true,
  imageSrc = '/placeholder-hero.png',
  title,
  subtitle,
  features = [
    { icon: '🚀', text: 'Launch your AI app in days' },
    { icon: '💎', text: 'Production-ready architecture' },
    { icon: '⚡️', text: 'Built for scale and speed' },
  ],
  formFields = {
    name: '',
    email: '',
    message: '',
    subject: 'general',
  },
}) => {
  const state: ContactSplitState = { isHovered: false, scrollProgress: 0 };

  return (
    <motion.div
      className={cn(
        'relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden',
        variant === 'bold' ? 'py-24 lg:py-32' : 'py-16 lg:py-20',
        className
      )}
      onMouseEnter={() => (state.isHovered = true)}
      onMouseLeave={() => (state.isHovered = false)}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-primary/5',
            variant === 'bold' ? 'bg-[radial-gradient(ellipse_at_top_right,_var(--bg-primary)_at_10%,_transparent_70%)]' : ''
          )}
        />
      </motion.div>

      {/* Floating particles */}
      <AnimatePresence>
        {state.isHovered && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full blur-sm"
                initial={{
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                  scale: 0.2 + Math.random() * 0.3,
                  opacity: 0,
                }}
                animate={{
                  x: state.scrollProgress * 200 + (Math.random() - 0.5) * 100,
                  y: state.scrollProgress * 150 + (Math.random() - 0.5) * 80,
                  scale: 0.3 + Math.random(),
                  opacity: 0.1 + Math.random() * 0.2,
                }}
                transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: 60 + Math.random() * 40,
                  height: 60 + Math.random() * 40,
                  background: `radial-gradient(circle, var(--bg-primary) 0%, transparent 70%)`,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 lg:px-12">
        <div className={cn('grid gap-8 lg:gap-16', variant === 'bold' ? 'lg:grid-cols-2 items-center' : '')}>
          {/* Left panel - Hero/Features */}
          <motion.div
            className="flex flex-col justify-between min-h-[400px] lg:min-h-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-8">
              {/* Title block */}
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {showImage && (
                  <motion.img
                    src={imageSrc}
                    alt=""
                    className="w-full max-w-md mx-auto rounded-2xl shadow-2xl shadow-primary/10"
                    initial={{ scale: 0.95, rotateX: 10 }}
                    animate={{ scale: 1, rotateX: 0 }}
                    transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
                  />
                )}

                <motion.h1
                  className={cn(
                    'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-6 lg:mt-12',
                    variant === 'bold' ? 'leading-[1.1]' : ''
                  )}
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <span className={cn('bg-gradient-to-r', variant === 'bold' ? '' : 'from-primary to-transparent')}>
                    {title}
                  </span>
                </motion.h1>

                <motion.p
                  className="text-lg md:text-xl text-muted-foreground mt-4 lg:mt-6 max-w-xl"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  {subtitle}
                </motion.p>

                {/* Feature highlights */}
                <div className="grid grid-cols-3 gap-4 mt-8 lg:mt-12">
                  {features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-2xl mb-2">{feature.icon}</div>
                      <p className="text-sm text-muted-foreground font-medium">
                        {feature.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" variant="primary" className="px-8 py-6 text-lg rounded-xl shadow-lg shadow-primary/20">
                    Start Building Free
                    <span className="ml-2 inline-block animate-pulse">→</span>
                  </Button>
                  <Button size="lg" variant="secondary" className="px-8 py-6 text-lg rounded-xl">
                    Book Demo
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Decorative elements */}
            <motion.div
              className={cn(
                'hidden lg:flex items-center justify-end gap-4',
                variant === 'bold' ? 'pt-12' : ''
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-primary/50 text-primary bg-background/50 px-4 py-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                  Live Demo Available
                </Badge>
              </div>
            </motion.div>
          </motion.div>

          {/* Right panel - Contact Form */}
          <motion.div
            className={cn(
              'flex flex-col justify-center',
              variant === 'bold' ? '' : 'lg:justify-center'
            )}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className={cn(
              'w-full max-w-md mx-auto overflow-hidden',
              variant === 'bold' ? 'border-2 border-primary/30 shadow-2xl shadow-primary/10' : '',
              state.isHovered && !variant.includes('minimal') ? 'shadow-xl shadow-primary/5 scale-[1.02]' : ''
            )}>
              <CardContent className="p-6 md:p-8 lg:p-10">
                <div className="space-y-6">
                  {/* Form header */}
                  <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.2 }}
                  >
                    <h3 className="text-xl font-semibold text-foreground">
                      Get in Touch
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formFields.subject === 'sales' ? 'Sales inquiries' : 
                       formFields.subject === 'support' ? 'Support team' : 'General questions'}
                    </p>
                  </motion.div>

                  {/* Form fields */}
                  <div className="space-y-4">
                    <AnimatePresence mode="wait">
                      {formFields.name && (
                        <motion.input
                          key={formFields.name}
                          type="text"
                          placeholder="Your name"
                          defaultValue={formFields.name}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 15 }}
                          transition={{ duration: 0.2 }}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      )}

                      {formFields.email && (
                        <motion.input
                          key={formFields.email}
                          type="email"
                          placeholder="Email address"
                          defaultValue={formFields.email}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 15 }}
                          transition={{ duration: 0.2 }}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      )}

                      {formFields.message && (
                        <motion.textarea
                          key={formFields.message}
                          placeholder="Your message..."
                          defaultValue={formFields.message}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 15 }}
                          transition={{ duration: 0.2 }}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none min-h-[120px] resize-y transition-all"
                        />
                      )}

                      {formFields.subject === 'general' && (
                        <motion.div
                          key="subject-select"
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 15 }}
                          transition={{ duration: 0.2 }}
                        >
                          <select className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer">
                            <option value="">Select a topic</option>
                            <option value="general">General Inquiry</option>
                            <option value="sales">Sales & Pricing</option>
                            <option value="support">Technical Support</option>
                          </select>
                        </motion.div>
                      )}

                      {formFields.subject === 'sales' && (
                        <motion.div
                          key="sales-select"
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 15 }}
                          transition={{ duration: 0.2 }}
                        >
                          <select className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer">
                            <option value="">What are you looking for?</option>
                            <option value="enterprise">Enterprise Solution</option>
                            <option value="startup">Startup Package</option>
                          </select>
                        </motion.div>
                      )}

                      {formFields.subject === 'support' && (
                        <motion.div
                          key="support-select"
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 15 }}
                          transition={{ duration: 0.2 }}
                        >
                          <select className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer">
                            <option value="">Select issue type</option>
                            <option value="bug">Bug Report</option>
                            <option value="feature">Feature Request</option>
                          </select>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit button */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 1.6 }}
                    >
                      <Button className="w-full py-6 text-lg rounded-xl font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
                        Send Message
                      </Button>
                    </motion.div>

                    {/* Trust indicators */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 1.8 }}
                      className="flex items-center justify-between pt-6 border-t border-border/50"
                    >
                      <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 2 + i * 0.1, type: 'spring' }}
                            className="w-8 h-8 rounded-full border-2 border-background bg-muted"
                          />
                        ))}
                      </div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.5, duration: 0.4 }}
                        className="text-sm text-muted-foreground"
                      >
                        Trusted by 2,000+ teams worldwide
                      </motion.p>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Decorative underline */}
            <motion.div
              className="hidden lg:block absolute -bottom-12 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full"
              initial={{ scaleX: 0, y: 10 }}
              animate={{ scaleX: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5, ease: 'easeOut' }}
            >
              <div className="w-full h-full rounded-full bg-gradient-to-r from-primary/40 via-primary to-primary/40 blur-sm" />
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom decorative elements */}
        <motion.div
          className={cn(
            'hidden lg:block absolute -bottom-8 left-12',
            variant === 'bold' ? '' : '-bottom-4'
          )}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 flex items-center justify-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
