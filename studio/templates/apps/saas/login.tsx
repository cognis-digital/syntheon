'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input as InputField } from '@/components/ui/input-field';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/lib/icons';
import { useTheme } from 'next-themes';

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginProps {
  onSuccess?: (data: LoginFormData) => void | Promise<void>;
  onError?: (error: Error) => void;
  loading?: boolean;
  showDemoMode?: boolean;
}

const DEFAULT_DELAY = 100;

export function Login({
  onSuccess,
  onError,
  loading = false,
  showDemoMode = true,
}: LoginProps): JSX.Element {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Scroll-based parallax for background elements
  const { scrollYProgress } = useScroll({
    target: document.body,
    offset: ['start end', 'end start'],
  });

  const bgParallax = useTransform(scrollYProgress, [0, 1], [0.5, -2]);

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: DEFAULT_DELAY / 1000,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 25 },
    },
  };

  // Demo mode credentials for realistic testing
  const DEMO_CREDENTIALS = {
    email: 'demo@syntheon.com',
    password: 'demo1234',
  };

  return (
    <motion.div
      className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-violet-900/10"
        style={{ backgroundPositionY: bgParallax, transition: 'background-position 30s ease' }}
      />

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-8 left-8 w-24 h-24 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        {/* Card with subtle depth */}
        <Card className="border-border/60 shadow-xl backdrop-blur-sm bg-background/95">
          <CardHeader>
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Icons.logo className="h-8 w-8 text-primary" />
                <Badge variant="outline" className="text-xs border-border/50">
                  {showDemoMode ? 'Demo Mode' : 'Production'}
                </Badge>
              </div>

              {/* Theme toggle hint */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg border-border/40 hover:border-border transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Icons.sun className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Icons.moon className="h-4 w-4 text-muted-foreground" />
                )}
              </motion.button>
            </motion.div>

            <CardTitle className="text-2xl font-semibold tracking-tight">
              Welcome back
            </CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Sign in to your account or continue with social providers.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Email input */}
            <motion.div variants={itemVariants}>
              <Label htmlFor="email" className="text-sm font-medium mb-1.5">
                Email address
              </Label>
              <InputField
                id="email"
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
                disabled={loading}
                className="h-12 border-border/60 focus:border-primary transition-colors"
              />
            </motion.div>

            {/* Password input */}
            <motion.div variants={itemVariants}>
              <Label htmlFor="password" className="text-sm font-medium mb-1.5">
                Password
              </Label>
              <InputField
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
                className="h-12 border-border/60 focus:border-primary transition-colors"
              />
            </motion.div>

            {/* Remember me + Forgot password */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox id="remember-me" disabled={loading} />
                <Label htmlFor="remember-me" className="text-sm text-muted-foreground/80">
                  Remember me for 30 days
                </Label>
              </div>

              <a href="#" className="text-sm font-medium hover:underline transition-colors">
                Forgot password?
              </a>
            </motion.div>

            {/* Demo credentials hint */}
            {showDemoMode && (
              <AnimatePresence>
                {loading ? null : (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="p-3 rounded-lg border-border/40 bg-muted/50 text-sm"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icons.info className="h-3.5 w-3.5 text-primary" />
                      <span className="font-medium">Demo credentials</span>
                    </div>
                    <p className="text-muted-foreground/70">
                      Email: {DEMO_CREDENTIALS.email} • Password: {DEMO_CREDENTIALS.password}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Submit button */}
            <motion.div variants={itemVariants}>
              <Button
                className="h-12 w-full font-medium bg-primary hover:bg-primary/90 transition-colors"
                disabled={loading}
                onClick={() => {
                  if (onSuccess) {
                    onSuccess({ email: '', password: '' });
                  }
                }}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loader"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <Icons.spinner className="h-4 w-4 text-primary-foreground" />
                      <span>Signing in...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="text"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <Icons.arrowRight className="h-4 w-4 text-primary-foreground" />
                      <span>Sign in</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              {/* Loading overlay */}
              {loading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                  <Icons.spinner className="h-6 w-6 text-primary animate-spin" />
                </div>
              )}
            </motion.div>

            {/* Divider */}
            <Separator className="border-border/40" />

            {/* Social login options */}
            <motion.div variants={itemVariants}>
              <div className="flex gap-3">
                <Button variant="outline" className="h-12 w-full font-medium border-border/60 hover:bg-muted/50 transition-colors">
                  <Icons.google className="mr-2 h-4.5 w-4.5 text-primary" />
                  Continue with Google
                </Button>

                <Button variant="outline" className="h-12 w-full font-medium border-border/60 hover:bg-muted/50 transition-colors">
                  <Icons.github className="mr-2 h-4.5 w-4.5 text-primary" />
                  Continue with GitHub
                </Button>

                <Button variant="outline" className="h-12 w-full font-medium border-border/60 hover:bg-muted/50 transition-colors">
                  <Icons.apple className="mr-2 h-4.5 w-4.5 text-primary" />
                  Continue with Apple
                </Button>
              </div>
            </motion.div>

            {/* Sign up link */}
            <motion.p variants={itemVariants} className="text-center text-sm">
              Don&apos;t have an account?{' '}
              <a href="#" className="font-medium hover:underline transition-colors">
                Create a free account
              </a>
            </motion.p>

            {/* Error state */}
            <AnimatePresence>
              {onError && onError(new Error('Invalid credentials')) && (
                <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
                  <Icons.alertCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription>
                    Invalid email or password. Try the demo credentials above.
                  </AlertDescription>
                </Alert>
              )}
            </AnimatePresence>

            {/* Success state */}
            <AnimatePresence>
              {onSuccess && onSuccess({ email: '', password: '' }) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 rounded-lg border-border/30 bg-green-500/10 text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icons.checkCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-700 dark:text-green-400">
                      Signed in successfully!
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground/80">
                    Redirecting to dashboard...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reduced motion preference */}
            <style jsx global>{`
              @media (prefers-reduced-motion: reduce) {
                * {
                  animation-duration: 0.01ms !important;
                  animation-iteration-count: 1 !important;
                  transition-duration: 0.01ms !important;
                }

                .framer-motion__layout,
                .framer-motion__motion-wrapper {
                  transform: none !important;
                }
              }
            `}</style>
          </CardContent>
        </Card>

        {/* Footer */}
        <motion.p variants={itemVariants} className="text-center text-sm text-muted-foreground/60 mt-4">
          © 2025 Syntheon Inc. All rights reserved.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// Export types for external usage
export type { LoginProps, LoginFormData };
