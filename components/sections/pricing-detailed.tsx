'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, ArrowRight, Star, Zap, Shield, Globe, Users, TrendingUp } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PricingTierProps {
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  highlight?: boolean;
  ctaText?: string;
}

const tierVariants = {
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export interface PricingDetailedProps {
  tiers: PricingTierProps[];
  highlightId?: string;
}

export default function PricingDetailed({
  tiers = [
    {
      name: 'Starter',
      description: 'Perfect for individuals and small projects.',
      priceMonthly: 29,
      priceYearly: 240,
      features: ['Single project', 'Basic analytics', 'Email support', '1GB storage'],
    },
    {
      name: 'Pro',
      description: 'For growing teams and serious work.',
      priceMonthly: 79,
      priceYearly: 640,
      features: ['Unlimited projects', 'Advanced analytics', 'Priority support', '10GB storage', 'Custom domains'],
    },
    {
      name: 'Enterprise',
      description: 'Maximum power for large organizations.',
      priceMonthly: 199,
      priceYearly: 1680,
      features: ['Everything in Pro', 'Dedicated support', 'Unlimited storage', 'SSO & SAML', 'Custom integrations'],
    },
  ],
  highlightId = 'pro',
}: PricingDetailedProps) {
  const ref = useInView(null, { once: true });

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background gradient with subtle movement */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[60rem] h-[32rem] bg-primary/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 right-[-20%] w-[40rem] h-[40rem] bg-background/50 rounded-full blur-[96px]" />
      </motion.div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16 md:mb-20"
        >
          <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2 text-sm mb-6 bg-muted/50 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5" />
            <span>Choose your plan</span>
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-primary via-violet-300 to-primary bg-[length:200%_auto] animate-shimmer inline-block">
              Pricing that scales with you
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Start free, upgrade as you grow. No hidden fees. Cancel anytime.
          </p>
        </motion.div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12 md:mb-16">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Monthly</span>
          <button
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'relative rounded-full px-1 py-1.5 h-10',
            )}
            aria-label="Toggle billing period"
          >
            <motion.span
              animate={{ x: 24 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary shadow-lg',
                'transition-transform duration-200',
              )}
            />
          </button>
          <span className="text-sm text-muted-foreground whitespace-nowrap">Yearly</span>
          <Badge variant="secondary" className="ml-3 px-3 py-1 text-xs bg-primary/10 border-primary/20">
            Save 20%
          </Badge>
        </div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto"
        >
          {tiers.map((tier, i) => (
            <motion.div key={tier.name} variants={tierVariants} custom={i}>
              <Card className="relative h-full flex flex-col overflow-hidden border-border/60 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
                {/* Highlight indicator */}
                {tier.name === highlightId && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 translate-y-[-6px] z-20">
                    <Badge className="animate-bounce bg-primary text-primary-foreground px-4 py-1.5 shadow-lg border-border/30">
                      <Star className="w-3 h-3 fill-current mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Card Header */}
                <CardHeader className="pb-6 flex-none">
                  <div className={cn(
                    'flex items-center justify-between mb-4',
                    tier.name === highlightId && 'gap-2'
                  )}>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                      {tier.name}
                    </CardTitle>
                    {tier.name === highlightId && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full border-border/40">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium text-primary">Best Value</span>
                      </div>
                    )}
                  </div>

                  <CardDescription className={cn(
                    'text-lg',
                    tier.name === highlightId && 'font-semibold'
                  )}>
                    {tier.description}
                  </CardDescription>
                </CardHeader>

                {/* Price */}
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-8 text-center">
                    <span className={cn(
                      'text-5xl md:text-6xl font-bold tracking-tight',
                      tier.name === highlightId && 'bg-gradient-to-r from-primary to-violet-200 bg-[length:200%_auto] animate-shimmer'
                    )}>
                      ${tier.priceMonthly}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((feature, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + j * 0.05 }}
                        className="flex items-start gap-3 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-primary flex-none" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="mt-auto">
                    <button
                      className={cn(
                        buttonVariants({ variant: tier.name === highlightId ? 'default' : 'outline' }),
                        'w-full py-4 text-base',
                        tier.name === highlightId && 'bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700 shadow-lg shadow-primary/25 border-border/30',
                      )}
                    >
                      Get started — {tier.priceMonthly}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </div>

                  {/* Yearly price */}
                  <p className={cn(
                    'text-center text-sm mt-6',
                    tier.name === highlightId && 'text-primary/80'
                  )}>
                    Or ${tier.priceYearly} yearly (save 20%)
                  </p>
                </CardContent>

                {/* Glow effect for highlighted tier */}
                {tier.name === highlightId && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full h-8 bg-gradient-to-t from-primary/30 to-transparent"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
                  />
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="text-muted-foreground mb-4">Questions about pricing?</p>
          <button className={cn(
            buttonVariants({ variant: 'link' }),
            'underline-offset-4 hover:text-primary transition-colors',
          )}>
            View detailed FAQ &rarr;
          </button>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-gradient-to-t from-background/50 to-transparent"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
      />
    </section>
  );
}
