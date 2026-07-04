"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export interface AnimatedGradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Primary gradient color (default: violet-500) */
  primaryColor?: string;
  /** Secondary gradient color (default: violet-300) */
  secondaryColor?: string;
  /** Tertiary accent color for multi-color gradients (optional) */
  tertiaryColor?: string;
  /** Animation duration in milliseconds (default: 4000) */
  animationDuration?: number;
  /** Gradient direction: 'horizontal' | 'vertical' | 'diagonal' (default: horizontal) */
  gradientDirection?: "horizontal" | "vertical" | "diagonal";
  /** Background color behind text for depth effect (default: transparent) */
  backgroundColor?: string;
  /** Blur amount for background glow (default: 0, max: 24) */
  blurAmount?: number;
  /** Whether to animate the gradient continuously (default: true) */
  continuousAnimation?: boolean;
  /** Custom className overrides */
  className?: string;
}

export const AnimatedGradientText = React.forwardRef<HTMLSpanElement, AnimatedGradientTextProps>(
  ({
    children,
    primaryColor = "hsl(265, 70%, 50%)",
    secondaryColor = "hsl(265, 80%, 70%)",
    tertiaryColor,
    animationDuration = 4000,
    gradientDirection = "horizontal",
    backgroundColor = "transparent",
    blurAmount = 0,
    continuousAnimation = true,
    className,
    ...props
  }, ref) => {
    const isReducedMotion = useReducedMotion();

    // Generate gradient stops based on direction and colors
    const getGradientStops = () => {
      if (gradientDirection === "horizontal") {
        return [primaryColor, secondaryColor].concat(tertiaryColor ? [tertiaryColor] : []).join(", ");
      } else if (gradientDirection === "vertical") {
        // For vertical, we'll use a different approach with inline styles
        return `${primaryColor}, ${secondaryColor}`;
      } else {
        // Diagonal - similar to horizontal but rotated in transform
        return [primaryColor, secondaryColor].concat(tertiaryColor ? [tertiaryColor] : []).join(", ");
      }
    };

    const gradientStops = getGradientStops();

    // Calculate background blur for glow effect
    const effectiveBlur = isReducedMotion || !continuousAnimation ? 0 : blurAmount;

    return (
      <motion.span
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center font-semibold tracking-tight",
          backgroundColor !== "transparent" && `bg-gradient-to-r from-${primaryColor.replace("#", "")} to-${secondaryColor.replace("#", "")}`,
          className
        )}
        style={{
          background: continuousAnimation ? `linear-gradient(90deg, ${gradientStops})` : gradientStops,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: backgroundColor === "transparent" ? undefined : "#ffffff",
          filter: effectiveBlur > 0 ? `blur(${effectiveBlur}px)` : "none",
        }}
        initial={{ opacity: 0, y: -12 }}
        animate={{
          opacity: 1,
          y: 0,
          backgroundPositionX: continuousAnimation && !isReducedMotion ? ["0%", "100%"] : "0%",
        }}
        transition={{
          duration: animationDuration / 1000,
          ease: [0.25, 0.46, 0.45, 0.94],
          repeat: continuousAnimation ? Infinity : 0,
          delay: 0.1,
        }}
        whileHover={{ scale: 1.02, filter: effectiveBlur > 0 ? `blur(${effectiveBlur + 4}px)` : "none" }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.span>
    );
  }
);

AnimatedGradientText.displayName = "AnimatedGradientText";
