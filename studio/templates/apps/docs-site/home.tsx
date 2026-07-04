'use client';

import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface HomeProps {
  className?: string;
}

export interface HomePropsInterface extends HomeProps {}

function CustomCursor() {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = React.useState(false);

  React.useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', updatePosition);
    return () => document.removeEventListener('mousemove', updatePosition);
  }, []);

  return (
    <motion.div
      className="fixed pointer-events-none z-50 w-8 h-8 rounded-full border-2 border-violet-400/30"
      style={{ x: position.x - 16, y: position.y - 16 }}
      animate={{ scale: isHovering ? 1.2 : 1, opacity: isHovering ? 0.8 : 0.5 }}
      transition={{ duration: 0.15 }}
    />
  );
}

function Hero() {
  const ref = React.useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.6]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div style={{ y: y1 }} className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-violet-950/20" />
      
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-violet-400/30 rounded-full blur-sm"
          initial={{ x: Math.random() * 120 - 60, y: Math.random() * 80 - 40, scale: 0.5 + i * 0.2 }}
          animate={{ 
            x: [Math.random() * 120 - 60, Math.random() * 120 - 60],
            y: [Math.random() * 80 - 40, Math.random() * 80 - 40],
            scale: [0.5 + i * 0.2, 0.7 + i * 0.3] 
          }}
          transition={{ duration: 15 + i * 3, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      <motion.div style={{ opacity }} className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
            Syntheon
          </span>
          <br />
          Docs Platform
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
        >
          Build beautiful documentation sites with elegant motion and premium design.
        </motion.p>

        <div className="flex items-center justify-center gap-4">
          <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-8 py-6 text-lg font-medium">
            Start Building
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg">
            View Demo
          </Button>
        </div>

        {/* Animated counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 flex items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <span>Trusted by</span>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ delay: 0.6 + i * 0.2, duration: 1.5, repeat: Infinity }}
              className="text-violet-400 font-medium"
            >
              {['Acme', 'Globex', 'Soylent'][i]}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-violet-400/30 flex items-center justify-center"
        >
          <motion.div
            animate={{ y: [8, -4, 8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 bg-violet-400 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

function FeatureCard({ title, description, icon, delay }: { title: string; description: string; icon: React.ReactNode; delay: number }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
    >
      <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card transition-colors duration-300 group">
        <CardContent className="p-6 md:p-8 flex flex-col items-start gap-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: -2 }}
            className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors"
          >
            {icon}
          </motion.div>

          <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-auto text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
          >
            Learn more <span aria-hidden="true">→</span>
          </motion.button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Features() {
  const features = [
    {
      title: 'Premium Design System',
      description: 'Built with violet semantic tokens and shadcn/ui primitives for consistent, accessible styling across all components.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: 'Smooth Motion',
      description: 'Framer Motion-powered animations with reduced-motion support and purposeful micro-interactions that feel premium.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M13.5 4.5L21 12m-7.5 7.5L12 12m7.5-7.5L4.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      title: 'Type-Safe Development',
      description: 'Full TypeScript support with inferred types and sensible defaults so your code is robust from day one.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      title: 'Dark Mode Ready',
      description: 'Automatic theme detection with CSS custom properties for seamless light/dark transitions.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.708-.707m.708-.707l.708.707M6.343 6.343l-.708-.707m.708.707l.708-.707zM12 8a4 4 0 100 8 4 4 0 000-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      title: 'Accessible by Default',
      description: 'Keyboard navigation, focus states, ARIA attributes, and screen reader support built into every component.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 001.51-1H4.99A2 2 0 013 15a2 2 0 012-2h.09a1.65 1.65 0 001-1.51V7a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001.51 1H19a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82z" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 md:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4 bg-violet-500/10 text-violet-300 border-violet-500/20">
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A complete toolkit for building production-ready documentation sites.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, i) => (
            <FeatureCard key={i} {...feature} delay={0.1 + i * 0.1} />
          ))}
        </div>

        {/* Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 overflow-hidden"
        >
          <div className="flex gap-6 animate-marquee">
            {[...features, ...features].map((feature, i) => (
              <motion.div key={i} className="flex-shrink-0 px-8 py-4 rounded-full bg-muted/50 border border-border/30">
                <span className="text-sm text-muted-foreground">{feature.title}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-500 p-8 md:p-16 text-center">
        {/* Animated background elements */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-24 h-24 bg-white/10 rounded-full blur-xl"
            initial={{ x: Math.random() * 600 - 300, y: Math.random() * 400 - 200, scale: 0.5 }}
            animate={{ 
              x: [Math.random() * 600 - 300, (Math.random() + 1) * 600 - 300],
              y: [Math.random() * 400 - 200, (Math.random() + 1) * 400 - 200],
            }}
            transition={{ duration: 20 + i * 5, repeat: Infinity, ease: 'linear' }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to start?</h2>
          <p className="text-lg/relaxed text-violet-100 mb-8 max-w-xl mx-auto">
            Get started with our template today. No credit card required.
          </p>

          <form className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <Input
              type="email"
              placeholder="Enter your email"
              className="w-full h-12 px-4 rounded-full bg-white/90 backdrop-blur-sm border-0 focus:ring-2 focus:ring-violet-300 text-gray-800 placeholder:text-gray-500"
            />
            <Button size="lg" className="h-12 px-6 rounded-full bg-white text-violet-700 hover:bg-violet-50 font-semibold">
              Get Started
            </Button>
          </form>

          <p className="text-sm text-violet-200/80 mt-4">Free trial • Cancel anytime</p>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-border/30 bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
        <p>© 2024 Syntheon. All rights reserved.</p>
        <nav className="flex items-center gap-6">
          <a href="#" className="hover:text-violet-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-violet-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-violet-400 transition-colors">Contact</a>
        </nav>
      </div>
    </footer>
  );
}

export default function Home({ className }: HomeProps) {
  return (
    <>
      <CustomCursor />
      <main className={cn('min-h-screen bg-background', className)}>
        <Hero />
        <Features />
        <CTA />
