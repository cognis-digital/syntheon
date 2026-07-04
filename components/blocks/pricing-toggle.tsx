'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Zap, ArrowRight } from 'lucide-react';

export interface PricingToggleProps {
  freePlan: {
    name: string;
    description: string;
    features: string[];
    ctaText?: string;
    primary?: boolean;
  };
  proPlan: {
    name: string;
    description: string;
    features: string[];
    price: string;
    ctaText?: string;
    highlight?: boolean;
  };
  defaultPro?: boolean;
  onToggle?: (isPro: boolean) => void;
}

export interface PricingToggleHTMLProps extends React.HTMLAttributes<HTMLDivElement> {}

const DEFAULT_FREE_PLAN: PricingToggleProps['freePlan'] = {
  name: 'Free',
  description: 'Perfect for hobby projects and prototypes.',
  features: [
    'Up to 3 AI agents',
    '10k monthly requests',
    'Community support',
    'Basic analytics',
  ],
  ctaText: 'Start Free',
  primary: false,
};

const DEFAULT_PRO_PLAN: PricingToggleProps['proPlan'] = {
  name: 'Pro',
  description: 'For production apps and teams.',
  features: [
    'Unlimited AI agents',
    '1M monthly requests',
    'Priority support',
    'Advanced analytics & webhooks',
    'Custom models',
  ],
  price: '$49/mo',
  ctaText: 'Upgrade to Pro',
  highlight: true,
};

export default function PricingToggle({
  freePlan = DEFAULT_FREE_PLAN,
  proPlan = DEFAULT_PRO_PLAN,
  defaultPro = false,
  onToggle,
}: PricingToggleProps) {
  const [isPro, setIsPro] = useState(defaultPro);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Toggle Switch */}
      <div className="flex items-center justify-between mb-8 bg-background/50 backdrop-blur-sm rounded-xl p-2 border border-border">
        <Button
          variant={isPro ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => {
            setIsPro(false);
            onToggle?.(false);
          }}
          className={cn(
            'flex-1 rounded-lg px-4 py-2 font-medium transition-all',
            isPro && 'bg-primary text-primary-foreground shadow-sm'
          )}
        >
          {freePlan.name}
        </Button>

        <div className="mx-2 flex items-center">
          <span className="text-muted-foreground text-xs hidden sm:inline">
            Switch plans
          </span>
        </div>

        <Button
          variant={!isPro ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => {
            setIsPro(true);
            onToggle?.(true);
          }}
          className={cn(
            'flex-1 rounded-lg px-4 py-2 font-medium transition-all',
            !isPro && 'bg-primary text-primary-foreground shadow-sm'
          )}
        >
          {proPlan.name}
        </Button>
      </div>

      {/* Plans Container */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <Card
          className={cn(
            'flex flex-col h-full border-border transition-all duration-300',
            isPro && 'opacity-50 scale-[0.98] blur-[1px]'
          )}
        >
          <CardContent className="p-6 flex-1 flex flex-col">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {freePlan.name}
              </h3>
              <p className="text-muted-foreground text-sm">{freePlan.description}</p>
            </div>

            <ul className="space-y-2 mb-6 flex-1">
              {freePlan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              variant={isPro ? 'outline' : 'primary'}
              className="mt-auto w-full justify-center gap-2"
              onClick={() => {
                setIsPro(false);
                onToggle?.(false);
              }}
            >
              {freePlan.ctaText || freePlan.name}
            </Button>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card
          className={cn(
            'flex flex-col h-full border-border transition-all duration-300',
            !isPro && 'opacity-50 scale-[0.98] blur-[1px]',
            proPlan.highlight && 'ring-2 ring-primary/20 shadow-lg'
          )}
        >
          <CardContent className="p-6 flex-1 flex flex-col">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {proPlan.name}
              </h3>
              <p className="text-muted-foreground text-sm">{proPlan.description}</p>
            </div>

            <ul className="space-y-2 mb-6 flex-1">
              {proPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mb-6 flex items-baseline justify-between">
              <span className="text-3xl font-bold text-foreground">{proPlan.price}</span>
              <Badge variant={isPro ? 'secondary' : 'outline'} className="shrink-0">
                Recommended
              </Badge>
            </div>

            <Button
              variant={!isPro ? 'primary' : 'outline'}
              className="mt-auto w-full justify-center gap-2"
              onClick={() => {
                setIsPro(true);
                onToggle?.(true);
              }}
            >
              {proPlan.ctaText || proPlan.name}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Toggle indicator */}
      <div
        className={cn(
          'absolute -bottom-6 left-0 right-0 mx-auto w-32 h-1 bg-background rounded-full transition-all duration-500',
          isPro ? 'ml-48' : 'ml-0'
        )}
      />
    </div>
  );
}
