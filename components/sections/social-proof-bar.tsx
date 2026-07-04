'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SocialProofItemProps {
  name: string;
  role?: string;
  avatarUrl?: string;
  verified?: boolean;
  quote?: string;
}

export interface SocialProofBarProps {
  items: SocialProofItemProps[];
  autoScroll?: boolean;
  scrollSpeed?: number;
  showControls?: boolean;
  className?: string;
}

const DEFAULT_ITEMS: SocialProofItemProps[] = [
  { name: 'Alexandra Chen', role: 'CTO, TechFlow', verified: true },
  { name: 'Marcus Johnson', role: 'Founder, ScaleUp', verified: true },
  { name: 'Sarah Williams', role: 'Product Lead, InnovateCo', verified: false },
  { name: 'David Park', role: 'VP Engineering, BuildRight', verified: true },
  { name: 'Emily Rodriguez', role: 'Design Director, PixelPerfect', verified: true },
];

const DEFAULT_PROPS: SocialProofBarProps = {
  items: DEFAULT_ITEMS,
  autoScroll: false,
  scrollSpeed: 30,
  showControls: true,
};

export function SocialProofBar({
  items = DEFAULT_ITEMS,
  autoScroll = DEFAULT_PROPS.autoScroll,
  scrollSpeed = DEFAULT_PROPS.scrollSpeed,
  showControls = DEFAULT_PROPS.showControls,
  className,
}: SocialProofBarProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className={cn(
        'relative overflow-hidden bg-background py-12',
        'border-y border-border/50',
        'dark:bg-zinc-950 dark:border-zinc-800/30',
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <h2 className="text-2xl font-semibold tracking-tight text-primary">
              Trusted by industry leaders
            </h2>
            <p className="mt-1 text-sm text-muted-foreground max-w-md">
              Join hundreds of companies building their future with Syntheon.
            </p>
          </motion.div>

          {showControls && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => containerRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => containerRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="relative"
        >
          <div
            className={cn(
              'flex gap-6 overflow-x-auto pb-4',
              autoScroll && 'animate-scrolling',
              'scrollbar-thin scrollbar-thumb-border/30 scrollbar-track-transparent',
            )}
          >
            {items.map((item, index) => (
              <SocialProofCard
                key={index}
                {...item}
                delay={index * 0.15}
              />
            ))}

            {/* Duplicate items for seamless infinite scroll illusion */}
            {items.slice(0, 2).map((item, index) => (
              <SocialProofCard
                key={`dup-${index}`}
                {...item}
                delay={3 + index * 0.15}
              />
            ))}
          </div>

          {/* Gradient overlays for fade effect */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </motion.div>
      </div>
    </section>
  );
}

interface SocialProofCardProps {
  name: string;
  role?: string;
  avatarUrl?: string;
  verified?: boolean;
  quote?: string;
  delay: number;
}

function SocialProofCard({
  name,
  role,
  avatarUrl,
  verified = false,
  quote,
  delay,
}: SocialProofCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      className="flex-shrink-0"
    >
      <Card
        className={cn(
          'min-w-[240px] p-5 bg-card/50 backdrop-blur-sm',
          'border border-border/30 hover:border-primary/30 transition-colors duration-300',
          'dark:bg-zinc-900/60 dark:border-zinc-800/20 dark:hover:border-zinc-700/40',
        )}
      >
        <div className="flex items-start gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="h-12 w-12 rounded-full object-cover ring-2 ring-muted/50"
              loading="lazy"
            />
          ) : (
            <div
              className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg"
              aria-hidden="true"
            >
              {name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium text-foreground truncate">{name}</h3>
              {verified && (
                <VerifiedBadge className="h-4 w-4" />
              )}
            </div>

            {role ? (
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                {role}
              </p>
            ) : null}

            {quote && (
              <blockquote className="mt-3 p-2 rounded-md bg-background/50 border border-border/20">
                <p className="text-xs text-primary italic leading-relaxed">
                  &ldquo;{quote}&rdquo;
                </p>
              </blockquote>
            )}

            <div className="flex items-center gap-1 mt-3">
              <StarRating />
              <span className="text-xs text-muted-foreground ml-1">
                4.9/5 rating
              </span>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'mt-4 w-full text-xs h-8',
            'bg-background hover:bg-primary/10 hover:text-primary border-border/30',
            'dark:hover:bg-zinc-800 dark:hover:text-primary',
          )}
        >
          Read full testimonial
          <ChevronRight className="ml-1 h-3 w-3" />
        </Button>
      </Card>
    </motion.div>
  );
}

function VerifiedBadge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('text-primary', className)}
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-5.82 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      <path d="M10 8l4 4 4-4" fill="currentColor" />
    </svg>
  );
}

function StarRating() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
      className="flex gap-0.5"
      aria-hidden="true"
    >
      {[...Array(5)].map((_, i) => (
        <Star key={i} fill="#fbbf24" stroke="#fbbf24" />
      ))}
    </motion.div>
  );
}

function Star({ fill, stroke }: { fill: string; stroke: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill={fill}
      stroke={stroke}
      strokeWidth={0.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

// CSS-in-JS for custom scrollbar and marquee animation
const styles = document.createElement('style');
styles.textContent = `
  .scrollbar-thin::-webkit-scrollbar {
    height: 6px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: hsl(var(--muted-foreground) / 0.15);
    border-radius: 999px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: hsl(var(--muted-foreground) / 0.3);
  }

  @keyframes scroll-horizontal {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .animate-scrolling {
    animation: scroll-horizontal ${scrollSpeed}s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-scrolling {
      animation-duration: 60s;
    }
    .social-proof-card-enter,
    .social-proof-card-leave,
    .social-proof-card-view-transition {
      transition-duration: 100ms;
    }
  }

  @keyframes social-proof-card-enter {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .social-proof-card-enter {
    animation: social-proof-card-enter 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }
`;
document.head.appendChild(styles);
