'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Terminal, Copy, ArrowRight, Zap, Box, Layers, Globe } from 'lucide-react';

// --- Types & Interfaces ---

interface QuickStartProps {
  className?: string;
}

// --- Components ---

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.7]);

  return (
    <motion.section
      style={{ y: y1, opacity }}
      className="relative min-h-[80vh] flex items-center justify-center px-6 md:px-24 overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 0.4 }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[128px]" 
        />
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.3, opacity: 0.3 }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[128px]" 
        />
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-4xl text-center"
      >
        <Badge variant="secondary" className="mb-6 px-3 py-1 text-sm font-medium bg-primary/10 border-primary/20">
          v2.0 Release Notes
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
          Build Faster with Syntheon
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          The modern app builder for teams who demand speed without sacrificing quality. 
          Ship premium UIs in minutes, not weeks.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
            Start Building Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-border hover:bg-muted transition-colors">
            View Documentation
          </Button>
        </div>
      </motion.div>
    </motion.section>
  );
};

const PrerequisitesCard = () => {
  return (
    <Card className="mb-12 overflow-hidden border-border bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-semibold">Prerequisites</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          Ensure your environment meets the following requirements before starting.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm md:text-base">
          {[
            'Node.js 20.x or higher (LTS recommended)',
            'npm, pnpm, or yarn installed globally',
            'A modern browser with JavaScript enabled'
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const StepItem = ({ 
  number, 
  title, 
  description, 
  code, 
  delay 
}: { 
  number: string; 
  title: string; 
  description?: string; 
  code?: string; 
  delay?: number; 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: delay || 0 }}
      className="relative pl-8 md:pl-12 py-6 border-l-2 border-border last:border-transparent group hover:bg-muted/30 px-4 rounded-r-lg transition-colors cursor-default"
    >
      <div className="absolute -left-[9px] top-0 h-5 w-5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
        <span className="text-xs font-bold text-primary">{number}</span>
      </div>
      
      <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">{title}</h3>
      {description && <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>}
      
      {code && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          whileInView={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="relative mt-4 group/code"
        >
          <pre className="bg-background border border-border rounded-lg p-4 md:p-6 font-mono text-sm overflow-x-auto relative">
            {code}
          </pre>
          <div className="absolute top-3 right-3 opacity-0 group-hover/code:opacity-100 transition-opacity">
             {/* Could add a copy button here if needed */}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const QuickStartContent = () => {
  return (
    <section className="max-w-4xl mx-auto px-6 md:px-24 py-12">
      <PrerequisitesCard />
      
      <div className="space-y-8">
        <StepItem 
          number="01"
          title="Initialize a New Project"
          description="Create your Syntheon project with the CLI. This scaffolds all necessary files, dependencies, and configuration."
          code={`npx create-syntheon@latest my-app

# Select defaults:
# - TypeScript: Yes
# - Tailwind CSS: Yes
# - App Router: Yes`}
          delay={0}
        />

        <StepItem 
          number="02"
          title="Install Dependencies"
          description="Navigate into your project directory and install the required packages. This ensures all tools are ready to run."
          code={`cd my-app
pnpm install`}
          delay={0.1}
        />

        <StepItem 
          number="03"
          title="Start Development Server"
          description="Run your local development server. The app will automatically open in your default browser."
          code={`pnpm dev

# Output:
#  ✓ Local: http://localhost:3000`}
          delay={0.2}
        />

        <StepItem 
          number="04"
          title="Deploy to Production"
          description="When ready, deploy your app with a single command. Syntheon handles the build process and environment variables."
          code={`pnpm deploy --prod

# Output:
#  ✓ Built successfully in 12s
#  ✓ Deployed to https://my-app.syntheon.app`}
          delay={0.3}
        />
      </div>

      <Card className="mt-16 bg-primary/5 border-primary/20">
        <CardContent className="p-8 flex items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-semibold mb-1 text-primary">Ready to go live?</h4>
            <p className="text-muted-foreground max-w-xl">
              Deploy your first production app in under 5 minutes. No credit card required for the starter tier.
            </p>
          </div>
          <Button size="lg" className="h-12 px-6 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30">
            Deploy Now
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

// --- Main Page Component ---

export default function QuickStartPage() {
  return (
    <main className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <HeroSection />
      <QuickStartContent />
      
      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 md:px-24">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2024 Syntheon Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Status</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export interface QuickStartMetadata {
  title: 'Quickstart | Syntheon Docs';
  description: 'Get started with Syntheon in minutes. Learn how to initialize, develop, and deploy your first app.';
  keywords: ['syntheon', 'app builder', 'quickstart', 'tutorial'];
}

export interface QuickStartProps extends QuickStartMetadata {
  className?: string;
}
