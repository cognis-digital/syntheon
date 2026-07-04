import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Search, ChevronDown, ChevronUp, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'

interface FaqItemProps {
  question: string
  answer: string
  id: number
}

const faqData: FaqItemProps[] = [
  {
    id: 1,
    question: "What is Syntheon?",
    answer: "Syntheon is a next-generation app builder that combines powerful motion design with robust engineering. It lets you ship premium UIs in minutes, not weeks."
  },
  {
    id: 2,
    question: "Is it truly production-ready?",
    answer: "Yes. Built on Next.js 15, TypeScript, and shadcn/ui, Syntheon ships code that scales with your business. Every component is typed, accessible, and performant."
  },
  {
    id: 3,
    question: "How fast can I build?",
    answer: "From concept to deployment in hours. Our motion primitives handle the heavy lifting while you focus on creativity."
  },
  {
    id: 4,
    question: "Does it work with dark mode?",
    answer: "Absolutely. Every component respects system preferences and CSS variables for seamless light/dark transitions."
  }
]

const HeroSection = () => {
  const containerRef = React.useRef(null)
  const [bounds, setBounds] = React.useState({ top: 0, height: 0 })

  React.useEffect(() => {
    if (containerRef.current) {
      setBounds({
        top: 0,
        height: containerRef.current.getBoundingClientRect().height
      })
    }
  }, [])

  const [scrollY] = useScroll()
  const y1 = useTransform(scrollY, [0, bounds.height], [0, -50])

  return (
    <motion.section
      ref={containerRef}
      className="relative py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: y1 }}
      >
        <div className="h-full w-full bg-gradient-to-b from-violet-500/20 to-transparent blur-[100px]" />
      </motion.div>

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-8"
        >
          <span className="bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
            Frequently Asked Questions
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xl text-muted-foreground leading-relaxed"
        >
          Everything you need to know about building with Syntheon — from first principles to production deployment.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex items-center justify-center gap-2 mt-8"
        >
          <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
          <span className="text-sm text-muted-foreground">Built for motion designers</span>
        </motion.div>
      </div>
    </motion.section>
  )
}

const SearchBar = () => {
  const [query, setQuery] = React.useState('')
  const filtered = faqData.filter(item =>
    item.question.toLowerCase().includes(query.toLowerCase()) ||
    item.answer.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="relative max-w-xl mx-auto mb-16"
    >
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        placeholder="Search questions..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
      />
    </motion.div>
  )
}

const FaqItem = ({ item }: { item: FaqItemProps }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: item.id * 0.05, duration: 0.4, ease: "easeOut" }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 rounded-xl border border-border bg-card hover:border-violet-500/30 transition-colors group"
        aria-expanded={isOpen}
      >
        <div className="flex items-start gap-4">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="mt-1 text-muted-foreground shrink-0"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-violet-400 transition-colors">
              {item.question}
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="text-muted-foreground leading-relaxed overflow-hidden"
                >
                  {item.answer}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="ml-auto text-violet-400/50 group-hover:text-violet-400 transition-colors">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </button>
    </motion.div>
  )
}

const CtaSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto text-center"
    >
      <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-8">
        Ready to build something amazing?
      </h2>
      <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
        Start your project with Syntheon today. No credit card required.
      </p>
      <motion.a
        href="/pricing"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors"
      >
        Get Started Free <ArrowRight className="w-5 h-5" />
      </motion.a>
    </motion.section>
  )
}

export interface FaqPageProps {
  searchQuery?: string
}

export default function FaqPage({ searchQuery = '' }: FaqPageProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [bounds, setBounds] = React.useState({ top: 0, height: 0 })

  React.useEffect(() => {
    if (containerRef.current) {
      setBounds({
        top: 0,
        height: containerRef.current.getBoundingClientRect().height
      })
    }
  }, [])

  return (
    <main ref={containerRef} className="min-h-screen bg-background">
      <HeroSection />
      <SearchBar />

      <motion.section
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto"
      >
        <div className="grid gap-8">
          {faqData.map((item) => (
            <FaqItem key={item.id} item={item} />
          ))}
        </div>

        <CtaSection />
      </motion.section>
    </main>
  )
}
