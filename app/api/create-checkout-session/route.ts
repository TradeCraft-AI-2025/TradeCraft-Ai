import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

export async function POST(request: Request) {
  try {
    const { planType, email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // For test mode, we'll log what's happening
    console.log(`Creating checkout session for ${email} with plan type: ${planType}`)
    console.log(`Using environment variables:
      - DOMAIN: ${process.env.DOMAIN}
      - STRIPE_SUBSCRIPTION_PRICE_ID: ${process.env.STRIPE_SUBSCRIPTION_PRICE_ID}
      - STRIPE_LIFETIME_PRICE_ID: ${process.env.STRIPE_LIFETIME_PRICE_ID}
    `)

    // Set up the line items based on the selected plan
    const lineItems = []

    if (planType === "subscription") {
      // For subscription, use the price ID from your Stripe dashboard
      lineItems.push({
        price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID,
        quantity: 1,
      })
    } else if (planType === "lifetime") {
      // For one-time payment
      lineItems.push({
        price: process.env.STRIPE_LIFETIME_PRICE_ID,
        quantity: 1,
      })
    }

    // Ensure domain is properly set
    const domain =
      process.env.DOMAIN ||
      (process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000")

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: planType === "subscription" ? "subscription" : "payment",
      success_url: `${domain}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/checkout?plan=${planType}&email=${encodeURIComponent(email)}`,
      customer_email: email,
      metadata: {
        planType,
      },
      // Use test clock for testing subscriptions if needed
      // test_clock: test_clock_id, // Only if you're using test clocks
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      {
        error: "Error creating checkout session",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
