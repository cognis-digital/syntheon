'use client'

import { useEffect, useRef, useState, useReducedMotion } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface CursorProps {
  size?: number | string
  trailLength?: number
  blurAmount?: number
  hoverScale?: number
  color?: string
}

const DEFAULTS: Required<CursorProps> = {
  size: '16px',
  trailLength: 20,
  blurAmount: 8,
  hoverScale: 1.5,
  color: 'hsl(270, 80%, 60%)',
}

export default function CustomCursor({
  size = DEFAULTS.size,
  trailLength = DEFAULTS.trailLength,
  blurAmount = DEFAULTS.blurAmount,
  hoverScale = DEFAULTS.hoverScale,
  color = DEFAULTS.color,
}: CursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (!cursorRef.current || useReducedMotion()) return

    let animationFrameId: number
    let lastX = window.innerWidth / 2
    let lastY = window.innerHeight / 2

    const updateCursor = () => {
      const x = Math.round(lastX)
      const y = Math.round(lastY)

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      }

      setPos({ x, y })
      animationFrameId = requestAnimationFrame(updateCursor)
    }

    const handleMove = () => {
      lastX = window.innerWidth / 2
      lastY = window.innerHeight / 2
    }

    cursorRef.current.addEventListener('mousemove', handleMove)

    return () => {
      cursorRef.current?.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [useReducedMotion])

  useEffect(() => {
    if (!cursorRef.current || useReducedMotion()) return

    const updateSize = (scale: number) => {
      cursorRef.current.style.transform += ` scale(${scale})`
    }

    const handleHoverEnter = () => {
      setIsHovering(true)
      updateSize(hoverScale)
    }

    const handleHoverLeave = () => {
      setIsHovering(false)
      updateSize(1)
    }

    cursorRef.current.addEventListener('mouseenter', handleHoverEnter)
    cursorRef.current.addEventListener('mouseleave', handleHoverLeave)

    return () => {
      cursorRef.current?.removeEventListener('mouseenter', handleHoverEnter)
      cursorRef.current?.removeEventListener('mouseleave', handleHoverLeave)
    }
  }, [hoverScale, useReducedMotion])

  const getCursorStyle = () => ({
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: color,
    pointerEvents: 'none',
    mixBlendMode: 'multiply' as CSSMixBlendMode,
    boxShadow: `0 ${blurAmount}px 40px rgba(139, 92, 246, 0.4)`,
    zIndex: 9999,
    willChange: 'transform',
    transform: isHovering ? `scale(${hoverScale})` : 'scale(1)',
  })

  return (
    <AnimatePresence>
      {!useReducedMotion() && (
        <>
          {/* Main cursor */}
          <motion.div
            ref={cursorRef}
            initial={{ x: -100, y: -100 }}
            animate={{ x: pos.x, y: pos.y }}
            style={getCursorStyle()}
            className="fixed top-0 left-0"
          />

          {/* Trail effect */}
          {trailLength > 1 && (
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-[9998]">
              {[...Array(trailLength - 1)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: pos.x, y: pos.y }}
                  animate={{ x: pos.x - (i + 1) * 20, y: pos.y - (i + 1) * 20 }}
                  transition={{ duration: 0.3, ease: 'linear' }}
                  style={{
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    backgroundColor: color,
                    opacity: 1 - i / trailLength,
                    pointerEvents: 'none',
                    mixBlendMode: 'multiply',
                    boxShadow: `0 ${blurAmount * 2}px 60px rgba(139, 92, 246, 0.2)`,
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}
