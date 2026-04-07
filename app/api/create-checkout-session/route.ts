import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createServerSupabaseClient } from "@/lib/supabase"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

export async function POST(req: Request) {
  try {
    const { plan, email, baseUrl } = await req.json()

    const origin = baseUrl || process.env.NEXT_PUBLIC_BASE_URL || `https://${process.env.VERCEL_URL}`

    if (!plan) {
      return NextResponse.json({ error: "Missing required field: plan" }, { status: 400 })
    }

    if (!email) {
      return NextResponse.json({ error: "Missing required field: email" }, { status: 400 })
    }

    let priceId: string | undefined
    let mode: "subscription" | "payment"

    if (plan === "subscription") {
      priceId = process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID
      mode = "subscription"
    } else if (plan === "lifetime") {
      priceId = process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID
      mode = "payment"
    } else {
      return NextResponse.json({ error: "Invalid plan type. Must be 'subscription' or 'lifetime'" }, { status: 400 })
    }

    if (!priceId) {
      console.error(`Missing price ID for plan: ${plan}`)
      return NextResponse.json({ error: "Server configuration error: Missing price ID" }, { status: 500 })
    }

    // Get the authenticated user for metadata
    let userId: string | undefined
    try {
      const supabase = createServerSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id
    } catch {
      // Session may not exist — continue without user_id
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode,
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
      customer_email: email,
      metadata: {
        plan,
        ...(userId && { user_id: userId }),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("Stripe checkout error:", error)

    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
