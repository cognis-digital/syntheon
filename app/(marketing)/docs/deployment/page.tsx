import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Terminal, ShieldAlert, Zap, Globe, Clock, ChevronDown, Copy, RefreshCw, Server, Activity, FileCode, Layers, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Deployment Guide | Syntheon',
  description: 'Complete deployment documentation for the Syntheon app builder. Learn how to deploy your applications safely and efficiently.',
};

interface DeploymentCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  steps?: string[];
}

const DeploymentCard = ({ icon, title, description, steps }: DeploymentCardProps) => {
  const ref = useInView({ threshold: 0.1 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '50px' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-background border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4">{description}</p>
          {steps && (
            <ul className="space-y-2 text-sm">
              {steps.map((step, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-primary/60 font-mono">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const StepIndicator = ({ current, total }: { current: number; total: number }) => {
  return (
    <nav aria-label="Progress" className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: current > i ? 1 : 0.8, 
            opacity: current >= i ? 1 : 0.3,
            backgroundColor: current > i ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
          }}
          transition={{ duration: 0.2 }}
          className="w-2 h-2 rounded-full"
        />
      ))}
    </nav>
  );
};

const DeploymentPage = () => {
  const containerRef = useScroll();
  const targetRef = useInView({ threshold: 0.1 });
  
  const y = useTransform(
    containerRef.scrollY,
    [0, 500],
    [0, -60]
  );

  return (
    <motion.main
      ref={containerRef}
      className="min-h-screen bg-background"
    >
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div 
          style={{ transform: y }}
          className="absolute inset-0 pointer-events-none opacity-50"
        >
          <motion.div
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -left-48 top-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -150, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
            className="absolute -right-48 top-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Zap className="w-4 h-4" />
            <span>Production Ready</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Deployment Guide
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Deploy your Syntheon applications with confidence. Follow these steps to ensure a smooth, reliable production release.
          </p>
        </motion.div>

        {/* Animated Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative z-10 max-w-5xl mx-auto px-6 mt-12"
        >
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {[
              { label: 'Uptime', value: '99.9%', icon: Activity },
              { label: 'Deployments/Day', value: '50,000+', icon: Zap },
              { label: 'Success Rate', value: '99.7%', icon: CheckCircle2 },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                className="text-center p-6 rounded-xl bg-background/50 border border-border backdrop-blur-sm"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Deployment Methods */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">Choose Your Deployment Method</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <DeploymentCard
            icon={<Terminal className="w-5 h-5" />}
            title="Git-Based Deployment"
            description="The most common approach. Triggers automatically on push to main/production branch."
            steps={[
              'Set your repository as the source',
              'Configure environment variables in your repo settings',
              'Enable auto-deploy for production branch',
              'Verify webhook URL and secret key',
            ]}
          />

          <DeploymentCard
            icon={<Server className="w-5 h-5" />}
            title="Manual Deployment"
            description="Full control over timing. Ideal for scheduled releases or emergency patches."
            steps={[
              'Build your application locally',
              'Push to the production branch',
              'Verify build artifacts in CI pipeline',
              'Execute deployment command manually',
            ]}
          />

          <DeploymentCard
            icon={<Layers className="w-5 h-5" />}
            title="Blue-Green Deployment"
            description="Zero-downtime deployments with instant rollback capability."
            steps={[
              'Deploy new version to secondary environment',
              'Run smoke tests against new deployment',
              'Switch traffic to production via load balancer',
              'Monitor for errors and performance metrics',
            ]}
          />

          <DeploymentCard
            icon={<RefreshCw className="w-5 h-5" />}
            title="Rolling Deployment"
            description="Gradual rollout across instances. Minimize impact on users."
            steps={[
              'Configure canary percentage (start at 1%)',
              'Monitor error rates and latency',
              'Incrementally increase traffic to new version',
              'Complete rollout or rollback if issues detected',
            ]}
          />
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">Quick Start</h2>

        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border -ml-px md:ml-0" />

          {[
            { title: 'Prepare', icon: FileCode, description: 'Update your code and verify dependencies' },
            { title: 'Build & Test', icon: Activity, description: 'Run CI pipeline with full test suite' },
            { title: 'Deploy', icon: Zap, description: 'Execute deployment to production' },
            { title: 'Verify', icon: CheckCircle2, description: 'Confirm health checks pass' },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '50px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative flex items-center gap-6 md:gap-8 py-8"
            >
              <div className={cn(
                "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                i === 3 ? 'bg-primary text-primary-foreground' : 'bg-background border-2 border-border text-muted-foreground',
              )}>
                <step.icon className="w-5 h-5" />
              </div>

              <div className={cn(
                "flex-1 pl-4 md:pl-0",
                i % 2 === 0 ? 'md:text-left' : 'md:text-right',
              )}>
                <h3 className="text-xl font-semibold mb-1">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>

              <ChevronDown 
                className={cn(
                  "w-5 h-5 text-primary opacity-0 transition-opacity",
                  i % 2 === 0 ? 'md:rotate-180' : '',
                )}
              />
            </motion.div>
          ))}
        </div>

        <StepIndicator current={4} total={4} />
      </section>

      {/* Environment Variables */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">Environment Variables</h2>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-background border border-border rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 bg-muted/30 border-b border-border">
            <h3 className="font-medium">Required Variables</h3>
            <button 
              onClick={() => {}}
              className="p-2 hover:bg-background rounded-md transition-colors"
              aria-label="Copy to clipboard"
            >
              <Copy className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <pre className="p-6 overflow-x-auto">
{`# Production environment variables
NEXT_PUBLIC_APP_URL=https://your-app.syntheon.io
DATABASE_URL=postgresql://user:password@host:5432/production
REDIS_URL=redis://cache-cluster.redis.example.com:6379

# Feature flags (optional)
FEATURE_ANALYTICS=true
FEATURE_BETA_FEATURES=false

# Monitoring
SENTRY_DSN=https://key@sentry.io/project-id
LOG_LEVEL=info`}
          </pre>
        </motion.div>
      </section>

      {/* Rollback Procedures */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <ShieldAlert className="w-10 h-10 text-primary" />
          <h2 className="text-3xl font-bold">Rollback Procedures</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-background border border-border rounded-xl p-6"
        >
          <div className="flex items-start gap-4 mb-6">
            <AlertTriangle className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">When to Rollback</h3>
              <ul className="space-y-1 text-muted-foreground">
                {[
                  'Error rate exceeds 5% threshold',
                  'Latency increases by more than 2x baseline',
                  'Critical feature broken or missing',
                  'User reports significant issues in production',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Quick Rollback Command</h3>
          <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-sm">
{`# Emergency rollback (executes in ~2 minutes)
npx @syntheon/deploy:rollback --production --reason "High error rate"

# Or via CLI with custom reason
deploy rollback prod --reason "User-facing bug fix needed"`}
          </pre>
        </motion.div>
      </section>

      {/* Monitoring & Observability */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">Monitoring</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: 'Real-time Metrics', icon: Activity, description: 'Watch your deployment in real-time with live graphs' },
            { title: 'Error Tracking', icon: AlertTriangle, description: 'Catch errors as they happen with full stack traces' },
            { title: 'User Sessions', icon: Globe, description: 'See how many users are affected by each release' },
            { title: 'Performance Budgets', icon: Zap, description: 'Alert when latency or throughput deviates from baseline' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="p-6 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <item.icon className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="mt-8 w-full py-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          Open Dashboard →
        </motion.button>
      </section>

      {/* FAQ */}
      <section className="py-20 max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>

        <div className="space-y-4">
          {[
            { q: 'How long does a typical deployment take?', a: 'Most deployments complete within 5-10 minutes. Blue-green and rolling deployments may take 15-30 minutes depending on instance count.' },
            { q: 'Can I schedule deployments for specific times?', a: 'Yes, use the scheduled deploy feature to set up recurring or one-time releases at your preferred time.' },
            { q: 'What happens if deployment fails mid-process?', a: 'The system automatically rolls back to the previous stable version. You\'ll receive an email notification with details.' },
          ].map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '40px' }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <h3 className="font-semibold mb-2">{faq.q}</h3>
              <p className="text-muted-foreground">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-primary/5 border border-border rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Deploy?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Start your first deployment in minutes. Follow the quick start guide above or contact our team for assistance.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
