import Stripe from 'stripe'

// Instance Stripe côté serveur uniquement
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export const STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID!

// Crée ou récupère le customer Stripe lié à un utilisateur
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  existingCustomerId?: string | null
): Promise<string> {
  if (existingCustomerId) {
    return existingCustomerId
  }

  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  })

  return customer.id
}
