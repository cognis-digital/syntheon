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
