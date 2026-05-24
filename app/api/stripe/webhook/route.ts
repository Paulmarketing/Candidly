import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase'
import type Stripe from 'stripe'

// Important : désactiver le body parser de Next.js pour les webhooks Stripe
export const config = { api: { bodyParser: false } }

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Signature manquante' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    return NextResponse.json({ error: `Webhook invalide: ${message}` }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Récupère l'ID utilisateur Supabase depuis les metadata Stripe
  async function getUserIdFromCustomer(customerId: string): Promise<string | null> {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()
    return data?.id ?? null
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (!session.customer || !session.subscription) break

      const customerId = typeof session.customer === 'string' ? session.customer : session.customer.id
      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id

      const userId = await getUserIdFromCustomer(customerId)
      if (!userId) break

      await supabase
        .from('profiles')
        .update({
          is_pro: true,
          stripe_subscription_id: subscriptionId,
        })
        .eq('id', userId)
      break
    }

    case 'customer.subscription.deleted':
    case 'customer.subscription.paused': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer.id

      const userId = await getUserIdFromCustomer(customerId)
      if (!userId) break

      await supabase
        .from('profiles')
        .update({ is_pro: false, stripe_subscription_id: null })
        .eq('id', userId)
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer.id

      const userId = await getUserIdFromCustomer(customerId)
      if (!userId) break

      const isActive = subscription.status === 'active' || subscription.status === 'trialing'
      await supabase
        .from('profiles')
        .update({ is_pro: isActive })
        .eq('id', userId)
      break
    }

    default:
      // Événements non traités, on ignore
      break
  }

  return NextResponse.json({ received: true })
}
