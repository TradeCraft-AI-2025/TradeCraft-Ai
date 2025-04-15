import { NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { updateUserSubscription, recordSubscriptionEvent } from "@/lib/user-service"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get("stripe-signature") || ""

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret!)
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature verification failed` }, { status: 400 })
  }

  try {
    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session

        // Get customer email and metadata
        const customerEmail = session.customer_details?.email
        const planType = session.metadata?.planType

        if (customerEmail) {
          // Update user subscription status
          if (planType === "lifetime") {
            await updateUserSubscription({
              email: customerEmail,
              status: "lifetime",
              stripeCustomerId: session.customer as string,
            })
          } else if (planType === "subscription") {
            // For subscriptions, we'll get more details from the subscription events
            await updateUserSubscription({
              email: customerEmail,
              status: "active",
              stripeCustomerId: session.customer as string,
            })
          }

          // Record the event
          await recordSubscriptionEvent({
            userId: customerEmail, // Using email as user ID for simplicity
            type: "payment_succeeded",
            stripeEventId: event.id,
            metadata: {
              sessionId: session.id,
              planType,
              amount: session.amount_total,
            },
          })
        }
        break

      case "customer.subscription.created":
      case "customer.subscription.updated":
        const subscription = event.data.object as Stripe.Subscription
        const customer = await stripe.customers.retrieve(subscription.customer as string)

        if (customer.email) {
          const status = subscription.status === "active" ? "active" : "canceled"
          const expiresAt = subscription.current_period_end * 1000 // Convert to milliseconds

          await updateUserSubscription({
            email: customer.email,
            status,
            subscriptionExpires: new Date(expiresAt),
            stripeCustomerId: subscription.customer as string,
          })

          await recordSubscriptionEvent({
            userId: customer.email,
            type: "subscription_updated",
            stripeEventId: event.id,
            metadata: {
              subscriptionId: subscription.id,
              status: subscription.status,
              currentPeriodEnd: subscription.current_period_end,
            },
          })
        }
        break

      case "customer.subscription.deleted":
        const canceledSubscription = event.data.object as Stripe.Subscription
        const canceledCustomer = await stripe.customers.retrieve(canceledSubscription.customer as string)

        if (canceledCustomer.email) {
          await updateUserSubscription({
            email: canceledCustomer.email,
            status: "canceled",
            stripeCustomerId: canceledSubscription.customer as string,
          })

          await recordSubscriptionEvent({
            userId: canceledCustomer.email,
            type: "subscription_canceled",
            stripeEventId: event.id,
            metadata: {
              subscriptionId: canceledSubscription.id,
            },
          })
        }
        break
    }
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Error processing webhook" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
