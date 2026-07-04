'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Download, 
  Filter, 
  Bell, 
  Search,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Calendar,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  Input,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui';

export interface AnalyticsDashboardProps {
  timeRange?: '7d' | '30d' | '90d' | '1y';
  metricType?: 'revenue' | 'users' | 'engagement' | 'all';
  showExport?: boolean;
}

interface DataPoint {
  name: string;
  revenue: number;
  users: number;
  engagement: number;
}

const generateMockData = (range: AnalyticsDashboardProps['timeRange'] = '7d'): DataPoint[] => {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
  const data: DataPoint[] = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    // Generate semi-realistic mock data with trends
    const baseRevenue = 15000 + Math.random() * 3000;
    const baseUsers = 8500 + Math.random() * 1200;
    const baseEngagement = 72 + (Math.random() - 0.5) * 10;
    
    data.push({
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: Math.round(baseRevenue),
      users: Math.round(baseUsers),
      engagement: parseFloat(baseEngagement.toFixed(2)),
    });
  }
  
  return data;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const formatPercentage = (value: number, positive: boolean = true) => {
  const sign = positive ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

export interface AnalyticsDashboardState {
  selectedRange: AnalyticsDashboardProps['timeRange'];
  selectedMetric: AnalyticsDashboardProps['metricType'];
  searchQuery: string;
  notifications: number;
}

const initialData = generateMockData();

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  delay?: number;
}

export const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend = 'up',
  delay = 0,
}: MetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      <Card className="h-full border-border bg-background/50 backdrop-blur-sm">
        <CardContent className="p-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {formatNumber(Number(value))}
              </span>
              {change !== undefined && (
                <motion.span 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "text-sm font-medium flex items-center gap-1",
                    trend === 'up' ? "text-green-500" : "text-red-500"
                  )}
                >
                  {trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {formatPercentage(Math.abs(change))}
                </motion.span>
              )}
            </div>
          </div>
          <div className={cn(
            "p-3 rounded-xl",
            trend === 'up' ? "bg-green-500/10" : "bg-red-500/10"
          )}>
            {icon}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface ChartSectionProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
}

export const ChartSection = ({ 
  title, 
  children, 
  delay = 0,
}: ChartSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="border-border bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
};

interface ActivityItemProps {
  user: string;
  action: string;
  time: string;
  status: 'success' | 'pending' | 'warning';
  delay?: number;
}

export const ActivityFeed = ({ items, delay = 0 }: { items: ActivityItemProps[], delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="border-border bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              View All
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * (items.length - index) }}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div 
                  className={cn(
                    "w-2 h-2 rounded-full",
                    item.status === 'success' ? "bg-green-500" :
                    item.status === 'warning' ? "bg-yellow-500" : "bg-blue-500"
                  )} 
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.user} • {item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface TimeRangeSelectorProps {
  value: AnalyticsDashboardProps['timeRange'];
  onChange: (value: AnalyticsDashboardProps['timeRange']) => void;
}

export const TimeRangeSelector = ({ 
  value, 
  onChange,
}: TimeRangeSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={value === '7d' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('7d')}
        className="gap-1"
      >
        7 Days
      </Button>
      <Button
        variant={value === '30d' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('30d')}
        className="gap-1"
      >
        30 Days
      </Button>
      <Button
        variant={value === '90d' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('90d')}
        className="gap-1"
      >
        90 Days
      </Button>
      <Button
        variant={value === '1y' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('1y')}
        className="gap-1"
      >
        Year
      </Button>
    </div>
  );
};

interface MetricSelectorProps {
  value: AnalyticsDashboardProps['metricType'];
  onChange: (value: AnalyticsDashboardProps['metricType']) => void;
}

export const MetricSelector = ({ 
  value, 
  onChange,
}: MetricSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={value === 'revenue' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('revenue')}
        className="gap-1"
      >
        <DollarSign className="h-4 w-4" />
        Revenue
      </Button>
      <Button
        variant={value === 'users' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('users')}
        className="gap-1"
      >
        <Users className="h-4 w-4" />
        Users
      </Button>
      <Button
        variant={value === 'engagement' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('engagement')}
        className="gap-1"
      >
        <Activity className="h-4 w-4" />
        Engagement
      </Button>
    </div>
  );
};

interface ExportButtonProps {
  onExport: () => void;
}

export const ExportButton = ({ 
  onExport,
}: ExportButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onExport}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
    >
      <Download className="h-4 w-4" />
      Export Data
    </motion.button>
  );
};

interface NotificationItemProps {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
}

export const NotificationItem = ({ 
  message, 
  type, 
  time,
}: NotificationItemProps) => {
  const colors = {
    info: 'bg-blue-500/10 text-blue-500',
    success: 'bg-green-500/10 text-green-500',
    warning: 'bg-yellow-500/10 text-yellow-500',
    error: 'bg-red-500/10 text-red-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border",
        colors[type],
        "border-transparent"
      )}
    >
      <div className="p-2 rounded-md bg-background/50">
        {type === 'info' && <AlertCircle className="h-4 w-4" />}
        {type === 'success' && <CheckCircle2 className="h-4 w-4" />}
        {type === 'warning' && <Activity className="h-4 w-4" />}
        {type === 'error' && <AlertCircle className="h-4 w-4" />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
        <p className="text-xs opacity-70">{time}</p>
      </div>
    </motion.div>
  );
};

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
}

export const NotificationDrawer = ({ 
  isOpen, 
  onClose,
  notifications,
}: NotificationDrawerProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-[400px] bg-background border-l border-border z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  Close
                </Button>
              </div>

              <div className="space-y-3">
                {notifications.map((item, index) => (
                  <NotificationItem 
                    key={index}
                    message={item.message}
                    type={item.type}
                    time={item.time}
                  />
                ))}
                
                {notifications.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No new notifications
                  </div>
                )}
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-6 gap-2"
                onClick={onClose}
              >
                Mark All as Read
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export interface AnalyticsDashboardContentProps {
  data: DataPoint[];
  notifications: NotificationItem[];
  onExport: () => void;
  onToggleNotifications: () => void;
  isNotificationsOpen: boolean;
}

interface AnalyticsDashboardMainProps extends AnalyticsDashboardProps, AnalyticsDashboardContentProps {}

export const AnalyticsDashboardMain = ({ 
  data = initialData,
  notifications = [],
  onExport,
  onToggleNotifications,
  isNotificationsOpen,
}: AnalyticsDashboardMainProps) => {
  // Calculate summary metrics from the data
  const totalRevenue = Math.round(data.reduce((sum, d) => sum + d.revenue, 0));
  const avgUsers = Math.round(data.reduce((sum, d) => sum + d.users, 0) / data.length);
  const avgEngagement = (data.reduce((sum, d) => sum + d.engagement, 0) / data.length).toFixed(2);

  // Generate activity items for demo
  const activityItems: ActivityItemProps[] = [
    { user: 'Alex M.', action: 'Completed transaction', time: '5 min ago', status: 'success' },
    { user: 'Sarah K.', action: 'Updated profile settings', time: '12 min ago', status: 'info' as any },
    { user: 'Mike R.', action: 'Pending verification', time: '28 min ago', status: 'warning' },
  ];

  // Generate notifications for demo
  const notificationItems: NotificationItem[] = [
    { 
      message: 'Weekly report generated successfully', 
      type: 'success', 
      time: '1 hour ago' 
    },
    { 
      message: 'New user signup wave detected', 
      type: 'info', 
      time: '3 hours ago' 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time insights and performance metrics</p>
        </div>

        <div className="flex items-center gap-4">
          <TimeRangeSelector 
            value={data[0]?.name || '7d'}
            onChange={() => {}}
          />
          
          <MetricSelector 
            value={data[0]?.revenue > 15000 ? 'revenue' : 'users'}
            onChange={() => {}}
          />

          <Button variant="outline" size="sm" onClick={onToggleNotifications}>
            <Bell className="h-4 w-4" />
            <span className="ml-2">{notifications.length}</span>
          </Button>

          <ExportButton onExport={onExport} />
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <MetricCard 
          title="Total Revenue"
          value={totalRevenue}
          change={12.5}
          trend="up"
          icon={<DollarSign className="h-6 w-6 text-white" />}
          delay={0}
        />
        <MetricCard 
          title="Active Users"
          value={avgUsers}
          change={8.3}
          trend="up"
          icon={<Users className="h-6 w-6 text-white" />}
          delay={0.1}
        />
        <MetricCard 
          title="Avg. Engagement"
          value={avgEngagement}
          change={2.1}
          trend="down"
          icon={<Activity className="h-6 w-6 text-white" />}
          delay={0.2}
        />
        <MetricCard 
          title="Conversion Rate"
          value={3.47}
          change={5.8}
