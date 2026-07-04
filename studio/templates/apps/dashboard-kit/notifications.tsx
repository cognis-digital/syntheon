'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export interface NotificationsPageProps {
  /** Notification data with timestamps and status */
  notifications: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    link?: { label: string; url: string };
  }>;

  /** Filter options for the notification list */
  filters: Array<{
    id: string;
    label: string;
    type: 'all' | 'unread' | 'type';
    value?: string;
  }>;

  /** Callback when a filter is selected */
  onFilterChange: (filterId: string) => void;

  /** Callback when a notification is clicked */
  onClickNotification: (id: string, event: React.MouseEvent<HTMLDivElement>) => void;

  /** Callback for mark-all-as-read action */
  onMarkAllRead: () => void;

  /** Callback for clearing read notifications */
  onClearRead: () => void;
}

const filterOptions = [
  { id: 'all', label: 'Semua' },
  { id: 'unread', label: 'Belum Dibaca' },
  { id: 'error', label: 'Error' },
  { id: 'success', label: 'Sukses' },
];

const typeColors = {
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
};

const typeIcons = {
  info: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v8m-4-4h8" stroke="currentColor" strokeWidth="2"/></svg>,
  success: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M8 12l2.5-2.5L12 9l3.5 2.5L16 12l2.5 2.5L12 17l-3.5-2.5L6 12z" stroke="currentColor" strokeWidth="2"/></svg>,
  warning: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4m-3.5 1h7"/></svg>,
  error: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M8 8l8 8m0-16l-8 8"/></svg>,
};

const getNotificationColor = (type: string) => typeColors[type] || typeColors.info;

function NotificationItem({
  notification,
  onClick,
}: {
  notification: NotificationsPageProps['notifications'][number];
  onClick: (id: string, event: React.MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <motion.div
      layoutId={`notification-${notification.id}`}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={(e) => onClick(notification.id, e)}
      className={cn(
        'group relative p-4 rounded-lg border cursor-pointer transition-all',
        notification.read ? 'bg-background/50 hover:bg-background/70' : 'hover:bg-accent/10',
        getNotificationColor(notification.type),
        'border-opacity-20 dark:border-opacity-30'
      )}
    >
      <div className="flex items-start gap-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.05, type: 'spring', stiffness: 200 }}
          className={cn('p-2 rounded-full mt-0.5 shrink-0', getNotificationColor(notification.type))}
        >
          <div className="w-4 h-4">
            {typeIcons[notification.type]}
          </div>
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className={cn('text-sm font-medium truncate', notification.read ? 'text-muted-foreground' : '')}>
              {notification.title}
            </span>
            <time className={cn('text-xs text-muted-foreground', notification.read && 'opacity-50')}>
              {new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                day: 'numeric',
                month: 'short',
              }).format(notification.timestamp)}
            </time>
          </div>

          <p className={cn('text-sm leading-relaxed line-clamp-2', notification.read ? 'text-muted-foreground' : '')}>
            {notification.message}
          </p>

          {notification.link && (
            <motion.a
              href={notification.link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className={cn(
                'inline-flex items-center gap-1 mt-2 text-xs',
                notification.read ? 'text-muted-foreground hover:text-primary' : ''
              )}
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6m4.5 7.5l-9-9" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {notification.link.label}
            </motion.a>
          )}

          {!notification.read && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.2 }}
              className={cn(
                'absolute top-3 right-3 w-2 h-2 rounded-full',
                getNotificationColor(notification.type).split(' ')[0]
              )}
            />
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: notification.read ? 1 : 0, x: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute top-3 left-3"
        >
          <svg className={cn('w-4 h-4', notification.read ? 'text-primary' : 'opacity-50')} viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19l6-6-6-6z" fill="currentColor"/>
          </svg>
        </motion.div>
      </div>

      <AnimatePresence>
        {notification.link && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-accent/5 rounded-lg"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FilterBar({
  filters,
  activeFilter,
  onFilterChange,
}: {
  filters: NotificationsPageProps['filters'];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' }}
      className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-4"
    >
      <ScrollArea orientation="horizontal">
        <div className="flex items-center gap-2 pr-4">
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              layoutId={`filter-${filter.id}`}
              onClick={() => onFilterChange(filter.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                activeFilter === filter.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'bg-background text-muted-foreground hover:bg-accent/50 border border-border/50'
              )}
            >
              {filter.label}
            </motion.button>
          ))}

          <Separator orientation="vertical" className="h-6 mx-2" />

          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline"}
                size="sm",
                onClick={() => onFilterChange('all')}
              >
                {activeFilter === 'all' ? 'Reset Filter' : 'All'}
              </Button>

          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            className="flex items-center gap-2 ml-auto"
          >
            <Input
              placeholder="Search notifications..."
              className="w-48 h-9 rounded-full border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />

            <Button variant="ghost" size="icon">
              <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" stroke="currentColor"/>
                <path d="M16 8l4 4m0-4l-4 4" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </Button>
          </motion.div>
        </div>
      </ScrollArea>
    </motion.div>
  );
}

function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: number | string;
  icon?: any;
  trend?: { value: number; positive: boolean };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + (['all', 'unread', 'error', 'success'].indexOf(label) * 0.05), duration: 0.3 }}
    >
      <Card className="h-24 hover:border-border/50 transition-colors">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className={cn('text-sm text-muted-foreground', trend && 'mb-1')}>
              {label}
            </p>
            <p className={cn('text-xl font-semibold tracking-tight', value > 0 ? 'text-foreground' : '')}>
              {value}
            </p>
          </div>

          {Icon && (
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="p-2 rounded-full bg-background/50"
            >
              <Icon className={cn('w-6 h-6 text-muted-foreground')} />
            </motion.div>
          )}

          {trend && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
              className={cn(
                'text-xs font-medium px-2 py-1 rounded-full',
                trend.positive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              )}
            >
              {trend.positive ? '+' : ''}{trend.value}%
            </motion.span>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EmptyState({ type }: { type: 'no-notifications' | 'filtered-empty' }) {
  const messages = {
    noNotifications: [
      { icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" stroke="currentColor"/><path d="M8 8l8 8m0-16l-8 8" stroke="currentColor" strokeWidth="2"/></svg>,
        message: 'No notifications yet',
      },
      { icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none"><path d="M9.172 16.172a4 4 0 015.656 0M8 8l8 8m-8-8l8-8" stroke="currentColor" strokeWidth="2"/></svg>,
        message: 'Start receiving notifications',
      },
    ],
    filteredEmpty: [
      { icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" stroke="currentColor"/><path d="M8 12h8m-6 4l3 3m0-6l-3 3" stroke="currentColor" strokeWidth="2"/></svg>,
        message: 'No notifications found',
      },
    ],
  };

  const selected = messages[type];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.35, type: 'spring', stiffness: 200, damping: 15 }}
        className="p-4 rounded-full bg-background/50 mb-6"
      >
        <div className={cn('w-12 h-12 text-muted-foreground')}>
          {selected.icon({ className: 'w-full h-full' })}
        </div>
      </motion.div>

      <p className="text-lg font-medium text-foreground max-w-md">
        {selected.message}
      </p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="text-sm text-muted-foreground mt-2 max-w-md"
      >
        {type === 'no-notifications' ? (
          <>
            Connect your services to start receiving updates about system events, user activity, and more.
          </>
        ) : (
          <>
            Try adjusting your filters or search criteria to find what you're looking for.
          </>
        )}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.3 }}
        className="flex gap-2 mt-6"
      >
        <Button variant="outline">
          {type === 'no-notifications' ? 'Connect Services' : 'Clear Filters'}
        </Button>

        <Button>
          {type === 'no-notifications' ? 'Get Started' : 'View All'}
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default function NotificationsPage({
  notifications,
  filters,
  onFilterChange,
  onClickNotification,
  onMarkAllRead,
  onClearRead,
}: NotificationsPageProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter notifications based on active filter and search query
  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    if (activeFilter !== 'all') {
      switch (activeFilter) {
        case 'unread':
          result = result.filter((n) => !n.read);
          break;
        case 'error':
          result = result.filter((n) => n.type === 'error');
