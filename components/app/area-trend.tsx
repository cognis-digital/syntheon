'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, Calendar, Download, RefreshCw, Settings2, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface AreaTrendProps {
  data: Array<{
    date: string;
    value: number;
    label?: string;
  }>;
  title: string;
  subtitle?: string;
  timeRange: '7d' | '30d' | '90d';
  showControls?: boolean;
  onDownload?: () => void;
  onRefresh?: () => void;
  className?: string;
}

export interface AreaTrendState {
  hoveredPoint: number | null;
  isRefreshing: boolean;
  isDownloading: boolean;
}

const TIME_RANGES = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
];

const ANIMATION_VARIANTS = {
  container: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  },
  header: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { delay: 0.1, duration: 0.3 } },
  },
  chart: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { delay: 0.2, duration: 0.4 } },
  },
};

const getPrimaryColor = (isDark: boolean) => isDark ? '#8b5cf6' : '#7c3aed';

export default function AreaTrend({ 
  data, 
  title, 
  subtitle, 
  timeRange = '30d', 
  showControls = true,
  onDownload,
  onRefresh,
  className,
}: AreaTrendProps) {
  const [state, setState] = React.useState<AreaTrendState>({
    hoveredPoint: null,
    isRefreshing: false,
    isDownloading: false,
  });

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef.current });
  
  const y1 = useTransform(scrollYProgress, [0, 1], ['2.5rem', '3rem']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['3rem', '2.5rem']);

  const handleRefresh = () => {
    setState(prev => ({ ...prev, isRefreshing: true }));
    onRefresh?.();
    setTimeout(() => setState(prev => ({ ...prev, isRefreshing: false })), 800);
  };

  const handleDownload = () => {
    setState(prev => ({ ...prev, isDownloading: true }));
    onDownload?.();
    setTimeout(() => setState(prev => ({ ...prev, isDownloading: false })), 600);
  };

  const getTooltipContent = (entry: any) => {
    if (!data[entry.payload]) return null;
    const point = data[entry.payload];
    return (
      <div className="bg-background border border-border rounded-lg shadow-xl p-3 min-w-[140px]">
        <p className="text-muted-foreground text-sm mb-2">{point.date}</p>
        <p className="font-semibold text-primary text-lg">
          {formatNumber(point.value)}
        </p>
      </div>
    );
  };

  const formatNumber = (num: number) => 
    new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(num);

  return (
    <motion.div
      ref={scrollRef}
      className={cn('relative overflow-hidden bg-card rounded-xl border border-border shadow-sm', className)}
      style={{ height: '100%' }}
    >
      {/* Animated Header */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            variants={ANIMATION_VARIANTS.header}
            initial="initial"
            animate="animate"
            className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30 backdrop-blur-sm"
          >
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
              {subtitle && (
                <CardDescription className="text-muted-foreground">
                  {subtitle}
                </CardDescription>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Time Range Selector */}
              <div className="relative group">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 px-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {TIME_RANGES.find(r => r.value === timeRange)?.label}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </div>

              {/* Action Buttons */}
              <AnimatePresence>
                {(onRefresh || onDownload) && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center gap-1"
                  >
                    {onRefresh && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleRefresh}
                        disabled={state.isRefreshing}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {state.isRefreshing ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </motion.div>
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                    )}

                    {onDownload && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleDownload}
                        disabled={state.isDownloading}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {state.isDownloading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                          >
                            <Download className="h-4 w-4" />
                          </motion.div>
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                    )}

                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleRefresh}
                      disabled={state.isRefreshing}
                      className="h-8 px-3 text-muted-foreground hover:text-foreground transition-colors ml-1"
                    >
                      {state.isRefreshing ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <TrendingUp className="h-4 w-4" />
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chart Content */}
      <motion.div
        variants={ANIMATION_VARIANTS.chart}
        initial="initial"
        animate="animate"
        className="p-6 flex-1 min-h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={data}
            margin={{ top: 10, right: 15, left: 15, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getPrimaryColor(false)} stopOpacity={0.4} />
                <stop offset="95%" stopColor={getPrimaryColor(false)} stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e2e8f0" 
              className="opacity-50 dark:opacity-30"
            />

            <XAxis 
              dataKey="date"
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              axisLine={false}
              minTickGap={40}
            />

            <YAxis 
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }
