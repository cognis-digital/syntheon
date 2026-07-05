'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Command as CommandIcon, 
  X, 
  Search, 
  ChevronRight,
  Keyboard,
  Terminal
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  shortcut?: string[];
  icon?: React.ReactNode;
  category: string;
}

export interface CommandPaletteLauncherProps {
  items: CommandItem[];
  onCommandSelect: (id: string) => void;
  placeholder?: string;
  autoFocusOnOpen?: boolean;
  initialQuery?: string;
}

interface ExtendedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface CommandItemProps {
  item: CommandItem;
  onSelect: (id: string) => void;
  isActive: boolean;
  isHighlighted: boolean;
  index: number;
}

const DEFAULT_ITEMS: CommandItem[] = [
  { id: 'dashboard', title: 'Dashboard', description: 'View analytics overview', shortcut: ['Cmd+D'], category: 'Navigation' },
  { id: 'projects', title: 'Projects', description: 'Manage active projects', shortcut: ['Cmd+P'], category: 'Work' },
  { id: 'settings', title: 'Settings', description: 'Configure preferences', shortcut: ['Cmd+,'], category: 'System' },
];

function useKeyboardShortcut(
  combo: string[], 
  handler: () => void, 
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const metaKey = isMac ? e.metaKey : e.ctrlKey;
      
      if (metaKey && e.key === combo[0]) {
        handler();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [combo, handler, enabled]);
}

function ExtendedButton({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '', 
  ...props 
}: ExtendedButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-background text-foreground hover:bg-muted border border-border shadow-sm',
    ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground bg-transparent',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs rounded-md',
    md: 'h-10 px-4 py-2 text-sm rounded-md',
    lg: 'h-12 px-6 py-3 text-base rounded-lg',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function CommandItemComponent({ item, onSelect, isActive, isHighlighted, index }: CommandItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isHighlighted ? 1.02 : 1,
        x: isHovered ? 5 : 0,
      }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
        isActive 
          ? 'bg-primary/10 border border-primary/20 shadow-sm' 
          : isHighlighted
            ? 'bg-accent text-accent-foreground border border-accent/50'
            : 'hover:bg-muted hover:border-border/60'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        {item.icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.02, type: 'spring', stiffness: 400 }}
            className="shrink-0"
          >
            {item.icon}
          </motion.div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className={`font-medium truncate ${isActive ? 'text-primary' : ''}`}>
            {item.title}
          </div>
          {item.description && (
            <p className="text-xs text-muted-foreground/70 truncate">
              {item.description}
            </p>
          )}
        </div>

        {isActive && (
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-2 top-2"
          >
            <ChevronRight className="h-4 w-4 text-primary/70" />
          </motion.div>
        )}

        {item.shortcut && (
          <span className="text-xs text-muted-foreground/50 ml-auto">
            ⌘{item.shortcut[0].toUpperCase()}
          </span>
        )}
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-2 top-full mt-2 px-3 py-2 bg-background border border-border rounded-lg shadow-lg text-xs"
          >
            <span className="text-muted-foreground">Press </span>
            <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
              {item.shortcut?.join('+')}
            </kbd>
            <span className="text-muted-foreground ml-2">to execute</span>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => onSelect(item.id)}
        className="absolute inset-0 z-10"
        aria-label={`Select ${item.title}`}
      />
    </motion.div>
  );
}

function CommandPaletteLauncher({ 
  items = DEFAULT_ITEMS, 
  onCommandSelect, 
  placeholder = 'Search commands...',
  autoFocusOnOpen = false,
  initialQuery = '',
}: CommandPaletteLauncherProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredItems = items.filter(item => {
    if (!query) return true;
    const searchQuery = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchQuery) ||
      item.description?.toLowerCase().includes(searchQuery) ||
      item.category.toLowerCase().includes(searchQuery)
    );
  });

  const highlightedIndex = filteredItems.findIndex(item => 
    item.id === items[selectedIndex]?.id
  );

  useKeyboardShortcut(
    ['Escape'],
    () => {
      if (isOpen) setIsOpen(false);
    },
    isOpen
  );

  useKeyboardShortcut(
    ['Cmd+K', 'Ctrl+K'],
    () => {
      if (!isOpen && autoFocusOnOpen) {
        setIsOpen(true);
      } else if (isOpen) {
        setIsOpen(false);
      }
    },
    isOpen
  );

  useKeyboardShortcut(
    ['ArrowDown'],
    () => {
      setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
    },
    isOpen && !isAnimatingOut
  );

  useKeyboardShortcut(
    ['ArrowUp'],
    () => {
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    },
    isOpen && !isAnimatingOut
  );

  const handleSelect = useCallback((id: string) => {
    onCommandSelect(id);
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, [onCommandSelect]);

  const handleClose = () => {
    if (isAnimatingOut || !isOpen) return;
    
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsOpen(false);
      setSelectedIndex(0);
      setIsAnimatingOut(false);
    }, 150);
  };

  const getFilteredItems = () => filteredItems.slice(0, 6);

  return (
    <div 
      ref={containerRef}
      className="relative"
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
      aria-labelledby="command-palette-title"
    >
      {/* Trigger Button */}
      <ExtendedButton
        variant="default"
        size="lg"
        onClick={() => {
          if (isOpen) handleClose();
          else setIsOpen(true);
        }}
        className={`group relative overflow-hidden transition-all duration-200 ${
          isOpen 
            ? 'ring-2 ring-primary/50 shadow-lg scale-[1.02]' 
            : 'hover:scale-[1.01] hover:shadow-md'
        }`}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {isOpen ? (
              <X className="h-5 w-5 text-muted-foreground" />
            ) : (
              <>
                <CommandIcon className="h-4 w-4 mr-1 opacity-70 group-hover:opacity-100 transition-opacity" />
                <Search className="h-4 w-4 opacity-60 group-hover:opacity-80 transition-opacity" />
              </>
            )}
          </motion.div>

          <span className={`flex-1 text-left ${isOpen ? 'text-muted-foreground' : ''}`}>
            {isOpen ? (
              <span className="font-medium">Command Palette</span>
            ) : (
              <>
                <span className="font-medium">Quick Actions</span>
                <motion.span 
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="ml-2 text-xs text-muted-foreground"
                >
                  ⌘K to open
                </motion.span>
              </>
            )}
          </span>

          <kbd 
            className={`hidden sm:inline-flex items-center justify-center px-2 py-1 text-xs font-mono rounded border ${
              isOpen ? 'border-muted-foreground/30 bg-background' : 'bg-muted/50'
            }`}
          >
            ⌘K
          </kbd>

          <motion.div 
            animate={{ scale: isOpen ? 1.2 : 0 }}
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"
          />
        </div>
      </ExtendedButton>

      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          onClick={handleClose}
        />
      )}

      {/* Palette Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              x: isAnimatingOut ? -5 : 0,
            }}
            exit={{ 
              opacity: 0, 
              y: -20, 
              scale: 0.98,
              x: isAnimatingOut ? 5 : 0,
            }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 w-[min(90vw,36rem)] max-h-[calc(100vh-8rem)] overflow-hidden rounded-xl shadow-2xl border ${
              isAnimatingOut ? 'border-primary/50' : 'border-border'
            }`}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
              >
                <Terminal className="h-4 w-4 text-primary" />
              </motion.div>

              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filteredItems[highlightedIndex]) {
                    handleSelect(filteredItems[highlightedIndex].id);
                  }
                }}
                placeholder={placeholder}
                autoFocus
                autoComplete="off"
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground/50"
              />

              <div className="flex items-center gap-2">
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="p-1 rounded-md hover:bg-muted transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}

                <ExtendedButton 
                  variant={isOpen ? 'ghost' : 'default'}
                  size="sm"
                  onClick={handleClose}
                  className="gap-1.5"
                >
                  {isAnimatingOut ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  ) : (
                    <>
                      <span className="text-xs">Close</span>
                      <X className="h-3.5 w-3.5 opacity-60" />
                    </>
                  )}
                </ExtendedButton>
              </div>
            </div>

            {/* Results */}
            <div 
              className="overflow-y-auto p-2 space-y-1 max-h-[calc(100%-4rem)]"
              style={{ scrollBehavior: 'smooth' }}
            >
              {filteredItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-muted-foreground"
                >
                  <Search className="h-8 w-8 mb-3 opacity-40" />
                  <p className="text-sm">No commands found</p>
                  <p className="text-xs mt-1 opacity-60">Try a different search term</p>
                </motion.div>
              ) : (
                filteredItems.map((item, index) => {
                  const isActive = item.id === items[selectedIndex]?.id;
                  return (
                    <CommandItemComponent
                      key={item.id}
                      item={item}
                      onSelect={handleSelect}
                      isActive={isActive}
                      isHighlighted={index === highlightedIndex}
                      index={index}
                    />
                  );
                })
              )}

              {filteredItems.length > 0 && (
                <div className="px-3 py-2 text-center">
                  <span className="text-xs text-muted-foreground/50">
                    Showing {Math.min(filteredItems.length, 6)} of {items.length} commands
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div 
              className={`px-4 py-2 border-t ${
                isAnimatingOut ? 'border-primary/30' : 'border-border'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground/60">
                  {filteredItems.length} results • 
                  <span className="ml-1 font-mono bg-muted px-2 py-0.5 rounded">
                    ⌘K to toggle
                  </span>
                </span>

                <div className="flex items-center gap-3 text-muted-foreground/50">
                  {isAnimatingOut ? (
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    >
                      <ChevronRight className="h-3 w-3" />
                    </motion.div>
                  ) : (
                    <>
                      <span className="flex items-center gap-1">
                        <Keyboard className="h-3 w-3" />
                        <span>Arrow keys to navigate</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Terminal className="h-3 w-3" />
                        <span>Enter to execute</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CommandPaletteLauncher;
