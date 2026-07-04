'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { CheckCircle2, Circle, ChevronRight, Sparkles, ArrowUpRight, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OnboardingItem {
  id: string;
  title: string;
  description?: string;
  category: 'setup' | 'profile' | 'integration' | 'security' | 'other';
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  estimatedTime?: number; // in minutes
}

export interface OnboardingChecklistProps {
  items: OnboardingItem[];
  onCompleteAll?: (allCompleted: boolean) => void;
  onItemComplete?: (id: string, item: OnboardingItem) => void;
  onItemSelect?: (id: string, item: OnboardingItem) => void;
  showDetails?: boolean;
  compact?: boolean;
  accentColor?: 'violet' | 'blue' | 'purple';
}

interface CategoryConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

const categoryConfigs: Record<string, CategoryConfig> = {
  setup: { label: 'Setup', icon: Circle, color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)' },
  profile: { label: 'Profile', icon: Circle, color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)' },
  integration: { label: 'Integrations', icon: Circle, color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)' },
  security: { label: 'Security', icon: Circle, color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)' },
  other: { label: 'Other', icon: Circle, color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)' },
};

const priorityColors = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#8b5cf6',
};

interface ItemVariants {
  initial: { opacity: number; y: number; scale: number };
  animate: { opacity: number; y: number; scale: number };
  exit: { opacity: number; y: number; scale: number };
}

const itemVariants: ItemVariants = {
  initial: { opacity: 0, y: 24, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -24, scale: 0.95 },
};

const containerVariants = {
  initial: { opacity: 0, filter: 'blur(8px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
};

export function OnboardingChecklist({ 
  items, 
  onCompleteAll, 
  onItemComplete, 
  onItemSelect,
  showDetails = true,
  compact = false,
  accentColor = 'violet'
}: OnboardingChecklistProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const completedCount = items.filter(i => i.completed).length;
    const total = items.length || 1;
    setProgress((completedCount / total) * 100);
    
    if (onCompleteAll) {
      onCompleteAll(completedCount === total && total > 0);
    }
  }, [items, onCompleteAll]);

  const handleItemSelect = (id: string, item: OnboardingItem) => {
    setSelectedId(id);
    onItemSelect?.(id, item);
    
    // Reset selection after a brief delay if user clicks another item
    setTimeout(() => {
      if (!showDetails || compact) {
        setSelectedId(null);
      }
    }, 200);
  };

  const handleItemComplete = (e: React.MouseEvent, id: string, item: OnboardingItem) => {
    e.stopPropagation();
    
    const updatedItems = items.map(i => 
      i.id === id ? { ...i, completed: !item.completed } : i
    );
    
    setProgress((prev) => {
      const newCompletedCount = items.filter(i => i.completed).length + (!item.completed ? 1 : -1);
      return (newCompletedCount / updatedItems.length) * 100;
    });
    
    onItemComplete?.(id, item);
  };

  const getStaggerDelay = (index: number, total: number): number => {
    if (!compact && !showDetails) {
      return index * 50;
    }
    return 0;
  };

  const renderCategoryBadge = (category: string) => {
    const config = categoryConfigs[category] || categoryConfigs.other;
    return (
      <span 
        className={cn(
          'text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium',
          compact ? 'mr-3' : 'ml-auto mr-4',
          config.bgColor,
          'transition-colors duration-300'
        )}
      >
        <config.icon className={cn('w-3 h-3 inline-block mr-1', config.color)} />
        {config.label}
      </span>
    );
  };

  const renderProgressBar = () => (
    <motion.div 
      className="h-1.5 bg-muted/40 rounded-full overflow-hidden"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: progress / 100 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div 
        className="h-full bg-gradient-to-r from-violet-500 via-purple-400 to-fuchsia-300"
        style={{ 
          backgroundSize: '200% 100%',
          backgroundPosition: `calc(${progress}% - 50%) 0`
        }}
        animate={{ backgroundPosition: ['calc(0% - 50%) 0', `calc(${progress}% - 50%) 0`, 'calc(200% - 50%) 0'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );

  const renderItem = (item: OnboardingItem, index: number) => {
    const isSelected = selectedId === item.id;
    const isCompleted = item.completed;
    
    return (
      <motion.div
        key={item.id}
        variants={itemVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ 
          duration: 0.3,
          delay: getStaggerDelay(index, items.length),
          ease: [0.25, 1, 0.5, 1]
        }}
        className={cn(
          'group relative p-4 rounded-xl cursor-pointer transition-all duration-300',
          compact ? 'py-3 px-3' : 'py-4 px-5',
          isSelected 
            ? 'bg-gradient-to-br from-violet-50/50 to-purple-50/30 ring-2 ring-violet-400/30 shadow-lg shadow-violet-900/10' 
            : 'hover:bg-muted/20 hover:shadow-md',
          isCompleted && !isSelected ? 'bg-green-50/30 border border-green-200/20' : '',
          compact ? '' : 'border border-border/40'
        )}
        onClick={() => handleItemSelect(item.id, item)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button 
            onClick={(e) => handleItemComplete(e, item.id, item)}
            className={cn(
              'w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300',
              isCompleted ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 
                isSelected ? 'ring-2 ring-violet-400 bg-white/80' : 'hover:bg-muted/50',
              compact ? 'w-5 h-5' : ''
            )}
          >
            <CheckCircle2 className={cn(
              'w-3.5 h-3.5 text-white transition-all duration-300',
              isCompleted ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100'
            )} />
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {compact ? (
              <>
                <h3 className={cn(
                  'text-sm font-medium truncate',
                  isSelected ? 'text-violet-600' : 'text-muted-foreground'
                )}>
                  {item.title}
                </h3>
                {isCompleted && !isSelected && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-500/80">
                    <CheckCircle2 className="w-3 h-3" /> Completed
                  </span>
                )}
              </>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <h3 
                    className={cn(
                      'text-base font-semibold leading-tight',
                      isSelected ? 'text-violet-600' : 'text-muted-foreground/80 group-hover:text-foreground'
                    )}
                  >
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    {renderCategoryBadge(item.category)}
                    
                    {isCompleted && (
                      <span 
                        className={cn(
                          'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium',
                          compact ? 'mr-3' : 'ml-auto mr-4',
                          'bg-green-500/10 text-green-600 border border-green-200/20'
                        )}
                      >
                        <CheckCircle2 className="w-3 h-3" /> Done
                      </span>
                    )}

                    {item.estimatedTime && (
                      <span 
                        className={cn(
                          'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium',
                          compact ? 'mr-3' : 'ml-auto mr-4',
                          priorityColors[item.priority],
                          item.priority === 'high' && !isCompleted 
                            ? 'bg-red-500/10 text-red-600 border border-red-200/20 animate-pulse-slow' 
                            : ''
                        )}
                      >
                        <Info className="w-3 h-3" />
                        {item.estimatedTime} min
                      </span>
                    )}

                    {!isCompleted && (
                      <ChevronRight 
                        className={cn(
                          'w-4 h-4 text-muted-foreground/50 transition-transform duration-300',
                          compact ? '' : 'group-hover:translate-x-1 group-hover:text-violet-400'
                        )}
                      />
                    )}
                  </div>
                </div>

                {item.description && !compact && (
                  <p className="text-sm text-muted-foreground/60 mt-1.5 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {!isCompleted && item.estimatedTime && compact && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground/60 ml-auto">
                    <Info className="w-3 h-3" /> {item.estimatedTime} min
                  </span>
                )}
              </>
            )}

            {/* Selection indicator */}
            {!compact && isSelected && (
              <motion.div 
                className="absolute inset-0 rounded-xl ring-2 ring-violet-400/30 pointer-events-none"
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            )}

            {/* Completion glow effect */}
            {isCompleted && !isSelected && (
              <motion.div 
                className="absolute inset-0 rounded-xl border-2 border-green-400/20 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
            )}
          </div>

          {/* Hover decoration */}
          <AnimatePresence>
            {isSelected && !compact && (
              <motion.div 
                className="absolute -right-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg"
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: -36 }}
                exit={{ opacity: 0, x: 0 }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Compact selection indicator */}
        {compact && isSelected && (
          <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-3 h-3 text-white" />
          </span>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.4 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border',
        compact ? '' : 'border-border/50 bg-background/50 backdrop-blur-xl',
        accentColor === 'violet' && !compact ? 'shadow-2xl shadow-violet-900/10 ring-1 ring-violet-400/20' : '',
        compact ? 'p-3 space-y-2' : 'p-6 space-y-5'
      )}
    >
      {/* Header */}
      {!compact && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className={cn(
              'text-lg font-semibold tracking-tight',
              accentColor === 'violet' ? 'text-violet-600' : ''
            )}>
              Welcome Aboard
            </h2>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Complete these steps to get started with Syntheon
            </p>
          </div>

          {/* Progress */}
          <div className={cn(
            'flex items-center gap-3',
            compact ? '' : 'ml-auto'
          )}>
            {renderProgressBar()}
            
            <span 
              className={cn(
                'text-sm font-medium px-2.5 py-1 rounded-lg',
                accentColor === 'violet' ? 'bg-violet-500/10 text-violet-600' : '',
                compact ? '' : 'ml-auto'
              )}
            >
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      )}

      {/* Items */}
      <AnimatePresence initial={false}>
        {items.length === 0 ? (
          <motion.div 
            className={cn(
              'flex items-center justify-center py-12',
              compact ? '' : 'text-muted-foreground/50'
            )}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col items-center gap-2">
              <Circle className={cn(
                'w-6 h-6',
                accentColor === 'violet' ? 'text-violet-400/30' : ''
              )} />
              <span className="text-sm">No onboarding items configured</span>
            </div>
          </motion.div>
        ) : (
          <div className={cn(
            'flex flex-col gap-2',
            compact ? 'py-1' : ''
          )}>
            {items.map((item, index) => renderItem(item, index))}
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      {!compact && items.length > 0 && (
        <motion.div 
          className="flex items-center justify-between pt-4 border-t border-border/30"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span 
            className={cn(
              'text-sm text-muted-foreground/60',
              progress === 100 ? 'text-green-500/80' : ''
            )}
          >
            {progress === 100 ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> All complete!
              </span>
            ) : (
              'Keep going — you\'re making progress!'
            )}
          </span>

          {progress === 100 && (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium shadow-lg shadow-violet-500/30"
            >
              <Sparkles className="w-4 h-4" />
              Continue
            </motion.button>
          )}

          {progress < 100 && (
            <button 
              onClick={() => setSelectedId(null)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                compact ? '' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <ArrowUpRight className="w-4 h-4" />
              {compact ? '' : 'View all items'}
            </button>
          )}
        </motion.div>
      )}

      {/* Background gradient decoration */}
      {!compact && (
        <>
