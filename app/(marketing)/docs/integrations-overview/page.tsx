'use client';

import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Zap, Globe, Shield, Layers, Code2, Box, ArrowRightRight, 
  CheckCircle2, Activity, Server, Database, CloudRain, Cpu
} from 'lucide-react';

interface IntegrationCardProps {
  name: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
  verified?: boolean;
  category: 'core' | 'extended' | 'beta';
}

const integrationData = [
  {
    id: 'stripe',
    name: 'Stripe Payments',
    icon: <Zap className="h-5 w-5" />,
    description: 'Accept payments globally with built-in compliance and fraud protection.',
    features: ['One-click checkout', 'Subscription management', 'Revenue recognition'],
    verified: true,
    category: 'core'
  },
  {
    id: 'sendgrid',
    name: 'SendGrid Email',
    icon: <Globe className="h-5 w-5" />,
    description: 'Transactional and marketing email delivery with analytics.',
    features: ['Template builder', 'A/B testing', 'Deliverability monitoring'],
    verified: true,
    category: 'core'
  },
  {
    id: 'sentry',
    name: 'Sentry Error Tracking',
    icon: <Shield className="h-5 w-5" />,
    description: 'Real-time error monitoring with session replay.',
    features: ['Stack traces', 'User sessions', 'Performance tracking'],
    verified: true,
    category: 'core'
  },
  {
    id: 'prisma',
    name: 'Prisma ORM',
    icon: <Database className="h-5 w-5" />,
    description: 'Type-safe database access with migrations.',
    features: ['Auto-migrations', 'Query builder', 'Studio interface'],
    verified: true,
    category: 'extended'
  },
  {
    id: 'vercel',
    name: 'Vercel Deployment',
    icon: <CloudRain className="h-5 w-5" />,
    description: 'Seamless CI/CD with preview deployments.',
    features: ['Git hooks', 'Edge functions', 'Analytics'],
    verified: true,
    category: 'extended'
  },
  {
    id: 'supabase',
    name: 'Supabase Auth & DB',
    icon: <Server className="h-5 w-5" />,
    description: 'PostgreSQL database with authentication and realtime.',
    features: ['OAuth providers', 'Row-level security', 'Edge functions'],
    verified: true,
    category: 'extended'
  },
];

const motionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' }
  })
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

export interface IntegrationsOverviewProps {
  className?: string;
}

export default function IntegrationsOverview({ className }: IntegrationsOverviewProps) {
  const { scrollYProgress } = useScroll();
  const isInView = useInView(null, { once: true });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      className={cn('min-h-screen bg-background text-foreground', className)}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <motion.div 
          style={{ height: '60vh' }}
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0.5, scale: 1 }}
          animate={isInView ? { opacity: 0.3, scale: 1.2 } : {}}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background" />
        </motion.div>

        <div className="container mx-auto px-4 py-24 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="bg-gradient-to-r from-primary to-primary/40 bg-clip-text text-transparent">
              Integrations
            </span>
            {' '}Overview
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12"
          >
            Connect Syntheon with your existing stack. All integrations are production-ready, 
            type-safe, and designed to work seamlessly together.
          </motion.p>

          <div className="flex items-center justify-center gap-4">
            <Button size="lg" variant="primary" asChild>
              <a href="#all-integrations">View All Integrations</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/docs/integrations/api-reference">API Reference</a>
            </Button>
          </div>
        </div>

        {/* Animated progress bar */}
        <motion.div 
          className="fixed bottom-0 left-0 h-1 bg-primary"
          style={{ scaleX: scrollYProgress }}
        />
      </section>

      {/* Categories Overview */}
      <section id="all-integrations" className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { name: 'Core', count: 3, icon: Zap, color: 'from-orange-500/20 to-orange-500/5' },
            { name: 'Extended', count: 4, icon: Layers, color: 'from-blue-500/20 to-blue-500/5' },
            { name: 'Beta', count: 1, icon: Activity, color: 'from-purple-500/20 to-purple-500/5' },
          ].map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.2 }}
            >
              <Card className="h-48 border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground">{cat.count} integrations</p>
                  </div>
                  <div 
                    className={cn('w-2 h-2 rounded-full', cat.color)}
                    style={{ background: `linear-gradient(to bottom, ${cat.color})` }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Separator className="my-16" />

        {/* Integration Grid */}
        <Tabs defaultValue="all">
          <TabsList className="mb-8 w-full justify-center bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              All ({integrationData.length})
            </TabsTrigger>
            <TabsTrigger value="core">Core</TabsTrigger>
            <TabsTrigger value="extended">Extended</TabsTrigger>
          </TabsList>

          {(['all', 'core', 'extended'] as const)[tab] && (
            <ScrollArea className="h-[calc(100vh-480px)] rounded-lg border-border bg-card">
              <div className="container mx-auto px-4 py-6">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {integrationData.filter((i) => tab === 'all' || i.category === tab).map(
                    (integration, index) => {
                      const categoryColors = {
                        core: 'bg-green-500/10 text-green-700 dark:text-green-400',
                        extended: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
                        beta: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                      };

                      return (
                        <motion.div key={integration.id} variants={motionVariants} custom={index}>
                          <Card className="h-full border-border hover:border-primary/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div 
                                  className={cn(
                                    'w-12 h-12 rounded-xl flex items-center justify-center',
                                    integration.verified ? 'bg-primary/10' : 'bg-muted'
                                  )}
                                >
                                  {integration.icon}
                                </div>
                                <Badge 
                                  variant={categoryColors[integration.category].replace('text-', '')}
                                  className="shrink-0"
                                >
                                  {integration.category.toUpperCase()}
                                </Badge>
                              </div>

                              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                                {integration.name}
                              </h3>

                              <p className="text-sm text-muted-foreground mb-4">
                                {integration.description}
                              </p>

                              <div className="flex flex-wrap gap-2 mb-4">
                                {integration.features.slice(0, 2).map((feature) => (
                                  <Badge key={feature} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                <span 
                                  className={cn(
                                    'text-sm',
                                    integration.verified ? 'text-green-600 dark:text-green-400' : ''
                                  )}
                                >
                                  {integration.verified && (
                                    <CheckCircle2 className="inline-block w-3 h-3 mr-1" />
                                  )}
                                  {integration.verified ? 'Verified' : 'In development'}
                                </span>

                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                                >
                                  <ArrowRightRight className="w-4 h-4 mr-2" />
                                  Documentation
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    }
                  )}
                </motion.div>

                {integrationData.filter((i) => tab === 'all' || i.category === tab).length === 0 && (
                  <div className="text-center py-24 text-muted-foreground">
                    No integrations found in this category.
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          {/* Code Examples Tab */}
          <TabsContent value="code" className="mt-6">
            <ScrollArea className="h-[calc(100vh-320px)] rounded-lg border-border bg-card">
              <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-semibold mb-6">Quick Start Examples</h2>

                <Tabs defaultValue="stripe" className="w-full">
                  <TabsList className="mb-4 bg-muted/50">
                    {['Stripe', 'SendGrid', 'Sentry'].map((provider) => (
                      <TabsTrigger key={provider} value={provider.toLowerCase()}>
                        {provider}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {[
                    {
                      name: 'Stripe Setup',
                      code: `// 1. Install the package
npm install @syntheon/stripe

// 2. Configure in your app config
export const stripeConfig = {
  idempotencyKey: \`stripe_\${process.env.STRIPE_SECRET_KEY}\`,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
};

// 3. Initialize the client
import { createStripeClient } from '@syntheon/stripe';

const stripe = createStripeClient(stripeConfig);

// 4. Create a checkout session
const session = await stripe.createCheckout({
  amount: 2900, // in cents
  currency: 'usd',
  mode: 'subscription',
});

console.log('Session URL:', session.url);`
                    },
                    {
                      name: 'SendGrid Email',
                      code: `// 1. Install dependencies
npm install @syntheon/sendgrid nodemailer

// 2. Configure environment variables
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

// 3. Create a transactional email
import { createEmailClient } from '@syntheon/sendgrid';

const client = createEmailClient({ apiKey: SENDGRID_API_KEY });

await client.send({
  to: 'user@example.com',
  subject: 'Welcome to Syntheon',
  html: \`<h1>Welcome!</h1><p>Your account is ready.</p>\`,
});`
                    },
                    {
                      name: 'Sentry Error Tracking',
                      code: `// 1. Install the SDK
npm install @syntheon/sentry

// 2. Initialize in your entry point
import { createSentryClient } from '@syntheon/sentry';

const sentry = createSentryClient({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// 3. Auto-capture errors automatically
sentry.autoCaptureErrors();

// 4. Manually capture with context
await sentry.captureException(new Error('Something went wrong'), {
  tags: { feature: 'checkout' },
  user: { id: 'user_123', email: 'user@example.com' },
});`
                    }
                  ].map((example, i) => (
                    <TabsContent key={example.name} value={example.name.toLowerCase()} className="mt-4">
                      <h3 className="text-xl font-semibold mb-3">{example.name}</h3>
                      <pre className="bg-muted rounded-lg p-6 overflow-x-auto text-sm leading-relaxed">
                        {example.code}
                      </pre>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-24 bg-primary/5 border border-primary/20 rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to integrate?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Start building with Syntheon's pre-built integrations. 
            All examples are production-ready and fully typed.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" variant="primary">
              Get Started Free
            </Button>
            <Button variant="outline" asChild>
              <a href="/docs/integrations/pricing">View Pricing</a>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-border/50 mt-24">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>&copy; 2024 Syntheon. All rights reserved.</p>
          <nav className="flex gap-6">
            <a href="/docs/integrations/api-reference" className="hover:text-primary transition-colors">API</a>
            <a href="/docs/integrations/changelog" className="hover:text-primary transition-colors">Changelog</a>
            <a href="/docs/integrations/support" className="hover:text-primary transition-colors">Support</a>
          </nav>
        </div>
      </footer>
    </motion.div>
  );
}
