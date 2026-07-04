'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, CheckCircle2, Zap, Shield, Globe, Layers, 
  Code, Cpu, BarChart3, Users, Sparkles, Menu, X,
  ChevronDown, Star, TrendingUp, Lock
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ DESIGN TOKENS & UTILITIES ============

const tokens = {
  colors: {
    background: '#0a0a0f',
    foreground: '#fafafa',
    primary: '#8b5cf6',
    primaryForeground: '#ffffff',
    muted: '#1e1e24',
    mutedForeground: '#9ca3af',
    border: '#2d2d35',
    card: '#121217',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem',
    xxxl: '6rem',
  },
  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    full: '9999px',
  },
}

const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ')

// ============ HOOKS & UTILITIES ============

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReduced(mediaQuery.matches)
      
      const handler = () => setReduced(mediaQuery.matches)
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
  }, [])
  
  return reduced
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight
        setProgress(Math.min((window.scrollY / totalHeight) * 100, 100))
      }
      
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  return progress
}

// ============ UI COMPONENTS ============

function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  as: Component = 'button',
  ...props 
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  className?: string
  as?: any
  [key: string]: any
}) {
  const base = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-primary text-primaryForeground hover:bg-primary/90 shadow-lg shadow-primary/25",
    secondary: "bg-card border border-border hover:border-primary/50",
    ghost: "text-mutedForeground hover:text-foreground hover:bg-muted/50",
    outline: "border border-border bg-transparent hover:bg-card",
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3.5 text-lg",
    icon: "p-2.5",
  }
  
  return (
    <Component 
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Component>
  )
}

function Section({ 
  children, 
  className,
  id,
  ...props 
}: {
  children: React.ReactNode
  className?: string
  id?: string
  [key: string]: any
}) => (
  <section 
    id={id}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    {children}
  </section>
)

// ============ LAYOUT COMPONENTS ============

function Navbar({ progress }: { progress: number }) {
  const reduced = useReducedMotion()
  
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        reduced ? "" : "backdrop-blur-xl bg-background/70 border-b border-border/30"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Syntheon
            </span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'Reviews'].map((item, i) => (
              <motion.a 
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="text-sm text-mutedForeground hover:text-foreground transition-colors"
              >
                {item}
              </motion.a>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            {progress > 80 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "var(--nav-progress)" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="h-1 bg-primary rounded-full overflow-hidden"
                style={{ "--nav-progress": `${progress - 80}%` } as React.CSSProperties}
              />
            )}
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  )
}

// ============ HERO SECTION ============

function Hero() {
  const reduced = useReducedMotion()
  
  return (
    <Section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/50 to-background" />
      
      {/* Gradient Orbs */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[128px]"
      />
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, -45, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[128px]"
      />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "4rem 4rem",
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 mb-8"
        >
          <span className="flex h-2 w-2 relative">
            <motion.span 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-primary rounded-full"
            />
          </span>
          <span className="text-sm text-mutedForeground">Now in public beta</span>
        </motion.div>
        
        <h1 className={cn(
          "text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8",
          reduced ? "" : "bg-gradient-to-b from-white via-white to-mutedForeground bg-clip-text text-transparent"
        )}>
          Build faster with{" "}
          <motion.span 
            className="text-primary"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            intelligence
          </motion.span>
        </h1>
        
        <p className="text-xl text-mutedForeground max-w-2xl mx-auto mb-12 leading-relaxed">
          Syntheon combines the power of modern frameworks with AI-driven insights to help you ship production-ready applications in record time.
        </p>
        
        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button variant="primary" size="lg" as="a" href="#" className="group">
            Start Building Free
            <motion.div 
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="ml-2 group-hover:translate-x-1"
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </Button>
          
          <Button variant="secondary" size="lg">
            View Documentation
          </Button>
        </motion.div>
        
        {/* Social Proof */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20"
        >
          <p className="text-sm text-mutedForeground mb-6">Trusted by teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50 grayscale transition-all duration-300 hover:grayscale-0 hover:opacity-100">
            {['Acme Corp', 'GlobalTech', 'Nebula Inc', 'Polaris'].map((company, i) => (
              <motion.div 
                key={company}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="text-lg font-semibold text-mutedForeground"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      {!reduced && (
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-border flex items-center justify-center">
            <motion.div 
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-3 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      )}
    </Section>
  )
}

// ============ FEATURES SECTION ============

function Features() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with zero-runtime overhead. Every millisecond counts.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and compliance built-in from day one.",
    },
    {
      icon: Globe,
      title: "Global Distribution",
      description: "Edge network with 200+ locations for low-latency worldwide access.",
    },
    {
      icon: Layers,
      title: "Modular Architecture",
      description: "Composable components that work together seamlessly.",
    },
    {
      icon: Code,
      title: "Developer Experience",
      description: "Intuitive APIs and comprehensive documentation for rapid development.",
    },
    {
      icon: Cpu,
      title: "AI-Powered Insights",
      description: "Smart recommendations that learn from your usage patterns.",
    },
  ]

  return (
    <Section id="features" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Built for{" "}
            <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              performance
            </span>
          </h2>
          <p className="text-lg text-mutedForeground max-w-xl mx-auto">
            Every detail has been meticulously crafted to deliver an exceptional developer experience and production-ready results.
          </p>
        </motion.div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-6 rounded-xl bg-card border border-border/30 hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-mutedForeground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ============ SOCIAL PROOF SECTION ============

function SocialProof() {
  const stats = [
    { value: "99.9%", label: "Uptime SLA", icon: CheckCircle2 },
    { value: "10M+", label: "API Requests/Day", icon: BarChart3 },
    { value: "50K+", label: "Active Users", icon: Users },
    { value: "4.9/5", label: "App Store Rating", icon: Star },
  ]

  return (
    <Section className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
