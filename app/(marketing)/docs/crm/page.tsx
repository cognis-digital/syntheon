'use client';

import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Database, Zap, BarChart3, ShieldCheck, ArrowRightRight, Code2, 
  CheckCircle2, Layers, Sparkles, ChevronDown, ChevronUp, Terminal
} from 'lucide-react';

interface CRMFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, delay = 0 }: CRMFeatureProps) => {
  const ref = useInView(null, { once: true, margin: '-100px' });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className="group relative p-6 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
      
      <div className="relative z-10">
        <div className="mb-4 p-3 rounded-lg bg-muted/50 text-primary inline-flex">
          {icon}
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>

      <motion.div 
        className="absolute -bottom-1 left-8 right-8 h-0.5 bg-primary/0 group-hover:bg-primary transition-all"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1, borderRadius: '4px' }}
      />
    </motion.div>
  );
};

const CodeBlock = () => {
  const code = `// Initialize Syntheon CRM integration
import { createClient } from '@syntheon/sdk';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SYNTHEON_ID,
});

// Fetch connected CRMs
const crms = await client.crm.list();

// Get analytics for a specific CRM
const stats = await client.analytics.getCRMStats({
  id: 'salesforce',
  period: '30d'
});`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-xl overflow-hidden bg-card border border-border"
    >
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm">
          TypeScript SDK
        </span>
        <button 
          className="p-2 hover:bg-muted rounded-md transition-colors"
          aria-label="Copy code"
        >
          <Code2 className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <pre className="m-0 p-6 overflow-x-auto">
        <code className="text-sm font-mono leading-relaxed">
          {code.split('\n').map((line, i) => (
            <span key={i} className={cn(
              'inline',
              line.includes('//') ? 'text-muted-foreground' : '',
              line.includes('const') || line.includes('let') || line.includes('var') ? 'text-purple-400' : '',
              line.includes('=') ? 'text-pink-400' : ''
            )}>
              {line}
            </span>
          ))}
        </code>
      </pre>

      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm">
          SDK v2.4.0 • TypeScript 5.x
        </span>
        <button 
          className="px-3 py-1.5 text-xs rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
          aria-label="Copy to clipboard"
        >
          Copy
        </button>
      </div>
    </motion.div>
  );
};

const AccordionItem = ({ 
  question, 
  answer, 
  isOpen, 
  onToggle,
  icon 
}: { 
  question: string; 
  answer: React.ReactNode; 
  isOpen: boolean; 
  onToggle: () => void;
  icon?: React.ReactNode;
}) => (
  <div className="border-b border-border last:border-0">
    <button
      onClick={onToggle}
      className="w-full flex items-start gap-4 py-6 text-left hover:bg-muted/20 transition-colors"
      aria-expanded={isOpen}
    >
      <span className="flex-shrink-0 p-1.5 rounded-lg bg-background border border-border">
        {icon || <ChevronDown className={`w-4 h-4 ${isOpen ? 'rotate-180' : ''}`} />}
      </span>
      
      <div className="flex-1">
        <h3 className="font-medium mb-1">{question}</h3>
        {answer}
      </div>

      <ChevronDown 
        className={`w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} 
      />
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="pb-6">
            {answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export interface CRMPageProps {}

export default function CRMPage(): React.JSX.Element {
  const containerRef = useInView(null, { once: true });
  
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        <motion.div 
          className="relative z-10 max-w-7xl mx-auto px-6 py-24 sm:py-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>New CRM Integration</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Build your app with 
              <span className="bg-gradient-to-r from-primary via-purple-300 to-primary bg-clip-text text-transparent animate-pulse">
                {' '}Syntheon CRM
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              Connect your application to Salesforce, HubSpot, Pipedrive, and 50+ CRMs with a single line of code. Real-time sync, analytics, and automation out of the box.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                aria-label="Get started with CRM integration"
              >
                Start Building Free
                <ArrowRightRight className="w-4 h-4" />
              </button>

              <a 
                href="#docs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background border border-border text-foreground font-medium hover:bg-muted transition-colors"
              >
                Read the Docs
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Parallax Hero Text */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-primary/10 to-transparent"
          initial={{ y: 0 }}
          whileInView={{ y: -50 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
            <motion.div 
              className="text-8xl font-bold tracking-tighter text-primary/5 select-none"
              initial={{ y: 0 }}
              whileInView={{ y: -100 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
            >
              CRM
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative">
        <div className="max-w-7xl mx-auto px-6 py-24 sm:py-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything you need to ship faster
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built by developers, for developers. No configuration required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Database className="w-6 h-6" />}
              title="Real-time Sync"
              description="Bi-directional sync with sub-second latency. Changes propagate automatically across all connected CRMs."
              delay={0}
            />

            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Analytics Dashboard"
              description="Track conversion rates, pipeline velocity, and user behavior with built-in analytics powered by Recharts."
              delay={0.1}
            />

            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Instant Setup"
              description="Connect your CRM in under 2 minutes using our OAuth flow or API keys. No database migrations needed."
              delay={0.2}
            />

            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6" />}
              title="Enterprise Security"
              description="SOC 2 Type II certified, end-to-end encryption, and SSO integration ready for your compliance needs."
              delay={0.3}
            />

            <FeatureCard
              icon={<Layers className="w-6 h-6" />}
              title="Multi-CRM Support"
              description="Connect Salesforce, HubSpot, Pipedrive, Zoho, and 50+ more CRMs simultaneously with unified data models."
              delay={0.4}
            />

            <FeatureCard
              icon={<CheckCircle2 className="w-6 h-6" />}
              title="Developer Experience"
              description="TypeScript SDK with full autocomplete, JSDoc comments, and example code snippets for every method."
              delay={0.5}
            />
          </div>

          {/* Code Snippet */}
          <motion.div 
            className="mt-16 grid lg:grid-cols-2 gap-8 items-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div>
              <h3 className="text-2xl font-semibold mb-4">Get started in minutes</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The Syntheon SDK provides a simple, intuitive API for integrating your app with CRMs. With just a few lines of code, you can start syncing data and building powerful features.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Type-safe TypeScript API</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Automatic error handling and retries</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Detailed logging with structured events</span>
                </div>
              </div>
            </div>

            <CodeBlock />
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative">
        <div className="max-w-4xl mx-auto px-6 py-24 sm:py-32">
          <h2 className="text-3xl font-bold tracking-tight mb-10 text-center">
            Frequently asked questions
          </h2>

          <div className="space-y-2">
            <AccordionItem
              isOpen={false}
              onToggle={() => {}}
              icon={<ChevronDown />}
            >
              <p className="text-muted-foreground leading-relaxed">
                Is there a free tier? Yes, the Free plan includes up to 10 connected CRMs and 1GB of storage. Perfect for startups and side projects. Upgrade to Pro at any time as you grow.
              </p>
            </AccordionItem>

            <AccordionItem
              isOpen={false}
              onToggle={() => {}}
              icon={<ChevronDown />}
            >
              <p className="text-muted-foreground leading-relaxed">
                What CRMs are supported? We support Salesforce, HubSpot, Pipedrive, Zoho CRM, Freshsales, Close, Gong, Outreach, and 50+ more. Check our full list in the docs.
              </p>
            </AccordionItem>

            <AccordionItem
              isOpen={false}
              onToggle={() => {}}
              icon={<ChevronDown />}
            >
              <p className="text-muted-foreground leading-relaxed">
                Can I use this with my existing CRM data? Absolutely. The SDK provides migration utilities to import your historical data, and the webhook system keeps everything in sync going forward.
              </p>
            </AccordionItem>

            <AccordionItem
              isOpen={false}
              onToggle={() => {}}
              icon={<ChevronDown />}
            >
              <p className="text-muted-foreground leading-relaxed">
                What about pricing? The Free tier is perfect for getting started. Pro plans start at $29/month and include unlimited CRMs, advanced analytics, and priority support. Enterprise plans are available upon request.
              </p>
            </AccordionItem>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative">
        <motion.div 
          className="max-w-7xl mx-auto px-6 py-24 sm:py-32"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-purple-900/20 to-background p-12 sm:p-20 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

            <motion.div 
              className="relative z-10 max-w-3xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
                Ready to build something amazing?
              </h2>

              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of developers who are already shipping faster with Syntheon. Start your free trial today—no credit card required.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                  aria-label="Start free trial"
                >
                  Start Free Trial
                  <ArrowRightRight className="w-4 h-4" />
                </button>

                <a 
                  href="#docs"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-background border border-border text-foreground font-medium hover:bg-muted transition-colors"
                >
                  Read the Documentation
                </a>
              </div>
            </motion.div>

            <motion.div 
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-t from-primary/20 to-transparent blur-3xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-sm text-muted-foreground">
              © 2024 Syntheon. Built with ❤️ for developers.
            </div>

            <nav className="flex items-center gap-6">
