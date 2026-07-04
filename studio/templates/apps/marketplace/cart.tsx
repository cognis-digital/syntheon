'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { motion, useScroll, useInView, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Trash2, CreditCard, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ TOKENS & TYPES ============

interface CartItemProps {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  variant?: string
}

type CartState = {
  items: CartItem[]
  isOpen: boolean
  total: number
  subtotal: number
  tax: number
  shipping: number
  discount: number
  appliedCode: string | null
}

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  applyCode: (code: string) => Promise<boolean>
  clearCart: () => void
}

// ============ CONTEXT & HOOKS ============

const CartContext = createContext<CartContextType | null>(null)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within <CartProvider>')
  return context
}

// ============ COMPONENTS ============

function CartItem({ item }: { item: CartItem }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative flex gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors duration-300',
        isHovered ? 'shadow-lg shadow-violet-500/10' : ''
      )}
    >
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        {item.variant && (
          <span className="absolute top-1 left-1 text-[9px] px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm">
            {item.variant}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className={cn('font-medium truncate', item.variant ? 'text-base' : 'text-lg')}>
          {item.name}
        </h3>
        {item.variant && (
          <p className="text-sm text-muted-foreground">{item.variant}</p>
        )}

        <div className={cn(
          'flex items-center justify-between mt-2',
          isHovered ? 'opacity-100' : 'opacity-60 group-hover:opacity-100 transition-opacity'
        )}>
          <span className="font-semibold">
            ${item.price.toFixed(2)} × {item.quantity}
          </span>

          <div className={cn(
            'flex items-center gap-3',
            isHovered ? 'opacity-100' : 'opacity-60 group-hover:opacity-100 transition-opacity'
          )}>
            <button
              onClick={() => {
                const ctx = useCart()
                if (ctx) ctx.updateQuantity(item.id, item.quantity - 1)
              }}
              className="p-2 rounded-full hover:bg-border transition-colors"
              aria-label={`Decrease ${item.name} quantity`}
            >
              <ChevronRight className="w-4 h-4 rotate-[-90deg]" />
            </button>

            <span className={cn(
              'w-8 text-center font-medium',
              item.quantity === 1 ? 'text-primary' : ''
            )}>
              {item.quantity}
            </span>

            <button
              onClick={() => {
                const ctx = useCart()
                if (ctx) ctx.updateQuantity(item.id, item.quantity + 1)
              }}
              className="p-2 rounded-full hover:bg-border transition-colors"
              aria-label={`Increase ${item.name} quantity`}
            >
              <ChevronRight className="w-4 h-4 rotate-90deg" />
            </button>

            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                const ctx = useCart()
                if (ctx) ctx.removeItem(item.id)
              }}
              className="p-2 rounded-full hover:bg-red-500/10 text-red-600 transition-colors"
              aria-label={`Remove ${item.name} from cart`}
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {isHovered && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-2 right-2 text-xs bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border"
        >
          <span className="font-medium">Total: ${(item.price * item.quantity).toFixed(2)}</span>
        </motion.div>
      )}
    </motion.div>
  )
}

function CartSummary() {
  const ctx = useCart()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const t = setTimeout(() => setIsAnimating(false), 300)
    return () => clearTimeout(t)
  }, [ctx.total])

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="bg-background border border-border rounded-2xl p-6 shadow-xl shadow-violet-500/5"
    >
      <h2 className={cn('text-lg font-semibold mb-4', isAnimating ? 'animate-fade-in' : '')}>
        Order Summary
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">${ctx.subtotal.toFixed(2)}</span>
        </div>
        {ctx.discount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center"
          >
            <span className="text-muted-foreground">Discount</span>
            <div className={cn(
              'flex items-center gap-2',
              ctx.discount > 5 ? 'text-green-600' : ''
            )}>
              <Sparkles className="w-3 h-3" />
              <span>-${ctx.discount.toFixed(2)}</span>
            </div>
          </motion.div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax (8%)</span>
          <span className="font-medium">${(ctx.subtotal * 0.08).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className={cn('font-medium', ctx.shipping === 0 ? 'text-green-600' : '')}>
            ${ctx.shipping.toFixed(2)}
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={cn(
          'flex justify-between items-center pt-4 border-t border-border mt-4',
          isAnimating ? 'animate-fade-in' : ''
        )}
      >
        <span className="font-semibold text-lg">Total</span>
        <span className={cn('text-2xl font-bold tracking-tight', ctx.total === 0 ? 'text-muted-foreground' : '')}>
          ${ctx.total.toFixed(2)}
        </span>
      </motion.div>

      {ctx.appliedCode && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-green-600 mt-3"
        >
          Code "{ctx.appliedCode}" applied successfully.
        </motion.p>
      )}

      {ctx.total === 0 && ctx.items.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Your cart is empty. Add items to see the total.
        </p>
      )}
    </motion.div>
  )
}

function CheckoutButton() {
  const ctx = useCart()
  const [isProcessing, setIsProcessing] = useState(false)

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        setIsProcessing(true)
        // Simulate checkout
        setTimeout(() => setIsProcessing(false), 1500)
      }}
      disabled={ctx.total === 0 || isProcessing}
      className={cn(
        'w-full py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-3',
        ctx.total > 0 && !isProcessing ? 
          'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-violet-500/25' :
          'bg-muted text-muted-foreground cursor-not-allowed'
      )}
    >
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, scale: 1.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-5 h-5 border-2 border-white/30 rounded-full"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-full h-full border-t-2 border-white/60 rounded-full"
            />
          </motion.div>
        )}
        {!isProcessing && ctx.total > 0 && (
          <CreditCard className="w-5 h-5" />
        )}
      </AnimatePresence>

      {ctx.total > 0 && !isProcessing ? 'Checkout' : isProcessing ? 'Processing...' : 'Add items first'}
    </motion.button>
  )
}

function DiscountCodeInput() {
  const ctx = useCart()
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={(e) => {
          setCode(e.target.value.toUpperCase())
          if (!error) setError(false)
        }}
        placeholder="Enter promo code..."
        maxLength={10}
        className={cn(
          'flex-1 px-4 py-3 rounded-xl border bg-background text-sm',
          error ? 'border-red-500 focus:ring-red-200' : 
            'border-border focus:border-primary/50 focus:ring-violet-200'
        )}
      />

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={async () => {
          const success = await ctx.applyCode(code)
          if (!success) setError(true)
          else setCode('')
        }}
        disabled={!code || error}
        className={cn(
          'px-6 py-3 rounded-xl font-medium text-sm whitespace-nowrap',
          code && !error ? 
            'bg-primary hover:bg-primary/90 text-primary-foreground' :
            'bg-muted text-muted-foreground cursor-not-allowed'
        )}
      >
        Apply Code
      </motion.button>

      {ctx.appliedCode && (
        <button
          onClick={() => ctx.applyCode('')}
          className="text-xs px-3 py-2 rounded-lg hover:bg-border transition-colors"
        >
          Remove
        </button>
      )}
    </div>
  )
}

// ============ MAIN COMPONENT ============

export interface CartPageProps {
  initialItems?: CartItem[]
  className?: string
}

export default function CartPage({ 
  initialItems = [], 
  className 
}: CartPageProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems)
  const [isOpen, setIsOpen] = useState(true)
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discount = ctx.appliedCode ? parseFloat(ctx.appliedCode.replace(/[^0-9.]/g, '')) : 0
  
  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Hero section with parallax effect */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative h-48 md:h-64 bg-gradient-to-b from-violet-900/20 to-transparent"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-6xl md:text-7xl font-bold text-primary/10"
          >
            {items.length}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute bottom-4 left-6 md:left-8"
        >
          <h1 className={cn(
            'text-2xl md:text-3xl font-bold text-primary',
            items.length === 0 ? 'text-muted-foreground' : ''
          )}>
            {items.length === 0 ? 'Your Cart' : 'Continue Shopping'}
          </h1>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          aria-label="Close cart"
        >
          <ChevronRight className="w-6 h-6 rotate-[-90deg]" />
        </motion.button>
      </motion.div>

      {/* Main content */}
      <div className="px-4 md:px-8 py-6">
        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <motion.div
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-32 h-32 mb-8 rounded-full bg-muted flex items-center justify-center"
              >
                <ShoppingCart className="w-12 h-12 text-muted-foreground/50" />
              </motion.div>

              <h2 className={cn(
                'text-xl md:text-2xl font-semibold mb-3',
                items.length === 0 ? 'text-muted-foreground' : ''
              )}>
                {items.length === 0 ? 'Your cart is empty' : 'Ready to checkout!'}
              </h2>

              <p className="max-w-md text-sm md:text-base text-muted-foreground mb-8">
                {items.length === 0 
                  ? 'Start adding items from the marketplace. You can always come back.' 
                  : 'Review your selections and proceed to secure checkout.'}
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
              >
                Continue Shopping
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Items column */}
              <div className={cn(
                'lg:col-span-3',
                items.length === 1 ? '' : 'space-y-3'
              )}>
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <CartItem item={item} />
                  </motion.div>
                ))}
              </div>

              {/* Summary column */}
              <div className="lg:col-span-1">
                <CartSummary />
                
                {subtotal > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4"
                  >
                    <DiscountCodeInput />
                  </motion.div>
                )}

                <div className={cn(
                  'mt-6',
                  subtotal > 0 ? '' : 'opacity-50'
                )}>
                  <CheckoutButton />
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating cart indicator */}
      {isOpen && items.length > 0 && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-background/90 backdrop-blur-md border border-border px-4 py-3 rounded-full shadow-xl shadow-violet-500/20"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
          >
