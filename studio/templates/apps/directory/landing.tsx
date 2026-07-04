'use client';

import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  ArrowRight, 
  Code2, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Users, 
  Sparkles,
  Menu,
  X,
  ChevronDown,
  Star,
  CheckCircle2,
  Mail,
  MapPin,
  Phone
} from 'lucide-react';

import { button } from '@/components/ui/button';
import { card } from '@/components/ui/card';
import { badge } from '@/components/ui/badge';
import { input } from '@/components/ui/input';

interface LandingProps {
  className?: string;
}

const heroVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.23, 1, 0.32, 1] }
  })
};

const featureVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3
    }
  }
};

export interface LandingPageProps extends LandingProps {}

export default function Landing({ className }: LandingPageProps) {
  const { scrollY } = useScroll();
  const heroRef = useInView<HTMLDivElement>(true);
  
  const parallaxY = useTransform(scrollY, [0, 1000], [0, -80]);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className={cn(
        "min-h-screen bg-background text-foreground selection:bg-primary/30",
        className
      )}>
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-border">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Syntheon</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex items-center gap-8"
          >
            <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-primary transition-colors">Testimonials</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</a>
            <button className="rounded-lg px-5 py-2.5 bg-primary/10 text-primary border border-border hover:bg-primary/20 transition-all font-medium text-sm">
              Get Started
            </button>
          </motion.div>

          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:hidden p-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Animated Background Elements */}
        <motion.div 
          style={{ y: parallaxY }}
          className="absolute inset-0 pointer-events-none"
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 120 - 60,
                y: Math.random() * 120 - 60,
                opacity: 0.15 + Math.random() * 0.1
              }}
              animate={{ 
                y: [null, null, (Math.random() - 0.5) * 30],
                x: [null, null, (Math.random() - 0.5) * 20]
              }}
              transition={{ 
                duration: 15 + Math.random() * 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute w-64 h-64 rounded-full bg-primary/5 blur-[100px]"
            />
          ))}
        </motion.div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          {/* Badge */}
          <motion.div 
            variants={heroVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-border mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">v2.0 is now live — built for modern teams</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            variants={heroVariants}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/40 bg-clip-text text-transparent">
              Build faster. Ship better.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            variants={heroVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10"
          >
            The all-in-one platform for teams who demand premium quality without the premium price tag.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={heroVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/25">
              <span className="relative z-10 flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button className="inline-flex items-center gap-2 px-8 py-4 bg-background text-foreground rounded-xl font-semibold border border-border hover:bg-muted transition-all">
              <Code2 className="w-5 h-5" />
              View Documentation
            </button>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            variants={heroVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-16"
          >
            <p className="text-sm text-muted-foreground mb-6">Trusted by innovative teams at</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-50 grayscale">
              {['Acme Corp', 'GlobalTech', 'Nebula Inc', 'Pioneer Labs'].map((company, i) => (
                <motion.div 
                  key={i}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.2 + i * 0.1, duration: 0.3 }}
                  className="text-lg font-semibold"
                >
                  {company}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2 text-muted-foreground"
            >
              <span className="text-xs uppercase tracking-widest">Scroll</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Everything you need to build
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Premium features built for teams who ship production-quality software.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Lightning Fast", desc: "Optimized for speed with edge caching and intelligent prefetching." },
              { icon: ShieldCheck, title: "Enterprise Security", desc: "SOC 2 Type II compliant with end-to-end encryption by default." },
              { icon: Globe, title: "Global Scale", desc: "Deploy to 35+ regions automatically with one click." },
              { icon: Users, title: "Team Collaboration", desc: "Built-in workflows for teams of any size and complexity." },
              { icon: Code2, title: "Developer Experience", desc: "Type-safe APIs with comprehensive documentation." },
              { icon: Sparkles, title: "Premium Design", desc: "Beautiful UI components that feel native on every platform." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={featureVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={cn(
                  "group relative p-8 rounded-2xl border bg-card/50 hover:bg-card transition-colors cursor-default",
                  i % 3 === 0 ? "lg:col-span-1 lg:row-span-2" : ""
                )}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/5 border border-border flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>

                {/* Hover accent */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"
                />

                {/* Gradient border effect */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    background: 'conic-gradient(from 180deg at 50% 50%, rgba(139, 92, 246, 0.1) 0deg, transparent 60deg)',
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-24 p-12 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-primary/5 border border-border text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of teams building the future with Syntheon.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-w-[280px]"
              />
              <button className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                Get Started Free
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <Badge variant="outline">Testimonials</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-6 mb-6">
              Loved by teams worldwide
            </h2>
          </motion.div>

          {/* Testimonial Cards */}
          <div className="grid lg:grid-cols-3 gap-6">
            {[
              { name: "Sarah Chen", role: "CTO, TechFlow", quote: "We've replaced three different tools with Syntheon. The developer experience is unmatched.", avatar: "SC" },
              { name: "Marcus Rodriguez", role: "Lead Engineer, Nebula", quote: "The attention to detail in the UI and motion design sets us apart from every competitor we've tried.", avatar: "MR" },
              { name: "Elena Popescu", role: "Product Manager, Acme", quote: "Our team's productivity increased by 40% within the first month. The ROI was immediate.", avatar: "EP" }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>

                <blockquote className="relative">
                  <span className="absolute -top-2 -left-2 w-6 h-6 bg-card rounded-full border border-border" />
                  <p className="text-lg leading-relaxed text-muted-foreground relative z-10">
                    "{testimonial.quote}"
                  </p>
                </blockquote>

                {/* Quote accent */}
                <div 
                  className="absolute -bottom-2 -right-2 w-6 h-6 bg-card rounded-full border border-border"
                  style={{ transform: 'rotate(45deg)' }}
                />
              </motion.div>
            ))}
          </div>

          {/* Animated Counter */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { number: "50K+", label: "Active Users", icon: Users },
              { number: "99.9%", label: "Uptime SLA", icon: ShieldCheck },
              { number: "120M", label: "API Requests/Day", icon: Zap },
              { number: "4.9/5", label: "App Store Rating", icon: Star }
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-xl bg-card/30 border border-border
