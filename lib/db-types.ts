export interface User {
  id: string
  email: string
  name?: string
  title?: string
  experience?: string
  bio?: string
  tradingStyle?: string
  riskTolerance?: string
  subscriptionStatus: "none" | "active" | "lifetime" | "canceled" | "expired"
  subscriptionExpires?: Date
  stripeCustomerId?: string
  createdAt: Date
  updatedAt: Date
}

export interface SubscriptionEvent {
  id: string
  userId: string
  type: "subscription_created" | "subscription_updated" | "subscription_canceled" | "payment_succeeded"
  stripeEventId: string
  metadata: any
  createdAt: Date
}
