'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Settings2,
  ChevronRight,
  Database
} from 'lucide-react'

// Simulated adapter types and functions (replace with actual imports)
type Config = {
  apiKey: string | null
  workspaceId: string | null
  isReady: boolean
}

const config: Config = {
  apiKey: process.env.NOTION_API_KEY || '',
  workspaceId: process.env.NOTION_WORKSPACE_ID || '',
  isReady: !!config.apiKey && !!config.workspaceId,
}

// Simulated adapter exports (replace with actual imports)
export function isConfigured() {
  return config.isReady
}

export async function fetchPage(pageId: string) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network
    return { id: pageId, title: 'Example Page', properties: {} }
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

export async function createPage(data: { parent: string; title: string }) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { id: 'new-page-id', title: data.title }
  } catch (error) {
    console.error('Create error:', error)
    throw error
  }
}

export async function updatePage(pageId: string, data: Partial<{ title: string }>) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { id: pageId, ...data }
  } catch (error) {
    console.error('Update error:', error)
    throw error
  }
}

export async function deletePage(pageId: string) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return true
  } catch (error) {
    console.error('Delete error:', error)
    throw error
  }
}

// Example component demonstrating the API usage
export function NotionExample() {
  const [loading, setLoading] = useState(false)
  const [pageData, setPageData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  // Animation variants for premium feel
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    },
    exit: { opacity: 0, scale: 0.95 }
  }

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 25 }
    },
    exit: { y: -10, opacity: 0, transition: { duration: 0.2 } }
  }

  const handleFetch = async () => {
    if (!isConfigured()) return
    setLoading(true)
    setError(null)
    try {
      const result = await fetchPage('page-123')
      setPageData(result)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch page')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!isConfigured()) return
    setLoading(true)
    try {
      await createPage({ parent: 'workspace-123', title: 'New Page' })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to create page')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!isConfigured() || !pageData) return
    setLoading(true)
    try {
      await updatePage(pageData.id, { title: 'Updated Title' })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to update page')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!isConfigured() || !pageData) return
    if (!confirm('Are you sure?')) return
    setLoading(true)
    try {
      await deletePage(pageData.id)
      setShowSuccess(true)
      setPageData(null)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to delete page')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      className="min-h-screen bg-background text-foreground"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Header with gradient */}
      <motion.header 
        className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="rounded-lg bg-primary/10 p-2"
                whileTap={{ scale: 0.9 }}
              >
                <Database className="h-5 w-5 text-primary" />
              </motion.div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Notion Integration</h1>
                <p className="text-sm text-muted-foreground">Example usage patterns</p>
              </div>
            </div>

            {isConfigured() ? (
              <motion.button 
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings2 className="h-4 w-4" />
                <span>Configured</span>
              </motion.button>
            ) : (
              <motion.button 
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings2 className="h-4 w-4" />
                <span>Configure</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Status bar */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </motion.div>
          )}

          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 rounded-lg border border-success/30 bg-success/10 p-4"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <p className="text-sm font-medium">Operation completed successfully</p>
              </div>
            </motion.div>
          )}

          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6 flex items-center gap-3 rounded-lg border border-border/50 bg-muted/50 p-4"
            >
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p className="text-sm">Processing...</p>
            </motion.div>
          )}

          {pageData && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 rounded-xl border border-border/50 bg-background p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{pageData.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">ID: {pageData.id}</p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </motion.button>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFetch}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
                >
                  <FileText className="h-4 w-4" />
                  Refresh
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreate}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  Create New
                </motion.button>

                {pageData && (
                  <>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleUpdate}
                      disabled={loading}
                      className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
                    >
                      <Edit3 className="h-4 w-4" />
                      Update
                    </motion.button>

                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDelete}
                      disabled={loading}
                      className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* Empty state */}
          {!pageData && !loading && !error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6 rounded-xl border border-border/50 bg-background p-8 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">No page loaded</h3>
              <p className="mt-1 text-sm text-muted-foreground">Click "Refresh" to load a sample page, or create a new one.</p>
            </motion.div>
          )}

          {/* Quick actions */}
          {!pageData && !loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-border/50 bg-background p-6 shadow-sm"
            >
              <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFetch}
                  disabled={loading}
                  className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-background p-4 text-sm transition-colors hover:bg-muted disabled:opacity-50"
                >
                  <FileText className="h-6 w-6" />
                  Load Sample Page
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreate}
                  disabled={loading}
                  className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-background p-4 text-sm transition-colors hover:bg-muted disabled:opacity-50"
                >
                  <Plus className="h-6 w-6" />
                  Create New Page
                </motion.button>

                {isConfigured() && (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFetch}
                    disabled={loading}
                    className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-background p-4 text-sm transition-colors hover:bg-muted disabled:opacity-50"
                  >
                    <ChevronRight className="h-6 w-6" />
                    Explore Workspace
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-8 rounded-lg border border-border/50 bg-muted/30 p-4 text-center"
        >
          <p className="text-sm text-muted-foreground">
            {isConfigured() 
              ? 'Connected to Notion workspace' 
              : 'Not connected. Click "Configure" in the header to set up your API keys.'}
          </p>
        </motion.footer>
      </main>

      {/* Floating action button for mobile */}
      <AnimatePresence>
        {isConfigured() && !pageData && (
          <motion.button 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
