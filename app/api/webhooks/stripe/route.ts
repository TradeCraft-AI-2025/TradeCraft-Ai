import { NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get("stripe-signature") || ""

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        if (userId) {
          await supabaseAdmin.from("subscriptions").upsert(
            {
              user_id: userId,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              status: "active",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          )
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await supabaseAdmin
          .from("subscriptions")
          .update({ status: "canceled", updated_at: new Date().toISOString() })
          .eq("stripe_subscription_id", subscription.id)
        break
      }
    }
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Error processing webhook" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
