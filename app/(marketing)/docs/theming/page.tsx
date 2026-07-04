import { cn } from '@/lib/utils'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Button, Card, Badge, Input, TabsContent, TabsList, TabsTrigger, Tabs, Separator } from '@/components/ui'
import { Copy, Palette, Layers, Sparkles, ChevronRight, CheckCircle2, Zap, Box, Moon, Sun, Code2, MousePointer2 } from 'lucide-react'

interface TokenRowProps {
  name: string
  value: string
  hex?: string
  type: 'color' | 'spacing' | 'radius' | 'other'
}

const TOKENS: Record<string, TokenRowProps[]> = {
  colors: [
    { name: 'bg-background', value: 'var(--background)', hex: '#0a0a0f', type: 'color' },
    { name: 'text-foreground', value: 'var(--foreground)', hex: '#f5f3ff', type: 'color' },
    { name: 'text-primary', value: 'var(--primary)', hex: '#8b5cf6', type: 'color' },
    { name: 'bg-muted', value: 'var(--muted)', hex: '#1a1a24', type: 'color' },
  ],
  spacing: [
    { name: 'gap-1', value: '0.25rem', type: 'spacing' },
    { name: 'gap-2', value: '0.5rem', type: 'spacing' },
    { name: 'p-4', value: '1rem', type: 'spacing' },
  ],
  radius: [
    { name: 'rounded-none', value: '0px', type: 'radius' },
    { name: 'rounded-sm', value: '0.25rem', type: 'radius' },
    { name: 'rounded-md', value: '0.375rem', type: 'radius' },
    { name: 'rounded-lg', value: '0.5rem', type: 'radius' },
  ],
}

const Hero = () => {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, -60])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.7])

  return (
    <motion.section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/40 via-background to-background" />
      
      <motion.div 
        style={{ y: y1, opacity }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
          <Badge variant="outline" className="bg-background/80 backdrop-blur border-violet-500/30">
            Design System v1.0
          </Badge>
        </div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
        >
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
            Theming
          </span>
          <br />
          <span className="text-muted-foreground/80">Build with intention</span>
        </motion.h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
          A semantic, accessible design system built on CSS custom properties and Tailwind utility classes. 
          Every token serves a purpose—no gratuitous choices.
        </p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex items-center justify-center gap-4"
        >
          <Button size="lg" variant="primary">
            Start Building
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
          <Button variant="outline" size="lg">
            View Tokens
          </Button>
        </motion.div>
      </motion.div>

      <div 
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"
      />
    </motion.section>
  )
}

const TokenInspector = ({ tokens, title }: { tokens: TokenRowProps[], title: string }) => {
  const [copied, setCopied] = React.useState<string | null>(null)

  return (
    <Card className="border-border/50 bg-background/80 backdrop-blur">
      <div className="p-6 border-b border-border/30 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Badge variant="secondary" className="bg-muted text-xs">
          {tokens.length} tokens
        </Badge>
      </div>

      <div className="divide-y divide-border/10">
        {tokens.map((token, index) => (
          <motion.div
            key={token.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors"
          >
            <div 
              className={cn(
                'w-12 h-8 rounded-md border border-border/30',
                token.type === 'color' && `bg-${token.name.replace('bg-', '')}`
              )}
              style={{ backgroundColor: token.hex }}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <code className={cn(
                  'text-sm font-mono',
                  token.type === 'color' ? 'text-violet-400' : 'text-muted-foreground'
                )}>
                  {token.name}
                </code>
              </div>
              <p className="text-xs text-muted-foreground">
                {token.value}
              </p>
            </div>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(token.name)
                setCopied(token.name)
                setTimeout(() => setCopied(null), 1500)
              }}
              className={cn(
                'h-8 w-8 p-0 rounded-full',
                copied === token.name && 'text-violet-400'
              )}
            >
              {copied === token.name ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </motion.div>
        ))}
      </div>

      {tokens.length === 0 && (
        <p className="p-6 text-center text-muted-foreground">
          No tokens available in this category.
        </p>
      )}
    </Card>
  )
}

const CodePreview = () => {
  const code = `// Import the cn helper for conditional classes
import { cn } from '@/lib/utils'

// Use semantic token names directly
<div className={cn(
  'bg-background',           // Base layer
  'text-foreground',         // Typography
  'border-border',          // Separation
  'rounded-lg',             // Shape
  'p-4 gap-2'               // Spacing
)}>
  Content here
</div>

// Compose multiple tokens safely
const container = cn(
  'flex items-center justify-center min-h-screen bg-background',
  className
)
`

  return (
    <Card className="border-border/50 bg-background/80 backdrop-blur">
      <div className="p-6 border-b border-border/30 flex items-center gap-4">
        <Code2 className="w-5 h-5 text-violet-400" />
        <h3 className="text-lg font-semibold">In Your Code</h3>
      </div>

      <pre className="p-6 overflow-x-auto">
        <code className={cn(
          'font-mono text-sm',
          'bg-muted/50 rounded-md p-4 border border-border/20'
        )}>
          {code}
        </code>
      </pre>

      <div className="p-6 pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Tokens are designed to compose. Mix and match semantic names like{' '}
          <span className="font-mono text-violet-400">bg-background</span>,{' '}
          <span className="font-mono text-violet-400">text-primary</span>, and{' '}
          <span className="font-mono text-violet-400">gap-2</span> to build 
          consistent interfaces across your application.
        </p>
      </div>
    </Card>
  )
}

const FeatureHighlight = ({ icon: Icon, title, description }: { 
  icon: React.ElementType; 
  title: string; 
  description: string 
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-6 rounded-xl border border-border/30 bg-background/50 backdrop-blur hover:border-violet-500/40 transition-colors"
    >
      <Icon className="w-8 h-8 text-violet-400 mb-4" />
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}

const Content = () => {
  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Design Tokens Reference
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
          Every visual property in Syntheon is backed by a semantic token. 
          These tokens map to CSS custom properties, ensuring consistent rendering across platforms and easy theming at runtime.
        </p>
      </div>

      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-background/50 border border-border/30 rounded-lg p-1">
          {['colors', 'spacing', 'radius'].map((category) => (
            <TabsTrigger 
              key={category}
              value={category}
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <AnimatePresence mode="wait">
          {(['colors', 'spacing', 'radius'] as const).map((category) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TokenInspector 
                tokens={TOKENS[category]}
                title={category.charAt(0).toUpperCase() + category.slice(1)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </Tabs>

      <div className="mt-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Why This System?
        </h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <FeatureHighlight 
            icon={Palette}
            title="Semantic Naming"
            description="Names describe intent, not implementation. 'bg-background' clearly communicates the purpose of the token."
          />

          <FeatureHighlight 
            icon={Layers}
            title="CSS Custom Properties"
            description="Tokens map to CSS variables, enabling runtime theming and platform-specific overrides without JavaScript."
          />

          <FeatureHighlight 
            icon={Zap}
            title="Performance First"
            description="Utility classes compile to minimal CSS. No runtime overhead for token resolution—just pure utility."
          />

          <FeatureHighlight 
            icon={Moon}
            title="Dark Mode Ready"
            description="Semantic tokens automatically adapt between light and dark modes through CSS variable interpolation."
          />
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Motion & Interactions
        </h2>

        <Card className="border-border/50 bg-background/80 backdrop-blur overflow-hidden">
          <div className="p-6 border-b border-border/30 flex items-center gap-4">
            <MousePointer2 className="w-5 h-5 text-violet-400" />
            <h3 className="text-lg font-semibold">Interactive Preview</h3>
          </div>

          <div className="p-12 bg-muted/30 min-h-[400px] flex items-center justify-center relative overflow-hidden">
            <motion.div 
              drag
              dragConstraints={{ top: 50, bottom: 50, left: 50, right: 50 }}
              animate={{ x: [0, -20, 20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-64 h-48 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-border/30 backdrop-blur cursor-grab active:cursor-grabbing hover:border-violet-400/50 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background/80 to-transparent opacity-50" />
              
              <motion.div 
                dragMomentum={false}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="absolute inset-4 rounded-lg bg-background border border-border/30 flex items-center justify-center"
              >
                <MousePointer2 className="w-6 h-6 text-violet-400 opacity-50" />
              </motion.div>

              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-xs text-muted-foreground font-mono">
                  Drag to explore • Hover for effects
                </p>
              </div>
            </motion.div>
          </div>

          <div className="p-6 pt-0">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Motion is purposeful and respects user preferences. The{' '}
              <code className="font-mono text-violet-400">useReducedMotion</code> hook gates animations 
              for users who prefer reduced motion, ensuring accessibility without sacrificing delight.
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-20 flex items-center justify-center gap-4">
        <Button size="lg" variant="primary">
          Explore Full Documentation
          <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </section>
  )
}

export interface ThemingPageProps {}

export default function ThemingPage() {
  return (
    <>
      <Hero />
      <Content />
    </>
  )
}
