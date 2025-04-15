import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { findUserByEmail } from "@/lib/user-service"

export async function GET() {
  // In a real app, you would verify a session token
  // For this example, we'll use a simple cookie
  const cookieStore = cookies()
  const userEmail = cookieStore.get("user_email")?.value

  if (!userEmail) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const user = await findUserByEmail(userEmail)

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Don't return sensitive information
  const { id, email, name, subscriptionStatus, subscriptionExpires, createdAt, updatedAt } = user

  return NextResponse.json({
    id,
    email,
    name,
    subscriptionStatus,
    subscriptionExpires,
    createdAt,
    updatedAt,
  })
}
