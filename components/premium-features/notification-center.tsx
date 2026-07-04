'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, X, CheckCircle2, AlertCircle, MessageSquare, 
  MoreHorizontal, Play, Pause, Search, Trash2, 
  ChevronDown, ChevronUp, Sparkles, Volume2, VolumeX 
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { inputProps } from '@/components/ui/input'
import { badgeProps } from '@/components/ui/badge'
import { cardProps } from '@/components/ui/card'

interface NotificationItem {
  id: string
  type: 'info' | 'success' | 'warning' | 'error' | 'system'
  origin: string
  title: string
  message?: string
  timestamp: Date
  read: boolean
  actions?: Array<{ label: string; icon?: React.ReactNode }>
}

interface NotificationCenterProps {
  notifications: NotificationItem[]
  onDismissAll?: () => void
  onMarkRead?: (id: string) => void
  onReply?: (item: NotificationItem, callback: (text: string) => void)
  soundEnabled?: boolean
  onToggleSound?: (enabled: boolean) => void
  className?: string
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'system',
    origin: 'Server',
    title: 'Deployment Complete',
    message: 'Production deployment finished successfully.',
    timestamp: new Date(Date.now() - 3600000),
    read: true,
    actions: [{ label: 'View Logs' }]
  },
  {
    id: '2',
    type: 'success',
    origin: 'Billing',
    title: 'Payment Received',
    message: 'Invoice #INV-2024-0891 paid in full.',
    timestamp: new Date(Date.now() - 7200000),
    read: true,
    actions: [{ label: 'View Invoice' }]
  },
  {
    id: '3',
    type: 'warning',
    origin: 'Security',
    title: 'Login Attempt',
    message: 'Unusual login detected from new device.',
    timestamp: new Date(Date.now() - 18000000),
    read: false,
    actions: [{ label: 'Review' }]
  },
]

const TYPE_CONFIG = {
  info: { icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  success: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
  warning: { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  error: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  system: { icon: Sparkles, color: 'text-violet-400', bg: 'bg-violet-500/10' },
}

const getGroupKey = (timestamp: Date): string => {
  const hours = Math.floor(timestamp.getTime() / 3600000)
  return `${hours}:00`
}

export interface NotificationCenterPropsInterface extends NotificationCenterProps {}

export default function NotificationCenter({
  notifications = DEFAULT_NOTIFICATIONS,
  onDismissAll,
  onMarkRead,
  onReply,
  soundEnabled = true,
  onToggleSound,
  className,
}: NotificationCenterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [soundEnabledState, setSoundEnabledState] = useState(soundEnabled)
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)

  useEffect(() => {
    if (onToggleSound) onToggleSound(soundEnabledState)
  }, [soundEnabledState, onToggleSound])

  const filteredNotifications = notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.origin.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedNotifications = filteredNotifications.reduce((acc, notification) => {
    const key = getGroupKey(notification.timestamp)
    if (!acc[key]) acc[key] = []
    acc[key].push(notification)
    return acc
  }, {} as Record<string, NotificationItem[]>)

  const sortedGroups = Object.keys(groupedNotifications).sort((a, b) => {
    const timeA = parseInt(a.split(':')[0])
    const timeB = parseInt(b.split(':')[0])
    return timeB - timeA
  })

  const handleDismissAll = useCallback(() => {
    onDismissAll?.()
  }, [onDismissAll])

  const handleMarkRead = useCallback(
    (id: string) => {
      onMarkRead?.(id)
    },
    [onMarkRead]
  )

  const handleReply = useCallback(
    (item: NotificationItem, callback: (text: string) => void) => {
      if (onReply) onReply(item, callback)
    },
    [onReply]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'fixed top-4 right-4 z-[9999] w-[380px] max-w-full',
        'bg-background/95 backdrop-blur-xl border border-border/20 rounded-2xl shadow-2xl',
        'flex flex-col overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-b from-violet-500/10 to-transparent border-b border-border/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <Bell className="h-5 w-5 text-violet-400" />
            </motion.div>
            <span className="text-sm font-medium text-foreground">Notifications</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSoundEnabledState(!soundEnabledState)}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'h-8 w-8 rounded-full hover:bg-muted/50',
                soundEnabledState ? 'text-violet-400' : 'text-muted-foreground'
              )}
              aria-label={soundEnabledState ? 'Mute sounds' : 'Enable sounds'}
            >
              {soundEnabledState ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDismissAll}
              disabled={filteredNotifications.length === 0}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'h-8 w-8 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-400',
                filteredNotifications.length === 0 && 'opacity-30 cursor-not-allowed'
              )}
              aria-label="Dismiss all notifications"
            >
              <X className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            inputProps,
            'h-9 px-3 text-sm bg-background border-border/20 rounded-full focus:outline-none focus:ring-2',
            'focus:ring-violet-500/20 transition-all'
          )}
        />

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span>
            {filteredNotifications.filter((n) => !n.read).length} unread
          </span>
          <span>•</span>
          <span>{sortedGroups.length} groups</span>
        </div>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto max-h-[400px]">
        {sortedGroups.map((groupKey) => {
          const groupNotifications = groupedNotifications[groupKey]
          return (
            <AnimatePresence key={groupKey}>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-b border-border/10 last:border-0"
              >
                {/* Group Header */}
                <button
                  onClick={() => setExpandedGroup(expandedGroup === groupKey ? null : groupKey)}
                  className={cn(
                    'w-full px-4 py-2 flex items-center justify-between text-left',
                    'hover:bg-muted/30 transition-colors'
                  )}
                >
                  <span className="text-xs font-medium text-muted-foreground">
                    {groupKey}:00 — {groupNotifications.length}
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      expandedGroup === groupKey ? 'rotate-180' : ''
                    )}
                  />
                </button>

                {/* Group Items */}
                {expandedGroup === groupKey && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-2 pb-4"
                  >
                    {groupNotifications.map((notification, index) => {
                      const config = TYPE_CONFIG[notification.type]
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03, duration: 0.2 }}
                          className={cn(
                            'p-4 rounded-xl mb-2',
                            'bg-background/50 border border-border/10 hover:border-border/20',
                            'transition-all cursor-pointer group'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            {/* Icon */}
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className={cn(
                                'h-9 w-9 rounded-full flex items-center justify-center',
                                config.bg,
                                config.color
                              )}
                            >
                              <config.icon className="h-4 w-4" />
                            </motion.div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-sm font-medium text-foreground truncate">
                                  {notification.title}
                                </span>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {notification.timestamp.toLocaleTimeString([], {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>

                              <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                                {notification.message || notification.title}
                              </p>

                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground/60 truncate max-w-[150px]">
                                  {notification.origin}
                                </span>

                                {/* Actions */}
                                <div className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                  {notification.actions?.map((action, idx) => (
                                    <motion.button
                                      key={idx}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                      {action.icon || <MoreHorizontal className="h-3 w-3" />}
                                    </motion.button>
                                  ))}

                                  {!notification.read && (
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => handleMarkRead(notification.id)}
                                      className="p-1.5 rounded-lg hover:bg-green-500/10 text-muted-foreground hover:text-green-400 transition-colors"
                                    >
                                      <CheckCircle2 className="h-3 w-3" />
                                    </motion.button>
                                  )}

                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleReply(notification, () => {
                                      // Handle reply - placeholder
                                    })}
                                    className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    <MessageSquare className="h-3 w-3" />
                                  </motion.button>

                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleMarkRead(notification.id)}
                                    className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    <CheckCircle2 className="h-3 w-3" />
                                  </motion.button>

                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                      // Handle dismiss - placeholder
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                                  >
                                    <X className="h-3 w-3" />
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )
        })}

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="p-8 text-center">
            <div className="flex items-center justify-center mb-3">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No notifications found</p>
          </div>
        )}

        {/* All Read State */}
        {filteredNotifications.length > 0 && filteredNotifications.every((n) => n.read) && (
          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <Sparkles className="h-6 w-6 text-violet-400 mx-auto mb-2" />
            </motion.div>
            <p className="text-sm text-muted-foreground">All caught up! No new notifications.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredNotifications.length > 0 && (
        <div className="p-3 bg-background/50 border-t border-border/20 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Showing {filteredNotifications.filter((n) => !n.read).length} of {filteredNotifications.length}
          </span>

          <div className="flex gap-1">
            <button
              onClick={() => setSearchQuery('')}
              disabled={searchQuery === ''}
              className={cn(
                'px-3 py-1.5 text-xs rounded-lg transition-colors',
                searchQuery === ''
                  ? 'bg-violet-500/20 text-violet-400 font-medium'
                  : 'text-muted-foreground hover:bg-muted/30'
              )}
            >
              Clear
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDismissAll}
              disabled={filteredNotifications.length === 0}
              className={cn(
                'px-3 py-1.5 text-xs rounded-lg transition-colors',
                filteredNotifications.length > 0
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'text-muted-foreground opacity-50 cursor-not-allowed'
              )}
            >
              Dismiss All
            </motion.button>
          </div>
        </div>
      )}

      {/* Staggered entrance animation for entire list */}
      <AnimatePresence initial={false}>
        {filteredNotifications.length > 0 && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
