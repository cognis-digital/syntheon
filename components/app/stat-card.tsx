'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface StatCardProps {
  title: string
  value: number | string
  description?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: number
  icon?: React.ReactNode
  action?: React.ReactNode
  loading?: boolean
}

export interface StatCardPropsInterface extends StatCardProps {
  className?: string
}

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: [0.23, 1, 0.32, 1],
    },
  }),
}

export default function StatCard({
  title,
  value,
  description,
  trend = 'neutral',
  trendValue,
  icon,
  action,
  loading = false,
  className,
}: StatCardPropsInterface) {
  const isPositive = trend === 'up'
  const isNegative = trend === 'down'

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      custom={0}
      className={cn('relative overflow-hidden', className)}
    >
      <Card className="h-full border-border bg-background/50 backdrop-blur-sm transition-shadow hover:shadow-lg hover:border-primary/30">
        <CardHeader className="pb-4 flex flex-row items-start justify-between gap-4">
          {icon && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </motion.div>
              ) : (
                icon
              )}
            </div>
          )}

          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1 text-sm text-muted-foreground/80">
                {description}
              </CardDescription>
            )}
          </div>

          {action ? action : null}
        </CardHeader>

        <CardContent className="flex flex-col items-start justify-between gap-4 p-6 pt-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-baseline gap-2"
          >
            {loading ? (
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <span className="text-3xl font-bold tracking-tight text-primary">—</span>
              </motion.div>
            ) : (
              <>
                {typeof value === 'number' ? (
                  <motion.span
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="text-4xl font-bold tracking-tight text-foreground"
                  >
                    {value.toLocaleString()}
                  </motion.span>
                ) : (
                  <span className="text-2xl font-semibold text-foreground">{value}</span>
                )}

                {trendValue !== undefined && trendValue !== 0 && !loading && (
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="flex items-center gap-1"
                  >
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isPositive && 'text-green-500 dark:text-green-400',
                        isNegative && 'text-red-500 dark:text-red-400',
                      )}
                    >
                      {isPositive ? '+' : ''}{trendValue}%
                    </span>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>

          <div className="flex items-center justify-between">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="h-2 w-full rounded-full bg-muted/50 overflow-hidden"
              >
                <motion.div
                  className="h-full bg-primary/60"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>
            )}

            <div className="flex items-center gap-2">
              {trendValue !== undefined && trendValue !== 0 && !loading && (
                <Badge
                  variant={isPositive ? 'default' : isNegative ? 'destructive' : 'secondary'}
                  className="h-6 px-2 text-xs"
                >
                  {isPositive ? 'Growth' : isNegative ? 'Decline' : 'Stable'}
                </Badge>
              )}

              <Button variant="ghost" size="sm" className="h-8 rounded-lg">
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Details
              </Button>
            </div>
          </div>
        </CardContent>

        {/* Decorative gradient accent */}
        <motion.div
          className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/5 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Subtle border glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl border border-primary/5 opacity-0 transition-opacity"
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
      </Card>
    </motion.div>
  )
}
