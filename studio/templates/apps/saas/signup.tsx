'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface SignupFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  company: string;
  role: 'founder' | 'developer' | 'designer' | 'other';
}

interface FieldProps {
  name: keyof SignupFormData;
  label: string;
  type?: string;
  placeholder: string;
  icon?: React.ReactNode;
}

const Field = ({ name, label, type = 'text', placeholder, icon }: FieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="space-y-2">
      <Label htmlFor={name as string} className="text-sm font-medium text-foreground/80">
        {label}
      </Label>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: name === 'firstName' ? 0.1 : 0 }}
        className="relative"
      >
        <Input
          id={name as string}
          type={type}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'h-12 px-4 bg-background border-border rounded-xl transition-all duration-300',
            isFocused ? 'border-primary/50 shadow-lg shadow-primary/5' : ''
          )}
        />
        {icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/60"
          >
            {icon}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const AnimatedHeader = () => {
  const { scrollY } = useScroll();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ 
        opacity: [0, 1],
        y: [0, 20]
      }}
      transition={{ 
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3
      }}
    >
      <motion.div
        className="flex items-center gap-4 mb-6"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Badge variant="outline" className="rounded-full px-3 py-1 bg-background/80 backdrop-blur-sm border-border">
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-primary"
          >
            ✨
          </motion.span>
        </Badge>
      </motion.div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
        <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Join Syntheon
        </span>
      </h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-foreground/60 max-w-md"
      >
        Start your free 30-day trial. No credit card required. Cancel anytime.
      </motion.p>
    </motion.div>
  );
};

const FeatureHighlight = () => {
  const features = [
    { icon: '🚀', title: 'Lightning Fast Setup', desc: 'Get started in minutes, not days' },
    { icon: '💎', title: 'Premium Features', desc: 'Access all enterprise capabilities' },
    { icon: '🔒', title: 'Enterprise Security', desc: 'Bank-grade encryption & compliance' },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      {features.map((feature, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
          className="p-4 rounded-xl bg-background/50 border-border hover:border-primary/30 transition-colors"
        >
          <span className="text-2xl mb-2 block">{feature.icon}</span>
          <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
          <p className="text-sm text-foreground/60">{feature.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default function SignupPage({ onSuccess, onError }: SignupFormProps) {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    company: '',
    role: 'founder',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <motion.main
      ref={containerRef}
      className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        style={{ y: y1 }}
        className="w-full max-w-4xl"
      >
        <Card className={cn(
          'overflow-hidden border-border shadow-xl shadow-primary/5',
          'bg-gradient-to-b from-background to-background/90'
        )}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative"
          >
            {/* Animated header gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-purple-600/5 to-indigo-600/10 pointer-events-none"
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 100%'] 
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <CardHeader className="pb-6">
              <AnimatedHeader />
              
              {/* Animated form container */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  
                  // Validation
                  const newErrors: Record<string, string> = {};
                  if (!formData.email.includes('@')) newErrors.email = 'Valid email required';
                  if (formData.password.length < 8) newErrors.password = 'Minimum 8 characters';
                  
                  if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);
                    return;
                  }

                  setIsSubmitting(true);
                  
                  // Simulate API call
                  setTimeout(() => {
                    setIsSubmitting(false);
                    onSuccess?.();
                  }, 2000);
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="space-y-6"
                  >
                    <h3 className="text-lg font-semibold text-foreground/90">Personal Information</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Field
                        name="firstName"
                        label="First Name"
                        placeholder="Jane"
                      />
                      
                      <Field
                        name="lastName"
                        label="Last Name"
                        placeholder="Doe"
                      />
                    </div>

                    <Field
                      name="email"
                      label="Email Address"
                      type="email"
                      placeholder="jane@example.com"
                    />

                    <Field
                      name="password"
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </motion.div>

                  {/* Company Information */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45, duration: 0.5 }}
                    className="space-y-6"
                  >
                    <h3 className="text-lg font-semibold text-foreground/90">Company Information</h3>

                    <Field
                      name="company"
                      label="Company Name"
                      placeholder="Acme Inc."
                    />

                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-sm font-medium text-foreground/80">
                        Primary Role
                      </Label>
                      <select
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                        className={cn(
                          'h-12 px-4 bg-background border-border rounded-xl transition-all duration-300',
                          'focus:border-primary/50 focus:ring-2 focus:ring-primary/20'
                        )}
                      >
                        <option value="founder">Founder</option>
                        <option value="developer">Developer</option>
                        <option value="designer">Designer</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Animated counter */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className="p-4 rounded-xl bg-background/50 border-border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-foreground/60">Current Plan</span>
                        <Badge variant="outline" className="rounded-full">Free Trial</Badge>
                      </div>
                      <motion.div
                        className="h-2 bg-background rounded-full overflow-hidden"
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, delay: 0.6 }}
                      >
                        <motion.div
                          initial={{ x: "-100%" }}
                          animate={{ x: "0%" }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                          className="h-full bg-gradient-to-r from-violet-600 to-purple-600 rounded-full"
                        />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Terms & Actions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="space-y-6 pt-6 border-t border-border/50"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      defaultChecked
                      className="mt-1 h-4 w-4 rounded border-border focus:ring-primary/20 focus:ring-2"
                    />
                    <label htmlFor="terms" className="text-sm text-foreground/70">
                      By signing up, you agree to our{' '}
                      <a href="#" className="text-primary hover:underline">Terms of Service</a>{' '}
                      and{' '}
                      <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                    </label>
                  </div>

                  {/* Main CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.4 }}
                  >
                    <Button
                      type="submit"
                      size="lg"
                      className={cn(
                        'h-14 px-8 text-lg font-semibold rounded-xl',
                        'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700',
                        'text-white shadow-lg shadow-primary/25 border-border/50'
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                          className="inline-block mr-2"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                          </svg>
                        </motion.span>
                      ) : (
                        <>
                          Create Free Account
                          <span className="ml-2 text-sm font-normal opacity-80">→</span>
                        </>
                      )}
                    </Button>

                    {/* Subtle footer */}
                    <p className="text-center text-sm text-foreground/50 mt-4">
                      Already have an account?{' '}
                      <a href="#" className="text-primary hover:underline font-medium">
                        Sign in instead
                      </a>
                    </p>
                  </motion.div>
                </motion.div>

                {/* Error display */}
                {Object.keys(errors).length > 0 && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 rounded-xl bg-red-50/50 border border-red-200"
                    >
                      <ul className="text-sm text-red-700 space-y-1">
                        {Object.values(errors).map((error, i) => (
                          <li key={i}>• {error}</li>
                        ))}
                      </ul>
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* Features showcase */}
                <FeatureHighlight />
              </motion.form>
            </CardHeader>
          </motion.div>
        </Card>
      </motion.div>
    </motion.main>
  );
}
