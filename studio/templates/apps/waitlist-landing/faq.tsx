import { cn } from '@/lib/utils'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Info, CheckCircle2, Zap, Shield, Globe, ArrowRight } from 'lucide-react'

interface FAQItemProps {
  question: string
  answer: string
  id?: string
}

const defaultItems: FAQItemProps[] = [
  {
    id: 'pricing',
    question: 'How much does Syntheon cost?',
    answer: 'We offer a free tier for individuals and startups. Pro plans start at $29/month with advanced features, analytics, and priority support. Enterprise pricing is available upon request.'
  },
  {
    id: 'timeline',
    question: 'When will the public launch be?',
    answer: 'We are currently accepting waitlist signups. The public beta launches in Q2 2025. Early access members get a lifetime discount and exclusive features.'
  },
  {
    id: 'features',
    question: 'What makes Syntheon different from competitors?',
    answer: 'Syntheon combines real-time collaboration, AI-powered insights, and seamless integrations in one platform. Our unique architecture ensures sub-100ms latency even at scale.'
  },
  {
    id: 'support',
    question: 'How can I get support after signing up?',
    answer: 'All users have access to our knowledge base and community forums. Pro customers receive email support within 24 hours, while Enterprise gets a dedicated success manager.'
  },
  {
    id: 'security',
    question: 'Is my data secure with Syntheon?',
    answer: 'Yes. We use AES-256 encryption at rest and TLS 1.3 in transit. SOC 2 Type II compliance is pending, with regular third-party security audits.'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: 'easeOut'
    }
  })
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } }
}

export interface FAQProps {
  items?: FAQItemProps[]
  className?: string
}

const FAQItem = ({ question, answer, id }: FAQItemProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={itemVariants}
      className="border-b border-border last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`faq-${id}`}
        id={`faq-trigger-${id}`}
        className={cn(
          'w-full flex items-start gap-4 py-6 text-left',
          'group hover:bg-muted/30 transition-colors duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg'
        )}
      >
        <div className="mt-1 flex-shrink-0">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="text-primary"
          >
            <ChevronDown size={20} />
          </motion.div>
        </div>

        <span className={cn(
          'flex-1 text-foreground',
          'font-medium group-hover:text-primary transition-colors'
        )}>
          {question}
        </span>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <p className={cn(
                'text-foreground/70 leading-relaxed',
                'pl-14 border-l-2 border-primary/50 ml-6 py-2'
              )}>
                {answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  )
}

export default function FAQ({ items = defaultItems, className }: FAQProps) {
  const [scrollProgress, setScrollProgress] = React.useState(0)

  return (
    <section className={cn('py-24', 'bg-background', className)}>
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Info size={14} />
            <span>Frequently Asked Questions</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-primary/80 to-foreground/80 bg-clip-text text-transparent">
            Everything you need to know
          </h2>

          <p className={cn(
            'text-lg max-w-xl mx-auto',
            'text-foreground/60 leading-relaxed'
          )}>
            Still have questions? Reach out to our team — we respond within 24 hours.
          </p>
        </motion.div>

        <div className="space-y-2">
          {items.map((item, index) => (
            <FAQItem key={item.id} {...item} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: items.length * 0.1 + 0.5, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <button className={cn(
            'inline-flex items-center gap-2',
            'px-8 py-4 rounded-full font-medium transition-all',
            'bg-primary hover:bg-primary/90 active:scale-[0.98]',
            'text-primary-foreground shadow-lg shadow-primary/25',
            'hover:shadow-xl hover:shadow-primary/30',
            'focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50'
          )}>
            <ArrowRight size={18} />
            <span>Join the waitlist</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: items.length * 0.1 + 0.8, duration: 0.6 }}
          className="mt-12 pt-12 border-t border-border/50"
        >
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {[
              { Icon: Zap, label: 'Lightning Fast' },
              { Icon: Shield, label: 'Enterprise Security' },
              { Icon: Globe, label: 'Global Scale' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: items.length * 0.1 + 0.85 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-2 text-foreground/60"
              >
                <feature.Icon size={16} />
                <span className="text-sm">{feature.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export const FAQSection = Object.assign(FAQ, { defaultItems })
