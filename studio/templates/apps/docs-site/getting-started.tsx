'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Terminal, Zap, Globe, Layers, ChevronRight, Copy, Check, ArrowRight } from 'lucide-react';

interface GettingStartedProps {
  className?: string;
}

const heroVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, rotateX(10) },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.1,
      ease: [0.23, 1, 0.32, 1]
    }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

export interface GettingStartedSectionProps extends GettingStartedProps {}

export default function GettingStarted({ className }: GettingStartedSectionProps) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -80]);
  const y2 = useTransform(scrollY, [0, 500], [0, 40]);

  return (
    <motion.div
      className={cn('min-h-screen bg-background text-foreground', className)}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Animated Hero */}
      <motion.section
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        variants={{ visible: { transition: { duration: 1.2 } } }}
      >
        {/* Gradient Background */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-background to-indigo-500/10"
          style={{ backgroundSize: '400% 400%', animation: 'gradient 15s ease infinite' }}
        />

        {/* Floating Elements */}
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <motion.div 
          className="absolute bottom-40 right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], x: [10, -10, 10] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        {/* Hero Content */}
        <motion.div 
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
          variants={heroVariants}
        >
          <Badge variant="outline" className="mb-6 inline-flex items-center gap-2 bg-background/80 backdrop-blur-sm border-violet-500/30">
            <Terminal className="w-4 h-4 text-violet-400" />
            <span>Quick Start Guide</span>
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Getting Started
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Welcome to the Syntheon platform. This guide will help you set up your first project and understand the core concepts in just a few minutes.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { icon: Zap, label: 'Lightning Fast', value: '< 100ms' },
              { icon: Globe, label: 'Global CDN', value: '99.9% Uptime' },
              { icon: Layers, label: 'Type Safe', value: 'Full TypeScript' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 px-6 py-4 bg-background/50 backdrop-blur-sm rounded-xl border border-border/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <stat.icon className="w-5 h-5 text-violet-400" />
                <div className="text-left">
                  <div className="font-semibold">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.value}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button size="lg" className="h-14 px-8 bg-violet-600 hover:bg-violet-700 text-white gap-2">
              Start Building Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Installation Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Installation & Setup
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <Card className="border-violet-500/20 bg-background/50 backdrop-blur-sm hover:border-violet-400 transition-colors duration-300"
                variants={cardVariants}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary" className="bg-violet-500/10 text-violet-400 border-violet-500/30">
                  1 of 3
                </Badge>
              </div>
              <CardTitle className="text-xl">Prerequisites</CardTitle>
              <CardDescription className="text-muted-foreground">
                What you need before starting.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Node.js 18+ installed
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  npm or pnpm package manager
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="border-violet-500/20 bg-background/50 backdrop-blur-sm hover:border-violet-400 transition-colors duration-300"
                variants={cardVariants}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary" className="bg-violet-500/10 text-violet-400 border-violet-500/30">
                  2 of 3
                </Badge>
              </div>
              <CardTitle className="text-xl">Quick Install</CardTitle>
              <CardDescription className="text-muted-foreground">
                Get started in seconds.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="bg-background border border-border rounded-lg p-4 font-mono text-sm relative group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-md hover:bg-violet-500/20 text-muted-foreground hover:text-violet-400">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <pre className="text-left overflow-x-auto">
                  {`# Create new project
npx create-syntheon@latest my-app

# Navigate to directory
cd my-app

# Install dependencies
npm install`}
                </pre>
              </motion.div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="border-violet-500/20 bg-background/50 backdrop-blur-sm hover:border-violet-400 transition-colors duration-300"
                variants={cardVariants}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary" className="bg-violet-500/10 text-violet-400 border-violet-500/30">
                  3 of 3
                </Badge>
              </div>
              <CardTitle className="text-xl">Development Server</CardTitle>
              <CardDescription className="text-muted-foreground">
                Start your local development.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="bg-background border border-border rounded-lg p-4 font-mono text-sm relative group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-md hover:bg-violet-500/20 text-muted-foreground hover:text-violet-400">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <pre className="text-left overflow-x-auto">
                  {`# Start development server
npm run dev

# Visit http://localhost:3000`}
                </pre>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-24 px-6 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Syntheon?
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Production Ready',
                description: 'Built with Next.js 15, TypeScript, and Tailwind CSS. Optimized for performance and developer experience.',
                icon: Zap
              },
              {
                title: 'Developer Experience',
                description: 'Hot reload, type checking, and zero-config setup. Focus on building your application, not tooling.',
                icon: Terminal
              },
              {
                title: 'Modern Stack',
                description: 'Leverage the latest web standards with React 19, Server Components, and edge runtime support.',
                icon: Layers
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Build?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Follow the installation steps above, then start creating your first application. The community is here to help you along the way.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-12 px-8 bg-violet-600 hover:bg-violet-700 text-white gap-2">
              Read Full Documentation
              <ChevronRight className="w-5 h-5" />
            </Button>

            <Button variant="outline" size="lg" className="h-12 px-8 border-border/50 hover:bg-violet-500/10 gap-2">
              Join Community Discord
                <div className="flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-muted-foreground" />
                  <span>npm create syntheon@latest</span>
                </div>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Syntheon. Built with ❤️ for developers.
          </p>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-violet-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-violet-400 transition-colors">API Reference</a>
            <a href="#" className="hover:text-violet-400 transition-colors">Community</a>
          </nav>
        </div>
      </footer>

      {/* CSS for gradient animation */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </motion.div>
  );
}

export interface GettingStartedSectionProps extends GettingStartedProps {}
