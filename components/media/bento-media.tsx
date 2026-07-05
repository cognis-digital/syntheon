'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface BentoMediaProps {
  items: Array<{
    id: string
    title: string
    artist?: string
    year?: string
    dimensions?: string
    description: string
    colorTheme: 'violet' | 'indigo' | 'purple' | 'fuchsia'
    isFeatured?: boolean
  }>
  columns?: number
  showControls?: boolean
  autoPlay?: boolean
  loop?: boolean
}

export interface BentoMediaState {
  hoveredId: string | null
  activeTab: 'all' | 'featured'
  scrollProgress: number
}

const THEME_COLORS = {
  violet: {
    bg: 'bg-violet-500',
    gradient: 'from-violet-400 to-violet-600',
    glow: 'shadow-[0_0_30px_rgba(139,92,246,0.3)]',
  },
  indigo: {
    bg: 'bg-indigo-500',
    gradient: 'from-indigo-400 to-indigo-600',
    glow: 'shadow-[0_0_30px_rgba(99,102,241,0.3)]',
  },
  purple: {
    bg: 'bg-purple-500',
    gradient: 'from-purple-400 to-purple-600',
    glow: 'shadow-[0_0_30px_rgba(192,132,252,0.3)]',
  },
  fuchsia: {
    bg: 'bg-fuchsia-500',
    gradient: 'from-fuchsia-400 to-fuchsia-600',
    glow: 'shadow-[0_0_30px_rgba(232,121,249,0.3)]',
  },
}

const createOriginalArtwork = (theme: string, index: number): JSX.Element => {
  const t = THEME_COLORS[theme] as typeof THEME_COLORS.violet
  const offset = (index % 5) * 15
  const scale = 0.8 + Math.sin(index / 3) * 0.2

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 300"
      className={cn('w-full h-full', t.bg, 'transition-transform duration-700')}
      style={{ transform: `scale(${scale})` }}
    >
      <defs>
        <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.1} />
          <stop offset="50%" stopColor="#fff" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#fff" stopOpacity={0.1} />
        </linearGradient>
      </defs>

      {/* Abstract geometric composition */}
      <motion.rect
        x={offset * 8}
        y={50 + (index % 3) * 20}
        width="60"
        height={120 - (index % 3) * 20}
        fill={`url(#grad-${index})`}
        rx="4"
        initial={{ opacity: 0, rotate: -5 }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          rotate: [-5, 5, -5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.rect
        x={200 + offset * 12}
        y={80 - (index % 2) * 30}
        width="90"
        height={80 + (index % 4) * 15}
        fill={`url(#grad-${index})`}
        rx="6"
        initial={{ opacity: 0, rotate: 5 }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
          rotate: [5, -8, 5],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.circle
          key={i}
          cx={50 + (i % 3) * 120}
          cy={40 + (i % 2) * 80}
          r={4 + Math.sin(i) * 2}
          fill="#fff"
          initial={{ opacity: 0, y: -50 }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [-50, 30, 80],
            x: (i % 2 === 0 ? 10 : -10),
          }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Subtle grid overlay */}
      <rect width="400" height="300" fill="none" stroke="white" strokeWidth="1" opacity={0.08}>
        <animate attributeName="stroke-dasharray" from="5,5" to="10,10" dur="20s" repeatCount="indefinite" />
      </rect>

      {/* Center glow effect */}
      <motion.circle
        cx="200"
        cy="150"
        r={80 + Math.sin(Date.now() / 1000) * 30}
        fill={`url(#grad-${index})`}
        opacity={0.15}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  )
}

const createOriginalArtworkFeatured = (theme: string): JSX.Element => {
  const t = THEME_COLORS[theme] as typeof THEME_COLORS.violet
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 300" className={cn('w-full h-full', t.bg)}>
      <defs>
        <radialGradient id="featured-glow">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.2} />
          <stop offset="70%" stopColor="#fff" stopOpacity={0.05} />
          <stop offset="100%" stopColor="#fff" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Concentric rings */}
      {[...Array(4)].map((_, i) => (
        <motion.circle
          key={i}
          cx="200"
          cy="150"
          r={60 + i * 35}
          fill="none"
          stroke="#fff"
          strokeWidth={1.5 - i * 0.25}
          opacity={0.15 - i * 0.04}
          initial={{ scale: 0, rotate: 0 }}
          animate={{
            scale: [0, 1 + (i % 2) * 0.3],
            rotate: 360,
          }}
          transition={{ duration: 8 + i * 4, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Abstract shapes */}
      <motion.rect
        x="50"
        y="100"
        width="120"
        height={80 + Math.sin(Date.now() / 500) * 40}
        fill={`url(#featured-glow)`}
        rx="16"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 50, opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.path
        d="M280 100 L320 50 L360 120"
        stroke="#fff"
        strokeWidth={2}
        fill="none"
        opacity={0.4}
        initial={{ pathLength: 0, x: 360 }}
        animate={{ pathLength: 1, x: 280 }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Pulsing core */}
      <motion.circle
        cx="200"
        cy="150"
        r={40 + Math.sin(Date.now() / 800) * 15}
        fill={`url(#featured-glow)`}
        opacity={0.3}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  )
}

export function BentoMedia({
  items = [],
  columns = 3,
  showControls = true,
  autoPlay = false,
  loop = true,
}: BentoMediaProps) {
  const [state, setState] = React.useState<BentoMediaState>({
    hoveredId: null,
    activeTab: 'all',
    scrollProgress: 0,
  })

  const containerRef = React.useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const progress = useTransform(scrollY, [0, 1], [0, 1])

  // Filter items based on active tab
  const filteredItems = state.activeTab === 'featured'
    ? items.filter(item => item.isFeatured)
    : items

  return (
    <div className="relative">
      {/* Progress bar */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400"
        >
          <motion.div
            style={{ x: useTransform(progress, (val) => val * 100) }}
            className="h-full bg-white/90 shadow-lg rounded-r-full"
          />
        </motion.div>
      )}

      {/* Controls */}
      {showControls && (
        <div className={cn(
          "absolute -bottom-8 left-0 right-0 flex justify-center gap-2",
          "transition-opacity duration-300",
          state.hoveredId ? "opacity-0" : "opacity-100"
        )}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setState(s => ({ ...s, activeTab: 'all' }))}
            className={cn(
              "border-border bg-background/80 backdrop-blur-sm",
              state.activeTab === 'all' && "bg-violet-500 border-transparent"
            )}
          >
            <Badge variant="secondary" className="mr-2">All</Badge>
            {items.length - items.filter(i => i.isFeatured).length} artworks
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setState(s => ({ ...s, activeTab: 'featured' }))}
            className={cn(
              "border-border bg-background/80 backdrop-blur-sm",
              state.activeTab === 'featured' && "bg-violet-500 border-transparent"
            )}
          >
            <Badge variant="secondary" className="mr-2">Featured</Badge>
            {items.filter(i => i.isFeatured).length} pieces
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setState(s => ({ ...s, activeTab: 'all' }))}
            className={cn(
              "border-border bg-background/80 backdrop-blur-sm",
              state.activeTab === 'featured' && "bg-violet-500 border-transparent"
            )}
          >
            <Badge variant="secondary" className="mr-2">Reset</Badge>
          </Button>
        </div>
      )}

      {/* Grid */}
      <motion.div
        ref={containerRef}
        layout
        className={cn(
          "grid gap-4 p-6",
          columns === 1 ? "max-w-md" :
          columns === 2 ? "max-w-lg" :
          columns === 3 ? "max-w-xl" : "max-w-2xl"
        )}
      >
        {filteredItems.map((item, index) => (
          <BentoCell
            key={item.id}
            item={item}
            index={index}
            hoveredId={state.hoveredId}
            onHover={(id) => setState(s => ({ ...s, hoveredId: id }))}
            isFeatured={item.isFeatured || state.activeTab === 'featured'}
          />
        ))}

        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-24 text-center"
          >
            <p className={cn(
              "text-muted-foreground",
              state.activeTab === 'featured' ? "text-sm" : ""
            )}>
              {state.activeTab === 'featured'
                ? "No featured artworks yet."
                : "No artworks to display."}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Background glow effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 0.5 }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className={cn(
            "w-96 h-96 rounded-full blur-3xl",
            THEME_COLORS.violet.gradient
          )}
        />
      </div>
    </div>
  )
}

interface BentoCellProps {
  item: NonNullable<BentoMediaProps['items'][number]>
  index: number
  hoveredId: string | null
  onHover: (id: string) => void
  isFeatured: boolean
}

function BentoCell({ item, index, hoveredId, onHover, isFeatured }: BentoCellProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { margin: "0px 0px 100px 0px" })

  // Determine theme based on item and index for variety
  const themes: NonNullable<BentoMediaProps['items'][number]>['colorTheme'][] = [
    'violet', 'indigo', 'purple', 'fuchsia'
  ]
  const theme = (item.colorTheme || themes[index % themes.length]) as typeof themes[0]

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      layoutId={`cell-${item.id}`}
      onHoverStart={() => !hoveredId && onHover(item.id)}
      onHoverEnd={() => hoveredId === item.id && onHover('')}
      className={cn(
        "relative overflow-hidden rounded-xl cursor-pointer",
        isFeatured ? "ring-2 ring-violet-400/50" : "",
        hoveredId === item.id ? "scale-[1.02]" : ""
      )}
    >
      {/* Content layer */}
      <div className={cn(
        "relative aspect-square bg-muted overflow-hidden",
        isFeatured && "aspect-video"
      )}>
        {isFeatured ? (
          createOriginalArtworkFeatured(theme)
        ) : (
          createOriginalArtwork(theme, index)
        )}

        {/* Overlay gradient */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent",
          hoveredId === item.id && "from-violet-950/60"
        )} />

        {/* Featured badge */}
        {isFeatured && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium",
              "bg-violet-500/90 backdrop-blur-sm text-white"
            )}
          >
            Featured
          </motion.div>
        )}

        {/* Hover overlay with info */}
        <AnimatePresence>
          {hoveredId === item.id && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                "bg-background/40 backdrop-blur-sm"
              )}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={cn(
                  "px-4 py-2 rounded-full",
                  "bg-violet-500 text-white shadow-lg"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{item.title}</span>
                  {item.artist && (
                    <span className="text-violet-200">— {item.artist}</span>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick actions */}
        <div className={cn(
          "absolute bottom-3 left-3 right-3 flex justify-between items-center",
          hoveredId === item.id ? "opacity-100" : "opacity-0 transition-opacity duration-200"
        )}>
          <Button variant="ghost" size="sm">
            <span className={cn("text-sm", isFeatured && "font-medium")}>{item.year || '—'}</span>
          </Button>

          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8 bg-background/50 backdrop-blur-sm border-border">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19v-6M12 5v7"/>
              </svg>
            </Button>

            <Button variant="outline" size="icon" className="h-8 w-8 bg-background/50 backdrop-blur-sm border-border">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 13a2 2 0 01-2 2H5l-7 7V6a2 2 0 012-2h16a2 2 0 012 2v13"/>
              </svg>
            </Button>
