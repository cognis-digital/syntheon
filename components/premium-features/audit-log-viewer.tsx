'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock3, 
  XCircle, 
  MoreHorizontal,
  Calendar,
  User,
  Database,
  Server,
  FileText,
  Activity,
  Settings,
  LogOut,
  ChevronDown,
  Check,
  CircleDashed,
  Zap,
  ShieldCheck,
  Loader2
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'user' | 'guest';
  };
  action: string;
  resource: {
    type: string;
    id: string;
    name: string;
    path?: string;
  };
  details: Record<string, unknown>;
  status: 'success' | 'warning' | 'error' | 'info';
  ipAddress: string;
  userAgent: string;
}

export interface AuditLogViewerProps {
  logs: AuditLogEntry[];
  defaultFilters?: {
    searchQuery?: string;
    dateRange?: 'all' | 'today' | 'week' | 'month' | 'custom';
    statusFilter?: 'all' | 'success' | 'warning' | 'error' | 'info';
    resourceType?: string[];
  };
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  warning: <AlertCircle className="h-4 w-4 text-yellow-500" />,
  error: <XCircle className="h-4 w-4 text-red-500" />,
  info: <Clock3 className="h-4 w-4 text-blue-500" />,
};

const STATUS_LABELS: Record<string, string> = {
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
  info: 'Info',
};

function generateMockLogs(count: number): AuditLogEntry[] {
  const actions = [
    'User login', 'Password change', 'File upload', 'Settings update',
    'API key rotation', 'Database migration', 'Cache invalidation',
    'Permission modification', 'Role assignment', 'Export operation'
  ];

  const resources = ['Dashboard', 'Profile Settings', 'API Keys', 'User Management', 'Billing'];

  return Array.from({ length: count }, (_, i) => ({
    id: `log-${i + 1}`,
    timestamp: new Date(Date.now() - Math.random() * 86400000 * 30),
    user: {
      id: `user-${Math.floor(Math.random() * 100) + 1}`,
      name: ['Alex Chen', 'Jordan Smith', 'Taylor Kim', 'Casey Morgan', 'Riley Park'][Math.floor(Math.random() * 5)],
      email: `user${Math.floor(Math.random() * 100)}@syntheon.dev`,
      role: Math.random() > 0.7 ? 'admin' : Math.random() > 0.4 ? 'user' : 'guest',
    },
    action: actions[Math.floor(Math.random() * actions.length)],
    resource: {
      type: resources[Math.floor(Math.random() * resources.length)],
      id: `res-${Math.floor(Math.random() * 1000)}`,
      name: `${resources[0]} #${Math.floor(Math.random() * 999)}`,
      path: `/api/v1/${resources[2]}/${Math.floor(Math.random() * 1000)}`,
    },
    details: {
      duration: Math.round(Math.random() * 5000),
      bytesTransferred: Math.round(Math.random() * 1048576),
    },
    status: Math.random() > 0.9 ? 'error' : Math.random() > 0.7 ? 'warning' : 'success',
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    userAgent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36`,
  }));
}

export interface AuditLogViewerState {
  searchQuery: string;
  dateRange: 'all' | 'today' | 'week' | 'month' | 'custom';
  statusFilter: 'all' | 'success' | 'warning' | 'error' | 'info';
  resourceType: string[];
  selectedRows: Set<string>;
  sortField: keyof AuditLogEntry['resource'];
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  isLoading: boolean;
}

function useAuditLogState(
  logs: AuditLogEntry[],
  defaultFilters?: AuditLogViewerProps['defaultFilters']
): AuditLogViewerState {
  const initialState: AuditLogViewerState = useMemo(() => ({
    searchQuery: defaultFilters?.searchQuery || '',
    dateRange: defaultFilters?.dateRange || 'all',
    statusFilter: defaultFilters?.statusFilter || 'all',
    resourceType: defaultFilters?.resourceType || [],
    selectedRows: new Set<string>(),
    sortField: 'timestamp',
    sortOrder: 'desc',
    currentPage: 1,
    isLoading: false,
  }), [defaultFilters]);

  return initialState;
}

function formatTimestamp(timestamp: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  
  if (diffMs < 60000) return 'Just now';
  if (diffMs < 3600000) return `${Math.floor(diffMs / 60000)}m ago`;
  if (diffMs < 86400000) return `${Math.floor(diffMs / 3600000)}h ago`;
  
  return timestamp.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
  return `${(ms / 3600000).toFixed(1)}h`;
}

export function AuditLogViewer({ 
  logs = generateMockLogs(50),
  defaultFilters,
}: AuditLogViewerProps) {
  const [state, setState] = useState<AuditLogViewerState>(useAuditLogState(logs, defaultFilters));
  
  const filteredLogs = useMemo(() => {
    let result = [...logs];

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      result = result.filter(
        log => 
          log.user.name.toLowerCase().includes(query) ||
          log.resource.name.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query)
      );
    }

    if (state.statusFilter !== 'all') {
      result = result.filter(log => log.status === state.statusFilter);
    }

    return result;
  }, [logs, state.searchQuery, state.statusFilter]);

  const sortedLogs = useMemo(() => {
    return [...filteredLogs].sort((a, b) => {
      const aVal = (a as any)[state.sortField];
      const bVal = (b as any)[state.sortField];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return state.sortOrder === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }
      
      return state.sortOrder === 'asc' 
        ? Number(aVal) - Number(bVal) 
        : Number(bVal) - Number(aVal);
    });
  }, [filteredLogs, state.sortField, state.sortOrder]);

  const paginatedLogs = useMemo(() => {
    const pageSize = 10;
    const totalPages = Math.ceil(sortedLogs.length / pageSize);
    const start = (state.currentPage - 1) * pageSize;
    return sortedLogs.slice(start, start + pageSize);
  }, [sortedLogs, state.currentPage]);

  const totalFiltered = useMemo(() => filteredLogs.length, [filteredLogs]);
  
  const totalPages = Math.ceil(totalFiltered / 10);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, searchQuery: e.target.value }));
    if (state.currentPage > 1) {
      setState(prev => ({ ...prev, currentPage: 1 }));
    }
  }, [state.currentPage]);

  const handleDateRangeChange = useCallback((range: AuditLogViewerState['dateRange']) => {
    setState(prev => ({ ...prev, dateRange: range, currentPage: 1 }));
  }, []);

  const handleStatusFilterChange = useCallback((status: AuditLogViewerState['statusFilter']) => {
    setState(prev => ({ ...prev, statusFilter: status, currentPage: 1 }));
  }, []);

  const toggleRowSelection = useCallback((id: string) => {
    setState(prev => {
      const newSelected = new Set(prev.selectedRows);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return { ...prev, selectedRows: newSelected };
    });
  }, []);

  const toggleAllSelection = useCallback((selectAll: boolean) => {
    setState(prev => ({
      ...prev,
      selectedRows: selectAll ? new Set(sortedLogs.map(l => l.id)) : new Set(),
    }));
  }, [sortedLogs]);

  const handleSort = useCallback((field: keyof AuditLogEntry['resource']) => {
    setState(prev => ({
      ...prev,
      sortField: field,
      sortOrder: prev.sortField === field ? (prev.sortOrder === 'asc' ? 'desc' : 'asc') : 'asc',
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  }, []);

  const handleExport = useCallback(() => {
    console.log('Exporting logs...');
    // Implement export logic here
  }, []);

  return (
    <Card className="overflow-hidden border-border bg-background/50 backdrop-blur-sm">
      <CardHeader className="border-b border-border/50 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold tracking-tight text-primary">
              Audit Log Viewer
            </CardTitle>
            <CardDescription className="mt-1 text-sm/relaxed text-muted-foreground">
              Track and analyze system activity with detailed filtering options.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExport}
              disabled={totalFiltered === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Button 
              variant="default" 
              size="sm"
              disabled={state.selectedRows.size === 0}
              className="bg-primary hover:bg-primary/90"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {state.selectedRows.size} Selected
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Filters Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by user, resource, or action..."
                value={state.searchQuery}
                onChange={handleSearchChange}
                className="pl-9 h-10 border-border bg-background/50"
              />
            </div>

            {/* Date Range */}
            <Select 
              value={state.dateRange}
              onValueChange={(value: AuditLogViewerState['dateRange']) => handleDateRangeChange(value)}
            >
              <SelectTrigger className="w-40 h-10 border-border bg-background/50">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select 
              value={state.statusFilter}
              onValueChange={(value: AuditLogViewerState['statusFilter']) => handleStatusFilterChange(value)}
            >
              <SelectTrigger className="w-40 h-10 border-border bg-background/50">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>

            {/* Results Count */}
            <div className="flex items-center gap-2 text-sm/relaxed text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>{totalFiltered.toLocaleString()} results</span>
            </div>
          </div>
        </motion.div>

        {/* Logs Table */}
        <ScrollArea className="max-h-[60vh]">
          <AnimatePresence mode="popLayout">
            {paginatedLogs.length > 0 ? (
              <div className="space-y-2">
                {paginatedLogs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    layout
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => toggleRowSelection(log.id)}
                      layoutId={log.id}
                      className={cn(
                        "relative flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer",
                        state.selectedRows.has(log.id) 
                          ? "bg-primary/10 border-primary" 
                          : "border-border bg-background/50 hover:border-border/70"
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Status Icon */}
                        <motion.div
                          layoutId={`status-${log.id}`}
                          className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center",
                            log.status === 'success' && "bg-green-500/10 text-green-500",
                            log.status === 'warning' && "bg-yellow-500/10 text-yellow-500",
                            log.status === 'error' && "bg-red-500/10 text-red-500",
                            log.status === 'info' && "bg-blue-500/10 text-blue-500"
                          )}
                        >
                          {STATUS_ICONS[log.status]}
                        </motion.div>

                        {/* Timestamp */}
                        <div className="flex flex-col min-w-24">
                          <span className="font-medium text-sm/relaxed text-primary truncate">
                            {formatTimestamp(log.timestamp)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            UTC
                          </span>
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <User className={cn(
                            "h-4 w-4",
                            log.user.role === 'admin' && "text-purple-500",
                            log.user.role === 'user' && "text-gray-500",
                            log.user.role === 'guest' && "text-muted-foreground"
                          )} />
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-sm/relaxed text-primary truncate">
                              {log.user.name}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              {log.user.email}
                            </span>
                          </div>
                        </div>

                        {/* Action */}
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-medium text-sm/relaxed text-primary truncate">
                            {log.action}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {log.resource.name}
                          </span>
                        </div>

                        {/* Resource Type Badge */}
                        <Badge 
                          variant={cn(
                            "outline",
                            log.resource.type === 'Dashboard' && "bg-purple-500/10 text-purple-500 border-purple-500/20"
                          )}
                          className="shrink-0"
                        >
                          {log.resource.type}
                        </Badge>

                        {/* Duration */}
                        <div className="flex items-center gap-4 ml-auto">
                          <span className={cn(
                            "text-xs",
                            log.details.duration > 3000 && "text-orange-500"
                          )}>
                            {formatDuration(log.details.duration || 0)}
                          </span>

                          {/* More Actions */}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>

                      {/* Selection Checkbox */}
                      <motion.div
                        whileTap={{ scale: 0.9 }}
