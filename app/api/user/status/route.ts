import { NextResponse } from "next/server"
import Stripe from "stripe"
import { cookies } from "next/headers"
import { getUserFromCookie } from "@/lib/auth"

export async function GET() {
  try {
    // Get the user from the cookie
    const cookieStore = cookies()
    const user = await getUserFromCookie(cookieStore)

    if (!user || !user.email) {
      return NextResponse.json({ isPro: false }, { status: 401 })
    }

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    })

    // Search for customers with the user's email
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    })

    if (customers.data.length === 0) {
      return NextResponse.json({ isPro: false })
    }

    const customer = customers.data[0]

    // Get active subscriptions for the customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 100,
    })

    // Check if the user has any active subscriptions
    const isPro = subscriptions.data.length > 0

    // Return the subscription status
    return NextResponse.json({ isPro })
  } catch (error) {
    console.error("Error checking subscription status:", error)
    return NextResponse.json({ error: "Failed to check subscription status" }, { status: 500 })
  }
}
