'use client';

import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ChevronRight, Copy, Zap, Mail, Layers, ShieldCheck, ArrowRight, Menu, X, Sun, Moon, CheckCircle2, Terminal, FileCode, Globe, Settings, BarChart3, Sparkles } from 'lucide-react';

// Types and interfaces
export interface EmailAutomationPageProps {
  className?: string;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

interface CodeBlockProps {
  code: string;
  language?: 'typescript' | 'javascript' | 'json';
  filename?: string;
}

// Constants and configuration
const FEATURES = [
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Campaign Builder",
    description: "Drag-and-drop email templates with A/B testing built-in.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Smart Triggers",
    description: "Behavioral triggers that adapt to user journeys automatically.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "GDPR Compliance",
    description: "Built-in consent management and data residency controls.",
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: "Multi-Channel Sync",
    description: "Seamlessly sync campaigns across email, SMS, and push.",
  },
];

const API_EXAMPLES = [
  {
    filename: 'types/email.types.ts',
    code: `// Email campaign types
export interface CampaignConfig {
  id: string;
  name: string;
  templateId: string;
  triggers: Trigger[];
  schedule: Schedule | null;
  a/bTests: A/BTest[];
}

export type Trigger = 
  | 'welcome'
  | 'abandoned-cart'
  | 're-engagement'
  | 'birthday';`,
    language: 'typescript',
  },
  {
    filename: 'config/defaults.json',
    code: `{
  "defaultLanguage": "en",
  "timezone": "UTC",
  "maxEmailsPerDay": 100,
  "bounceThreshold": 0.05,
  "openRateGoal": 0.25
}`,
    language: 'json',
  },
];

// Helper components with animations

const AnimatedSection = ({ children, className, delay = 0 }: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: '100px', once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn('relative', className)}
    >
      {children}
    </motion.div>
  );
};

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-50px' }}
    >
      <Card className="h-full border-border/40 hover:border-violet-500/50 transition-colors group">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-2 rounded-lg bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-colors"
            >
              {icon}
            </motion.div>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CodePreview = ({ code, language, filename }: CodeBlockProps) => {
  const [copied, setCopied] = React.useState(false);

  return (
    <div className="rounded-lg overflow-hidden border-border/40 bg-muted/50">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border/30">
        <span className="text-xs text-muted-foreground font-mono">{filename}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className={cn('h-7 px-2 text-xs', copied && 'text-green-400')}
        >
          {copied ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const StickyTOC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="fixed left-0 top-16 bottom-0 w-72 bg-background/95 backdrop-blur-xl border-r border-border z-50 p-4 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                On this page
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-full pb-20">
              <nav className="space-y-1 text-sm">
                {['Overview', 'Features', 'Getting Started', 'API Reference', 'Pricing'].map((item, i) => (
                  <a key={i} href={`#${item.toLowerCase().replace(/\s/g, '-')}`} className="block py-2 px-3 rounded-md hover:bg-muted transition-colors">
                    {item}
                  </a>
                ))}
              </nav>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sticky header */}
      <div className="hidden lg:block fixed top-16 left-0 right-0 z-40">
        <motion.div 
          layoutId="toc"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-[64px] mx-8 my-3 px-4 py-3 rounded-xl border-border/40 bg-background/95 backdrop-blur-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Table of Contents
            </span>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

// Main page component
export default function EmailAutomationPage() {
  const [activeTab, setActiveTab] = React.useState('overview');
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef });

  // Parallax transform for hero background
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <div ref={scrollRef} className="min-h-screen bg-background selection:bg-violet-500/30">
      <StickyTOC />

      {/* Hero Section */}
      <motion.section 
        style={{ y: parallaxY }}
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 via-background to-transparent" />
        
        {/* Floating particles effect */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 - 50, 
              y: Math.random() * 80 - 40,
              opacity: 0,
              scale: 0.5 + Math.random() * 0.5
            }}
            animate={{ 
              y: [0, -20, 10],
              opacity: [0.3, 0.6, 0.3],
              rotate: 360
            }}
            transition={{ 
              duration: 8 + Math.random() * 4, 
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.1
            }}
            className="absolute w-2 h-2 rounded-full bg-violet-500/30 blur-sm"
          />
        ))}

        <div className="container max-w-4xl px-6 py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Badge variant="secondary" className="px-4 py-1.5 text-sm bg-violet-500/10 border-violet-500/20">
                <Sparkles className="h-3 w-3 mr-1.5 text-violet-400" />
                New Release 2.0
              </Badge>
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
            >
              Email Automation <br />
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Reimagined
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl"
            >
              Build sophisticated email campaigns with intelligent triggers, A/B testing, and enterprise-grade compliance—without the complexity.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="h-12 px-6 text-base">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-6 text-base">
                Read Documentation
              </Button>
            </motion.div>

            {/* Animated stats */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
            >
              {[
                { label: 'Active Campaigns', value: '50K+' },
                { label: 'Daily Sends', value: '2M+' },
                { label: 'Countries Served', value: '85' },
                { label: 'Uptime SLA', value: '99.9%' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                >
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-muted-foreground/60"
          >
            <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
            <div className="w-1 h-8 bg-gradient-to-b from-violet-400 to-transparent rounded-full" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative">
        <div className="container max-w-6xl px-6">
          <AnimatedSection delay={0.1}>
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm bg-violet-500/10 border-violet-500/20">
                Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything you need to <span className="text-violet-400">automate</span> with confidence
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Built for teams that demand precision, scalability, and beautiful results.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={i} {...feature} delay={0.1 + i * 0.05} />
            ))}
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section id="api-reference" className="py-24 bg-muted/30">
        <div className="container max-w-6xl px-6">
          <AnimatedSection delay={0.1}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">API Reference</h2>
                <p className="text-muted-foreground">
                  Integrate with your existing stack using our REST API.
                </p>
              </div>
              <Button variant="outline" size="sm">
                Get API Keys
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="authentication">Authentication</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Quick Start</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Get started in three steps: install the SDK, authenticate with your API key, and create your first campaign.
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-4 rounded-lg border-border/40 bg-background hover:border-violet-500/30 transition-colors cursor-pointer group">
                        <Terminal className="h-5 w-5 text-violet-400" />
                        <code className="font-mono text-sm flex-1">npm install @syntheon/sdk</code>
                      </div>
                    </div>

                    <CodePreview 
                      code={`// Initialize the SDK
import { createClient } from '@syntheon/sdk';

const client = createClient({
  apiKey: process.env.SYNTHEON_API_KEY,
});

// Create a new campaign
await client.campaigns.create({
  name: 'Welcome Series',
  templateId: 'tpl_welcome_001',
  triggers: ['welcome'],
});`}
                      filename="index.ts"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Rate Limits</h3>
                    
                    <Card className="border-border/40">
                      <CardContent className="pt-6">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border/30">
                              <th className="text-left py-2">Endpoint</th>
                              <th className="text-right py-2">Limit</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-border/20">
                              <td className="py-3 font-mono text-muted-foreground">GET /v1/campaigns</td>
                              <td className="text-right py-3 font-mono">60 req/min</td>
                            </tr>
