import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface HeroTerminalProps {
  title?: string
  subtitle?: string
  commands?: Array<{
    command: string
    description: string
    duration?: number
  }>
  ctaText?: string
  ctaUrl?: string
  showCursor?: boolean
}

const defaultCommands = [
  {
    command: 'npm install syntheon',
    description: 'Install the premium package',
    duration: 150,
  },
  {
    command: 'npx syntheon init --prod',
    description: 'Initialize production environment',
    duration: 200,
  },
  {
    command: 'syntheon deploy --all',
    description: 'Deploy to all environments',
    duration: 180,
  },
]

const terminalColors = {
  primary: '#a78bfa', // violet-400
  secondary: '#6366f1', // indigo-500
  accent: '#2dd4bf', // teal-400
  success: '#34d399', // emerald-400
}

const terminalVariants = {
  initial: (delay: number) => ({
    opacity: 0,
    y: 15,
    transition: {
      duration: 0.6,
      delay: delay,
      ease: [0.23, 1, 0.32, 1],
    },
  }),
  animate: {
    opacity: 1,
    y: 0,
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
  focus: {
    scale: 1.05,
    x: [0, -3, 3, -3, 3, 0],
    transition: { duration: 0.4 },
  },
}

const cursorBlink = {
  initial: { opacity: 1 },
  animate: {
    opacity: 0,
    transition: {
      duration: 0.7,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

const HeroTerminal = ({
  title = 'Syntheon Terminal',
  subtitle = 'Premium SaaS Infrastructure for Modern Teams',
  commands = defaultCommands,
  ctaText = 'Get Started',
  ctaUrl = '#',
  showCursor = true,
}: HeroTerminalProps) => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-background overflow-hidden">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: [1.5, 2], opacity: 0.3 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 max-w-4xl mx-auto px-6"
      >
        {/* Header */}
        <motion.div
          variants={terminalVariants.initial.bind(null, 0)}
          initial="initial"
          animate="animate"
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="outline" className="h-6 px-2 text-xs border-border/50">
              v2.0.0-beta
            </Badge>
            <span className="text-muted-foreground text-sm flex items-center gap-1.5">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="w-2 h-2 rounded-full bg-primary"
              />
              Connected • {new Date().toLocaleTimeString()}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-3">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {title}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Terminal Interface */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-2xl shadow-primary/10 overflow-hidden">
          <CardContent className="p-6 md:p-8">
            {/* Terminal Header Bar */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-muted-foreground">syntheon@prod:~/project</span>
            </div>

            {/* Terminal Output */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="space-y-2"
            >
              {commands.map((cmd, index) => (
                <motion.div
                  key={index}
                  variants={terminalVariants.initial.bind(null, index * 0.1)}
                  initial="initial"
                  animate="animate"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-24 text-primary font-mono text-sm flex-shrink-0">
                    {cmd.command}
                  </div>
                  <motion.p
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                    className="text-muted-foreground text-sm leading-relaxed group-hover:text-primary/70 transition-colors"
                  >
                    {cmd.description}
                  </motion.p>
                </motion.div>
              ))}

              {/* Progress Indicator */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={commands.length - 1}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2 text-primary/60">
                    <motion.div
                      animate={{ rotate: 45 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-4 h-4 border-2 border-current rounded-sm"
                    />
                    <span className="text-xs">Running final checks...</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Cursor Effect */}
              {showCursor && (
                <motion.div
                  variants={cursorBlink}
                  initial="initial"
                  animate="animate"
                  className="w-2 h-5 bg-primary/80 rounded-sm inline-block ml-1"
                />
              )}
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: commands.length * 0.1 + 0.3 }}
              className="mt-6 pt-4 border-t border-border/50"
            >
              <Button asChild size="lg" className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                <a href={ctaUrl} className="flex items-center gap-2">
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {ctaText}
                  </motion.span>
                </a>
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        {/* Decorative Elements */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 opacity-0 md:opacity-30">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-2 h-2 rounded-full bg-primary"
          />
        </div>

        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 md:opacity-30">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-2 h-2 rounded-full bg-secondary"
          />
        </div>
      </motion.div>

      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(167, 139, 250, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(167, 139, 250, 1) 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
        }}
      />

      {/* Ambient Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute -inset-96 pointer-events-none bg-gradient-to-br from-primary/40 via-transparent to-secondary/40 blur-[100px]"
      />
    </section>
  )
}

export default HeroTerminal
export type { HeroTerminalProps }
