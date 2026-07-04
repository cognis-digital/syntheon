import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

interface ReferralProps {
  inviteCode: string | null
  invitesSent: number
  totalInvitesLimit?: number
  onCopyClick?: (code: string) => void
}

export interface ReferralState {
  isCopied: boolean
  copyTarget: string | null
}

const defaultProps: Required<ReferralProps> = {
  inviteCode: null,
  invitesSent: 0,
  totalInvitesLimit: 10,
  onCopyClick: () => {},
}

export function Referral({
  inviteCode = defaultProps.inviteCode,
  invitesSent = defaultProps.invitesSent,
  totalInvitesLimit = defaultProps.totalInvitesLimit,
  onCopyClick = defaultProps.onCopyClick,
}: ReferralProps) {
  const [state, setState] = React.useState<ReferralState>({
    isCopied: false,
    copyTarget: null,
  })

  const handleCopy = () => {
    if (!inviteCode) return
    navigator.clipboard.writeText(inviteCode).then(() => {
      setState({ isCopied: true, copyTarget: inviteCode })
      setTimeout(() => setState((s) => ({ ...s, isCopied: false })), 2000)
    })
  }

  const progress = totalInvitesLimit ? Math.min(100, (invitesSent / totalInvitesLimit) * 100) : 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md"
    >
      <Card className="border-border bg-background/95 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between"
          >
            <div className="space-y-2">
              <CardTitle className="text-primary text-2xl font-semibold tracking-tight">
                Referral Program
              </CardTitle>
              <CardDescription className="text-muted-foreground/80">
                Share your code and earn exclusive benefits as friends join.
              </CardDescription>
            </div>

            <AnimatePresence>
              {state.isCopied && (
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                >
                  Copied!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Invite Code Display */}
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
            <CodeDisplay code={inviteCode || 'SYNTH-2024'} isCopied={state.isCopied} />

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
              disabled={!inviteCode || state.isCopied}
            >
              {state.isCopied ? (
                <CheckIcon className="h-4 w-4 text-primary" />
              ) : (
                <>
                  <CopyIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Copy Code</span>
                </>
              )}
            </Button>
          </div>

          {/* Progress Bar */}
          {(totalInvitesLimit && invitesSent > 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground/70">Invites sent</span>
                <Badge variant={invitesSent >= totalInvitesLimit ? 'default' : 'secondary'}>
                  {invitesSent} / {totalInvitesLimit}
                </Badge>
              </div>

              <motion.div
                className="h-2 bg-muted rounded-full overflow-hidden"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <div
                  className="h-full bg-gradient-to-r from-primary/60 via-primary to-primary/60"
                  style={{
                    backgroundSize: '200% 100%',
                    animation: progress > 50 ? 'gradientMove 3s ease infinite' : 'none',
                  }}
                />
              </motion.div>

              <p className="text-xs text-muted-foreground/60">
                {invitesSent >= totalInvitesLimit
                  ? 'You&rsquo;ve reached your limit!'
                  : `${totalInvitesLimit - invitesSent} invites remaining`}
              </p>
            </motion.div>
          )}

          {/* CTA */}
          <div className="pt-2">
            <Button
              variant="default"
              className="w-full h-11 text-base font-medium bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25"
            >
              <ShareIcon className="h-4 w-4 mr-2" />
              Share Your Invite
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Decorative elements */}
      <DecorativeBackground />
    </motion.div>
  )
}

// ============================================
// Subcomponents
// ============================================

function CodeDisplay({ code, isCopied }: { code: string; isCopied: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'font-mono text-sm font-semibold tracking-wider',
          isCopied ? 'text-primary/60 line-through decoration-primary/40' : 'text-foreground'
        )}
      >
        {code.toUpperCase()}
      </span>
    </div>
  )
}

function DecorativeBackground() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
      style={{ zIndex: -1 }}
    >
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-4 left-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-4 right-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl"
      />
    </motion.div>
  )
}

// ============================================
// Icons (inline to avoid external deps)
// ============================================

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4Z" />
    </svg>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function ShareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  )
}

// ============================================
// CSS Animations (via style injection)
// ============================================

const globalStyles = document.createElement('style')
globalStyles.innerHTML = `
  @keyframes gradientMove {
    0% { background-position: 200% 50%; }
    100% { background-position: -200% 50%; }
  }
`

// Inject styles on mount, cleanup on unmount (useEffect in parent)
