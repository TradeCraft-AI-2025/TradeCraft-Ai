import type { User, SubscriptionEvent } from "./db-types"

// In a real app, you would use a database like MongoDB, PostgreSQL, or Supabase
// For this example, we'll use a simple in-memory store
const users: Record<string, User> = {}
const events: SubscriptionEvent[] = []

export async function findUserByEmail(email: string): Promise<User | null> {
  return users[email] || null
}

export async function createUser(userData: Partial<User>): Promise<User> {
  if (!userData.email) {
    throw new Error("Email is required")
  }

  const now = new Date()
  const user: User = {
    id: Math.random().toString(36).substring(2, 15),
    email: userData.email,
    name: userData.name,
    subscriptionStatus: "none",
    createdAt: now,
    updatedAt: now,
    ...userData,
  }

  users[userData.email] = user
  return user
}

export async function updateUserSubscription(data: {
  email: string
  status: User["subscriptionStatus"]
  subscriptionExpires?: Date
  stripeCustomerId?: string
}): Promise<User> {
  let user = await findUserByEmail(data.email)

  if (!user) {
    // Create user if they don't exist
    user = await createUser({
      email: data.email,
      subscriptionStatus: data.status,
      subscriptionExpires: data.subscriptionExpires,
      stripeCustomerId: data.stripeCustomerId,
    })
  } else {
    // Update existing user
    user.subscriptionStatus = data.status
    if (data.subscriptionExpires) {
      user.subscriptionExpires = data.subscriptionExpires
    }
    if (data.stripeCustomerId) {
      user.stripeCustomerId = data.stripeCustomerId
    }
    user.updatedAt = new Date()
    users[data.email] = user
  }

  return user
}

export async function recordSubscriptionEvent(eventData: {
  userId: string
  type: SubscriptionEvent["type"]
  stripeEventId: string
  metadata: any
}): Promise<SubscriptionEvent> {
  const event: SubscriptionEvent = {
    id: Math.random().toString(36).substring(2, 15),
    userId: eventData.userId,
    type: eventData.type,
    stripeEventId: eventData.stripeEventId,
    metadata: eventData.metadata,
    createdAt: new Date(),
  }

  events.push(event)
  return event
}
