import type { cookies } from "next/headers"
import type { User } from "./db-types"
import { findUserByEmail } from "./user-service"

export async function getUserFromCookie(cookieStore: ReturnType<typeof cookies>): Promise<User | null> {
  const userEmail = cookieStore.get("user_email")?.value

  if (!userEmail) {
    return null
  }

  const user = await findUserByEmail(userEmail)

  return user || null
}
