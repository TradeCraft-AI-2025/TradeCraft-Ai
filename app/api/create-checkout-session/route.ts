import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

export async function POST(request: Request) {
  // Debug environment variables
  console.log({
    key: process.env.STRIPE_SECRET_KEY,
    priceId: process.env.TEST_STRIPE_SUBSCRIPTION_PRICE_ID,
    base: process.env.NEXT_PUBLIC_BASE_URL,
  })

  try {
    const { planType, email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // For test mode, we'll log what's happening
    console.log(`Creating checkout session for ${email} with plan type: ${planType}`)

    // Get the price IDs from the test environment variables
    const subscriptionPriceId = process.env.TEST_STRIPE_SUBSCRIPTION_PRICE_ID
    const lifetimePriceId = process.env.TEST_STRIPE_LIFETIME_SUBSCRIPTION_PRICE_ID

    console.log(`Using environment variables:
      - DOMAIN: ${process.env.DOMAIN}
      - TEST_STRIPE_SUBSCRIPTION_PRICE_ID: ${subscriptionPriceId}
      - TEST_STRIPE_LIFETIME_SUBSCRIPTION_PRICE_ID: ${lifetimePriceId}
    `)

    // Validate that we have the required price IDs
    if (!subscriptionPriceId || !lifetimePriceId) {
      console.error("Missing required Stripe price IDs in environment variables")
      return NextResponse.json({ error: "Server configuration error: Missing Stripe price IDs" }, { status: 500 })
    }

    // Set up the line items based on the selected plan
    const lineItems = []

    if (planType === "subscription") {
      // For subscription, use the test subscription price ID
      lineItems.push({
        price: subscriptionPriceId,
        quantity: 1,
      })
    } else if (planType === "lifetime") {
      // For one-time payment, use the test lifetime price ID
      lineItems.push({
        price: lifetimePriceId,
        quantity: 1,
      })
    } else {
      return NextResponse.json({ error: "Invalid plan type" }, { status: 400 })
    }

    // Ensure domain is properly set for redirects
    const domain =
      process.env.DOMAIN ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000")

    // Create the checkout session with proper configuration
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: planType === "subscription" ? "subscription" : "payment",
      success_url: `${domain}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/pricing?canceled=true`,
      customer_email: email,
      metadata: {
        planType,
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
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
