'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface PricingProps {
  title?: string;
  subtitle?: string;
  cards: Array<{
    name: string;
    price: string | number;
    description: string;
    features: string[];
    ctaText: string;
    highlight?: boolean;
    url?: string;
  }>;
  className?: string;
}

export interface PricingCardProps {
  name: string;
  price: string | number;
  description: string;
  features: string[];
  ctaText: string;
  highlight?: boolean;
  url?: string;
  index: number;
  total: number;
}

export interface PricingCardContentProps {
  card: PricingCardProps;
  index: number;
  total: number;
}

const variants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const hoverVariants = {
  initial: { scale: 1, y: 0 },
  hover: { scale: 1.03, y: -8, transition: { duration: 0.2 } },
};

export function PricingCardContent({ card, index, total }: PricingCardContentProps) {
  const isInView = useInView(
    document.getElementById(`pricing-card-${index}`),
    { once: true, margin: '10% 0%' }
  );

  return (
    <motion.div
      id={`pricing-card-${index}`}
      className={cn('relative', card.highlight ? 'ring-2 ring-primary/50' : '')}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants.visible(index)}
    >
      <Card
        className={cn(
          'h-full flex flex-col',
          card.highlight
            ? 'border-primary/50 shadow-xl shadow-primary/10 ring-2 ring-primary/20'
            : 'border-border hover:border-primary/30 transition-colors duration-300',
          'rounded-2xl overflow-hidden bg-background'
        )}
      >
        <CardContent className="flex flex-col flex-grow p-8">
          {card.highlight && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="absolute -top-3 left-1/2 -translate-x-1/2"
            >
              <Badge variant="secondary" className="bg-primary text-primary-foreground shadow-lg">
                Populer
              </Badge>
            </motion.div>
          )}

          <h3 className={cn('text-xl font-semibold mb-3', card.highlight ? 'text-primary' : '')}>
            {card.name}
          </h3>

          <div className="flex items-baseline gap-1 mb-4">
            <span className={cn('text-4xl font-bold tracking-tight', card.highlight ? 'text-primary' : '')}>
              {card.price}
            </span>
            <span className="text-muted-foreground">/bulan</span>
          </div>

          <p className="text-sm text-muted-foreground mb-6 flex-grow">{card.description}</p>

          <ul className="space-y-3 mb-8 flex-grow">
            {card.features.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3 text-sm"
              >
                <svg className="w-4 h-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {feature}
              </motion.li>
            ))}
          </ul>

          <Button
            variant={card.highlight ? 'default' : 'outline'}
            className={cn(
              'w-full py-6 text-base font-medium transition-all duration-300',
              card.highlight && 'shadow-lg hover:shadow-xl hover:-translate-y-1',
              !card.highlight && 'hover:bg-primary/5'
            )}
          >
            {card.ctaText}
            {card.url && (
              <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M10 6H5.83L10 10.17V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M14 6H18.17L14 10.17V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </Button>
        </CardContent>

        {card.highlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60"
          />
        )}
      </Card>
    </motion.div>
  );
}

export function PricingSimple({
  title = 'Pilih Paket',
  subtitle = 'Mulai dengan paket yang tepat untuk kebutuhan Anda.',
  cards,
  className,
}: PricingProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scrollProgress] = useTransform(
    () => {
      if (!containerRef.current) return 0;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      return Math.min(Math.max((windowHeight - rect.top) / (rect.height + windowHeight), 0), 1);
    },
    { clamp: true }
  );

  return (
    <section className={cn('py-24 px-6 md:px-8', className)}>
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto"
        id="pricing-simple"
      >
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4 inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"/>
            <span className="text-sm font-medium">Pilih Paket</span>
          </Badge>

          <h2 className={cn('text-4xl md:text-5xl lg:text-6xl font-bold mb-6', 'bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent')}>
            {title}
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8', 'items-start')}>
          {cards.map((card, index) => (
            <PricingCardContent key={index} card={card} index={index} total={cards.length}/>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-6">
            Masih ragu? Konsultasikan kebutuhan Anda dengan tim kami.
          </p>

          <Button variant="outline" size="lg" className="gap-2">
            Hubungi Kami
            <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M7 7h10v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Button>
        </motion.div>

        {/* Floating gradient accent */}
        <motion.div
          className={cn('absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px]', 'rounded-full bg-primary/10 blur-[100px]', 'pointer-events-none')}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 2, delay: 0.3, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>
    </section>
  );
}

export default PricingSimple;
