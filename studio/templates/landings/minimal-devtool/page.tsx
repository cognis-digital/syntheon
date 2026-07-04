'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Terminal, Zap, Shield, Layers, Cpu, Globe, 
  ChevronRight, CheckCircle2, Star, Menu, X, ArrowUpRight,
  Github, Twitter, Linkedin, Discord, Mail
} from 'lucide-react';

// Design tokens via Tailwind utility classes
const colors = {
  primary: 'hsl(260, 75%, 48%)',
  secondary: 'hsl(260, 70%, 60%)',
  accent: 'hsl(260, 85%, 70%)',
};

// Animation variants for consistent motion patterns
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delayChildren: i * 0.1, staggerChildren: 0.05 }
  })
};

// Navigation component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Docs', href: '#' },
    { name: 'Blog', href: '#' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/30"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2"
          >
            <Terminal className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl tracking-tight">Syntheon</span>
          </motion.a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Sign in
            </a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-secondary transition-colors"
            >
              Get started
            </motion.button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted/50"
            aria-label="Toggle menu"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="md:hidden border-t border-border/30 bg-background"
          >
            <div className="p-4 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-sm py-2 text-muted-foreground hover:text-primary"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-border/30 space-y-3">
                <a href="#" className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  <span className="text-sm font-medium">Sign in</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <button className="w-full px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium">
                  Get started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Hero section with parallax and scroll animations
const Hero = () => {
  const { scrollY } = useScroll();
  const heroRef = useInView({ once: true });

  const y1 = useTransform(scrollY, [0, 500], [0, -20]);
  const opacity1 = useTransform(scrollY, [0, 300], [1, 0.7]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        style={{ y: y1, opacity: opacity1 }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px]" />
      </motion.div>

      {/* Content */}
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/30 text-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-muted-foreground">v2.0 is now live</span>
        </motion.div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
          <span className="bg-gradient-to-b from-primary to-secondary bg-clip-text text-transparent">
            Build faster.
          </span>
          <br />
          Ship smarter.
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          The developer-first platform that gives you the tools, templates, and infrastructure to build premium experiences without the complexity.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-xl bg-primary text-white font-medium hover:bg-secondary transition-colors"
          >
            Start building free
          </motion.button>
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-xl bg-muted border border-border text-primary font-medium hover:bg-muted/80 transition-colors flex items-center justify-center gap-2"
          >
            <Terminal className="w-4 h-4" />
            Read the docs
          </motion.a>
        </div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8"
        >
          <div className="flex -space-x-3">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1, type: 'spring' }}
                className="w-12 h-12 rounded-full border-2 bg-background"
              />
            ))}
          </div>
          <p className="text-muted-foreground text-sm">
            Trusted by <span className="font-semibold text-primary">10,000+</span> developers at companies like Stripe, Vercel, and Linear.
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-6 rounded-full border-2 border-border"
          />
          <span className="text-xs">Scroll to explore</span>
        </div>
      </motion.div>
    </section>
  );
};

// Feature card component
const FeatureCard = ({ icon: Icon, title, description, delay }: { icon: any; title: string; description: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay, ease: [0.2, 0.8, 0.2, 1] }}
    className="group p-6 rounded-2xl bg-card border border-border/30 hover:border-primary/30 hover:bg-muted/40 transition-all duration-300"
  >
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
);

// Features section
const Features = () => {
  const features = [
    { icon: Zap, title: 'Lightning Fast', description: 'Built with Next.js 15 and React Server Components for instant load times.' },
    { icon: Shield, title: 'Enterprise Security', description: 'SOC2 Type II certified infrastructure with end-to-end encryption.' },
    { icon: Layers, title: 'Modern Stack', description: 'TypeScript, Tailwind CSS, and shadcn/ui out of the box.' },
    { icon: Cpu, title: 'Edge Computing', description: 'Deploy globally on our edge network for low-latency performance.' },
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Everything you need to ship
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A complete platform for modern development teams.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={i} {...feature} delay={0.1 + i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Pricing card component
const PricingCard = ({ tier, price, features, recommended }: { tier: string; price: string; features: string[]; recommended?: boolean }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={cn(
      'relative p-8 rounded-3xl bg-card border',
      recommended ? 'border-primary ring-2 ring-primary/20' : 'border-border/30'
    )}
  >
    {recommended && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white text-xs font-medium">
        Most popular
      </div>
    )}
    <h3 className="text-lg font-semibold mb-2">{tier}</h3>
    <p className="text-4xl font-bold mb-6">{price}</p>
    <ul className="space-y-3 mb-8">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
          {feature}
        </li>
      ))}
    </ul>
    <button className={cn(
      'w-full py-3 rounded-xl font-medium transition-colors',
      recommended ? 'bg-primary text-white hover:bg-secondary' : 'bg-muted border border-border hover:bg-muted/80'
    )}>
      Get started
    </button>
  </motion.div>
);

// Pricing section
const Pricing = () => {
  const plans = [
    { tier: 'Hobby', price: '$0', features: ['Up to 3 projects', 'Community support', '5GB storage'] },
    { tier: 'Pro', price: '$19', features: ['Unlimited projects', 'Priority email support', '50GB storage', 'Custom domains'], recommended: true },
    { tier: 'Team', price: '$49', features: ['Everything in Pro', 'Collaborative editing', 'SSO & SAML', 'Dedicated success manager'] },
  ];

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start for free, upgrade as you grow. No hidden fees.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PricingCard key={plan.tier} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA section
const CTA = () => (
  <section className="py-24 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/10 p-12 sm:p-16"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWgydjJIMUMxeTIgMHYtMnptMiAyIGgxdjJIMUMxeTIgMHYtMnptMiAyIGgxdjJIMUMxeTIgMHYtMnptMiAyIGgxdjJIMUMxeTIgMHYtMnptMSA1aDF2MWgyLTF6bS0xIDVoMXYyaC0ydjF6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBvcGFjaXR5PSIxIi8+PC9zdmc+')]" className="opacity-30" />
        
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
            Ready to build something amazing?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto">
            Join thousands of developers who have already transformed their workflow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-xl bg-primary text-white font-medium hover:bg-secondary transition-colors"
            >
              Start building free
            </motion.button>
            <a href="#" className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-muted border border-border text-primary font-medium hover:bg-muted/80 transition-colors">
              <Terminal className="w-4 h-4" />
              View the docs
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

// Footer component
const Footer = () => {
