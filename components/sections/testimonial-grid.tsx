'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  quote: string;
  avatarUrl?: string | null;
}

export interface TestimonialGridProps {
  testimonials: Testimonial[];
  columns?: number;
  layout?: 'grid' | 'masonry';
  animationSpeed?: 'slow' | 'normal' | 'fast';
  hoverEffect?: boolean;
  showCompany?: boolean;
}

const ANIMATION_CONFIGS = {
  slow: { duration: 0.8, delayRange: [150, 300] },
  normal: { duration: 0.6, delayRange: [100, 200] },
  fast: { duration: 0.4, delayRange: [50, 150] },
};

const DEFAULT_CONFIG = {
  columns: 3,
  layout: 'grid',
  animationSpeed: 'normal',
  hoverEffect: true,
  showCompany: false,
};

export function TestimonialGrid({
  testimonials = [],
  ...props
}: TestimonialGridProps & Partial<TestimonialGridProps>) {
  const config = { ...DEFAULT_CONFIG, ...props };
  const animationConfig = ANIMATION_CONFIGS[config.animationSpeed];

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Real results from real people. No fluff, just proof.
          </p>
        </motion.div>

        <div
          className={cn(
            'grid gap-6 sm:gap-8',
            config.layout === 'masonry' ? 'auto-rows-[200px]' : '',
            config.columns === 1 ? 'grid-cols-1' :
              config.columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
                config.columns >= 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
                  'grid-cols-1',
          )}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              data={testimonial}
              index={index}
              animationConfig={animationConfig}
              hoverEffect={config.hoverEffect}
            />
          ))}
        </div>

        {testimonials.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground"
          >
            No testimonials yet. Start collecting feedback!
          </motion.div>
        )}
      </div>
    </section>
  );
}

interface TestimonialCardProps {
  data: Testimonial;
  index: number;
  animationConfig: typeof ANIMATION_CONFIGS.normal;
  hoverEffect: boolean;
}

function TestimonialCard({
  data,
  index,
  animationConfig,
  hoverEffect,
}: TestimonialCardProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '0px 0px 100px 0px' });

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: animationConfig.duration,
        delay: index * animationConfig.delayRange[0] / 3,
        ease: 'easeOut',
      }}
      whileHover={hoverEffect ? { scale: 1.02, y: -4 } : undefined}
      className={cn(
        'relative p-6 sm:p-8 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow duration-300',
        hoverEffect ? 'cursor-pointer' : '',
      )}
    >
      <div className="flex flex-col h-full">
        <blockquote className="flex-grow">
          <p className="text-lg leading-relaxed text-foreground/90">
            {data.quote}
          </p>
        </blockquote>

        <div className="mt-6 pt-6 border-t border-border/50 flex items-center gap-3">
          <AvatarWithFallback url={data.avatarUrl} />
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">{data.name}</span>
            {data.company && config.showCompany ? (
              <span className="text-sm text-muted-foreground">{data.role}, {data.company}</span>
            ) : data.role ? (
              <span className="text-sm text-muted-foreground">{data.role}</span>
            ) : null}
          </div>
        </div>

        {/* Quote accent line */}
        <div className="absolute -bottom-1 left-6 right-6 h-1 bg-gradient-to-r from-primary/20 via-primary/30 to-transparent" />
      </div>
    </motion.div>
  );
}

function AvatarWithFallback({ url }: { url?: string | null }) {
  if (!url) {
    return (
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <span className="text-sm font-medium">
          {('ABCDEFGHIJKLMNOPQRSTUVWXYZ').charAt(Math.floor(Math.random() * 26)}
        </span>
      </div>
    );
  }

  return (
    <motion.img
      src={url}
      alt=""
      className="w-10 h-10 rounded-full object-cover border-2 border-border"
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ duration: 0.3 }}
    />
  );
}

// Sample data for preview rendering
const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'TechFlow Inc.',
    quote: "The platform transformed how we handle our engineering workflows. Our deployment time dropped by 60% in just two weeks.",
    avatarUrl: null,
  },
  {
    id: 't-2',
    name: 'Marcus Johnson',
    role: 'Product Lead',
    company: 'Streamline Labs',
    quote: "Incredible attention to detail. The UI feels premium and every interaction is delightful.",
    avatarUrl: null,
  },
  {
    id: 't-3',
    name: 'Elena Rodriguez',
    role: 'Head of Design',
    company: 'PixelPerfect',
    quote: "We've tried many tools, but nothing comes close to this level of polish and performance.",
    avatarUrl: null,
  },
];

export default TestimonialGrid;
