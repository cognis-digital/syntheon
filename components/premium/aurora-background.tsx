"use client"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
  gradientSize?: "small" | "medium" | "large"
  gradientPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"
  intensity?: "subtle" | "moderate" | "intense"
}

export default function AuroraBackground({
  className,
  children,
  gradientSize = "medium",
  gradientPosition = "top-left",
  intensity = "moderate",
}: AuroraBackgroundProps) {
  const isReducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getGradientConfig = () => {
    const baseColors: Record<string, string[]> = {
      "top-left": ["#7c3aed", "#db2777", "#a855f7"],
      "top-right": ["#db2777", "#7c3aed", "#d946ef"],
      "bottom-left": ["#a855f7", "#ec4899", "#7c3aed"],
      "bottom-right": ["#ec4899", "#d946ef", "#db2777"],
      center: ["#7c3aed", "#ec4899", "#a855f7"],
    }

    const sizes: Record<string, number> = {
      small: 100,
      medium: 200,
      large: 300,
    }

    const intensities: Record<string, number> = {
      subtle: 40,
      moderate: 60,
      intense: 80,
    }

    return {
      colors: baseColors[gradientPosition],
      size: sizes[gradientSize],
      intensity: intensities[intensity],
    }
  }

  const config = getGradientConfig()

  if (!mounted) {
    return <div className={cn("relative min-h-screen", className)}>{children}</div>
  }

  const getPositionStyle = () => {
    switch (gradientPosition) {
      case "top-left":
        return { top: "-20%", left: "-10%" }
      case "top-right":
        return { top: "-20%", right: "-10%" }
      case "bottom-left":
        return { bottom: "-20%", left: "-10%" }
      case "bottom-right":
        return { bottom: "-20%", right: "-10%" }
      default:
        return { top: "-30%", left: "-30%" }
    }
  }

  const getPositionStyle2 = () => {
    switch (gradientPosition) {
      case "top-left":
        return { top: "10%", right: "-10%" }
      case "top-right":
        return { top: "10%", left: "-10%" }
      case "bottom-left":
        return { bottom: "10%", right: "-10%" }
      case "bottom-right":
        return { bottom: "10%", left: "-10%" }
      default:
        return { top: "30%", right: "30%" }
    }
  }

  const animationDuration = isReducedMotion ? 20 : 45

  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      {/* First gradient blob */}
      <motion.div
        className="absolute -inset-1 opacity-60 blur-[100px]"
        animate={{
          x: [0, 300, -300, 0],
          y: [0, -200, 200, 0],
          rotate: [0, 90, -90, 0],
        }}
        transition={{
          duration: animationDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 5,
        }}
        style={getPositionStyle()}
      >
        <div
          className="absolute inset-0 rounded-full opacity-70"
          style={{
            background: `conic-gradient(
              from var(--tw-gradient-stops),
              ${config.colors.join(", ")}
            )`,
            filter: `blur(${config.size * 2}px)`,
            transform: `scale(${1 + config.intensity / 30})`,
          }}
        />
      </motion.div>

      {/* Second gradient blob */}
      <motion.div
        className="absolute -inset-1 opacity-40 blur-[80px]"
        animate={{
          x: [0, -250, 250, 0],
          y: [0, 150, -150, 0],
          rotate: [0, -60, 60, 0],
        }}
        transition={{
          duration: animationDuration * 1.3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 8,
        }}
        style={getPositionStyle2()}
      >
        <div
          className="absolute inset-0 rounded-full opacity-60"
          style={{
            background: `conic-gradient(
              from var(--tw-gradient-stops),
              ${config.colors.map((c, i) => c === config.colors[0] ? config.colors[i + 1] : c).join(", ")}
            )`,
            filter: `blur(${config.size * 1.5}px)`,
            transform: `scale(${1 + config.intensity / 40})`,
          }}
        />
      </motion.div>

      {/* Third gradient blob - subtle counter movement */}
      <motion.div
        className="absolute -inset-1 opacity-30 blur-[60px]"
        animate={{
          x: [0, 200, -200, 0],
          y: [0, -150, 150, 0],
        }}
        transition={{
          duration: animationDuration * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 3,
        }}
        style={getPositionStyle()}
      >
        <div
          className="absolute inset-0 rounded-full opacity-50"
          style={{
            background: `conic-gradient(
              from var(--tw-gradient-stops),
              ${config.colors.map((c, i) => config.colors[(i + 2) % 3]).join(", ")}
            )`,
            filter: `blur(${config.size}px)`,
          }}
        />
      </motion.div>

      {/* Content layer */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  )
}
