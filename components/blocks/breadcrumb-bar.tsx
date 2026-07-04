'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronRight, ArrowUpRight, Circle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

export interface BreadcrumbBarProps {
  items: BreadcrumbItem[];
  variant?: 'default' | 'minimal' | 'premium';
  onNavigate?: (item: BreadcrumbItem) => void;
  showCurrentPage?: boolean;
  className?: string;
}

const variants = {
  default: {
    base: {
      bg: 'bg-background',
      itemBg: 'bg-muted/50',
      text: 'text-foreground',
      activeText: 'text-primary font-medium',
      iconColor: 'text-muted-foreground',
      hoverIcon: 'text-primary',
      border: 'border-border',
      shadow: 'shadow-sm',
    },
  },
  minimal: {
    base: {
      bg: 'bg-transparent',
      itemBg: 'bg-transparent',
      text: 'text-foreground/80',
      activeText: 'text-primary font-semibold',
      iconColor: 'text-foreground/50',
      hoverIcon: 'text-primary',
      border: 'border-border/40',
      shadow: '',
    },
  },
  premium: {
    base: {
      bg: 'bg-background/80 backdrop-blur-xl',
      itemBg: 'bg-muted/30',
      text: 'text-foreground',
      activeText: 'text-primary font-medium',
      iconColor: 'text-violet-400',
      hoverIcon: 'text-violet-300',
      border: 'border-border/60',
      shadow: 'shadow-lg shadow-violet-500/10',
    },
  },
};

const defaultItems: BreadcrumbItem[] = [
  { label: 'Home', href: '/', icon: <Circle className="h-4 w-4" /> },
  { label: 'AI Builder', href: '/ai-builder', icon: <CheckCircle2 className="h-4 w-4" /> },
];

export function BreadcrumbBar({
  items = defaultItems,
  variant = 'default',
  onNavigate,
  showCurrentPage = true,
  className,
}: BreadcrumbBarProps) {
  const config = variants[variant].base;
  const isPremium = variant === 'premium';

  return (
    <motion.nav
      role="navigation"
      aria-label="Breadcrumb navigation"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'flex items-center gap-1 overflow-x-auto py-3',
        config.bg,
        isPremium ? 'rounded-xl border' : '',
        config.shadow,
        className
      )}
    >
      <motion.div
        role="list"
        aria-label="Breadcrumb list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {items.map((item, index) => (
          <motion.span
            key={item.href || item.label}
            role="listitem"
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-all duration-300',
              config.itemBg,
              isPremium ? 'hover:shadow-md' : '',
              item.isActive ? '' : 'hover:bg-muted/70 hover:-translate-y-0.5'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate?.(item)}
            style={
              item.isActive
                ? { color: 'var(--color-text-primary)', fontWeight: 500 }
                : {}
            }
          >
            <motion.span
              className={cn('h-4 w-4 flex items-center justify-center', config.iconColor)}
              whileHover={{ rotate: 180, transition: { duration: 0.3 } }}
            >
              {item.icon}
            </motion.span>

            <span
              className={cn(
                'text-sm truncate max-w-[120px]',
                item.isActive ? config.activeText : config.text
              )}
            >
              {item.label}
            </span>

            {!item.isActive && (
              <motion.span
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 + 0.2 }}
              >
                <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
              </motion.span>
            )}

            {item.isActive && showCurrentPage && (
              <Badge
                variant="outline"
                className={cn(
                  'ml-1 h-5 px-2 text-xs border-transparent',
                  isPremium ? 'bg-violet-500/10' : ''
                )}
              >
                Current
              </Badge>
            )}
          </motion.span>
        ))}

        <div className="flex items-center gap-2 px-3 py-1.5">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: items.length * 0.05 + 0.3, type: 'spring' }}
          >
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 px-2 rounded-full',
                isPremium ? 'bg-violet-500/10 hover:bg-violet-500/20' : ''
              )}
            >
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.nav>
  );
}

export default BreadcrumbBar;
