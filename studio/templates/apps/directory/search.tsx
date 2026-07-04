'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Clock, Star, Filter, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  rating?: number;
  featured?: boolean;
}

interface SearchProps {
  initialQuery?: string;
  results: SearchResult[];
  onResultClick: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

const DEFAULT_RESULTS: SearchResult[] = [
  {
    id: '1',
    title: 'Enterprise Cloud Platform',
    description: 'Full-stack cloud infrastructure with auto-scaling, load balancing, and multi-region deployment capabilities.',
    category: 'Infrastructure',
    tags: ['cloud', 'scalable', 'enterprise'],
    rating: 4.8,
    featured: true,
  },
  {
    id: '2',
    title: 'Real-time Analytics Dashboard',
    description: 'Live data visualization with sub-second latency and customizable widgets for operational monitoring.',
    category: 'Analytics',
    tags: ['realtime', 'dashboard', 'monitoring'],
    rating: 4.6,
  },
  {
    id: '3',
    title: 'AI-Powered Code Review Bot',
    description: 'Automated code quality checks with ML-based pattern detection and security vulnerability scanning.',
    category: 'DevTools',
    tags: ['ai', 'automation', 'security'],
    rating: 4.9,
    featured: true,
  },
  {
    id: '4',
    title: 'Microservices API Gateway',
    description: 'High-performance routing layer with rate limiting, authentication, and request transformation.',
    category: 'Infrastructure',
    tags: ['api', 'gateway', 'routing'],
    rating: 4.5,
  },
];

const ANIMATION_VARIANTS = {
  container: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  },
  item: {
    hidden: { opacity: 0, x: -50, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { delay: i * 0.08, duration: 0.3, ease: 'easeOut' },
    }),
  },
};

export interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput = ({ value, onChange, placeholder, className }: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !value) {
      inputRef.current.focus();
    }
  }, [value]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        ref={inputRef}
        type="text"
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg',
          'text-foreground placeholder:text-muted-foreground/70',
          'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent',
          'transition-all duration-200 ease-out',
          'shadow-sm hover:shadow-md',
          className,
        )}
      />
    </div>
  );
};

export interface SearchResultItemProps {
  result: SearchResult;
  onClick: () => void;
  isActive?: boolean;
  index: number;
}

const SearchResultItem = ({ result, onClick, isActive, index }: SearchResultItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial="hidden"
      animate="visible"
      variants={ANIMATION_VARIANTS.item}
      custom={index}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative p-4 rounded-lg cursor-pointer transition-all duration-200',
        isActive ? 'bg-primary/10 border-primary/30' : 'hover:bg-muted hover:border-border',
        isHovered && !isActive ? 'shadow-md scale-[1.01]' : '',
      )}
    >
      <div className="flex items-start gap-4">
        {result.featured && (
          <span className="mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-primary/20 text-primary border border-primary/30">
            Featured
          </span>
        )}

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'font-semibold truncate',
            isActive ? 'text-primary' : 'text-foreground',
          )}>
            {result.title}
          </h3>
          
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {result.description}
          </p>

          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <span className="text-xs text-muted-foreground/60">{result.category}</span>
            
            {result.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-yellow-400 stroke-none" />
                <span className="text-xs text-muted-foreground">{result.rating.toFixed(1)}</span>
              </div>
            )}

            {result.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-muted border border-border"
              >
                {tag}
              </span>
            ))}

            {result.tags.length > 2 && (
              <span className="text-xs text-muted-foreground/60">+{result.tags.length - 2}</span>
            )}
          </div>
        </div>

        <ArrowRight 
          className={cn(
            'h-4 w-4 ml-auto opacity-50 transition-opacity',
            isHovered ? 'opacity-100' : '',
          )}
        />
      </div>
    </motion.div>
  );
};

export interface SearchResultsProps {
  results: SearchResult[];
  onResultClick: (result: SearchResult) => void;
  isLoading?: boolean;
  className?: string;
}

const SearchResults = ({ results, onResultClick, isLoading, className }: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="h-24 rounded-lg bg-muted/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-lg font-medium text-foreground">No results found</p>
        <p className="text-sm text-muted-foreground mt-1">Try adjusting your search terms or filters.</p>
      </motion.div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {results.map((result, index) => (
        <SearchResultItem
          key={result.id}
          result={result}
          onClick={() => onResultClick(result)}
          isActive={false}
          index={index}
        />
      ))}
    </div>
  );
};

export interface SearchHistoryProps {
  history: string[];
  onSelect: (query: string) => void;
  maxItems?: number;
  className?: string;
}

const SearchHistory = ({ history, onSelect, maxItems = 5, className }: SearchHistoryProps) => {
  if (!history.length) return null;

  const truncated = history.slice(-maxItems);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('mt-4 pt-3 border-t border-border', className)}
    >
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Recent searches</span>
      </div>

      <div className="space-y-1">
        {truncated.map((query, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(query)}
            className="w-full text-left px-3 py-2 rounded-md hover:bg-muted/50 transition-colors"
          >
            <span className="text-sm text-muted-foreground truncate">{query}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export interface SearchFiltersProps {
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  showAll?: boolean;
  onShowAll?: () => void;
}

const SearchFilters = ({ 
  categories, 
  selectedCategories, 
  onToggleCategory,
  showAll = false,
  onShowAll,
}: SearchFiltersProps) => {
  const visibleCount = showAll ? categories.length : Math.min(5, categories.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4 pt-3 border-t border-border"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Categories</span>
        </div>

        {categories.length > 5 && (
          <button
            onClick={onShowAll}
            className="text-xs text-primary hover:underline"
          >
            {showAll ? 'Show less' : `See all ${categories.length}`}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onToggleCategory(category)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm transition-all',
              selectedCategories.includes(category)
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border hover:border-muted',
            )}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export interface SearchStateProps {
  query: string;
  results: SearchResult[];
  categories: string[];
  selectedCategories: string[];
  onQueryChange: (query: string) => void;
  onResultClick: (result: SearchResult) => void;
  onToggleCategory: (category: string) => void;
}

export const SearchState = ({ 
  query, 
  results, 
  categories,
  selectedCategories,
  onQueryChange,
  onResultClick,
  onToggleCategory,
}: SearchStateProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return results;

    const lowerQuery = query.toLowerCase();
    return results.filter(
      (r) => 
        r.title.toLowerCase().includes(lowerQuery) ||
        r.description.toLowerCase().includes(lowerQuery) ||
        r.tags.some((t) => t.toLowerCase().includes(lowerQuery)) ||
        r.category.toLowerCase().includes(lowerQuery),
    );
  }, [query, results]);

  const handleClear = () => {
    onQueryChange('');
    setHasSearched(false);
  };

  return (
    <motion.div
      initial={ANIMATION_VARIANTS.container.initial}
      animate={ANIMATION_VARIANTS.container.animate}
      className="relative"
    >
      <div
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        className={cn(
          'rounded-xl border transition-all duration-300',
          isFocused ? 'ring-2 ring-primary/50 shadow-lg' : 'shadow-md hover:shadow-lg',
        )}
      >
        <div className="flex items-center p-4 gap-3">
          <SearchInput 
            value={query}
            onChange={(v) => onQueryChange(v)}
            placeholder="Search products, services, or documentation..."
            className={cn(
              'bg-transparent border-none focus:ring-0',
              isFocused ? 'text-primary' : '',
            )}
          />

          {query && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={handleClear}
              className="p-2 rounded-full hover:bg-muted/50 transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </motion.button>
          )}

          {query && (
            <span className="text-sm text-muted-foreground ml-1">
              {filteredResults.length} results
            </span>
          )}
        </div>

        <AnimatePresence>
          {(isFocused || hasSearched) && (
            <>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {query && (
                  <SearchResults 
                    results={filteredResults} 
                    onResultClick={onResultClick}
                    isLoading={!hasSearched}
                  />
                )}

                {!query && filteredResults.length === 0 && !isFocused && hasSearched && (
                  <div className="p-8 text-center">
                    <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-medium text-foreground">No results for "{query}"</p>
                    <p className="text-sm text-muted-foreground mt-1">Try different keywords or browse all categories.</p>
                  </div>
                )}

                {filteredResults.length > 0 && (
                  <SearchFilters 
                    categories={categories.filter(c => !selectedCategories.includes(c))}
                    selectedCategories={selectedCategories}
                    onToggleCategory={onToggleCategory}
                    showAll={selectedCategories.length >= 3}
                    onShowAll={() => {}}
                  />
                )}

                <SearchHistory 
                  history={[query, ...categories.slice(0, 2)]}
                  onSelect={(q) => onQueryChange(q)}
                  maxItems={4}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute -bottom-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
      />
    </motion.div>
  );
};

export default SearchState;
