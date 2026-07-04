'use client'

import { useState, useScroll, useTransform, useInView } from 'framer-motion'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface FAQItemProps {
  question: string
  answer: string
  id?: string
  accentColor?: 'default' | 'primary' | 'muted'
}

const variant = {
  default: {
    background: 'bg-background',
    border: 'border-border',
    text: 'text-foreground',
    hover: 'hover:bg-accent/50',
    active: 'active:bg-accent/60',
  },
  primary: {
    background: 'bg-primary',
    border: 'border-primary',
    text: 'text-primary-foreground',
    hover: 'hover:bg-primary/80',
    active: 'active:bg-primary/90',
  },
  muted: {
    background: 'bg-muted',
    border: 'border-border',
    text: 'text-muted-foreground',
    hover: 'hover:bg-muted/80',
    active: 'active:bg-muted/90',
  },
}

const defaultVariant = variant.default

export interface FAQProps {
  items: FAQItemProps[]
  variant?: keyof typeof variant | null
  searchPlaceholder?: string
  showSearch?: boolean
  accentColor?: 'default' | 'primary' | 'muted'
  className?: string
}

const defaultVariantName = 'default'

export const FAQItem = ({ question, answer, id, accentColor = 'default', ...props }: FAQItemProps & React.HTMLAttributes<HTMLDivElement>) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useInView({ threshold: 0.1 })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-background/80 backdrop-blur-sm',
        accentColor !== 'default' ? variant[accentColor].background : defaultVariant.background,
        accentColor !== 'default' ? variant[accentColor].border : defaultVariant.border,
        props.className
      )}
      ref={ref}
      {...props}
    >
      <div className="flex items-start gap-4 p-6">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-all duration-300',
            isOpen ? 'rotate-180' : '',
            accentColor !== 'default' ? variant[accentColor].text : defaultVariant.text,
            accentColor !== 'default' ? variant[accentColor].hover : defaultVariant.hover,
            props.className
          )}
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="h-5 w-5"
          >
            <ChevronDown size={18} strokeWidth={2.5} />
          </motion.div>
        </motion.button>

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'text-lg font-semibold leading-tight transition-colors duration-200',
            accentColor !== 'default' ? variant[accentColor].text : defaultVariant.text,
            isOpen ? accentColor === 'default' ? 'text-primary' : variant[accentColor].active : '',
            props.className
          )}>
            {question}
          </h3>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="overflow-hidden"
              >
                <p className={cn(
                  'mt-4 text-base leading-relaxed',
                  accentColor !== 'default' ? variant[accentColor].text : defaultVariant.text,
                  props.className
                )}>
                  {answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-3 flex items-center gap-2">
            <span className={cn(
              'text-xs transition-colors duration-200',
              accentColor !== 'default' ? variant[accentColor].muted : defaultVariant.muted,
              props.className
            )}>
              {isOpen ? 'Read more' : 'Click to expand'}
            </span>
          </div>
        </div>

        <motion.div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"
          style={{ background: 'linear-gradient(135deg, transparent 40%, rgba(var(--primary-hsl), 0.1) 100%)' }}
        />
      </div>

      <motion.div
        className="absolute inset-x-0 bottom-0 h-1 bg-primary/20 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
        style={{ background: `linear-gradient(to right, ${accentColor === 'default' ? 'var(--primary)' : accentColor === 'primary' ? 'var(--primary)' : 'var(--muted)'}, transparent)` }}
      />
    </motion.div>
  )
}

export const FAQ = ({ items, variant: v = defaultVariantName, searchPlaceholder = 'Search questions...', showSearch = false, accentColor = 'default', className }: FAQProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useInView({ threshold: 0.1 })

  const filteredItems = items.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'relative overflow-hidden rounded-3xl border bg-background/80 backdrop-blur-sm',
        accentColor !== 'default' ? variant[accentColor].background : defaultVariant.background,
        accentColor !== 'default' ? variant[accentColor].border : defaultVariant.border,
        className
      )}
      ref={containerRef}
    >
      <div className="relative">
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="absolute inset-x-0 top-4 z-10 flex items-center gap-2 px-6"
          >
            <Search size={18} className={cn('shrink-0', accentColor !== 'default' ? variant[accentColor].text : defaultVariant.text)} />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-full border-none bg-background/50 px-6 shadow-sm transition-all focus:bg-background focus:shadow-md"
            />
            {searchQuery && (
              <motion.button
                onClick={() => setSearchQuery('')}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                className="ml-2 rounded-full p-1 transition-all hover:bg-accent/50"
              >
                <X size={16} />
              </motion.button>
            )}
          </motion.div>
        )}

        <div className="p-8">
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className={cn(
                'flex flex-col items-center justify-center py-16 text-center',
                accentColor !== 'default' ? variant[accentColor].text : defaultVariant.text
              )}
            >
              <div className="mb-4 rounded-full bg-background/50 p-4">
                <Search size={32} className={cn('opacity-50', accentColor === 'muted' && 'opacity-30')} />
              </div>
              <p className="text-lg font-medium">{searchQuery ? 'No matching questions found.' : 'Start typing to search...'}</p>
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={`${item.id || item.question}--${index}`}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <FAQItem
                    question={item.question}
                    answer={item.answer}
                    id={item.id}
                    accentColor={accentColor}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{ background: 'radial-gradient(ellipse at center, rgba(var(--primary-hsl), 0.06) 0%, transparent 70%)' }}
        />

        <motion.div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-10"
          style={{ background: 'linear-gradient(135deg, transparent 40%, rgba(var(--primary-hsl), 0.08) 100%)' }}
        />

        <motion.div
          className="absolute inset-x-0 bottom-0 h-2 bg-primary/20 origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100"
          style={{ background: `linear-gradient(to right, ${accentColor === 'default' ? 'var(--primary)' : accentColor === 'primary' ? 'var(--primary)' : 'var(--muted)'}, transparent)` }}
        />
      </div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        style={{ background: 'radial-gradient(ellipse at top right, rgba(var(--primary-hsl), 0.04) 0%, transparent 60%)' }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.7 }}
        style={{ background: 'radial-gradient(ellipse at bottom left, rgba(var(--primary-hsl), 0.03) 0%, transparent 50%)' }}
      />
    </motion.div>
  )
}

const faqData = [
  {
    id: 'getting-started',
    question: 'How do I get started with the platform?',
    answer: 'Simply create an account and complete your profile setup. Our onboarding wizard will guide you through each step, from choosing your workspace to configuring your initial settings. You can access the tutorial center at any time for detailed walkthroughs.',
  },
  {
    id: 'pricing',
    question: 'What are the pricing tiers available?',
    answer: 'We offer three main plans: Starter (free), Professional, and Enterprise. The Starter plan includes core features with a generous free tier. Professional unlocks advanced capabilities and priority support. Enterprise provides custom solutions, dedicated account management, and SLA guarantees.',
  },
  {
    id: 'integration',
    question: 'Can I integrate my existing tools?',
    answer: 'Yes! Our platform supports over 500+ integrations out of the box. You can connect your favorite CRM, marketing automation tools, project management software, and more through our native API or marketplace extensions.',
  },
  {
    id: 'security',
    question: 'How is my data protected?',
    answer: 'We use industry-standard encryption (AES-256) for data at rest and TLS 1.3 for data in transit. Our infrastructure runs across multiple availability zones with automated backups every hour. We also perform quarterly third-party security audits.',
  },
  {
    id: 'support',
    question: 'What support channels are available?',
    answer: 'You can reach our support team via live chat, email, or phone depending on your plan tier. Enterprise customers get a dedicated success manager and 24/7 priority support. All plans include access to our knowledge base and community forums.',
  },
]

export default function DocsFAQ() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="mb-8">
          <h1 className={cn(
            'text-3xl font-bold tracking-tight sm:text-4xl',
            'bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'
          )}>
            Frequently Asked Questions
          </h1>
          <p className="mt-4 max-w-2xl text-lg">
            Find answers to common questions about the platform, pricing, integrations, and more. Can't find what you're looking for?{' '}
            <a href="/contact" className={cn(
              'font-medium underline decoration-primary/50 underline-offset-4 hover:decoration-primary transition-all',
              variant.default.text
            )}>
              Contact our team
            </a>
          </p>
        </div>

        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <FAQ items={faqData} variant="primary" accentColor="default" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {['Getting Started', 'Pricing & Plans', 'Integrations'].map((category) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group cursor-pointer rounded-xl border bg-background/50 p-6 transition-all hover:border-primary/40 hover:shadow-lg"
              >
                <h3 className="font-semibold">{category}</h3>
                <p className="mt-2 text-sm opacity-70 group-hover:opacity-100">Browse related articles and guides</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="relative overflow-hidden rounded-2xl border bg-background/30 p-8">
            <h3 className={cn('text-xl font-semibold', variant.default.text)}>Still have questions?</h3>
            <p className="mt-2 max-w-xl opacity-70">
              Our support team is ready to help you get the most out of the platform.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="/support" className={cn(
                buttonVariants({ variant: 'primary' }),
                'px-6 py-3',
                accentColor !== 'default' ? variant[accentColor].text : defaultVariant.text,
                accentColor !== 'default' ? variant[accentColor].hover : defaultVariant.hover,
                props.className
              )}>
                Contact Support
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="relative overflow-hidden rounded-2xl border bg-background/30 p-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className={cn('text-lg font-semibold', variant.default.text)}>Subscribe to our newsletter</h3>
            <p className="mt-1 opacity-70">Get the latest updates, tips, and resources delivered to your inbox.</p>
          </div>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <Input placeholder="Enter your email..." className="h-11 rounded-lg border-none bg-background/50 px-4 shadow-sm transition-all focus:bg-background focus:shadow-md" />
            <button type="submit" className={cn(
              buttonVariants({ variant: 'primary' }),
              'px-6 py-2.5',
              accentColor !== 'default' ? variant[accentColor].text : defaultVariant.text,
              accentColor !== 'default' ? variant[accentColor].hover : defaultVariant.hover,
              props.className
            )}>
              Subscribe
            </button>
          </form>
        </div>

        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-700 group-hover:opacity-10"
          style={{ background: 'linear-gradient(135deg, transparent 40%, rgba(var(--primary-hsl), 0.06) 100%)' }}
        />
