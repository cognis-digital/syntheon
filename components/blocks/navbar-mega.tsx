'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  User, 
  Settings, 
  LogOut,
  Sparkles,
  Zap,
  Globe,
  ShieldCheck,
  ArrowUpRight,
  Command
} from 'lucide-react';

interface NavItem {
  label: string;
  href?: string;
  children?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  }[];
}

export interface NavbarMegaProps {
  logoText?: string;
  items: NavItem[];
  userMenuItems?: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
  }>;
  className?: string;
  searchPlaceholder?: string;
}

const defaultItems: NavItem[] = [
  {
    label: 'Products',
    children: [
      { label: 'AI Builder', href: '/ai-builder', icon: <Sparkles className="h-4 w-4" /> },
      { label: 'Code Assistant', href: '/code-assistant', icon: <Zap className="h-4 w-4" /> },
      { label: 'Global Deploy', href: '/global-deploy', icon: <Globe className="h-4 w-4" /> },
    ],
  },
  {
    label: 'Solutions',
    children: [
      { label: 'Enterprise', href: '/enterprise' },
      { label: 'Startups', href: '/startups' },
    ],
  },
  {
    label: 'Resources',
    children: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api' },
      { label: 'Status', href: '/status' },
    ],
  },
];

export default function NavbarMega({ 
  logoText = 'Syntheon', 
  items = defaultItems, 
  userMenuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <User className="h-4 w-4" /> },
    { label: 'Settings', href: '/settings', icon: <Settings className="h-4 w-4" /> },
    { label: 'Sign Out', href: '/logout', icon: <LogOut className="h-4 w-4" /> },
  ],
  className,
  searchPlaceholder = 'Search...',
}: NavbarMegaProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setActiveItem(null);
    }
  }, []);

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border',
      searchFocused && 'bg-background',
      className
    )}>
      {/* Top bar with gradient */}
      <div className="h-[4px] bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500" />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a 
            href="/"
            className="flex items-center gap-2 group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg group-hover:shadow-violet-500/25 transition-shadow duration-300">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent group-hover:from-violet-500 group-hover:to-purple-600 transition-all duration-300">
              {logoText}
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {items.map((item, index) => (
              <MegaMenuItem 
                key={index} 
                item={item} 
                activeItem={activeItem}
                setActiveItem={setActiveItem}
              />
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Search - visible when focused or on mobile */}
            <AnimatePresence>
              {(searchFocused || isMobileMenuOpen) && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="hidden lg:block"
                >
                  <div className="relative group">
                    <Search 
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-violet-500 transition-colors" 
                      strokeWidth={1.5}
                    />
                    <input
                      type="text"
                      placeholder={searchPlaceholder}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      className="w-64 pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-muted-foreground"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-foreground" />
              )}
            </button>

            {/* User menu */}
            <div className="hidden md:flex items-center gap-1">
              {userMenuItems.map((item, index) => (
                <a 
                  key={index}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                >
                  {item.icon && <span className="h-4 w-4">{item.icon}</span>}
                  <span>{item.label}</span>
                </a>
              ))}
            </div>

            {/* Profile placeholder */}
            <button 
              className="hidden md:flex h-9 w-9 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 text-white font-medium text-sm shadow-lg hover:shadow-violet-500/25 transition-shadow"
              aria-label="User profile"
            >
              U
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden border-t border-border overflow-hidden"
            >
              <div className="p-4 space-y-6">
                {/* Mobile search */}
                <div className="relative">
                  <Search 
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" 
                    strokeWidth={1.5}
                  />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                </div>

                {/* Mobile nav items */}
                <MobileNavItems 
                  items={items} 
                  activeItem={activeItem}
                  setActiveItem={setActiveItem}
                />

                {/* User actions */}
                <div className="border-t border-border pt-4">
                  {userMenuItems.map((item, index) => (
                    <a 
                      key={index}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                    >
                      {item.icon && <span className="h-4 w-4">{item.icon}</span>}
                      <span>{item.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active item indicator */}
        {activeItem && (
          <motion.div 
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-purple-500"
          />
        )}
      </div>
    </nav>
  );
}

// Mega menu item component
function MegaMenuItem({ 
  item, 
  activeItem,
  setActiveItem,
}: { 
  item: NavItem;
  activeItem: string | null;
  setActiveItem: (item: string | null) => void;
}) {
  const isActive = activeItem === item.label;
  const isHovered = useRef(false);

  return (
    <div className="relative group">
      <button
        onClick={() => setActiveItem(isActive ? null : item.label)}
        onMouseEnter={() => isHovered.current = true}
        onMouseLeave={() => isHovered.current = false}
        className={cn(
          'flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all',
          isActive 
            ? 'bg-violet-500/10 text-violet-600' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted',
        )}
      >
        <span className={cn(
          'transition-colors duration-200',
          isActive ? 'text-violet-500' : ''
        )}>
          {item.label}
        </span>
        {isActive && (
          <ChevronRight 
            className="h-4 w-4 text-violet-500 ml-auto" 
            strokeWidth={2.5}
          />
        )}
      </button>

      {/* Mega menu panel */}
      <AnimatePresence>
        {(isActive || isHovered.current) && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: { duration: 0.2, ease: 'easeOut' }
            }}
            exit={{ 
              opacity: 0, 
              y: -8, 
              scale: 0.95,
              transition: { duration: 0.15, ease: 'easeIn' }
            }}
            className={cn(
              'absolute top-full left-0 right-0 mt-2 p-4 rounded-xl shadow-2xl border border-border bg-background/95 backdrop-blur-lg',
              'z-40 max-h-[70vh] overflow-y-auto custom-scrollbar'
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">{item.label}</h3>
              {isActive && (
                <button 
                  onClick={() => setActiveItem(null)}
                  className="p-1 hover:bg-muted rounded-md transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {item.children?.map((child, index) => (
              <a 
                key={index}
                href={child.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors group/item"
              >
                {child.icon && (
                  <span className="h-4 w-4 flex-shrink-0 text-violet-500">
                    {child.icon}
                  </span>
                )}
                <span className="text-sm font-medium">{child.label}</span>
                <ArrowUpRight 
                  className="ml-auto h-3 w-3 opacity-0 group-hover/item:opacity-100 transition-opacity text-violet-500" 
                  strokeWidth={2.5}
                />
              </a>
            ))}

            {/* Empty state */}
            {(!item.children || item.children.length === 0) && (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">No items available</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mobile navigation items wrapper
function MobileNavItems({ 
  items, 
  activeItem,
  setActiveItem,
}: { 
  items: NavItem[];
  activeItem: string | null;
  setActiveItem: (item: string | null) => void;
}) {
  return (
    <div className="space-y-1">
      {items.map((item, index) => (
        <MobileNavItem 
          key={index}
          item={item}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />
      ))}
    </div>
  );
}

// Mobile nav item component
function MobileNavItem({ 
  item, 
  activeItem,
  setActiveItem,
}: { 
  item: NavItem;
  activeItem: string | null;
  setActiveItem: (item: string | null) => void;
}) {
  const isActive = activeItem === item.label;

  return (
    <div className="relative">
      <button
        onClick={() => setActiveItem(isActive ? null : item.label)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all',
          isActive 
            ? 'bg-violet-500/10 text-violet-600' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted',
        )}
      >
        <span className={cn(
          'transition-colors duration-200',
          isActive ? 'text-violet-500' : ''
        )}>
          {item.label}
        </span>
        {isActive && (
          <ChevronRight 
            className="h-4 w-4 text-violet-500 ml-auto" 
            strokeWidth={2.5}
          />
        )}
      </button>

      {/* Mobile mega menu */}
      <AnimatePresence>
        {(isActive || activeItem === item.label) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              height: 'auto',
              transition: { duration: 0.25, ease: 'easeInOut' }
            }}
            exit={{ 
              opacity: 0, 
              height: 0,
              transition: { duration: 0.15, ease: 'easeOut' }
            }}
            className="overflow-hidden"
          >
            <div className="px-4 py-2 space-y-1">
              {item.children?.map((child, index) => (
                <a 
                  key={index}
                  href={child.href}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors group/item"
                >
                  {child.icon && (
                    <span className="h-4 w-4 flex-shrink-0 text-violet-500">
                      {child.icon}
                    </span>
                  )}
                  <span className="text-sm font-medium">{child.label}</span>
                </a>
              ))}

              {(!item.children || item.children.length === 0) && (
                <div className="py-3 text-center">
                  <p className="text-xs text-muted-foreground">No items available</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Custom scrollbar styles
const style = document.createElement('style');
style.textContent = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: hsl(var(--muted-foreground) / 0.2);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: hsl(var(--muted-foreground) / 0.35);
  }
`;
document.head.appendChild(style);

export type { NavbarMegaProps, NavItem };
