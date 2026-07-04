'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion'
import { ChevronRight, Sparkles, Zap, Shield, Globe, BarChart3, Layers, ArrowUpRight, CheckCircle2, Menu, X, Star, PlayCircle } from 'lucide-react'

interface FeatureProps {
  icon: React.ReactNode
  title: string
  description: string
  delay?: number
}

const features: FeatureProps[] = [
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: 'Predictive Intelligence',
    description: 'Anticipate user needs before they articulate them with advanced ML models.',
    delay: 0,
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Real-Time Processing',
    description: 'Sub-millisecond inference with edge deployment for global latency optimization.',
    delay: 100,
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Enterprise Security',
    description: 'SOC2 Type II certified with end-to-end encryption and audit trails.',
    delay: 200,
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'Global Scale',
    description: 'Deploy to 14 regions automatically with intelligent traffic routing.',
    delay: 300,
  },
]

const pricingTiers = [
  {
    name: 'Starter',
    price: '$29',
    features: ['Up to 5 projects', 'Basic analytics', 'Email support', '10GB storage'],
    recommended: false,
  },
  {
    name: 'Professional',
    price: '$79',
    features: ['Unlimited projects', 'Advanced analytics', 'Priority support', '100GB storage', 'API access'],
    recommended: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: ['Dedicated infrastructure', '24/7 SLA support', 'Custom models', 'Unlimited storage', 'On-premise option'],
    recommended: false,
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CTO at TechFlow',
    content: 'We reduced our inference costs by 60% while improving latency. The platform just works.',
    avatar: 'SC',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'VP Engineering, DataCorp',
    content: 'The deployment pipeline saved us weeks of manual work. Best investment we made this year.',
    avatar: 'MR',
  },
]

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  },
}

const heroVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  },
}

const featureVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

const pricingVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

export default function AIProductLanding() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroInView = useInView(containerRef, { once: true, margin: '-50%' })

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activePricing, setActivePricing] = useState<'all' | 'starter' | 'pro' | 'enterprise'>('all')

  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const opacity1 = useTransform(scrollY, [0, 300], [1, 0.7])

  return (
    <motion.main 
      ref={containerRef}
      initial="hidden"
      animate="visible"
      variants={heroVariants}
      className="min-h-screen bg-background text-foreground overflow-x-hidden"
    >
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight">Syntheon AI</span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'Docs', 'Blog'].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="text-sm text-foreground/60 hover:text-foreground transition-colors"
              >
                {item}
              </motion.a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              Sign in
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Get started
            </motion.button>
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-border/50 text-foreground/60 hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border/20 bg-background"
            >
              <div className="px-4 py-6 space-y-4">
                {['Features', 'Pricing', 'Docs', 'Blog'].map((item) => (
                  <a 
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
        {/* Animated background gradient */}
        <motion.div 
          style={{ y: y1, opacity: opacity1 }}
          className="absolute inset-0 -z-10"
        >
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
        </motion.div>

        {/* Hero content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 border border-border/50 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-foreground/70">v2.0 now available — 60% faster inference</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-8"
          >
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Build AI products that scale.
            </span>
            <br />
            <span className="text-foreground/60 mt-2 lg:mt-4 block sm:inline">
              Deploy models globally with zero configuration.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto mb-10"
          >
            The developer-first platform for production AI. From training to inference, 
            handle the infrastructure so you can focus on what matters.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-violet-500/25"
            >
              Start building free
            </motion.button>
            
            <motion.a
              href="#"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl bg-background border border-border/50 text-foreground font-medium text-lg hover:bg-background/80 transition-colors flex items-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              Watch demo
            </motion.a>
          </motion.div>

          {/* Hero stats */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-20 grid grid-cols-3 gap-8 sm:gap-12 max-w-3xl mx-auto"
          >
            {[
              { value: '50M+', label: 'Inferences/sec' },
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '14', label: 'Global regions' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1, duration: 0.4 }}
              >
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-foreground/50">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-border/50 flex items-center justify-center"
          >
            <motion.div
              animate={{ y: [4, 8, 4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-3 rounded-full bg-primary"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Built for production, not prototypes
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Everything you need to ship AI products at scale. No vendor lock-in, no hidden fees.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={featureVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="p-6 rounded-2xl bg-background/50 border border-border/50 hover:border-primary/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Feature marquee */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8 }}
            className="mt-24 relative"
          >
            <div className="flex gap-6 overflow-hidden">
              {[...features, ...features].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex-shrink-0 px-8 py-4 rounded-xl bg-background/30 border border-border/20"
                >
                  <div className="font-medium">{feature.title}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section id="social-proof" className="py-24 sm:py-32 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Trusted by teams at top companies
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Join 5,000+ developers shipping production AI with Syntheon.
            </p>
          </motion.div>

          {/* Logo marquee */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mb-16"
          >
            {['Acme Corp', 'GlobalTech', 'Nebula', 'Polaris', 'Quantum'].map((company, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="text-xl font-bold text-foreground/40 hover:text-foreground/70 transition-colors cursor-default"
              >
                {company}
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
