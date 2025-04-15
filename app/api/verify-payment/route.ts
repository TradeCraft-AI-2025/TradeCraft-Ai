import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("session_id")

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id parameter" }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // In a real application, you would:
    // 1. Verify the payment status
    // 2. Update the user's subscription status in your database
    // 3. Return the necessary information to the client

    return NextResponse.json({
      success: true,
      planType: session.metadata?.planType || "unknown",
      customerEmail: session.customer_details?.email,
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Error verifying payment" }, { status: 500 })
  }
}
