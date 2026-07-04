'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Key, Copy, RefreshCw, Trash2, ShieldAlert, Activity, 
  Clock, Search, ChevronRight, MoreHorizontal, CheckCircle2,
  AlertTriangle, Zap, Server, Globe, Database
} from 'lucide-react';

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: 'active' | 'rotating' | 'suspended' | 'expired';
  lastUsed: Date | null;
  createdAt: Date;
  usage: {
    requests: number;
    bandwidthGB: number;
    successRate: number;
  };
}

interface ApiKeyDashboardProps {
  initialKeys?: ApiKey[];
  onCopy?: (key: string) => void;
  onRefresh?: (id: string) => Promise<void>;
  onDelete?: (id: string, name: string) => Promise<void>;
  onToggleStatus?: (id: string, currentStatus: ApiKey['status']) => Promise<void>;
}

const DEFAULT_KEYS: ApiKey[] = [
  {
    id: 'ak_7f8d9e0a1b2c3d4e',
    name: 'Production - Main Service',
    key: 'pk_live_51MxYz...A8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z',
    status: 'active',
    lastUsed: new Date(Date.now() - 3600000),
    createdAt: new Date(Date.now() - 86400000 * 5),
    usage: { requests: 1247893, bandwidthGB: 45.2, successRate: 99.7 },
  },
  {
    id: 'ak_2b3c4d5e6f7g8h9i',
    name: 'Staging - Development',
    key: 'pk_test_41NwXy...Z9Y8X7W6V5U4T3S2R1Q0P9O8N7M6L5K4J3I2H1G0F9E8D7C6B5A4',
    status: 'rotating',
    lastUsed: new Date(Date.now() - 7200000),
    createdAt: new Date(Date.now() - 86400000 * 12),
    usage: { requests: 345621, bandwidthGB: 12.8, successRate: 98.9 },
  },
  {
    id: 'ak_9j8k7l6m5n4o3p2q',
    name: 'Mobile App - v2.1',
    key: 'pk_live_62OzWv...B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5',
    status: 'active',
    lastUsed: new Date(Date.now() - 1800000),
    createdAt: new Date(Date.now() - 86400000 * 3),
    usage: { requests: 892345, bandwidthGB: 28.5, successRate: 99.4 },
  },
  {
    id: 'ak_1r2s3t4u5v6w7x8y',
    name: 'Legacy - Migration',
    key: 'pk_live_73PqVu...C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6',
    status: 'suspended',
    lastUsed: new Date(Date.now() - 86400000 * 45),
    createdAt: new Date(Date.now() - 86400000 * 120),
    usage: { requests: 56723, bandwidthGB: 2.1, successRate: 94.2 },
  },
];

const STATUS_CONFIG = {
  active: { color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle2, label: 'Active' },
  rotating: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: RefreshCw, label: 'Rotating' },
  suspended: { color: 'text-orange-500', bg: 'bg-orange-500/10', icon: ShieldAlert, label: 'Suspended' },
  expired: { color: 'text-red-500', bg: 'bg-red-500/10', icon: Clock, label: 'Expired' },
};

const USAGE_CONFIG = {
  requests: { label: 'Total Requests', unit: 'reqs', icon: Activity },
  bandwidth: { label: 'Bandwidth Used', unit: 'GB', icon: Globe },
  successRate: { label: 'Success Rate', unit: '%', icon: Zap },
};

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
};

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

const formatDuration = (ms: number | null): string => {
  if (!ms) return '—';
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const truncateKey = (key: string, chars: number = 16): string => {
  if (key.length <= chars * 2) return key;
  return `${key.slice(0, chars)}...${key.slice(-chars)}`;
};

export interface ApiKeyDashboardProps {
  initialKeys?: ApiKey[];
  onCopy?: (key: string) => void;
  onRefresh?: (id: string) => Promise<void>;
  onDelete?: (id: string, name: string) => Promise<void>;
  onToggleStatus?: (id: string, currentStatus: ApiKey['status']) => Promise<void>;
}

const useReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReduced(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        window.matchMedia('(prefers-contrast: more)').matches
      );
    }
  }, []);

  return reduced;
};

const AnimatedCard = ({ 
  children, 
  className = '', 
  delay = 0,
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number; 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

const AnimatedButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  icon,
  disabled = false,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) => {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-muted text-foreground hover:bg-muted/80',
    ghost: 'hover:bg-muted/50 text-foreground',
    danger: 'text-red-400 hover:text-red-300 hover:bg-red-500/10',
  };

  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs rounded-md gap-1.5',
    md: 'px-3 py-2 text-sm rounded-lg gap-2',
    lg: 'px-4 py-2.5 text-base rounded-xl gap-2.5',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
};

const CopyButton = ({ 
  text, 
  onCopy, 
  icon: Icon,
}: { 
  text: string; 
  onCopy?: () => void; 
  icon?: React.ReactNode; 
}) => (
  <AnimatedCard delay={0.1}>
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => { navigator.clipboard.writeText(text); onCopy?.(); }}
      className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-muted/50 hover:bg-muted transition-colors"
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>Copy</span>
    </motion.button>
  </AnimatedCard>
);

const UsageStat = ({ 
  value, 
  label, 
  unit, 
  icon: Icon,
}: { 
  value: number; 
  label: string; 
  unit: string; 
  icon?: React.ReactNode; 
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, delay: 0.2 }}
    className="flex flex-col gap-1"
  >
    <div className="flex items-center justify-between text-xs text-muted">
      <span className="flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </span>
      <span className="font-mono">{formatNumber(value)}{unit}</span>
    </div>
  </motion.div>
);

const StatusBadge = ({ status }: { status: ApiKey['status'] }) => (
  <AnimatedCard delay={0.2}>
    <span 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${STATUS_CONFIG[status].bg} ${STATUS_CONFIG[status].color}`}
    >
      <STATUS_CONFIG[status].icon className="w-3 h-3" />
      {STATUS_CONFIG[status].label}
    </span>
  </AnimatedCard>
);

const ApiKeyRow = ({ 
  keyItem, 
  onCopy, 
  onRefresh, 
  onDelete, 
  onToggleStatus,
}: { 
  keyItem: ApiKey; 
  onCopy?: (key: string) => void; 
  onRefresh?: (id: string) => Promise<void>; 
  onDelete?: (id: string, name: string) => Promise<void>; 
  onToggleStatus?: (id: string, currentStatus: ApiKey['status']) => Promise<void>;
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh || isRefreshing) return;
    setIsRefreshing(true);
    await onRefresh(keyItem.id);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <AnimatedCard delay={keyItem.createdAt.getTime() % 200}>
      <motion.div
        layout
        className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
        whileHover={{ borderColor: 'hsl(var(--primary))' }}
      >
        {/* Status & Name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Key className="w-4 h-4 text-muted" />
            <span className="font-medium truncate">{keyItem.name}</span>
            <StatusBadge status={keyItem.status} />
          </div>
          <p className="text-xs text-muted truncate font-mono max-w-md">
            {truncateKey(keyItem.key)}
          </p>
        </div>

        {/* Usage Stats */}
        <motion.div 
          layout
          className="flex-1 grid gap-2"
        >
          <UsageStat value={keyItem.usage.requests} label="Requests" unit="" icon={Activity} />
          <UsageStat value={keyItem.usage.bandwidthGB} label="Bandwidth" unit="GB" icon={Globe} />
          <UsageStat 
            value={keyItem.usage.successRate} 
            label="Success Rate" 
            unit="%" 
            icon={Zap} 
          />
        </motion.div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <CopyButton text={keyItem.key} onCopy={() => onCopy?.(keyItem.key)} icon={Copy} />
          
          {onRefresh && (
            <AnimatedCard delay={0.3}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isRefreshing || keyItem.status === 'expired'}
                className="p-2 text-muted hover:text-primary transition-colors"
              >
                {isRefreshing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </motion.button>
            </AnimatedCard>
          )}

          {onToggleStatus && keyItem.status !== 'expired' && (
            <AnimatedCard delay={0.3}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onToggleStatus(keyItem.id, keyItem.status)}
                className="p-2 text-muted hover:text-primary transition-colors"
              >
                <ShieldAlert className="w-4 h-4" />
              </motion.button>
            </AnimatedCard>
          )}

          {onDelete && (
            <AnimatedCard delay={0.3}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(keyItem.id, keyItem.name)}
                className="p-2 text-muted hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </AnimatedCard>
          )}

          {/* More options menu */}
          <AnimatedCard delay={0.3}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="p-2 text-muted hover:text-primary transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </motion.button>
          </AnimatedCard>
        </div>

        {/* Last used timestamp */}
        <div className="text-xs text-muted">
          {formatDuration(keyItem.lastUsed?.getTime())}
        </div>
      </motion.div>
    </AnimatedCard>
  );
};

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 px-4 text-center"
  >
    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
      <Key className="w-8 h-8 text-muted" />
    </div>
    <h3 className="text-lg font-medium mb-2">No API keys found</h3>
    <p className="text-sm text-muted max-w-md">
      Create your first API key to get started. Your keys will appear here once generated.
    </p>
  </motion.div>
);

export default function ApiKeyDashboard({ 
  initialKeys = DEFAULT_KEYS,
  onCopy,
  onRefresh,
  onDelete,
  onToggleStatus,
}: ApiKeyDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ApiKey['status']>('all');
  const reducedMotion = useReducedMotion();

  const filteredKeys = useMemo(() => {
    return initialKeys.filter(keyItem => {
      const matchesSearch = 
        keyItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        keyItem.key.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || keyItem.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [initialKeys, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const totalRequests = initialKeys.reduce((sum, k) => sum + k.usage.requests, 0);
    const totalBandwidth = initialKeys.reduce((sum, k) => sum + k.usage.bandwidthGB, 0);
    const activeCount = initialKeys.filter(k => k.status === 'active').length;
    
    return { totalRequests, totalBandwidth, activeCount };
  }, [initialKeys]);

  return (
    <motion.div
      className="space-y-6"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header with stats */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">API Keys</h2>
          <AnimatedCard delay={0.1}>
            <span className="text-sm text-muted">
              {filteredKeys.length} of {initialKeys.length} keys
            </span>
          </AnimatedCard>
        </div>
