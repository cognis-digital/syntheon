'use client';

import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Zap, Sparkles, ShieldCheck, Globe, Users, Star, ChevronDown, Menu, X, MousePointer2 } from 'lucide-react';

// --- Types & Interfaces ---

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface PricingTierProps {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

// --- Design Tokens & Constants ---

const COLORS = {
  primary: 'hsl(265, 80%, 60%)',
  secondary: 'hsl(210, 90%, 70%)',
  accent: 'hsl(340, 85%, 65%)',
};

const ANIMATION_VARIANTS = {
  container: (delay = 0) => ({
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, delay, ease: [0.25, 1, 0.5, 1] }
    }
  }),
  stagger: (delay = 0) => ({
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.4, delay, staggerChildren: 0.1 }
    }
  }),
};

// --- Components ---

const CursorTrail = () => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  
  React.useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    document.addEventListener('mousemove', updatePosition);
    return () => document.removeEventListener('mousemove', updatePosition);
  }, []);

  if (!useReducedMotion()) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-50 w-8 h-8 rounded-full border-2 border-white/30"
      animate={{ 
        x: position.x - 16, 
        y: position.y - 16,
        scale: [1, 1.2, 1],
        opacity: [0.5, 0.8, 0.5]
      }}
      transition={{ 
        duration: 0.4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

const FeatureCard = ({ icon, title, description }: FeatureProps) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="group relative p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </motion.div>
    </motion.div>
  );
};

const PricingCard = ({ name, price, features, highlighted }: PricingTierProps) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: highlighted ? 0.2 : 0 }}
      className={cn(
        "relative p-6 rounded-3xl border backdrop-blur-sm transition-all",
        highlighted 
          ? "bg-background/80 border-primary shadow-xl shadow-primary/10 scale-105" 
          : "bg-background/40 border-border hover:border-primary/50"
      )}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-accent to-secondary text-white text-xs font-semibold rounded-full">
          Most Popular
        </div>
      )}

      <h3 className="text-xl font-bold text-foreground mb-2">{name}</h3>
      
      <div className="mb-4">
        <span className="text-3xl font-bold text-primary">{price}</span>
        <span className="text-muted-foreground ml-1">/month</span>
      </div>

      <ul className="space-y-2 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button 
        className={cn(
          "w-full py-3 rounded-xl font-semibold transition-all",
          highlighted 
            ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25" 
            : "bg-background border border-border text-foreground hover:border-primary/50"
        )}
      >
        Get Started
      </button>
    </motion.div>
  );
};

const SocialProof = () => {
  const companies = [
    'Acme Corp', 'Globex Inc', 'Soylent Corp', 'Initech', 'Umbrella Corp'
  ];

  return (
    <div className="py-12 border-y border-border/50">
      <p className="text-center text-sm text-muted-foreground mb-6 uppercase tracking-wider">
        Trusted by innovative teams worldwide
      </p>
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
      >
        {companies.map((company, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-lg font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            {company}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// --- Main Page Component ---

export default function PlayfulConsumerLanding() {
  const { scrollY } = useScroll();
  
  // Parallax transforms for hero elements
  const parallaxY1 = useTransform(scrollY, [0, 500], [0, -60]);
  const parallaxY2 = useTransform(scrollY, [0, 800], [0, 30]);

  // Section visibility for animations
  const heroRef = React.useRef(null);
  const featuresRef = React.useRef(null);
  
  const heroInView = useInView(heroRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true });

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Custom Cursor */}
      <CursorTrail />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Syntheon</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center gap-8"
          >
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Pricing</a>
            <button className="px-5 py-2 rounded-xl bg-primary/10 border border-border text-sm font-semibold text-primary hover:bg-primary/20 transition-colors">
              Sign In
            </button>
          </motion.div>

          {/* Mobile menu toggle */}
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 rounded-lg border border-border hover:bg-background/50"
          >
            <Menu />
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden"
      >
        {/* Animated gradient background */}
        <motion.div 
          style={{ y: parallaxY1 }}
          className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background"
        />
        
        {/* Floating orbs for depth */}
        <motion.div 
          style={{ y: parallaxY2, x: 100 }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-[100px]"
        />
        
        <motion.div 
          style={{ y: parallaxY2, x: -150 }}
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-96 h-96 rounded-full bg-accent/20 blur-[100px]"
        />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          {/* Animated badge */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border mb-8"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">✨ Now with AI-powered features</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Create with joy.
            </span>
            <br />
            <span className="text-foreground/80">Build without limits.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            The playful-consumer platform that combines creative freedom with 
            production-ready tools. Start your journey today.
          </motion.p>

          {/* CTA buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="group px-8 py-4 rounded-2xl bg-primary text-white font-semibold text-lg hover:bg-primary/90 transition-colors shadow-xl shadow-primary/30">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="px-8 py-4 rounded-2xl bg-background border border-border text-foreground font-semibold text-lg hover:border-primary/50 transition-colors">
              Watch Demo
            </button>
          </motion.div>

          {/* Hero image/visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            
            {/* Abstract visual representation */}
            <motion.div 
              animate={{ rotate: [0, 5] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full aspect-video rounded-3xl overflow-hidden border border-border/50 shadow-2xl bg-background/40 backdrop-blur-sm"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Grid pattern */}
                <div className="w-full h-full opacity-10" 
                  style={{ 
                    backgroundImage: 'radial-gradient(circle, currentColor 2px, transparent 2.5px)',
                    backgroundSize: '40px 40px',
                    color: COLORS.primary
                  }} 
                />
                
                {/* Floating elements */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0.3, 0.6, 0.3],
                      x: Math.sin(i * 1.5) * 40,
                      y: Math.cos(i * 2.3) * 40,
                      scale: [0, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 3 + i * 0.2,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                    className="absolute w-16 h-16 rounded-2xl bg-primary/20 backdrop-blur-sm border border-border/30 flex items-center justify-center"
                  >
                    <Sparkles className="w-6 h-6 text-accent" />
                  </motion.div>
                ))}

                {/* Center content */}
                <div className="z-10 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 shadow-xl shadow-primary/30">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Ready to create?</h3>
                  <p className="text-muted-foreground mt-2">Join 50,000+ creators today</p>
                </div>
              </div>
            </motion.div>

            {/* Decorative elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-8 top-1/2 w-64 h-64 rounded-full bg-primary/10 blur-[50px]"
            />
          </motion.div>

          {/* Scroll indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground"
          >
            <span className="text-sm">Scroll to explore</span>
            <motion.div 
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center"
            >
              <div className="w-1.5 h-1.5 bg-current rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        ref={featuresRef}
        id="features"
        className="py-24 relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Built for <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">creativity</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Everything you need to bring your ideas to life, with tools designed for the modern creator.
            </p>
          </motion.div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-5 h-5" />,
                title: "Lightning Fast",
                description: "Optimized performance that keeps your workflow smooth and responsive."
              },
