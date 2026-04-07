import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { checkAIAccess } from "@/lib/ai-gate"

export async function GET() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const access = await checkAIAccess(user.id, "daily-brief")

  if (!access.allowed) {
    return NextResponse.json(
      { error: "Monthly limit reached", upgradeUrl: "/pricing" },
      { status: 402 }
    )
  }

  // TODO: replace with actual AI call
  return NextResponse.json({
    brief: "This is a placeholder daily brief. Connect your AI provider to generate real market summaries.",
    remaining: access.remaining,
    isPro: access.isPro,
  })
}
