'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  ArrowRight, CheckCircle2, Zap, Shield, Globe, 
  Menu, X, ChevronDown, ChevronUp, Star, TrendingUp,
  Lock, Users, BarChart3, Layers
} from 'lucide-react';

// --- Types & Interfaces ---

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

interface TestimonialProps {
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  quote: string;
  rating: number;
  delay?: number;
}

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  delay?: number;
}

// --- Constants & Data ---

const FEATURES = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Lightning Fast",
    description: "Built on edge networks for sub-100ms global response times."
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Bank-Grade Security",
    description: "SOC2 Type II certified with end-to-end encryption by default."
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Global Scale",
    description: "Auto-scaling infrastructure that grows with your user base."
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: "Developer First",
    description: "Type-safe APIs, comprehensive SDKs, and instant onboarding."
  }
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "CTO",
    company: "TechFlow Inc.",
    avatarUrl: "/avatars/sarah.jpg",
    quote: "We migrated our entire stack to Bold in 3 weeks. Performance improved by 40% and development velocity doubled.",
    rating: 5,
    delay: 0
  },
  {
    name: "Marcus Rodriguez",
    role: "VP Engineering",
    company: "FinCore Systems",
    avatarUrl: "/avatars/marcus.jpg",
    quote: "The developer experience is unmatched. Our team ships features faster than ever before.",
    rating: 5,
    delay: 0.2
  },
  {
    name: "Elena Volkov",
    role: "Head of Product",
    company: "Streamline Labs",
    avatarUrl: "/avatars/elena.jpg",
    quote: "Customer support is legendary. They don't just solve problems—they anticipate them.",
    rating: 5,
    delay: 0.4
  }
];

const PRICING = [
  {
    name: "Starter",
    price: "$29",
    description: "Perfect for early-stage startups and MVPs.",
    features: ["Up to 10k monthly active users", "Basic analytics dashboard", "Email support", "Single project workspace"],
    cta: "Start Free Trial",
    highlight: false,
    delay: 0
  },
  {
    name: "Growth",
    price: "$99",
    description: "For scaling teams ready to accelerate.",
    features: ["Up to 100k monthly active users", "Advanced analytics & reporting", "Priority email support", "3 project workspaces", "Custom domain support"],
    cta: "Start Free Trial",
    highlight: true,
    delay: 0.2
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for large organizations.",
    features: ["Unlimited users & projects", "Dedicated success manager", "24/7 phone support", "SLA guarantees", "On-premise deployment options"],
    cta: "Contact Sales",
    highlight: false,
    delay: 0.4
  }
];

// --- Helper Components ---

const SectionHeading = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.h2 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-5%" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className={cn(
      "text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-8",
      className
    )}
  >
    {children}
  </motion.h2>
);

const FeatureCard = ({ icon, title, description, delay }: FeatureProps) => {
  const ref = useInView({ once: true, margin: "-50%" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ 
        duration: 0.5, 
        ease: "easeOut",
        delay: delay || 0.1 * (FEATURES.indexOf({ icon } as any) + 1),
        staggerChildren: 0.1
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "group relative p-6 rounded-xl border bg-card/50 backdrop-blur-sm",
        "hover:border-primary/30 hover:bg-card transition-colors duration-300"
      )}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="mb-4 inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          {icon}
        </div>
        
        <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>

      <motion.div 
        className="absolute inset-0 rounded-xl border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        initial={{ scale: 1.02 }}
        whileHover={{ scale: 1 }}
      />
    </motion.div>
  );
};

const TestimonialCard = ({ name, role, company, avatarUrl, quote, rating, delay }: TestimonialProps) => {
  const ref = useInView({ once: true, margin: "-30%" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ duration: 0.5, delay: delay || 0 }}
      className="relative p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors duration-300"
    >
      <div className="flex items-center gap-4 mb-4">
        <img 
          src={avatarUrl} 
          alt={name}
          className="h-12 w-12 rounded-full object-cover border-2 border-primary/20"
        />
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">{role}, {company}</p>
        </div>
      </div>

      <blockquote className="relative mb-4">
        <span className="absolute -top-1.5 -left-2.5 text-6xl text-primary opacity-20 select-none">"</span>
        <p className="text-foreground leading-relaxed relative z-10">{quote}</p>
      </blockquote>

      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
          />
        ))}
      </div>
    </motion.div>
  );
};

const PricingCard = ({ name, price, description, features, cta, highlight, delay }: PricingTierProps) => {
  const ref = useInView({ once: true, margin: "-30%" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ duration: 0.5, delay: delay || 0 }}
      className={cn(
        "relative p-8 rounded-2xl border bg-card/60 backdrop-blur-sm flex flex-col",
        highlight 
          ? "border-primary ring-1 ring-primary/20 shadow-xl shadow-primary/10 scale-105 z-10" 
          : "border-border/50 hover:border-primary/30 hover:bg-card transition-all duration-300"
      )}
    >
      {highlight && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-xs font-semibold text-primary-foreground shadow-lg">
          Most Popular
        </div>
      )}

      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      
      <div className="mb-6">
        <span className="text-4xl font-bold tracking-tight">{price}</span>
        {price !== "Custom" && <span className="text-muted-foreground ml-1">/month</span>}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary/60" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button 
        className={cn(
          "w-full py-3 px-5 rounded-lg font-medium transition-all duration-200",
          highlight 
            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25" 
            : "border border-border bg-background text-foreground hover:border-primary/50 hover:shadow-md"
        )}
      >
        {cta}
      </button>
    </motion.div>
  );
};

// --- Main Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        isScrolled 
          ? "bg-background/80 backdrop-blur-xl border-b border-border/30 py-4" 
          : "py-6 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.a 
            href="#" 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary via-secondary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Bold</span>Startup
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden md:flex items-center gap-8"
          >
            {["Features", "Solutions", "Pricing", "Resources"].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </motion.div>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "hidden md:flex items-center justify-center px-5 py-2.5 rounded-lg font-medium transition-all duration-200",
                isScrolled 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25" 
                  : "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30"
              )}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </motion.button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden py-4 border-t border-border/30 bg-background/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="flex flex-col gap-4 px-2">
                {["Features", "Solutions", "Pricing", "Resources"].map((item) => (
                  <a 
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-muted-foreground hover:text-primary py-2"
                  >
                    {item}
                  </a>
                ))}
                <button 
                  className={cn(
                    "w-full mt-2 py-3 rounded-lg font-medium transition-all",
                    isScrolled 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                      : "bg-primary/10 text-primary border border-primary/30"
                  )}
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

const Hero = () => {
  const containerRef = useInView({ once: true, margin: "-10%" });
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      {/* Animated Background */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute inset-0 -z-20"
      >
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        
        {/* Animated Orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 - 50, 
              y: Math.random() * 100 - 50,
              scale: 0.2 + Math.random() * 0.3,
              opacity: 0.1 + Math.random() * 0.1
            }}
            animate={{ 
              x: [null, null],
              y: [null, null],
              scale: [0.2 + Math.random() * 0.3, 0.5 + Math.random() * 0.3, 0.2 + Math.random() * 0.3],
            }}
            transition={{ 
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute rounded-full blur-3xl"
            style={{
              width: 400 + i * 80,
              height: 400 + i * 80,
              background: `radial-gradient(circle at center, ${['#7c3aed', '#db2777', '#a855f7'][i % 3]} / 1px, transparent 60%)`,
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
