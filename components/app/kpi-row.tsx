'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Activity, ArrowRight, AlertCircle, CheckCircle2, Zap } from 'lucide-react'

export interface KpiRowProps {
  title: string
  value: number | string
  change?: number // percentage - positive = up, negative = down
  trendData?: Array<{ label: string; value: number }>
  status?: 'healthy' | 'warning' | 'critical' | 'unknown'
  unit?: string
  onClick?: () => void
  children?: React.ReactNode
}

const statusConfig: Record<NonNullable<KpiRowProps['status']>, { color: string; icon: any }> = {
  healthy: { color: 'text-green-500', icon: CheckCircle2 },
  warning: { color: 'text-yellow-500', icon: AlertCircle },
  critical: { color: 'text-red-500', icon: Activity },
  unknown: { color: 'text-gray-400', icon: Zap },
}

const getChangeColor = (change?: number): string => {
  if (!change) return ''
  const positive = change > 0
  const negative = change < 0
  return positive ? 'text-green-500' : negative ? 'text-red-500' : ''
}

const getChangeBgColor = (change?: number): string => {
  if (!change) return ''
  const positive = change > 0
  const negative = change < 0
  return positive ? 'bg-green-500/10 border-green-500/20' : negative ? 'bg-red-500/10 border-red-500/20' : ''
}

export default function KpiRow({ 
  title, 
  value, 
  change, 
  trendData = [], 
  status = 'healthy', 
  unit = '', 
  onClick,
  children 
}: KpiRowProps) {
  const IconComponent = statusConfig[status]?.icon || statusConfig.unknown.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'group',
        onClick ? 'cursor-pointer hover:bg-muted/50 rounded-lg border-border border' : ''
      )}
      onClick={onClick}
    >
      <Card className="h-full bg-background/95 backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg group-hover:border-primary/20">
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground mb-1">{title}</CardTitle>
              <motion.div 
                className={cn(
                  'text-3xl font-bold tracking-tight',
                  getChangeColor(change)
                )}
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                {value}
                <span className="ml-1 text-lg opacity-70">{unit}</span>
              </motion.div>
            </div>

            {/* Status indicator */}
            <Badge 
              variant={status === 'healthy' ? 'default' : status === 'warning' ? 'secondary' : 'destructive'}
              className="h-8 px-3 py-1 gap-2"
            >
              <IconComponent className={`w-4 h-4 ${statusConfig[status].color}`} />
              <span className="text-xs capitalize">{status}</span>
            </Badge>
          </div>

          {/* Change indicator */}
          {change !== undefined && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className={cn(
                'flex items-center gap-2 text-sm',
                getChangeBgColor(change)
              )}
            >
              <span className="font-medium">
                {change > 0 ? '+' : ''}{change}%
              </span>
              <motion.span 
                animate={{ x: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="opacity-50"
              >
                {change > 0 ? <TrendingUp size={16} /> : change < 0 ? <TrendingDown size={16} /> : <Activity size={16} />}
              </motion.span>
            </motion.div>
          )}

          {/* Trend chart (if data provided) */}
          {trendData.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="pt-4"
            >
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>Trend:</span>
                {trendData.map((item, index) => (
                  <motion.span 
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center gap-1"
                  >
                    {item.label}: <span className={cn('font-medium', item.value >= 0 ? 'text-green-400' : 'text-red-400')}>
                      {Math.abs(item.value)}%
                    </span>
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              'w-full justify-center h-8 text-xs border-border group-hover:bg-primary/10',
              onClick ? 'opacity-100' : 'opacity-50 cursor-default'
            )}
            onClick={onClick}
          >
            {children || (
              <>
                <ArrowRight className="mr-2 h-3 w-3" />
                View Details
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
