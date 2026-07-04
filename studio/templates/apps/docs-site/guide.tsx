'use client';

import React, { useState, useEffect, useScroll, useTransform, useInView } from 'react-dom/server';
import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  ChevronRight, 
  Search, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  BookOpen, 
  Zap, 
  Shield, 
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  ExternalLink,
  Copy,
  Minus,
  Plus
} from 'lucide-react';

interface GuideProps {
  title?: string;
  subtitle?: string;
  darkMode?: boolean;
  compact?: boolean;
}

const SECTION_HEIGHT = 600;
const PARALLAX_FACTOR = 0.5;

export interface GuideSectionProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.15,
      ease: [0.23, 1, 0.32, 1],
    },
  }),
};

const heroVariants = {
  initial: { scale: 0.98, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

const GuideSection: React.FC<GuideSectionProps> = ({ 
  id, 
  icon, 
  title, 
  description, 
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: '0px 0px 150px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={sectionVariants}
      custom={[id.indexOf(':') > -1 ? id.split(':')[0].indexOf('-') > -1 ? id.split('-')[0] : '0' : '0']}
      className="group relative border-b border-border/50 last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-4 p-6 text-left hover:bg-muted/30 transition-colors duration-200",
          isOpen ? "bg-muted/15" : "",
          defaultOpen && !isInView && "border-b border-border/50"
        )}
      >
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
          isOpen ? "bg-primary text-primary-foreground rotate-90" : "bg-background border border-border/50 hover:border-primary/50"
        )}>
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold text-lg transition-colors duration-200",
            isOpen ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/80"
          )}>
            {title}
          </h3>
          <p className={cn(
            "text-sm mt-1 line-clamp-2 transition-colors duration-200",
            isOpen ? "text-foreground/70" : "text-muted-foreground/60"
          )}>
            {description}
          </p>
        </div>

        <ChevronRight 
          className={cn(
            "w-5 h-5 ml-auto transition-transform duration-300",
            isOpen ? "rotate-90 text-primary/60" : ""
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-4 text-foreground/90 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = "typescript" }) => {
  const [copied, setCopied] = useState(false);

  return (
    <div className="relative group">
      <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-sm font-mono leading-relaxed border border-border/50">
        <code>{code}</code>
      </pre>
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className={cn(
          "absolute top-3 right-3 p-2 rounded-md transition-all duration-200",
          copied 
            ? "bg-primary/15 text-primary" 
            : "bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-background text-muted-foreground hover:text-foreground"
        )}
      >
        {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

const FeatureCard: React.FC<{ 
  icon?: React.ReactNode; 
  title: string; 
  description: string; 
  delay?: number;
}> = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className="p-6 rounded-xl bg-background border border-border/50 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-foreground/70 leading-relaxed">{description}</p>
    </motion.div>
  );
};

const Guide: React.FC<GuideProps> = ({ 
  title = "Developer Guide", 
  subtitle = "Build faster with Syntheon's premium components",
  darkMode = false,
  compact = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Scroll-based parallax effect for hero background
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: scrollRef });
  const y1 = useTransform(scrollY, [0, 1500], [0, 20]);

  // Smooth reveal for main content
  const mainContentRef = React.useRef<HTMLDivElement>(null);
  const mainInView = useInView(mainContentRef, { margin: '0px 0px 300px' });

  return (
    <div 
      ref={scrollRef}
      className="min-h-screen bg-background text-foreground selection:bg-primary/25 selection:text-primary"
    >
      {/* Parallax Hero Background */}
      <motion.div
        style={{ y: y1 }}
        className="fixed inset-0 z-0 pointer-events-none opacity-30 dark:opacity-20"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className={cn(
          "absolute -top-[10%] left-[-10%] w-[80%] h-[60%]",
          darkMode ? "bg-primary/5 rounded-full blur-3xl" : "bg-primary/10 rounded-full blur-3xl"
        )} />
      </motion.div>

      {/* Mobile Navigation Toggle */}
      <div className={cn(
        "fixed top-4 left-4 z-50 md:hidden",
        isMobileMenuOpen ? "right-4 left-auto" : ""
      )}>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 rounded-xl bg-background/80 backdrop-blur-md border border-border/50 hover:bg-muted transition-colors shadow-lg"
        >
          {isMobileMenuOpen ? 
            <X className="w-5 h-5 text-muted-foreground" /> : 
            <Menu className="w-5 h-5 text-muted-foreground" />
          }
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <nav className="p-6 space-y-4">
              {['Introduction', 'Installation', 'Components', 'Styling', 'Animation'].map((item, i) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  {item}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main 
        ref={mainContentRef}
        className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32"
      >
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={mainInView ? { opacity: 1, y: 0 } : "initial"}
          variants={heroVariants}
          className="text-center mb-20 md:mb-32"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={mainInView ? { scale: 1, opacity: 1 } : "initial"}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-muted/50 border border-border/50 mb-8"
          >
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Developer Documentation</span>
          </motion.div>

          <h1 className={cn(
            "font-bold tracking-tight mb-6",
            darkMode ? "text-5xl md:text-7xl bg-gradient-to-r from-primary via-purple-300 to-primary bg-clip-text text-transparent" : "text-4xl md:text-6xl"
          )}>
            {title}
          </h1>

          <p className={cn(
            "max-w-2xl mx-auto leading-relaxed",
            darkMode ? "text-xl text-muted-foreground/80" : "text-lg text-muted-foreground/70"
          )}>
            {subtitle}
          </p>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mainInView ? { opacity: 1, y: 0 } : "initial"}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 mt-16"
          >
            {[
              { icon: Zap, label: "Lightning Fast", value: "< 100ms" },
              { icon: Shield, label: "Type-Safe", value: "Full TypeScript" },
              { icon: Layers, label: "Modular", value: "Composable" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary/60" />
                <p className="font-semibold">{stat.label}</p>
                <p className="text-sm text-muted-foreground/70">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        </motion.section>

        {/* Quick Start Cards */}
        <section className="mb-24">
          <h2 className={cn(
            "font-semibold text-2xl mb-8 flex items-center gap-3",
            darkMode ? "text-foreground" : "text-foreground/90"
          )}>
            <Clock className="w-6 h-6 text-primary/50" />
            Quick Start
          </h2>

          <div className={cn(
            "grid gap-6",
            compact ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4"
          )}>
            {[
              { 
                icon: FileText, 
                title: "Installation", 
                description: "Get started in minutes with our CLI tool and pre-configured templates.",
                code: `npm create syntheon@latest\n# or\npnpm dlx create-syntheon`,
              },
              { 
                icon: Layers, 
                title: "Architecture", 
                description: "Built on Next.js 15 App Router with TypeScript and Tailwind CSS out of the box.",
                code: `next.config.ts\n# Modern stack ready to go`,
              },
              { 
                icon: Zap, 
                title: "Performance", 
                description: "Optimized for speed with automatic code splitting and edge caching.",
                code: `// Automatic optimizations applied\n- ISR/SSG support\n- Edge functions\n- Image optimization`,
              },
            ].map((card, i) => (
              <FeatureCard key={i} icon={<card.icon />} title={card.title} description={card.description} delay={i * 0.15} />
            ))}
          </div>
        </section>

        {/* Main Content Sections */}
        <section className="mb-24">
          <h2 className={cn(
            "font-semibold text-2xl mb-8 flex items-center gap-3",
            darkMode ? "text-foreground" : "text-foreground/90"
          )}>
            <BookOpen className="w-6 h-6 text-primary/50" />
            Documentation
          </h2>

          <div className={cn(
            "space-y-4 rounded-xl border border-border/50 overflow-hidden",
            compact ? "" : "bg-muted/30 backdrop-blur-sm"
          )}>
            {[
              { 
                id: "installation",
                icon: <FileText className="w-5 h-5" />,
                title: "Installation & Setup",
                description: "Quick installation guide with all available options.",
                content: (
                  <>
                    <p className="mb-4">Choose your preferred package manager:</p>
                    <CodeBlock code={`# Using npm\nnpm create syntheon@latest

# Using pnpm\npnpm dlx create-syntheon

# Using yarn\nyarn create syntheon`} />
                    
                    <div className={cn(
                      "mt-6 p-4 rounded-lg border",
                      darkMode ? "bg-muted/50 border-border" : "bg-background border-border/50"
                    )}>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        What's included:
                      </h4>
                      <ul className="space-y-1 text-sm leading-relaxed">
                        {["Next.js 15 App Router", "TypeScript strict mode", "Tailwind CSS + shadcn/ui", "Framer Motion animations"].map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary/50 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ),
              },
              { 
                id: "components",
                icon: <Layers className="w-5 h-5" />,
                title: "Component Library",
                description: "Pre-built, accessible components ready to use.",
                content: (
                  <>
                    <p className="mb-4">All components are built with accessibility and performance in mind:</p>
                    
                    <div className={cn(
                      "grid gap-6 p-6 rounded-lg",
                      darkMode ? "bg-muted/50" : "bg-background border border-border/50"
                    )}>
                      {[
                        { name: "Button", props: "variant, size, disabled, loading, icon" },
                        { name: "Card", props: "title, description, footer, className" },
                        { name: "Input", props: "label, placeholder, type, error, helperText" },
                      ].map((comp, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                          <div>
                            <code className="font-mono text-sm">{comp.name}</code>
                            <p className="text-xs text-muted-foreground mt-1">{comp.props}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                        </div>
                      ))}
                    </div>

                    <CodeBlock code={`// Import and use components\nimport { Button, Card, Input } from "@/components/ui";\n\nfunction MyComponent() {\n  return (\n    &lt;Card title="Hello"\&gt;\n      &lt;Button variant="primary"&gt;\n        Get Started\n      &lt;/Button&gt;\n    &lt;/Card&gt;\n  );\n}`} />
                  </>
                ),
              },
              { 
                id: "styling",
                icon: <Zap className="w-5 h-5" />,
                title: "Styling System",
                description: "Consistent design tokens and utility classes.",
                content: (
                  <>
                    <p className="mb-4">Our design system uses semantic CSS variables for easy theming:</p>

                    <div className={cn(
                      "overflow-x-auto rounded-lg border",
                      darkMode ? "bg-muted/50 border-border" : "bg-background border-border/50"
                    )}>
                      <table className="w-full text-sm">
                        <thead className={cn("border-b", darkMode ? "bg-muted/30" : "bg-muted/10")}>
                          <tr>
