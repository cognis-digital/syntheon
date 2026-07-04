'use client';

import { cn } from '@/lib/utils';
import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// --- Design Tokens & Constants ---
const THEME = {
  primary: '#8b5cf6', // violet-500
  primaryDark: '#7c3aed', // violet-600
  accent: '#d8b4fe', // violet-300
  gradients: [
    'rgba(139, 92, 246, 0.1)',
    'rgba(139, 92, 246, 0.05)',
    'rgba(139, 92, 246, 0.08)'
  ]
};

const EASINGS = {
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutQuint: [0.755, 0.05, 0.855, 0.06]
};

// --- Custom Cursor Component ---
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      setPosition({ x: e.clientX - cursorRef.current.offsetWidth / 2, y: e.clientY - cursorRef.current.offsetHeight / 2 });
    };

    window.addEventListener('mousemove', updatePosition);
    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <motion.div
      ref={cursorRef}
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference"
      style={{ x: position.x, y: position.y }}
      animate={{
        scale: isHovering ? 1.5 : 1,
        opacity: isHovering ? 0.6 : 0.3,
        rotate: Math.random() * 4 - 2
      }}
      transition={{ duration: 0.3, ease: EASINGS.easeOutCubic }}
    >
      <div className="w-full h-full rounded-full bg-gradient-to-br from-violet-500 to-purple-600 blur-sm" />
    </motion.div>
  );
}

// --- Section Base Components ---
function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <motion.section
      ref={ref}
      style={{ y }}
      className={cn('relative py-24 md:py-32 overflow-hidden', className)}
    >
      {children}
    </motion.section>
  );
}

function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('max-w-7xl mx-auto px-6 md:px-12', className)}>
      {children}
    </div>
  );
};

// --- Hero Section with Parallax ---
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  
  const heroVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: EASINGS.easeOutCubic
      }
    })
  };

  return (
    <Section className="min-h-screen flex items-center justify-center relative">
      {/* Background Elements */}
      <div 
        ref={ref}
        className="absolute inset-0 z-0"
        style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #8b5cf6 100%)' }}
      >
        {/* Animated orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.3, 1], rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"
          animate={{ scale: [1.3, 1, 1.3], rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px)', backgroundSize: '48px 48px' }} 
        />
      </div>

      {/* Content */}
      <Container className="relative z-10 text-center">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-xs text-violet-300 font-medium tracking-wide">NOW ACCEPTING NEW PROJECTS</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.1]">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-violet-400"
            >
              Syntheon
            </motion.span>
          </h1>

          <p className="text-xl md:text-2xl text-violet-300/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            We craft premium digital experiences where engineering meets motion design. 
            Build products that feel as good as they look.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 py-4 rounded-full bg-white text-violet-600 font-semibold overflow-hidden"
            >
              <span className="relative z-10">Start Your Project</span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/20 transition-colors"
            >
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.752 11.168l-0.712-0.712C13.938 10.185 13.82 10.185 13.608 10.397L12 12l-1.608-1.608c-0.212-0.212-0.43-0.212-0.642 0l-0.712 0.712C9.852 11.98 9.97 12 10.182 12L12 13.608l1.608-1.608c0.212-0.212 0.43-0.212 0.642 0l0.712 0.712z" />
                </svg>
                Watch Showreel
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 5, 0] }}
          transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-violet-400/30 flex justify-center items-start">
            <motion.div 
              className="w-1 bg-violet-400"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </Container>

      {/* Parallax text layer */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-8 md:p-16"
        style={{ 
          background: 'linear-gradient(to top, rgba(15, 12, 41, 0.9) 0%, transparent)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="text-center"
          >
            <p className="text-2xl md:text-4xl font-light text-violet-300/70 tracking-wide">
              "The best work happens when creativity meets discipline."
            </p>
            <p className="mt-4 text-sm text-violet-500/60 uppercase tracking-widest">— The Syntheon Philosophy</p>
          </motion.div>
        </Container>
      </motion.div>
    </Section>
  );
}

// --- Feature Card Component ---
function FeatureCard({ 
  icon, 
  title, 
  description, 
  delay = 0 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  delay?: number 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: EASINGS.easeOutCubic }}
      className="group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-violet-500/30 transition-colors"
    >
      <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-violet-300/70 leading-relaxed">{description}</p>
    </motion.div>
  );
}

// --- Features Section ---
function Features() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      title: "Precision Engineering",
      description: "Every pixel, every interaction is calculated and refined. We build with mathematical precision for optimal performance."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 10h-4V6a2 2 0 0 0-2-2H9v16h6a2 2 0 0 0 2-2v-4h4l3-3V4h-7a2 2 0 0 0-2 2v8" />
          <path d="M15 13l-3 3-3-3" />
        </svg>
      ),
      title: "Motion Design",
      description: "Purposeful animation that guides attention and creates delight. We move with intention, never gratuitously."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      ),
      title: "Scalable Architecture",
      description: "Systems built to grow with your business. Clean code, clean processes, clean results that scale."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 3v18m9-9H3" />
        </svg>
      ),
      title: "Premium Aesthetics",
      description: "Design that commands attention and inspires trust. We create visual hierarchies that feel expensive."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
      title: "Performance Obsessed",
      description: "60fps animations, instant interactions, and smooth scrolling. Speed is a feature of design."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: "Client-Centric",
      description: "We don't just build; we partner. Your vision, our expertise—combined for exceptional outcomes."
    }
  ];

  return (
    <Section className="bg-gradient-to-b from-transparent via-violet-950/20 to-transparent">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why Choose Syntheon</h2>
          <p className="text-lg text-violet-300/70 max-w-2xl mx-auto">
            We combine technical excellence with artistic vision to deliver experiences that stand out.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} delay={index * 0.1} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

// --- Social Proof Section ---
function SocialProof() {
  const logos = [
    "Stripe", "Airbnb", "Notion", "Figma", "Linear", "Vercel"
  ];

  return (
    <Section className="py-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm text-violet-400/60 uppercase tracking-widest mb-8">Trusted by innovative teams</p>

          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {logos.map((logo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="text-2xl font-bold text-white/60 hover:text-violet-300 cursor-default"
              >
                {logo}
              </motion.div>
            ))
