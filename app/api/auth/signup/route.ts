import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { findUserByEmail, createUser } from "@/lib/user-service"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email)

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Create new user
    const user = await createUser({ email, name })

    // Set a cookie to "authenticate" the user
    cookies().set("user_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    // Don't return sensitive information
    const { id, email: userEmail, name: userName, subscriptionStatus, subscriptionExpires, createdAt, updatedAt } = user

    return NextResponse.json({
      id,
      email: userEmail,
      name: userName,
      subscriptionStatus,
      subscriptionExpires,
      createdAt,
      updatedAt,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
