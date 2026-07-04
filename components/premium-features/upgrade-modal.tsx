'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2, X, ArrowRight, Zap, Shield, Globe, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'monthly' | 'yearly';
}

const features = [
  {
    icon: Zap,
    title: 'Instant Deployment',
    description: 'Deploy to production in seconds with zero downtime.',
    premium: true,
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC2 Type II certified infrastructure with automated audits.',
    premium: true,
  },
  {
    icon: Globe,
    title: 'Global Edge Network',
    description: '150+ edge locations worldwide for blazing fast load times.',
    premium: false,
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Real-time collaboration with 256 concurrent users included.',
    premium: true,
  },
];

const pricing = {
  monthly: {
    name: 'Monthly',
    price: 49,
    features: ['10 Projects', 'Priority Support', 'API Access'],
  },
  yearly: {
    name: 'Yearly (Save 20%)',
    price: 39,
    features: ['Unlimited Projects', '24/7 Phone Support', 'Full API Access', 'Custom Domains'],
  },
};

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
      duration: 0.4,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      type: 'spring',
      stiffness: 400,
      damping: 32,
    },
  }),
};

export default function UpgradeModal({ isOpen, onClose, variant = 'monthly' }: UpgradeModalProps) {
  const currentPricing = pricing[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 flex items-center justify-center z-[10000]"
          >
            <Card className="w-full max-w-2xl bg-background/95 backdrop-blur-xl border-border shadow-2xl overflow-hidden">
              {/* Header */}
              <CardHeader className="border-b border-border/50 p-6 md:p-8 flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-semibold tracking-tight text-primary gradient-text">
                    Upgrade to Pro
                  </CardTitle>
                  <CardDescription className="mt-1 text-muted-foreground/90 max-w-md">
                    Unlock powerful features and get ahead of the competition.
                  </CardDescription>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted/80 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </motion.button>
              </CardHeader>

              {/* Body */}
              <CardContent className="p-6 md:p-8">
                {/* Pricing Toggle & Display */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Badge variant={variant === 'yearly' ? 'default' : 'secondary'} className="h-6 px-3 text-sm">
                      {currentPricing.name}
                    </Badge>
                    <span className="text-4xl font-bold tracking-tight gradient-text">
                      ${currentPricing.price}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>

                  <motion.div
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  >
                    <Zap className="h-3 w-3 fill-primary/20 text-primary" />
                    <span>Save {variant === 'yearly' ? '20%' : '0%'} with yearly billing</span>
                  </motion.div>
                </div>

                {/* Feature List */}
                <div className="space-y-3 mb-8">
                  {currentPricing.features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                      className="flex items-center gap-3 text-muted-foreground"
                    >
                      <CheckCircle2 className="h-5 w-5 fill-primary/20 text-primary shrink-0" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}

                  {/* Premium Features Highlight */}
                  {features.filter(f => f.premium).map((feature, i) => (
                    <motion.div
                      key={i}
                      variants={childVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ scale: 1.02 }}
                      className={cn(
                        'flex items-center gap-3 p-4 rounded-lg border transition-all duration-300',
                        variant === 'yearly' ? 'bg-primary/5 border-primary/20 hover:bg-primary/8 cursor-pointer' : 'bg-muted/50 border-border/50'
                      )}
                    >
                      <feature.icon className={cn('h-6 w-6', variant === 'yearly' ? 'fill-primary text-primary' : 'text-muted-foreground')} />
                      <div>
                        <p className="font-medium tracking-tight">{feature.title}</p>
                        <p className="text-xs text-muted-foreground/70">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    buttonVariants({ variant: 'default' }),
                    'w-full py-6 text-lg font-semibold rounded-xl gradient-glow bg-primary hover:bg-primary/90',
                    variant === 'yearly' && 'shadow-primary/25 shadow-lg'
                  )}
                >
                  Get Started Now — ${currentPricing.price} / month
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.button>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground/70">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 fill-primary/20 text-primary" />
                    99.9% Uptime SLA
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 fill-primary/20 text-primary" />
                    24/7 Support
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 fill-primary/20 text-primary" />
                    Free Migration
                  </span>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-muted-foreground/60 mt-4">
                  14-day money-back guarantee. No questions asked.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
