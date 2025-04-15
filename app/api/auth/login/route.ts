import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { findUserByEmail, createUser } from "@/lib/user-service"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // In a real app, you would verify the password
    // For this example, we'll just check if the user exists
    let user = await findUserByEmail(email)

    if (!user) {
      // For demo purposes, create the user if they don't exist
      user = await createUser({ email })
    }

    // Set a cookie to "authenticate" the user
    cookies().set("user_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    // Don't return sensitive information
    const { id, email: userEmail, name, subscriptionStatus, subscriptionExpires, createdAt, updatedAt } = user

    return NextResponse.json({
      id,
      email: userEmail,
      name,
      subscriptionStatus,
      subscriptionExpires,
      createdAt,
      updatedAt,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
