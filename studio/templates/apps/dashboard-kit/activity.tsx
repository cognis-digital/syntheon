'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export interface ActivityItemProps {
  id: string
  type: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  title: string
  description?: string
  timestamp: Date
  icon?: React.ReactNode
  avatarUrl?: string
}

interface ActivityFeedProps {
  items: ActivityItemProps[]
  onRefresh?: () => void
  showTimestamps?: boolean
  compact?: boolean
}

export interface ActivityFilterProps {
  activeType: ActivityItemProps['type'] | 'all'
  onChange: (type: ActivityItemProps['type'] | 'all') => void
}

const typeConfig = {
  success: { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', border: 'border-green-500/20' },
  warning: { bg: 'bg-yellow-500/10', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-500/20' },
  error: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/20' },
  info: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20' },
  neutral: { bg: 'bg-gray-500/10', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-500/20' },
}

const typeIcons = {
  success: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
  warning: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L5.24 10C4.47 11.333 5.432 13 6.972 13z" />
    </svg>
  ),
  error: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  neutral: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.551-.542L12 21l3-3m0 0l-3-3m3 3l3-3" />
    </svg>
  ),
}

const ActivityItem = ({ item, index }: { item: ActivityItemProps; index: number }) => {
  const config = typeConfig[item.type]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.01 }}
      className="group"
    >
      <Card 
        className={cn(
          'h-full transition-all duration-200 hover:shadow-lg hover:border-border/50',
          config.bg,
          item.type === 'error' ? 'border-red-500/30' : 'border-border/40'
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {item.avatarUrl && (
              <img 
                src={item.avatarUrl}
                alt=""
                className="w-10 h-10 rounded-full border border-border/50 object-cover"
              />
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn('text-sm font-medium', config.text)}>
                  {item.title}
                </span>
                
                <Badge 
                  variant="outline" 
                  className={cn(
                    'h-5 px-2 text-xs border-transparent bg-background/80 backdrop-blur-sm',
                    item.type === 'error' ? 'border-red-500/30 text-red-600 dark:text-red-400' : ''
                  )}
                >
                  {item.type.toUpperCase()}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description || 'Activity description'}
              </p>

              {item.timestamp && (
                <time 
                  dateTime={item.timestamp.toISOString()}
                  className="text-xs text-muted-foreground/60 mt-1 block"
                >
                  {new Intl.DateTimeFormat('en-US', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  }).format(item.timestamp)}
                </time>
              )}
            </div>

            <motion.div 
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1.2 }}
            >
              <Button variant="ghost" size="icon">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.69 8.69L7 10.3m11.94-1.94l-1.94-1.94m-2.12 7.83l1.94-1.94m-1.94-1.94l1.94-1.94" />
                </svg>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const ActivityFilter = ({ activeType, onChange }: ActivityFilterProps) => {
  const filters: (ActivityItemProps['type'] | 'all')[] = ['all', 'success', 'warning', 'error', 'info']
  
  return (
    <Tabs 
      defaultValue="all" 
      value={activeType}
      onValueChange={(v) => onChange(v as ActivityFilterProps['activeType'])}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-5 bg-background/80 backdrop-blur-sm border-border">
        {filters.map((filter) => (
          <TabsTrigger 
            key={filter}
            value={filter}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <span className="capitalize">{filter === 'all' ? 'All' : filter}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

const EmptyState = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex-1 flex items-center justify-center min-h-[300px]"
  >
    <Card className="w-full max-w-md">
      <CardContent className="p-8 text-center">
        <div className="mb-4 inline-flex p-4 rounded-full bg-muted/50">
          <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h8m-4-4v8m-4 4l4-4 4 4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No activity found</h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Try adjusting your filters or check back later for new updates.
        </p>
      </CardContent>
    </Card>
  </motion.div>
)

const ActivityFeed = ({ items, onRefresh, showTimestamps = true, compact = false }: ActivityFeedProps) => {
  const [activeType, setActiveType] = React.useState<ActivityFilterProps['activeType']>('all')
  
  const filteredItems = activeType === 'all' 
    ? items 
    : items.filter(item => item.type === activeType)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="border-border/50 bg-background/80 backdrop-blur-sm">
        <CardHeader className="pb-4 border-b border-border/30">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">Activity Feed</CardTitle>
              <CardDescription className="text-sm mt-1">
                Track system events and user actions in real-time
              </CardDescription>
            </div>

            {onRefresh && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRefresh}
                disabled={!items.length}
                className="shrink-0 border-border/50 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  animate={onRefresh ? { rotate: 360 } : {}}
                  transition={{ duration: 0.5, ease: 'linear', repeat: Infinity }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </motion.div>
              </Button>
            )}
          </div>

          <ActivityFilter activeType={activeType} onChange={setActiveType} />
        </CardHeader>

        <CardContent className="p-0">
          {filteredItems.length > 0 ? (
            <AnimatePresence mode="popLayout">
              <motion.div
                layout
                className="divide-y divide-border/20"
              >
                {filteredItems.map((item, index) => (
                  <ActivityItem key={item.id} item={item} index={index} />
                ))}
              </motion.div>

              {/* Staggered entrance animation for items */}
              <style>{`
                .activity-stagger-enter {
                  opacity: 0;
                  transform: translateY(10px);
                }
              `}</style>
            </AnimatePresence>
          ) : (
            <EmptyState />
          )}

          {/* Loading skeleton */}
          <motion.div 
            className="divide-y divide-border/20"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
          >
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 flex gap-3">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 40 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="h-10 rounded-full bg-muted/50"
                />
                <div className="flex-1 space-y-2">
                  <motion.div 
                    initial={{ height: 8, opacity: 0 }}
                    animate={{ height: 16, opacity: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.1 + 0.3 }}
                    className="h-2 rounded bg-muted/50"
                  />
                  <motion.div 
                    initial={{ height: 8, opacity: 0 }}
                    animate={{ height: 12, opacity: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.1 + 0.4 }}
                    className="h-2 rounded bg-muted/50"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </CardContent>

        <CardHeader className="pb-4 border-t border-border/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {filteredItems.length} events • Last updated just now
            </span>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setActiveType('all')}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Reset filters
            </Button>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  )
}

const ActivityPage = () => {
  const [items, setItems] = React.useState<ActivityItemProps[]>([
    {
      id: '1',
      type: 'success',
      title: 'Deployment Completed',
      description: 'Production deployment #4829 completed successfully in 3m 42s',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      id: '2',
      type: 'info',
      title: 'User Registration',
      description: 'New user account created from the signup flow',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
    },
    {
      id: '3',
      type: 'warning',
      title: 'Rate Limit Warning',
      description: 'API endpoint /v2/users approaching rate limit threshold',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
    },
    {
      id: '4',
      type: 'error',
      title: 'Payment Processing Failed',
      description: 'Transaction #TXN-8923 failed due to insufficient funds',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: '5',
      type: 'success',
      title: 'Backup Completed',
      description: 'Automated database backup finished successfully',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  ])

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-background"
    >
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <ActivityFeed 
          items={items}
          onRefresh={() => {
            // Simulate refresh with animation
            setItems([])
            setTimeout(() => {
              setItems(prev => [
                ...prev,
                {
                  id: Date.now().toString(),
                  type: 'info',
                  title: 'Feed Refreshed',
                  description: 'Activity feed updated successfully',
                  timestamp: new Date(),
                },
              ])
            }, 300)
          }}
        />

        {/* Quick stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-8 grid gap-4 md:grid-cols-3"
        >
          {[
            { label: 'Total Events', value: items.length.toString(), color: 'text-primary' },
            { label: 'Success Rate', value: '98.2%', color: 'text-green-600 dark:text-green-400' },
            { label: 'Active Users', value: '1,234', color: 'text-blue-600 dark:text-blue-400' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
              className="p-6 rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm hover:border-primary/30 transition-colors duration-200"
            >
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Floating action button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
