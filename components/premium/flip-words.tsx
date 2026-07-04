"use client"

import { useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"
import { forwardRef, useRef, useEffect, useState, useCallback } from "react"

export interface FlipWordsProps extends ComponentProps<"div"> {
  words: string[]
  delay?: number
  interval?: number | false
  trigger?: "hover" | "click" | "auto"
  className?: string
}

function useFlipAnimation(
  words: string[],
  delay: number,
  interval: number | false,
  trigger: FlipWordsProps["trigger"],
) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const reducedMotion = useReducedMotion()
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (reducedMotion || !interval) return

    if (trigger === "auto") {
      timerRef.current = window.setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length)
      }, interval * 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [reducedMotion, interval, trigger, words.length])

  const nextIndex = reducedMotion || !interval ? currentIndex : (currentIndex + 1) % words.length

  return {
    current: nextIndex,
    isAuto: trigger === "auto",
  }
}

export default function FlipWords({
  words,
  delay = 0.25,
  interval = false,
  trigger = "hover",
  className,
  ...props
}: FlipWordsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { current: currentIndex } = useFlipAnimation(words, delay, interval, trigger)

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        if (!reducedMotion && !interval) setCurrentIndex(0)
      }}
      onClick={() => {
        if (!reducedMotion && !interval) setCurrentIndex((prev) => (prev + 1) % words.length)
      }}
      className={cn("relative inline-flex items-center justify-center", className)}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {words.map((word, index) => {
          const isActive = index === currentIndex
          return (
            <motion.span
              key={`${word}-${index}`}
              className={cn(
                "absolute text-3xl font-medium tracking-wide",
                isActive ? "opacity-100" : "opacity-0 scale-95 blur-[2px]",
              )}
              initial={{ opacity: 0, y: -10, x: index === 0 ? 0 : -10 }}
              animate={isActive ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: -5, x: -5 }}
              exit={{ opacity: 0, y: 5, x: 5 }}
              transition={{
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1],
                delay: isActive ? 0 : delay * index,
              }}
            >
              {word}
            </motion.span>
          )
        })}
      </AnimatePresence>

      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 transition-opacity hover:opacity-100">
        {trigger === "auto" ? "Auto-flip" : trigger}
      </div>
    </div>
  )
}

export { FlipWords }
