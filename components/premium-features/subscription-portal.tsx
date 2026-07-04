'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Star, Zap, Shield, Globe, ArrowRight, Lock, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';

// --- Types ---

export interface PricingTier {
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  recommended?: boolean;
}

interface SubscriptionPortalProps {
  tiers: PricingTier[];
  billingCycle: 'monthly' | 'yearly';
  onToggleBilling: (cycle: 'monthly' | 'yearly') => void;
  onSelectPlan: (tierName: string) => void;
  onSuccess?: () => void;
}

// --- Mock Data Defaults ---

const DEFAULT_TIERS: PricingTier[] = [
  {
    name: 'Starter',
    priceMonthly: 29,
    priceYearly: 290,
    description: 'Perfect for individuals and small projects.',
    features: ['Single project workspace', 'Basic analytics', 'Email support', '1GB storage'],
  },
  {
    name: 'Pro',
    priceMonthly: 79,
    priceYearly: 790,
    description: 'For growing teams and serious professionals.',
    features: ['Unlimited projects', 'Advanced analytics', 'Priority support', '10GB storage', 'Custom domains'],
    recommended: true,
  },
  {
    name: 'Enterprise',
    priceMonthly: 199,
    priceYearly: 1990,
    description: 'Maximum power for large organizations.',
    features: ['Everything in Pro', 'SSO & SAML', 'Dedicated success manager', 'Unlimited storage', 'Custom integrations'],
  },
];

// --- Sub-Components ---

const PricingCard = ({
  tier,
  isActive,
  onClick,
}: {
  tier: PricingTier;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.div
      layoutId="pricing-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'relative flex flex-col p-6 rounded-xl border bg-card/50 backdrop-blur-sm',
        isActive
          ? 'border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10'
          : 'border-border hover:border-border/80'
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-pressed={isActive}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-primary">{tier.name}</h3>
        {tier.recommended && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-xs text-primary font-medium">
            <Star className="w-3 h-3" /> Recommended
          </span>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>

      <div className="mb-6">
        <span className={cn(
          'text-3xl font-bold',
          isActive ? 'text-primary' : 'text-foreground'
        )}>
          ${billingCycle === 'monthly' ? tier.priceMonthly : tier.priceYearly}
        </span>
        <span className="text-sm text-muted-foreground ml-1">/month</span>
      </div>

      <ul className="space-y-2 mb-6 flex-1">
        {tier.features.map((feature, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 + 0.2 }}
            className="flex items-center gap-3 text-sm"
          >
            <CheckCircle2 className={cn(
              'w-4 h-4',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )} />
            <span className={isActive ? 'text-foreground' : 'text-muted-foreground'}>
              {feature}
            </span>
          </motion.li>
        ))}
      </ul>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={cn(
          'w-full py-3 px-4 rounded-lg font-medium transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-background border border-border hover:border-primary/50 hover:text-primary'
        )}
      >
        {isActive ? 'Current Plan' : `Select ${tier.name}`}
      </button>
    </motion.div>
  );
};

const FeatureHighlight = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/50">
    <Icon className="w-5 h-5 text-primary shrink-0" />
    <div>
      <h4 className="font-medium text-sm">{title}</h4>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  </div>
);

// --- Main Component ---

export default function SubscriptionPortal({
  tiers = DEFAULT_TIERS,
  billingCycle = 'monthly',
  onToggleBilling,
  onSelectPlan,
  onSuccess,
}: SubscriptionPortalProps) {
  const [billing, setBilling] = useState(billingCycle);

  useEffect(() => {
    setBilling(billingCycle);
  }, [billingCycle]);

  const toggleBilling = () => {
    setBilling((prev: 'monthly' | 'yearly') => (prev === 'monthly' ? 'yearly' : 'monthly'));
    onToggleBilling(billing);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">Choose Your Plan</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Select the perfect plan for your needs. All plans include a 14-day free trial.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className={cn(
            'text-sm font-medium',
            billing === 'monthly' ? 'text-primary' : 'text-muted-foreground'
          )}>Monthly</span>
          <button
            onClick={toggleBilling}
            role="switch"
            aria-checked={billing === 'yearly'}
            className={cn(
              'relative inline-flex h-8 w-14 items-center rounded-full transition-colors',
              billing === 'yearly' ? 'bg-primary' : 'bg-border'
            )}
          >
            <span
              className={cn(
                'inline-block h-6 w-6 transform rounded-full bg-background shadow transition-transform',
                billing === 'yearly' ? 'translate-x-7' : 'translate-x-1'
              )}
            />
          </button>
          <span className={cn(
            'text-sm font-medium',
            billing === 'yearly' ? 'text-primary' : 'text-muted-foreground'
          )}>Yearly</span>
          {billing === 'yearly' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-xs text-primary"
            >
              Save 20%
            </motion.span>
          )}
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier, index) => (
          <PricingCard
            key={tier.name}
            tier={tier}
            isActive={billing === 'monthly' ? false : true} // Simplified for demo
            onClick={() => onSelectPlan(tier.name)}
          />
        ))}
      </div>

      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <FeatureHighlight
          icon={Zap}
          title="Lightning Fast"
          description="Optimized performance for seamless workflows."
        />
        <FeatureHighlight
          icon={Shield}
          title="Enterprise Security"
          description="Bank-grade encryption and SSO support."
        />
        <FeatureHighlight
          icon={Globe}
          title="Global CDN"
          description="Fast access from anywhere in the world."
        />
        <FeatureHighlight
          icon={Lock}
          title="24/7 Support"
          description="Dedicated support team always ready to help."
        />
      </motion.div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
      >
        <Lock className="w-4 h-4" />
        <span>Secure checkout powered by Stripe</span>
      </motion.div>
    </div>
  );
}

// --- State Hook (inline for self-containment) ---

function useBillingState(initial: 'monthly' | 'yearly') {
  const [billing, setBilling] = useState<SubscriptionPortalProps['billingCycle']>(initial);

  useEffect(() => {
    // Sync with parent prop if changed externally
    if (billing !== initial) {
      setBilling(initial);
    }
  }, [initial]);

  return { billing, toggle: () => setBilling((b) => b === 'monthly' ? 'yearly' : 'monthly') };
}
