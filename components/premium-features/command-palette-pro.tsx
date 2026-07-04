'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Command as CommandPrimitive, CommandInput, CommandList, CommandGroup, CommandItem, CommandSeparator } from '@/components/ui/command'

export interface CommandItemData {
  label: string
  value?: string
  icon?: React.ReactNode
  category?: string
  subcategory?: string
  description?: string
  disabled?: boolean
}

interface CommandPaletteProProps {
  items: CommandItemData[]
  placeholder?: string
  onCommandSelect?: (value: string | undefined) => void
  openOnFocus?: boolean
  keyboardShortcut?: string
  className?: string
  style?: React.CSSProperties
}

export interface CommandPaletteProRef {
  inputRef: React.RefObject<HTMLInputElement>
  containerRef: React.RefObject<HTMLDivElement>
}

interface CommandPaletteProState {
  query: string
  selectedIndex: number
  isOpen: boolean
  selectedCategory: string | null
  filteredResults: CommandItemData[]
  categories: string[]
}

const DEFAULT_PLACEHOLDER = 'Search commands...'
const SHORTCUT_KEY = 'Cmd' as const

export function useCommandPaletteState(
  items: CommandItemData[],
  query: string,
  selectedCategory: string | null
): { filteredResults: CommandItemData[]; categories: string[] } {
  const [categories, setCategories] = useState<string[]>([])
  
  useEffect(() => {
    const catSet = new Set(items.map(item => item.category || 'Other'))
    const sorted = Array.from(catSet).sort()
    setCategories(sorted)
  }, [items])

  const filteredResults = items.filter(item => {
    if (!query) return true
    
    const queryLower = query.toLowerCase().trim()
    
    // Match label, description, or value
    const textMatch = 
      item.label?.toLowerCase().includes(queryLower) ||
      (item.description && item.description.toLowerCase().includes(queryLower)) ||
      (item.value && item.value.toLowerCase().includes(queryLower))
    
    // Category filter
    if (!textMatch) {
      return selectedCategory ? item.category === selectedCategory : true
    }

    return textMatch
  })

  return { filteredResults, categories }
}

const ANIMATION_VARIANTS = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 25 }
  },
  exit: { opacity: 0, scale: 0.98, y: -5, transition: { duration: 0.15 } }
}

const ITEM_HOVER_VARIANTS = {
  initial: { background: 'transparent', color: 'hsl(var(--text-muted-foreground))' },
  hover: { 
    background: 'hsl(var(--background)/0.9)', 
    color: 'hsl(var(--text-primary))',
    transition: { duration: 0.1 }
  },
  selected: { 
    background: 'hsl(var(--primary)/0.25)', 
    color: 'hsl(var(--text-primary-foreground))'
  }
}

const KEYBOARD_SHORTCUT = `${SHORTCUT_KEY}+K`

export function CommandPalettePro(
  props: CommandPaletteProProps & React.RefAttributes<CommandPaletteProRef>
): JSX.Element {
  const { items, placeholder = DEFAULT_PLACEHOLDER, onCommandSelect, openOnFocus, keyboardShortcut = KEYBOARD_SHORTCUT, className, style } = props
  
  const [state, setState] = useState<CommandPaletteProState>({
    query: '',
    selectedIndex: -1,
    isOpen: false,
    selectedCategory: null,
    filteredResults: [],
    categories: []
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const commandInputRef = useRef<React.RefObject<HTMLInputElement>>(inputRef)

  useEffect(() => {
    if (openOnFocus && !state.isOpen && document.activeElement === inputRef.current) {
      setState(prev => ({ ...prev, isOpen: true }))
    }
  }, [openOnFocus, state.isOpen])

  const filteredResults = useCommandPaletteState(items, state.query, state.selectedCategory)

  useEffect(() => {
    if (state.filteredResults.length > 0 && state.selectedIndex === -1) {
      setState(prev => ({ ...prev, selectedIndex: 0 }))
    }
  }, [state.filteredResults])

  const handleSelect = useCallback((item: CommandItemData | undefined) => {
    if (!item || item.disabled) return
    
    onCommandSelect?.(item.value ?? item.label)
    
    setState(prev => ({ ...prev, selectedIndex: -1, query: '' }))
    inputRef.current?.focus()
  }, [onCommandSelect])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!state.isOpen || state.filteredResults.length === 0) return
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setState(prev => ({ ...prev, selectedIndex: Math.min(prev.selectedIndex + 1, prev.filteredResults.length - 1) }))
        break
      
      case 'ArrowUp':
        e.preventDefault()
        setState(prev => ({ 
          ...prev, 
          selectedIndex: Math.max(0, prev.selectedIndex - 1) 
        }))
        break
      
      case 'Enter':
        if (state.selectedIndex >= 0 && !state.filteredResults[state.selectedIndex].disabled) {
          handleSelect(state.filteredResults[state.selectedIndex])
        } else if (!state.query) {
          // Pressed Enter with empty query - close
          setState(prev => ({ ...prev, isOpen: false }))
        }
        break
      
      case 'Escape':
        e.preventDefault()
        setState(prev => ({ ...prev, selectedIndex: -1, isOpen: false }))
        inputRef.current?.focus()
        break
      
      case 'Tab':
        if (state.selectedIndex >= 0) {
          handleSelect(state.filteredResults[state.selectedIndex])
        } else if (!state.query) {
          setState(prev => ({ ...prev, isOpen: false }))
        }
        e.preventDefault()
        break
      
      default:
        // Allow typing to search
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const char = e.key.toLowerCase()
          setState(prev => ({ ...prev, query: prev.query + char }))
        }
    }
  }, [state.isOpen, state.filteredResults, state.selectedIndex, handleSelect])

  useEffect(() => {
    if (state.isOpen && containerRef.current) {
      containerRef.current.focus()
    }
  }, [state.isOpen])

  const handleContainerKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setState(prev => ({ ...prev, selectedIndex: Math.min(prev.selectedIndex + 1, prev.filteredResults.length - 1) }))
        break
      
      case 'ArrowUp':
        e.preventDefault()
        setState(prev => ({ 
          ...prev, 
          selectedIndex: Math.max(0, prev.selectedIndex - 1) 
        }))
        break
      
      case 'Enter':
        if (state.selectedIndex >= 0 && !state.filteredResults[state.selectedIndex].disabled) {
          handleSelect(state.filteredResults[state.selectedIndex])
        } else if (!state.query) {
          setState(prev => ({ ...prev, isOpen: false }))
        }
        break
      
      case 'Escape':
        e.preventDefault()
        setState(prev => ({ ...prev, selectedIndex: -1, isOpen: false }))
        inputRef.current?.focus()
        break
      
      case 'Tab':
        if (state.selectedIndex >= 0) {
          handleSelect(state.filteredResults[state.selectedIndex])
        } else if (!state.query) {
          setState(prev => ({ ...prev, isOpen: false }))
        }
        e.preventDefault()
        break
      
      default:
        // Allow typing to search
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const char = e.key.toLowerCase()
          setState(prev => ({ ...prev, query: prev.query + char }))
        }
    }
  }, [state.isOpen, state.filteredResults, state.selectedIndex, handleSelect])

  useEffect(() => {
    if (openOnFocus && document.activeElement === inputRef.current) {
      setState(prev => ({ ...prev, isOpen: true }))
    }
  }, [openOnFocus])

  const getSelectedCategory = (): string | null => {
    if (!state.filteredResults.length || state.selectedIndex < 0) return null
    
    const item = state.filteredResults[state.selectedIndex]
    return item.category ?? 'Other'
  }

  const handleCategorySelect = (category: string): void => {
    setState(prev => ({ ...prev, selectedCategory: category }))
    
    // Scroll to the first item in this category
    if (state.filteredResults.length > 0) {
      const firstInCategory = state.filteredResults.findIndex(
        i => i.category === category || (!i.category && !category)
      )
      
      if (firstInCategory >= 0) {
        setState(prev => ({ ...prev, selectedIndex: Math.min(firstInCategory, prev.selectedIndex + 1) }))
      }
    }

    // Focus the input to continue searching within category
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleClearSearch = (): void => {
    setState(prev => ({ ...prev, query: '', selectedIndex: -1 }))
  }

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'relative z-50 w-[32rem] max-w-full',
        'bg-background/95 backdrop-blur-xl border border-border/60 rounded-xl shadow-lg',
        'shadow-primary/10 dark:shadow-primary/5',
        'transition-shadow duration-300 ease-out',
        className,
        style
      )}
      onKeyDown={handleContainerKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="command-palette-title"
      tabIndex={-1}
    >
      <div className="p-4 space-y-3">
        {/* Header with title and clear button */}
        <AnimatePresence initial={false}>
          {state.query && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <button
                onClick={handleClearSearch}
                type="button"
                className="p-1.5 rounded-md hover:bg-muted/80 transition-colors duration-200"
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search input */}
        <div className="relative">
          <CommandInput
            ref={inputRef}
            value={state.query}
            onChange={(e) => setState(prev => ({ ...prev, query: e.target.value }))}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            className="h-10 px-4 pr-12 bg-background text-foreground placeholder:text-muted-foreground rounded-md border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
          />
          
          {/* Clear button (always visible when typing) */}
          {state.query && (
            <button
              onClick={handleClearSearch}
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-muted/80 transition-colors duration-200 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>

        {/* Category filter tabs */}
        {state.categories.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent"
          >
            <button
              onClick={() => handleCategorySelect('')}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                state.selectedCategory === null 
                  ? 'bg-primary/10 text-primary border border-primary/30' 
                  : 'bg-background hover:bg-muted border border-border/40 text-muted-foreground hover:text-foreground'
              )}
            >
              All
            </button>

            {state.categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                  state.selectedCategory === category 
                    ? 'bg-primary/10 text-primary border border-primary/30' 
                    : 'bg-background hover:bg-muted border border-border/40 text-muted-foreground hover:text-foreground'
                )}
              >
                {category}
              </button>
            ))}
          </motion.div>
        )}

        {/* Results list */}
        <CommandList className="space-y-1">
          <AnimatePresence initial={false}>
            {state.filteredResults.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 text-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground opacity-50">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>
                  </svg>
                  <p className="text-sm text-muted-foreground">No results found</p>
                </div>
              </motion.div>
            ) : (
              state.filteredResults.map((item, index) => {
                const isSelected = index === state.selectedIndex
                
                return (
                  <CommandItem
                    key={`${item.value ?? item.label}-${index}`}
                    value={item.value ?? item.label}
                    disabled={item.disabled || !state.isOpen}
                    onSelect={() => handleSelect(item)}
                    className="relative h-10 px-3 flex items-center gap-2.5 rounded-md cursor-pointer group"
                  >
                    {/* Icon */}
                    {item.icon && (
                      <motion.span
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="shrink-0 text-primary/70"
                      >
                        {item.icon}
                      </motion.span>
                    )}

                    {/* Label */}
                    <span 
                      className={cn(
                        'flex-1 min-w-0',
                        isSelected ? 'text-primary-foreground' : 'text-foreground',
                        item.disabled && !isSelected ? 'opacity-50' : ''
                      )}
                    >
                      {item.label}
                    </span>

                    {/* Description (truncated) */}
                    {item.description && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isSelected ? 1 : 0.65 }}
                        className="text-xs text-muted-foreground truncate max-w-[28ch]"
                      >
                        {item.description}
                      </motion.span>
                    )}

                    {/* Selection indicator */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="absolute left-2 right-4 h-6 bg-primary/10 rounded-full"
                        />
                      )}
                    </AnimatePresence>

                    {/* Hover overlay */}
                    <motion.div
                      variants={ITEM_HOVER_VARIANTS}
                      initial="initial"
                      animate={isSelected ? 'selected' : 'hover'}
                      className="absolute inset-0 rounded-md pointer-events-none"
                    />
                  </CommandItem>
                )
              })
            )}

            {/* Category separator */}
            {state.filteredResults.length > 0 && (
              <CommandSeparator className="h-[1px] bg-border/40 mx-3 my-2" />
            )}
          </AnimatePresence>

          {/* Keyboard hint when no query and no results */}
          {state.filteredResults.length === 0 && !state.query && state.isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-3 text-center"
            >
              <p className="text-xs text-muted-foreground">
                Press{' '}
                <kbd className="px-2 py-0.5 bg-background border border-border/40 rounded-md font-mono text-primary">
                  {keyboardShortcut}
                </kbd>
                {' '}to open or press{' '}
                <kbd className="px-2 py-0.5 bg-background border border-border/40 rounded-md font-mono text-primary">
                  Esc
                </kbd>{' '}
                to close
              </p>
            </motion.div>
          )}
        </CommandList>

        {/* Footer with stats */}
        <AnimatePresence initial={false}>
          {state.filteredResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex items-center justify-between px-2 py-1.5 text-xs"
            >
              <span className="text-muted-foreground">
                {state.filteredResults.length} result{state.filteredResults.length !== 1 ? 's' : ''}
              </span>

              {/* Selected category indicator */}
              {(state.selectedCategory || state.query) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-muted-foreground"
                >
                  {state.selectedCategory ? `• ${state.selectedCategory}` : ''}
                </motion.span>
              )}

              {/* Quick actions */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setState(prev => ({ ...prev, selectedIndex: -1 }))}
                  disabled={state.selectedIndex === -1 || !state.isOpen}
                  className={cn(
                    'p-1 rounded hover:bg-muted/50 transition-colors',
                    state.selectedIndex !== -1 && state.isOpen ? '' : 'opacity-40'
                  )}
