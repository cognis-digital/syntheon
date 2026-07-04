'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Zap, Shield, Globe, ArrowRight, Star, ChevronDown, ChevronUp } from 'lucide-react';

interface PricingTierProps {
  name: string;
  price: number;
  description: string;
  features: string[];
  ctaText: string;
  highlighted?: boolean;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true);
    }
  }, []);

  return reduced;
}

function useScrollProgress() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  return { scrollYProgress, opacity, scale };
}

export interface PricingProps {
  tiers: PricingTierProps[];
  highlightTierIndex?: number;
  showComparison?: boolean;
}

function createGradientVariants() {
  const variants = {
    hover: {
      scale: 1.02,
      boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.25)',
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    tap: { scale: 0.98 },
  };

  return variants;
}

function createStaggerChildren() {
  const stagger = 0.15;
  const children = Array.from({ length: 4 });

  return {
    children,
    transition: { staggerChildren: stagger, delayChildren: 0.2 },
  };
}

export default function Pricing({ tiers, highlightTierIndex = 1, showComparison = true }: PricingProps) {
  const reducedMotion = useReducedMotion();
  const scrollProgress = useScrollProgress();

  const highlightedTier = tiers[highlightTierIndex];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative min-h-screen bg-background overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/30 via-background to-background"
        />

        {/* Floating particles */}
        {!reducedMotion && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * 100,
                  y: Math.random() * 100,
                  scale: 0.5 + Math.random(),
                  opacity: 0.3 + Math.random() * 0.4,
                }}
                animate={{
                  y: [null, -20, null],
                  x: [null, 20, null],
                  rotate: [null, 180, null],
                }}
                transition={{
                  duration: 15 + Math.random() * 20,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute w-2 h-2 rounded-full bg-violet-400/30 blur-sm"
              />
            ))}
          </>
        )}
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 pt-24 pb-16 px-6 text-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm bg-violet-500/10 border-violet-500/20">
            <Zap className="w-3 h-3 mr-2 fill-current" />
            New: Enterprise tier available
          </Badge>
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
          Pricing Plans
        </h1>

        <p className="text-muted-foreground max-w-xl mx-auto text-lg md:text-xl leading-relaxed">
          Choose the plan that fits your needs. All plans include a 14-day free trial with full feature access.
        </p>
      </motion.header>

      {/* Tier Cards */}
      <main className="relative z-10 px-6 pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.2 + index * 0.1,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              whileHover={!reducedMotion ? { y: -8 } : undefined}
            >
              <Card
                className={cn(
                  'relative h-full flex flex-col overflow-hidden border-border transition-all duration-500',
                  tier.highlighted && 'ring-2 ring-violet-500/50 shadow-xl shadow-violet-900/20'
                )}
              >
                {tier.highlighted && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg animate-pulse">
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Tier Header */}
                <div className="p-8 pb-4 border-b border-border/50">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-muted-foreground text-sm">{tier.description}</p>

                  <div className="mt-6 flex items-baseline gap-1">
                    {tier.price > 0 ? (
                      <>
                        <span className="text-4xl font-bold tracking-tight">
                          ${tier.price}
                        </span>
                        <span className="text-muted-foreground">/month</span>
                      </>
                    ) : (
                      <Badge variant="outline" className="px-3 py-1 text-lg">Free</Badge>
                    )}
                  </div>
                </div>

                {/* Features */}
                <CardContent className="flex-1 p-8 flex flex-col gap-4">
                  {tier.features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </motion.div>
                  ))}

                  {/* CTA Button */}
                  <div className="mt-auto pt-6">
                    <Button
                      variant={tier.highlighted ? 'default' : 'outline'}
                      size="lg"
                      className={cn(
                        'w-full h-12 text-base font-medium transition-all duration-300',
                        tier.highlighted && 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-900/30'
                      )}
                    >
                      {tier.ctaText}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>

                {/* Glow effect for highlighted tier */}
                {tier.highlighted && !reducedMotion && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 via-purple-600/10 to-fuchsia-600/20 blur-xl"
                  />
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Comparison Toggle */}
        {showComparison && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-24 flex justify-center"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => {}}
              className="gap-2 h-12 px-8 text-base"
            >
              <ChevronDown className="w-5 h-5 transition-transform duration-300 rotate-90" />
              Compare Plans
            </Button>
          </motion.div>
        )}

        {/* FAQ Section */}
        <motion.section
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-24 max-w-3xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {[
              { q: 'Can I change plans anytime?', a: 'Yes, upgrade or downgrade your plan at any time. Changes take effect immediately.' },
              { q: 'Is there a free trial?', a: 'All paid plans include a 14-day free trial with full feature access. No credit card required to start.' },
              { q: 'What happens after my trial ends?', a: 'You can continue on your current plan or choose a new one. Your data remains intact throughout.' },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 + i * 0.15 }}
                className="border border-border rounded-lg p-6 hover:border-violet-500/30 transition-colors"
              >
                <h4 className="font-medium mb-2">{faq.q}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Footer CTA */}
      <motion.footer
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="relative z-10 px-6 py-24 text-center"
      >
        <Card className="max-w-2xl mx-auto border-border/50 bg-background/80 backdrop-blur-sm">
          <CardContent className="p-12">
            <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Join thousands of satisfied customers who have transformed their workflow with our platform.
            </p>
            <Button size="lg" className="h-12 px-8 text-base bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500">
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Background glow */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="absolute -inset-24 bg-gradient-to-r from-violet-600/20 via-purple-600/10 to-fuchsia-600/20 blur-3xl"
        />
      </motion.footer>

      {/* Scroll progress indicator */}
      {!reducedMotion && (
        <motion.div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
          style={{ opacity: scrollYProgress }}
        >
          <div className="w-32 h-1 bg-violet-600 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: ['0%', '100%'] }}
              transition={{ duration: scrollYProgress, ease: 'linear' }}
              className="h-full"
            />
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}

function createFadeIn() {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5, ease: 'easeOut' },
  };
}
