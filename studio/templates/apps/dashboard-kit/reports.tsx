'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

interface ReportRowProps {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'archived';
  lastRun: string;
  nextRun: string;
  progress: number;
  owner?: string;
}

const STATUS_CONFIG = {
  active: { label: 'Active', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  paused: { label: 'Paused', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  archived: { label: 'Archived', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
};

export interface ReportsPageProps {
  reports?: ReportRow[];
  loading?: boolean;
}

const DEFAULT_REPORTS: ReportRow[] = [
  { id: 'r-1', name: 'Monthly Revenue Analysis', status: 'active', lastRun: '2024-01-01 08:00', nextRun: '2024-02-01 08:00', progress: 95, owner: 'Analytics Team' },
  { id: 'r-2', name: 'Customer Retention Q1', status: 'paused', lastRun: '2023-12-15 14:30', nextRun: '2024-03-15 14:30', progress: 60, owner: 'Growth Team' },
  { id: 'r-3', name: 'Product Performance', status: 'active', lastRun: '2024-01-02 06:00', nextRun: '2024-01-09 06:00', progress: 85, owner: 'Product Team' },
  { id: 'r-4', name: 'Marketing Attribution', status: 'archived', lastRun: '2023-11-30 23:59', nextRun: '-', progress: 100, owner: 'Marketing' },
];

export interface ReportsPageProps {
  reports?: ReportRow[];
  loading?: boolean;
}

const DEFAULT_REPORTS: ReportRow[] = [
  { id: 'r-1', name: 'Monthly Revenue Analysis', status: 'active', lastRun: '2024-01-01 08:00', nextRun: '2024-02-01 08:00', progress: 95, owner: 'Analytics Team' },
  { id: 'r-2', name: 'Customer Retention Q1', status: 'paused', lastRun: '2023-12-15 14:30', nextRun: '2024-03-15 14:30', progress: 60, owner: 'Growth Team' },
  { id: 'r-3', name: 'Product Performance', status: 'active', lastRun: '2024-01-02 06:00', nextRun: '2024-01-09 06:00', progress: 85, owner: 'Product Team' },
  { id: 'r-4', name: 'Marketing Attribution', status: 'archived', lastRun: '2023-11-30 23:59', nextRun: '-', progress: 100, owner: 'Marketing' },
];

const ReportRow = ({ id, name, status, lastRun, nextRun, progress, owner }: ReportRowProps) => {
  const config = STATUS_CONFIG[status];
  
  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 rounded-full border border-border/50 bg-background">
            <AvatarImage src={`https://placehold.co/100x100/${status === 'active' ? '6d28d9' : status === 'paused' ? 'ca8a04' : '64748b'}/ffffff?text=${name.charAt(0)}`} alt={name} />
            <AvatarFallback className="rounded-full bg-background/50 text-foreground/50">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{owner || 'Unassigned'}</p>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge variant={status === 'active' ? 'default' : status === 'paused' ? 'secondary' : 'outline'} 
              className={cn('h-7 px-3 text-xs border', config.color)}>
          {config.label}
        </Badge>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{lastRun}</span>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-muted-foreground">{nextRun || '—'}</span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <Progress value={progress} className="h-1.5 bg-background border-border" />
          <span className="text-xs text-muted-foreground w-8">{Math.round(progress)}%</span>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <Button variant="ghost" size="sm" className="h-9 px-3 rounded-md hover:bg-background/50 transition-colors">
          <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </td>
    </motion.tr>
  );
};

const ReportsPage = ({ reports = DEFAULT_REPORTS, loading = false }: ReportsPageProps) => {
  const [activeTab, setActiveTab] = useState<'all' | 'active'>('all');
  
  const filteredReports = activeTab === 'active' 
    ? reports.filter(r => r.status === 'active') 
    : reports;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div className="px-8 py-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
                Reports Overview
              </h1>
              <p className="text-muted-foreground max-w-xl">
                Track the status and progress of all scheduled reports. Filter by active or archived states to focus on what matters most.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-10 rounded-md border-border/50 hover:bg-background/50 transition-colors">
                <svg className="w-4 h-4 mr-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
                Export
              </Button>
              
              <Button className="h-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Report
              </Button>
            </div>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mt-6 flex items-center gap-4"
          >
            <div className="flex items-center gap-2">
              <Select value={activeTab} onValueChange={(v) => setActiveTab(v as any)} defaultValue="all">
                <SelectTrigger className="h-10 w-[180px] rounded-md border-border/50 bg-background hover:bg-background/50 transition-colors">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                </SelectContent>
              </Select>

              <Input 
                placeholder="Search reports..." 
                className="h-10 rounded-md border-border/50 bg-background hover:bg-background/50 transition-colors"
              />
            </div>

            <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
              <span>{filteredReports.length} reports</span>
              <Separator orientation="vertical" className="h-4 bg-border/30" />
              <span>Last updated: Just now</span>
            </div>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="px-8 pb-6"
        >
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Active Reports', value: reports.filter(r => r.status === 'active').length, color: 'text-green-500' },
              { label: 'Paused Reports', value: reports.filter(r => r.status === 'paused').length, color: 'text-yellow-500' },
              { label: 'Archived Reports', value: reports.filter(r => r.status === 'archived').length, color: 'text-slate-500' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.3 }}
              >
                <Card className="h-24 border-border/50 bg-background hover:border-primary/20 transition-colors cursor-default">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className={`text-3xl font-semibold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <svg 
                      className={`w-8 h-8 opacity-20 ${stat.color}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19l-7-7 7-7m5 14l7-7-7-7" />
                    </svg>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reports Table */}
        <ScrollArea className="px-8 pb-8">
          <div className="rounded-lg border-border/50 bg-background overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-muted/30 border-b border-border/30 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Report</th>
                  <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                  <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Last Run</th>
                  <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Next Run</th>
                  <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Progress</th>
                  <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 flex items-center justify-center gap-2 text-muted-foreground">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </motion.div>
                      <span>Loading reports...</span>
                    </td>
                  </tr>
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                        <p>No reports found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <ReportRow key={report.id} {...report} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </ScrollArea>

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="px-8 pb-8"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Showing 1-{filteredReports.length} of {filteredReports.length} reports</p>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled className="h-9 rounded-md border-border/50 bg-background hover:bg-background/50 transition-colors">
                Previous
              </Button>
              
              <div className="hidden sm:flex items-center gap-1">
                {[1, 2].map((page) => (
                  <Button 
                    key={page} 
                    variant={page === 1 ? 'default' : 'outline'} 
                    size="sm" 
                    className="h-9 rounded-md border-border/50 bg-background hover:bg-background/50 transition-colors"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button variant="outline" size="sm" disabled className="h-9 rounded-md border-border/50 bg-background hover:bg-background/50 transition-colors">
                Next
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="px-8 py-6 border-t border-border/30 bg-muted/20"
      >
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>© 2024 Syntheon. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
            <a href="#" className="hover:text-foreground transition-colors">API Reference</a>
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default ReportsPage;
