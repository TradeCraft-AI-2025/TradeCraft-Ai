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

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: planType === "subscription" ? "subscription" : "payment",
      success_url: `${process.env.DOMAIN}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}/pro`,
      customer_email: email,
      metadata: {
        planType,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 })
  }
}
