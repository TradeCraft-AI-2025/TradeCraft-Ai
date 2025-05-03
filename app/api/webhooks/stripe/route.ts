import { NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { updateUserSubscription, recordSubscriptionEvent } from "@/lib/user-service"
import { trackServerEvent } from "@/lib/analytics"

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

          // Track server-side conversion
          trackServerEvent("checkout_completed", {
            user_email: customerEmail,
            plan_type: planType,
            amount: session.amount_total ? session.amount_total / 100 : 0,
            currency: session.currency?.toUpperCase() || "USD",
            is_new_customer: !session.customer_details?.address?.line1, // No address might indicate new customer
            customer_id: session.customer as string,
            session_id: session.id,
          })
        }
        break

      case "customer.subscription.created":
        const newSubscription = event.data.object as Stripe.Subscription
        const newCustomer = await stripe.customers.retrieve(newSubscription.customer as string)

        if (newCustomer.email) {
          const status = newSubscription.status === "active" ? "active" : "canceled"
          const expiresAt = newSubscription.current_period_end * 1000 // Convert to milliseconds

          await updateUserSubscription({
            email: newCustomer.email,
            status,
            subscriptionExpires: new Date(expiresAt),
            stripeCustomerId: newSubscription.customer as string,
          })

          await recordSubscriptionEvent({
            userId: newCustomer.email,
            type: "subscription_created",
            stripeEventId: event.id,
            metadata: {
              subscriptionId: newSubscription.id,
              status: newSubscription.status,
              currentPeriodEnd: newSubscription.current_period_end,
            },
          })

          // Track subscription created conversion
          trackServerEvent("subscription_created", {
            user_email: newCustomer.email,
            subscription_id: newSubscription.id,
            plan_name: "Pro Monthly",
            amount: (newSubscription.items.data[0]?.price.unit_amount || 0) / 100,
            currency: (newSubscription.items.data[0]?.price.currency || "usd").toUpperCase(),
            billing_interval: "monthly", // Adjust if you have other intervals
            status: newSubscription.status,
          })
        }
        break

      case "customer.subscription.updated":
        const updatedSubscription = event.data.object as Stripe.Subscription
        const updatedCustomer = await stripe.customers.retrieve(updatedSubscription.customer as string)

        if (updatedCustomer.email) {
          const status = updatedSubscription.status === "active" ? "active" : "canceled"
          const expiresAt = updatedSubscription.current_period_end * 1000 // Convert to milliseconds

          await updateUserSubscription({
            email: updatedCustomer.email,
            status,
            subscriptionExpires: new Date(expiresAt),
            stripeCustomerId: updatedSubscription.customer as string,
          })

          await recordSubscriptionEvent({
            userId: updatedCustomer.email,
            type: "subscription_updated",
            stripeEventId: event.id,
            metadata: {
              subscriptionId: updatedSubscription.id,
              status: updatedSubscription.status,
              currentPeriodEnd: updatedSubscription.current_period_end,
            },
          })

          // Track subscription update (renewal or change)
          if (updatedSubscription.cancel_at_period_end) {
            trackServerEvent("subscription_canceled", {
              user_email: updatedCustomer.email,
              subscription_id: updatedSubscription.id,
              cancellation_date: new Date(updatedSubscription.canceled_at || 0).toISOString(),
              effective_end_date: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
            })
          } else if (updatedSubscription.status === "active") {
            trackServerEvent("subscription_renewed", {
              user_email: updatedCustomer.email,
              subscription_id: updatedSubscription.id,
              renewal_date: new Date().toISOString(),
              next_renewal_date: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
              amount: (updatedSubscription.items.data[0]?.price.unit_amount || 0) / 100,
              currency: (updatedSubscription.items.data[0]?.price.currency || "usd").toUpperCase(),
            })
          }
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

          // Track subscription deletion
          trackServerEvent("subscription_deleted", {
            user_email: canceledCustomer.email,
            subscription_id: canceledSubscription.id,
            deletion_date: new Date().toISOString(),
            reason: canceledSubscription.cancellation_details?.reason || "unknown",
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
