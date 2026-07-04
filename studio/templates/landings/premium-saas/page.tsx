'use client'

import { useEffect, useState, useScroll, useTransform, useInView } from 'framer-motion'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ChevronRight, CheckCircle2, Zap, Shield, Sparkles, ArrowRight, Menu, X, Star, Globe, Lock, Users, TrendingUp } from 'lucide-react'

// --- Types & Interfaces ---

interface FeatureProps {
  icon: React.ReactNode
  title: string
  description: string
}

interface TestimonialProps {
  name: string
  role: string
  company: string
  content: string
  avatar?: string
}

interface PricingTierProps {
  name: string
  price: string
  period: string
  features: string[]
  highlighted?: boolean
}

// --- Constants & Data ---

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#pricing', label: 'Pricing' },
]

const FEATURES_DATA: FeatureProps[] = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Lightning Fast',
    description: 'Built on edge networks for sub-100ms global latency.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Enterprise Security',
    description: 'SOC2 Type II certified with end-to-end encryption.',
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: 'AI-Powered Insights',
    description: 'Predictive analytics that scale with your business.',
  },
]

const TESTIMONIALS_DATA: TestimonialProps[] = [
  {
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'TechFlow Inc.',
    content: 'The platform completely transformed how we handle customer data. Performance is unmatched in the industry.',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'VP of Engineering',
    company: 'Streamline Systems',
    content: 'We migrated our entire stack and saw a 300% improvement in deployment times within weeks.',
  },
]

const PRICING_DATA: PricingTierProps[] = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    features: ['Up to 1,000 users', 'Basic analytics', 'Email support', '3 integrations'],
  },
  {
    name: 'Professional',
    price: '$79',
    period: '/month',
    highlighted: true,
    features: [
      'Up to 10,000 users',
      'Advanced analytics & reporting',
      'Priority support',
      'Unlimited integrations',
      'Custom domains',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: [
      'Unlimited users',
      'Dedicated infrastructure',
      '24/7 phone support',
      'SLA guarantees',
      'On-premise option',
    ],
  },
]

// --- Components ---

const AnimatedSection = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useInView({ threshold: 0.15, amount: 0.2 })
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("relative", className)}
      ref={ref}
    >
      {children}
    </motion.div>
  )
}

const FeatureCard = ({ feature }: { feature: FeatureProps }) => {
  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group p-6 rounded-xl border border-border bg-background hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
    >
      <div className="mb-4 inline-flex items-center justify-center h-12 w-12 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
        {feature.icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
      <p className="text-muted-foreground">{feature.description}</p>
    </motion.div>
  )
}

const PricingCard = ({ tier }: { tier: PricingTierProps }) => {
  const isHighlighted = tier.highlighted
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: isHighlighted ? 0.2 : 0 }}
      className={cn(
        "relative p-8 rounded-2xl border bg-background",
        isHighlighted 
          ? "border-primary/40 shadow-xl shadow-primary/10 scale-105" 
          : "border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
      )}
    >
      {isHighlighted && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-primary/80 text-background text-xs font-medium rounded-full">
          Most Popular
        </div>
      )}
      
      <h3 className="text-2xl font-bold text-foreground mb-2">{tier.name}</h3>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-4xl font-bold text-primary">{tier.price}</span>
        {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
      </div>
      
      <ul className="space-y-3 mb-8">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button 
        className={cn(
          "w-full py-3 px-6 rounded-lg font-medium transition-all duration-200",
          isHighlighted
            ? "bg-primary text-background hover:bg-primary/90"
            : "border border-border bg-background text-foreground hover:border-primary/50"
        )}
      >
        Get Started
      </button>
    </motion.div>
  )
}

const TestimonialCard = ({ testimonial }: { testimonial: TestimonialProps }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="p-6 rounded-xl border bg-muted/30"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-foreground">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
        </div>
      </div>
      <p className="text-muted-foreground italic">"{testimonial.content}"</p>
    </motion.div>
  )
}

// --- Main Page Component ---

export default function PremiumSaaSLanding() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Scroll animations for hero elements
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [-200, -400])
  const opacity1 = useTransform(scrollY, [0, 300], [1, 0.5])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Respect reduced motion preference
  const isReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <html lang="en" className="dark">
      <body>
        {/* Navigation */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: isScrolled ? 0 : -100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "fixed top-0 left-0 right-0 z-50",
            isScrolled 
              ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm" 
              : "bg-transparent"
          )}
        >
          <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-background font-bold text-sm">
                S
              </div>
              <span className="font-semibold text-xl tracking-tight">Syntheon</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a 
                  key={link.href} 
                  href={link.href} 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
              
              {/* CTA Button */}
              <button className="px-5 py-2.5 rounded-lg bg-primary text-background text-sm font-medium hover:bg-primary/90 transition-colors">
                Start Free Trial
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </nav>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl"
              >
                <div className="px-6 py-4 flex flex-col gap-4">
                  {NAV_LINKS.map((link) => (
                    <a 
                      key={link.href} 
                      href={link.href} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                  <button className="w-full py-3 rounded-lg bg-primary text-background font-medium">
                    Start Free Trial
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          {/* Background Effects */}
          <motion.div 
            style={{ y: y1, opacity: opacity1 }}
            className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background"
          />
          
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-[128px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-purple-500/10 blur-[128px]" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border mb-8">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">New: AI-Powered Analytics 2.0</span>
              </div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
              >
                <span className="bg-gradient-to-r from-primary via-purple-300 to-primary bg-clip-text text-transparent">
                  Build faster with
                </span>
                <br />
                <span className="text-foreground">confidence.</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
              >
                The all-in-one platform for teams who need speed without sacrificing quality. 
                Deploy production-ready applications in minutes, not days.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <button className="group px-8 py-4 rounded-xl bg-primary text-background font-semibold hover:bg-primary/90 transition-all duration-200">
                  Start Free Trial
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="px-8 py-4 rounded-xl border border-border bg-background text-foreground font-medium hover:border-primary/50 transition-all duration-200">
                  Watch Demo
                </button>
              </motion.div>

              {/* Hero Image / Screenshot */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-20 relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/10 to-primary/20 rounded-3xl blur-xl opacity-70" />
                <div className="relative rounded-2xl border border-border bg-background/80 backdrop-blur-xl shadow-2xl overflow-hidden">
                  {/* Placeholder for hero image */}
                  <div className="aspect-[16/9] flex items-center justify-center bg-muted/30">
                    <div className="text-center text-muted-foreground">
                      <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Hero Dashboard Preview</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Social Proof Logos */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-20"
              >
                <p className="text-sm text-muted-foreground mb-8">Trusted by teams at</p>
                <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
                  {['Acme Corp', 'GlobalTech', 'Nebula Inc', 'Polaris'].map((company) => (
                    <span key={company} className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-default">
                      {company}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
              >
                {[
                  { value: '10K+', label: 'Active Users' },
                  { value: '99.9%', label: 'Uptime SLA' },
                  { value: '250M', label: 'Requests/Day' },
                  { value: '4.9/5', label: 'App Store Rating' },
                ].map((stat, index) => (
                  <div key={index}>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          {!isReducedMotion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="h-5 w-5 rotate-90" />
                </motion.div>
                <span className="text-xs">Scroll to explore</span>
              </div>
            </motion.div>
          )}
        </section>

        {/* Features Section */}
