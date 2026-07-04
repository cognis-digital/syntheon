'use client'

import { isConfigured } from '@/lib/integrations/resend'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmailStatus = 'idle' | 'sending' | 'sent' | 'failed' | 'retrying'

interface EmailExampleProps {
  email: string
  type: 'verification' | 'welcome' | 'password-reset' | 'transactional'
  subject?: string
  content?: string
}

export function isResendConfigured(): boolean {
  return isConfigured()
}

const ANIMATION_DELAY = 100
const STATUS_COLORS = {
  idle: 'bg-muted',
  sending: 'bg-primary/20 text-primary-foreground border-border',
  sent: 'bg-green-500/10 text-green-400 border-green-500/30',
  failed: 'bg-red-500/10 text-red-400 border-red-500/30',
  retrying: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
}

export function createEmailStatusBadge(
  status: EmailStatus,
  className?: string
): JSX.Element {
  const variants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300 } },
    exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } },
  }

  return (
    <motion.span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium',
        STATUS_COLORS[status],
        className
      )}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {status === 'idle' && <Loader2 className="h-3 w-3 animate-spin" />}
      {status === 'sent' && <CheckCircle2 className="h-3 w-3" />}
      {status === 'failed' && <AlertCircle className="h-3 w-3" />}
      {status === 'retrying' && <Loader2 className="h-3 w-3 animate-spin" />}
      <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </motion.span>
  )
}

export async function sendVerificationEmail(email: string): Promise<{ success: boolean; error?: string }> {
  if (!isResendConfigured()) {
    return { success: false, error: 'Resend not configured' }
  }

  try {
    const result = await isConfigured() ? 
      // Simulated async operation for example purposes
      new Promise((resolve) => setTimeout(() => resolve({ token: 'verify-123456', expiresAt: Date.now() + 86400000 }), 500)) :
      { token: 'verify-123456', expiresAt: Date.now() + 86400000 }

    return { success: true, error: undefined }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: `Verification failed: ${message}` }
  }
}

export async function sendWelcomeEmail(email: string): Promise<{ success: boolean; error?: string }> {
  if (!isResendConfigured()) {
    return { success: false, error: 'Resend not configured' }
  }

  try {
    // Simulated welcome email creation and sending
    const result = await new Promise((resolve) => 
      setTimeout(() => resolve({ html: '<h1>Welcome!</h1>', text: 'Welcome!' }), 300)
    )

    return { success: true, error: undefined }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: `Welcome email failed: ${message}` }
  }
}

export async function sendPasswordResetEmail(email: string): Promise<{ success: boolean; error?: string }> {
  if (!isResendConfigured()) {
    return { success: false, error: 'Resend not configured' }
  }

  try {
    const result = await new Promise((resolve) => 
      setTimeout(() => resolve({ token: 'reset-987654', expiresAt: Date.now() + 3600000 }), 200)
    )

    return { success: true, error: undefined }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: `Reset email failed: ${message}` }
  }
}

export async function createTransactionEmail(
  type: 'receipt' | 'invoice' | 'notification',
  data: Record<string, unknown>
): Promise<{ success: boolean; html?: string }> {
  if (!isResendConfigured()) {
    return { success: false, error: 'Resend not configured' }
  }

  try {
    const templateMap = {
      receipt: { subject: 'Receipt', content: 'Your purchase is confirmed.' },
      invoice: { subject: 'Invoice', content: 'Here is your invoice.' },
      notification: { subject: 'Notification', content: 'Something happened in your account.' },
    }

    const template = templateMap[type] || templateMap.notification
    const result = await new Promise((resolve) => 
      setTimeout(() => resolve({ html: `<h1>${template.subject}</h1><p>${template.content}</p>` }), 250)
    )

    return { success: true, html: result.html }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: `Transaction email failed: ${message}` }
  }
}

export async function sendBulkEmails(
  emails: string[],
  type: 'welcome' | 'newsletter',
  options?: { subject?: string; content?: string }
): Promise<{ total: number; sent: number; failed: number }> {
  if (!isResendConfigured()) {
    return { total: emails.length, sent: 0, failed: emails.length }
  }

  try {
    const results = await Promise.all(
      emails.map((email) => 
        sendWelcomeEmail(email).then(({ success }) => ({ email, success }))
      )
    )

    return {
      total: emails.length,
      sent: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { total: emails.length, sent: 0, failed: emails.length }
  }
}

export function useEmailExample() {
  const [status, setStatus] = useState<EmailStatus>('idle')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (status === 'sending') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setStatus('sent')
            return 100
          }
          return prev + 5
        })
      }, 200)

      return () => clearInterval(interval)
    }
  }, [status])

  const variants = {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300 } },
  }

  return { status, progress, variants }
}

export function EmailExampleDemo() {
  const [demoEmail, setDemoEmail] = useState('')
  const [demoType, setDemoType] = useState<'verification' | 'welcome'>('verification')
  const demoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (demoRef.current) {
      demoRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [demoEmail, demoType])

  return (
    <AnimatePresence>
      {demoEmail && (
        <motion.div
          ref={demoRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="rounded-lg border bg-card p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-primary font-semibold">{demoType.charAt(0).toUpperCase() + demoType.slice(1)}</h3>
            <button
              onClick={() => { setDemoEmail(''); setDemoType('verification') }}
              className="rounded-md border bg-background px-2 py-1 text-xs hover:bg-muted"
            >
              Clear
            </button>
          </div>

          <p className="mt-4 text-sm">{demoEmail}</p>

          <div className="mt-4 flex items-center gap-3">
            {createEmailStatusBadge('idle')}
            <span className="text-xs text-muted-foreground">Ready to send</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function EmailExample() {
  const [email, setEmail] = useState('')
  const [type, setType] = useState<'verification' | 'welcome'>('verification')
  const emailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [email, type])

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="text-primary font-semibold mb-4">Email Example</h2>

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Enter email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'verification' | 'welcome')}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
        >
          <option value="verification">Verification Email</option>
          <option value="welcome">Welcome Email</option>
        </select>

        {email && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setEmail('')}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Send {type.charAt(0).toUpperCase() + type.slice(1)} Email
          </motion.button>
        )}

        <div ref={emailRef}>
          {createEmailStatusBadge('idle')}
        </div>
      </div>
    </div>
  )
}
