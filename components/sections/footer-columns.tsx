'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight, Globe, Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Facebook, Youtube, ChevronDown } from 'lucide-react';

interface ColumnData {
  title: string;
  description: string;
  icon?: React.ReactNode;
  links: Array<{ label: string; href: string; external?: boolean }>;
}

export interface FooterColumnsProps {
  columns: ColumnData[];
  className?: string;
  animateOnScroll?: boolean;
  staggerDelay?: number;
}

const defaultColumns: ColumnData[] = [
  {
    title: 'Product',
    description: 'Explore our latest features and capabilities.',
    icon: <Globe className="h-5 w-5" />,
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Roadmap', href: '#roadmap' },
    ],
  },
  {
    title: 'Company',
    description: 'Learn about our team and mission.',
    icon: <MapPin className="h-5 w-5" />,
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'Careers', href: '#careers' },
      { label: 'Press Kit', href: '#press' },
    ],
  },
  {
    title: 'Support',
    description: 'Get help and resources.',
    icon: <Mail className="h-5 w-5" />,
    links: [
      { label: 'Documentation', href: '#docs' },
      { label: 'Contact Support', href: '#support' },
      { label: 'Status', href: '#status' },
    ],
  },
];

const linkVariants = {
  initial: { opacity: 0, y: -8 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 + 0.2, duration: 0.4, ease: [0.23, 1, 0.32, 1] },
  }),
};

const columnVariants = {
  initial: { opacity: 0, y: 60, rotateX: -5 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { delay: i * 0.1 + 0.3, duration: 0.6, ease: [0.25, 1, 0.5, 1] },
  }),
};

const hoverScale = (scale: number) => ({ scale });

export default function FooterColumns({
  columns = defaultColumns,
  className,
  animateOnScroll = true,
  staggerDelay = 200,
}: FooterColumnsProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-150px' });

  return (
    <motion.section
      ref={ref}
      className={cn(
        'relative py-24 px-6 md:px-8 lg:px-12 bg-background overflow-hidden',
        animateOnScroll && 'animate-on-scroll',
        className
      )}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={false}
        animate={{
          backgroundPosition: isInView ? ['0% 50%', '100% 50%'] : ['0% 50%'],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-[128px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.header
          initial={{ opacity: 0, y: -40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
            Stay Connected
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Discover more about Syntheon and how we can help you build the future.
          </p>
        </motion.header>

        {/* Columns grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {columns.map((column, i) => (
            <ColumnCard
              key={i}
              column={column}
              index={i}
              variants={{ initial: columnVariants.initial, animate: columnVariants.animate(i) }}
            />
          ))}
        </div>

        {/* Social links marquee */}
        <motion.div
          className="mt-16 relative"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        >
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            {['Instagram', 'Twitter', 'Linkedin', 'Facebook', 'Youtube'].map((social, i) => (
              <SocialLink key={i} name={social} index={i} />
            ))}
          </div>

          {/* Decorative chevron */}
          <motion.div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, rotateX: -90 }}
            animate={isInView ? { opacity: 1, rotateX: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          >
            <ChevronDown className="h-6 w-6 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

interface ColumnCardProps {
  column: ColumnData;
  index: number;
  variants: { initial: any; animate: (i: number) => any };
}

function ColumnCard({ column, index, variants }: ColumnCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      className="group relative p-6 md:p-8 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors duration-300"
      variants={variants}
      initial="initial"
      animate={isInView ? 'animate' : ''}
    >
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      />

      {/* Icon */}
      <motion.div
        className="mb-5 p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300"
        whileHover={{ scale: 1.05, rotate: -3 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        {column.icon}
      </motion.div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
        {column.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
        {column.description}
      </p>

      {/* Links */}
      <div className="flex flex-col gap-3">
        {column.links.map((link, i) => (
          <motion.a
            key={i}
            href={link.href}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground group/link:text-primary hover:gap-4 transition-all duration-300"
            whileHover={{ x: 4 }}
            initial={{ opacity: 0, y: -8 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: (i + 1) * 0.05 + 0.3, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <span>{link.label}</span>
            {link.external && (
              <motion.span
                className="text-xs text-primary/60"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: (i + 2) * 0.05, duration: 0.3 }}
              >
                ↗
              </motion.span>
            )}
          </motion.a>
        ))}
      </div>

      {/* Corner accent */}
      <motion.div
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        whileHover={{ scale: 1.2, rotate: 90 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      />
    </motion.div>
  );
}

interface SocialLinkProps {
  name: string;
  index: number;
}

function SocialLink({ name, index }: SocialLinkProps) {
  const isHovered = React.useRef(false);

  return (
    <motion.a
      href={`https://social.${name.toLowerCase()}.com`}
      className="relative group"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: index * 0.05 + 0.4, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ scale: 1.1, rotateY: 180 }}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
    >
      <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-background border border-border flex items-center justify-center group-hover:border-primary/30 transition-colors duration-300">
        {/* Animated ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          initial={{ borderColor: 'transparent' }}
          animate={isHovered.current ? { borderColor: 'primary', width: 148, height: 148 } : {}}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* Icon */}
        <span className="text-foreground group-hover:text-primary transition-colors duration-300">
          {name === 'Instagram' && <Instagram className="h-5 w-5" />}
          {name === 'Twitter' && <Twitter className="h-5 w-5" />}
          {name === 'Linkedin' && <Linkedin className="h-5 w-5" />}
          {name === 'Facebook' && <Facebook className="h-5 w-5" />}
          {name === 'Youtube' && <Youtube className="h-5 w-5" />}
        </span>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/10 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"
          initial={false}
          animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.a>
  );
}

// Hook to detect when element is in viewport
function useInViewWithDelay<T extends HTMLElement>(ref: React.RefObject<T>, delay = 0) {
  const isInView = useInView(ref, { once: true, margin: '-150px' });
  
  // Add staggered animation effect
  return React.useMemo(() => ({
    isInView,
    animateProps: {
      opacity: isInView ? 1 : 0,
      y: isInView ? 0 : -20,
      transition: { delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] },
    },
  }), [isInView, delay]);
}
