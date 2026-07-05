"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

export interface ScrollVelocityTextProps {
  children: string | ReactNode;
  className?: string;
  baseColor?: "violet" | "primary" | "foreground";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  mode?: "idle" | "scrolling" | "fast-scrolling";
  intensity?: 0.5 | 1 | 1.5;
  duration?: number;
  threshold?: {
    idle: number;
    scrolling: number;
    fastScrolling: number;
  };
  hoverEffect?: boolean;
  cursorStyle?: "default" | "pointer" | "text";
}

export default function ScrollVelocityText({
  children,
  className,
  baseColor = "violet",
  size = "md",
  mode: initialMode = "idle",
  intensity = 1,
  duration = 300,
  threshold = { idle: 0.5, scrolling: 2, fastScrolling: 5 },
  hoverEffect = false,
  cursorStyle = "default",
}: ScrollVelocityTextProps) {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [velocity, setVelocity] = useState(0);
  const [mode, setMode] = useState<"idle" | "scrolling" | "fast-scrolling">(initialMode);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    let raf: number;
    let lastY = 0;
    let lastTime = performance.now();

    const updateVelocity = () => {
      const now = performance.now();
      const delta = Math.abs(lastY - scrollY);
      const timeDelta = (now - lastTime) / 16.67; // Normalize to ~60fps

      if (timeDelta > 0 && delta > 0) {
        setVelocity(delta / timeDelta);
      }

      lastY = scrollY;
      lastTime = now;
      raf = requestAnimationFrame(updateVelocity);
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    raf = requestAnimationFrame(updateVelocity);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [reducedMotion, scrollY]);

  useEffect(() => {
    if (velocity > threshold.fastScrolling) {
      setMode("fast-scrolling");
    } else if (velocity > threshold.idle) {
      setMode("scrolling");
    } else {
      setMode("idle");
    }
  }, [velocity, threshold]);

  const sizeClasses: Record<string, string> = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  };

  const colorClass = baseColor === "violet"
    ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
    : baseColor === "primary"
      ? "bg-primary-500/10 text-primary-400 border-primary-500/20"
      : "bg-background";

  const getTransform = (currentMode: string) => {
    const transforms: Record<string, number> = {
      idle: 0.98,
      scrolling: 1.02,
      fastScrolling: 1.05,
    };
    return transforms[currentMode];
  };

  const getScale = (currentMode: string) => {
    const scales: Record<string, number> = {
      idle: 1,
      scrolling: 1 + velocity * 0.02,
      fastScrolling: 1 + velocity * 0.05,
    };
    return Math.min(scales[currentMode], 1.3);
  };

  const getBlur = (currentMode: string) => {
    const blurs: Record<string, number> = {
      idle: 0,
      scrolling: velocity * 0.5,
      fastScrolling: Math.min(velocity * 2, 12),
    };
    return blurs[currentMode];
  };

  const getShadow = (currentMode: string) => {
    const shadows: Record<string, number> = {
      idle: 0,
      scrolling: velocity * 0.3,
      fastScrolling: Math.min(velocity * 1.5, 24),
    };
    return shadows[currentMode];
  };

  const getLetterSpacing = (currentMode: string) => {
    const spacings: Record<string, number> = {
      idle: 0,
      scrolling: velocity * 0.1,
      fastScrolling: Math.min(velocity * 0.3, 8),
    };
    return spacings[currentMode];
  };

  const getOpacity = (currentMode: string) => {
    const opacities: Record<string, number> = {
      idle: 1,
      scrolling: 1 - velocity * 0.05,
      fastScrolling: Math.max(0.3, 1 - velocity * 0.1),
    };
    return opacities[currentMode];
  };

  const getLetterOpacity = (currentMode: string) => {
    const letterOpacities: Record<string, number> = {
      idle: 1,
      scrolling: 1 - velocity * 0.03,
      fastScrolling: Math.max(0.4, 1 - velocity * 0.08),
    };
    return letterOpacities[currentMode];
  };

  const getHoverTransform = (hovered: boolean) => {
    if (!hoverEffect || reducedMotion) return 1;
    return hovered ? 1.05 : 1;
  };

  const getHoverScale = (hovered: boolean) => {
    if (!hoverEffect || reducedMotion) return 1;
    return hovered ? 1.08 : 1;
  };

  const getCursorStyle = () => {
    switch (cursorStyle) {
      case "pointer":
        return "cursor-pointer";
      case "text":
        return "cursor-text";
      default:
        return "";
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "relative inline-flex items-center justify-center transition-all duration-300",
        sizeClasses[size],
        colorClass,
        getCursorStyle(),
        className,
      )}
      style={{
        transform: `scale(${getTransform(mode)} * ${getHoverScale(false)})`,
        letterSpacing: `${getLetterSpacing(mode)}px`,
        filter: `blur(${getBlur(mode)}px) drop-shadow(0 2px 4px rgba(0,0,0,0.1))`,
        opacity: getOpacity(mode),
      }}
      animate={{
        scale: [1, getScale(mode), 1],
        letterSpacing: [0, `${getLetterSpacing(mode)}px`, 0],
        filter: [
          "blur(0px) drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
          `blur(${getBlur(mode)}px) drop-shadow(0 ${getShadow(mode)}px ${Math.min(velocity * 3, 48)}px rgba(0,0,0,0.15))`,
          "blur(0px) drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
        ],
      }}
      transition={{
        duration: reducedMotion ? 0 : Math.max(duration / 1000, 0.3),
        ease: "easeInOut",
        repeat: Infinity,
        times: [0, 0.5, 1],
      }}
      onMouseEnter={() => {
        if (hoverEffect && !reducedMotion) {
          // Could add hover-specific animations here
        }
      }}
      onMouseLeave={() => {
        if (hoverEffect && !reducedMotion) {
          // Reset hover state
        }
      }}
    >
      <motion.span
        className="relative inline-flex items-center justify-center"
        style={{
          display: "inline",
          whiteSpace: "nowrap",
        }}
      >
        {/* Letter-by-letter animation */}
        {typeof children === "string" ? (
          [...children].map((char, i) => (
            <motion.span
              key={i}
              className="relative inline-block mx-0.5"
              style={{
                opacity: getLetterOpacity(mode),
                transformOrigin: "center center",
              }}
              animate={{
                y: [0, -2 + Math.random() * 3, 0],
                rotate: [0, (Math.random() - 0.5) * 4, 0],
                scale: [1, 1 + Math.random() * 0.05, 1],
              }}
              transition={{
                duration: reducedMotion ? 0 : 2,
                delay: i * 0.03,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))
        ) : (
          children
        )}
      </motion.span>

      {/* Background glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-30 pointer-events-none"
        style={{
          background: baseColor === "violet"
            ? `radial-gradient(circle at 50% 50%, rgba(139, 92, 246, ${Math.min(velocity / 10, 0.8)}) 0%, transparent 70%)`
            : baseColor === "primary"
              ? `radial-gradient(circle at 50% 50%, rgba(var(--primary-foreground), ${Math.min(velocity / 20, 0.6)}) 0%, transparent 70%)`
              : `radial-gradient(circle at 50% 50%, rgba(148, 163, 184, ${Math.min(velocity / 30, 0.5)}) 0%, transparent 70%)`,
        }}
      />

      {/* Subtle border highlight */}
      <div
        className="absolute inset-0 rounded-full opacity-20 pointer-events-none"
        style={{
          background: `linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, ${Math.min(velocity / 80, 0.4)}) 50%, transparent 70%)`,
          transform: "rotate(45deg)",
        }}
      />

      {/* Velocity indicator dot */}
      <div
        className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full"
        style={{
          background: baseColor === "violet" ? "#a78bfa" : baseColor === "primary" ? "var(--primary)" : "#94a3b8",
          opacity: Math.min(velocity / 5, 1),
          boxShadow: `0 0 ${Math.min(velocity * 2, 16)}px currentColor`,
        }}
      />
    </motion.div>
  );
}
