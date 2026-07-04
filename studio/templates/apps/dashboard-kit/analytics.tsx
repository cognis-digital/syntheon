'use client'

import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter,
  type CardProps as BaseCardProps
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  Search, 
  Bell, 
  Download, 
  Filter,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

export interface AnalyticsProps extends BaseCardProps {
  variant?: 'default' | 'premium' | 'minimal'
  showExport?: boolean
  showFilters?: boolean
  compact?: boolean
}

const defaultVariants = {
  default: {
    borderRadius: 'lg',
    shadow: true,
    border: true,
  },
  premium: {
    borderRadius: 'xl',
    shadow: true,
    border: false,
    gradient: true,
  },
  minimal: {
    borderRadius: 'md',
    shadow: false,
    border: true,
  },
}

const chartVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  },
}

const staggerChildren = {
  hidden: { opacity: 0, y: 8 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { delay: (i) => i * 0.05 + 0.2 }
  },
}

export interface AnalyticsData {
  revenue: number[]
  users: number[]
  sessions: number[]
  dateRange: string[]
}

const defaultData: AnalyticsData = {
  revenue: [12, 45, 30, 80, 65, 90, 75, 110, 95, 130, 105, 150],
  users: [8, 15, 12, 25, 20, 30, 28, 35, 32, 40, 38, 45],
  sessions: [6, 12, 9, 18, 15, 22, 20, 26, 24, 30, 28, 34],
  dateRange: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
}

export interface AnalyticsState {
  loading: boolean
  selectedTab: 'overview' | 'revenue' | 'users' | 'sessions'
  timeRange: '7d' | '30d' | '90d' | '1y'
  filterValue: string
}

const defaultState: AnalyticsState = {
  loading: false,
  selectedTab: 'overview',
  timeRange: '30d',
  filterValue: '',
}

export interface AnalyticsStats {
  totalRevenue: number
  growthRate: number
  activeUsers: number
  avgSessionDuration: string
  conversionRate: number
}

const defaultStats: AnalyticsStats = {
  totalRevenue: 124500,
  growthRate: 18.5,
  activeUsers: 8742,
  avgSessionDuration: '4m 32s',
  conversionRate: 3.2,
}

export interface AnalyticsFilters {
  category?: string[]
  status?: string[]
  sortBy?: keyof AnalyticsData | null
  sortDirection?: 'asc' | 'desc'
}

const defaultFilters: AnalyticsFilters = {
  category: [],
  status: [],
  sortBy: null,
  sortDirection: 'desc',
}

export interface AnalyticsEventHandlers {
  onTabChange?: (tab: AnalyticsState['selectedTab']) => void
  onTimeRangeChange?: (range: AnalyticsState['timeRange']) => void
  onFilterChange?: (filters: AnalyticsFilters) => void
  onExport?: () => void
}

const defaultHandlers: AnalyticsEventHandlers = {
  onTabChange: undefined,
  onTimeRangeChange: undefined,
  onFilterChange: undefined,
  onExport: undefined,
}

export interface AnalyticsCardProps extends AnalyticsProps, AnalyticsState, AnalyticsFilters, AnalyticsEventHandlers {}

export function Analytics({ 
  variant = 'default', 
  showExport = true, 
  showFilters = false,
  compact = false,
  ...props 
}: AnalyticsCardProps) {
  const { scrollYProgress } = useScroll()
  const ref = useInView(null, { once: true })

  const variants = defaultVariants[variant]

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate="visible"
      variants={chartVariants}
      className={cn(
        'relative overflow-hidden rounded-[var(--radius)]',
        variant === 'premium' && 'bg-gradient-to-br from-background via-muted/50 to-muted/30',
        compact ? 'p-4' : 'p-6'
      )}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-[var(--gradient-opacity)]"
        initial={{ scale: 1.2, rotate: -5 }}
        animate={{ 
          scale: [1.2, 1.3, 1.2], 
          rotate: [-5, 5, -5] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: 'conic-gradient(from 180deg at 50% 50%, var(--primary) 0%, var(--primary-foreground/0.3) 40%, var(--background) 70%)',
        }}
      />

      {/* Content container */}
      <div className="relative z-10">
        <CardHeader className={cn('pb-4 border-b', compact ? 'border-border' : 'border-border/50')}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardTitle className="text-lg md:text-xl">
                  Analytics Overview
                </CardTitle>
              </motion.div>
            </div>

            {/* Time range selector */}
            {!compact && (
              <Tabs defaultValue="30d" size={compact ? 'sm' : 'md'}>
                <TabsList className={cn(
                  "h-9 md:h-10",
                  variant === 'premium' ? "bg-muted/50 backdrop-blur" : ""
                )}>
                  {['7d', '30d', '90d', '1y'].map((range) => (
                    <TabsTrigger 
                      key={range}
                      value={range as AnalyticsState['timeRange']}
                      className="text-xs md:text-sm data-[state=active]:bg-background"
                    >
                      {range.toUpperCase()}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}

            {/* Actions */}
            <div className={cn(
              "flex items-center gap-2",
              compact ? "justify-end" : ""
            )}>
              {showFilters && (
                <Button 
                  variant="ghost" 
                  size={compact ? 'sm' : 'icon'}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Toggle filters"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              )}

              {showExport && (
                <Button 
                  variant={compact ? "ghost" : "outline"}
                  size={compact ? 'sm' : 'icon'}
                  className="text-muted-foreground hover:text-foreground"
                  onClick={props.onExport}
                  aria-label="Export data"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}

              {showFilters && (
                <Button 
                  variant={compact ? "ghost" : "outline"}
                  size={compact ? 'sm' : 'icon'}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Toggle view settings"
                >
                  <SettingsIcon />
                </Button>
              )}

              {showFilters && (
                <Button 
                  variant={compact ? "ghost" : "outline"}
                  size={compact ? 'sm' : 'icon'}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Toggle fullscreen view"
                >
                  <MaximizeIcon />
                </Button>
              )}
            </div>
          </div>

          {/* Search and filters */}
          {!compact && showFilters && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 mt-4"
            >
              <div className={cn(
                "relative flex-1 max-w-[250px]",
                variant === 'premium' ? "rounded-xl bg-muted/50 backdrop-blur-sm border border-border/50" : ""
              )}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search metrics, events..."
                  className={cn(
                    "pl-9",
                    variant === 'premium' ? "h-10 bg-transparent border-none shadow-sm" : ""
                  )}
                />
              </div>

              {props.filterValue && (
                <Badge 
                  variant="secondary"
                  className={cn(
                    "gap-1",
                    variant === 'premium' ? "bg-background text-muted-foreground border-border/50" : ""
                  )}
                >
                  <Filter className="h-3 w-3" />
                  {props.filterValue.length} results
                  <button 
                    onClick={() => props.onFilterChange?.({ filterValue: '' })}
                    className="ml-1 hover:text-destructive"
                    aria-label="Clear filters"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </motion.div>
          )}
        </CardHeader>

        {/* Main content area */}
        <CardContent className={cn(
          "pt-4",
          compact ? "pb-2" : "pb-6"
        )}>
          {/* Stats row - animated entrance */}
          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
          >
            {['totalRevenue', 'growthRate', 'activeUsers', 'avgSessionDuration'].map((stat, i) => (
              <motion.div 
                key={stat}
                variants={staggerChildren}
                initial="hidden"
                animate="visible"
                className={cn(
                  "flex flex-col gap-1",
                  compact ? "" : "p-3 rounded-lg bg-muted/30 border border-border/50"
                )}
              >
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {stat.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className={cn(
                  "font-semibold",
                  compact ? "" : "text-lg"
                )}>
                  {(stat === 'totalRevenue' || stat === 'activeUsers') && '$'}
                  {defaultStats[stat as keyof AnalyticsStats]}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts container */}
          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {/* Main chart - scroll reveal effect */}
            <ScrollRevealChart
              data={{
                revenue: defaultData.revenue,
                users: defaultData.users,
                sessions: defaultData.sessions,
                dateRange: defaultData.dateRange,
              }}
              title="Performance Trends"
              subtitle="Monthly overview across all selected metrics"
              compact={compact}
              variant={variant}
            />

            {/* Secondary metrics */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              {/* Conversion funnel */}
              <motion.div 
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className={cn(
                  "flex flex-col gap-3",
                  compact ? "" : "p-4 rounded-lg bg-muted/30 border border-border/50"
                )}
              >
                <div className="text-sm text-muted-foreground">Conversion Funnel</div>
                <FunnelChart variant={variant} />
              </motion.div>

              {/* User acquisition */}
              <motion.div 
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className={cn(
                  "flex flex-col gap-3",
                  compact ? "" : "p-4 rounded-lg bg-muted/30 border border-border/50"
                )}
              >
                <div className="text-sm text-muted-foreground">Acquisition Sources</div>
                <SourcesChart variant={variant} />
              </motion.div>
            </motion.div>

            {/* Quick actions */}
            {!compact && (
              <motion.div 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-between pt-4 border-t border-border/50"
              >
                <div className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>

                <div className={cn(
                  "flex gap-2",
                  variant === 'premium' ? "" : "items-center"
                )}>
                  {variant !== 'minimal' && (
                    <>
                      <Button 
                        variant="outline" 
                        size={compact ? 'sm' : 'icon'}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Activity className="h-4 w-4" />
                      </Button>

                      <Button 
                        variant="outline" 
                        size={compact ? 'sm' : 'icon'}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Clock className="h-4 w-4" />
                      </Button>

                      {showExport && (
                        <Button 
                          variant="outline" 
                          size={compact ? 'sm' : 'icon'}
                          className="text-muted-foreground hover:text-foreground"
                          onClick={props.onExport}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}

                      {showFilters && (
                        <Button 
                          variant="outline" 
                          size={compact ? 'sm' : 'icon'}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <SettingsIcon />
                        </Button>
                      )}
                    </>
                  )}

                  {variant !== 'minimal' && (
                    <Button 
                      variant={compact ? "ghost" : "default"}
                      size={compact ? 'sm' : 'lg'}
                      className="gap-2"
                    >
                      View Full Report
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Loading skeleton */}
          {props.loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
            >
              <div className={cn(
                "flex items-center gap-3",
                variant === 'premium' ? "" : "animate-pulse"
              )}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Activity className="h-5 w-5 text-primary" />
                </motion.div>

                <div className={cn(
                  "text-sm",
                  variant === 'premium' ? "" : "text-muted-foreground animate-pulse"
                )}>
                  Loading real-time data...
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>

        {/* Footer */}
        {!compact && (
          <CardFooter className={cn(
            "pt-4 border-t",
            variant === 'premium' ? "border-border/50" : "border-border"
          )}>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Real-time</span>
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
              </motion.div>
              <span>• Last sync: {new Date().toLocaleTimeString()}</span>
            </div>
          </CardFooter>
        )}

        {/* Decorative elements */}
        {!compact && variant !== 'minimal' && (
          <>
            <motion.div 
              className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
            />

            <motion.div 
              className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/3 rounded-full blur-3xl"
              animate={{ scale: [1.2, 1, 1.2] }}
              transition={{ duration: 10, repeat: Infinity }}
            />

            <motion.div 
              className="absolute top-1/2 -left-8 w-24 h-24 bg-primary/7 rounded-full blur-3xl"
              animate={{ x: [-20, 20, -20] }}
              transition={{ duration: 6, repeat: Infinity }}
            />

            <motion.div 
              className="absolute top-1/2 -right-8 w-24 h-24 bg-primary/5 rounded-full blur-3xl"
              animate={{ x: [20, -20, 20] }}
              transition={{ duration: 7, repeat: Infinity }}
            />
          </>
        )}
      </div>

      {/* Scroll progress indicator */}
      {!compact && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-primary/20"
          style={{ scaleX: scrollYProgress }}
        />
      )}
    </motion.div>
  )
}

// ============================================================================
// Sub-components
// ============================================================================

function ScrollRevealChart({ 
  data, 
  title, 
  subtitle, 
  compact = false,
  variant = 'default'
}: {
  data: AnalyticsData
  title: string
  subtitle: string
  compact?: boolean
  variant?: 'default' | 'premium' | 'minimal'
}) {
