'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage as ShadcnAvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface AvatarGroupProps {
  /** Array of user data with optional images */
  users: {
    name: string
    initials?: string
    image?: string | null
    status?: 'online' | 'offline' | 'busy' | 'away'
    verified?: boolean
    admin?: boolean
  }[]

  /** Maximum visible avatars before showing "n+" indicator */
  maxVisible: number

  /** Size of avatar component */
  size?: 'sm' | 'md' | 'lg' | 'xl'

  /** Show status indicators (dots) */
  showStatus: boolean

  /** Show verification/admin badges */
  showBadges: boolean

  /** Click handler for group or individual avatars */
  onAvatarClick?: (user: { name: string; index: number }) => void

  /** Custom border/background colors (defaults to violet theme) */
  borderColor?: string
  backgroundColor?: string
}

const SIZE_MAP = {
  sm: { width: 32, height: 32, fontSize: 10 },
  md: { width: 40, height: 40, fontSize: 12 },
  lg: { width: 56, height: 56, fontSize: 14 },
  xl: { width: 80, height: 80, fontSize: 16 },
}

const STATUS_COLORS = {
  online: 'bg-green-500',
  offline: 'bg-slate-400',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
}

const createAvatarVariants = (size: string) => ({
  hidden: { scale: 0.8, opacity: 0, rotate: -10 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      duration: 0.3,
    },
  },
})

const createStaggerDelay = (index: number, maxVisible: number) => {
  const delay = index < maxVisible ? 0.05 * index : 0.15
  return { delay }
}

export function AvatarGroup({
  users,
  maxVisible = 4,
  size = 'md',
  showStatus = true,
  showBadges = true,
  onAvatarClick,
  borderColor = 'border-border',
  backgroundColor = 'bg-background',
}: AvatarGroupProps) {
  const isReducedMotion = useReducedMotion()

  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md
  const visibleCount = Math.min(users.length, maxVisible)
  const overflowCount = users.length - visibleCount

  return (
    <div className={cn('flex items-center gap-1.5', backgroundColor)}>
      {users.slice(0, visibleCount).map((user, index) => {
        const variants = createAvatarVariants(size)
        const delay = createStaggerDelay(index, maxVisible)

        return (
          <motion.div
            key={user.name}
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={{ ...delay, duration: 0.4 }}
            className="relative flex items-center justify-center"
          >
            <Avatar>
              {user.image ? (
                <ShadcnAvatarImage src={user.image} alt={user.name} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {user.initials || user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Status indicator */}
            {showStatus && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay.delay + 0.2, type: 'spring', stiffness: 500 }}
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 bg-background"
              >
                <div className={cn('w-full h-full rounded-full', STATUS_COLORS[user.status || 'offline'])} />
              </motion.div>
            )}

            {/* Verification badge */}
            {showBadges && user.verified && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: delay.delay + 0.3, type: 'spring', stiffness: 600 }}
                className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-background rounded-full flex items-center justify-center"
              >
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path d="M1.5 4.5L4.5 7.5L9 2" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            )}

            {/* Admin badge */}
            {showBadges && user.admin && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay.delay + 0.4, type: 'spring', stiffness: 500 }}
                className="absolute -top-0.5 -right-2 w-3 h-3 bg-background rounded-full flex items-center justify-center"
              >
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M5 1L7.5 4H2.5L5 1Z" stroke="#8B5CF6" strokeWidth="1" strokeLinecap="round" />
                  <rect x="2.5" y="4" width="5" height="3" rx="0.5" fill="#8B5CF6" opacity="0.2" />
                </svg>
              </motion.div>
            )}

            {/* Hover effect */}
            {!isReducedMotion && (
              <motion.div
                className={cn(
                  'absolute inset-0 rounded-full border',
                  borderColor,
                  'opacity-0 hover:opacity-100 transition-opacity duration-200'
                )}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            )}
          </motion.div>
        )
      })}

      {/* Overflow indicator */}
      {overflowCount > 0 && (
        <motion.div
          initial={{ scale: 0, rotate: 45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 600 }}
          className={cn(
            'flex items-center justify-center text-xs font-medium rounded-full border bg-background',
            borderColor,
            'w-8 h-8'
          )}
        >
          <span className="text-muted-foreground">+{overflowCount}</span>
        </motion.div>
      )}

      {/* Add more button */}
      {users.length === 0 && (
        <Button variant="ghost" size="sm" className={cn('h-8 px-3', borderColor)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Button>
      )}

      {/* Group action button */}
      {onAvatarClick && users.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Button variant="ghost" size="sm" className={cn('h-8 px-2', borderColor)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 7L5.5 19C4.34 20.1 2.8 19.5 2.2 18.4L1 16V8H9C11.2 8 13 6.8 14.4 5.4L19 7Z" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </Button>
        </motion.div>
      )}
    </div>
  )
}
