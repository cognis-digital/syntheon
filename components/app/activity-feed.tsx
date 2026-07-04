'use client';

import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CircleDot, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface ActivityItemProps {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'warning' | 'error';
}

interface ActivityFeedProps {
  items: ActivityItemProps[];
  limit?: number;
  onRefresh: () => void;
  isLoading?: boolean;
  showTimestamps?: boolean;
}

export interface ActivityFeedState {
  isRefreshing: boolean;
  hasMore: boolean;
  error: string | null;
}

const STATUS_CONFIG = {
  success: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
  pending: { icon: CircleDot, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  warning: { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  error: { icon: CircleDot, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
};

const ANIMATION_CONFIG = {
  initial: { opacity: 0, x: -24, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: 24, scale: 0.95, transition: { duration: 0.2 } },
};

export const ActivityFeed = ({ items, limit = 10, onRefresh, isLoading = false, showTimestamps = true }: ActivityFeedProps) => {
  const visibleItems = limit ? items.slice(0, limit) : items;
  const hasMore = limit && items.length > limit;

  return (
    <Card className="w-full max-w-2xl border-border bg-background/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-primary text-lg font-semibold tracking-tight">
              Activity Feed
            </CardTitle>
            {isLoading && (
              <CardDescription className="animate-pulse text-muted-foreground/70">
                Loading recent activity...
              </CardDescription>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading || items.length === 0}
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <>
                <ChevronRight className="h-4 w-4 mr-1.5" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <AnimatePresence initial={false}>
          {visibleItems.map((item, index) => (
            <motion.div
              key={item.id}
              variants={{ ...ANIMATION_CONFIG }}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ delay: index * 0.05, staggerChildren: 0.1 }}
              className="mb-4 last:mb-0 group"
            >
              <motion.div
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  'flex items-start gap-4 p-3 rounded-lg border border-border/60 bg-muted/40 hover:bg-muted/60 transition-colors',
                  item.status === 'success' && 'border-green-500/20',
                  item.status === 'error' && 'border-red-500/20',
                )}
              >
                <div className="flex-shrink-0 mt-1">
                  {STATUS_CONFIG[item.status].icon({
                    className: cn('h-4 w-4', STATUS_CONFIG[item.status].color),
                  })}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm font-medium text-foreground line-clamp-2',
                    item.status === 'success' && 'text-green-600 dark:text-green-400',
                    item.status === 'error' && 'text-red-600 dark:text-red-400',
                  )}>
                    {item.user} <span className="opacity-75">{item.action}</span>
                    {item.target && ` on ${item.target}`}
                  </p>

                  {showTimestamps && (
                    <time
                      dateTime={new Date(item.timestamp).toISOString()}
                      className="text-xs text-muted-foreground/60 mt-1.5 block"
                    >
                      {new Intl.DateTimeFormat('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      }).format(item.timestamp)}
                    </time>
                  )}
                </div>

                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              </motion.div>
            </motion.div>
          ))}

          {visibleItems.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CircleDot className="h-8 w-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            </div>
          )}

          {hasMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: visibleItems.length * 0.05 }}
              className="flex items-center justify-center py-4 text-sm text-muted-foreground/60"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/20 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary/40"></span>
              </span>
              Loading more...
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/40" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
