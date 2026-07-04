'use client'

import { motion, useInView, useScroll, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

export interface PaywallGateProps {
  title: string
  description?: string
  features: Array<{
    icon: React.ReactNode
    text: string
    highlight?: boolean
  }>
  tiers: Array<{
    name: string
    price: string | number
    period: 'monthly' | 'yearly'
    features: string[]
    ctaText: string
    recommended?: boolean
  }>
  isPremium: boolean
  isTrial: boolean
  onUpgrade: () => void
  onTogglePlan: (tierIndex: number) => void
}

const variants = {
  container: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  },
  card: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  },
  featureItem: {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.4, 
        delay: i * 0.1,
        ease: 'easeOut' 
      }
    })
  },
  button: {
    hover: { scale: [1, 1.02, 1], transition: { duration: 0.3 } }
  }
}

export const PaywallGate = ({
  title,
  description,
  features,
  tiers,
  isPremium,
  isTrial,
  onUpgrade,
  onTogglePlan,
}: PaywallGateProps) => {
  const ref = useInView({ threshold: 0.1 })

  return (
    <motion.div
      className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8"
      initial="hidden"
      animate="visible"
      variants={variants.container}
      transition={{ duration: 0.5 }}
      ref={ref}
    >
      <motion.div
        className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 md:gap-12 items-center"
        initial="hidden"
        animate="visible"
        variants={variants.container}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Left Panel - Hero & Features */}
        <motion.div
          className="lg:sticky lg:top-8 space-y-6"
          initial="hidden"
          animate="visible"
          variants={variants.container}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Hero Card */}
          <motion.div
            className="relative overflow-hidden rounded-2xl bg-card border border-border p-8 md:p-10 shadow-xl"
            variants={variants.card}
            whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none" />

            <AnimatePresence mode="wait">
              {!isPremium && (
                <motion.div
                  key="not-premium"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Badge className="mb-4 bg-primary text-primary-foreground px-4 py-2">
                    {isTrial ? 'Free Trial Active' : 'Upgrade Required'}
                  </Badge>
                </motion.div>
              )}

              <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight">
                {title}
              </CardTitle>

              <CardDescription className="mt-2 text-lg max-w-xl">
                {description || 'Unlock the full power of Syntheon and take your workflow to the next level.'}
              </CardDescription>

              {/* Features List */}
              <div className="mt-8 space-y-4">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: variants.featureItem.hidden, visible: variants.featureItem.visible(i) }}
                    initial="hidden"
                    animate="visible"
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors duration-200"
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                      feature.highlight 
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                        : 'bg-background border border-border'
                    )}>
                      {feature.icon}
                    </div>
                    <p className="text-foreground">{feature.text}</p>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <AnimatePresence mode="wait">
                {!isPremium && (
                  <motion.div
                    key="cta"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      size="lg"
                      className={cn(
                        'w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90',
                        isTrial && 'border-2 border-primary/50'
                      )}
                      onClick={onUpgrade}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isTrial ? (
                        <span className="flex items-center gap-2">
                          Start Free Trial · 14 Days
                        </span>
                      ) : (
                        'Upgrade Now'
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </AnimatePresence>

            {/* Premium Badge */}
            {isPremium && (
              <motion.div
                key="premium-badge"
                className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-full p-2 shadow-lg shadow-primary/40"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </motion.div>
            )}
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            {features.slice(0, 3).map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="p-4 rounded-lg bg-card border border-border"
              >
                <div className="text-2xl font-bold text-primary">{f.text.split(' ')[0]}</div>
                <div className="text-sm text-muted-foreground truncate max-w-[140px]">{f.text}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Panel - Pricing Tiers */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="space-y-4">
            {tiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="relative"
              >
                <Card
                  className={cn(
                    'h-full border-2 transition-all duration-300 cursor-pointer',
                    tier.recommended && 'border-primary ring-4 ring-primary/20 shadow-xl shadow-primary/10'
                  )}
                  onClick={() => !isPremium && onTogglePlan(i)}
                >
                  <CardHeader className="pb-4">
                    <div className={cn(
                      'flex items-center justify-between',
                      tier.recommended ? '' : 'opacity-50'
                    )}>
                      <CardTitle className="text-xl">{tier.name}</CardTitle>
                      {tier.recommended && (
                        <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className={cn(
                        'text-3xl font-bold',
                        tier.recommended ? 'text-primary' : ''
                      )}>
                        {tier.price}
                      </span>
                      <span className="text-muted-foreground">{tier.period === 'yearly' ? '/yr' : '/mo'}</span>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3">
                      {tier.features.map((feature, j) => (
                        <motion.li
                          key={j}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 + i * 0.1 + j * 0.05 }}
                          className="flex items-center gap-3 text-sm"
                        >
                          <svg className={cn(
                            'w-4 h-4 shrink-0',
                            tier.recommended ? 'text-primary' : 'text-muted-foreground'
                          )} fill="currentColor" viewBox="0 0 24 24">
                            {tier.recommended && (
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            )}
                            {!tier.recommended && (
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            )}
                          </svg>
                          {feature}
                        </motion.li>
                      ))}
                    </ul>

                    <Button
                      className={cn(
                        'w-full mt-6',
                        tier.recommended ? 'bg-primary hover:bg-primary/90' : 'opacity-50'
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        !isPremium && onTogglePlan(i)
                      }}
                    >
                      {tier.ctaText}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Toggle Plans */}
          {!isPremium && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-6 p-4 rounded-lg bg-muted/50 border border-border"
            >
              <p className="text-sm text-muted-foreground mb-3">Switch plans anytime:</p>
              <div className="flex gap-2">
                {tiers.map((_, i) => (
                  <Button
                    key={i}
                    variant={isPremium ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onTogglePlan(i)}
                    className={cn(
                      'flex-1',
                      isPremium && 'bg-primary text-primary-foreground hover:bg-primary/90'
                    )}
                  >
                    {tiers[i].name}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Background decoration */}
      <motion.div
        className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
      >
        <div className={cn(
          'absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[128px]',
          isPremium ? 'bg-primary/10' : 'bg-primary/5'
        )} />
        <div className={cn(
          'absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-[128px]',
          isPremium ? 'bg-primary/10' : 'bg-primary/5'
        )} />
      </motion.div>

      {/* Reduced motion preference */}
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </motion.div>
  )
}

// Default props for convenience
PaywallGate.defaultProps = {
  title: 'Unlock Premium Features',
  description: '',
  features: [
    { icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>, text: 'Advanced Analytics', highlight: true },
    { icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 13c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>, text: 'Custom Integrations' },
    { icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>, text: 'Priority Support' },
    { icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>, text: 'Unlimited Projects' },
    { icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6.83-9.17l-1.41 1.41A5.98 5.98 0 0016 12c0 .78.17 1.52.46 2.19l1.41-1.41C16.36 12.8 15.6 13 14.8 13h-.01L12 15.79V13c-2.76 0-5 2.24-5 5v1l-1.41 1.41A7.94 7.94 0 012 17h20a7.94 7.94 0 01-.59-3.59L22.41 8.83C22.6 8.16 22.77 7.42 22.83 6.67l-1.41-1.41c-.06.75-.23 1.49-.46 2.19z" /></svg>, text: 'Team Collaboration' },
    { icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 13c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>, text: 'API Access' },
    { icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>, text: 'Automated Workflows' },
    { icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-
