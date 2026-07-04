import { Metadata } from 'next'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { 
  CreditCard, 
  Lock, 
  Zap, 
  Globe, 
  ChevronRight, 
  Code2, 
  CheckCircle2,
  Terminal,
  ArrowRight,
  Copy
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Payments — Syntheon Docs',
  description: 'Integrate secure payment processing into your app with Syntheon Payments. Built for developers who demand reliability.',
  keywords: ['payments', 'checkout', 'api', 'integration'],
}

interface PaymentSectionProps {
  icon?: React.ReactNode
  title: string
  children: React.ReactNode
  variant?: 'default' | 'highlight'
}

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.15,
      ease: [0.23, 1, 0.32, 1],
    },
  }),
}

const codeVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: 'easeOut',
    },
  }),
}

const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded-md bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-colors"
      aria-label="Copy code"
    >
      {copied ? (
        <CheckCircle2 className="h-4 w-4 text-primary" />
      ) : (
        <Copy className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
  )
}

const Section = ({ icon, title, children, variant = 'default' }: PaymentSectionProps) => {
  const [ref, setRef] = useState<HTMLElement | null>(null)

  return (
    <motion.section
      ref={setRef}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      custom={0}
      className="mb-12 relative overflow-hidden rounded-xl border border-border bg-background/50 backdrop-blur-sm p-6 md:p-8"
    >
      <div className="flex items-start gap-4">
        {icon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex-shrink-0 p-2 rounded-lg bg-primary/10"
          >
            {icon}
          </motion.div>
        )}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            {title}
            {variant === 'highlight' && (
              <span className="inline-flex h-6 w-1 bg-primary rounded-full" />
            )}
          </h2>
          {children}
        </div>
      </div>
    </motion.section>
  )
}

const CodeBlock = ({ code, title }: { code: string; title?: string }) => {
  const [ref, setRef] = useState<HTMLElement | null>(null)

  return (
    <motion.pre
      ref={setRef}
      variants={codeVariants}
      initial="hidden"
      animate="visible"
      custom={0}
      className="relative overflow-hidden rounded-lg border border-border bg-muted/50 p-4 md:p-6 font-mono text-sm leading-relaxed"
    >
      {title && (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{title}</span>
          <CopyButton code={code} />
        </div>
      )}
      <code>{code}</code>
    </motion.pre>
  )
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ duration: 0.2 }}
    className="group p-5 rounded-xl border border-border bg-background/30 hover:bg-background transition-colors cursor-pointer"
  >
    <div className="flex items-start gap-4">
      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  </motion.div>
)

const QuickStart = () => {
  const [ref, setRef] = useState<HTMLElement | null>(null)

  return (
    <Section icon={<CreditCard className="h-6 w-6" />} title="Quick Start">
      <p className="text-muted-foreground mb-4">
        Integrate Syntheon Payments in minutes. No credit card required for development.
      </p>

      <div className="space-y-4">
        <CodeBlock
          title="Install SDK"
          code={`npm install @syntheon/payments

# Or with yarn
yarn add @syntheon/payments`}
        />

        <CodeBlock
          title="Initialize Client"
          code={`import { PaymentsClient } from '@syntheon/payments'

const client = new PaymentsClient({
  apiKey: process.env.NEXT_PUBLIC_SYNTHEON_API_KEY,
})

// Create a checkout session
await client.checkout.create({
  amount: 1000, // in cents
  currency: 'usd',
  items: [{ name: 'Premium Plan', quantity: 1 }],
})`}
        />

        <CodeBlock
          title="Handle Payment Result"
          code={`// In your API route or server action
import { client } from './lib/payments'

export async function POST(req: Request) {
  const body = await req.json()
  
  // Create checkout session
  const session = await client.checkout.create({
    amount: body.amount * 100,
    currency: 'usd',
    items: [{ name: body.productName, quantity: 1 }],
  })

  // Redirect to payment page
  return Response.redirect(session.url)
}`}
        />
      </div>
    </Section>
  )
}

const Features = () => {
  const [ref, setRef] = useState<HTMLElement | null>(null)

  return (
    <Section icon={<Zap className="h-6 w-6" />} title="Features">
      <div className="grid md:grid-cols-2 gap-3">
        <FeatureCard
          icon={
            <Lock className="h-5 w-5 text-primary" />
          }
          title="Enterprise Security"
          description="PCI-DSS Level 1 compliant. SOC 2 Type II certified. End-to-end encryption for all transactions."
        />

        <FeatureCard
          icon={
            <Globe className="h-5 w-5 text-primary" />
          }
          title="Global Payments"
          description="Accept payments in 135+ currencies with localized pricing, taxes, and compliance handling."
        />

        <FeatureCard
          icon={
            <Terminal className="h-5 w-5 text-primary" />
          }
          title="Developer Experience"
          description="TypeScript-first SDKs. Webhook signatures verified automatically. Comprehensive documentation and examples."
        />

        <FeatureCard
          icon={
            <ArrowRight className="h-5 w-5 text-primary" />
          }
          title="Flexible Integration"
          description="Headless checkout, embedded payments, or hosted pages. Choose the flow that fits your UX."
        />
      </div>
    </Section>
  )
}

const Pricing = () => {
  const [ref, setRef] = useState<HTMLElement | null>(null)

  return (
    <Section icon={
      <span className="text-2xl font-bold text-primary">
        $
      </span>
    } title="Pricing" variant="highlight">
      <p className="text-muted-foreground mb-6">
        Transparent pricing. No hidden fees. Scale as you grow.
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            name: 'Starter',
            price: '$0',
            description: 'Perfect for side projects and MVPs.',
            features: [
              'Up to 1,000 transactions/month',
              'Basic support via email',
              'All currencies supported',
              'Standard checkout pages',
            ],
          },
          {
            name: 'Growth',
            price: '$49',
            description: 'For growing businesses and startups.',
            features: [
              'Up to 10,000 transactions/month',
              'Priority email support',
              'Custom checkout branding',
              'Webhooks for real-time updates',
            ],
          },
          {
            name: 'Enterprise',
            price: 'Custom',
            description: 'For high-volume and complex needs.',
            features: [
              'Unlimited transactions',
              'Dedicated success manager',
              'Custom integrations',
              'SLA-backed uptime guarantees',
            ],
          },
        ].map((plan, i) => (
          <motion.div
            key={plan.name}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            custom={i + 3}
            className="relative p-6 rounded-xl border border-border bg-background/40 hover:bg-background transition-colors cursor-pointer group"
          >
            <h3 className="text-lg font-semibold text-foreground mb-1">{plan.name}</h3>
            <p className="text-2xl font-bold text-primary mb-2">{plan.price}</p>
            <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

            <ul className="space-y-2">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-border/50">
              <button className="w-full py-2 px-4 rounded-lg bg-background border border-border text-sm font-medium hover:bg-primary/10 transition-colors group-hover:border-primary/30">
                Get started
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

const Faq = () => {
  const [ref, setRef] = useState<HTMLElement | null>(null)

  return (
    <Section icon={
      <span className="text-xl font-bold text-primary">?</span>
    } title="Frequently Asked Questions">
      <div className="space-y-4">
        {[
          {
            question: 'How do I get started with Syntheon Payments?',
            answer: 'Sign up for a free account at syntheon.io. You\'ll receive your API key and documentation instantly. No credit card required.',
          },
          {
            question: 'What payment methods are supported out of the box?',
            answer: 'All major credit cards (Visa, Mastercard, Amex), digital wallets (Apple Pay, Google Pay), and 40+ local payment methods depending on your target regions.',
          },
          {
            question: 'Can I customize the checkout experience?',
            answer: 'Yes. Use our hosted checkout pages for quick setup, or embed our JavaScript snippet to create a fully branded, headless checkout flow that matches your design system.',
          },
          {
            question: 'What happens if a payment fails?',
            answer: 'Webhooks notify you in real-time with detailed error codes. You can retry failed payments automatically using the `retry` method or redirect customers to complete their transaction manually.',
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            custom={i + 6}
            className="p-4 rounded-lg border border-border/50 bg-background/30"
          >
            <h4 className="font-medium text-foreground mb-2">{item.question}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
          </motion.div>
        ))}
      </div>

      <button className="mt-6 flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all">
        View all FAQs
        <ChevronRight className="h-4 w-4" />
      </button>
    </Section>
  )
}

const CTA = () => {
  const [ref, setRef] = useState<HTMLElement | null>(null)

  return (
    <motion.section
      ref={setRef}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      custom={10}
      className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/5 to-transparent p-8 md:p-12 text-center"
    >
      <div className="relative z-10">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Ready to integrate?
        </h3>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          Join thousands of developers building the next generation of digital products with Syntheon Payments.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="h-12 px-6 rounded-lg bg-primary text-background font-medium hover:bg-primary/90 transition-colors">
            Start building for free
          </button>
          <a href="#" className="h-12 px-6 rounded-lg bg-background border border-border text-foreground font-medium hover:bg-background/80 transition-colors flex items-center justify-center gap-2">
            Read the API docs
          </a>
        </div>
      </div>

      <motion.div
        className="absolute -inset-4 opacity-5 blur-3xl"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1.2 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
      </motion.div>
    </motion.section>
  )
}

export default function PaymentsPage() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress((window.scrollY / totalHeight) * 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const progress = useTransform(
    scrollProgress,
    [0, 100],
    ['Welcome to Syntheon Payments', 'Getting Started', 'Features & Pricing']
  )

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="min-h-screen bg-background"
    >
      {/* Progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-50"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrollProgress / 100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="h-full bg-primary/80 shadow-sm" />
      </motion.div>

      {/* Hero section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, y: -48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 max-w-3xl mx-auto px-6 text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-border mb-8"
          >
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">v2.0 is now live</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Payments, reimagined.
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Build beautiful checkout experiences with the developer-first payment platform. 
            Type-safe APIs, hosted components, and enterprise-grade security.
          </p>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-32">
          <motion.div
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 flex items-center justify-center gap-8 opacity-50"
            >
              <div className="h-16 w-16 rounded-xl bg-primary/5 border border-border" />
              <div className="h-16 w-16 rounded-xl bg-primary/5 border border-border" />
              <div className="h-16 w-16 rounded-xl bg-primary/5 border border-border" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
