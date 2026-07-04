'use client'

import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface BarBreakdownProps {
  data: Array<{
    label: string
    value: number
    color?: string
    trend?: 'up' | 'down' | 'neutral'
  }>
  title?: string
  description?: string
  height?: number
  showTrend?: boolean
  onBarClick?: (item: typeof BarBreakdownProps['data'][0]) => void
}

export interface BarBreakdownDataItem {
  label: string
  value: number
  color?: string
  trend?: 'up' | 'down' | 'neutral'
}

function createDefaultData(): Array<{
  label: string
  value: number
  color?: string
  trend?: 'up' | 'down' | 'neutral'
}> {
  return [
    { label: 'Direct', value: 45, color: '#8b5cf6', trend: 'up' },
    { label: 'Referral', value: 23, color: '#a78bfa', trend: 'neutral' },
    { label: 'Organic', value: 18, color: '#c4b5fd', trend: 'down' },
    { label: 'Social', value: 14, color: '#ddd6fe', trend: 'up' },
  ]
}

export default function BarBreakdown({
  data = createDefaultData(),
  title = 'Traffic Sources',
  description = 'Breakdown of your traffic sources over the last 30 days.',
  height = 250,
  showTrend = true,
  onBarClick,
}: BarBreakdownProps) {
  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data])

  return (
    <Card className="border-border bg-background shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-primary font-semibold text-lg tracking-tight">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </CardDescription>
            )}
          </div>

          <Badge variant="secondary" className="bg-background/50 backdrop-blur border-border">
            Total: {total.toLocaleString()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 20, bottom: 30, left: 80 }}
          barSize={40}
          height={height}
          width={500}
        >
          <XAxis dataKey="value" type="number" hide />
          <YAxis 
            dataKey="label" 
            type="category" 
            tick={{ fill: 'var(--text-muted-foreground)', fontSize: 12, fontWeight: 500 }}
            interval={0}
            width={140}
          />

          <Tooltip
            content={({ active, payload }) => {
              if (active && payload?.[0]) {
                const item = payload[0].payload as typeof data[0]
                return (
                  <div className="bg-background border-border rounded-lg shadow-md p-3 min-w-[160px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-primary">{item.label}</span>
                      <span className="text-muted-foreground font-mono">
                        {item.value.toLocaleString()}
                      </span>
                    </div>
                    {showTrend && item.trend && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className={cn(
                          'font-medium',
                          item.trend === 'up' ? 'text-green-500' : 
                          item.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
                        )}>
                          {item.trend === 'up' && '↑'}
                          {item.trend === 'down' && '↓'}
                        </span>
                        <span className="text-muted-foreground">vs. previous period</span>
                      </div>
                    )}
                  </div>
                )
              }
              return null
            }}
          />

          {data.map((item, index) => (
            <Bar
              key={index}
              dataKey="value"
              fill={item.color || 'var(--text-muted-foreground)'}
              stroke="transparent"
              radius={[4, 4, 0, 0]}
              animationDuration={800}
              animationEasing="easeInOutCubic"
              onClick={() => onBarClick?.(item)}
            >
              <Cell fill={item.color || 'var(--text-muted-foreground)'} />
            </Bar>
          ))}
        </BarChart>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {data.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 50, duration: 0.3 }}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border-border hover:bg-muted cursor-pointer transition-colors"
              onClick={() => onBarClick?.(item)}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm" 
                  style={{ backgroundColor: item.color || 'var(--text-muted-foreground)' }}
                />
                <span className="font-medium text-primary">{item.label}</span>
              </div>
              <span className="font-mono font-semibold text-foreground">
                {((item.value / total) * 100).toFixed(1)}%
              </span>
            </motion.div>
          ))}
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-4 text-muted-foreground hover:text-primary border-border bg-background/50 backdrop-blur"
          onClick={() => onBarClick?.({ label: 'View All', value: 0, color: '#8b5cf6' })}
        >
          View Detailed Report →
        </Button>
      </CardContent>
    </Card>
  )
}

// Preset configurations for quick use
export const barBreakdownPresets = {
  default: { title: 'Traffic Sources', height: 250 },
  compact: { title: 'Sources', height: 180, description: undefined },
  wide: { title: 'Detailed Traffic Analysis', height: 320, showTrend: true },
} as const

// Animation variants for reuse
export const barBreakdownVariants = {
  container: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  },
  bar: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  },
} as const
