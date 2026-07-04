'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ChevronRight,
  Copy,
  RefreshCw
} from 'lucide-react'

type AirtableExampleProps = {
  config?: {
    apiKey: string | undefined
    baseId: string | undefined
    tableName: string | undefined
  }
  title?: string
  subtitle?: string
  showCode?: boolean
}

const DEFAULT_CONFIG = {
  apiKey: 'pk_test_1234567890abcdef',
  baseId: 'appXYZ123456789',
  tableName: 'Demo'
}

function isConfigured(config: AirtableExampleProps['config']): boolean {
  return (
    config?.apiKey && 
    config?.baseId && 
    config?.tableName
  )
}

async function fetchAirtableData(
  config: Required<AirtableExampleProps>['config'],
  limit = 5
): Promise<{ id: string; Name: string; Status?: string }[]> {
  try {
    const url = `https://api.airtable.com/v0/${config.baseId}/${config.tableName}`
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${config.apiKey}` },
      next: { revalidate: 3600 }
    })

    if (!response.ok) throw new Error('Failed to fetch data')

    return (await response.json()).data.slice(0, limit)
  } catch {
    return []
  }
}

async function createAirtableRecord(config: Required<AirtableExampleProps>['config'], name: string): Promise<{ id: string }> {
  try {
    const url = `https://api.airtable.com/v0/${config.baseId}/${config.tableName}`
    await fetch(url, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ records: [{ fields: { Name: name } }] })
    })

    return { id: 'new-record-' + Date.now() }
  } catch {
    return { id: '' }
  }
}

async function deleteAirtableRecord(config: Required<AirtableExampleProps>['config'], recordId: string): Promise<void> {
  try {
    const url = `https://api.airtable.com/v0/${config.baseId}/${recordId}`
    await fetch(url, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${config.apiKey}` }
    })
  } catch {}
}

function ExampleCard({ 
  children, 
  title, 
  icon,
  status = 'idle' 
}: { 
  children: React.ReactNode 
  title?: string 
  icon?: React.ReactNode 
  status?: 'idle' | 'loading' | 'success' | 'error' 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="rounded-xl border bg-background shadow-sm overflow-hidden"
    >
      <div className="p-6">
        {title && (
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            {icon}
            {title}
          </h3>
        )}
        
        <AnimatePresence mode='wait'>
          {status === 'loading' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-green-500"
            >
              <CheckCircle2 className="h-4 w-4" />
              Success!
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-red-500"
            >
              <AlertCircle className="h-4 w-4" />
              Something went wrong.
            </motion.div>
          )}

          {status === 'idle' && children}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = React.useState(false)

  return (
    <motion.pre
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-sm font-mono"
    >
      {label && (
        <div className="flex items-center justify-between mb-2 px-2">
          <span className="text-xs text-muted-foreground">{label}</span>
          <button 
            onClick={() => { navigator.clipboard.writeText(code); setCopied(true) }}
            className="p-1 hover:bg-background rounded transition-colors"
          >
            <Copy className="h-3 w-3" />
          </button>
        </div>
      )}
      <code>{code}</code>
    </motion.pre>
  )
}

export function AirtableExample({ 
  config = DEFAULT_CONFIG, 
  title: propsTitle,
  subtitle,
  showCode = true 
}: AirtableExampleProps) {
  const [records, setRecords] = React.useState<{ id: string; Name: string }[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const scroll = useScroll()
  const y1 = useTransform(scroll.scrollY, [0, 500], [0, -20])

  if (!isConfigured(config)) {
    return (
      <ExampleCard title="Not Configured" status="idle">
        <p className="text-muted-foreground mb-4">
          Add your Airtable credentials to the config prop.
        </p>
        <CodeBlock 
          label="Expected config shape"
          code={`{
  apiKey: 'pk_your_key_here',
  baseId: 'app_your_base_id',
  tableName: 'YourTableName'
}`}
        />
      </ExampleCard>
    )
  }

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await fetchAirtableData(config, 3)
      setRecords(data)
    } catch (err: any) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const createRecord = async () => {
    setLoading(true)
    
    try {
      await createAirtableRecord(config, 'New Item via Syntheon')
      setRecords(prev => [...prev, { id: '', Name: 'New Item via Syntheon' }])
    } finally {
      setLoading(false)
    }
  }

  const deleteRecord = async (id: string) => {
    await deleteAirtableRecord(config, id)
    setRecords(prev => prev.filter(r => r.id !== id))
  }

  return (
    <motion.div
      style={{ y: y1 }}
      className="space-y-6"
    >
      {/* Header with gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/10 via-transparent to-transparent">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Database className="h-5 w-5 text-violet-400" />
            <h1 className={cn(
              'text-2xl font-semibold tracking-tight',
              propsTitle ? '' : 'text-foreground'
            )}>
              {propsTitle || 'Airtable Integration Example'}
            </h1>
          </div>

          {subtitle && (
            <p className="text-muted-foreground">{subtitle}</p>
          )}
        </motion.div>

        {/* Decorative gradient blob */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-32 -bottom-32 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Action buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-3"
      >
        <button
          onClick={fetchData}
          disabled={loading || !isConfigured(config)}
          className={cn(
            'px-4 py-2 rounded-lg border flex items-center gap-2 transition-all',
            loading 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : 'hover:bg-background hover:shadow-md active:scale-[0.98]'
          )}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {loading ? 'Loading...' : 'Fetch Data'}
        </button>

        <button
          onClick={createRecord}
          disabled={loading || !isConfigured(config)}
          className={cn(
            'px-4 py-2 rounded-lg border flex items-center gap-2 transition-all',
            loading 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : 'hover:bg-background hover:shadow-md active:scale-[0.98]'
          )}
        >
          <Database className="h-4 w-4" />
          {loading ? 'Creating...' : 'Create Record'}
        </button>

        <button
          onClick={() => setRecords([])}
          disabled={loading || !isConfigured(config) || records.length === 0}
          className={cn(
            'px-4 py-2 rounded-lg border flex items-center gap-2 transition-all',
            loading 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : 'hover:bg-background hover:shadow-md active:scale-[0.98]'
          )}
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          {loading ? 'Clearing...' : records.length > 0 ? 'Clear List' : 'No Data'}
        </button>
      </motion.div>

      {/* Error display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </motion.div>
      )}

      {/* Data list */}
      {isConfigured(config) && (
        <ExampleCard 
          title={showCode ? 'Live Results' : undefined}
          icon={<Database className="h-4 w-4" />}
          status={loading ? 'loading' : records.length > 0 ? 'success' : 'idle'}
        >
          {records.length === 0 && !loading ? (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="h-6 w-6 mx-auto mb-2 opacity-50" />
              <p>No records found. Click "Fetch Data" to load.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {records.map((record, index) => (
                <motion.li
                  key={record.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors group"
                >
                  <div>
                    <p className={cn(
                      'font-medium',
                      record.Name ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {record.Name || 'Unnamed Record'}
                    </p>
                    <p className="text-xs text-muted-foreground">ID: {record.id}</p>
                  </div>

                  <button
                    onClick={() => deleteRecord(record.id)}
                    disabled={loading}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 rounded transition-all"
                    aria-label={`Delete record ${record.id}`}
                  >
                    <ChevronRight className="h-4 w-4 rotate-90 text-muted-foreground" />
                  </button>
                </motion.li>
              ))}
            </ul>
          )}

          {showCode && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-sm font-medium mb-3 text-muted-foreground">API Usage Pattern</h4>
              <CodeBlock 
                label="TypeScript usage example"
                code={`// Import the adapter
import { createAirtableRecord, fetchAirtableData } from '@/lib/integrations/airtable'

// Check if configured
if (isConfigured(config)) {
  // Fetch data
  const records = await fetchAirtableData(config)
  
  // Create record
  const newRecord = await createAirtableRecord(config, 'Item Name')
}`}
              />
            </div>
          )}
        </ExampleCard>
      )}

      {/* Configuration example */}
      <ExampleCard 
        title="Configuration"
        icon={<Database className="h-4 w-4" />}
        status="idle"
      >
        <CodeBlock 
          label="Recommended config object"
          code={`// In your component or server action
const airtableConfig: Required<AirtableExampleProps>['config'] = {
  apiKey: process.env.AIRTABLE_API_KEY,
  baseId: process.env.AIRTABLE_BASE_ID,
  tableName: 'YourTableName'
}

// Export for testing
export default airtableConfig`}
        />
      </ExampleCard>
    </motion.div>
  )
}
