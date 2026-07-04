import { useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'

interface SettingsProps {
  className?: string
}

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.15,
      ease: [0.2, 0.8, 0.2, 1],
    },
  }),
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

export interface SectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

const Section = ({ title, description, children, className }: SectionProps) => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [24, 0])

  return (
    <div
      style={{ transform: `translateY(${y}px)` }}
      className={cn('mb-8', className)}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-tight">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-sm text-muted-foreground/70">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}

export interface FormFieldProps {
  label: string
  children: React.ReactNode
  className?: string
}

const FormField = ({ label, children, className }: FormFieldProps) => (
  <div className={cn('space-y-2', className)}>
    <Label htmlFor="field">{label}</Label>
    {children}
  </div>
)

export interface ToggleRowProps {
  title: string
  description?: string
  enabled: boolean
  onToggle: () => void
  className?: string
}

const ToggleRow = ({ title, description, enabled, onToggle, className }: ToggleRowProps) => (
  <div
    role="switch"
    aria-checked={enabled}
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onToggle()
      }
    }}
    onClick={onToggle}
    className={cn(
      'flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30',
      enabled ? 'bg-muted/30' : 'bg-background',
      className,
    )}
  >
    <div>
      <h4 className="font-medium">{title}</h4>
      {description && (
        <p className="text-sm text-muted-foreground/70 mt-1">
          {description}
        </p>
      )}
    </div>
    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      className={cn(
        'h-8 px-3 rounded-full transition-colors duration-200',
        enabled ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-muted',
      )}
    >
      <span className="text-xs">{enabled ? 'On' : 'Off'}</span>
    </Button>
  </div>
)

export interface RowProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

const Row = ({ title, description, children, className }: RowProps) => (
  <div className={cn('space-y-4', className)}>
    <div>
      <h3 className="font-medium text-lg">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground/70 mt-1">
          {description}
        </p>
      )}
    </div>
    {children}
  </div>
)

export default function Settings({ className }: SettingsProps) {
  const [notificationsEnabled, setNotificationsEnabled] = true
  const [twoFactorEnabled, setTwoFactorEnabled] = false
  const [emailVerified, setEmailVerified] = true

  return (
    <main className={cn('min-h-screen bg-background', className)}>
      <div className="container max-w-4xl px-6 py-12">
        <header className="mb-12 space-y-4 animate-in fade-in slide-in-from-top-8 duration-700">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground/70 max-w-xl">
            Manage your account preferences, security settings, and integrations.
            Changes are saved automatically.
          </p>
        </header>

        <div className="space-y-8">
          {/* Profile Section */}
          <Section title="Profile" description="Update your personal information and display name.">
            <Row title="Basic Information">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField label="Display Name">
                  <Input defaultValue="Alex Morgan" placeholder="Enter your name" />
                </FormField>
                <FormField label="Email Address">
                  <Input defaultValue="alex@syntheon.dev" type="email" />
                </FormField>
              </div>
            </Row>

            <Row title="Bio & Avatar">
              <p className="text-sm text-muted-foreground/70 mb-4">
                Add a short bio that appears on your public profile.
              </p>
              <Input placeholder="Tell us about yourself..." />
            </Row>
          </Section>

          {/* Notifications Section */}
          <Section title="Notifications" description="Configure how and when you receive updates.">
            <div className="space-y-2">
              <ToggleRow
                title="Email Notifications"
                description="Receive email summaries of your activity."
                enabled={notificationsEnabled}
                onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
              />
              <ToggleRow
                title="Push Notifications"
                description="Get real-time alerts for important events."
                enabled={false}
                onToggle={() => {}}
              />
            </div>
          </Section>

          {/* Security Section */}
          <Section title="Security" description="Keep your account secure with two-factor authentication.">
            <Row title="Two-Factor Authentication">
              <p className="text-sm text-muted-foreground/70 mb-4">
                Add an extra layer of protection to your account.
              </p>
              <ToggleRow
                title={twoFactorEnabled ? '2FA Enabled' : 'Enable 2FA'}
                description={
                  twoFactorEnabled
                    ? 'Your account is protected with a second verification step.'
                    : 'Scan the QR code in your authenticator app to enable.'
                }
                enabled={twoFactorEnabled}
                onToggle={() => setTwoFactorEnabled(!twoFactorEnabled)}
              />
            </Row>

            <div className="pt-4">
              {emailVerified ? (
                <Badge variant="secondary" className="mb-2">
                  ✓ Email verified
                </Badge>
              ) : (
                <Button variant="outline" size="sm" className="mb-2">
                  Verify email
                </Button>
              )}
            </div>
          </Section>

          {/* Integrations Section */}
          <Section title="Integrations" description="Connect third-party services and tools.">
            <Row title="Connected Services">
              <div className="space-y-3">
                {['GitHub', 'Linear', 'Figma'].map((service) => (
                  <ToggleRow
                    key={service}
                    title={`${service} Integration`}
                    description={`Sync your ${service.toLowerCase()} projects and notifications.`}
                    enabled={true}
                    onToggle={() => {}}
                  />
                ))}
              </div>
            </Row>

            <Button className="w-full py-6">
              Connect New Service
            </Button>
          </Section>

          {/* Appearance Section */}
          <Section title="Appearance" description="Customize how the interface looks and feels.">
            <div className="space-y-4">
              <Row title="Theme Preferences">
                <p className="text-sm text-muted-foreground/70 mb-3">
                  Choose your preferred color scheme for the application.
                </p>
                <div className="flex gap-3">
                  {['light', 'dark', 'system'].map((theme) => (
                    <Button
                      key={theme}
                      variant="outline"
                      size="sm"
                      className={cn(
                        theme === 'dark' && 'bg-background border-primary/50',
                      )}
                    >
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </Button>
                  ))}
                </div>
              </Row>

              <Row title="Animations">
                <p className="text-sm text-muted-foreground/70 mb-3">
                  Enable or disable motion effects throughout the app.
                </p>
                <ToggleRow
                  title={true ? 'Smooth Animations' : 'Reduce Motion'}
                  description={
                    true
                      ? 'Enable smooth transitions and hover effects.'
                      : 'Minimize animations for better accessibility.'
                  }
                  enabled={true}
                  onToggle={() => {}}
                />
              </Row>
            </div>
          </Section>

          {/* Footer */}
          <Card className="border-border/50">
            <CardContent className="pt-6 pb-8">
              <h3 className="font-medium mb-4">General</h3>
              <div className="space-y-2">
                <ToggleRow
                  title="Dark Mode by Default"
                  description="Remember your theme preference across devices."
                  enabled={false}
                  onToggle={() => {}}
                />
                <ToggleRow
                  title="Show Avatars"
                  description="Display profile pictures in the interface."
                  enabled={true}
                  onToggle={() => {}}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AnimatePresence>
        {(notificationsEnabled || twoFactorEnabled) && (
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <Card className="shadow-lg border-border/50">
              <CardContent className="py-3 px-4">
                <p className="text-sm text-muted-foreground/70">
                  {twoFactorEnabled && 'Two-factor authentication is now active.'}
                  {notificationsEnabled && !twoFactorEnabled && (
                    <>
                      Email notifications are enabled.{' '}
                      <a href="#" className="underline hover:text-primary">
                        Manage preferences
                      </a>
                    </>
                  )}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
