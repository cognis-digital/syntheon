import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface ConceptCardProps {
  title: string
  description: string
  icon?: React.ReactNode
}

export interface ConceptsPageProps {}

const concepts = [
  {
    title: 'App Router',
    description: 'Next.js 15 App Router provides a file-system based routing system with advanced features like loading states, error boundaries, and server components.',
    icon: <span className="text-2xl">📁</span>,
  },
  {
    title: 'TypeScript',
    description: 'Full type safety from component props to API responses. Catch errors at compile time, not in production.',
    icon: <span className="text-2xl">⚡️</span>,
  },
  {
    title: 'Tailwind CSS',
    description: 'Utility-first CSS framework with semantic token integration for consistent design systems across your application.',
    icon: <span className="text-2xl">🎨</span>,
  },
  {
    title: 'shadcn/ui',
    description: 'Copy-paste components built on Radix UI primitives. Fully customizable, accessible, and designed for production.',
    icon: <span className="text-2xl">💎</span>,
  },
]

const heroVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1],
    },
  }),
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, rotateX: 180 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delayChildren: i * 0.1,
      staggerChildren: 0.1,
    },
  }),
}

export default function ConceptsPage() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [scrollProgress] = useTransform(
    useScroll({
      target: containerRef,
      offset: ['start start', 'end end'],
    }),
    (scrollY) => scrollY / 100 + 0.2
  )

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground"
    >
      {/* Hero Section */}
      <motion.section
        className="relative min-h-[85vh] flex items-center justify-center px-6 md:px-12 lg:px-24 overflow-hidden"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background opacity-70" />
        
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-8 inline-flex items-center gap-2"
          >
            <Badge variant="secondary" className="h-8 px-4 text-sm">
              Documentation
            </Badge>
            <span className="text-muted-foreground text-sm hidden md:inline">
              / docs / concepts
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Concepts
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Understand the core technologies powering Syntheon&apos;s app builder and what makes them powerful for production applications.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-12 flex items-center justify-center gap-4"
          >
            <Button variant="primary" size="lg">
              Start Building
            </Button>
            <Button variant="secondary" size="lg">
              View API Reference
            </Button>
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 1.5 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-[100px]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 1.5 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5, repeatType: 'reverse' }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-[100px]"
        />

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground"
        >
          <span className="text-sm">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-2 h-4 bg-current rounded-full"
          />
        </motion.div>
      </motion.section>

      {/* Content Section */}
      <section className="px-6 md:px-12 lg:px-24 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-semibold mb-8"
          >
            Core Technologies
          </motion.h2>

          <div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          >
            {concepts.map((concept, i) => (
              <motion.div key={i} variants={cardVariants}>
                <Card className="h-full border-border/50 hover:border-border transition-colors duration-300 group cursor-default">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                          className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl"
                        >
                          {concept.icon}
                        </motion.div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {concept.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Production-ready, type-safe, and developer-focused.
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {concept.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Separator className="my-16" />

          {/* Quick Reference */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl md:text-3xl font-semibold mb-8"
          >
            Quick Reference
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Installation */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Installation</CardTitle>
                <CardDescription>Get started in three commands.</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-6 rounded-xl overflow-x-auto text-sm font-mono">
                  {`# Create a new project
npx create-next-app@latest my-app --typescript --tailwind

# Install dependencies
cd my-app
npm install framer-motion @radix-ui/react-dialog

# Start development server
npm run dev`}
                </pre>
              </CardContent>
            </Card>

            {/* Project Structure */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Project Structure</CardTitle>
                <CardDescription>Recommended layout for Syntheon projects.</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-6 rounded-xl overflow-x-auto text-sm font-mono">
                  {`app/
├── (marketing)/          # Marketing pages
│   └── docs/             # Documentation
│       └── concepts/     # This page
├── components/ui/        # shadcn/ui primitives
├── lib/
│   ├── utils.ts          # cn helper, formatters
│   └── types.ts           # Global type definitions
├── hooks/                # Custom React hooks
└── styles/globals.css    # Global styles`}
                </pre>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-16" />

          {/* Best Practices */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl md:text-3xl font-semibold mb-8"
          >
            Best Practices
          </motion.h2>

          <div className="space-y-4">
            {[
              { title: 'Type Safety', desc: 'Define interfaces for all props. Use `any` sparingly and only when necessary.', icon: '🔒' },
              { title: 'Performance', desc: 'Use React.memo for expensive components. Implement virtualization for large lists with embla-carousel-react.', icon: '⚡️' },
              { title: 'Accessibility', desc: 'Ensure all interactive elements have keyboard support and ARIA attributes. Test with screen readers.', icon: '♿️' },
              { title: 'Motion', desc: 'Gate animations behind prefers-reduced-motion. Keep motion purposeful, not decorative.', icon: '🎬' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-start gap-4 p-6 rounded-xl bg-muted/30 border border-border/30 hover:border-primary/30 transition-colors"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 p-8 md:p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-background border border-border/30"
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">Ready to build something amazing?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start with our interactive tutorials or dive into the API reference.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Button variant="primary" size="lg">
                  Start Tutorial
                </Button>
                <Button variant="secondary" size="lg">
                  API Reference
                </Button>
                <Button variant="ghost" size="lg">
                  GitHub
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 lg:px-24 py-12 border-t border-border/30">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <p>© 2024 Syntheon. Built with Next.js 15, TypeScript, and Tailwind CSS.</p>
          <nav className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors">Documentation</a>
            <a href="#" className="hover:text-primary transition-colors">API Reference</a>
            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
          </nav>
        </div>
      </footer>
    </motion.div>
  )
}

// Metadata for SEO and social sharing
export const metadata: { title: string; description: string } = {
  title: 'Concepts — Syntheon Documentation',
  description: 'Understand the core technologies powering Syntheon&apos;s app builder: Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.',
}
