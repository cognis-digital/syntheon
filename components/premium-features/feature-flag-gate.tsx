'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export interface FeatureFlagGateProps {
  featureId: string;
  flagType?: 'subscription' | 'manual' | 'trial';
  subscriptionTier?: 'free' | 'pro' | 'enterprise';
  manualOverride?: boolean;
  trialDaysRemaining?: number;
  isPremiumUnlocked: boolean;
  onDismiss?: () => void;
  onUpgradeClick?: () => void;
  onContinueLimited?: () => void;
  title?: string;
  description?: string;
  ctaLabel?: string;
}

export interface FeatureFlagGateState {
  isVisible: boolean;
  showFullOverlay: boolean;
  dismissed: boolean;
}

const DEFAULT_STATE: FeatureFlagGateState = {
  isVisible: false,
  showFullOverlay: true,
  dismissed: false,
};

function getTierBadge(tier?: string) {
  const tiers: Record<string, { label: string; color: string }> = {
    free: { label: 'Free', color: 'bg-muted text-muted-foreground' },
    pro: { label: 'Pro', color: 'bg-primary/10 text-primary border-border' },
    enterprise: { label: 'Enterprise', color: 'bg-accent/10 text-accent border-border' },
  };

  return tier ? tiers[tier] : { label: '', color: '' };
}

function getTrialBadge(days?: number) {
  if (days === undefined || days <= 0) return null;
  
  const colors = [
    'bg-red-500/10 text-red-400',
    'bg-orange-500/10 text-orange-400', 
    'bg-yellow-500/10 text-yellow-400',
    'bg-green-500/10 text-green-400',
  ];

  const index = Math.min(Math.floor(days / 7), colors.length - 1);
  return { label: `${days} days`, color: colors[index] };
}

export function FeatureFlagGate({
  featureId,
  flagType = 'subscription',
  subscriptionTier = 'free',
  manualOverride = false,
  trialDaysRemaining = undefined,
  isPremiumUnlocked = false,
  onDismiss,
  onUpgradeClick,
  onContinueLimited,
  title = 'Premium Feature Unlocked',
  description = '',
  ctaLabel = 'Upgrade Now',
}: FeatureFlagGateProps) {
  const tierBadge = getTierBadge(subscriptionTier);
  const trialBadge = getTrialBadge(trialDaysRemaining);

  return (
    <AnimatePresence>
      {!isPremiumUnlocked && !manualOverride && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Card className="cn border-border/60 bg-background/95 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
                    <span className="cn bg-gradient-to-r from-violet-500 to-purple-600 px-2 py-0.5 rounded-md text-xs font-medium">
                      {tierBadge.label || 'Standard'}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground/80">
                    {description}
                  </CardDescription>
                </div>

                {(trialDaysRemaining !== undefined && trialDaysRemaining > 0) ? (
                  <Badge variant="outline" className={cn('gap-1', trialBadge?.color || 'bg-muted')}>
                    <span className="text-xs">{trialBadge?.label}</span>
                  </Badge>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDismiss?.()}
                    className="cn text-foreground hover:bg-background/50 rounded-full p-2"
                    aria-label="Close overlay"
                  >
                    ✕
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="cn space-y-4"
              >
                <div className="cn text-sm text-muted-foreground/80">
                  {description || 'Upgrade to access this premium feature and unlock additional capabilities.'}
                </div>

                <div className="cn flex items-center justify-between gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onContinueLimited?.()}
                    className={cn('gap-1', tierBadge.color || 'bg-muted')}
                  >
                    Continue with Limited Features
                  </Button>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onUpgradeClick?.()}
                    className={cn(
                      'gap-2 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600',
                      tierBadge.color || ''
                    )}
                  >
                    <span>Upgrade</span>
                    {tierBadge.label && (
                      <span className="cn text-xs opacity-80">({tierBadge.label})</span>
                    )}
                  </Button>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {isPremiumUnlocked && (
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Card className="cn border-border/60 bg-background/95 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
                    <span className="cn bg-gradient-to-r from-green-500 to-emerald-600 px-2 py-0.5 rounded-md text-xs font-medium">
                      {tierBadge.label || 'Standard'}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground/80">
                    Premium Feature Unlocked!
                  </CardDescription>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDismiss?.()}
                  className="cn text-foreground hover:bg-background/50 rounded-full p-2"
                  aria-label="Close overlay"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="cn space-y-4"
              >
                <div className="cn text-sm text-muted-foreground/80">
                  You have unlocked this premium feature with your current plan.
                </div>

                <div className="cn flex items-center justify-between gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onContinueLimited?.()}
                    className={cn('gap-1', tierBadge.color || 'bg-muted')}
                  >
                    Continue with Full Access
                  </Button>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onUpgradeClick?.()}
                    className={cn(
                      'gap-2 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600',
                      tierBadge.color || ''
                    )}
                  >
                    <span>Upgrade</span>
                    {tierBadge.label && (
                      <span className="cn text-xs opacity-80">({tierBadge.label})</span>
                    )}
                  </Button>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

FeatureFlagGate.defaultProps = {
  featureId: 'default-feature',
  flagType: 'subscription',
  subscriptionTier: 'free',
  manualOverride: false,
  trialDaysRemaining: undefined,
  isPremiumUnlocked: false,
  onDismiss: () => {},
  onUpgradeClick: () => {},
  onContinueLimited: () => {},
  title: 'Premium Feature Unlocked',
  description: '',
  ctaLabel: 'Upgrade Now',
};

export default FeatureFlagGate;
