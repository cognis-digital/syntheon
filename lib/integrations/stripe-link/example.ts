export const EXAMPLES = {
  simple: `
    // Minimal example...
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
