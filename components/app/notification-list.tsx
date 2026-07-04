'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, X, ChevronDown, MoreHorizontal, Inbox } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  link?: string;
}

interface NotificationListProps {
  notifications: NotificationItem[];
  onDismissAll?: () => void;
  onMarkAsRead?: (id: string) => void;
  onOpenLink?: (link: string, e: React.MouseEvent) => void;
}

const typeColors: Record<NotificationItem['type'], { bg: string; text: string; icon: 'info' | 'success' | 'warning' | 'error' }> = {
  info:   { bg: 'bg-background',    text: 'text-foreground',   icon: 'info' },
  success: { bg: 'bg-green-500/10',  text: 'text-green-600',      icon: 'success' },
  warning: { bg: 'bg-yellow-500/10', text: 'text-yellow-600',     icon: 'warning' },
  error:   { bg: 'bg-red-500/10',    text: 'text-red-600',         icon: 'error' },
};

const getIcon = (type: NotificationItem['type']) => {
  const colors = typeColors[type];
  return <Bell className={cn('w-4 h-4', colors.text)} />;
};

export function NotificationList({ 
  notifications, 
  onDismissAll, 
  onMarkAsRead,
  onOpenLink 
}: NotificationListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleExpand = useCallback((id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  const handleDismissAll = useCallback(() => {
    onDismissAll?.();
    setExpandedId(null);
  }, [onDismissAll]);

  return (
    <Card className={cn('border-border bg-background/50 backdrop-blur-sm', 'shadow-sm')}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-primary flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </CardTitle>
            {unreadCount > 0 && (
              <Badge 
                variant="secondary" 
                className={cn('ml-3', 'bg-primary/10 text-primary')}
              >
                {unreadCount} unread
              </Badge>
            )}
          </div>
          
          <AnimatePresence>
            {(unreadCount > 0 || notifications.length > 0) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleDismissAll}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'rounded-full p-2 hover:bg-muted/50 transition-colors duration-150'
                )}
                aria-label="Mark all as read"
              >
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 text-center"
          >
            <Inbox className="w-8 h-8 mx-auto mb-3 text-muted/50" />
            <p className="text-sm text-muted">No notifications yet</p>
          </motion.div>
        ) : (
          <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {notifications.map((notification, index) => {
              const colors = typeColors[notification.type];
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.3,
                    ease: 'easeOut'
                  }}
                  className={cn(
                    'rounded-lg p-4 cursor-pointer transition-all duration-200',
                    notification.read ? 'bg-background/30' : 'bg-muted/30 hover:bg-muted/50',
                    colors.bg,
                    'border border-border/50'
                  )}
                  onClick={() => handleExpand(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 + 0.1, type: 'spring' }}
                      className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', colors.bg)}
                    >
                      {getIcon(notification.type)}
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <p 
                          className={cn(
                            'text-sm leading-relaxed',
                            notification.read ? 'text-muted' : 'text-foreground'
                          )}
                    >
                      {notification.title}
                    </p>

                    {notification.description && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: expandedId === notification.id ? 1 : 0 }}
                        className={cn(
                          'text-xs mt-1 pl-1',
                          notification.read ? 'text-muted' : 'text-foreground/70'
                        )}
                      >
                        {notification.description}
                      </motion.p>
                    )}

                    <div className="flex items-center gap-2 ml-auto">
                      <span 
                        className={cn(
                          'text-xs',
                          notification.read ? 'text-muted/50' : 'text-primary/60'
                        )}
                      >
                        {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      {!notification.read && (
                        <motion.div
                          layoutId={`dot-${notification.id}`}
                          className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
                        />
                      )}
                    </div>
                  </div>

                  {expandedId === notification.id && notification.link && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 pt-3 border-t border-border/50"
                    >
                      <a 
                        href={notification.link}
                        onClick={(e) => onOpenLink?.(notification.link, e)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          buttonVariants({ variant: 'ghost', size: 'sm' }),
                          'text-primary hover:bg-primary/10 rounded-full px-3 py-1.5'
                        )}
                      >
                        <Inbox className="w-3 h-3 mr-2" />
                        Open link
                      </a>
                    </motion.div>
                  )}

                  {expandedId === notification.id && (
                    <div className="flex items-center justify-end gap-1 mt-2">
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={(e) => { e.stopPropagation(); onMarkAsRead?.(notification.id); handleExpand(notification.id); }}
                        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'rounded-full p-2 hover:bg-muted/50')}
                        aria-label="Mark as read"
                      >
                        <CheckCircle2 className="w-3 h-3 text-primary" />
                      </motion.button>

                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={(e) => { e.stopPropagation(); handleExpand(notification.id); }}
                        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'rounded-full p-2 hover:bg-muted/50')}
                        aria-label="Collapse"
                      >
                        <ChevronDown className="w-3 h-3 text-muted" />
                      </motion.button>

                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={(e) => { e.stopPropagation(); handleExpand(notification.id); }}
                        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'rounded-full p-2 hover:bg-muted/50')}
                        aria-label="Dismiss"
                      >
                        <X className="w-3 h-3 text-muted" />
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              );
            })}

            {unreadCount === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-4 text-center text-sm text-muted"
              >
                All caught up!
              </motion.div>
            )}
          </div>
        )}

        <AnimatePresence>
          {expandedId && (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={() => setExpandedId(null)}
              className="mx-auto mt-3"
            >
              <span className="text-xs text-muted hover:text-primary transition-colors">
                Collapse all
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

export type { NotificationItem, NotificationListProps };
