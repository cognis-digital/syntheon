'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export interface CheckoutState {
  step: 'summary' | 'shipping' | 'payment' | 'processing' | 'success'
  loading: boolean
  error: string | null
}

interface LineItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
  image?: string
}

export interface CheckoutFlowProps {
  items: LineItem[]
  subtotal: number
  taxRate: number
  shippingCost: number
  discountCode?: string | null
  onApplyDiscount: (code: string) => Promise<boolean>
  onSuccess: () => void
  onError: (message: string) => void
}

const violetHSL = {
  primary: 'hsl(270, 85%, 60%)',
  secondary: 'hsl(270, 75%, 50%)',
  accent: 'hsl(270, 90%, 45%)'
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

export default function CheckoutFlow({
  items,
  subtotal,
  taxRate,
  shippingCost,
  discountCode = null,
  onApplyDiscount,
  onSuccess,
  onError
}: CheckoutFlowProps) {
  const [state, setState] = useState<CheckoutState>({
    step: 'summary',
    loading: false,
    error: null
  })

  const taxAmount = (subtotal + shippingCost) * taxRate
  const discountAmount = discountCode ? parseFloat(discountCode.replace(/[^0-9.]/g, '')) || 0 : 0
  const total = subtotal + taxAmount + shippingCost - discountAmount

  const progress = state.step === 'processing' 
    ? 100 
    : items.length > 0 
      ? Math.min(30 * items.length, 85) 
      : 20

  const handleCheckout = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    if (state.step === 'processing') {
      onSuccess()
    } else {
      onError('Payment processing failed. Please try again.')
    }

    setState(prev => ({ 
      ...prev, 
      loading: false, 
      step: state.step === 'processing' ? 'success' : 'summary',
      error: null
    }))
  }

  const handleApplyDiscount = async (code: string) => {
    const valid = await onApplyDiscount(code)
    if (valid) {
      setState(prev => ({ ...prev, discountCode: code }))
    } else {
      onError('Invalid or expired discount code')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card className="border-border/50 shadow-xl bg-background/95 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between mb-6">
            <div>
              <CardTitle className="text-primary font-semibold text-lg">
                {state.step === 'processing' ? 'Processing Payment' : 
                 state.step === 'success' ? 'Order Confirmed!' : 
                 'Secure Checkout'}
              </CardTitle>
              <CardDescription className="text-muted-foreground/80">
                Complete your purchase securely
              </CardDescription>
            </div>
            
            {state.step !== 'summary' && state.step !== 'success' && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="h-2 bg-primary rounded-full overflow-hidden"
              >
                <div 
                  className="h-full bg-white/30 rounded-full"
                  style={{ width: `${100 - progress}%` }}
                />
              </motion.div>
            )}

            {state.step === 'success' && (
              <Badge variant="secondary" className="ml-4">
                ✓ Complete
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-0">
          {/* Order Summary */}
          {(state.step === 'summary' || state.step === 'processing') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-muted/30 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              {discountCode && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between text-sm py-2"
                >
                  <span className="text-primary/80">Discount Applied</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {formatCurrency(discountAmount)} off
                  </Badge>
                </motion.div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tax ({(taxRate * 100).toFixed(0)}%)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>

              {shippingCost > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatCurrency(shippingCost)}</span>
                </div>
              )}

              <Separator className="bg-border/50" />

              <div className="flex items-center justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(total)}</span>
              </div>
            </motion.div>
          )}

          {/* Shipping Form */}
          {(state.step === 'shipping' || state.step === 'payment') && (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="First name" defaultValue="John" />
                <Input placeholder="Last name" defaultValue="Doe" />
              </div>

              <Input 
                type="email" 
                placeholder="Email address" 
                defaultValue="john.doe@example.com"
              />

              <Input placeholder="Street address" defaultValue="123 Main St, Apt 4B" />

              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="City" defaultValue="San Francisco" />
                <Input placeholder="ZIP/Postal code" defaultValue="94102" />
              </div>

              <SelectCountry country="US" />
            </motion.form>
          )}

          {/* Payment Methods */}
          {(state.step === 'payment' || state.step === 'processing') && (
            <AnimatePresence mode="wait">
              {state.step !== 'processing' ? (
                <PaymentMethods onConfirm={() => setState(prev => ({ ...prev, step: 'processing' }))} />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center py-8"
                >
                  <div className="text-center space-y-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto" />
                    <p className="text-muted-foreground text-sm animate-pulse">Processing your secure payment...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Success State */}
          {state.step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg 
                    width="32" 
                    height="32" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={violetHSL.primary}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-primary mb-2">Order Confirmed!</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Thank you for your purchase. A confirmation email has been sent to 
                <strong className="text-foreground">john.doe@example.com</strong>.
              </p>

              <div className="bg-background/50 rounded-lg p-4 text-left max-w-md mx-auto mb-6">
                <h4 className="font-medium text-sm mb-2">Order Details:</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li><strong>Order #:</strong> {Math.random().toString(36).slice(8, 15).toUpperCase()}</li>
                  <li><strong>Date:</strong> {new Date().toLocaleDateString()}</li>
                  <li><strong>Total Paid:</strong> {formatCurrency(total)}</li>
                </ul>
              </div>

              <Button 
                onClick={() => setState(prev => ({ ...prev, step: 'summary' }))}
                className="w-full"
              >
                Continue Shopping
              </Button>
            </motion.div>
          )}

          {/* Action Buttons */}
          {(state.step === 'summary' || state.step === 'shipping') && (
            <div className="flex items-center justify-between pt-4">
              {discountCode ? (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mr-3">
                  Discount Applied
                </Badge>
              ) : null}

              <Button 
                onClick={handleCheckout}
                disabled={state.loading || total <= 0}
                size="lg"
                className="w-full md:w-auto px-8 py-6 bg-primary hover:bg-secondary text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
              >
                {state.loading ? (
                  <span className="flex items-center gap-2">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  </span>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="16" rx="2" />
                      <path d="M7 8h10" />
                      <path d="M9 12h6" />
                    </svg>
                    {state.step === 'summary' ? `Pay ${formatCurrency(total)}` : 
                     state.step === 'shipping' ? 'Review & Pay' : ''}
                  </>
                )}
              </Button>

              <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={violetHSL.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>SSL Encrypted</span>
              </div>
            </div>
          )}

          {/* Discount Code Input */}
          {(state.step === 'summary' || state.step === 'shipping') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 pt-2"
            >
              <Input 
                placeholder="Promo code"
                value={discountCode || ''}
                onChange={(e) => handleApplyDiscount(e.target.value)}
                maxLength={15}
                className="border-border/40 focus:border-primary focus:ring-primary/20"
              />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setState(prev => ({ ...prev, discountCode: null }))}
                disabled={!discountCode}
              >
                Remove
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ==================== SUB-COMPONENTS ====================

function SelectCountry({ country }: { country: string }) {
  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' }
  ]

  return (
    <div className="space-y-2">
      <Label htmlFor="country" className="text-sm">Country</Label>
      <select 
        id="country"
        value={country}
        onChange={(e) => {}}
        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
      >
        {countries.map(c => (
          <option key={c.code} value={c.code}>{c.name}</option>
        ))}
      </select>
    </div>
  )
}

function PaymentMethods({ onConfirm }: { onConfirm: () => void }) {
  const methods = [
    { id: 'card', icon: '💳', label: 'Credit/Debit Card' },
    { id: 'paypal', icon: '🅿️', label: 'PayPal' },
    { id: 'apple', icon: '', label: 'Apple Pay' }
  ]

  return (
    <div className="space-y-4">
      <Label>Select Payment Method</Label>
      
      <div className="grid gap-3">
        {methods.map((method) => (
          <motion.div
            key={method.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onConfirm()}
            className="flex items-center gap-3 p-4 bg-background border border-border/50 rounded-lg cursor-pointer hover:border-primary/50 transition-all duration-200 group"
          >
            <span className="text-2xl">{method.icon}</span>
            <div className="flex-1">
              <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                {method.label}
              </p>
              <p className="text-xs text-muted-foreground">
                Secure • Fast processing
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {(state.step as any).payment && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-border/40 mt-4">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={violetHSL.primary} strokeWidth="2">
                    <rect x="3" y="5" width="18" height="14" rx="2"/>
                    <path d="M7 9h10M7 13h6"/>
                  </svg>
                  Card details will be encrypted and transmitted securely
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Extend state for PaymentMethods component
CheckoutFlow.prototype = {
  step: 'payment' as const,
  loading: false,
  error: null as string | null
}

declare module 'react' {
  interface ComponentClass<P> {
    prototype?: P & Record<string, any>
  }
}
