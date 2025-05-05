import { NextResponse } from "next/server"
import Stripe from "stripe"

// Debug environment variables
console.log({
  STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
  priceMonthly: process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID,
  base: process.env.NEXT_PUBLIC_BASE_URL,
})

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

export async function POST(req: Request) {
  try {
    // Parse the request body to get plan, email, and baseUrl
    const { plan, email, baseUrl } = await req.json()

    // Validate required fields
    if (!plan) {
      return NextResponse.json({ error: "Missing required field: plan" }, { status: 400 })
    }

    if (!email) {
      return NextResponse.json({ error: "Missing required field: email" }, { status: 400 })
    }

    // Determine the origin URL to use for redirects
    const origin =
      baseUrl || process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "")

    // Determine the price ID based on the plan type
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

    // Validate that we have a price ID
    if (!priceId) {
      console.error(`Missing price ID for plan: ${plan}`)
      return NextResponse.json({ error: "Server configuration error: Missing price ID" }, { status: 500 })
    }

    // Validate that we have a base URL
    if (!origin) {
      console.error("Missing base URL from all possible sources")
      return NextResponse.json({ error: "Server configuration error: Missing base URL" }, { status: 500 })
    }

    // Create the checkout session with updated success and cancel URLs
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
      },
    })

    // Return the checkout session URL
    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    // Log the error for debugging
    console.error("Error creating checkout session:", error)

    // Return an error response
    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
