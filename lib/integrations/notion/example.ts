'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
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
  const [loading, setLoading] = React.useState(false)
  const [pageData, setPageData] = React.useState<any>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [showSuccess, setShowSuccess] = React.useState(false)

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
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              key={error}
              className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4"
              variants={itemVariants}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </motion.div>
          )}

          {showSuccess && (
            <motion.div 
              key={Date.now()}
              className="mb-6 rounded-lg border border-success/30 bg-success/10 p-4"
              variants={itemVariants}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <p className="text-sm text-success">Operation completed successfully</p>
              </div>
            </motion.div>
          )}

          {/* Action buttons */}
          <motion.div 
            className="mb-8 flex flex-wrap gap-4"
            variants={itemVariants}
          >
            {!isConfigured() ? (
              <motion.button 
                onClick={() => {}}
                disabled
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
              >
                <Settings2 className="h-4 w-4" />
                Configure API first
              </motion.button>
            ) : (
              <>
                <motion.button 
                  onClick={handleFetch}
                  disabled={loading || !isConfigured()}
                  className="flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FileText className="h-4 w-4" />
                  Fetch Page
                </motion.button>

                <motion.button 
                  onClick={handleCreate}
                  disabled={loading || !isConfigured()}
                  className="flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="h-4 w-4" />
                  Create Page
                </motion.button>

                <motion.button 
                  onClick={handleUpdate}
                  disabled={loading || !isConfigured() || !pageData}
                  className="flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Edit3 className="h-4 w-4" />
                  Update Page
                </motion.button>

                <motion.button 
                  onClick={async () => {
                    if (pageData) await deletePage(pageData.id)
                  }}
                  disabled={loading || !isConfigured() || !pageData}
                  className="flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Page
                </motion.button>
              </>
            )}
          </motion.div>

          {/* Status indicator */}
          <motion.div 
            className={cn(
              "mb-8 flex items-center gap-3 rounded-lg border p-4",
              isConfigured() 
                ? "border-success/50 bg-success/10" 
                : "border-border bg-background"
            )}
            variants={itemVariants}
          >
            <div className={cn(
              "h-2 w-2 rounded-full",
              isConfigured() ? "bg-success animate-pulse" : "bg-muted"
            )} />
            <span className="text-sm">
              {isConfigured() 
                ? 'Adapter ready and configured' 
                : 'Configure the Notion API adapter first'}
            </span>
          </motion.div>

          {/* Page data preview */}
          {pageData && (
            <motion.div 
              className="rounded-lg border border-border bg-background p-6"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <h3 className="mb-4 text-lg font-semibold">Current Page Data</h3>
              <pre className={cn(
                "rounded-md border border-border/50 bg-muted p-4 overflow-auto",
                "text-xs leading-relaxed"
              )}>
                {JSON.stringify(pageData, null, 2)}
              </pre>
            </motion.div>
          )}

          {/* Loading indicator */}
          <AnimatePresence>
            {loading && (
              <motion.div 
                className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
                variants={itemVariants}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="flex items-center gap-3 rounded-lg border border-border bg-background px-6 py-4 shadow-xl"
                  variants={itemVariants}
                >
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-sm font-medium">Processing...</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimatePresence>

        {/* Documentation section */}
        <motion.section 
          className="mt-12 rounded-lg border border-border bg-background p-6"
          variants={itemVariants}
        >
          <h3 className="mb-4 text-lg font-semibold">Usage Patterns</h3>
          
          <div className="space-y-4">
            {/* Pattern 1: Safe initialization */}
            <div className="rounded-md border border-border/50 bg-muted p-4">
              <p className="text-sm font-medium mb-2">Pattern 1: Check configuration before operations</p>
              <pre className={cn(
                "rounded-md border border-border/30 bg-background p-3",
                "text-xs leading-relaxed overflow-auto"
              )}>
{`// Always guard API calls with isConfigured()
if (isConfigured()) {
  await fetchPage('page-id')
} else {
  // Show configuration prompt or fallback UI
}`}</pre>
            </div>

            {/* Pattern 2: Error handling */}
            <div className="rounded-md border border-border/50 bg-muted p-4">
              <p className="text-sm font-medium mb-2">Pattern 2: Defensive error handling</p>
              <pre className={cn(
                "rounded-md border border-border/30 bg-background p-3",
                "text-xs leading-relaxed overflow-auto"
              )}>
{`// Wrap async operations in try/catch
try {
  const result = await fetchPage('page-id')
  // Handle success
} catch (error) {
  console.error('Operation failed:', error)
  setError(error.message)
}`}</pre>
            </div>

            {/* Pattern 3: Loading states */}
            <div className="rounded-md border border-border/50 bg-muted p-4">
              <p className="text-sm font-medium mb-2">Pattern 3: User feedback during operations</p>
              <pre className={cn(
                "rounded-md border border-border/30 bg-background p-3",
                "text-xs leading-relaxed overflow-auto"
              )}>
{`// Show loading indicator and disable buttons
setLoading(true)
try {
  await fetchPage('page-id')
} finally {
  setLoading(false)
}`}</pre>
            </div>
          </div>

          <motion.div 
            className="mt-6 rounded-lg border border-border/50 bg-muted p-4"
            variants={itemVariants}
          >
            <h4 className="mb-2 text-sm font-medium">Environment Variables</h4>
            <pre className={cn(
              "rounded-md border border-border/30 bg-background p-3",
              "text-xs leading-relaxed overflow-auto"
            )}>
{`# .env.local
NOTION_API_KEY=your_api_key_here
NOTION_WORKSPACE_ID=your_workspace_id_here`}
            </pre>
          </motion.div>
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer 
        className="mt-12 border-t border-border/50 bg-background"
        variants={itemVariants}
      >
        <div className="mx-auto max-w-5xl px-6 py-4">
          <p className="text-center text-sm text-muted-foreground">
            Notion Integration Example • Built with Next.js 15 + TypeScript + Tailwind
          </p>
        </div>
      </motion.footer>
    </motion.div>
  )
}

// Re-export convenience functions for easy imports
export { isConfigured, fetchPage, createPage, updatePage, deletePage }
