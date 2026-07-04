'use client';

import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, CheckCircle2, ChevronDown, Globe, Shield, Zap, 
  Layers, Users, BarChart3, Sparkles, Menu, X, Star, Mail, Phone, MapPin
} from 'lucide-react';

interface LandingProps {
  className?: string;
  darkMode: boolean;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const heroVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  },
};

export interface HeroProps {
  darkMode: boolean;
}

function Hero({ darkMode }: HeroProps) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-purple-500/20"
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute inset-0 bg-gradient-to-tl from-fuchsia-500/10 via-transparent to-blue-500/10"
      />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-violet-400/20 blur-xl"
          initial={{ 
            x: Math.random() * 100 - 50, 
            y: Math.random() * 100 - 50,
            scale: 0.3 + Math.random() * 0.7,
            opacity: 0.4 + Math.random() * 0.3,
          }}
          animate={{
            x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
            y: [Math.random() * 200 - 100, Math.random() * 200 - 100],
          }}
          transition={{ duration: 20 + Math.random() * 30, repeat: Infinity, ease: "linear" }}
        />
      ))}

      <motion.div 
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
      >
        {/* Logo/Brand */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8 flex items-center justify-center gap-2"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-violet-400 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent"
        >
          Build faster with Syntheon
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
        >
          The premium SaaS template for teams who demand excellence. 
          Ship production-ready applications in days, not months.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a 
            href="#"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Start Building Free
            <ArrowRight className="w-5 h-5" />
          </a>

          <a 
            href="#"
            className="inline-flex items-center gap-2 px-8 py-4 bg-background border border-border rounded-full text-foreground font-medium hover:bg-muted transition-all duration-300"
          >
            View Documentation
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 flex items-center justify-center gap-8 text-muted-foreground/70"
        >
          <div className="flex -space-x-3">
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 border-3 border-background"
              />
            ))}
          </div>
          <span className="text-sm">Trusted by 2,000+ developers</span>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-border flex items-center justify-center"
          >
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="w-1 h-3 bg-violet-400 rounded-full"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Background grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to right, #8b5cf6 1px, transparent 1px), linear-gradient(to bottom, #8b5cf6 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
        }}
      />
    </section>
  );
}

export interface FeaturesProps {
  darkMode: boolean;
}

function Features({ darkMode }: FeaturesProps) {
  const features = [
    { icon: Zap, title: "Lightning Fast", desc: "Optimized for performance with Next.js 15 and React Server Components." },
    { icon: Layers, title: "Modern Stack", desc: "TypeScript, Tailwind CSS, shadcn/ui — everything you need to build beautifully." },
    { icon: Shield, title: "Production Ready", desc: "Built with best practices for scalability, security, and maintainability." },
    { icon: Globe, title: "Global Scale", desc: "Edge-ready architecture that performs well anywhere in the world." },
    { icon: Users, title: "Team Collaboration", desc: "Designed for teams who work together on large-scale projects." },
    { icon: BarChart3, title: "Analytics Built-in", desc: "Track your growth with integrated analytics and reporting tools." },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 text-violet-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Premium Features
          </span>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent mb-6">
            Everything you need
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A complete toolkit for building modern SaaS applications with professional polish.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-8 rounded-2xl bg-background border border-border hover:border-violet-500/30 hover:bg-muted/50 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/5 border border-violet-500/20 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to start building?</h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Get access to the complete template with all features, documentation, and support.
          </p>
          <a 
            href="#"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export interface TestimonialsProps {
  darkMode: boolean;
}

function Testimonials({ darkMode }: TestimonialsProps) {
  const testimonials = [
    { name: "Sarah Chen", role: "CTO at TechCorp", content: "The best SaaS template we've used. Our development velocity increased by 3x.", avatar: "SC" },
    { name: "Marcus Johnson", role: "Lead Developer", content: "Incredibly well-documented and polished. Saved us weeks of setup time.", avatar: "MJ" },
    { name: "Elena Rodriguez", role: "Product Manager", content: "The attention to detail is remarkable. Every interaction feels premium.", avatar: "ER" },
  ];

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 text-violet-400 text-sm font-medium mb-6">
            <CheckCircle2 className="w-4 h-4" />
            What People Say
          </span>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent mb-6">
            Loved by developers
          </h2>
        </motion.div>

        {/* Testimonials carousel */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-background border border-border hover:border-violet-500/30 hover:bg-muted/50 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-muted-foreground/70 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-lg leading-relaxed italic">"{testimonial.content}"</p>
            </motion.div>
          ))}
        </div>

        {/* Star rating */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-muted-foreground">Based on 2,000+ verified reviews</p>
        </motion.div>
      </div>
    </section>
  );
}

export interface PricingProps {
  darkMode: boolean;
}

function Pricing({ darkMode }: PricingProps) {
  const plans = [
    { name: "Starter", price: "$0", features: ["Single project", "Community support", "Basic templates"], cta: "Get Started Free" },
    { name: "Pro", price: "$29", features: ["Unlimited projects", "Priority support", "Advanced templates", "Analytics dashboard"], popular: true, cta: "Start Pro Trial" },
    { name: "Enterprise", price: "Custom", features: ["Dedicated support", "Custom integrations", "SLA guarantee", "On-premise option"], cta: "Contact Sales" },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 text-violet-400 text-sm font-medium mb-6">
            <CheckCircle2 className="w-4 h-4" />
            Simple Pricing
          </span>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent mb-6">
            Plans for every stage
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start free, scale as you grow. No hidden fees or surprises.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative p-8 rounded-3xl border ${plan.popular ? 'border-violet-500 bg-muted/30' : 'bg-background border-border'} hover:border-violet-500/30 transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium shadow-lg">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>
