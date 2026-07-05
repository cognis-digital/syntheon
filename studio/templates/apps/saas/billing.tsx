'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface BillingProps {
  currentPlan?: 'free' | 'pro' | 'enterprise';
  onUpgrade: (plan: string) => void;
}

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: ['Up to 3 projects', 'Basic analytics', 'Email support'],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'For growing teams',
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      'Custom integrations',
    ],
    cta: 'Upgrade to Pro',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    description: 'For large organizations',
    features: [
      'Everything in Pro',
      'Dedicated support',
      'SLA guarantees',
      'Custom contracts',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const featureCheck = (feature: string, currentPlan?: string) => {
  const included: Record<string, boolean> = { free: true, pro: true, enterprise: true };
  return included[currentPlan ?? 'free'];
};

export default function Billing({
  currentPlan = 'pro',
  onUpgrade,
}: BillingProps) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [1, 0.8]);
  const y = useTransform(scrollY, [0, 300], [0, -20]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="min-h-screen bg-background text-foreground"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background opacity-70" />
        
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-4xl px-6 text-center"
        >
          <Badge variant="secondary" className="mb-6 inline-flex items-center rounded-full border-border bg-muted/50 px-4 py-2 text-sm">
            <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            New: Advanced Analytics Coming Soon
          </Badge>

          <h1 className="mb-6 font-display tracking-tight text-4xl font-extrabold sm:text-6xl">
            <span className="bg-gradient-to-r from-primary via-violet-300 to-primary bg-clip-text text-transparent">
              Choose Your Plan
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-lg/relaxed text-muted-foreground">
            Start free, scale as you grow. No hidden fees. Cancel anytime.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => onUpgrade('pro')}
              variant={currentPlan === 'free' ? 'default' : 'secondary'}
              className="h-12 px-8 text-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {currentPlan === 'free' 
                ? 'Upgrade to Pro — $29/mo' 
                : 'Current Plan Active'}
            </Button>

            <Button variant="ghost" size="lg">
              View Pricing History
            </Button>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl" />
      </section>

      {/* Pricing Cards */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid gap-6 md:grid-cols-3"
          >
            {plans.map((plan, index) => (
              <Card 
                key={plan.name}
                className={cn(
                  "relative flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-2",
                  plan.highlighted && "ring-2 ring-primary/20 shadow-xl scale-105"
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -ml-6 rounded-full bg-gradient-to-r from-primary to-violet-400 px-4 py-1 text-xs font-medium shadow-lg">
                    Most Popular
                  </div>
                )}

                <CardHeader className="pb-8">
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    {plan.name}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-6">
                  <div className="mb-auto text-center">
                    <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                    <p className="mt-2 text-sm text-muted-foreground">per user, per month</p>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <svg 
                          className="h-4 w-4 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={cn(
                      "mt-auto h-12 w-full text-lg",
                      plan.highlighted && "bg-primary shadow-lg hover:shadow-xl"
                    )}
                    onClick={() => onUpgrade(plan.name.toLowerCase() as any)}
                  >
                    {plan.cta}
                  </Button>

                  <AnimatePresence>
                    {currentPlan === 'free' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3 text-center"
                      >
                        <p className="text-sm">
                          Upgrade to Pro for {plan.price}/mo
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="relative py-16 sm:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Compare Features
          </h2>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-border bg-background shadow-xl"
          >
            <div className="grid grid-cols-5 divide-x divide-y divide-border">
              <div className="col-span-1 p-6 font-semibold text-primary">Feature</div>

              {plans.map((plan) => (
                <div 
                  key={plan.name}
                  className="col-span-1 p-6"
                >
                  <h3 className="mb-2 font-medium">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.price === '$0' ? 'Free forever' : `${plan.price}/mo`}
                  </p>
                </div>
              ))}

              {/* Feature rows */}
              {[
                ['Unlimited Projects', true, true, true],
                ['Advanced Analytics', false, true, true],
                ['Priority Support', false, true, true],
                ['Custom Integrations', false, true, true],
                ['API Access', false, true, true],
                ['SSO / SAML', false, false, true],
              ].map((row, i) => (
                <div 
                  key={i}
                  className="col-span-5 p-6 text-center"
                >
                  <span className="text-sm">
                    {row[0]}{' '}
                    <span className="flex justify-center gap-1">
                      {[false, true, true].map((included, j) => (
                        <motion.div
                          key={j}
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ 
                            delay: i * 0.1 + j * 0.1,
                            type: 'spring',
                            stiffness: 500
                          }}
                          className={cn(
                            "h-2 w-2 rounded-full",
                            included ? "bg-primary" : "bg-muted"
                          )}
                        />
                      ))}
                    </span>
                  </span>
                </div>
              ))}

              {/* Upgrade CTA row */}
              <div className="col-span-5 p-8 bg-gradient-to-r from-primary/10 to-violet-500/10">
                <p className="text-center text-sm font-medium">
                  Ready to upgrade?{' '}
                  <Button 
                    variant="link" 
                    onClick={() => onUpgrade('pro')}
                    className="h-auto p-0 text-primary underline-offset-4 hover:underline"
                  >
                    Start Free Trial
                  </Button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
            Frequently Asked Questions
          </h2>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            {[
              { q: 'Can I change plans anytime?', a: 'Yes! Upgrade or downgrade at any time. Prorated charges apply for downgrades.' },
              { q: 'Is there a free trial?', a: 'The Free plan is always available. Pro includes a 14-day free trial with full feature access.' },
              { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and enterprise billing for annual plans.' },
            ].map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-lg border border-border bg-background p-6 shadow-sm hover:border-primary/30 transition-colors"
              >
                <h3 className="mb-2 font-medium">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}

            <Button variant="outline" className="mt-6">
              View All FAQs
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-background to-primary/5">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Still have questions?
          </h2>
          <p className="mb-8 mx-auto max-w-xl text-lg/relaxed text-muted-foreground">
            Our team is here to help you choose the right plan for your needs.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button 
              size="lg" 
              onClick={() => onUpgrade('pro')}
              variant={currentPlan === 'free' ? 'default' : 'secondary'}
              className="h-12 px-8 text-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {currentPlan === 'free' 
                ? 'Upgrade to Pro — $29/mo' 
                : 'Current Plan Active'}
            </Button>

            <a href="#" className="text-primary underline-offset-4 hover:underline">
              Contact Sales &rarr;
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
