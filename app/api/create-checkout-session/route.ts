import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

// Define default test price IDs to use when the environment variables are not set
const DEFAULT_TEST_SUBSCRIPTION_PRICE_ID = "price_1OqXXXXXXXXXXXXXXXXXXXXX" // Replace with a valid test price ID
const DEFAULT_TEST_LIFETIME_PRICE_ID = "price_1OqYYYYYYYYYYYYYYYYYYYYY" // Replace with a valid test price ID

export async function POST(request: Request) {
  try {
    const { planType, email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // For test mode, we'll log what's happening
    console.log(`Creating checkout session for ${email} with plan type: ${planType}`)

    // Get the price IDs from environment variables or use defaults for testing
    const subscriptionPriceId = process.env.STRIPE_SUBSCRIPTION_PRICE_ID || DEFAULT_TEST_SUBSCRIPTION_PRICE_ID
    const lifetimePriceId = process.env.STRIPE_LIFETIME_PRICE_ID || DEFAULT_TEST_LIFETIME_PRICE_ID

    console.log(`Using environment variables:
      - DOMAIN: ${process.env.DOMAIN}
      - STRIPE_SUBSCRIPTION_PRICE_ID: ${subscriptionPriceId}
      - STRIPE_LIFETIME_PRICE_ID: ${lifetimePriceId}
    `)

    // Set up the line items based on the selected plan
    const lineItems = []

    if (planType === "subscription") {
      // For subscription, use the price ID from your Stripe dashboard or the default test ID
      lineItems.push({
        price: subscriptionPriceId,
        quantity: 1,
      })
    } else if (planType === "lifetime") {
      // For one-time payment
      lineItems.push({
        price: lifetimePriceId,
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
