'use client';

import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Zap, Shield, Globe, Layers, ArrowRight, ChevronDown } from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const featuresData = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Lightning Fast',
    description: 'Optimized rendering with Next.js 15 App Router and edge caching for sub-100ms TTI.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Enterprise Security',
    description: 'SOC2 Type II certified infrastructure with end-to-end encryption and audit trails.',
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: 'Global Scale',
    description: 'Multi-region deployment with automatic failover. 99.99% SLA guaranteed uptime.',
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: 'Modular Architecture',
    description: 'Microservices-ready design with clean boundaries and predictable scaling patterns.',
  },
];

const metricsData = [
  { value: '99.99%', label: 'Uptime SLA' },
  { value: '<100ms', label: 'TTI Target' },
  { value: '24/7', label: 'Support Coverage' },
];

const containerVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.8, ease: 'easeOut' },
  }),
};

const staggerChildren = () => ({
  children: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
});

export interface FeaturesProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Features({ className }: FeaturesProps) {
  const { scrollY } = useScroll();
  const heroRef = useInView<HTMLDivElement>(false);

  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity1 = useTransform(scrollY, [0, 300], [1, 0.7]);

  return (
    <motion.section
      ref={heroRef}
      style={{ y: y1, opacity: opacity1 }}
      className={cn(
        'relative min-h-screen py-24 md:py-32 overflow-hidden',
        'bg-gradient-to-b from-background via-muted/50 to-background',
        className
      )}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: useTransform(scrollY, [0, 800], [0, -100]) }}
      >
        <div className="absolute top-24 left-8 w-64 h-64 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-32 right-8 w-96 h-96 bg-accent/5 rounded-full blur-[150px]" />
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-8"
      >
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm">
              New York Design System
            </Badge>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Built for Scale.
            </span>{' '}
            Engineered for Speed.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A production-ready SaaS platform with enterprise-grade performance, security, and reliability out of the box.
          </p>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-8"
          >
            <Button size="lg">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              View Documentation
            </Button>
          </motion.div>
        </div>

        {/* Metrics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
        >
          {metricsData.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.15, duration: 0.4 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={staggerChildren()}
          initial="hidden"
          animate="visible"
          transition={staggerChildren()}
          className="max-w-7xl mx-auto px-6 md:px-8 mt-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuresData.map((feature, i) => (
              <motion.div key={i} variants={containerVariants}>
                <FeatureCard feature={feature} index={i} />
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.6 }}
            className="mt-24 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border"
          >
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to get started?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Join thousands of developers building production applications with Syntheon.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  Contact Sales
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="h-6 w-6 text-muted-foreground animate-bounce" />
        </motion.div>
      </motion.section>
    </motion.section>
  );
}

function FeatureCard({ feature, index }: { feature: FeatureProps; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.4 }}
      className="group"
    >
      <Card className={cn(
        'h-full p-6 md:p-8',
        'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/20',
        'bg-background border-border'
      )}>
        <CardContent className="flex flex-col h-full">
          <div className={cn(
            'w-14 h-14 rounded-2xl mb-5 transition-all duration-300 group-hover:scale-110',
            'bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center'
          )}>
            <motion.div
              className="text-primary"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1, type: 'spring', stiffness: 200 }}
            >
              {feature.icon}
            </motion.div>
          </div>

          <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
            {feature.title}
          </h3>

          <p className={cn(
            'flex-grow',
            'text-muted-foreground leading-relaxed'
          )}>
            {feature.description}
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 + index * 0.15 }}
            className="mt-4 flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary transition-colors"
          >
            <CheckCircle2 className="h-3 w-3" />
            <span>Verified in production</span>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export { Features, FeatureProps };
