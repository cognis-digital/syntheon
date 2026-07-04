'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { 
  ShieldCheck, Lock, Globe, Zap, CheckCircle2, ArrowRight, 
  Menu, X, ChevronDown, Star, TrendingUp, Users, BarChart3
} from 'lucide-react'

// ============ TYPES & CONSTANTS ============

type SectionProps = {
  id?: string
  className?: string
  children: React.ReactNode
}

const SECTION_HEIGHT = 100
const PARALLAX_FACTOR = 0.5

// ============ UTILITY HOOKS ============

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mediaQuery.matches)
    
    const handler = () => setReduced(mediaQuery.matches)
    mediaQuery.addEventListener('change', handler)
    
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])
  
  return reduced
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(Math.min(Math.max((window.scrollY / totalHeight), 0), 1))
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return progress
}

// ============ ANIMATION VARS ============

const variants = {
  container: {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.15 }
    }
  },
  item: {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  heroText: {
    hidden: { opacity: 0, y: 80 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.2 }
    }
  },
  heroImage: {
    hidden: { scale: 0.95, rotateX: 10 },
    visible: { 
      scale: 1, 
      rotateX: 0,
      transition: { duration: 1.2, ease: "easeOut" }
    }
  },
  featureItem: {
    hidden: { opacity: 0, y: 50, x: -30 },
    visible: (i: number) => ({
      opacity: 1, 
      y: 0, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: i * 0.1 }
    })
  },
  pricingCard: {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
}

// ============ COMPONENTS ============

function Section({ id, className, children }: SectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: "-10%" })
  
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : ""}
      variants={variants.container}
      id={id}
      className={cn(
        "relative",
        id && `scroll-mt-[${SECTION_HEIGHT}px]`,
        className
      )}
    >
      {children}
    </motion.section>
  )
}

function FeatureItem({ 
  icon: Icon, 
  title, 
  description, 
  index 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  index: number 
}) {
  return (
    <motion.div
      variants={variants.featureItem}
      initial="hidden"
      animate="visible"
      custom={index}
      className="group relative p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
      
      <motion.div 
        whileHover={{ scale: 1.1, rotate: [0, -3, 0] }}
        className="relative z-10 mb-4 p-3 bg-primary/10 rounded-lg border border-border group-hover:bg-primary/20 transition-colors duration-300"
      >
        <Icon className="w-6 h-6 text-primary" />
      </motion.div>
      
      <h3 className="relative z-10 text-xl font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      <p className="relative z-10 text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}

function PricingCard({ 
  tier, 
  price, 
  features, 
  recommended = false 
}: { 
  tier: string; 
  price: number | string; 
  features: string[]; 
  recommended?: boolean 
}) {
  return (
    <motion.div
      variants={variants.pricingCard}
      initial="hidden"
      animate="visible"
      className={cn(
        "relative p-6 rounded-2xl border bg-card",
        recommended && "border-primary ring-1 ring-primary/50 shadow-lg shadow-primary/10"
      )}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm font-medium rounded-full">
          Most Popular
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-foreground mb-2">{tier}</h3>
      
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-4xl font-bold text-foreground">{price}</span>
        <span className="text-muted-foreground">/month</span>
      </div>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button 
        className={cn(
          "w-full py-3 px-6 rounded-lg font-medium transition-all duration-300",
          recommended 
            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25" 
            : "bg-background border border-border text-foreground hover:border-primary/50"
        )}
      >
        Get Started
      </button>
    </motion.div>
  )
}

function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  
  return (
    <span 
      ref={ref} 
      className="inline-block"
      style={{ overflow: "hidden", display: "inline-block" }}
    >
      <motion.span
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="inline-block"
      >
        {value}
      </motion.span>
    </span>
  )
}

// ============ MAIN PAGE ============

export default function EnterpriseTrustPage() {
  const reducedMotion = useReducedMotion()
  const scrollProgress = useScrollProgress()
  
  // Parallax effect for hero background
  const parallaxY = useTransform(
    scrollProgress, 
    [0, 1], 
    [-50, -200]
  )

  return (
    <main className="min-h-screen bg-background">
      {/* Custom Cursor */}
      {!reducedMotion && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        >
          <div 
            className="w-8 h-8 rounded-full border border-primary/50 absolute -translate-x-1/2 -translate-y-1/2"
            style={{ 
              top: '50%', 
              left: '50%', 
              filter: 'blur(4px)',
              transform: 'translate(-50%, -50%) scale(var(--cursor-scale, 1))' 
            }}
          />
        </motion.div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ rotate: 5 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/40 to-primary/60 flex items-center justify-center"
            >
              <ShieldCheck className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="font-semibold text-foreground">Syntheon</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Solutions', 'Pricing', 'Resources'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-border text-foreground hover:bg-primary/20 transition-colors"
          >
            <span className="text-sm font-medium">Sign In</span>
            <ArrowRight className="w-3 h-3" />
          </motion.button>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-muted-foreground hover:text-foreground">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <Section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24">
        {/* Animated Background Gradient */}
        <motion.div 
          style={{ y: parallaxY }}
          className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background"
        />
        
        {/* Floating Elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 15, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
            className="absolute w-24 h-24 rounded-full bg-primary/5 blur-xl"
            style={{
              left: `${10 + i * 15}%`,
              top: `${10 + (i % 3) * 20}%`
            }}
          />
        ))}

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            variants={variants.heroText}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              variants={variants.heroText}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-border mb-8"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm text-muted-foreground">Now in public beta</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <motion.span
                variants={variants.heroText}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Enterprise-grade
              </motion.span>
              <br />
              <motion.span
                variants={variants.heroText}
                className="bg-gradient-to-r from-primary via-primary/80 to-primary text-transparent bg-clip-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Security by Design
              </motion.span>
            </h1>

            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Build applications with military-grade encryption, SOC 2 compliance, and zero-trust architecture out of the box.
            </p>

            <motion.div
              variants={variants.heroText}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-3 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow duration-300"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-background border border-border text-foreground font-medium hover:border-primary/50 transition-colors"
              >
                Book a Demo
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              variants={variants.heroText}
              className="mt-16 pt-8 border-t border-border/50"
            >
              <p className="text-sm text-muted-foreground mb-4">Trusted by security teams at</p>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {['Acme Corp', 'GlobalBank', 'TechFlow', 'SecureNet'].map((name) => (
                  <motion.span 
                    key={name}
                    whileHover={{ scale: 1.1 }}
                    className="text-lg font-semibold text-muted-foreground"
                  >
                    {name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground"
        >
          <span className="text-sm">Scroll to explore</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </Section>

      {/* Features Section */}
      <Section id="features" className="py-24 md:py-32 bg-muted/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={variants.container}
            initial="hidden"
            animate="visible"
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Built for <span className="text-primary">Enterprise Scale</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Every component is engineered with security, performance, and developer experience at the forefront.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Zero-Trust Architecture",
                description: "Every request is authenticated and authorized. No implicit trust, ever."
              },
              {
                icon: Lock,
                title: "End-to-End Encryption",
                description: "AES-256 encryption at rest and in transit. Keys managed by your team."
              },
              {
                icon: Globe,
                title: "Global Redundancy",
                description: "Multi-region deployment with automatic failover and active-active replication."
              },
              {
                icon: Zap,
                title: "Sub-Millisecond Latency",
                description: "Edge-optimized delivery network ensures fast responses worldwide."
              },
              {
                icon: CheckCircle2,
                title: "SOC 2 & ISO 27001",
                description: "Compliance built-in. Audit-ready reports with a single click."
              },
              {
                icon: TrendingUp,
                title: "Real-Time Analytics",
                description: "Monitor threats and performance with live dashboards and alerts."
              }
            ].map((feature, i) => (
              <FeatureItem key={i} {...feature} index={i} />
            ))}
          </div>

          {/* Feature Highlight */}
          <motion.div 
            variants={variants.container}
            initial="hidden"
            animate="visible"
            className="mt-16 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-background border border-border overflow-hidden"
          >
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-2xl font-semibold text-foreground mb-4">
