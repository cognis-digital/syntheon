import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, Users, Activity, Settings, Search, Bell, Moon, Sun,
  Menu, X, ChevronRight, TrendingUp, TrendingDown, DollarSign, UserPlus,
  FileText, MoreHorizontal, LogOut, HelpCircle, Zap, CheckCircle2
} from 'lucide-react'
import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion'

interface DashboardProps {
  user: {
    name: string
    email: string
    avatar?: string
    role: 'admin' | 'member' | 'viewer'
  }
  stats: {
    revenue: number
    users: number
    activeNow: number
    growth: number
  }
  recentActivity: Array<{
    id: string
    action: string
    target: string
    timeAgo: string
    icon: React.ElementType
    positive?: boolean
  }>
}

const useReducedMotion = () => {
  const [isReduced, setIsReduced] = useState(false)
  
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsReduced(true)
    }
    
    return () => {}
  }, [])

  return isReduced
}

export interface DashboardStatsProps extends Partial<DashboardProps['stats']> {
  isLoading?: boolean
}

export interface ActivityItemProps extends Omit<DashboardProps['recentActivity'][number], 'id'> {}

export interface NavItemProps {
  icon: React.ElementType
  label: string
  active?: boolean
  onClick?: () => void
}

// ============ UI COMPONENTS ============

function StatCard({ 
  title, 
  value, 
  change, 
  trend, 
  isLoading,
  children,
}: {
  title: string
  value: number | string
  change: number
  trend: 'up' | 'down' | 'neutral'
  isLoading?: boolean
  children?: React.ReactNode
}) {
  const isReduced = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        'relative overflow-hidden rounded-xl border bg-background p-6',
        'border-border/50 shadow-sm hover:shadow-md transition-shadow',
        isLoading && 'animate-pulse'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          {isLoading ? (
            <div className="h-12 w-16 animate-spin rounded-full border-4 border-primary/30" />
          ) : (
            <span className={cn(
              'text-3xl font-semibold tracking-tight',
              trend === 'up' && 'text-green-500',
              trend === 'down' && 'text-red-500',
              trend === 'neutral' && 'text-muted-foreground'
            )}>
              {value}
            </span>
          )}
        </div>
        
        <div className={cn(
          'flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium',
          trend === 'up' && 'bg-green-500/10 text-green-600 dark:text-green-400',
          trend === 'down' && 'bg-red-500/10 text-red-600 dark:text-red-400',
          trend === 'neutral' && 'bg-muted text-muted-foreground'
        )}>
          {trend === 'up' ? <TrendingUp size={14} /> : 
           trend === 'down' ? <TrendingDown size={14} /> : null}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="mt-4 text-sm font-medium"
      >
        {title}
      </motion.p>

      <AnimatePresence>
        {children && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-border/50"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        aria-hidden={!isReduced}
        className={cn(
          'absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent',
          isReduced ? 'opacity-0' : 'opacity-100'
        )}
      />
    </motion.div>
  )
}

function ActivityItem({ 
  action, 
  target, 
  timeAgo, 
  icon: Icon,
  positive,
}: ActivityItemProps) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
    >
      <div 
        className={cn(
          'h-10 w-10 rounded-full flex items-center justify-center',
          positive ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'
        )}
      >
        <Icon size={18} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {action} <span className="font-normal">{target}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{timeAgo}</p>
      </div>

      <button 
        aria-label={`View details for ${action}`}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-border/50 rounded-lg"
      >
        <MoreHorizontal size={16} />
      </button>
    </motion.li>
  )
}

function NavItem({ icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: Math.random() * 0.1 }}
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
        active 
          ? 'bg-primary/10 text-primary border-r-2 border-primary' 
          : 'text-muted-foreground hover:bg-border/50 hover:text-foreground'
      )}
    >
      <Icon size={18} />
      <span>{label}</span>
      {active && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-auto"
        >
          <ChevronRight size={14} />
        </motion.div>
      )}
    </motion.button>
  )
}

function Header({ user }: { user: DashboardProps['user'] }) {
  const [isDark, setIsDark] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button 
            aria-label="Toggle navigation"
            className="lg:hidden p-2 hover:bg-border/50 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>

          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Zap size={18} />
            </div>
            <span className="font-semibold hidden sm:inline">Syntheon</span>
          </motion.div>

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="search"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 rounded-lg border bg-background/50 border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDark(!isDark)}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg hover:bg-border/50 transition-colors"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          <button 
            aria-label="Notifications"
            className="relative p-2 rounded-lg hover:bg-border/50 transition-colors"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
          </button>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 pl-2 border-l border-border/50 ml-2"
          >
            <div className="text-right hidden sm:block">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <img 
              src={user.avatar || undefined}
              alt={`${user.name}'s avatar`}
              className="h-9 w-9 rounded-full border-2 border-border object-cover"
            />
          </motion.div>
        </div>
      </div>
    </header>
  )
}

function Sidebar({ user }: { user: DashboardProps['user'] }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <aside 
      className={cn(
        'fixed inset-y-0 left-0 z-40 border-r bg-background/95 backdrop-blur-xl transition-all',
        isOpen ? 'w-64' : 'w-20',
        !isOpen && 'hidden lg:block'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <motion.div 
          initial={false}
          animate={{ width: isOpen ? 144 : 56 }}
          className="h-16 flex items-center justify-between px-4"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Zap size={16} />
            </div>
            {isOpen && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-semibold"
              >
                Syntheon
              </motion.span>
            )}
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
            className="p-2 hover:bg-border/50 rounded-lg transition-colors"
          >
            {isOpen ? <X size={16} /> : <ChevronRight size={14} />}
          </button>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {isOpen ? 'Main' : ''}
          </div>

          {[
            { icon: LayoutDashboard, label: 'Dashboard', active: true },
            { icon: Users, label: 'Team', active: false },
            { icon: Activity, label: 'Activity', active: false },
            { icon: FileText, label: 'Documents', active: false },
          ].map((item) => (
            <NavItem 
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={item.active}
            />
          ))}

          {isOpen && (
            <>
              <div className="px-3 mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Settings
              </div>
              
              <NavItem 
                icon={Settings} 
                label="Preferences" 
                active={false}
              />
              <NavItem 
                icon={HelpCircle} 
                label="Support" 
                active={false}
              />
            </>
          )}

          {/* User menu */}
          {isOpen && (
            <>
              <div className="px-3 mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Account
              </div>
              
              <NavItem 
                icon={UserPlus} 
                label="Profile" 
                active={false}
              />
              <NavItem 
                icon={LogOut} 
                label="Sign out" 
                active={false}
              />
            </>
          )}
        </nav>

        {/* User footer */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border-t"
          >
            <div className="flex items-center gap-3">
              <img 
                src={user.avatar || undefined}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </aside>
  )
}

function MainContent({ stats, activity }: { stats: DashboardProps['stats']; activity: DashboardProps['recentActivity'] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const [scrollY, setScrollY] = useState(0)
  useScroll({ ref: scrollRef, offset: ['start start', 'end end'], scrub: 120 } as any)

  return (
    <main className="flex-1 overflow-y-auto">
      {/* Hero section */}
      <section className="relative overflow-hidden py-16 px-8">
        <div 
          ref={scrollRef}
          onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}
          className="h-full"
        >
          <motion.div
            initial={{ opacity: 0, y: -48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 max-w-5xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Welcome back, {stats.users.toLocaleString()} users today
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-lg text-muted-foreground max-w-2xl"
            >
              Your revenue is up {stats.growth}% from last month. 
              You're on track to hit your quarterly goals early.
            </motion.p>

            <div className="mt-8 flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                View Reports
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-lg border font-medium hover:bg-border/50 transition-colors"
              >
                Export Data
              </motion.button>
            </div>
          </motion.div>

          {/* Decorative background elements */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
            className="absolute -right-48 top-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
            className="absolute -left-48 top-1/2 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
          />
        </div>
      </section>

      {/* Stats grid */}
      <section className="px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          <StatCard 
            title="Monthly Revenue"
            value={`$${stats.revenue.toLocaleString()}`}
            change={12.5}
            trend="up"
          >
            <div className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">Last 7 days:</span>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <DollarSign size={16} />
                <span className="ml-1">+$2,340</span>
              </motion.div>
            </div>
          </StatCard>

          <StatCard 
            title="Active Users"
            value={stats.activeNow.toLocaleString()}
            change={8.2}
            trend="up"
          >
            <div className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">Peak today:</span>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Users size={16} />
                <span className="ml-1">{Math.round(stats.activeNow * 1.3).toLocaleString()}</span>
              </motion.div>
            </div>
          </StatCard>

          <StatCard 
            title="New Signups"
            value={stats.users.toLocaleString()}
            change={24.8}
            trend="up"
          >
            <div className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">Conversion rate:</span>
