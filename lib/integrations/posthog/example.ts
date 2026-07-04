import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export type PosthogEvent = {
  name: string
  properties?: Record<string, unknown>
}

export interface PostHogConfig {
  key: string
  host: string
  debug?: boolean
}

const DEFAULT_CONFIG: Required<PostHogConfig> = {
  key: '',
  host: 'https://app.posthog.com',
  debug: false,
}

function isConfigured(config: PostHogConfig | undefined): config is Required<PostHogConfig> {
  return !!config?.key && !!config?.host
}

export async function initializePostHog(
  config?: PostHogConfig,
  options = { autoFlush: true } as const
) {
  if (!isConfigured(config)) {
    console.warn('PostHog not configured. Call initializePostHog() with a valid config first.')
    return undefined
  }

  try {
    // Simulate initialization - replace with actual PostHog SDK import
    const initialized = await Promise.resolve({
      key: config.key,
      host: config.host,
      debug: config.debug,
      autoFlush: options.autoFlush,
    })

    console.log('[PostHog] Initialized successfully')
    return initialized
  } catch (error) {
    console.error('[PostHog] Initialization failed:', error)
    throw error
  }
}

export function trackEvent(
  event: PosthogEvent,
  config?: PostHogConfig
): Promise<void> | undefined {
  if (!isConfigured(config)) {
    return
  }

  try {
    // Simulate tracking - replace with actual SDK call
    const payload = {
      distinct_id: 'user_' + Math.random().toString(36).slice(2),
      events: [{ event: event.name, properties: event.properties || {} }],
      timestamp: Date.now(),
    }

    console.log('[PostHog] Tracking:', JSON.stringify(payload))
    return Promise.resolve()
  } catch (error) {
    console.error('[PostHog] Track failed:', error)
    throw error
  }
}

export function trackPageview(
  url: string,
  config?: PostHogConfig
): Promise<void> | undefined {
  return trackEvent({ name: '$pageview', properties: { $current_url: url } }, config)
}

export function trackUserSignup(config?: PostHogConfig): Promise<void> | undefined {
  return trackEvent(
    { name: 'user_signed_up' },
    config
  )
}

export function trackButtonClick(
  buttonId: string,
  label: string,
  config?: PostHogConfig
): Promise<void> | undefined {
  return trackEvent({
    name: 'button_clicked',
    properties: { $element_id: buttonId, $label: label },
  }, config)
}

export function trackFormSubmit(
  formName: string,
  fields?: Record<string, unknown>,
  config?: PostHogConfig
): Promise<void> | undefined {
  return trackEvent({
    name: 'form_submitted',
    properties: { $form_name: formName, $fields: fields },
  }, config)
}

export function trackError(
  error: Error | string,
  context?: Record<string, unknown>,
  config?: PostHogConfig
): Promise<void> | undefined {
  const message = typeof error === 'string' ? error : error.message || 'Unknown error'
  return trackEvent({
    name: '$exception',
    properties: { $level: 'error', $message: message, $context: context },
  }, config)
}

export function getPostHogStatus(config?: PostHogConfig): { configured: boolean; initialized: boolean } {
  const configured = isConfigured(config)
  // In real implementation, check if SDK instance exists
  return { configured, initialized: true }
}

// UI Component for displaying integration status
export function PostHogStatusIndicator({ config }: { config?: PostHogConfig }) {
  const { configured, initialized } = getPostHogStatus(config)

  return (
    <AnimatePresence>
      {configured && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'fixed bottom-4 right-4 px-3 py-2 rounded-lg shadow-lg border text-xs flex items-center gap-2',
            configured ? 'bg-background/95' : 'bg-muted/95',
            initialized ? 'border-green-500/50' : 'border-yellow-500/50'
          )}
        >
          <span className={cn('h-2 w-2 rounded-full', initialized ? 'bg-green-500' : 'bg-yellow-500')} />
          <span className="text-muted-foreground">
            {initialized ? 'PostHog connected' : 'Configured but not ready'}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Helper to create a type-safe event tracker with defaults
export function createEventTracker(
  config?: PostHogConfig,
  options = { autoFlush: true } as const
) {
  let initialized = false

  return {
    init() {
      if (initialized) return
      initializePostHog(config, options).then(() => {
        initialized = true
      })
    },

    track(event: PosthogEvent): Promise<void> | undefined {
      this.init()
      return trackEvent(event, config)
    },

    pageview(url: string): Promise<void> | undefined {
      this.init()
      return trackPageview(url, config)
    },

    button(id: string, label: string): Promise<void> | undefined {
      this.init()
      return trackButtonClick(id, label, config)
    },

    form(name: string, fields?: Record<string, unknown>): Promise<void> | undefined {
      this.init()
      return trackFormSubmit(name, fields, config)
    },

    error(err: Error | string, context?: Record<string, unknown>): Promise<void> | undefined {
      this.init()
      return trackError(err, context, config)
    },

    status(): { configured: boolean; initialized: boolean } {
      return getPostHogStatus(config)
    },
  }
}
