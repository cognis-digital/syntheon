'use client'

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  SortAsc,
  SortDesc,
  X,
  Check,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DataTableProps {
  columns: Array<{
    key: string
    header: React.ReactNode | string
    accessor?: string
    sortable?: boolean
    render?: (value: any, row: any) => React.ReactNode
    width?: string
    className?: string
  }>
  data: Array<Record<string, unknown>>
  onRowClick?: (row: Record<string, unknown>) => void | Promise<void>
  emptyState?: {
    title: string
    description: string
    actionLabel?: string
    onAction?: () => void
  }
  pagination?: {
    enabled: boolean
    pageSizeOptions?: number[]
    defaultPageSize: number
    totalRows: number
  }
  sorting?: {
    enabled: boolean
    initialSortColumn?: string | null
    initialSortDirection: 'asc' | 'desc'
  }
  filtering?: {
    enabled: boolean
    placeholder?: string
  }
  loading?: boolean
  className?: string
}

export interface DataTableState {
  page: number
  pageSize: number
  sortColumn: string | null
  sortDirection: 'asc' | 'desc'
  searchQuery: string
  filterOpen: boolean
}

const DEFAULT_PAGE_SIZE = 10
const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100]

export interface DataTableColumns {
  key: string
  header: React.ReactNode | string
  accessor?: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
  width?: string
  className?: string
}

const createEmptyState = (title: string, description: string): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <AlertCircle className="w-8 h-8 mb-3 text-muted-foreground" />
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-md">{description}</p>
    </div>
  )
}

const createLoadingState = (): JSX.Element => {
  return (
    <div className="flex items-center justify-center py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full"
      />
    </div>
  )
}

const createPaginationControls = ({
  currentPage,
  pageSize,
  totalPages,
  totalRows,
  onPageChange,
  onPageSizeChange,
}: {
  currentPage: number
  pageSize: number
  totalPages: number
  totalRows: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}) => {
  const pages = []

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={cn(
            "h-8 px-3 text-sm rounded-md transition-colors border",
            currentPage === i
              ? "bg-primary text-primary-foreground border-primary"
              : "text-muted-foreground hover:bg-muted border-border"
          )}
        >
          {i}
        </button>
      )
    }
  } else if (currentPage <= 4) {
    for (let i = 1; i <= 5; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={cn(
            "h-8 px-3 text-sm rounded-md transition-colors border",
            currentPage === i
              ? "bg-primary text-primary-foreground border-primary"
              : "text-muted-foreground hover:bg-muted border-border"
          )}
        >
          {i}
        </button>
      )
    }
    pages.push(
      <span key="ellipsis-left" className="h-8 px-2 text-sm text-muted-foreground">...</span>
    )
  } else if (currentPage >= totalPages - 3) {
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className="h-8 px-3 text-sm rounded-md transition-colors border text-muted-foreground hover:bg-muted"
      >
        1
      </button>
    )
    pages.push(
      <span key="ellipsis-right" className="h-8 px-2 text-sm text-muted-foreground">...</span>
    )
    for (let i = totalPages - 4; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={cn(
            "h-8 px-3 text-sm rounded-md transition-colors border",
            currentPage === i
              ? "bg-primary text-primary-foreground border-primary"
              : "text-muted-foreground hover:bg-muted border-border"
          )}
        >
          {i}
        </button>
      )
    }
  } else {
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className="h-8 px-3 text-sm rounded-md transition-colors border text-muted-foreground hover:bg-muted"
      >
        1
      </button>
    )
    pages.push(
      <span key="ellipsis-left" className="h-8 px-2 text-sm text-muted-foreground">...</span>
    )
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={cn(
            "h-8 px-3 text-sm rounded-md transition-colors border",
            currentPage === i
              ? "bg-primary text-primary-foreground border-primary"
              : "text-muted-foreground hover:bg-muted border-border"
          )}
        >
          {i}
        </button>
      )
    }
    pages.push(
      <span key="ellipsis-right" className="h-8 px-2 text-sm text-muted-foreground">...</span>
    )
    pages.push(
      <button
        key={totalPages}
        onClick={() => onPageChange(totalPages)}
        className="h-8 px-3 text-sm rounded-md transition-colors border text-muted-foreground hover:bg-muted"
      >
        {totalPages}
      </button>
    )
  }

  return (
    <div className={cn(
      "flex items-center justify-between py-4 border-t border-border",
      totalPages <= 1 ? "border-0" : ""
    )}>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalRows)} of {totalRows} entries
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-8 px-3 text-sm rounded-md border transition-colors text-muted-foreground hover:bg-muted disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((page, index) => (
          <React.Fragment key={index}>{page}</React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalPages <= 1}
          className="h-8 px-3 text-sm rounded-md border transition-colors text-muted-foreground hover:bg-muted disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-8 px-2 text-sm rounded-md border bg-background text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

const createSortHeader = ({
  column,
  currentColumn,
  currentDirection,
  onSort,
}: {
  column: DataTableColumns
  currentColumn: string | null
  currentDirection: 'asc' | 'desc'
  onSort: (column: string) => void
}) => {
  const isActive = currentColumn === column.key
  const direction = isActive ? currentDirection : undefined

  return (
    <th className={cn(
      "px-4 py-3 text-left text-sm font-medium border-b",
      column.className || "",
      isActive ? "text-primary" : "text-muted-foreground"
    )}>
      <button
        onClick={() => onSort(column.key)}
        className="flex items-center gap-1.5 group hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
      >
        {column.header}

        {isActive && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary"
          >
            {direction === 'asc' ? <SortAsc className="w-3.5 h-3.5" /> : <SortDesc className="w-3.5 h-3.5" />}
          </motion.span>
        )}

        {!isActive && (
          <ChevronDown className={cn(
            "w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors",
            direction === 'desc' ? "rotate-180" : ""
          )} />
        )}

        {!isActive && !direction && (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </button>
    </th>
  )
}

const createRow = ({
  row,
  columns,
  index,
  onRowClick,
}: {
  row: Record<string, unknown>
  columns: DataTableColumns[]
  index: number
  onRowClick?: (row: Record<string, unknown>) => void | Promise<void>
}) => {
  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={() => onRowClick?.(row)}
      className="group hover:bg-muted/50 cursor-pointer transition-colors border-b border-border last:border-0"
    >
      {columns.map((column) => (
        <td key={column.key} className={cn("px-4 py-3 text-sm", column.className || "")}>
          {column.render ? (
            column.render(row[column.accessor as keyof typeof row], row)
          ) : (
            <span className="text-muted-foreground">
              {String(row[column.accessor] ?? '')}
            </span>
          )}
        </td>
      ))}

      <td className="px-2 py-3 text-right">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRowClick?.(row)
          }}
          className="h-8 w-8 flex items-center justify-center rounded-md border border-border hover:bg-muted opacity-0 group-hover:opacity-100 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </td>
    </motion.tr>
  )
}

const createEmptyStateContent = (props?: { title: string; description: string }) => {
  const defaultTitle = "No results found"
  const defaultDescription = props?.description || "Try adjusting your filters or search query to find what you're looking for."

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Search className="w-8 h-8 mb-3 text-muted-foreground" />
      <h3 className="text-lg font-medium text-foreground">{props?.title || defaultTitle}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-md">
        {defaultDescription}
      </p>
    </div>
  )
}

const createLoadingContent = () => {
  return (
    <div className="flex items-center justify-center py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full"
      />
    </div>
  )
}

const createPaginationControls = ({
  currentPage,
  pageSize,
  totalPages,
  totalRows,
  onPageChange,
  onPageSizeChange,
}: {
  currentPage: number
  pageSize: number
  totalPages: number
  totalRows: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}) => {
  const pages = []

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={cn(
            "h-8 px-3 text-sm rounded-md transition-colors border",
            currentPage === i
              ? "bg-primary text-primary-foreground border-primary"
              : "text-muted-foreground hover:bg-muted border-border"
          )}
        >
          {i}
        </button>
      )
    }
  } else if (currentPage <= 4) {
    for (let i = 1; i <= 5; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={cn(
            "h-8 px-3 text-sm rounded-md transition-colors border",
            currentPage === i
              ? "bg-primary text-primary-foreground border-primary"
              : "text-muted-foreground hover:bg-muted border-border"
          )}
        >
          {i}
        </button>
      )
    }
    pages.push(
      <span key="ellipsis-left" className="h-8 px-2 text-sm text-muted-foreground">...</span>
    )
  } else if (currentPage >= totalPages - 3) {
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className="h-8 px-3 text-sm rounded-md transition-colors border text-muted-foreground hover:bg-muted"
      >
        1
      </button>
    )
    pages.push(
      <span key="ellipsis-right" className="h-8 px-2 text-sm text-muted-foreground">...</span>
    )
    for (let i = totalPages - 4; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={cn(
            "h-8 px-3 text-sm rounded-md transition-colors border",
            currentPage === i
              ? "bg-primary text-primary-foreground border-primary"
              : "text-muted-foreground hover:bg-muted border-border"
          )}
        >
          {i}
        </button>
      )
    }
  } else {
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className="h-8 px-3 text-sm rounded-md transition-colors border text-muted-foreground hover:bg-muted"
      >
        1
      </button>
    )
    pages.push(
      <span key="ellipsis-left" className="h-8 px-2 text-sm text-muted-foreground">...</span>
    )
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={cn(
            "h-8 px-3 text-sm rounded-md transition-colors border",
            currentPage === i
              ? "bg-primary text-primary-foreground border-primary"
              : "text-muted-foreground hover:bg-muted border-border"
          )}
        >
          {i}
        </button>
      )
    }
    pages.push(
      <span key="ellipsis-right" className="h-8 px-2 text-sm text-muted-foreground">...</span>
    )
    pages.push(
      <button
        key={totalPages}
        onClick={() => onPageChange(totalPages)}
        className="h-8 px-3 text-sm rounded-md transition-colors border text-muted-foreground hover:bg-muted"
      >
        {totalPages}
      </button>
    )
  }

  return (
    <div className={cn(
      "flex items-center justify-between py-4 border-t border-border",
      totalPages <= 1 ? "border-0" : ""
    )}>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalRows)} of {totalRows} entries
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-8 px-3 text-sm rounded-md border transition-colors text-muted-foreground hover:bg-muted disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((page, index) => (
          <React.Fragment key={index}>{page}</React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalPages <= 1}
          className="h-8 px-3 text-sm rounded-md border transition-colors text-muted-foreground hover:bg-muted disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-8 px-2 text-sm rounded-md border bg-background text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

const createSortHeader = ({
  column,
  currentColumn,
  currentDirection,
  onSort,
}: {
  column: DataTableColumns
  currentColumn: string | null
  currentDirection: 'asc' | 'desc'
  onSort: (column: string) => void
}) => {
