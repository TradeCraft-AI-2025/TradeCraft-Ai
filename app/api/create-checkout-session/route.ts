import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createServerSupabaseClient } from "@/lib/supabase"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

export async function POST() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const priceId = process.env.STRIPE_PRICE_PRO
  if (!priceId) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${origin}/portfolio?success=true`,
    cancel_url: `${origin}/pricing?canceled=true`,
    customer_email: user.email,
    metadata: { user_id: user.id },
  })

  return NextResponse.json({ url: session.url })
}
