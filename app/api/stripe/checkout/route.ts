import { NextRequest, NextResponse } from 'next/server'
import { stripe, getOrCreateStripeCustomer, STRIPE_PRO_PRICE_ID } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase'

// POST — crée une session Stripe Checkout pour l'abonnement Pro
export async function POST(req: NextRequest) {
  const { userId, email } = await req.json()

  if (!userId || !email) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Récupère le customer Stripe existant si présent
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single()

  const customerId = await getOrCreateStripeCustomer(userId, email, profile?.stripe_customer_id)

  // Sauvegarde le customer ID si nouveau
  if (!profile?.stripe_customer_id) {
    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', userId)
  }

  // Crée la session Checkout Stripe avec 14 jours d'essai
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: STRIPE_PRO_PRICE_ID,
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: 14,
      metadata: { supabase_user_id: userId },
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    locale: 'fr',
    allow_promotion_codes: true,
  })

  return NextResponse.json({ url: session.url })
}
