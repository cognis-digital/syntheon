'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface CardStackProps {
  items: Array<{
    title: string
    description?: string
    badge?: 'new' | 'hot' | 'featured' | undefined
    image?: string
    link?: string
    delay?: number
  }>
  className?: string
  hoverEffect?: 'lift' | 'parallax' | 'none'
  staggerDelay?: number
}

interface CardItemProps {
  item: CardStackProps['items'][0]
  index: number
  total: number
  isHovered: boolean
}

function CardItem({ item, index, total, isHovered }: CardItemProps) {
  const offset = (total - index - 1) * 24 // spacing between cards
  
  return (
    <motion.div
      className="absolute inset-0"
      style={{ transform: `translateY(${offset}px)` }}
      initial={false}
      animate={isHovered ? { y: -8, scale: 1.02 } : {}}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Card className="relative h-full w-full overflow-hidden border-border bg-background shadow-sm hover:shadow-lg transition-shadow">
        {item.image && (
          <div 
            className="absolute inset-0 z-0"
            style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        )}
        
        {!item.image && (
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/80 via-background/50 to-transparent" />
        )}

        <CardHeader className="relative z-10 pb-4">
          {item.badge && (
            <Badge 
              variant={item.badge === 'new' ? 'default' : item.badge === 'hot' ? 'destructive' : 'secondary'}
              className="mb-2"
            >
              {item.badge}
            </Badge>
          )}
          
          <CardTitle className="text-primary font-semibold tracking-tight">
            {item.title}
          </CardTitle>
          
          {item.description && (
            <CardDescription className="text-muted-foreground/80">
              {item.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="relative z-10 pt-4 pb-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{new Date().toLocaleDateString()}</span>
            {item.link && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 text-primary hover:text-primary/90"
              >
                View Details →
              </Button>
            )}
          </div>
        </CardContent>

        <CardFooter className="relative z-10 pt-2">
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 via-primary/50 to-transparent"
            initial={{ scaleX: 0 }}
            animate={isHovered ? { scaleX: 1 } : {}}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default function CardStack({ 
  items = [], 
  className, 
  hoverEffect = 'lift', 
  staggerDelay = 0.15 
}: CardStackProps) {
  const reducedMotion = useReducedMotion()
  
  return (
    <div 
      className={cn(
        "relative w-full max-w-2xl mx-auto",
        hoverEffect === 'none' ? 'py-8' : 'py-16',
        className
      )}
      style={{ perspective: '1000px' }}
    >
      <motion.div 
        className="relative w-full h-[420px]"
        initial={false}
        animate={reducedMotion ? { scale: 1 } : { scale: [1, 1.05, 1] }}
        transition={{ duration: hoverEffect === 'none' ? 0 : 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {items.map((item, index) => (
          <CardItem 
            key={index}
            item={item}
            index={index}
            total={items.length}
            isHovered={hoverEffect !== 'none' && items.some(i => i.link)}
          />
        ))}

        {items.length === 0 && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center text-muted-foreground/50">
              <p className="text-sm">No items in stack</p>
            </div>
          </motion.div>
        )}

        {hoverEffect !== 'none' && (
          <motion.div 
            className="absolute -inset-4 border border-primary/10 rounded-full opacity-25"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.div>

      <motion.div 
        className="absolute -bottom-8 left-0 right-0 flex justify-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: items.length > 0 ? 1 : 0, y: 0 }}
        transition={{ delay: staggerDelay * 2, duration: 0.5 }}
      >
        <div className="flex gap-3">
          {items.slice(0, 2).map((item, i) => (
            <Badge 
              key={i} 
              variant={item.badge === 'new' ? 'default' : item.badge === 'hot' ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {item.badge || 'Item'}
            </Badge>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
