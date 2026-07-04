'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface HoverPreviewCardProps {
  image: string
  title: string
  description?: string
  price?: string
  onHover?: (e: React.MouseEvent) => void
  onClick?: () => void
  variant?: 'default' | 'featured' | 'sale'
  showPrice?: boolean
  showActions?: boolean
}

export interface HoverPreviewCardVariants {
  container: {
    hidden: { opacity: 0, y: 20 }
    visible: { opacity: 1, y: 0 }
    exit: { opacity: 0, y: -20 }
  }
  image: {
    hidden: { scale: 1, rotateX: 5 }
    visible: { scale: [1, 1.1], rotateX: 0 }
  }
}

const variants = {
  container: HoverPreviewCardVariants.container.hidden as any,
  image: HoverPreviewCardVariants.image.hidden as any,
}

export default function HoverPreviewCard({
  image,
  title,
  description,
  price,
  onHover,
  onClick,
  variant = 'default',
  showPrice = true,
  showActions = false,
}: HoverPreviewCardProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  const [isHovered, setIsHovered] = React.useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !onHover) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100 - 50
    const y = ((e.clientY - rect.top) / rect.height) * 100 - 50
    onHover(e)
  }

  return (
    <motion.div
      ref={containerRef}
      className="relative overflow-hidden rounded-xl bg-card border-border/30 shadow-sm hover:shadow-lg transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants.container}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {/* Background gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isHovered ? { opacity: 0.1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Image preview container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <motion.img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
          initial={{ scale: 1.2, rotateX: 5 }}
          animate={{
            scale: isHovered ? [1.3, 1.4] : 1.2,
            rotateX: 0,
            transition: { duration: 0.6, ease: 'easeOut' }
          }}
          whileTap={{ scale: 0.98 }}
        />

        {/* Parallax effect layer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent"
          initial={{ y: 0 }}
          animate={isHovered ? { y: -30 } : { y: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* Variant badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {variant === 'featured' && (
            <Badge variant="secondary" className="bg-primary/80 backdrop-blur-sm text-primary-foreground shadow-sm">
              Featured
            </Badge>
          )}
          {variant === 'sale' && (
            <Badge variant="destructive" className="bg-destructive/80 backdrop-blur-sm text-destructive-foreground shadow-sm">
              Sale
            </Badge>
          )}
        </div>

        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent"
          initial={{ opacity: 0 }}
          animate={isHovered ? { opacity: 0.3 } : { opacity: 0 }}
          transition={{ duration: 0.4, repeat: Infinity, repeatType: 'reverse' }}
        />

        {/* Image overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      </div>

      {/* Content section */}
      <CardContent className="p-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
            {title}
          </h3>

          {description && (
            <p className="text-sm text-muted-foreground/80 mb-3 line-clamp-2">
              {description}
            </p>
          )}

          {showPrice && price && (
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-xl font-bold text-primary">{price}</span>
            </div>
          )}

          {/* Action buttons */}
          {showActions && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex gap-2"
            >
              <Button size="sm" variant="secondary">
                View Details
              </Button>
              {price && (
                <Button size="sm">
                  Add to Cart
                </Button>
              )}
            </motion.div>
          )}

          {!showActions && showPrice && price && (
            <div className="flex justify-end mt-4">
              <Button size="sm" variant="outline">
                Quick View
              </Button>
            </div>
          )}
        </motion.div>
      </CardContent>

      {/* Bottom gradient fade */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"
        initial={{ opacity: 0 }}
        animate={isHovered ? { opacity: 1 } : { opacity: 0.8 }}
        transition={{ duration: 0.3 }}
      />

      {/* Subtle border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        initial={{ boxShadow: 'none' }}
        animate={isHovered ? { boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.25)' } : {}}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </motion.div>
  )
}

// Enhanced variant with advanced motion effects
export function HoverPreviewCardAdvanced({
  image,
  title,
  description,
  price,
  onHover,
  onClick,
  variant = 'default',
  showPrice = true,
  showActions = false,
}: HoverPreviewCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl bg-card border-border/30 shadow-sm hover:shadow-lg transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {/* Image container with advanced effects */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <motion.img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
          initial={{ scale: 1.2, rotateX: 5 }}
          animate={{
            scale: isHovered ? [1.3, 1.4, 1.3] : 1.2,
            rotateX: 0,
            transition: { duration: 0.8, ease: 'easeInOut' }
          }}
        />

        {/* Dynamic gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-background"
          initial={{ opacity: 0 }}
          animate={isHovered ? { opacity: 0.2 } : { opacity: 0 }}
          transition={{ duration: 0.4, repeat: Infinity, repeatType: 'reverse' }}
        />

        {/* Parallax layer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent"
          initial={{ y: 0 }}
          animate={isHovered ? { y: -40 } : { y: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />

        {/* Variant badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {variant === 'featured' && (
            <Badge variant="secondary" className="bg-primary/80 backdrop-blur-sm text-primary-foreground shadow-sm">
              Featured
            </Badge>
          )}
        </div>

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <CardContent className="p-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
            {title}
          </h3>

          {description && (
            <p className="text-sm text-muted-foreground/80 mb-3 line-clamp-2">
              {description}
            </p>
          )}

          {showPrice && price && (
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-xl font-bold text-primary">{price}</span>
            </div>
          )}

          {showActions && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex gap-2"
            >
              <Button size="sm" variant="secondary">
                View Details
              </Button>
              {price && (
                <Button size="sm">
                  Add to Cart
                </Button>
              )}
            </motion.div>
          )}

          {!showActions && showPrice && price && (
            <div className="flex justify-end mt-4">
              <Button size="sm" variant="outline">
                Quick View
              </Button>
            </div>
          )}
        </motion.div>
      </CardContent>

      {/* Bottom gradient fade */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"
        initial={{ opacity: 0 }}
        animate={isHovered ? { opacity: 1 } : { opacity: 0.8 }}
        transition={{ duration: 0.3 }}
      />

      {/* Subtle border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        initial={{ boxShadow: 'none' }}
        animate={isHovered ? { boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.25)' } : {}}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </motion.div>
  )
}

// Hook for managing hover state with reduced motion support
export function useHoverState() {
  const [isHovered, setIsHovered] = React.useState(false)

  return {
    isHovered,
    setIsHovered,
    useReducedMotion: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  }
}
