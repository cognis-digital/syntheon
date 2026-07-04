import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

// Type guards for configuration state
type HubSpotConfig = {
  apiKey: string
  subdomain?: string
}

const isHubSpotConfigured = (): boolean => {
  return typeof window !== 'undefined' && 
    (window.HUBSPOT_CONFIG?.apiKey || false)
}

// Async example functions demonstrating main flows
export async function getExampleContacts() {
  if (!isHubSpotConfigured()) {
    console.log('HubSpot not configured')
    return []
  }

  try {
    // Simulated API call - replace with actual adapter implementation
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    const mockData = [
      { id: '1', email: 'user@example.com', firstName: 'John' },
      { id: '2', email: 'test@example.com', firstName: 'Jane' }
    ]

    return mockData
  } catch (error) {
    console.error('Failed to fetch contacts:', error)
    throw new Error('HubSpot contact fetch failed')
  }
}

export async function getExampleCompanies() {
  if (!isHubSpotConfigured()) {
    return []
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 300))
    
    const mockData = [
      { id: '1', name: 'Acme Corp', domain: 'acme.com' },
      { id: '2', name: 'Globex Inc', domain: 'globex.com' }
    ]

    return mockData
  } catch (error) {
    console.error('Failed to fetch companies:', error)
    throw new Error('HubSpot company fetch failed')
  }
}

export async function getExampleDeals() {
  if (!isHubSpotConfigured()) {
    return []
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 400))
    
    const mockData = [
      { id: '1', name: 'Enterprise Deal', amount: 50000, stage: 'Negotiation' },
      { id: '2', name: 'Starter Package', amount: 5000, stage: 'Closed Won' }
    ]

    return mockData
  } catch (error) {
    console.error('Failed to fetch deals:', error)
    throw new Error('HubSpot deal fetch failed')
  }
}

// Example component showing usage with motion and styling
export function HubSpotExampleCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'rounded-xl border border-border bg-background p-6 shadow-sm',
        'transition-all hover:shadow-md hover:border-primary/25'
      )}
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      {children}
    </motion.div>
  )
}

export function HubSpotExampleContainer() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="space-y-6"
      >
        <HubSpotExampleCard title="Contacts Example">
          {/* Would render contact list here */}
          <p className="text-muted-foreground text-sm">
            Fetches contacts from HubSpot with error handling.
          </p>
        </HubSpotExampleCard>

        <HubSpotExampleCard title="Companies Example">
          <p className="text-muted-foreground text-sm">
            Retrieves company data with defensive try/catch blocks.
          </p>
        </HubSpotExampleCard>

        <HubSpotExampleCard title="Deals Example">
          <p className="text-muted-foreground text-sm">
            Fetches deal pipeline information safely.
          </p>
        </HubSpotExampleCard>
      </motion.div>
    </AnimatePresence>
  )
}

// Utility: Check and log configuration status
export function checkHubSpotStatus() {
  if (isHubSpotConfigured()) {
    console.log('✅ HubSpot is configured')
    return true
  } else {
    console.log('⚠️ HubSpot not configured yet')
    return false
  }
}

// Re-export for convenience
export const { 
  getExampleContacts, 
  getExampleCompanies, 
  getExampleDeals, 
  checkHubSpotStatus,
  isHubSpotConfigured 
} = thisModule
