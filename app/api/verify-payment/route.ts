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
    // Log for debugging in test mode
    console.log(`Verifying payment session: ${sessionId}`)

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "payment_intent", "subscription"],
    })

    // Log what we received back
    console.log(`Session status: ${session.status}`)
    console.log(`Payment status: ${session.payment_status}`)

    // Validate the payment was successful
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        {
          error: `Payment not completed. Status: ${session.payment_status}`,
        },
        { status: 400 },
      )
    }

    // In a real application, you would:
    // 1. Update the user's subscription status in your database
    // 2. Provision access to pro features
    // 3. Send a welcome/confirmation email

    return NextResponse.json({
      success: true,
      planType: session.metadata?.planType || "unknown",
      customerEmail: session.customer_details?.email,
      subscriptionId: session.subscription || null,
      paymentIntentId: session.payment_intent || null,
    })
  } catch (error: any) {
    console.error("Error verifying payment:", error)
    return NextResponse.json(
      {
        error: "Error verifying payment",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
