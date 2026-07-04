'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Heart, Star, Clock, ExternalLink, Search, Filter, X, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface FavoriteItem {
  id: string;
  name: string;
  description: string;
  category: string;
  rating?: number;
  views: number;
  lastUpdated: Date;
  image: string;
}

export interface FavoritesProps {
  items: FavoriteItem[];
  isLoading?: boolean;
  onRemove?: (id: string) => void;
  emptyMessage?: string;
}

const categories = ['All', 'Design', 'Development', 'Productivity', 'Research'];

function formatViews(views: number): string {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `Last ${Math.ceil(days / 7)}w`;
  return `Last ${Math.floor(days / 30)}mo`;
}

function getRatingColor(rating: number): string {
  if (!rating) return 'bg-muted';
  const threshold = (rating - 1) * 25;
  const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400'];
  return colors[Math.min(Math.floor(threshold), 3)] || 'bg-muted';
}

function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    Design: 'bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300',
    Development: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    Productivity: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    Research: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
  };
  return map[category] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
}

function createGradient(percentage: number): string {
  const hue = (265 + percentage * 40) % 360; // Violet to purple range
  return `linear-gradient(135deg, hsl(${hue}, 80%, 90%), hsl(${hue + 20}, 70%, 85%))`;
}

function createBorderGradient(percentage: number): string {
  const hue = (265 + percentage * 40) % 360;
  return `linear-gradient(135deg, hsl(${hue}, 60%, 70%), hsl(${hue + 20}, 50%, 65%))`;
}

function createTextGradient(text: string): string {
  const hue = 265;
  return `linear-gradient(135deg, hsl(${hue}, 80%, 40%), hsl(${hue + 30}, 70%, 35%))`;
}

function createGlowEffect(intensity: number): string {
  const size = 20 + intensity * 10;
  return `radial-gradient(circle ${size}px at 50% 50%, hsla(265, 80%, 70%, ${0.3 - intensity * 0.1}), transparent)`;
}

function createFloatingDots(): React.ReactNode {
  const dots = [];
  for (let i = 0; i < 8; i++) {
    const offset = (i % 2 === 0) ? 'translate-x-4' : '-translate-x-4';
    const delay = (i % 3) * 150;
    dots.push(
      <motion.div
        key={i}
        className="absolute w-1.5 h-1.5 rounded-full bg-violet-400/60"
        initial={{ x: 0, y: 0, opacity: 0 }}
        animate={{ 
          x: offset === 'translate-x-4' ? 2 : -2,
          y: (i % 3) * 15,
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{ 
          duration: 3 + i,
          repeat: Infinity,
          delay: delay / 1000,
          ease: 'easeInOut'
        }}
      />
    );
  }
  return dots;
}

export function Favorites({ items = [], isLoading = false, onRemove, emptyMessage }: FavoritesProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const y1 = useTransform(scrollYProgress, [0, 0.2], ['0%', '5%']);
  const y2 = useTransform(scrollYProgress, [0, 0.3], ['0%', '8%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  return (
    <motion.div 
      ref={containerRef}
      className="min-h-screen bg-background relative overflow-hidden"
      style={{ background: createGradient(0) }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {createFloatingDots()}
        
        <motion.div 
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[128px]"
          style={{ background: createGlowEffect(0.5), opacity: 0.15 }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full blur-[128px]"
          style={{ background: createGlowEffect(0.7), opacity: 0.1 }}
          animate={{ scale: [1, 1.05], rotate: [360, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 backdrop-blur-xl border-b border-border/40"
        style={{ backgroundColor: createGradient(1) }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="relative">
                <Heart 
                  size={32} 
                  strokeWidth={2.5}
                  style={{ color: createTextGradient('❤️') }}
                  className="drop-shadow-[0_0_15px_rgba(189,167,254,0.5)]"
                />
                <motion.div 
                  className="absolute -inset-2 rounded-full bg-violet-500/20 blur-xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.6, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
              
              <motion.div 
                className="flex flex-col"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  <span style={{ background: createTextGradient('Favorites'), WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Your Favorites
                  </span>
                </h1>
                <p className="text-sm text-muted-foreground/70 mt-0.5">
                  {items.length} saved items
                </p>
              </motion.div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-2"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="relative group">
                <Search 
                  size={18} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-violet-400 transition-colors"
                />
                <Input 
                  placeholder="Search favorites..."
                  className="pl-10 h-10 rounded-full border-border/60 bg-background/80 backdrop-blur-sm shadow-lg shadow-black/5 focus:ring-2 focus:ring-violet-400/30"
                />
              </div>

              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full hover:bg-muted/60 transition-all"
              >
                <Filter size={18} />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <main className="relative z-40">
        {isLoading ? (
          <motion.div 
            className="flex items-center justify-center min-h-[60vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative">
              <Loader2 
                size={48} 
                className="text-violet-400"
                style={{ animationDuration: '1.5s' }}
              />
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-violet-400/30"
                animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        ) : items.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative mb-8">
              <Heart 
                size={64} 
                strokeWidth={1.5}
                className="text-violet-300/50"
                style={{ filter: 'drop-shadow(0 0 40px rgba(167, 139, 250, 0.3))' }}
              />
              <motion.div 
                className="absolute -inset-12 rounded-full bg-violet-500/10 blur-3xl"
                animate={{ scale: [1, 1.2], opacity: [0.3, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>

            <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground/70 max-w-md mb-6">
              Start saving items you love. They'll appear here and can be organized by category.
            </p>

            <Button 
              size="lg"
              variant="outline"
              className="rounded-full border-violet-300/50 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-all"
            >
              Browse Directory
              <ChevronRight size={18} className="ml-2" />
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Category Filter */}
            <motion.div 
              className="sticky top-[73px] z-40 backdrop-blur-xl border-b border-border/40"
              style={{ backgroundColor: createGradient(2) }}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
                  {categories.map((category, index) => (
                    <motion.button
                      key={category}
                      onClick={() => {}} // Placeholder for filter logic
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05, duration: 0.4 }}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap',
                        category === 'All' 
                          ? cn('bg-violet-600 text-white shadow-lg shadow-violet-500/25')
                          : cn('hover:bg-muted/60 transition-colors', getCategoryColor(category))
                      )}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Grid */}
            <motion.div 
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
              layout
            >
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ 
                      type: 'spring',
                      stiffness: 300,
                      damping: 24,
                      delay: index * 0.05
                    }}
                  >
                    <Card className={cn(
                      'group h-full border-border/60 hover:border-violet-400/50 transition-all duration-300',
                      'hover:shadow-xl hover:shadow-violet-900/10 dark:hover:shadow-violet-700/20'
                    )}>
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex gap-4">
                          {/* Image */}
                          <motion.div 
                            className="relative w-32 h-32 rounded-xl overflow-hidden flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          >
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                              loading="eager"
                            />
                            <div 
                              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                          </motion.div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 flex flex-col">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 
                                className={cn(
                                  'text-lg font-semibold truncate pr-4',
                                  createTextGradient(item.name)
                                )}
                              >
                                {item.name}
                              </h3>
                              
                              <motion.button
                                onClick={() => onRemove?.(item.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-all"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <X size={16} />
                              </motion.button>
                            </div>

                            <p 
                              className="text-sm text-muted-foreground/80 line-clamp-2 mb-3"
                              style={{ color: createTextGradient(item.description) }}
                            >
                              {item.description}
                            </p>

                            {/* Meta */}
                            <div className="flex items-center gap-4 flex-wrap">
                              <Badge 
                                variant={cn(
                                  'secondary',
                                  getCategoryColor(item.category).replace('text-', '') + '-foreground'
                                )}
                                className={cn(
                                  'capitalize text-xs font-medium',
                                  getCategoryColor(item.category)
                                )}
                              >
                                {item.category}
                              </Badge>

                              <div 
                                className="flex items-center gap-1.5"
                                style={{ color: createTextGradient('⭐') }}
                              >
                                <Star size={14} fill="currentColor" />
                                <span className="text-xs text-muted-foreground/70">
                                  {item.rating ? item.rating.toFixed(1) : 'N/A'}
                                </span>
                              </div>

                              <div 
                                className="flex items-center gap-1.5"
                                style={{ color: createTextGradient('👁️') }}
                              >
                                <EyeIcon size={14} />
                                <span className="text-xs text-muted-foreground/70">
                                  {formatViews(item.views)}
                                </span>
                              </div>

                              <div 
                                className="flex items-center gap-1.5"
                                style={{ color: createTextGradient('🕒') }}
                              >
                                <Clock size={14} />
                                <span className="text-xs text-muted-foreground/70">
                                  {formatTimeAgo(item.lastUpdated)}
                                </span>
                              </div>
                            </div>

                            {/* Hover Action */}
                            <motion.div 
                              className="mt-auto pt-4 flex items-center justify-between"
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.2 }}
                            >
                              <Button 
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  'group-hover:text-violet-600 dark:group-hover:text-violet-400',
                                  createTextGradient('View')
                                )}
                              >
                                View Details
                                <ChevronRight size={14} />
                              </Button>

                              <motion.div 
                                className="flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                              >
                                <Badge 
                                  variant="outline"
                                  className={cn(
                                    'h-7 px-3 text-xs font-medium',
                                    getBorderGradient(item.category)
                                  )}
                                >
                                  {getCategoryColor(item.category).replace('text-', '') +
