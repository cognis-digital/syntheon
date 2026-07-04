'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, ChevronRight, Sparkles, Zap, ShieldCheck, Globe, Layers, ArrowUpRight, Lock } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  checked: boolean;
}

interface FeatureChecklistProps {
  items: FeatureItem[];
  onToggle?: (id: string) => void;
  variant?: 'default' | 'premium' | 'minimal';
  showDescriptions?: boolean;
  autoAnimate?: boolean;
}

const variants = {
  default: {
    shadow: 'shadow-lg',
    hoverShadow: 'shadow-xl',
    gradient: 'from-violet-500/20 to-purple-500/10',
    border: 'border-border/60',
    checkedBorder: 'border-primary/40 bg-primary/5',
  },
  premium: {
    shadow: 'shadow-2xl',
    hoverShadow: 'shadow-[0_20px_40px_-10px_rgba(139,92,246,0.25)]',
    gradient: 'from-violet-600/30 via-purple-500/20 to-fuchsia-500/10',
    border: 'border-border/70',
    checkedBorder: 'border-primary/60 bg-gradient-to-br from-primary/10 to-transparent',
  },
  minimal: {
    shadow: 'shadow-md',
    hoverShadow: 'shadow-lg',
    gradient: 'from-violet-400/20 to-purple-400/15',
    border: 'border-border/50',
    checkedBorder: 'border-primary/30 bg-muted/50',
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -90, opacity: 0 },
  visible: { 
    scale: 1, 
    rotate: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 400, damping: 25 }
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      staggerChildren: 80,
      delayChildren: i * 60,
    },
  }),
};

export function FeatureChecklist({ 
  items = [], 
  onToggle, 
  variant = 'default', 
  showDescriptions = true,
  autoAnimate = true,
}: FeatureChecklistProps) {
  const v = variants[variant] || variants.default;
  
  return (
    <motion.div
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className={cn(
        "relative overflow-hidden rounded-3xl bg-background border", 
        v.border,
        v.shadow
      )}>
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className={cn(
            "absolute -top-40 -right-40 w-80 h-80 rounded-full blur-[120px]", 
            v.gradient
          )} />
          <div className={cn(
            "absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-[150px]", 
            v.gradient
          )} />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className={cn(
              "w-5 h-5 text-primary",
              variant === 'premium' ? "animate-pulse" : ""
            )} />
            <h2 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Why Syntheon?
            </h2>
          </div>

          {/* Items */}
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "group relative p-6 rounded-xl border transition-all duration-300 cursor-pointer",
                  item.checked ? v.checkedBorder : `${v.border} hover:border-primary/40`,
                  variant === 'premium' && !item.checked && "hover:shadow-lg"
                )}
                whileHover={{ 
                  scale: 1.02,
                  y: -4,
                  transition: { duration: 0.3 }
                }}
                onClick={() => onToggle?.(item.id)}
              >
                {/* Checkmark animation */}
                <motion.div
                  className={cn(
                    "absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                    item.checked ? "bg-primary text-primary-foreground" : "bg-muted border-2 border-border group-hover:border-primary/40"
                  )}
                  animate={item.checked ? { 
                    scale: 1,
                    rotate: 360,
                    boxShadow: "0 4px 12px rgba(139, 92, 246, 0.4)"
                  } : {}}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </motion.div>

                {/* Icon */}
                <div className={cn(
                  "absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  item.checked ? "bg-primary text-primary-foreground" : "bg-muted border border-border group-hover:border-primary/40"
                )}>
                  <ChevronRight className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className={cn(
                  "ml-12 pr-8 transition-colors duration-300",
                  item.checked ? "text-muted-foreground/70" : ""
                )}>
                  <div className="flex items-center gap-4">
                    <item.icon 
                      className={cn(
                        "w-6 h-6 flex-shrink-0 transition-colors duration-300",
                        item.checked ? "text-muted-foreground/50" : "text-primary group-hover:text-primary"
                      )} 
                    />
                    <div>
                      <h3 className={cn(
                        "font-medium mb-1.5",
                        item.checked ? "text-muted-foreground" : "text-foreground"
                      )}>
                        {item.title}
                      </h3>
                      {showDescriptions && !item.checked && (
                        <p className="text-sm text-muted-foreground/70 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Progress bar for checked items */}
                  {item.checked && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="absolute left-6 right-4 bottom-4 h-1 bg-muted rounded-full overflow-hidden"
                    >
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                        className="h-full bg-primary/40 rounded-full"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Glow effect on checked */}
                {item.checked && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -inset-2 rounded-2xl border border-primary/20 pointer-events-none"
                  />
                )}
              </motion.div>
            ))}

            {/* Empty state */}
            {items.length === 0 && (
              <div className="text-center py-16">
                <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No features added yet.</p>
              </div>
            )}

            {/* All checked state */}
            {items.every(i => i.checked) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-4 right-4 py-3 bg-primary/95 text-primary-foreground rounded-full flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-medium">All features enabled</span>
                </div>
                <Sparkles className="w-4 h-4 animate-spin-slow" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer stats */}
          {items.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: items.length * 60 + 200, duration: 0.5 }}
              className="flex items-center justify-between pt-8 border-t border-border/30 mt-8"
            >
              <div className="text-sm text-muted-foreground">
                {items.filter(i => i.checked).length} of {items.length} features enabled
              </div>
              
              {/* Animated counter */}
              <motion.div 
                key={items.filter(i => i.checked).length.toString()}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2"
              >
                <div className="text-3xl font-bold text-primary">
                  {items.filter(i => i.checked).length}
                </div>
                <div className="text-sm text-muted-foreground">/ {items.length}</div>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Corner decorations */}
        <div className={cn(
          "absolute top-4 right-4 w-12 h-12 rounded-full border-2 transition-all duration-500",
          variant === 'premium' ? "border-primary/30" : "border-border/30 group-hover:border-primary/50"
        )} />
        <div className={cn(
          "absolute bottom-4 left-4 w-12 h-12 rounded-full border-2 transition-all duration-500",
          variant === 'premium' ? "border-primary/30" : "border-border/30 group-hover:border-primary/50"
        )} />
      </div>

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: items.length > 0 ? items.length * 60 + 300 : 0.5 }}
        className={cn(
          "absolute -bottom-4 left-8 right-8 py-2 px-4 rounded-full bg-background/90 backdrop-blur-sm border",
          v.border,
          variant === 'premium' && "shadow-lg"
        )}
      >
        <div className="flex items-center justify-between text-xs">
          <span className={cn(
            "font-medium flex items-center gap-1.5",
            variant === 'premium' ? "text-primary" : ""
          )}>
            {variant === 'premium' && (
              <ShieldCheck className="w-3 h-3" />
            )}
            Premium Features
          </span>
          
          {/* Progress ring */}
          <div className="flex items-center gap-2">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                variant === 'premium' ? "border-primary/40" : "border-border/30"
              )}
            >
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={cn(
                  "w-4 h-4 rounded-full bg-primary/30",
                  variant === 'premium' && "bg-gradient-to-br from-primary to-purple-500"
                )} 
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Default export for convenience
export default FeatureChecklist;
