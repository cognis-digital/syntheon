'use client';

import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface LandingProps {
  className?: string;
}

export interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const features: FeatureItem[] = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'Lightning Fast',
    description: 'Built on Next.js 15 with edge caching and optimized rendering for instant interactions.',
    delay: 0,
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Enterprise Ready',
    description: 'Production-grade architecture with TypeScript, Tailwind, and shadcn/ui for maintainability.',
    delay: 0.2,
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: 'Secure by Design',
    description: 'Security-first patterns, input sanitization, and protected routes out of the box.',
    delay: 0.4,
  },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'CTO at FlowState', quote: 'The cleanest architecture I\'ve seen in years.' },
  { name: 'Marcus Webb', role: 'Lead Engineer', quote: 'Finally, a template that just works beautifully.' },
];

const AnimatedCounter = ({ value, label }: { value: number; label: string }) => {
  const ref = useInView({ triggerOnce: true });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="text-center"
    >
      <div className="flex items-baseline justify-center gap-2">
        <motion.span
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, type: 'spring' }}
          className="text-3xl font-bold text-primary"
        >
          {value}k+
        </motion.span>
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </motion.div>
  );
};

const FeatureCard = ({ item }: { item: FeatureItem }) => {
  const ref = useInView({ triggerOnce: true });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: item.delay }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className={cn(
        'h-full bg-background/5 backdrop-blur-sm border-border/60',
        'transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10'
      )}>
        <CardContent className="p-6">
          <div className={cn(
            'w-12 h-12 rounded-xl mb-4 flex items-center justify-center',
            'bg-gradient-to-br from-primary/20 to-primary/5 text-primary',
            'group-hover:scale-110 transition-transform duration-300'
          )}>
            {item.icon}
          </div>
          <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {item.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TestimonialItem = ({ item }: { item: typeof testimonials[0] }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={item.name}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.4 }}
        className="flex-1"
      >
        <Card className={cn(
          'h-full bg-background/5 backdrop-blur-sm border-border/60',
          'transition-all duration-300 hover:border-primary/50'
        )}>
          <CardContent className="p-6">
            <blockquote>
              <p className="text-lg italic mb-4">{item.quote}</p>
              <footer>
                <cite className="not-italic font-medium text-primary">
                  {item.name}
                </cite>
                <span className="ml-2 text-sm text-muted-foreground">— {item.role}</span>
              </footer>
            </blockquote>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default function Landing({ className }: LandingProps) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 20]);
  const y2 = useTransform(scrollY, [0, 800], [0, -30]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={cn('min-h-screen bg-background', className)}
    >
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated background gradient */}
        <motion.div
          style={{ y: y1 }}
          className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background"
        />
        
        {/* Floating decorative elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1], 
              scale: [0.8, 1, 0.9] 
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              delay: i * 0.5,
              ease: 'easeInOut'
            }}
            className="absolute rounded-full blur-3xl"
            style={{
              width: 400 + i * 100,
              height: 400 + i * 100,
              background: `radial-gradient(circle, hsla(${260 + i * 20}, 70%, 60%, ${0.05}) 0%, transparent 70%)`,
              left: `${i % 2 === 0 ? 10 : 90}%`,
              top: `${i % 3 === 0 ? 10 : 80}%`,
            }}
          />
        ))}

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <Badge variant="secondary" className={cn(
              'px-4 py-1.5 text-sm',
              'bg-primary/10 border-primary/30 text-primary'
            )}>
              <span className="animate-pulse mr-2">●</span>
              Now in public beta
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Build faster. Ship better.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            The premium Next.js template for teams that demand excellence. 
            Production-ready architecture with beautiful motion by default.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="#join-waitlist">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'px-8 py-4 rounded-xl font-semibold text-lg',
                  buttonVariants({ variant: 'primary' }),
                  'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700',
                  'shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow duration-300'
                )}
              >
                Join the waitlist
              </motion.button>
            </a>

            <Input
              type="email"
              placeholder="Enter your email"
              className={cn(
                'w-full sm:w-auto px-6 py-4 rounded-xl border-border/50',
                'focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent'
              )}
            />
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 flex items-center justify-center gap-8"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                className="text-2xl font-bold text-muted-foreground"
              >
                {['9k', '8.5k', '7k', '6.5k', '5k'][i]}+
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 border-2 border-border rounded-full flex items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-2 bg-border rounded-full ml-1"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to ship
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built with modern patterns and best practices. Ready for production from day one.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((item, i) => (
              <FeatureCard key={i} item={{ ...item, delay: 0.2 + i * 0.1 }} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by developers
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((item, i) => (
              <TestimonialItem key={i} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="join-waitlist" className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={cn(
              'rounded-3xl p-8 md:p-12',
              'bg-gradient-to-br from-primary/10 via-background to-primary/5',
              'border border-border/40'
            )}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to build something amazing?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of developers who have already started their next project.
              Early access is limited — be among the first.
            </p>

            <form className="flex flex-col sm:flex-row items-center gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="your@email.com"
                required
                className={cn(
                  'w-full px-6 py-4 rounded-xl',
                  'bg-background border-border/50 text-foreground',
                  'focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent'
                )}
              />

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  'px-8 py-4 rounded-xl font-semibold text-lg',
                  buttonVariants({ variant: 'primary' }),
                  'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700',
                  'shadow-lg shadow-primary/25 transition-shadow duration-300'
                )}
              >
                Get early access
              </motion.button>
            </form>

            <p className="mt-6 text-sm text-muted-foreground">
              No spam. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={cn(
        'py-12 px-4 border-t border-border/30',
        'bg-background'
      )}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground">
            © 2024 Syntheon. Built with ❤️ and coffee.
          </p>

          <nav className="flex items-center gap-8">
            {['Docs', 'GitHub', 'Twitter'].map((link) => (
              <a 
                key={link}
                href="#" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      </footer>

      {/* Reduced motion preference */}
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </motion.main>
  );
}
