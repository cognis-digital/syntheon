'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FaqItemProps {
  question: string;
  answer: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}

export interface FaqTwoColumnProps {
  items: FaqItemProps[];
  title?: string;
  subtitle?: string;
  accentColor?: 'violet' | 'indigo';
  showIcons?: boolean;
  staggerDelay?: number;
  expandedByDefault?: boolean;
}

const DEFAULT_ITEMS: FaqItemProps[] = [
  {
    question: 'How long does implementation take?',
    answer: 'Typically 2-4 weeks depending on scope. We provide a detailed timeline during discovery.',
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  {
    question: 'Is there an ongoing support plan?',
    answer: 'Yes, we offer tiered support packages ranging from community access to dedicated account management.',
    icon: <Info className="h-5 w-5" />,
  },
  {
    question: 'Can I customize the design?',
    answer: 'Absolutely. Every project is tailored to your brand identity and user needs.',
    highlight: true,
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
];

const variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
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
    },
  },
};

export function FaqTwoColumn({
  items = DEFAULT_ITEMS,
  title = 'Frequently Asked Questions',
  subtitle = 'Everything you need to know.',
  accentColor = 'violet',
  showIcons = true,
  staggerDelay = 0.15,
  expandedByDefault = false,
}: FaqTwoColumnProps) {
  const isViolet = accentColor === 'violet';

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Background decoration */}
      <div
        className={cn(
          'absolute -inset-full bg-gradient-to-br pointer-events-none',
          isViolet ? 'from-violet-50/50 via-transparent to-violet-50/30 dark:from-violet-950/20 dark:to-transparent' : 'from-indigo-50/50 via-transparent to-indigo-50/30 dark:from-indigo-950/20 dark:to-transparent',
        )}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-16"
        >
          <Badge
            variant={isViolet ? 'secondary' : 'outline'}
            className={cn(
              'mb-4 px-3 py-1 text-sm font-medium',
              isViolet
                ? 'bg-violet-100/50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 border-violet-200/50 dark:border-violet-800'
                : 'bg-indigo-100/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-800',
            )}
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Customer Questions
            </span>
          </Badge>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {items.map((item, index) => (
            <FaqColumn
              key={index}
              item={item}
              isLeft={index % 2 === 0}
              isViolet={isViolet}
              showIcons={showIcons}
              staggerDelay={staggerDelay}
              expandedByDefault={expandedByDefault}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: items.length * staggerDelay + 0.3, duration: 0.6 }}
          className="text-center mt-12 lg:mt-16"
        >
          <Button size="lg" variant={isViolet ? 'default' : 'secondary'}>
            Get Started Today
          </Button>
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute left-8 top-1/2 -translate-y-1/2 lg:left-[max(4rem,calc(50%-60rem))] opacity-30"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="h-[400px] w-[400px] rounded-full bg-gradient-to-br from-violet-400/20 to-transparent blur-3xl" />
      </motion.div>

      <motion.div
        className="absolute right-8 top-1/2 -translate-y-1/2 lg:right-[max(4rem,calc(50%-60rem))] opacity-30"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <div className="h-[400px] w-[400px] rounded-full bg-gradient-to-br from-violet-300/20 to-transparent blur-3xl" />
      </motion.div>
    </section>
  );
}

interface FaqColumnProps {
  item: FaqItemProps;
  isLeft: boolean;
  isViolet: boolean;
  showIcons: boolean;
  staggerDelay: number;
  expandedByDefault: boolean;
}

function FaqColumn({
  item,
  isLeft,
  isViolet,
  showIcons,
  staggerDelay,
  expandedByDefault,
}: FaqColumnProps) {
  const [isOpen, setIsOpen] = React.useState(expandedByDefault);

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      custom={0}
      className={cn(
        'relative',
        isLeft ? 'lg:order-1' : 'lg:order-2',
      )}
    >
      <FaqCard
        item={item}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isViolet={isViolet}
        showIcons={showIcons}
      />

      {/* Side accent bar */}
      <motion.div
        layoutId="side-accent"
        className={cn(
          'absolute h-full w-1 rounded-r-lg',
          isOpen ? 'opacity-100' : 'opacity-50',
          isViolet
            ? 'bg-gradient-to-b from-violet-400 via-violet-300 to-violet-200 dark:from-violet-600 dark:via-violet-500 dark:to-violet-400'
            : 'bg-gradient-to-b from-indigo-400 via-indigo-300 to-indigo-200 dark:from-indigo-600 dark:via-indigo-500 dark:to-indigo-400',
        )}
      />

      {/* Hover glow effect */}
      <motion.div
        layoutId="hover-glow"
        className={cn(
          'absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300',
          isOpen ? 'opacity-15' : 'opacity-0',
          isViolet
            ? 'bg-gradient-to-b from-violet-400/20 via-transparent to-transparent'
            : 'bg-gradient-to-b from-indigo-400/20 via-transparent to-transparent',
        )}
      />
    </motion.div>
  );
}

interface FaqCardProps {
  item: FaqItemProps;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isViolet: boolean;
  showIcons: boolean;
}

function FaqCard({
  item,
  isOpen,
  setIsOpen,
  isViolet,
  showIcons,
}: FaqCardProps) {
  return (
    <motion.div
      layout
      layoutId="faq-card"
      className={cn(
        'relative overflow-hidden rounded-2xl border transition-all duration-300',
        isOpen ? 'shadow-lg shadow-violet-500/10 dark:shadow-violet-900/20' : 'shadow-sm hover:shadow-md',
        isViolet
          ? 'border-violet-200/60 dark:border-violet-800/40 bg-white/70 dark:bg-slate-900/50'
          : 'border-indigo-200/60 dark:border-indigo-800/40 bg-white/70 dark:bg-slate-900/50',
      )}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-start gap-4 cursor-pointer transition-colors duration-200',
            isOpen ? 'text-primary' : 'hover:text-primary/80',
          )}
        >
          {/* Icon container */}
          <div
            className={cn(
              'flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center transition-all duration-300',
              isOpen ? 'bg-violet-100 dark:bg-violet-950/40' : 'bg-muted/50 dark:bg-slate-800/50',
            )}
          >
            {showIcons && item.icon ? (
              <motion.div
                initial={false}
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              >
                {item.icon}
              </motion.div>
            ) : (
              <ChevronDown className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            )}
          </div>

          {/* Question */}
          <div className="flex-1">
            <motion.h3
              layout
              transition={{ duration: 0.2 }}
              className={cn(
                'text-lg font-semibold leading-snug',
                isOpen ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {item.question}
            </motion.h3>

            {/* Highlight badge */}
            {item.highlight && (
              <Badge variant="secondary" className="mt-2">
                Featured Question
              </Badge>
            )}
          </div>

          {/* Toggle indicator */}
          <AnimatePresence>
            {(isOpen || item.highlight) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex-shrink-0"
              >
                <Button
                  variant={isOpen ? 'ghost' : 'outline'}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                  }}
                  className={cn(
                    'h-8 w-8 p-0 rounded-full',
                    isOpen
                      ? 'bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400'
                      : 'text-muted-foreground hover:bg-muted/50',
                  )}
                >
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Answer */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              layout
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
              }}
              className="mt-4 pl-12"
            >
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="text-muted-foreground leading-relaxed"
              >
                {item.answer}
              </motion.p>

              {/* Additional actions */}
              <div className="mt-4 flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  Collapse
                </Button>
                <Button variant="outline" size="sm">
                  Copy Answer
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gradient overlay for depth */}
        <motion.div
          layoutId="gradient-overlay"
          className={cn(
            'absolute inset-0 pointer-events-none transition-opacity duration-300',
            isOpen ? 'opacity-15' : 'opacity-0',
            isViolet
              ? 'bg-gradient-to-br from-violet-400/10 via-transparent to-transparent'
              : 'bg-gradient-to-br from-indigo-400/10 via-transparent to-transparent',
          )}
        />
      </CardContent>
    </motion.div>
  );
}

export default FaqTwoColumn;
