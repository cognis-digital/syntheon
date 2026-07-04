import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  delay?: number
}

interface CodeBlockProps {
  language: string
  code: string
  title?: string
}

const features = [
  {
    icon: '⚡',
    title: 'Real-time Generation',
    description: 'Stream responses as they're being created with WebSocket connections.'
  },
  {
    icon: '🎯',
    title: 'Context-Aware Memory',
    description: 'Maintain conversation history across sessions with intelligent summarization.'
  },
  {
    icon: '🔒',
    title: 'Enterprise Security',
    description: 'End-to-end encryption, SOC2 compliance, and audit logging built-in.'
  }
]

const codeSamples = [
  {
    language: 'typescript',
    code: `// Initialize the engine with your API key
import { GenerationEngine } from '@syntheon/core'

const engine = new GenerationEngine({
  apiKey: process.env.NEXT_PUBLIC_SYNTHEON_API_KEY,
  model: 'gpt-4-turbo',
  temperature: 0.7,
})

// Create a generation session
const session = await engine.createSession({
  systemPrompt: \`You are a helpful assistant...`,
  maxTokens: 2048,
})

// Stream the response
for await (const chunk of session.stream()) {
  console.log(chunk)
}`,
    title: 'Basic Setup'
  }
]

export interface GenerationEnginePageProps {}

export const metadata = {
  title: 'Generation Engine — Syntheon Docs',
  description: 'Build production-grade AI applications with the Syntheon generation engine.',
}

function Hero() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [-50, 0])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.7])

  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
      style={{ background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-muted) 100%)' }}
    >
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-20 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[128px]"
        animate={{ scale: [1, 1.2, 1], x: [-50, 50, -50] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-40 right-1/3 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[128px]"
        animate={{ scale: [1, 1.1], rotate: [0, 90, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />

      <div className="container mx-auto px-4 py-24 relative z-10">
        <motion.div
          style={{ y: y1, opacity }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Badge variant="secondary" className="rounded-full px-4 py-1 text-sm">
              v2.0 Beta
            </Badge>
            <span className="text-muted-foreground text-sm">Documentation</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Generation
            </motion.span>
            {' '}Engine
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mb-12">
            The production-ready foundation for building intelligent applications with Syntheon&apos;s AI infrastructure.
          </p>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Button size="lg" className="rounded-full px-8 py-6 text-lg">
              Start Building
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg">
              Read the Guide
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-border rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-2 h-2 bg-primary rounded-full"
            animate={{ y: [0, 8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </motion.section>
  )
}

function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="h-full border-border bg-card/50 backdrop-blur-sm group-hover:border-primary/50 transition-colors">
        <CardHeader>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-2xl">{icon}</span>
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              {title.split(' ')[0]}
            </Badge>
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </CardContent>
      </Card>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backdropFilter: 'blur(8px)' }}
      />
    </motion.div>
  )
}

function CodeBlock({ language, code, title }: CodeBlockProps) {
  return (
    <motion.div
      className="rounded-lg overflow-hidden border-border bg-muted/30"
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-background border-b border-border">
        <span className="text-sm text-muted-foreground font-mono">{title || language}</span>
        <Badge variant="outline" className="rounded-full px-2 py-1 text-xs">
          TypeScript
        </Badge>
      </div>
      <ScrollArea className="p-4 max-h-[300px]">
        <pre className="text-sm font-mono leading-relaxed overflow-x-auto">
          {code}
        </pre>
      </ScrollArea>
    </motion.div>
  )
}

export default function GenerationEnginePage() {
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.6])

  return (
    <main className="min-h-screen bg-background">
      <Hero />

      {/* Features section */}
      <section className="container mx-auto px-4 py-24 relative">
        <motion.div
          style={{ opacity: heroOpacity }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Production
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every feature is engineered with performance, reliability, and developer experience in mind.
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} delay={index * 0.15} />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Code section */}
      <section className="container mx-auto px-4 py-24 bg-muted/30 rounded-3xl my-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-4">Get Started in Minutes</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Initialize the engine with your API key and start streaming responses immediately. Full documentation available at docs.syntheon.dev.
            </p>

            <div className="space-y-4">
              {codeSamples.map((sample, index) => (
                <CodeBlock
                  key={index}
                  language={sample.language}
                  code={sample.code}
                  title={sample.title}
                />
              ))}
            </div>

            <Button className="mt-8 rounded-full px-6 py-3">
              View Full API Reference →
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            {/* Decorative animated elements */}
            <motion.div
              className="absolute -top-8 -right-8 w-24 h-24 bg-primary/10 rounded-full blur-xl"
              animate={{ scale: [1, 1.3], rotate: [0, 180] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -bottom-8 -left-8 w-20 h-20 bg-accent/10 rounded-full blur-xl"
              animate={{ scale: [1, 1.2], rotate: [0, -90] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />

            <Card className="relative border-border bg-background/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    Live Status
                  </Badge>
                  <span className="text-green-500 text-sm font-medium flex items-center gap-2">
                    ● Operational
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Uptime</span>
                    <span className="font-mono">99.97%</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: '98%' }}
                      transition={{ duration: 1.5, delay: 0.6 }}
                    />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Requests/second</span>
                    <motion.span
                      className="font-mono"
                      animate={{ opacity: [1, 0.8, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      124,593
                    </motion.span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg. Latency</span>
                    <span className="font-mono">87ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to build something amazing?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10">
            Join thousands of developers shipping production AI applications with Syntheon.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Input placeholder="Enter your email" className="rounded-full px-6 py-3 min-w-[280px]" />
            <Button size="lg" className="rounded-full px-8 py-3 text-lg">
              Get Started Free
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-border bg-muted/30">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">
            © 2024 Syntheon. All rights reserved.
          </p>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Docs</a>
            <a href="#" className="hover:text-primary transition-colors">API Reference</a>
            <a href="#" className="hover:text-primary transition-colors">Status</a>
          </nav>
        </div>
      </footer>
    </main>
  )
}

// Type exports for external use
export type { GenerationEnginePageProps }
