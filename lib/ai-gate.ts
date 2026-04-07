import { createServerSupabaseClient } from "@/lib/supabase"

const FREE_LIMIT = 5

export async function checkAIAccess(
  userId: string,
  action: string
): Promise<{ allowed: boolean; remaining: number; isPro: boolean }> {
  const supabase = createServerSupabaseClient()

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", userId)
    .single()

  if (sub && sub.plan === "pro" && sub.status === "active") {
    return { allowed: true, remaining: -1, isPro: true }
  }

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from("ai_usage")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("action", action)
    .gte("created_at", startOfMonth.toISOString())

  const used = count ?? 0

  if (used >= FREE_LIMIT) {
    return { allowed: false, remaining: 0, isPro: false }
  }

  await supabase
    .from("ai_usage")
    .insert({ user_id: userId, action })

  return { allowed: true, remaining: FREE_LIMIT - 1 - used, isPro: false }
}
