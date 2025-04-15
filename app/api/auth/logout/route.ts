import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  // Clear the authentication cookie
  cookies().delete("user_email")

  return NextResponse.json({ success: true })
}
