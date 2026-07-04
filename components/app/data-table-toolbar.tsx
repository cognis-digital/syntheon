'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

interface DataTableToolbarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  rowsPerPage: number;
  setRowsPerPage: (value: number) => void;
  sortBy?: { key: string; direction: 'asc' | 'desc' };
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
  selectedColumns: string[];
  setSelectedColumns: (columns: string[]) => void;
  exportFormat?: 'csv' | 'pdf';
  setExportFormat?: (format: 'csv' | 'pdf') => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
}

export interface DataTableToolbarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  rowsPerPage: number;
  setRowsPerPage: (value: number) => void;
  sortBy?: { key: string; direction: 'asc' | 'desc' };
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
  selectedColumns: string[];
  setSelectedColumns: (columns: string[]) => void;
  exportFormat?: 'csv' | 'pdf';
  setExportFormat?: (format: 'csv' | 'pdf') => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export const DEFAULT_ROWS_PER_PAGE = 10;
const VIOLET_ACCENT = '#8B5CF6';

export function DataTableToolbar({
  searchQuery,
  setSearchQuery,
  rowsPerPage,
  setRowsPerPage,
  sortBy,
  onSortChange,
  selectedColumns,
  setSelectedColumns,
  exportFormat,
  setExportFormat,
  showFilters,
  setShowFilters,
}: DataTableToolbarProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, 20]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative"
    >
      <motion.div
        style={{ x }}
        className={cn(
          'sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          'border-b border-border'
        )}
      >
        <div className="flex items-center gap-4 px-4 py-3">
          
          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <Input
                type="search"
                placeholder="Search data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-8 pr-10 bg-muted/50 border-border focus:bg-background transition-colors"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                <SearchIcon size={14} />
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded-md transition-colors"
                >
                  <XIcon size={14} />
                </button>
              )}
            </div>
          </motion.div>

          {/* View Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-3"
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {rowsPerPage} rows/page
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {[5, 10, 20, 50].map((size) => (
                  <DropdownMenuItem
                    key={size}
                    onClick={() => setRowsPerPage(size)}
                    className={cn(
                      'cursor-pointer',
                      rowsPerPage === size && 'bg-primary text-primary-foreground'
                    )}
                  >
                    {size}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-6" />

            {/* Sort Controls */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {sortBy?.direction === 'desc' ? (
                    <ChevronDownIcon />
                  ) : (
                    <ChevronUpIcon />
                  )}
                  Sort by: {sortBy?.key || 'None'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onSortChange?.('name', 'asc')}>
                  Name (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortChange?.('name', 'desc')}>
                  Name (Z-A)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Column Management */}
            <Separator orientation="vertical" className="h-6" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Columns ({selectedColumns.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {['name', 'email', 'phone', 'status'].map((col) => (
                  <DropdownMenuItem
                    key={col}
                    onClick={() => {
                      if (selectedColumns.includes(col)) {
                        setSelectedColumns(selectedColumns.filter(c => c !== col));
                      } else {
                        setSelectedColumns([...selectedColumns, col]);
                      }
                    }}
                    className={cn(
                      'cursor-pointer',
                      selectedColumns.includes(col) && 'bg-primary text-primary-foreground'
                    )}
                  >
                    <Checkbox checked={selectedColumns.includes(col)} />
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Export Controls */}
            <Separator orientation="vertical" className="h-6" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {exportFormat === 'csv' ? (
                    <FileSpreadsheetIcon />
                  ) : (
                    <FileTextIcon />
                  )}
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setExportFormat?.('csv')}>
                  CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setExportFormat?.('pdf')}>
                  PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filters Toggle */}
            <Separator orientation="vertical" className="h-6" />

            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? (
                <FilterOffIcon />
              ) : (
                <FilterIcon />
              )}
              Filters
            </Button>

          </motion.div>
        </div>
      </motion.div>

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute -bottom-1 left-0 right-0 h-8 bg-gradient-to-t from-primary/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      />
    </motion.div>
  );
}

// Icons
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

function ChevronUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}

function FileSpreadsheetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  );
}

function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
      <polyline points="14 8 14 13 19 13"></polyline>
    </svg>
  );
}

function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="22 3 22 9 15.5 15.5 9 9 9 15.5 2.5 9 2.5 3"></polygon>
    </svg>
  );
}

function FilterOffIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="22 3 22 9 15.5 15.5 9 9 9 15.5 2.5 9 2.5 3"></polygon>
      <line x1="6" y1="10" x2="8" y2="12"></line>
      <line x1="10" y1="10" x2="8" y2="12"></line>
    </svg>
  );
}

function Checkbox(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={props.checked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {props.checked && (
        <polyline points="20 6 9 17 4 12"></polyline>
      )}
    </svg>
  );
}
