'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface RewardTier {
  threshold: number;
  reward: string;
  icon?: React.ReactNode;
}

interface ReferralWidgetProps {
  /** Enable or disable the widget */
  enabled: boolean;
  
  /** Custom title text */
  title: string;
  
  /** Subtitle/description text */
  description: string;
  
  /** Current referral count */
  referralsMade: number;
  
  /** Pending referrals awaiting verification */
  pendingReferrals: number;
  
  /** Rewards earned so far */
  rewardsEarned: number;
  
  /** Reward tiers for progress tracking */
  rewardTiers?: RewardTier[];
  
  /** Custom URL to copy */
  referralUrl: string;
  
  /** Custom CTA text */
  ctaText: string;
  
  /** Enable animated counter effect */
  animateCounter: boolean;
  
  /** Enable progress bar animation */
  animateProgress: boolean;
  
  /** Enable hover effects */
  enableHoverEffects: boolean;
  
  /** Custom icon component */
  icon?: React.ReactNode;
  
  /** Theme variant (light/dark/system) */
  themeVariant: 'default' | 'dark';
}

const DEFAULT_TIER: RewardTier = {
  threshold: 10,
  reward: '5% Commission',
};

export interface ReferralWidgetProps extends ReferralWidgetProps {}

export default function ReferralWidget({
  enabled = true,
  title = 'Referral Rewards',
  description = 'Earn rewards for every verified referral.',
  referralsMade = 0,
  pendingReferrals = 0,
  rewardsEarned = 0,
  rewardTiers = [DEFAULT_TIER],
  referralUrl = '',
  ctaText = 'Copy Referral Link',
  animateCounter = true,
  animateProgress = true,
  enableHoverEffects = true,
  icon: CustomIcon,
  themeVariant = 'default',
}: ReferralWidgetProps) {
  const [copied, setCopied] = useState(false);

  // Calculate progress toward next tier
  const calculateNextTierProgress = () => {
    if (rewardTiers.length === 0 || rewardTiers[0].threshold <= 0) return 1;
    
    const currentTierIndex = rewardTiers.findIndex(
      t => rewardsEarned >= t.threshold
    );
    
    if (currentTierIndex < 0) return 0;
    
    const nextTier = rewardTiers[currentTierIndex + 1];
    if (!nextTier || nextTier.threshold <= rewardsEarned) return 1;
    
    const remaining = nextTier.threshold - rewardsEarned;
    const totalNext = nextTier.threshold - (rewardTiers[currentTierIndex].threshold);
    
    return Math.min(remaining / totalNext, 1);
  };

  // Handle copy to clipboard with feedback
  const handleCopy = async () => {
    if (!referralUrl) return;
    
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  // Calculate progress for current tier
  const nextTierProgress = calculateNextTierProgress();
  const currentTierIndex = rewardTiers.findIndex(
    t => rewardsEarned < t.threshold && (rewardTiers.length === 1 || rewardsEarned >= rewardTiers[0].threshold)
  );

  return (
    <motion.div
      className={cn('relative overflow-hidden', themeVariant === 'dark' ? 'bg-background/50 dark:bg-card/80' : '')}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute -inset-px opacity-30 blur-2xl"
        style={{
          background: themeVariant === 'dark' 
            ? 'radial-gradient(ellipse, hsla(265, 100%, 70%, 0.4), transparent)'
            : 'radial-gradient(circle at 30% 20%, hsla(265, 90%, 80%, 0.2), transparent)',
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <Card className={cn('relative border-border/50 shadow-xl', enableHoverEffects && 'hover:shadow-2xl hover:border-primary/30 transition-shadow duration-500')}>
        <motion.div variants={itemVariants} className="h-full">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold tracking-tight text-primary">
                  {title}
                </CardTitle>
                <CardDescription className={cn(
                  'text-sm max-w-md',
                  themeVariant === 'dark' ? 'text-muted-foreground/70' : ''
                )}>
                  {description}
                </CardDescription>
              </div>

              {/* Custom icon */}
              <motion.div
                className={cn(
                  'p-3 rounded-full bg-primary/10 text-primary',
                  enableHoverEffects && 'hover:bg-primary/20 transition-colors cursor-pointer'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {CustomIcon ? <CustomIcon /> : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.547-1.248 1.093m-3.006 1.093a4 4 0 104 4 4 4 0 00-4-4z" />
                  </svg>
                )}
              </motion.div>
            </div>

            {/* Progress bar */}
            {rewardTiers.length > 0 && (
              <motion.div 
                className="mt-6 space-y-2"
                variants={itemVariants}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className={cn(
                    'font-medium',
                    themeVariant === 'dark' ? 'text-muted-foreground/80' : ''
                  )}>
                    Next reward: {rewardTiers[currentTierIndex]?.threshold - rewardsEarned} / {rewardTiers[currentTierIndex]?.threshold || 10} referrals
                  </span>
                  
                  <Badge 
                    variant="outline" 
                    className={cn(
                      'ml-4 px-3 py-1 text-xs',
                      themeVariant === 'dark' ? 'border-border/50 bg-background/50' : ''
                    )}
                  >
                    {currentTierIndex >= 0 && rewardTiers[currentTierIndex] 
                      ? `Tier ${currentTierIndex + 1}` 
                      : 'Starting'}
                  </Badge>
                </div>

                <Progress 
                  value={nextTierProgress * 100} 
                  className="h-2 bg-muted/50"
                  indicatorClassName={cn(
                    'bg-gradient-to-r from-primary via-primary/80 to-primary',
                    animateProgress && 'animate-shimmer'
                  )}
                />

                <div className="flex justify-between text-xs">
                  <span className={cn('text-muted-foreground/60', themeVariant === 'dark' ? '' : '')}>
                    {currentTierIndex >= 0 
                      ? `Current: ${rewardTiers[currentTierIndex].threshold} referrals`
                      : 'Starting tier'}
                  </span>
                  
                  <span className={cn('text-muted-foreground/60', themeVariant === 'dark' ? '' : '')}>
                    {nextTierProgress >= 1 
                      ? rewardTiers[currentTierIndex + 1]?.reward || 'Max rewards'
                      : `${Math.round(nextTierProgress * 100)}% to next tier`}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Stats summary */}
            <motion.div 
              className="mt-6 grid grid-cols-2 gap-4"
              variants={itemVariants}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="space-y-1">
                <span className={cn(
                  'text-2xl font-bold tracking-tight',
                  themeVariant === 'dark' ? 'text-primary' : ''
                )}>
                  {animateCounter ? (
                    <motion.span
                      key={referralsMade}
                      initial={{ opacity: 0, scale: 1.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {referralsMade.toLocaleString()}
                    </motion.span>
                  ) : (
                    referralsMade.toLocaleString()
                  )}
                </span>
                <span className={cn(
                  'text-xs font-medium',
                  themeVariant === 'dark' ? 'text-muted-foreground/60' : ''
                )}>
                  Referrals made
                </span>
              </div>

              <div className="space-y-1">
                <span className={cn(
                  'text-2xl font-bold tracking-tight',
                  themeVariant === 'dark' ? 'text-primary/80' : ''
                )}>
                  {animateCounter ? (
                    <motion.span
                      key={rewardsEarned}
                      initial={{ opacity: 0, scale: 1.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {rewardsEarned.toLocaleString()}
                    </motion.span>
                  ) : (
                    rewardsEarned.toLocaleString()
                  )}
                </span>
                <span className={cn(
                  'text-xs font-medium',
                  themeVariant === 'dark' ? 'text-muted-foreground/60' : ''
                )}>
                  Rewards earned
                </span>
              </div>
            </motion.div>

            {/* Pending count */}
            {pendingReferrals > 0 && (
              <motion.div 
                className="mt-4 flex items-center gap-2 text-sm"
                variants={itemVariants}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 }}
              >
                <Badge variant="secondary" className="px-2 py-1">
                  {pendingReferrals} pending verification
                </Badge>
              </motion.div>
            )}

            {/* CTA button */}
            <motion.div 
              className="mt-6 flex items-center gap-3"
              variants={itemVariants}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                onClick={handleCopy}
                disabled={!referralUrl || copied}
                className={cn(
                  'flex-1 min-w-[200px] h-11',
                  enableHoverEffects && 'transition-all duration-300 hover:scale-[1.02]',
                  themeVariant === 'dark' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
                )}
              >
                <motion.span
                  className={cn(
                    'flex items-center gap-2',
                    copied && 'text-primary-foreground'
                  )}
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-4a2 2 0 00-2-2h-8a2 2 0 00-2 2v4a2 2 0 002 2z" />
                      </svg>
                      {ctaText}
                    </>
                  )}
                </motion.span>

                <span className="sr-only">Copy referral link</span>
              </Button>

              {/* Copy status indicator */}
              <motion.div
                className={cn(
                  'p-2 rounded-full transition-colors',
                  copied 
                    ? 'bg-green-500/10 text-green-500' 
                    : themeVariant === 'dark' 
                      ? 'bg-muted/30 text-muted-foreground/60 hover:bg-muted/50'
                      : ''
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-4a2 2 0 00-2-2h-8a2 2 0 00-2 2v4a2 2 0 002 2z" />
                  </svg>
                )}
              </motion.div>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Tier rewards list */}
            {rewardTiers.map((tier, index) => (
              <motion.div 
                key={index}
                className={cn(
                  'relative pl-8 pb-6 last:pb-0',
                  enableHoverEffects && 'hover:bg-muted/20 rounded-lg transition-colors'
                )}
                variants={itemVariants}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.08 }}
              >
                {/* Tier number badge */}
                <div className="absolute left-0 top-0 flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {index + 1}
                </div>

                {/* Progress to this tier */}
                <Progress 
                  value={(rewardsEarned / tier.threshold) * 100}
                  className="h-1.5 mb-3 bg-muted/40"
                  indicatorClassName={cn(
                    'bg-primary',
                    animateProgress && 'animate-shimmer'
                  )}
                />

                {/* Tier details */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className={cn(
                      'text-sm font-medium',
                      themeVariant === 'dark' ? 'text-muted-foreground/80' : ''
                    )}>
                      {tier.threshold} referrals
                    </span>
                    {tier.reward && (
                      <>
                        {' '}
                        <Badge variant="outline" className={cn(
                          'ml-2 px-2 py-0.5 text-xs',
                          themeVariant === 'dark' ? 'border-border/30 bg-background/30' : ''
                        )}>
                          {tier.reward}
                        </Badge>
                      </>
                    )}
                  </div>

                  <span className={cn(
                    'text-xs text-muted-foreground/50',
                    themeVariant === 'dark' ? '' : ''
                  )}>
                    {Math.min((rewardsEarned / tier.threshold) * 100, 100).toFixed(0)}% complete
                  </span>
                </div>

                {/* Visual connector line */}
                <motion.div 
                  className="absolute left-7 top-8 w-px bg-gradient-to-b from-primary/20 to-transparent"
                  style={{ height: 'calc(100% - 4rem)' }}
                />
              </motion.div>
            ))}

            {/* Animated marquee for social proof */}
            <motion.div 
              className="relative overflow-hidden rounded-lg bg-muted/30 p-4"
              variants={itemVariants}
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="text-xs text-muted-foreground/70"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
