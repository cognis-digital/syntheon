import { isConfigured } from '@/lib/integrations/stripe-link'
import type Stripe from 'stripe'

export const EXAMPLES = {
  simple: `
    // Minimal example: check if configured, then create a customer
    async function createCustomerExample() {
      if (!isConfigured()) return null
      
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
        
        // Create a customer with metadata
        const customer = await stripe.customers.create({
          name: 'New Customer',
          email: 'customer@example.com',
          metadata: {
            source: 'syntheon-example',
            tier: 'free'
          }
        })

        return { success: true, customerId: customer.id }
      } catch (error) {
        console.error('Customer creation failed:', error)
        return null
      }
    }
  `,

  checkoutFlow: `
    // Real-world flow: checkout with proper error handling and retries
    async function checkoutFlow(
      amount: number,
      currency = 'usd',
      metadata?: Record<string, string>
    ) {
      if (!isConfigured()) return null
      
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

      try {
        // 1. Create a checkout session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            price_data: {
              currency,
              product_name: 'Premium Plan',
              unit_amount: amount * 100, // Stripe uses cents
            },
            quantity: 1,
          }],
          mode: 'payment',
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
          metadata,
        })

        return { sessionId: session.id, url: session.url }
      } catch (error) {
        // Log and retry with exponential backoff for transient errors
        const maxRetries = 3
        let lastError: Error | null = null
        
        for (let attempt = 0; attempt < maxRetries; attempt++) {
          try {
            return await stripe.checkout.sessions.create({
              payment_method_types: ['card'],
              line_items: [{
                price_data: {
                  currency,
                  product_name: 'Premium Plan',
                  unit_amount: amount * 100,
                },
                quantity: 1,
              }],
              mode: 'payment',
              success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
              cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
              metadata,
            })
          } catch (retryError) {
            lastError = retryError as Error
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt))
          }
        }

        throw lastError || new Error('Checkout failed after all retries')
      }
    }
  `,

  subscriptionFlow: `
    // Subscription flow with proration and trial handling
    async function createSubscription(
      customerId: string,
      planId: string,
      trialDays?: number
    ) {
      if (!isConfigured()) return null
      
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

      try {
        // Create subscription with optional trial period
        const subscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [{ price: planId }],
          mode: 'subscription',
          payment_behavior: 'default_incomplete',
          billing_cycle_anchor: new Date().toISOString(),
          trial_period_days: trialDays || 0,
        })

        return { 
          subscriptionId: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end * 1000 // Convert to ms
        }
      } catch (error) {
        if ((error as Stripe.Error).code === 'customer_incomplete') {
          console.log('Customer needs payment method first:', error.message)
        }

        return null
      }
    }
  `,

  webhooks: `
    // Webhook handler example with signature verification
    async function handleWebhook(
      body: string,
      headers: HeadersInit,
      eventTypes: ('checkout.session.completed' | 'customer.subscription.updated')[]
    ) {
      if (!isConfigured()) return null
      
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

      try {
        // Verify signature
        let sig: string | undefined
        for (const [key, value] of Object.entries(headers)) {
          if (key.toLowerCase() === 'stripe-signature') {
            sig = value as string
            break
          }
        }

        if (!sig) throw new Error('Missing Stripe signature header')

        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
        let event: Stripe.Event | null = null

        try {
          event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
        } catch (err) {
          console.error('Webhook verification failed:', err)
          return { verified: false, error: 'Invalid signature' }
        }

        // Process only expected events
        if (!eventTypes.includes(event.type)) {
          console.log('Unexpected event type:', event.type)
          return { verified: true, processed: false }
        }

        // Handle the event
        switch (event.type) {
          case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session
            await handleCheckoutCompleted(session.id)
            break
          
          case 'customer.subscription.updated':
            const subscription = event.data.object as Stripe.Subscription
            await handleSubscriptionUpdated(subscription.id, subscription.status)
            break

          default:
            console.log('Unhandled but verified event:', event.type)
        }

        return { verified: true, processed: true }
      } catch (error) {
        console.error('Webhook handler error:', error)
        return { verified: false, error: 'Handler failed' }
      }
    }

    async function handleCheckoutCompleted(sessionId: string) {
      // Your checkout completion logic here
    }

    async function handleSubscriptionUpdated(subscriptionId: string, status: string) {
      // Your subscription update logic here
    }
  `
} as const

export type ExampleKey = keyof typeof EXAMPLES

// Helper to run examples safely in a test environment
export async function runExample(
  key: ExampleKey,
  envOverrides?: Record<string, unknown>
): Promise<unknown | null> {
  if (!isConfigured()) return null

  const exampleCode = EXAMPLES[key]
  
  // In production, you'd use a sandboxed execution environment
  // For now, this demonstrates the pattern:
  try {
    // Parse and execute (pseudo-code for illustration)
    // const result = await eval(exampleCode)
    
    return { key, code: exampleCode }
  } catch (error) {
    console.error(`Example '${key}' failed:`, error)
    return null
  }
}

// Export types for TypeScript consumers
export type ExampleResult = Awaited<ReturnType<typeof runExample>>
